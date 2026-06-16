package com.human.festapick.controller;

import com.human.festapick.dto.request.ReviewReqDto;
import com.human.festapick.dto.response.ApiResponse;
import com.human.festapick.dto.response.MyReviewResDto;
import com.human.festapick.dto.response.ReviewResDto;
import com.human.festapick.security.CustomUserDetail;
import com.human.festapick.service.ReviewService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping
public class ReviewController {

    private final ReviewService reviewService;

    @GetMapping("/festivals/{festivalId}/reviews")
    public ApiResponse<Page<ReviewResDto>> getReviewList(
            @PathVariable Long festivalId,
            Pageable pageable
    ) {
        // 축제 ID와 페이지 정보를 Service로 넘겨 리뷰 목록을 조회합니다.
        Page<ReviewResDto> reviews = reviewService.getReviewList(festivalId, pageable);

        // 조회된 Page 결과를 공통 응답 data에 담아 반환합니다.
        return ApiResponse.ok(reviews);
    }

    @PostMapping("/reviews")
    public ApiResponse<ReviewResDto> createReview(
            @AuthenticationPrincipal CustomUserDetail userDetail,
            @Valid @RequestBody ReviewReqDto request
    ) {
        // 인증된 사용자 ID와 요청 본문을 Service로 넘겨 리뷰를 작성합니다.
        ReviewResDto review = reviewService.createReview(userDetail.getUserId(), request);

        // 생성된 리뷰 DTO를 공통 응답 data에 담아 반환합니다.
        return ApiResponse.ok("리뷰가 작성되었습니다.", review);
    }

    @PutMapping("/reviews/{reviewId}")
    public ApiResponse<ReviewResDto> updateReview(
            @PathVariable Long reviewId,
            @AuthenticationPrincipal CustomUserDetail userDetail,
            @Valid @RequestBody ReviewReqDto request
    ) {
        // 인증된 사용자 ID로 본인 리뷰인지 확인하는 책임은 Service에 위임합니다.
        ReviewResDto review = reviewService.updateReview(userDetail.getUserId(), reviewId, request);

        // 수정된 리뷰 DTO를 공통 응답 data에 담아 반환합니다.
        return ApiResponse.ok("리뷰가 수정되었습니다.", review);
    }

    @DeleteMapping("/reviews/{reviewId}")
    public ApiResponse<Void> deleteReview(
            @PathVariable Long reviewId,
            @AuthenticationPrincipal CustomUserDetail userDetail
    ) {
        // 인증된 사용자 ID로 본인 리뷰인지 확인하고 삭제 처리하는 책임은 Service에 위임합니다.
        reviewService.deleteReview(userDetail.getUserId(), reviewId);

        // 삭제 성공 여부는 공통 응답 형식으로 반환합니다.
        return ApiResponse.ok("리뷰가 삭제되었습니다.", null);
    }

    @GetMapping("/me/reviews")
    public ApiResponse<Page<MyReviewResDto>> getMyReviewList(
            @AuthenticationPrincipal CustomUserDetail userDetail,
            Pageable pageable
    ) {
        // 현재 로그인 사용자가 작성한 리뷰 목록을 페이지 단위로 조회합니다.
        Page<MyReviewResDto> reviews = reviewService.getMyReviewList(userDetail.getUserId(), pageable);

        // Page 결과를 공통 응답 data에 담아 반환합니다.
        return ApiResponse.ok(reviews);
    }

    @GetMapping("/festivals/{festivalId}/reviews/count")
    public ApiResponse<Long> getReviewCount(@PathVariable Long festivalId) {
        // 특정 축제의 활성 리뷰 개수를 조회합니다.
        long reviewCount = reviewService.getReviewCount(festivalId);

        // primitive long 값을 Long data로 감싸 반환합니다.
        return ApiResponse.ok(reviewCount);
    }
}
