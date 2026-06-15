package com.human.festapick.dto.response;

import com.human.festapick.constant.OAuthProvider;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class KakaoLoginResponseDto {

    private boolean signupRequired;
    private Long userId;
    private OAuthProvider provider;
    private String providerId;
    private String temporaryToken;
    private LocalDateTime temporaryTokenExpiredAt;
    private String nickname;
    private String profileImageUrl;

    public static KakaoLoginResponseDto existingUser(
            Long userId,
            String providerId,
            String nickname,
            String profileImageUrl
    ) {
        return KakaoLoginResponseDto.builder()
                .signupRequired(false)
                .userId(userId)
                .provider(OAuthProvider.KAKAO)
                .providerId(providerId)
                .nickname(nickname)
                .profileImageUrl(profileImageUrl)
                .build();
    }

    public static KakaoLoginResponseDto temporaryUser(
            Long userId,
            String providerId,
            String temporaryToken,
            LocalDateTime temporaryTokenExpiredAt
    ) {
        return KakaoLoginResponseDto.builder()
                .signupRequired(true)
                .userId(userId)
                .provider(OAuthProvider.KAKAO)
                .providerId(providerId)
                .temporaryToken(temporaryToken)
                .temporaryTokenExpiredAt(temporaryTokenExpiredAt)
                .build();
    }
}
