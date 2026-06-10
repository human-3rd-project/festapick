package com.human.festapick.dto.response;

import lombok.Builder;
import lombok.Getter;

import java.math.BigDecimal;
import java.time.LocalDate;

@Getter
@Builder
public class FestivalInfoResponseDto {

    private Long festivalId;

    private String contentId;

    private String title;

    private String categoryName;

    private String firstImage;

    private String addr1;

    private String addr2;

    private LocalDate eventStartDate;

    private LocalDate eventEndDate;

    private BigDecimal averageRating;

    private Long liveCount;

    private Long favoriteCount;

    private Long likeCount;

    private Long reviewCount;

    private String status;
}