package com.human.festapick.repository;

import com.human.festapick.constant.DonationStatus;
import com.human.festapick.constant.PaymentStatus;
import com.human.festapick.entity.Donations;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface DonationRepository extends JpaRepository<Donations, Long> {

    // 내 후원 내역 조회
    Page<Donations> findByUsers_UserId(Long userId, Pageable pageable);

    // 로그인 사용자가 소유한 후원 단건 조회
    Optional<Donations> findByDonationIdAndUsers_UserId(Long donationId, Long userId);

    // 총 후원금 통계
    @Query("select coalesce(sum(d.amount), 0) from Donations d where d.donationStatus = :status")
    Long getTotalDonationAmount(@Param("status") DonationStatus status);

    // 후원자 수 통계
    @Query("select count(distinct d.users.userId) from Donations d where d.donationStatus = :status")
    Long getDonorCount(@Param("status") DonationStatus status);

    @Query("""
        select d
        from Donations d
        join d.users u
        where (:donationId is null or d.donationId = :donationId)
           or (:keyword is null or u.nickname like concat('%', :keyword, '%'))
           or (:keyword is null or u.email like concat('%', :keyword, '%'))
        """)
    Page<Donations> searchDonations(
            @Param("donationId") Long donationId,
            @Param("keyword") String keyword,
            Pageable pageable
    );

    @Query(
            value = """
                    select donation
                    from Donations donation
                    join donation.users user
                    left join DonationPayments payment on payment.donations = donation
                    where (:numericKeyword is not null and donation.donationId = :numericKeyword)
                       or (:amountKeyword is not null and donation.amount = :amountKeyword)
                       or lower(user.nickname) like :keyword
                       or lower(user.email) like :keyword
                       or lower(user.loginId) like :keyword
                       or lower(payment.orderId) like :keyword
                    """,
            countQuery = """
                    select count(donation)
                    from Donations donation
                    join donation.users user
                    left join DonationPayments payment on payment.donations = donation
                    where (:numericKeyword is not null and donation.donationId = :numericKeyword)
                       or (:amountKeyword is not null and donation.amount = :amountKeyword)
                       or lower(user.nickname) like :keyword
                       or lower(user.email) like :keyword
                       or lower(user.loginId) like :keyword
                       or lower(payment.orderId) like :keyword
                    """
    )
    Page<Donations> searchAdminDonations(
            @Param("keyword") String keyword,
            @Param("numericKeyword") Long numericKeyword,
            @Param("amountKeyword") Integer amountKeyword,
            Pageable pageable
    );

    @Query(
            value = """
                    select donation
                    from Donations donation
                    join DonationPayments payment on payment.donations = donation
                    where donation.donationStatus = :donationStatus
                      and payment.paymentStatus = :paymentStatus
                    """,
            countQuery = """
                    select count(donation)
                    from Donations donation
                    join DonationPayments payment on payment.donations = donation
                    where donation.donationStatus = :donationStatus
                      and payment.paymentStatus = :paymentStatus
                    """
    )
    Page<Donations> findAdminCompletedDonations(
            @Param("donationStatus") DonationStatus donationStatus,
            @Param("paymentStatus") PaymentStatus paymentStatus,
            Pageable pageable
    );

    @Query(
            value = """
                    select donation
                    from Donations donation
                    join donation.users user
                    join DonationPayments payment on payment.donations = donation
                    where donation.donationStatus = :donationStatus
                      and payment.paymentStatus = :paymentStatus
                      and (
                           (:numericKeyword is not null and donation.donationId = :numericKeyword)
                        or (:amountKeyword is not null and donation.amount = :amountKeyword)
                        or lower(user.nickname) like :keyword
                        or lower(user.email) like :keyword
                        or lower(user.loginId) like :keyword
                        or lower(payment.orderId) like :keyword
                      )
                    """,
            countQuery = """
                    select count(donation)
                    from Donations donation
                    join donation.users user
                    join DonationPayments payment on payment.donations = donation
                    where donation.donationStatus = :donationStatus
                      and payment.paymentStatus = :paymentStatus
                      and (
                           (:numericKeyword is not null and donation.donationId = :numericKeyword)
                        or (:amountKeyword is not null and donation.amount = :amountKeyword)
                        or lower(user.nickname) like :keyword
                        or lower(user.email) like :keyword
                        or lower(user.loginId) like :keyword
                        or lower(payment.orderId) like :keyword
                      )
                    """
    )
    Page<Donations> searchAdminCompletedDonations(
            @Param("keyword") String keyword,
            @Param("numericKeyword") Long numericKeyword,
            @Param("amountKeyword") Integer amountKeyword,
            @Param("donationStatus") DonationStatus donationStatus,
            @Param("paymentStatus") PaymentStatus paymentStatus,
            Pageable pageable
    );
}
