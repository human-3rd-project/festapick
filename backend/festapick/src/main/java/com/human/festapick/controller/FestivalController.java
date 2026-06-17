package com.human.festapick.controller;

import com.human.festapick.dto.request.FestivalSearchRequestDto;
import com.human.festapick.dto.response.ApiResponse;
import com.human.festapick.dto.response.FestivalDetailResponseDto;
import com.human.festapick.dto.response.FestivalInfoResponseDto;
import com.human.festapick.entity.FestivalCategoryCodes;
import com.human.festapick.entity.LegalDongCodes;
import com.human.festapick.service.FestivalService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDate;
import java.time.YearMonth;
import java.util.List;

@RestController
@RequestMapping("/festivals")
@RequiredArgsConstructor
public class FestivalController {

    private final FestivalService festivalService;

    // 축제 목록 조회: 활성 상태의 축제를 페이지 단위로 내려줍니다.
    @GetMapping
    public ResponseEntity<ApiResponse<Page<FestivalInfoResponseDto>>> getFestivalList(Pageable pageable) {
        return ResponseEntity.ok(ApiResponse.ok(festivalService.getFestivalList(pageable)));
    }

    // 축제 통합 검색: 키워드, 지역, 테마, 기간 조건을 조합해 축제를 검색합니다.
    @GetMapping("/search")
    public ResponseEntity<ApiResponse<Page<FestivalInfoResponseDto>>> searchFestivals(
            @ModelAttribute FestivalSearchRequestDto request,
            Pageable pageable
    ) {
        return ResponseEntity.ok(ApiResponse.ok(festivalService.searchFestivals(request, pageable)));
    }

    // 키워드 검색: 축제 제목 기준으로 검색합니다.
    @GetMapping("/search/keyword")
    public ResponseEntity<ApiResponse<Page<FestivalInfoResponseDto>>> searchByKeyword(
            @RequestParam String keyword,
            Pageable pageable
    ) {
        return ResponseEntity.ok(ApiResponse.ok(festivalService.searchByKeyword(keyword, pageable)));
    }

    // 지역 검색: 법정동 시도/시군구 코드 기준으로 검색합니다.
    @GetMapping("/search/region")
    public ResponseEntity<ApiResponse<Page<FestivalInfoResponseDto>>> searchByRegion(
            @RequestParam(required = false) String ldongRegnCd,
            @RequestParam(required = false) String ldongSignguCd,
            Pageable pageable
    ) {
        return ResponseEntity.ok(ApiResponse.ok(festivalService.searchByRegion(ldongRegnCd, ldongSignguCd, pageable)));
    }

    // 테마 검색: 축제 분류/테마 코드 기준으로 검색합니다.
    @GetMapping("/search/theme")
    public ResponseEntity<ApiResponse<Page<FestivalInfoResponseDto>>> searchByTheme(
            @RequestParam String lclsSystm,
            Pageable pageable
    ) {
        return ResponseEntity.ok(ApiResponse.ok(festivalService.searchByTheme(lclsSystm, pageable)));
    }

    // 기간 검색: 입력 기간과 축제 기간이 겹치는 축제를 검색합니다.
    @GetMapping("/search/period")
    public ResponseEntity<ApiResponse<Page<FestivalInfoResponseDto>>> searchByPeriod(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate,
            Pageable pageable
    ) {
        return ResponseEntity.ok(ApiResponse.ok(festivalService.searchByPeriod(startDate, endDate, pageable)));
    }

    // 지도 표시용 축제 조회: 지도에 마커로 표시 가능한 축제 목록을 내려줍니다.
    @GetMapping("/map")
    public ResponseEntity<ApiResponse<List<FestivalInfoResponseDto>>> getMapFestivals(
            @RequestParam(required = false) String ldongRegnCd,
            @RequestParam(required = false) String ldongSignguCd
    ) {
        return ResponseEntity.ok(ApiResponse.ok(festivalService.getMapFestivals(ldongRegnCd, ldongSignguCd)));
    }

    // 월별 축제 조회: 선택한 연월과 기간이 겹치는 축제 목록을 내려줍니다.
    @GetMapping("/monthly")
    public ResponseEntity<ApiResponse<List<FestivalInfoResponseDto>>> getMonthlyFestivals(
            @RequestParam(required = false) @DateTimeFormat(pattern = "yyyy-MM") YearMonth targetMonth
    ) {
        return ResponseEntity.ok(ApiResponse.ok(festivalService.getMonthlyFestivals(targetMonth)));
    }

    // 지역 필터 조회: 프론트 필터 옵션으로 사용할 활성 지역 목록을 내려줍니다.
    @GetMapping("/filters/regions")
    public ResponseEntity<ApiResponse<List<LegalDongCodes>>> getRegionFilters() {
        return ResponseEntity.ok(ApiResponse.ok(festivalService.getRegionFilters()));
    }

    // 테마 필터 조회: 프론트 필터 옵션으로 사용할 활성 테마 목록을 내려줍니다.
    @GetMapping("/filters/themes")
    public ResponseEntity<ApiResponse<List<FestivalCategoryCodes>>> getThemeFilters() {
        return ResponseEntity.ok(ApiResponse.ok(festivalService.getThemeFilters()));
    }

    // 축제 상세 조회: 기본 정보, 이미지, 위치, 리뷰 통계, 채팅방 ID를 내려줍니다.
    @GetMapping("/{festivalId}")
    public ResponseEntity<ApiResponse<FestivalDetailResponseDto>> getFestivalDetail(
            @PathVariable Long festivalId
    ) {
        return ResponseEntity.ok(ApiResponse.ok(festivalService.getFestivalDetail(festivalId)));
    }

    // 축제 위치 조회: 지도 표시용 상세 위치 정보를 내려줍니다.
    @GetMapping("/{festivalId}/location")
    public ResponseEntity<ApiResponse<FestivalDetailResponseDto>> getFestivalLocation(
            @PathVariable Long festivalId
    ) {
        return ResponseEntity.ok(ApiResponse.ok(festivalService.getFestivalLocation(festivalId)));
    }
}
