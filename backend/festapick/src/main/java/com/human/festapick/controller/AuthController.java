package com.human.festapick.controller;

import com.human.festapick.dto.request.LoginRequestDto;
import com.human.festapick.dto.request.SignupRequestDto;
import com.human.festapick.dto.request.SocialSignupRequestDto;
import com.human.festapick.dto.response.ApiResponse;
import com.human.festapick.dto.response.LoginResponseDto;
import com.human.festapick.exception.CustomException;
import com.human.festapick.security.CustomUserDetail;
import com.human.festapick.service.AuthService;
import com.human.festapick.service.KakaoAuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping("/auth")
public class AuthController {

    // 인증 관련 요청은 컨트롤러에서 검증 흐름을 만들지 않고 AuthService/KakaoAuthService로 위임한다.
    private final AuthService authService;
    private final KakaoAuthService kakaoAuthService;

    // 회원가입 화면에서 사용하는 중복 확인 API들이다.
    @GetMapping("/check-login-id")
    public ApiResponse<Boolean> checkLoginIdDuplicate(
            @RequestParam String loginId
    ) {
        return ApiResponse.ok(authService.checkLoginIdDuplicate(loginId));
    }

    @GetMapping("/check-nickname")
    public ApiResponse<Boolean> checkNicknameDuplicate(
            @RequestParam String nickname
    ) {
        return ApiResponse.ok(authService.checkNicknameDuplicate(nickname));
    }

    @GetMapping("/check-email")
    public ApiResponse<Boolean> checkEmailDuplicate(
            @RequestParam String email
    ) {
        return ApiResponse.ok(authService.checkEmailDuplicate(email));
    }

    // 일반 회원가입/로그인은 입력 DTO를 받아 서비스에 넘기고, 결과만 ApiResponse로 감싼다.
    @PostMapping("/signup")
    public ApiResponse<Void> signup(
            @Valid @RequestBody SignupRequestDto request
    ) {
        authService.signup(request);
        return ApiResponse.ok("회원가입이 완료되었습니다.", null);
    }

    @PostMapping("/login")
    public ApiResponse<LoginResponseDto> login(
            @Valid @RequestBody LoginRequestDto request
    ) {
        return ApiResponse.ok(authService.login(request));
    }

    // 카카오 인가 코드 로그인은 기존 회원이면 토큰을, 신규 회원이면 추가 가입 정보를 반환한다.
    @GetMapping("/kakao/login")
    public ApiResponse<Object> kakaoLogin(
            @RequestParam String code
    ) {
        return ApiResponse.ok(kakaoAuthService.loginWithKakaoCode(code));
    }

    @PostMapping("/social/signup")
    public ApiResponse<LoginResponseDto> socialSignup(
            @RequestHeader("Temporary-Token") String temporaryToken,
            @Valid @RequestBody SocialSignupRequestDto request
    ) {
        return ApiResponse.ok(kakaoAuthService.completeSocialSignup(temporaryToken, request));
    }

    // 토큰 재발급/로그아웃은 저장된 Refresh Token 상태를 기준으로 서비스에서 처리한다.
    @PostMapping("/reissue")
    public ApiResponse<LoginResponseDto> reissue(
            @RequestHeader("Refresh-Token") String refreshToken
    ) {
        return ApiResponse.ok(authService.reissueAccessToken(refreshToken));
    }

    @PostMapping("/logout")
    public ApiResponse<Void> logout(
            @AuthenticationPrincipal CustomUserDetail userDetail
    ) {
        // 로그아웃 대상 사용자는 JWT 파싱 대신 SecurityContext에 주입된 principal에서 가져온다.
        if (userDetail == null) {
            throw new CustomException(HttpStatus.UNAUTHORIZED, "로그인이 필요한 서비스입니다.");
        }

        authService.logout(userDetail.getUserId());
        return ApiResponse.ok("로그아웃이 완료되었습니다.", null);
    }
}
