package com.human.festapick.dto.response;

import lombok.*;

@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Setter
public class LoginResponseDto {

    private String grantType;
    private String accessToken;
    private String refreshToken;
    private Long accessTokenExpiresIn;

    private String nickname;
    private String profileImageUrl;
}
