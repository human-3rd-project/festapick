package com.human.festapick.dto.response;

import java.time.LocalDateTime;

import com.human.festapick.entity.Reviews;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ReviewResDto {
  // 리뷰 ID
  private Long reviewId;

  // 축제 ID
  private Long festivalId;
  
  // 작성자 - 조회 시 review.user 또는 fetch join 필요
  private Long userId;
  private String nickname;
  private String profileImageUrl;

  // 리뷰 별점, 내용
  private Integer rating;
  private String content;

  // 작성 / 수정 시간
  private LocalDateTime createdAt;
  private LocalDateTime updatedAt;

  // Entity -> DTO 변환
  public static ReviewResDto of(Reviews review) {
    return ReviewResDto.builder()
        .reviewId(review.getReviewId())
        .festivalId(review.getFestival().getFestivalId())
        .userId(review.getUser().getUserId())
        .nickname(review.getUser().getNickname())
        .profileImageUrl(review.getUser().getProfileImageUrl())
        .rating(review.getRating())
        .content(review.getContent())
        .createdAt(review.getCreatedAt())
        .updatedAt(review.getUpdatedAt())
        .build();
  }
}
