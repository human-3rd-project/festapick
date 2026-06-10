package com.human.festapick.dto.response;

import lombok.AllArgsConstructor;
import lombok.Getter;

import java.time.LocalDate;

@Getter
@AllArgsConstructor
public class CalendarResDto {

    // 축제 ID
    private Long festivalId;

    // 축제명
    private String title;

    // 카드 대표 이미지 URL
    private String thumbnailUrl;

    // 축제 카테고리명
    // festivals.lcls_systm3 값을 화면 표시용으로 매핑
    private String categoryName;

    // 지역명
    // festivals의 ldong_regn_cd, ldong_signgu_cd로 legal_dong_codes를 조인한 뒤
    // legal_dong_codes.full_name 또는 sigungu_name 값을 화면용으로 가공해서 사용
    private String regionName;

    // 축제 시작일
    private LocalDate eventStartDate;

    // 축제 종료일
    private LocalDate eventEndDate;

    // 찜 여부
    // 캘린더에서 찜한 축제 표시 기능에 사용
    private Boolean favorite;
}