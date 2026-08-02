package com.human.festapick.controller;

import com.human.festapick.constant.DonationStatus;
import com.human.festapick.constant.OAuthProvider;
import com.human.festapick.constant.PaymentStatus;
import com.human.festapick.constant.UserRole;
import com.human.festapick.constant.UserStatus;
import com.human.festapick.dto.request.PaymentConfirmReqDto;
import com.human.festapick.dto.response.DonationManageResDto;
import com.human.festapick.entity.DonationPayments;
import com.human.festapick.entity.Donations;
import com.human.festapick.entity.Users;
import com.human.festapick.exception.CustomException;
import com.human.festapick.security.CustomUserDetail;
import com.human.festapick.service.DonationService;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.test.util.ReflectionTestUtils;

import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.verifyNoInteractions;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class DonationControllerTest {

    private static final Long USER_ID = 1L;
    private static final Long DONATION_ID = 10L;
    private static final String ORDER_ID = "order_123";

    @Mock
    private DonationService donationService;

    @InjectMocks
    private DonationController donationController;

    @Test
    void paymentEndpointsPassAuthenticatedUserIdToService() {
        CustomUserDetail userDetail = createUserDetail();
        PaymentConfirmReqDto request = createPaymentConfirmRequest();
        DonationPayments payment = createPayment();
        DonationManageResDto successInfo = DonationManageResDto.builder()
                .donationId(DONATION_ID)
                .orderId(ORDER_ID)
                .build();

        when(donationService.requestPayment(USER_ID, DONATION_ID, ORDER_ID)).thenReturn(payment);
        when(donationService.confirmPayment(USER_ID, request)).thenReturn(payment);
        when(donationService.savePaymentFailure(USER_ID, ORDER_ID, "결제 취소")).thenReturn(payment);
        when(donationService.getPaymentSuccessInfo(USER_ID, ORDER_ID)).thenReturn(successInfo);
        when(donationService.getPaymentFailureInfo(USER_ID, ORDER_ID)).thenReturn(payment);

        donationController.requestPayment(userDetail, DONATION_ID, ORDER_ID);
        donationController.confirmPayment(userDetail, request);
        donationController.savePaymentFailure(userDetail, ORDER_ID, "결제 취소");
        donationController.getPaymentSuccessInfo(userDetail, ORDER_ID);
        donationController.getPaymentFailureInfo(userDetail, ORDER_ID);

        verify(donationService).requestPayment(USER_ID, DONATION_ID, ORDER_ID);
        verify(donationService).confirmPayment(USER_ID, request);
        verify(donationService).savePaymentFailure(USER_ID, ORDER_ID, "결제 취소");
        verify(donationService).getPaymentSuccessInfo(USER_ID, ORDER_ID);
        verify(donationService).getPaymentFailureInfo(USER_ID, ORDER_ID);
    }

    @Test
    void paymentRequestWithoutAuthenticationReturnsUnauthorized() {
        assertThatThrownBy(() -> donationController.requestPayment(null, DONATION_ID, ORDER_ID))
                .isInstanceOf(CustomException.class)
                .satisfies(error -> {
                    CustomException exception = (CustomException) error;
                    assertThat(exception.getStatus()).isEqualTo(HttpStatus.UNAUTHORIZED);
                });

        verifyNoInteractions(donationService);
    }

    private PaymentConfirmReqDto createPaymentConfirmRequest() {
        PaymentConfirmReqDto request = new PaymentConfirmReqDto();
        ReflectionTestUtils.setField(request, "paymentKey", "payment_key_123");
        ReflectionTestUtils.setField(request, "orderId", ORDER_ID);
        ReflectionTestUtils.setField(request, "amount", 10_000);
        return request;
    }

    private DonationPayments createPayment() {
        Donations donation = Donations.builder()
                .donationId(DONATION_ID)
                .users(createUser())
                .amount(10_000)
                .donationStatus(DonationStatus.READY)
                .build();

        return DonationPayments.builder()
                .donationPaymentId(100L)
                .donations(donation)
                .orderId(ORDER_ID)
                .amount(10_000)
                .paymentStatus(PaymentStatus.READY)
                .build();
    }

    private CustomUserDetail createUserDetail() {
        return new CustomUserDetail(createUser(), List.of());
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
