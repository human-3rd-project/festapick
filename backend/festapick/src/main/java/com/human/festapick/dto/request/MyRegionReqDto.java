package com.human.festapick.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
public class MyRegionReqDto {

    // 시/도 코드
    @NotBlank(message = "시/도를 선택해 주세요.")
    private String ldongRegnCd;

    // 시/군/구 코드
    @NotBlank(message = "시/군/구를 선택해 주세요.")
    private String ldongSignguCd;
}