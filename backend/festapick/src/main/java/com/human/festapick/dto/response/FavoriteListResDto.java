package com.human.festapick.dto.response;

import lombok.AllArgsConstructor;
import lombok.Getter;

import java.time.LocalDate;

@Getter
@AllArgsConstructor
public class FavoriteListResDto {

    private Long favoriteId;

    private Long festivalId;

    private String title;

    private String thumbnailUrl;

    private String categoryName; // lcls_systm3

    private String regionName;   // 프론트에서는 지역명만 표시하므로 full_name에서 지역명만 가져오도록 가공필요

    private LocalDate eventStartDate;

    private LocalDate eventEndDate;
}