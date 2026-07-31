package com.human.festapick.repository;

import com.human.festapick.entity.VisitHistoryImages;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface VisitHistoryImageRepository extends JpaRepository<VisitHistoryImages, Long> {

    // 특정 방문 기록의 이미지 목록 조회
    List<VisitHistoryImages> findByVisitHistories_VisitHistoryIdOrderBySortOrderAsc(
            Long visitHistoryId
    );

    // 특정 방문 기록의 이미지 URL 목록 조회
    @Query("""
            SELECT image.imageUrl
            FROM VisitHistoryImages image
            WHERE image.visitHistories.visitHistoryId = :visitHistoryId
            ORDER BY image.sortOrder ASC
            """)
    List<String> findImageUrlsByVisitHistoryId(
            @Param("visitHistoryId") Long visitHistoryId
    );

    // 여러 방문 기록의 이미지 목록 조회
    @Query("""
            SELECT image
            FROM VisitHistoryImages image
            WHERE image.visitHistories.visitHistoryId IN :visitHistoryIds
            ORDER BY image.visitHistories.visitHistoryId ASC, image.sortOrder ASC
            """)
    List<VisitHistoryImages> findByVisitHistoryIds(
            @Param("visitHistoryIds") List<Long> visitHistoryIds
    );

    // 특정 방문 기록의 이미지 전체 삭제
    void deleteByVisitHistories_VisitHistoryId(
            Long visitHistoryId
    );

    // 특정 사용자의 특정 방문 기록 이미지 전체 삭제
    // 본인 기록의 이미지만 삭제하도록 검증할 때 사용
    void deleteByVisitHistories_VisitHistoryIdAndVisitHistories_Users_UserId(
            Long visitHistoryId,
            Long userId
    );
}