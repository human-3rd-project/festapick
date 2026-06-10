package com.human.festapick.dto.response;

import lombok.AllArgsConstructor;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@AllArgsConstructor
public class MyReviewResDto {

    // 리뷰 ID
    private Long reviewId;

    // 축제 ID
    // 해당 축제 상세 페이지의 리뷰 영역으로 이동할 때 사용
    private Long festivalId;

    // 축제명
    private String title;

    // 카드 대표 이미지 URL
    private String thumbnailUrl;

    // 축제 카테고리명
    // festivals.lcls_systm3 값을 화면 표시용으로 매핑(Service에서)
    private String categoryName;

    // 리뷰 내용
    private String content;

    // 별점
    private Integer rating;

    // 리뷰 작성일
    private LocalDateTime createdAt;
}