package com.human.festapick.controller;

import com.human.festapick.dto.request.PaymentConfirmReqDto;
import com.human.festapick.dto.response.ApiResponse;
import com.human.festapick.dto.response.DonationManageResDto;
import com.human.festapick.dto.response.DonationStatisticsResDto;
import com.human.festapick.entity.DonationPayments;
import com.human.festapick.entity.Donations;
import com.human.festapick.exception.CustomException;
import com.human.festapick.security.CustomUserDetail;
import com.human.festapick.service.DonationService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;

@RestController
@RequestMapping("/donations")
@RequiredArgsConstructor
public class DonationController {

    private final DonationService donationService;

    @PostMapping
    public ResponseEntity<ApiResponse<DonationResDto>> applyDonation(
            @AuthenticationPrincipal CustomUserDetail userDetail,
            @RequestParam(required = false) Integer amount
    ) {
        Donations donation = donationService.applyDonation(
                getUserId(userDetail),
                amount
        );

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(ApiResponse.ok("후원 신청이 생성되었습니다.", DonationResDto.from(donation)));
    }

    @PostMapping("/{donationId}/payments")
    public ResponseEntity<ApiResponse<DonationPaymentResDto>> requestPayment(
            @PathVariable Long donationId,
            @RequestParam(required = false) String orderId
    ) {
        DonationPayments payment = donationService.requestPayment(
                donationId,
                requireOrderId(orderId)
        );

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(ApiResponse.ok("결제 요청 정보가 생성되었습니다.", DonationPaymentResDto.from(payment)));
    }

    @PostMapping("/payments/confirm")
    public ResponseEntity<ApiResponse<DonationPaymentResDto>> confirmPayment(
            @Valid @RequestBody(required = false) PaymentConfirmReqDto request
    ) {
        DonationPayments payment = donationService.confirmPayment(requirePaymentConfirmRequest(request));

        return ResponseEntity.ok(ApiResponse.ok("결제가 승인되었습니다.", DonationPaymentResDto.from(payment)));
    }

    @PostMapping("/payments/verify")
    public ResponseEntity<ApiResponse<DonationPaymentResDto>> verifyPayment(
            @Valid @RequestBody(required = false) PaymentConfirmReqDto request
    ) {
        DonationPayments payment = donationService.verifyPayment(requirePaymentConfirmRequest(request));

        return ResponseEntity.ok(ApiResponse.ok("결제 정보 검증이 완료되었습니다.", DonationPaymentResDto.from(payment)));
    }

    @PostMapping("/payments/failure")
    public ResponseEntity<ApiResponse<DonationPaymentResDto>> savePaymentFailure(
            @RequestParam(required = false) String orderId,
            @RequestParam(required = false) String failReason
    ) {
        DonationPayments payment = donationService.savePaymentFailure(
                requireOrderId(orderId),
                failReason
        );

        return ResponseEntity.ok(ApiResponse.ok("결제 실패 정보가 저장되었습니다.", DonationPaymentResDto.from(payment)));
    }

    @GetMapping("/payments/success")
    public ResponseEntity<ApiResponse<DonationManageResDto>> getPaymentSuccessInfo(
            @RequestParam(required = false) String orderId
    ) {
        DonationManageResDto paymentInfo = donationService.getPaymentSuccessInfo(requireOrderId(orderId));

        return ResponseEntity.ok(ApiResponse.ok(paymentInfo));
    }

    @GetMapping("/payments/failure")
    public ResponseEntity<ApiResponse<DonationPaymentResDto>> getPaymentFailureInfo(
            @RequestParam(required = false) String orderId
    ) {
        DonationPayments payment = donationService.getPaymentFailureInfo(requireOrderId(orderId));

        return ResponseEntity.ok(ApiResponse.ok(DonationPaymentResDto.from(payment)));
    }

    @GetMapping("/me")
    public ResponseEntity<ApiResponse<Page<DonationManageResDto>>> getMyDonationHistory(
            @AuthenticationPrincipal CustomUserDetail userDetail,
            Pageable pageable
    ) {
        Page<DonationManageResDto> donationHistory =
                donationService.getMyDonationHistory(getUserId(userDetail), pageable);

        return ResponseEntity.ok(ApiResponse.ok(donationHistory));
    }

    @GetMapping("/statistics")
    public ResponseEntity<ApiResponse<DonationStatisticsResDto>> getDonationStatistics() {
        DonationStatisticsResDto statistics = donationService.getDonationStatistics();

        return ResponseEntity.ok(ApiResponse.ok(statistics));
    }

    private Long getUserId(CustomUserDetail userDetail) {
        if (userDetail == null) {
            throw new CustomException(HttpStatus.UNAUTHORIZED, "로그인이 필요합니다.");
        }
        return userDetail.getUserId();
    }

    private PaymentConfirmReqDto requirePaymentConfirmRequest(PaymentConfirmReqDto request) {
        if (request == null) {
            throw new CustomException(HttpStatus.BAD_REQUEST, "결제 승인 요청 정보가 없습니다.");
        }
        return request;
    }

    private String requireOrderId(String orderId) {
        if (orderId == null || orderId.isBlank()) {
            throw new CustomException(HttpStatus.BAD_REQUEST, "orderId는 필수입니다.");
        }
        return orderId;
    }

    public record DonationResDto(
            Long donationId,
            Integer amount,
            String donationStatus,
            LocalDateTime createdAt
    ) {
        private static DonationResDto from(Donations donation) {
            return new DonationResDto(
                    donation.getDonationId(),
                    donation.getAmount(),
                    donation.getDonationStatus().name(),
                    donation.getCreatedAt()
            );
        }
    }

    public record DonationPaymentResDto(
            Long donationPaymentId,
            String orderId,
            String method,
            Integer amount,
            String paymentStatus,
            String failReason,
            LocalDateTime approvedAt,
            LocalDateTime createdAt
    ) {
        private static DonationPaymentResDto from(DonationPayments payment) {
            return new DonationPaymentResDto(
                    payment.getDonationPaymentId(),
                    payment.getOrderId(),
                    payment.getMethod(),
                    payment.getAmount(),
                    payment.getPaymentStatus().name(),
                    payment.getFailReason(),
                    payment.getApprovedAt(),
                    payment.getCreatedAt()
            );
        }
    }
}
