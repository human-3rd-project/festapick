package com.human.festapick.entity;

import java.time.LocalDateTime;

import org.hibernate.annotations.Check;

import com.human.festapick.constant.ReviewStatus;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "reviews")
@Check(constraints = "rating BETWEEN 0 AND 5")
@Getter
@Setter
@ToString(exclude = {"user", "festival"})
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Reviews {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  @Column(name = "review_id")
  private Long reviewId;
  
  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "user_id", nullable = false)
  private Users user;

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "festival_id", nullable = false)
  private Festivals festival;

  @Column(columnDefinition = "TEXT", nullable = false)
  private String content;

  @Column(nullable = false)
  private Integer rating;

  @Enumerated(EnumType.STRING)
  @Column(nullable = false)
  private ReviewStatus status = ReviewStatus.ACTIVE;

  @Column(nullable = false, updatable = false)
  private LocalDateTime createdAt;

  @Column(nullable = false)
  private LocalDateTime updatedAt;

  @PrePersist
  public void prePersist() {
    createdAt = LocalDateTime.now();
    updatedAt = LocalDateTime.now();
  }

  @PreUpdate
  public void perUpdate() {
    updatedAt = LocalDateTime.now();
  }

  @Builder
  public Reviews(Users user, Festivals festival, String content, Integer rating) {
    this.user = user;
    this.festival = festival;
    this.content = content;
    this.rating = rating;
    this.status = ReviewStatus.ACTIVE;
  }
}
