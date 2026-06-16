package com.human.festapick.controller;

import com.human.festapick.constant.UserRole;
import com.human.festapick.dto.request.UserManageReqDto;
import com.human.festapick.dto.response.ApiResponse;
import com.human.festapick.dto.response.DonationManageResDto;
import com.human.festapick.dto.response.FestivalInfoResponseDto;
import com.human.festapick.dto.response.ReviewResDto;
import com.human.festapick.dto.response.UserManageResDto;
import com.human.festapick.exception.CustomException;
import com.human.festapick.security.CustomUserDetail;
import com.human.festapick.service.AdminService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/admin")
@RequiredArgsConstructor
public class AdminController {

    private final AdminService adminService;

    @GetMapping("/users/search")
    public ResponseEntity<ApiResponse<Page<UserManageResDto>>> searchUsers(
            @AuthenticationPrincipal CustomUserDetail userDetail,
            @RequestParam(required = false) String keyword,
            Pageable pageable
    ) {
        requireAdmin(userDetail);

        return ResponseEntity.ok(ApiResponse.ok(adminService.searchUsers(keyword, pageable)));
    }

    @PatchMapping("/users/status")
    public ResponseEntity<ApiResponse<UserManageResDto>> changeUserStatus(
            @AuthenticationPrincipal CustomUserDetail userDetail,
            @Valid @RequestBody(required = false) UserManageReqDto request
    ) {
        requireAdmin(userDetail);

        UserManageResDto user = adminService.changeUserStatus(request);
        return ResponseEntity.ok(ApiResponse.ok("회원 상태가 변경되었습니다.", user));
    }

    @GetMapping("/reviews/search")
    public ResponseEntity<ApiResponse<Page<ReviewResDto>>> searchReviews(
            @AuthenticationPrincipal CustomUserDetail userDetail,
            @RequestParam(required = false) String keyword,
            Pageable pageable
    ) {
        requireAdmin(userDetail);

        return ResponseEntity.ok(ApiResponse.ok(adminService.searchReviews(keyword, pageable)));
    }

    @DeleteMapping("/reviews/{reviewId}")
    public ResponseEntity<ApiResponse<Void>> deleteReview(
            @AuthenticationPrincipal CustomUserDetail userDetail,
            @PathVariable Long reviewId
    ) {
        requireAdmin(userDetail);

        adminService.deleteReview(reviewId);
        return ResponseEntity.ok(ApiResponse.<Void>ok("리뷰가 삭제되었습니다.", null));
    }

    @GetMapping("/festivals/search")
    public ResponseEntity<ApiResponse<Page<FestivalInfoResponseDto>>> searchFestivals(
            @AuthenticationPrincipal CustomUserDetail userDetail,
            @RequestParam(required = false) String keyword,
            Pageable pageable
    ) {
        requireAdmin(userDetail);

        return ResponseEntity.ok(ApiResponse.ok(adminService.searchFestivals(keyword, pageable)));
    }

    @DeleteMapping("/festivals/{festivalId}")
    public ResponseEntity<ApiResponse<Void>> deleteFestival(
            @AuthenticationPrincipal CustomUserDetail userDetail,
            @PathVariable Long festivalId
    ) {
        requireAdmin(userDetail);

        adminService.deleteFestival(festivalId);
        return ResponseEntity.ok(ApiResponse.<Void>ok("축제가 삭제되었습니다.", null));
    }

    @GetMapping("/donations/search")
    public ResponseEntity<ApiResponse<Page<DonationManageResDto>>> searchDonations(
            @AuthenticationPrincipal CustomUserDetail userDetail,
            @RequestParam(required = false) String keyword,
            Pageable pageable
    ) {
        requireAdmin(userDetail);

        return ResponseEntity.ok(ApiResponse.ok(adminService.searchDonations(keyword, pageable)));
    }

    private Long requireAdmin(CustomUserDetail userDetail) {
        if (userDetail == null) {
            throw new CustomException(HttpStatus.UNAUTHORIZED, "로그인이 필요합니다.");
        }

        if (!UserRole.ADMIN.name().equals(userDetail.getRole())) {
            throw new CustomException(HttpStatus.FORBIDDEN, "관리자 권한이 필요합니다.");
        }

        return userDetail.getUserId();
    }
}
