package com.human.festapick.dto.response;

import lombok.Builder;
import lombok.Getter;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Getter
@Builder
public class FestivalDetailResponseDto {

    private Long festivalId;

    private Long chatRoomId;

    private String contentId;

    private String title;

    private String categoryName;

    private String progressType;

    private List<String> imageUrls;

    private String addr1;

    private String addr2;

    private LocalDate eventStartDate;

    private LocalDate eventEndDate;

    private String description;

    private BigDecimal mapX;

    private BigDecimal mapY;

    private BigDecimal averageRating;

    private Long reviewCount;

    private String status;
}
