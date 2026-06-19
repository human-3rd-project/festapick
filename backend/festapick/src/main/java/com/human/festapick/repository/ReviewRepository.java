package com.human.festapick.repository;

import com.human.festapick.constant.ReviewStatus;
import com.human.festapick.dto.response.MyReviewResDto;
import com.human.festapick.dto.response.ReviewResDto;
import com.human.festapick.entity.Reviews;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface ReviewRepository extends JpaRepository<Reviews, Long> {

    // 특정 축제의 리뷰 목록 조회
    @Query(
            value = """
                    SELECT new com.human.festapick.dto.response.ReviewResDto(
                        review.reviewId,
                        festival.festivalId,
                        writer.userId,
                        writer.nickname,
                        review.rating,
                        review.content,
                        review.createdAt,
                        review.updatedAt
                    )
                    FROM Reviews review
                    JOIN review.user writer
                    JOIN review.festival festival
                    WHERE festival.festivalId = :festivalId
                      AND review.status = :status
                    ORDER BY review.createdAt DESC
                    """,
            countQuery = """
                    SELECT COUNT(review)
                    FROM Reviews review
                    WHERE review.festival.festivalId = :festivalId
                      AND review.status = :status
                    """
    )
    Page<ReviewResDto> findReviewListByFestivalId(
            @Param("festivalId") Long festivalId,
            @Param("status") ReviewStatus status,
            Pageable pageable
    );

    // 마이페이지 - 내 리뷰 목록 조회
    @Query(
            value = """
                    SELECT new com.human.festapick.dto.response.MyReviewResDto(
                        review.reviewId,
                        festival.festivalId,
                        festival.title,
                        CASE
                            WHEN festival.firstImage2 IS NOT NULL AND festival.firstImage2 <> '' THEN festival.firstImage2
                            ELSE festival.firstImage
                        END,
                        festival.lclsSystm3,
                        review.content,
                        review.rating,
                        review.createdAt,
                        festival.lclsSystm1,
                        festival.lclsSystm2,
                        festival.lclsSystm3,
                        festival.festivalType
                    )
                    FROM Reviews review
                    JOIN review.festival festival
                    WHERE review.user.userId = :userId
                      AND review.status = :status
                    ORDER BY review.createdAt DESC
                    """,
            countQuery = """
                    SELECT COUNT(review)
                    FROM Reviews review
                    WHERE review.user.userId = :userId
                      AND review.status = :status
                    """
    )
    Page<MyReviewResDto> findMyReviewListByUserId(
            @Param("userId") Long userId,
            @Param("status") ReviewStatus status,
            Pageable pageable
    );

    @Query(
            value = """
                    SELECT review
                    FROM Reviews review
                    JOIN review.user writer
                    JOIN review.festival festival
                    WHERE (:numericKeyword IS NOT NULL AND review.reviewId = :numericKeyword)
                       OR (:numericKeyword IS NOT NULL AND writer.userId = :numericKeyword)
                       OR (:numericKeyword IS NOT NULL AND festival.festivalId = :numericKeyword)
                       OR (:rating IS NOT NULL AND review.rating = :rating)
                       OR LOWER(review.content) LIKE :keyword
                       OR LOWER(writer.nickname) LIKE :keyword
                       OR LOWER(writer.email) LIKE :keyword
                       OR LOWER(writer.loginId) LIKE :keyword
                       OR LOWER(festival.title) LIKE :keyword
                       OR LOWER(festival.contentId) LIKE :keyword
                    """,
            countQuery = """
                    SELECT COUNT(review)
                    FROM Reviews review
                    JOIN review.user writer
                    JOIN review.festival festival
                    WHERE (:numericKeyword IS NOT NULL AND review.reviewId = :numericKeyword)
                       OR (:numericKeyword IS NOT NULL AND writer.userId = :numericKeyword)
                       OR (:numericKeyword IS NOT NULL AND festival.festivalId = :numericKeyword)
                       OR (:rating IS NOT NULL AND review.rating = :rating)
                       OR LOWER(review.content) LIKE :keyword
                       OR LOWER(writer.nickname) LIKE :keyword
                       OR LOWER(writer.email) LIKE :keyword
                       OR LOWER(writer.loginId) LIKE :keyword
                       OR LOWER(festival.title) LIKE :keyword
                       OR LOWER(festival.contentId) LIKE :keyword
                    """
    )
    Page<Reviews> searchAdminReviews(
            @Param("keyword") String keyword,
            @Param("numericKeyword") Long numericKeyword,
            @Param("rating") Integer rating,
            Pageable pageable
    );

    // 리뷰 수정 / 삭제 권한 확인용 조회
    Optional<Reviews> findByReviewIdAndUser_UserIdAndStatus(
            Long reviewId,
            Long userId,
            ReviewStatus status
    );

    // 한 회원이 같은 축제에 이미 활성 리뷰를 작성했는지 확인
    boolean existsByUser_UserIdAndFestival_FestivalIdAndStatus(
            Long userId,
            Long festivalId,
            ReviewStatus status
    );

    // 특정 축제의 활성 리뷰 개수 조회
    long countByFestival_FestivalIdAndStatus(
            Long festivalId,
            ReviewStatus status
    );

    // 특정 축제의 활성 리뷰 평균 별점 조회
    @Query("""
            SELECT COALESCE(AVG(review.rating), 0.0)
            FROM Reviews review
            WHERE review.festival.festivalId = :festivalId
              AND review.status = :status
            """)
    Double findAverageRatingByFestivalIdAndStatus(
            @Param("festivalId") Long festivalId,
            @Param("status") ReviewStatus status
    );
}
