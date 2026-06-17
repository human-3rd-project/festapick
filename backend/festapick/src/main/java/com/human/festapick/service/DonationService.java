package com.human.festapick.service;

import com.human.festapick.constant.PaymentStatus;
import com.human.festapick.constant.UserRole;
import com.human.festapick.dto.request.PaymentConfirmReqDto;
import com.human.festapick.dto.response.DonationManageResDto;
import com.human.festapick.dto.response.DonationStatisticsResDto;
import com.human.festapick.entity.DonationPayments;
import com.human.festapick.entity.Donations;
import com.human.festapick.entity.Users;
import com.human.festapick.exception.CustomException;
import com.human.festapick.repository.DonationPaymentRepository;
import com.human.festapick.repository.DonationRepository;
import com.human.festapick.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.reactive.function.client.WebClient;

import java.nio.charset.StandardCharsets;
import java.time.LocalDateTime;
import java.time.OffsetDateTime;
import java.time.format.DateTimeParseException;
import java.util.Base64;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.Objects;
import java.util.regex.Pattern;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class DonationService {

    private static final int DEFAULT_DONATION_AMOUNT = 10_000;
    private static final Pattern ORDER_ID_PATTERN = Pattern.compile("^[A-Za-z0-9_-]{6,64}$");

    private final DonationRepository donationRepository;
    private final DonationPaymentRepository donationPaymentRepository;
    private final UserRepository userRepository;
    private final WebClient.Builder webClientBuilder;

    @Value("${toss.payments.secret-key:}")
    private String tossSecretKey;

    @Value("${toss.payments.confirm-url:https://api.tosspayments.com/v1/payments/confirm}")
    private String tossConfirmUrl;

    @Transactional
    public Donations applyDonation(Long userId, Integer amount) {
        Users user = getUser(userId);
        Integer donationAmount = amount == null ? DEFAULT_DONATION_AMOUNT : amount;

        if (donationAmount <= 0) {
            throw new CustomException(HttpStatus.BAD_REQUEST, "후원 금액은 0보다 커야 합니다.");
        }

        Donations donation = Donations.builder()
                .users(user)
                .amount(donationAmount)
                .build();

        return donationRepository.save(donation);
    }

    @Transactional
    public DonationPayments requestPayment(Long donationId, String orderId) {
        validateOrderId(orderId);

        if (donationPaymentRepository.existsByOrderId(orderId)) {
            throw new CustomException(HttpStatus.CONFLICT, "이미 사용된 주문번호입니다.");
        }

        Donations donation = getDonation(donationId);
        DonationPayments payment = DonationPayments.builder()
                .donations(donation)
                .orderId(orderId)
                .amount(donation.getAmount())
                .build();

        return donationPaymentRepository.save(payment);
    }

    @Transactional
    public DonationPayments confirmPayment(PaymentConfirmReqDto request) {
        DonationPayments payment = validatePayment(request);

        if (payment.getPaymentStatus() == PaymentStatus.DONE) {
            if (Objects.equals(payment.getPaymentKey(), request.getPaymentKey())) {
                return payment;
            }
            throw new CustomException(HttpStatus.CONFLICT, "이미 승인된 결제입니다.");
        }

        if (donationPaymentRepository.existsByPaymentKey(request.getPaymentKey())) {
            throw new CustomException(HttpStatus.CONFLICT, "이미 사용된 결제키입니다.");
        }

        Map<String, Object> tossPayment = requestTossConfirm(request);
        verifyTossPayment(request, tossPayment);

        String method = getStringValue(tossPayment, "method");
        LocalDateTime approvedAt = parseApprovedAt(getStringValue(tossPayment, "approvedAt"));

        payment.success(request.getPaymentKey(), method, request.getAmount(), approvedAt);
        payment.getDonations().complete();
        upgradeDonorRole(payment.getDonations().getUsers());

        return payment;
    }

    public DonationPayments verifyPayment(PaymentConfirmReqDto request) {
        return validatePayment(request);
    }

    @Transactional
    public DonationPayments savePaymentFailure(String orderId, String failReason) {
        DonationPayments payment = getPaymentByOrderId(orderId);
        payment.fail(failReason == null || failReason.isBlank() ? "결제 실패" : failReason);
        payment.getDonations().fail();
        return payment;
    }

    public DonationManageResDto getPaymentSuccessInfo(String orderId) {
        DonationPayments payment = getPaymentByOrderId(orderId);

        if (payment.getPaymentStatus() != PaymentStatus.DONE) {
            throw new CustomException(HttpStatus.BAD_REQUEST, "성공한 결제 내역이 아닙니다.");
        }

        return toDonationManageResDto(payment);
    }

    public DonationPayments getPaymentFailureInfo(String orderId) {
        DonationPayments payment = getPaymentByOrderId(orderId);

        if (payment.getPaymentStatus() != PaymentStatus.FAILED) {
            throw new CustomException(HttpStatus.BAD_REQUEST, "실패한 결제 내역이 아닙니다.");
        }

        return payment;
    }

    public Page<DonationManageResDto> getMyDonationHistory(Long userId, Pageable pageable) {
        return donationRepository.findByUsers_UserId(userId, pageable)
                .map(this::toDonationManageResDto);
    }

    public Page<DonationManageResDto> getDonationHistory(Long donationId, String keyword, Pageable pageable) {
        String normalizedKeyword = keyword == null || keyword.isBlank() ? null : keyword.trim();

        if (donationId != null) {
            return donationRepository.findById(donationId)
                    .filter(donation -> matchesKeyword(donation, normalizedKeyword))
                    .map(donation -> new PageImpl<>(List.of(toDonationManageResDto(donation)), pageable, 1))
                    .orElseGet(() -> new PageImpl<>(List.of(), pageable, 0));
        }

        if (normalizedKeyword == null) {
            return donationRepository.findAll(pageable)
                    .map(this::toDonationManageResDto);
        }

        List<DonationManageResDto> filteredDonations = donationRepository.findAll()
                .stream()
                .filter(donation -> matchesKeyword(donation, normalizedKeyword))
                .map(this::toDonationManageResDto)
                .toList();

        return toPage(filteredDonations, pageable);
    }

    public Page<DonationManageResDto> searchDonationHistory(String keyword, Pageable pageable) {
        String normalizedKeyword = keyword == null || keyword.isBlank() ? null : keyword.trim();

        if (normalizedKeyword == null) {
            return donationRepository.findAll(pageable)
                    .map(this::toDonationManageResDto);
        }

        return donationRepository.searchAdminDonations(
                        toLikePattern(normalizedKeyword),
                        parseLong(normalizedKeyword),
                        parseInteger(normalizedKeyword),
                        pageable
                )
                .map(this::toDonationManageResDto);
    }

    public DonationStatisticsResDto getDonationStatistics() {
        return DonationStatisticsResDto.builder()
                .totalDonationAmount(donationRepository.getTotalDonationAmount())
                .totalDonorCount(donationRepository.getDonorCount())
                .build();
    }

    @Transactional
    public void cancelDonation(Long donationId) {
        Donations donation = getDonation(donationId);
        donation.cancel();
        donationPaymentRepository.findByDonations_DonationId(donationId)
                .ifPresent(DonationPayments::cancel);
    }

    private DonationPayments validatePayment(PaymentConfirmReqDto request) {
        if (request == null) {
            throw new CustomException(HttpStatus.BAD_REQUEST, "결제 승인 요청 정보가 없습니다.");
        }

        DonationPayments payment = getPaymentByOrderId(request.getOrderId());

        if (!Objects.equals(payment.getAmount(), request.getAmount())) {
            throw new CustomException(HttpStatus.BAD_REQUEST, "결제 금액이 일치하지 않습니다.");
        }

        if (request.getPaymentKey() == null || request.getPaymentKey().isBlank()) {
            throw new CustomException(HttpStatus.BAD_REQUEST, "paymentKey는 필수입니다.");
        }

        if (request.getPaymentKey().length() > 100) {
            throw new CustomException(HttpStatus.BAD_REQUEST, "paymentKey는 100자 이하여야 합니다.");
        }

        return payment;
    }

    private Map<String, Object> requestTossConfirm(PaymentConfirmReqDto request) {
        if (tossSecretKey == null || tossSecretKey.isBlank()) {
            throw new CustomException(HttpStatus.INTERNAL_SERVER_ERROR, "토스페이먼츠 시크릿 키가 설정되지 않았습니다.");
        }

        String authorization = "Basic " + Base64.getEncoder()
                .encodeToString((tossSecretKey + ":").getBytes(StandardCharsets.UTF_8));

        return webClientBuilder.build()
                .post()
                .uri(normalizeConfirmUrl())
                .header(HttpHeaders.AUTHORIZATION, authorization)
                .contentType(MediaType.APPLICATION_JSON)
                .bodyValue(request)
                .retrieve()
                .onStatus(
                        status -> status.is4xxClientError() || status.is5xxServerError(),
                        response -> response.bodyToMono(String.class)
                                .defaultIfEmpty("")
                                .map(body -> new CustomException(
                                        HttpStatus.valueOf(response.statusCode().value()),
                                        "토스 결제 승인 실패: " + body
                                ))
                )
                .bodyToMono(new ParameterizedTypeReference<Map<String, Object>>() {})
                .block();
    }

    private void verifyTossPayment(PaymentConfirmReqDto request, Map<String, Object> tossPayment) {
        if (tossPayment == null) {
            throw new CustomException(HttpStatus.BAD_GATEWAY, "토스 결제 승인 응답이 없습니다.");
        }

        if (!Objects.equals(request.getPaymentKey(), getStringValue(tossPayment, "paymentKey"))) {
            throw new CustomException(HttpStatus.BAD_GATEWAY, "토스 결제키 검증에 실패했습니다.");
        }

        if (!Objects.equals(request.getOrderId(), getStringValue(tossPayment, "orderId"))) {
            throw new CustomException(HttpStatus.BAD_GATEWAY, "토스 주문번호 검증에 실패했습니다.");
        }

        Integer totalAmount = getIntegerValue(tossPayment, "totalAmount");
        if (!Objects.equals(request.getAmount(), totalAmount)) {
            throw new CustomException(HttpStatus.BAD_GATEWAY, "토스 결제 금액 검증에 실패했습니다.");
        }

        if (!"DONE".equals(getStringValue(tossPayment, "status"))) {
            throw new CustomException(HttpStatus.BAD_GATEWAY, "토스 결제가 완료 상태가 아닙니다.");
        }
    }

    private void upgradeDonorRole(Users user) {
        if (user.getRole() != UserRole.ADMIN) {
            user.setRole(UserRole.PREMIUM);
        }
    }

    private DonationManageResDto toDonationManageResDto(Donations donation) {
        DonationPayments payment = donationPaymentRepository
                .findByDonations_DonationId(donation.getDonationId())
                .orElse(null);

        return DonationManageResDto.builder()
                .donationId(donation.getDonationId())
                .nickname(donation.getUsers().getNickname())
                .email(donation.getUsers().getEmail())
                .amount(donation.getAmount())
                .approvedAt(payment == null ? null : payment.getApprovedAt())
                .orderId(payment == null ? null : payment.getOrderId())
                .build();
    }

    private DonationManageResDto toDonationManageResDto(DonationPayments payment) {
        Donations donation = payment.getDonations();
        Users user = donation.getUsers();

        return DonationManageResDto.builder()
                .donationId(donation.getDonationId())
                .nickname(user.getNickname())
                .email(user.getEmail())
                .amount(donation.getAmount())
                .approvedAt(payment.getApprovedAt())
                .orderId(payment.getOrderId())
                .build();
    }

    private boolean matchesKeyword(Donations donation, String keyword) {
        if (keyword == null) {
            return true;
        }

        Users user = donation.getUsers();
        return contains(user.getNickname(), keyword)
                || contains(user.getEmail(), keyword)
                || contains(String.valueOf(donation.getDonationId()), keyword);
    }

    private boolean contains(String source, String keyword) {
        return source != null && source.toLowerCase().contains(keyword.toLowerCase());
    }

    private String toLikePattern(String keyword) {
        return "%" + keyword.toLowerCase(Locale.ROOT) + "%";
    }

    private Long parseLong(String keyword) {
        try {
            return Long.valueOf(keyword);
        } catch (NumberFormatException e) {
            return null;
        }
    }

    private Integer parseInteger(String keyword) {
        try {
            return Integer.valueOf(keyword);
        } catch (NumberFormatException e) {
            return null;
        }
    }

    private Page<DonationManageResDto> toPage(List<DonationManageResDto> donations, Pageable pageable) {
        if (pageable.isUnpaged()) {
            return new PageImpl<>(donations);
        }

        int start = (int) pageable.getOffset();

        if (start >= donations.size()) {
            return new PageImpl<>(List.of(), pageable, donations.size());
        }

        int end = Math.min(start + pageable.getPageSize(), donations.size());
        return new PageImpl<>(donations.subList(start, end), pageable, donations.size());
    }

    private Users getUser(Long userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> new CustomException(HttpStatus.NOT_FOUND, "회원을 찾을 수 없습니다."));
    }

    private Donations getDonation(Long donationId) {
        return donationRepository.findById(donationId)
                .orElseThrow(() -> new CustomException(HttpStatus.NOT_FOUND, "후원 내역을 찾을 수 없습니다."));
    }

    private DonationPayments getPaymentByOrderId(String orderId) {
        return donationPaymentRepository.findByOrderId(orderId)
                .orElseThrow(() -> new CustomException(HttpStatus.NOT_FOUND, "결제 내역을 찾을 수 없습니다."));
    }

    private void validateOrderId(String orderId) {
        if (orderId == null || !ORDER_ID_PATTERN.matcher(orderId).matches()) {
            throw new CustomException(HttpStatus.BAD_REQUEST, "orderId는 영문, 숫자, -, _로 이루어진 6자 이상 64자 이하 문자열이어야 합니다.");
        }
    }

    private String normalizeConfirmUrl() {
        String url = tossConfirmUrl == null || tossConfirmUrl.isBlank()
                ? "https://api.tosspayments.com/v1/payments/confirm"
                : tossConfirmUrl.trim();

        if (url.endsWith("%7D")) {
            return url.substring(0, url.length() - 3);
        }
        if (url.endsWith("}")) {
            return url.substring(0, url.length() - 1);
        }
        return url;
    }

    private String getStringValue(Map<String, Object> source, String key) {
        Object value = source.get(key);
        return value == null ? null : String.valueOf(value);
    }

    private Integer getIntegerValue(Map<String, Object> source, String key) {
        Object value = source.get(key);

        if (value instanceof Number number) {
            return number.intValue();
        }
        if (value instanceof String stringValue && !stringValue.isBlank()) {
            return Integer.parseInt(stringValue);
        }
        return null;
    }

    private LocalDateTime parseApprovedAt(String approvedAt) {
        if (approvedAt == null || approvedAt.isBlank()) {
            return LocalDateTime.now();
        }

        try {
            return OffsetDateTime.parse(approvedAt).toLocalDateTime();
        } catch (DateTimeParseException e) {
            return LocalDateTime.now();
        }
    }
}
