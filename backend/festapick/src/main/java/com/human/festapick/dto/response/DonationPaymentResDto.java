package com.human.festapick.dto.response;

import com.human.festapick.controller.DonationController;
import com.human.festapick.entity.DonationPayments;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Builder
@Setter
public class DonationPaymentResDto {
    private Long donationPaymentId;
    private String orderId;
    private String method;
    private Integer amount;
    private String paymentStatus;
    private String failReason;
    private LocalDateTime approvedAt;
    private LocalDateTime createdA;

    public static DonationPaymentResDto from(DonationPayments payment) {
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
