package com.human.festapick.controller;

import com.human.festapick.dto.request.MyRegionReqDto;
import com.human.festapick.dto.request.ProfileReqDto;
import com.human.festapick.dto.response.ApiResponse;
import com.human.festapick.dto.response.MyRegionResDto;
import com.human.festapick.dto.response.ProfileResDto;
import com.human.festapick.exception.CustomException;
import com.human.festapick.security.CustomUserDetail;
import com.human.festapick.service.UserService;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping("/users/me")
public class UserController {

    // 마이페이지 관련 API는 로그인한 사용자 본인의 userId만 서비스에 전달한다.
    private final UserService userService;

    // 프로필 조회/수정: 현재 로그인 사용자를 기준으로 처리한다.
    @GetMapping
    public ApiResponse<ProfileResDto> getMyProfile(
            @AuthenticationPrincipal CustomUserDetail userDetail
    ) {
        return ApiResponse.ok(userService.getMyProfile(getUserId(userDetail)));
    }

    @PatchMapping
    public ApiResponse<ProfileResDto> updateMyProfile(
            @AuthenticationPrincipal CustomUserDetail userDetail,
            @Valid @RequestBody ProfileReqDto request
    ) {
        return ApiResponse.ok(userService.updateMyProfile(getUserId(userDetail), request));
    }

    // 비밀번호 변경과 회원 탈퇴도 현재 로그인 사용자의 userId를 기준으로만 처리한다.
    @PostMapping("/password")
    public ApiResponse<Void> changeMyPassword(
            @AuthenticationPrincipal CustomUserDetail userDetail,
            @Valid @RequestBody PasswordChangeRequest request
    ) {
        userService.changeMyPassword(
                getUserId(userDetail),
                request.getCurrentPassword(),
                request.getNewPassword()
        );
        return ApiResponse.ok("비밀번호가 변경되었습니다.", null);
    }

    @DeleteMapping
    public ApiResponse<Void> deleteMyAccount(
            @AuthenticationPrincipal CustomUserDetail userDetail
    ) {
        userService.deleteMyAccount(getUserId(userDetail));
        return ApiResponse.ok("계정이 삭제되었습니다.", null);
    }

    @GetMapping("/region")
    public ApiResponse<MyRegionResDto> getMyRegion(
            @AuthenticationPrincipal CustomUserDetail userDetail
    ) {
        return ApiResponse.ok(userService.getMyRegion(getUserId(userDetail)));
    }

    // 관심 지역 조회/수정은 법정동 코드 검증까지 서비스에 위임한다.
    @PatchMapping("/region")
    public ApiResponse<MyRegionResDto> updateMyRegion(
            @AuthenticationPrincipal CustomUserDetail userDetail,
            @Valid @RequestBody MyRegionReqDto request
    ) {
        return ApiResponse.ok(userService.updateMyRegion(getUserId(userDetail), request));
    }

    private Long getUserId(CustomUserDetail userDetail) {
        // 인증이 필요한 API에서는 authentication.getName()이나 토큰 파싱을 사용하지 않는다.
        if (userDetail == null) {
            throw new CustomException(HttpStatus.UNAUTHORIZED, "로그인이 필요한 서비스입니다.");
        }

        return userDetail.getUserId();
    }

    @Getter
    @NoArgsConstructor
    public static class PasswordChangeRequest {

        // 비밀번호 변경 전용 요청값이다. 별도 서비스 로직 없이 UserService로 그대로 전달한다.
        @NotBlank(message = "현재 비밀번호는 필수 입력값입니다.")
        private String currentPassword;

        @NotBlank(message = "새 비밀번호는 필수 입력값입니다.")
        private String newPassword;
    }
}
