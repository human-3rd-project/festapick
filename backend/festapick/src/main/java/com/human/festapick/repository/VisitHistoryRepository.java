package com.human.festapick.repository;

import com.human.festapick.entity.VisitHistories;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface VisitHistoryRepository extends JpaRepository<VisitHistories, Long> {

    // 캘린더 - 특정 월의 방문 기록 조회
    List<VisitHistories> findByUsers_UserIdAndVisitDateBetweenOrderByVisitDateAscCreatedAtAsc(
            Long userId,
            LocalDate startDate,
            LocalDate endDate
    );

    // 방문 기록 상세 / 수정 / 삭제 권한 확인용 조회
    Optional<VisitHistories> findByVisitHistoryIdAndUsers_UserId(
            Long visitHistoryId,
            Long userId
    );

    // 특정 회원의 방문 기록 개수 조회
    long countByUsers_UserId(Long userId);
}