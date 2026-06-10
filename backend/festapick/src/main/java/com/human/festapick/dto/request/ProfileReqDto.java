package com.human.festapick.dto.request;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
public class ProfileReqDto {

    // 닉네임
    @Size(min = 2, max = 50, message = "닉네임은 2자 이상 50자 이하로 입력해야 합니다.")
    private String nickname;

    // 프로필 이미지 URL
    private String profileImageUrl;

    @Getter
    @NoArgsConstructor
    public static class CalendarFilterReqDto {

        // 조회 연도
        @NotNull(message = "조회 연도는 필수입니다.")
        private Integer year;

        // 조회 월
        @NotNull(message = "조회 월은 필수입니다.")
        @Min(value = 1, message = "월은 1 이상이어야 합니다.")
        @Max(value = 12, message = "월은 12 이하이어야 합니다.")
        private Integer month;

        // 시/도 코드
        private String ldongRegnCd;

        // 시/군/구 코드
        private String ldongSignguCd;

        // 테마 또는 카테고리 코드
        // festivals.lcls_systm3 또는 festival_category_codes의 코드값을 필터 조건으로 사용
        private String categoryCode;

        // 찜한 축제만 보기 여부
        private Boolean favoriteOnly;
    }
}