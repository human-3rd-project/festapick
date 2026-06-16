package com.human.festapick.controller;

import com.human.festapick.dto.request.EmailVerificationRequestDto;
import com.human.festapick.dto.response.ApiResponse;
import com.human.festapick.service.EmailVerificationService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping("/auth/email-verifications")
public class EmailVerificationController {

    // 이메일 인증 코드 발송과 검증은 회원가입 전에 사용하는 공개 인증 보조 API다.
    private final EmailVerificationService emailVerificationService;

    // 인증 코드 생성, 저장, 메일 발송은 서비스에 위임한다.
    @PostMapping("/send")
    public ApiResponse<Void> sendVerificationCode(
            @RequestParam String email
    ) {
        emailVerificationService.sendVerificationCode(email);
        return ApiResponse.ok("Verification code sent.", null);
    }

    // 사용자가 입력한 인증 코드를 검증하고, 성공하면 이후 회원가입에서 인증 완료로 판단한다.
    @PostMapping("/verify")
    public ApiResponse<Void> verifyEmail(
            @Valid @RequestBody EmailVerificationRequestDto request
    ) {
        emailVerificationService.verifyEmail(request);
        return ApiResponse.ok("Email verified.", null);
    }
}
