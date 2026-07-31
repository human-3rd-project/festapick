package com.human.festapick.entity;

import com.human.festapick.constant.DonationStatus;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "donations")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Builder
public class Donations {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "donation_id")
    private Long donationId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private Users users;

    @Column(name = "amount")
    private Integer amount;

    @Enumerated(EnumType.STRING)
    @Column(name = "donation_status", nullable = false, length = 20)
    private DonationStatus donationStatus;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();

        if (this.donationStatus == null) {
            this.donationStatus = DonationStatus.READY;
        }
    }

    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }

    public void complete() {
        this.donationStatus = DonationStatus.DONE;
    }

    public void fail() {
        this.donationStatus = DonationStatus.FAILED;
    }

    public void cancel() {
        this.donationStatus = DonationStatus.CANCELED;
    }
}
