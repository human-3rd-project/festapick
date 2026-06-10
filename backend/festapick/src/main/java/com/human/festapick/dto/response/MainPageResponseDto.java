package com.human.festapick.dto.response;

import lombok.Builder;
import lombok.Getter;

import java.util.List;

@Getter
@Builder
public class MainPageResponseDto {

    private List<FestivalInfoResponseDto> nearbyFestivals;

    private List<FestivalInfoResponseDto> monthlyFestivals;

    private List<FestivalInfoResponseDto> popularFestivals;

}