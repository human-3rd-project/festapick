package com.human.festapick.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.*;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;

@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Builder

public class LoginRequestDto {

    @NotBlank(message = "아이디를 입력해주세요")
    private String loginId;

    @NotBlank(message = "비밀번호를 입력해주세요")
    private String password;

    public UsernamePasswordAuthenticationToken toAuthenticationToken() {
        return new UsernamePasswordAuthenticationToken(loginId, password);
    }
}
