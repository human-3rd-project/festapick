package com.human.festapick.controller;

import com.human.festapick.dto.request.PasswordResetLinkRequestDto;
import com.human.festapick.dto.request.PasswordResetRequestDto;
import com.human.festapick.dto.response.ApiResponse;
import com.human.festapick.service.AccountService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/auth/account")
public class AccountController {

    // 계정 찾기와 비밀번호 재설정 흐름은 AccountService가 담당한다.
    private final AccountService accountService;

    // 가입 이메일로 로그인 ID를 찾고, 서비스에서 마스킹된 값을 반환한다.
    @GetMapping("/login-id")
    public ResponseEntity<ApiResponse<String>> findLoginIdByEmail(
            @RequestParam String email
    ) {
        return ResponseEntity.ok(ApiResponse.ok(accountService.findLoginIdByEmail(email)));
    }

    // 비밀번호 재설정은 메일 발송 -> 토큰 검증 -> 새 비밀번호 저장 순서로 호출된다.
    @PostMapping("/password-reset/request")
    public ResponseEntity<ApiResponse<Void>> requestPasswordReset(
            @Valid @RequestBody PasswordResetLinkRequestDto request
    ) {
        accountService.requestPasswordReset(request);
        return ResponseEntity.ok(ApiResponse.ok("메일이 발송되었습니다.", null));
    }

    @GetMapping("/password-reset/validate")
    public ResponseEntity<ApiResponse<Void>> validateResetToken(
            @RequestParam String token
    ) {
        accountService.validateResetToken(token);
        return ResponseEntity.ok(ApiResponse.ok("비밀번호 재설정 토큰 검증이 완료되었습니다.", null));
    }

    @PostMapping("/password-reset")
    public ResponseEntity<ApiResponse<Void>> resetPassword(
            @Valid @RequestBody PasswordResetRequestDto request
    ) {
        accountService.resetPassword(request);
        return ResponseEntity.ok(ApiResponse.ok("비밀번호 재설정이 완료되었습니다.", null));
    }
}
