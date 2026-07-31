package com.human.festapick.dto.response;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
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

    @JsonIgnore
    private String lclsSystm1;

    @JsonIgnore
    private String lclsSystm2;

    @JsonIgnore
    private String lclsSystm3;

    @JsonIgnore
    private String festivalType;

    public MyReviewResDto(
            Long reviewId,
            Long festivalId,
            String title,
            String thumbnailUrl,
            String categoryName,
            String content,
            Integer rating,
            LocalDateTime createdAt,
            String lclsSystm1,
            String lclsSystm2,
            String lclsSystm3,
            String festivalType
    ) {
        this.reviewId = reviewId;
        this.festivalId = festivalId;
        this.title = title;
        this.thumbnailUrl = thumbnailUrl;
        this.categoryName = categoryName;
        this.content = content;
        this.rating = rating;
        this.createdAt = createdAt;
        this.lclsSystm1 = lclsSystm1;
        this.lclsSystm2 = lclsSystm2;
        this.lclsSystm3 = lclsSystm3;
        this.festivalType = festivalType;
    }

    public MyReviewResDto withCategoryName(String categoryName) {
        return new MyReviewResDto(
                reviewId,
                festivalId,
                title,
                thumbnailUrl,
                categoryName,
                content,
                rating,
                createdAt,
                lclsSystm1,
                lclsSystm2,
                lclsSystm3,
                festivalType
        );
    }
}
