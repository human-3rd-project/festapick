package com.human.festapick.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(
        name = "festival_images",
        indexes = {
                @Index(
                        name = "idx_festival_images_festival_id",
                        columnList = "festival_id"
                )
        }
)
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Builder

public class FestivalImages {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "festival_image_id")
    private Long festivalImageId;

    @Column(name = "festival_id", nullable = false)
    private Long festivalId;

    @Column(name = "image_url", nullable = false, length = 500)
    private String imageUrl;

    @Builder.Default
    @Column(name = "sort_order", nullable = false)
    private Integer sortOrder = 0;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;
}
