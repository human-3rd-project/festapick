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
                        review.id,
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
                        review.id,
                        festival.festivalId,
                        festival.title,
                        festival.firstImage2,
                        festival.lclsSystm3,
                        review.content,
                        review.rating,
                        review.createdAt
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

    // 리뷰 수정 / 삭제 권한 확인용 조회
    Optional<Reviews> findByIdAndUser_UserIdAndStatus(
            Long reviewId,
            Long userId,
            ReviewStatus status
    );

    // 특정 축제의 활성 리뷰 개수 조회
    long countByFestival_FestivalIdAndStatus(
            Long festivalId,
            ReviewStatus status
    );
}