package com.human.festapick.entity;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Table(name = "visit_histories")
public class VisitHistories {

    // 방문 기록 PK
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "visit_history_id")
    private Long visitHistoryId;

    // 회원 ID FK
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private Users users;

    // 방문 기록 제목
    @Column(name = "history_title", nullable = false, length = 20)
    private String historyTitle;

    // 방문일
    @Column(name = "visit_date", nullable = false)
    private LocalDate visitDate;

    // 메모
    @Column(name = "memo", columnDefinition = "TEXT")
    private String memo;

    // 생성일
    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

    // 수정일
    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;

    @Builder
    public VisitHistories(
            Users users,
            String historyTitle,
            LocalDate visitDate,
            String memo
    ) {
        this.users = users;
        this.historyTitle = historyTitle;
        this.visitDate = visitDate;
        this.memo = memo;
    }

    // 방문 기록 수정
    public void updateHistory(String historyTitle, LocalDate visitDate, String memo) {
        this.historyTitle = historyTitle;
        this.visitDate = visitDate;
        this.memo = memo;
    }

    @PrePersist
    public void prePersist() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    public void preUpdate() {
        this.updatedAt = LocalDateTime.now();
    }
}