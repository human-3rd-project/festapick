package com.human.festapick.controller;

import com.human.festapick.dto.response.ApiResponse;
import com.human.festapick.dto.response.FavoriteListResDto;
import com.human.festapick.security.CustomUserDetail;
import com.human.festapick.service.FestivalActionService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping
public class FestivalActionController {

    private final FestivalActionService festivalActionService;

    @PostMapping("/festivals/{festivalId}/favorites")
    public ResponseEntity<ApiResponse<Void>> addFavorite(
            @PathVariable Long festivalId,
            @AuthenticationPrincipal CustomUserDetail userDetail
    ) {
        // 인증된 사용자 ID와 축제 ID를 Service로 전달해 찜을 등록합니다.
        festivalActionService.addFavorite(userDetail.getUserId(), festivalId);

        // 등록 성공 여부는 공통 응답 형식으로 반환합니다.
        return ResponseEntity.ok(ApiResponse.ok("찜이 등록되었습니다.", null));
    }

    @DeleteMapping("/festivals/{festivalId}/favorites")
    public ResponseEntity<ApiResponse<Void>> cancelFavorite(
            @PathVariable Long festivalId,
            @AuthenticationPrincipal CustomUserDetail userDetail
    ) {
        // 인증된 사용자 ID와 축제 ID를 Service로 전달해 찜을 취소합니다.
        festivalActionService.cancelFavorite(userDetail.getUserId(), festivalId);

        // 취소 성공 여부는 공통 응답 형식으로 반환합니다.
        return ResponseEntity.ok(ApiResponse.ok("찜이 취소되었습니다.", null));
    }

    @GetMapping("/festivals/{festivalId}/favorites/me")
    public ResponseEntity<ApiResponse<Boolean>> isFavorite(
            @PathVariable Long festivalId,
            @AuthenticationPrincipal CustomUserDetail userDetail
    ) {
        // 현재 로그인 사용자가 해당 축제를 찜했는지 Service에서 조회합니다.
        boolean favorite = festivalActionService.isFavorite(userDetail.getUserId(), festivalId);

        // 조회 결과를 Boolean data로 감싸 반환합니다.
        return ResponseEntity.ok(ApiResponse.ok(favorite));
    }

    @GetMapping("/me/favorites")
    public ResponseEntity<ApiResponse<Page<FavoriteListResDto>>> getMyFavoriteList(
            @AuthenticationPrincipal CustomUserDetail userDetail,
            Pageable pageable
    ) {
        // 현재 로그인 사용자의 찜 목록을 페이지 단위로 조회합니다.
        Page<FavoriteListResDto> favorites =
                festivalActionService.getMyFavoriteList(userDetail.getUserId(), pageable);

        // Page 결과도 공통 응답 data에 그대로 담아 반환합니다.
        return ResponseEntity.ok(ApiResponse.ok(favorites));
    }

    @GetMapping("/festivals/{festivalId}/favorites/count")
    public ResponseEntity<ApiResponse<Long>> getFavoriteCount(@PathVariable Long festivalId) {
        // 특정 축제의 전체 찜 개수를 조회합니다.
        long favoriteCount = festivalActionService.getFavoriteCount(festivalId);

        // primitive long 값을 Long data로 감싸 반환합니다.
        return ResponseEntity.ok(ApiResponse.ok(favoriteCount));
    }

    @PostMapping("/festivals/{festivalId}/likes")
    public ResponseEntity<ApiResponse<Void>> addLike(
            @PathVariable Long festivalId,
            @AuthenticationPrincipal CustomUserDetail userDetail
    ) {
        // 인증된 사용자 ID와 축제 ID를 Service로 전달해 좋아요를 등록합니다.
        festivalActionService.addLike(userDetail.getUserId(), festivalId);

        // 등록 성공 여부는 공통 응답 형식으로 반환합니다.
        return ResponseEntity.ok(ApiResponse.ok("좋아요가 등록되었습니다.", null));
    }

    @DeleteMapping("/festivals/{festivalId}/likes")
    public ResponseEntity<ApiResponse<Void>> cancelLike(
            @PathVariable Long festivalId,
            @AuthenticationPrincipal CustomUserDetail userDetail
    ) {
        // 인증된 사용자 ID와 축제 ID를 Service로 전달해 좋아요를 취소합니다.
        festivalActionService.cancelLike(userDetail.getUserId(), festivalId);

        // 취소 성공 여부는 공통 응답 형식으로 반환합니다.
        return ResponseEntity.ok(ApiResponse.ok("좋아요가 취소되었습니다.", null));
    }

    @GetMapping("/festivals/{festivalId}/likes/me")
    public ResponseEntity<ApiResponse<Boolean>> isLiked(
            @PathVariable Long festivalId,
            @AuthenticationPrincipal CustomUserDetail userDetail
    ) {
        // 현재 로그인 사용자가 해당 축제를 좋아요했는지 Service에서 조회합니다.
        boolean liked = festivalActionService.isLiked(userDetail.getUserId(), festivalId);

        // 조회 결과를 Boolean data로 감싸 반환합니다.
        return ResponseEntity.ok(ApiResponse.ok(liked));
    }

    @GetMapping("/festivals/{festivalId}/likes/count")
    public ResponseEntity<ApiResponse<Long>> getLikeCount(@PathVariable Long festivalId) {
        // 특정 축제의 전체 좋아요 개수를 조회합니다.
        long likeCount = festivalActionService.getLikeCount(festivalId);

        // primitive long 값을 Long data로 감싸 반환합니다.
        return ResponseEntity.ok(ApiResponse.ok(likeCount));
    }
}
