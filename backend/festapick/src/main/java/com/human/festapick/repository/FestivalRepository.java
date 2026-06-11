package com.human.festapick.repository;

import com.human.festapick.constant.FestivalStatus;
import com.human.festapick.entity.Festivals;
import org.springframework.data.domain.Page;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface FestivalRepository extends JpaRepository<Festivals, Long> {

    Optional<Festivals> findByContentId(String contentId);

    boolean existsByContentId(String contentId);

    Page<Festivals> findByStatus(FestivalStatus status);

    Page<Festivals> findByTitleContainingAndStatus(String keyword, FestivalStatus status);

    Page<Festivals> findByLdongRegnCdAndLdongSignguCdAndStatus(
            String ldongRegnCd,
            String ldongSignguCd,
            FestivalStatus status
    );

    Page<Festivals> findByFestivalTypeAndStatus(
            String festivalType,
            FestivalStatus status
    );

    Page<Festivals> findByEventStartDateGreaterThanEqualAndEventEndDateLessThanEqualAndStatus(
            LocalDate startDate,
            LocalDate endDate,
            FestivalStatus status
    );

    Page<Festivals> findByEventStartDateLessThanEqualAndEventEndDateGreaterThanEqualAndStatus(
            LocalDate endDate,
            LocalDate startDate,
            FestivalStatus status
    );

    Page<Festivals> findByLclsSystm1AndStatus(String lclsSystm1, FestivalStatus status);

    Page<Festivals> findByLclsSystm1AndLclsSystm2AndStatus(
            String lclsSystm1,
            String lclsSystm2,
            FestivalStatus status
    );

    Page<Festivals> findByLclsSystm1AndLclsSystm2AndLclsSystm3AndStatus(
            String lclsSystm1,
            String lclsSystm2,
            String lclsSystm3,
            FestivalStatus status
    );

    Page<Festivals> findTop10ByStatusOrderByViewCountDesc(FestivalStatus status);

    Page<Festivals> findTop10ByStatusOrderByLikeCountDesc(FestivalStatus status);

    Page<Festivals> findTop10ByStatusOrderByFavoriteCountDesc(FestivalStatus status);

    Page<Festivals> findTop10ByStatusOrderByReviewCountDesc(FestivalStatus status);

    Page<Festivals> findTop10ByStatusOrderByAverageRatingDesc(FestivalStatus status);

    Page<Festivals> findTop10ByStatusOrderByCreatedAtDesc(FestivalStatus status);
}