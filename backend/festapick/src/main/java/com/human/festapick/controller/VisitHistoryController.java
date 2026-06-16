package com.human.festapick.controller;

import com.human.festapick.dto.request.VisitHistoryReqDto;
import com.human.festapick.dto.response.ApiResponse;
import com.human.festapick.dto.response.VisitHistoryResDto;
import com.human.festapick.security.CustomUserDetail;
import com.human.festapick.service.VisitHistoryService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/visit-histories")
public class VisitHistoryController {

    private final VisitHistoryService visitHistoryService;

    @PostMapping
    public ApiResponse<VisitHistoryResDto> createVisitHistory(
            @AuthenticationPrincipal CustomUserDetail userDetail,
            @Valid @RequestBody VisitHistoryReqDto request
    ) {
        // 인증된 사용자 ID와 요청 본문을 Service로 넘겨 방문 기록을 저장합니다.
        VisitHistoryResDto visitHistory =
                visitHistoryService.createVisitHistory(userDetail.getUserId(), request);

        // 저장된 방문 기록 DTO를 공통 응답 data에 담아 반환합니다.
        return ApiResponse.ok("방문 기록이 저장되었습니다.", visitHistory);
    }

    @GetMapping
    public ApiResponse<List<VisitHistoryResDto>> getVisitHistoryList(
            @AuthenticationPrincipal CustomUserDetail userDetail,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate
    ) {
        // 인증된 사용자 ID와 조회 기간을 Service로 넘겨 기간별 방문 기록을 조회합니다.
        List<VisitHistoryResDto> visitHistories =
                visitHistoryService.getVisitHistoryList(userDetail.getUserId(), startDate, endDate);

        // 조회된 목록을 공통 응답 data에 담아 반환합니다.
        return ApiResponse.ok(visitHistories);
    }

    @GetMapping("/{visitHistoryId}")
    public ApiResponse<VisitHistoryResDto> getVisitHistory(
            @PathVariable Long visitHistoryId,
            @AuthenticationPrincipal CustomUserDetail userDetail
    ) {
        // 인증된 사용자 ID로 본인 방문 기록인지 확인하는 책임은 Service에 위임합니다.
        VisitHistoryResDto visitHistory =
                visitHistoryService.getVisitHistory(userDetail.getUserId(), visitHistoryId);

        // 상세 DTO를 공통 응답 data에 담아 반환합니다.
        return ApiResponse.ok(visitHistory);
    }

    @PutMapping("/{visitHistoryId}")
    public ApiResponse<VisitHistoryResDto> updateVisitHistory(
            @PathVariable Long visitHistoryId,
            @AuthenticationPrincipal CustomUserDetail userDetail,
            @Valid @RequestBody VisitHistoryReqDto request
    ) {
        // 인증된 사용자 ID와 요청 본문을 Service로 넘겨 본인 방문 기록을 수정합니다.
        VisitHistoryResDto visitHistory =
                visitHistoryService.updateVisitHistory(userDetail.getUserId(), visitHistoryId, request);

        // 수정된 방문 기록 DTO를 공통 응답 data에 담아 반환합니다.
        return ApiResponse.ok("방문 기록이 수정되었습니다.", visitHistory);
    }

    @DeleteMapping("/{visitHistoryId}")
    public ApiResponse<Void> deleteVisitHistory(
            @PathVariable Long visitHistoryId,
            @AuthenticationPrincipal CustomUserDetail userDetail
    ) {
        // 인증된 사용자 ID로 본인 방문 기록인지 확인하고 삭제하는 책임은 Service에 위임합니다.
        visitHistoryService.deleteVisitHistory(userDetail.getUserId(), visitHistoryId);

        // 삭제 성공 여부는 공통 응답 형식으로 반환합니다.
        return ApiResponse.ok("방문 기록이 삭제되었습니다.", null);
    }

    @GetMapping("/count")
    public ApiResponse<Long> getVisitHistoryCount(
            @AuthenticationPrincipal CustomUserDetail userDetail
    ) {
        // 현재 로그인 사용자의 전체 방문 기록 개수를 조회합니다.
        long visitHistoryCount = visitHistoryService.getVisitHistoryCount(userDetail.getUserId());

        // primitive long 값을 Long data로 감싸 반환합니다.
        return ApiResponse.ok(visitHistoryCount);
    }
}
