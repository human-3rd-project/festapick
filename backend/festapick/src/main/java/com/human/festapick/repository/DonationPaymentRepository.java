package com.human.festapick.repository;

import com.human.festapick.constant.PaymentStatus;
import com.human.festapick.entity.DonationPayments;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface DonationPaymentRepository extends JpaRepository<DonationPayments, Long> {
    // 로그인 사용자가 소유한 주문번호로 결제 정보 조회
    Optional<DonationPayments> findByOrderIdAndDonations_Users_UserId(String orderId, Long userId);

    // 결제키로 결제 정보 조회
    Optional<DonationPayments> findByPaymentKey(String paymentKey);

    // 후원 ID로 결제 정보 조회
    Optional<DonationPayments> findByDonations_DonationId(Long donationId);

    // 결제 상태별 조회
    Page<DonationPayments> findByPaymentStatus(PaymentStatus paymentStatus, Pageable pageable);

    // 결제 성공 조회
    Page<DonationPayments> findByPaymentStatusOrderByCreatedAtDesc(
            PaymentStatus paymentStatus,
            Pageable pageable
    );

    // orderId 중복 확인
    boolean existsByOrderId(String orderId);

    // paymentKey 중복 확인
    boolean existsByPaymentKey(String paymentKey);
}
