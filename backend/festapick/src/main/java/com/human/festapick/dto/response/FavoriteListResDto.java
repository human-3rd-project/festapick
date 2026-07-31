package com.human.festapick.dto.response;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.Getter;

import java.time.LocalDate;

@Getter
public class FavoriteListResDto {

    private Long favoriteId;

    private Long festivalId;

    private String title;

    private String thumbnailUrl;

    private String categoryName; // lcls_systm3

    private String regionName;   // 프론트에서는 지역명만 표시하므로 full_name에서 지역명만 가져오도록 가공필요

    private LocalDate eventStartDate;

    private LocalDate eventEndDate;

    @JsonIgnore
    private String lclsSystm1;

    @JsonIgnore
    private String lclsSystm2;

    @JsonIgnore
    private String lclsSystm3;

    @JsonIgnore
    private String festivalType;

    public FavoriteListResDto(
            Long favoriteId,
            Long festivalId,
            String title,
            String thumbnailUrl,
            String categoryName,
            String regionName,
            LocalDate eventStartDate,
            LocalDate eventEndDate,
            String lclsSystm1,
            String lclsSystm2,
            String lclsSystm3,
            String festivalType
    ) {
        this.favoriteId = favoriteId;
        this.festivalId = festivalId;
        this.title = title;
        this.thumbnailUrl = thumbnailUrl;
        this.categoryName = categoryName;
        this.regionName = regionName;
        this.eventStartDate = eventStartDate;
        this.eventEndDate = eventEndDate;
        this.lclsSystm1 = lclsSystm1;
        this.lclsSystm2 = lclsSystm2;
        this.lclsSystm3 = lclsSystm3;
        this.festivalType = festivalType;
    }

    public FavoriteListResDto withCategoryName(String categoryName) {
        return new FavoriteListResDto(
                favoriteId,
                festivalId,
                title,
                thumbnailUrl,
                categoryName,
                regionName,
                eventStartDate,
                eventEndDate,
                lclsSystm1,
                lclsSystm2,
                lclsSystm3,
                festivalType
        );
    }
}
