package com.human.festapick.dto.response;

import lombok.Builder;
import lombok.Getter;

import java.util.List;

@Getter
@Builder
public class AiRecommendationResDto {

    private String message;

    private List<FestivalInfoResponseDto> festivals;
}
