package com.human.festapick.repository;

import com.human.festapick.constant.FestivalStatus;
import com.human.festapick.entity.Festivals;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
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

    @Query(
            value = """
                    SELECT festival
                    FROM Festivals festival
                    WHERE (:numericKeyword IS NOT NULL AND festival.festivalId = :numericKeyword)
                       OR (:status IS NOT NULL AND festival.status = :status)
                       OR LOWER(festival.contentId) LIKE :keyword
                       OR LOWER(festival.title) LIKE :keyword
                       OR LOWER(festival.addr1) LIKE :keyword
                       OR LOWER(festival.addr2) LIKE :keyword
                       OR LOWER(festival.festivalType) LIKE :keyword
                       OR LOWER(festival.progressType) LIKE :keyword
                       OR LOWER(festival.lclsSystm1) LIKE :keyword
                       OR LOWER(festival.lclsSystm2) LIKE :keyword
                       OR LOWER(festival.lclsSystm3) LIKE :keyword
                    """,
            countQuery = """
                    SELECT COUNT(festival)
                    FROM Festivals festival
                    WHERE (:numericKeyword IS NOT NULL AND festival.festivalId = :numericKeyword)
                       OR (:status IS NOT NULL AND festival.status = :status)
                       OR LOWER(festival.contentId) LIKE :keyword
                       OR LOWER(festival.title) LIKE :keyword
                       OR LOWER(festival.addr1) LIKE :keyword
                       OR LOWER(festival.addr2) LIKE :keyword
                       OR LOWER(festival.festivalType) LIKE :keyword
                       OR LOWER(festival.progressType) LIKE :keyword
                       OR LOWER(festival.lclsSystm1) LIKE :keyword
                       OR LOWER(festival.lclsSystm2) LIKE :keyword
                       OR LOWER(festival.lclsSystm3) LIKE :keyword
                    """
    )
    Page<Festivals> searchAdminFestivals(
            @Param("keyword") String keyword,
            @Param("numericKeyword") Long numericKeyword,
            @Param("status") FestivalStatus status,
            Pageable pageable
    );
}
