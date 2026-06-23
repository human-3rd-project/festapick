package com.human.festapick.controller;

import com.human.festapick.dto.request.CalendarFilterReqDto;
import com.human.festapick.dto.response.ApiResponse;
import com.human.festapick.dto.response.CalendarResDto;
import com.human.festapick.dto.response.FestivalInfoResponseDto;
import com.human.festapick.entity.FestivalCategoryCodes;
import com.human.festapick.entity.LegalDongCodes;
import com.human.festapick.security.CustomUserDetail;
import com.human.festapick.service.CalendarService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.time.YearMonth;
import java.util.List;

@RestController
@RequestMapping("/calendar")
@RequiredArgsConstructor
public class CalendarController {

    private final CalendarService calendarService;

    // 월별 축제 조회: 요청받은 연월에 진행되는 축제 목록을 캘린더 화면에 내려줍니다.
    @GetMapping("/monthly")
    public ResponseEntity<ApiResponse<List<FestivalInfoResponseDto>>> getMonthlyFestivals(
            @RequestParam(required = false) @DateTimeFormat(pattern = "yyyy-MM") YearMonth targetMonth
    ) {
        return ResponseEntity.ok(ApiResponse.ok(calendarService.getMonthlyFestivals(targetMonth)));
    }

    // 지역 필터 조회: 캘린더 필터 옵션으로 사용할 활성 지역 목록을 내려줍니다.
    @GetMapping("/filters/regions")
    public ResponseEntity<ApiResponse<List<LegalDongCodes>>> getRegionFilters() {
        return ResponseEntity.ok(ApiResponse.ok(calendarService.getRegionFilters()));
    }

    // 테마 필터 조회: 캘린더 필터 옵션으로 사용할 활성 테마 목록을 내려줍니다.
    @GetMapping("/filters/themes")
    public ResponseEntity<ApiResponse<List<FestivalCategoryCodes>>> getThemeFilters() {
        return ResponseEntity.ok(ApiResponse.ok(calendarService.getThemeFilters()));
    }

    // 찜한 축제 일정 조회: 로그인 사용자의 찜 목록을 캘린더 일정 형태로 내려줍니다.
    @GetMapping("/favorites")
    public ResponseEntity<ApiResponse<Page<CalendarResDto>>> getFavoriteCalendars(
            @AuthenticationPrincipal CustomUserDetail userDetail,
            Pageable pageable
    ) {
        return ResponseEntity.ok(ApiResponse.ok(calendarService.getFavoriteCalendars(userDetail.getUserId(), pageable)));
    }

    // 캘린더 축제 조회: 연월, 지역, 테마, 찜 여부 조건으로 필터링된 일정 목록을 내려줍니다.
    @GetMapping(produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<ApiResponse<Page<CalendarResDto>>> getFilteredCalendars(
            @AuthenticationPrincipal CustomUserDetail userDetail,
            @Valid @ModelAttribute CalendarFilterReqDto request,
            Pageable pageable
    ) {
        return ResponseEntity.ok(ApiResponse.ok(calendarService.getFilteredCalendars(
                userDetail.getUserId(),
                request.getYear(),
                request.getMonth(),
                request.getLdongRegnCd(),
                request.getLdongSignguCd(),
                request.getCategoryCode(),
                request.getFavoriteOnly(),
                pageable
        )));
    }
}
