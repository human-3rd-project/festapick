package com.human.festapick.dto.response;

import com.fasterxml.jackson.annotation.JsonAlias;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@JsonIgnoreProperties(ignoreUnknown = true)
public class TourFestivalItemDto {

    // TourAPI 콘텐츠 ID입니다. 우리 DB의 Festivals.contentId와 매칭합니다.
    @JsonAlias({"contentid", "contentId"})
    private String contentId;

    // TourAPI 콘텐츠 타입 ID입니다. 축제/공연/행사 타입 구분에 사용합니다.
    @JsonAlias({"contenttypeid", "contentTypeId"})
    private String contentTypeId;

    // 축제명입니다.
    private String title;

    // 기본 주소입니다.
    private String addr1;

    // 상세 주소입니다.
    private String addr2;

    // 우편번호입니다.
    @JsonAlias({"zipcode", "zipCode"})
    private String zipcode;

    // 한국관광공사 대/중/소 분류 코드입니다.
    private String cat1;
    private String cat2;
    private String cat3;

    // TourAPI 생성 시각입니다. yyyyMMddHHmmss 형식 문자열로 내려옵니다.
    @JsonAlias({"createdtime", "createdTime"})
    private String createdTime;

    // TourAPI 수정 시각입니다. yyyyMMddHHmmss 형식 문자열로 내려옵니다.
    @JsonAlias({"modifiedtime", "modifiedTime"})
    private String modifiedTime;

    // 축제 시작일입니다. yyyyMMdd 형식 문자열로 내려옵니다.
    @JsonAlias({"eventstartdate", "eventStartDate"})
    private String eventStartDate;

    // 축제 종료일입니다. yyyyMMdd 형식 문자열로 내려옵니다.
    @JsonAlias({"eventenddate", "eventEndDate"})
    private String eventEndDate;

    // 대표 이미지 URL입니다.
    @JsonAlias({"firstimage", "firstImage"})
    private String firstImage;

    // 썸네일 또는 보조 대표 이미지 URL입니다.
    @JsonAlias({"firstimage2", "firstImage2"})
    private String firstImage2;

    // 이미지 저작권 타입입니다.
    @JsonAlias({"cpyrhtDivCd", "copyrightType"})
    private String copyrightType;

    // 지도 X 좌표입니다. TourAPI는 문자열로 내려주므로 Service에서 BigDecimal로 변환합니다.
    @JsonAlias({"mapx", "mapX"})
    private String mapX;

    // 지도 Y 좌표입니다. TourAPI는 문자열로 내려주므로 Service에서 BigDecimal로 변환합니다.
    @JsonAlias({"mapy", "mapY"})
    private String mapY;

    // 지도 확대 레벨입니다.
    @JsonAlias({"mlevel", "mapLevel"})
    private String mapLevel;

    // 연락처입니다.
    private String tel;

    // 법정동 시도 코드입니다.
    @JsonAlias({"lDongRegnCd", "ldongRegnCd"})
    private String ldongRegnCd;

    // 법정동 시군구 코드입니다.
    @JsonAlias({"lDongSignguCd", "ldongSignguCd"})
    private String ldongSignguCd;

    // TourAPI 서비스분류체계 대/중/소 코드입니다.
    @JsonAlias({"lclsSystm1", "lclsSystm1Cd"})
    private String lclsSystm1;

    @JsonAlias({"lclsSystm2", "lclsSystm2Cd"})
    private String lclsSystm2;

    @JsonAlias({"lclsSystm3", "lclsSystm3Cd"})
    private String lclsSystm3;

    // TourAPI 진행 상태입니다. 예: 선택안함
    @JsonAlias({"progresstype", "progressType"})
    private String progressType;

    // TourAPI 축제 유형입니다.
    @JsonAlias({"festivaltype", "festivalType"})
    private String festivalType;
}
