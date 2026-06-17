package com.human.festapick.controller;

import com.human.festapick.dto.response.ApiResponse;
import com.human.festapick.dto.response.FestivalInfoResponseDto;
import com.human.festapick.dto.response.MainPageResponseDto;
import com.human.festapick.service.MainService;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.time.YearMonth;
import java.util.List;

@RestController
@RequestMapping("/main")
@RequiredArgsConstructor
public class MainController {

    private final MainService mainService;

    // 메인 화면 조회: 주변 추천, 월별 전국 축제, 채팅 참여자 기준 인기 축제를 한 번에 내려줍니다.
    @GetMapping
    public ResponseEntity<ApiResponse<MainPageResponseDto>> getMainPage(
            @RequestParam(required = false) String ldongRegnCd,
            @RequestParam(required = false) String ldongSignguCd
    ) {
        return ResponseEntity.ok(ApiResponse.ok(mainService.getMainPage(ldongRegnCd, ldongSignguCd)));
    }

    // 메인 배너 축제 조회: 조회수, 좋아요, 찜 수가 높은 활성 축제를 배너용 목록으로 내려줍니다.
    @GetMapping("/banners")
    public ResponseEntity<ApiResponse<List<FestivalInfoResponseDto>>> getBannerFestivals() {
        return ResponseEntity.ok(ApiResponse.ok(mainService.getBannerFestivals()));
    }

    // 주변 추천 축제 조회: 사용자의 지역 코드 기준으로 진행 예정 또는 진행 중인 축제를 추천합니다.
    @GetMapping("/nearby")
    public ResponseEntity<ApiResponse<List<FestivalInfoResponseDto>>> getNearbyFestivalRecommendations(
            @RequestParam(required = false) String ldongRegnCd,
            @RequestParam(required = false) String ldongSignguCd
    ) {
        return ResponseEntity.ok(ApiResponse.ok(
                mainService.getNearbyFestivalRecommendations(ldongRegnCd, ldongSignguCd)
        ));
    }

    // 월별 전국 축제 조회: 선택한 연월과 축제 기간이 겹치는 전국 축제 목록을 내려줍니다.
    @GetMapping("/monthly")
    public ResponseEntity<ApiResponse<List<FestivalInfoResponseDto>>> getMonthlyNationalFestivals(
            @RequestParam(required = false) @DateTimeFormat(pattern = "yyyy-MM") YearMonth targetMonth
    ) {
        return ResponseEntity.ok(ApiResponse.ok(mainService.getMonthlyNationalFestivals(targetMonth)));
    }

    // 실시간 인기 축제 조회: 페이지 조회 시점의 채팅방 참여 인원 기준 인기 축제를 내려줍니다.
    @GetMapping("/popular")
    public ResponseEntity<ApiResponse<List<FestivalInfoResponseDto>>> getRealtimePopularFestivals() {
        return ResponseEntity.ok(ApiResponse.ok(mainService.getMainPage(null, null).getPopularFestivals()));
    }
}
