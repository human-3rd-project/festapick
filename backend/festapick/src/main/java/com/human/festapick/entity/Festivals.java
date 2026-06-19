package com.human.festapick.entity;

import com.human.festapick.constant.FestivalStatus;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(
        name = "festivals",
        uniqueConstraints = {
                @UniqueConstraint(
                        name = "uk_festivals_content_id",
                        columnNames = "content_id"
                )
        },
        indexes = {
                @Index(name = "idx_festivals_ldong", columnList = "ldong_regn_cd, ldong_signgu_cd"),
                @Index(name = "idx_festivals_event_date", columnList = "event_start_date, event_end_date"),
                @Index(name = "idx_festivals_title", columnList = "title"),
                @Index(name = "idx_festivals_status", columnList = "status"),
                @Index(name = "idx_festivals_lcls_systm", columnList = "lcls_systm1, lcls_systm2, lcls_systm3"),
                @Index(name = "idx_festivals_cat", columnList = "cat1, cat2, cat3")
        }
)
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Builder

public class Festivals {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "festival_id")
    private Long festivalId;

    @Column(name = "content_id", nullable = false, unique = true, length = 50)
    private String contentId;

    @Column(name = "content_type_id", length = 10)
    private String contentTypeId;

    @Column(name = "title", nullable = false, length = 200)
    private String title;

    @Column(name = "addr1", length = 255)
    private String addr1;

    @Column(name = "addr2", length = 255)
    private String addr2;

    @Column(name = "zipcode", length = 20)
    private String zipcode;

    @Column(name = "cat1", length = 20)
    private String cat1;

    @Column(name = "cat2", length = 20)
    private String cat2;

    @Column(name = "cat3", length = 20)
    private String cat3;

    @Column(name = "tour_created_time", length = 14)
    private String tourCreatedTime;

    @Column(name = "event_start_date")
    private LocalDate eventStartDate;

    @Column(name = "event_end_date")
    private LocalDate eventEndDate;

    @Column(name = "first_image", length = 500)
    private String firstImage;

    @Column(name = "first_image2", length = 500)
    private String firstImage2;

    @Column(name = "copyright_type", length = 20)
    private String copyrightType;

    @Column(name = "map_x", precision = 18, scale = 14)
    private BigDecimal mapX;

    @Column(name = "map_y", precision = 18, scale = 14)
    private BigDecimal mapY;

    @Column(name = "map_level", length = 10)
    private String mapLevel;

    @Column(name = "tour_modified_time", length = 14)
    private String tourModifiedTime;

    @Column(name = "tel", length = 500)
    private String tel;

    @Column(name = "ldong_regn_cd", length = 10)
    private String ldongRegnCd;

    @Column(name = "ldong_signgu_cd", length = 10)
    private String ldongSignguCd;

    @Column(name = "lcls_systm1", length = 20)
    private String lclsSystm1;

    @Column(name = "lcls_systm2", length = 20)
    private String lclsSystm2;

    @Column(name = "lcls_systm3", length = 20)
    private String lclsSystm3;

    @Column(name = "progress_type", length = 50)
    private String progressType;

    @Column(name = "festival_type", length = 100)
    private String festivalType;

    @Column(name = "homepage_url", length = 500)
    private String homepageUrl;

    @Lob
    @Column(name = "description", columnDefinition = "TEXT")
    private String description;

    @Builder.Default
    @Column(name = "view_count", nullable = false)
    private Long viewCount = 0L;

    @Builder.Default
    @Column(name = "favorite_count", nullable = false)
    private Long favoriteCount = 0L;

    @Builder.Default
    @Column(name = "like_count", nullable = false)
    private Long likeCount = 0L;

    @Builder.Default
    @Column(name = "review_count", nullable = false)
    private Long reviewCount = 0L;

    @Builder.Default
    @Column(name = "average_rating", nullable = false, precision = 2, scale = 1)
    private BigDecimal averageRating = BigDecimal.ZERO;


    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false, length = 20)
    private FestivalStatus status;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;

    // 리뷰 개수 / 평균 별점 갱신
    public void updateReviewStats(Long reviewCount, BigDecimal averageRating) {
        this.reviewCount = reviewCount;
        this.averageRating = averageRating;
    }

    public void increaseFavoriteCount() {
        this.favoriteCount = this.favoriteCount == null ? 1L : this.favoriteCount + 1;
    }

    public void decreaseFavoriteCount() {
        this.favoriteCount = this.favoriteCount == null || this.favoriteCount <= 0 ? 0L : this.favoriteCount - 1;
    }

    public void increaseLikeCount() {
        this.likeCount = this.likeCount == null ? 1L : this.likeCount + 1;
    }

    public void decreaseLikeCount() {
        this.likeCount = this.likeCount == null || this.likeCount <= 0 ? 0L : this.likeCount - 1;
    }

    public void hide() {
        this.status = FestivalStatus.HIDDEN;
    }
}
