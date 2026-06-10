package com.human.festapick.entity;

import com.human.festapick.constant.PaymentStatus;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(
        name = "donation_payments",
        uniqueConstraints = {
                @UniqueConstraint(
                        name = "uk_donation_payment_order_id",
                        columnNames = "order_id"
                ),
                @UniqueConstraint(
                        name = "uk_donation_payment_payment_key",
                        columnNames = "payment_key"
                )
        }
)
@Getter
@AllArgsConstructor
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Builder
public class DonationPayments {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "donation_payment_id")
    private Long donationPaymentId;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(
            name = "donation_id",
            nullable = false,
            unique = true
    )
    private Donations donations;

    @Column(name = "payment_key", length = 100)
    private String paymentKey;

    @Column(name = "order_id", length = 100, nullable = false)
    private String orderId;

    @Column(name = "method", length = 50)
    private String method;

    @Column(name = "amount")
    private Integer amount;

    @Enumerated(EnumType.STRING)
    @Column(name = "payment_status", nullable = false, length = 20)
    private PaymentStatus paymentStatus;

    @Column(name = "fail_reason", length = 255)
    private String failReason;

    @Column(name = "approved_at")
    private LocalDateTime approvedAt;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();

        if (paymentStatus == null) {
            this.paymentStatus = PaymentStatus.READY;
        }
    }

    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }

    public void success(
            String paymentKey,
            String method,
            Integer amount,
            LocalDateTime approvedAt
    ) {
        this.paymentKey = paymentKey;
        this.method = method;
        this.amount = amount;
        this.approvedAt = approvedAt;
        this.paymentStatus = PaymentStatus.DONE;
    }

    public void fail(String failReason) {
        this.failReason = failReason;
        this.paymentStatus = PaymentStatus.FAILED;
    }

    public void cancel() {
        this.paymentStatus = PaymentStatus.CANCELED;
    }

}
