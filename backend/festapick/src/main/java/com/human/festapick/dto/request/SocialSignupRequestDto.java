package com.human.festapick.dto.request;

import jakarta.validation.constraints.AssertTrue;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.*;

@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Builder
public class SocialSignupRequestDto {

    @NotBlank(message = "이메일 정보가 없습니다.")
    @Email(message = "올바른 이메일 형식이 아닙니다.")
    private String email;

    @NotBlank(message = "닉네임을 입력해주세요.")
    private String nickname;

    @AssertTrue(message = "약관 동의는 필수입니다.")
    private boolean termsAgreed;
}