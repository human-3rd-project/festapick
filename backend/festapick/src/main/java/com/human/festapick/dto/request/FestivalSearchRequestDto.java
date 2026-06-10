package com.human.festapick.dto.request;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
public class FestivalSearchRequestDto {

    private String keyword;

    private String ldongRegnCd;

    private String ldongSignguCd;

    private String lclsSystm;

    private LocalDate startDate;

    private LocalDate endDate;

    private Integer page;

    private Integer size;
}