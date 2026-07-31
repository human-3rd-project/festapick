package com.human.festapick.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "visit_history_images")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class VisitHistoryImages {

    // 방문 기록 사진 PK
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "visit_history_image_id")
    private Long visitHistoryImageId;

    // 방문 기록 ID FK
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(
            name = "visit_history_id",
            nullable = false
    )
    private VisitHistories visitHistories;

    // 이미지 URL
    @Column(name = "image_url", length = 500, nullable = false)
    private String imageUrl;

    // 노출 순서
    @Column(name = "sort_order", nullable = false)
    private Integer sortOrder;

    // 생성일
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    // 수정일
    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;

    @Builder
    public VisitHistoryImages(VisitHistories visitHistories, String imageUrl, Integer sortOrder) {
        this.visitHistories = visitHistories;
        this.imageUrl = imageUrl;
        this.sortOrder = sortOrder;
    }

    // 이미지 URL 수정
    public void updateImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }

    // 이미지 노출 순서 수정
    public void updateSortOrder(Integer sortOrder) {
        this.sortOrder = sortOrder;
    }

    // 처음 저장될 때 실행
    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();

        if (this.sortOrder == null) {
            this.sortOrder = 0;
        }
    }

    // 수정될 때 실행
    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }
}