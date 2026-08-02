package com.human.festapick.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.human.festapick.constant.DonationStatus;
import com.human.festapick.constant.OAuthProvider;
import com.human.festapick.constant.PaymentStatus;
import com.human.festapick.constant.UserRole;
import com.human.festapick.constant.UserStatus;
import com.human.festapick.dto.request.PaymentConfirmReqDto;
import com.human.festapick.entity.DonationPayments;
import com.human.festapick.entity.Donations;
import com.human.festapick.entity.Users;
import com.human.festapick.exception.CustomException;
import com.human.festapick.repository.DonationPaymentRepository;
import com.human.festapick.repository.DonationRepository;
import com.human.festapick.repository.UserRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.test.util.ReflectionTestUtils;
import org.springframework.web.reactive.function.client.WebClient;

import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class DonationServiceTest {

    private static final Long USER_ID = 1L;
    private static final Long DONATION_ID = 10L;
    private static final String ORDER_ID = "order_123";

    @Mock
    private DonationRepository donationRepository;

    @Mock
    private DonationPaymentRepository donationPaymentRepository;

    @Mock
    private UserRepository userRepository;

    @Mock
    private ObjectMapper objectMapper;

    @Mock
    private WebClient.Builder webClientBuilder;

    @InjectMocks
    private DonationService donationService;

    @Test
    void requestPaymentWithOwnedDonationSavesPayment() {
        Donations donation = createDonation();

        when(donationRepository.findByDonationIdAndUsers_UserId(DONATION_ID, USER_ID))
                .thenReturn(Optional.of(donation));
        when(donationPaymentRepository.existsByOrderId(ORDER_ID)).thenReturn(false);
        when(donationPaymentRepository.save(any(DonationPayments.class)))
                .thenAnswer(invocation -> invocation.getArgument(0));

        DonationPayments payment = donationService.requestPayment(USER_ID, DONATION_ID, ORDER_ID);

        assertThat(payment.getDonations()).isSameAs(donation);
        assertThat(payment.getOrderId()).isEqualTo(ORDER_ID);
        assertThat(payment.getAmount()).isEqualTo(donation.getAmount());
        verify(donationPaymentRepository).save(payment);
    }

    @Test
    void requestPaymentWithAnotherUsersDonationReturnsNotFound() {
        when(donationRepository.findByDonationIdAndUsers_UserId(DONATION_ID, USER_ID))
                .thenReturn(Optional.empty());

        assertNotFound(() -> donationService.requestPayment(USER_ID, DONATION_ID, ORDER_ID));

        verify(donationPaymentRepository, never()).existsByOrderId(anyString());
        verify(donationPaymentRepository, never()).save(any());
    }

    @Test
    void confirmPaymentWithAnotherUsersOrderReturnsNotFoundBeforeCallingToss() {
        PaymentConfirmReqDto request = createPaymentConfirmRequest();
        when(donationPaymentRepository.findByOrderIdAndDonations_Users_UserId(ORDER_ID, USER_ID))
                .thenReturn(Optional.empty());

        assertNotFound(() -> donationService.confirmPayment(USER_ID, request));

        verify(donationPaymentRepository, never()).existsByPaymentKey(anyString());
        verify(webClientBuilder, never()).build();
    }

    @Test
    void savePaymentFailureWithAnotherUsersOrderReturnsNotFound() {
        when(donationPaymentRepository.findByOrderIdAndDonations_Users_UserId(ORDER_ID, USER_ID))
                .thenReturn(Optional.empty());

        assertNotFound(() -> donationService.savePaymentFailure(USER_ID, ORDER_ID, "결제 취소"));
    }

    @Test
    void getPaymentSuccessInfoWithAnotherUsersOrderReturnsNotFound() {
        when(donationPaymentRepository.findByOrderIdAndDonations_Users_UserId(ORDER_ID, USER_ID))
                .thenReturn(Optional.empty());

        assertNotFound(() -> donationService.getPaymentSuccessInfo(USER_ID, ORDER_ID));
    }

    @Test
    void getPaymentFailureInfoWithAnotherUsersOrderReturnsNotFound() {
        when(donationPaymentRepository.findByOrderIdAndDonations_Users_UserId(ORDER_ID, USER_ID))
                .thenReturn(Optional.empty());

        assertNotFound(() -> donationService.getPaymentFailureInfo(USER_ID, ORDER_ID));
    }

    private void assertNotFound(Runnable action) {
        assertThatThrownBy(action::run)
                .isInstanceOf(CustomException.class)
                .satisfies(error -> {
                    CustomException exception = (CustomException) error;
                    assertThat(exception.getStatus()).isEqualTo(HttpStatus.NOT_FOUND);
                });
    }

    private PaymentConfirmReqDto createPaymentConfirmRequest() {
        PaymentConfirmReqDto request = new PaymentConfirmReqDto();
        ReflectionTestUtils.setField(request, "paymentKey", "payment_key_123");
        ReflectionTestUtils.setField(request, "orderId", ORDER_ID);
        ReflectionTestUtils.setField(request, "amount", 10_000);
        return request;
    }

    private Donations createDonation() {
        return Donations.builder()
                .donationId(DONATION_ID)
                .users(createUser())
                .amount(10_000)
                .donationStatus(DonationStatus.READY)
                .build();
    }

    private Users createUser() {
        return Users.builder()
                .userId(USER_ID)
                .loginId("member01")
                .password("encoded-password")
                .email("member01@example.com")
                .nickname("테스트회원")
                .role(UserRole.USER)
                .provider(OAuthProvider.LOCAL)
                .status(UserStatus.ACTIVE)
                .build();
    }
}
