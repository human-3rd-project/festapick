package com.human.festapick.service;

import com.human.festapick.constant.OAuthProvider;
import com.human.festapick.constant.UserRole;
import com.human.festapick.constant.UserStatus;
import com.human.festapick.dto.response.KakaoLoginResponseDto;
import com.human.festapick.dto.response.KakaoTokenResponseDto;
import com.human.festapick.dto.response.KakaoUserInfoResponseDto;
import com.human.festapick.entity.Users;
import com.human.festapick.exception.CustomException;
import com.human.festapick.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.security.SecureRandom;
import java.time.LocalDateTime;
import java.util.Base64;

@Service
@RequiredArgsConstructor
@Transactional
public class KakaoAuthService {

    private static final int TEMPORARY_TOKEN_BYTES = 32;
    private static final int TEMPORARY_TOKEN_VALID_MINUTES = 10;
    private static final SecureRandom SECURE_RANDOM = new SecureRandom();

    private final KakaoApiClient kakaoApiClient;
    private final UserRepository userRepository;

    public KakaoLoginResponseDto loginWithKakaoCode(String code) {
        KakaoTokenResponseDto tokenResponse = kakaoApiClient.getAccessToken(code);

        if (tokenResponse == null || tokenResponse.getAccessToken() == null) {
            throw new CustomException(HttpStatus.BAD_GATEWAY, "카카오 액세스 토큰 발급에 실패했습니다.");
        }

        KakaoUserInfoResponseDto userInfo =
                kakaoApiClient.getUserInfo(tokenResponse.getAccessToken());

        if (userInfo == null || userInfo.getProviderId() == null) {
            throw new CustomException(HttpStatus.BAD_GATEWAY, "카카오 사용자 정보 조회에 실패했습니다.");
        }

        String providerId = String.valueOf(userInfo.getProviderId());

        return userRepository.findByProviderAndProviderId(OAuthProvider.KAKAO, providerId)
                .map(user -> resolveExistingKakaoUser(user, providerId))
                .orElseGet(() -> createTemporaryUser(providerId));
    }

    private KakaoLoginResponseDto resolveExistingKakaoUser(
            Users user,
            String providerId
    ) {
        // JWT생성 및 DTO프론트 넘기기
    }

    private boolean isSignupRequired(Users user) {
        return user.getEmail() == null
                || user.getNickname() == null
                || user.getTemporaryToken() != null;
    }

    private KakaoLoginResponseDto createTemporaryUser(String providerId) {
        String temporaryToken = generateUniqueTemporaryToken();
        LocalDateTime temporaryTokenExpiredAt =
                LocalDateTime.now().plusMinutes(TEMPORARY_TOKEN_VALID_MINUTES);

        Users user = Users.builder()
                .provider(OAuthProvider.KAKAO)
                .providerId(providerId)
                .role(UserRole.USER)
                .status(UserStatus.SUSPENDED)
                .temporaryToken(temporaryToken)
                .temporaryTokenExpiredAt(temporaryTokenExpiredAt)
                .build();

        Users savedUser = userRepository.save(user);

        return KakaoLoginResponseDto.temporaryUser(
                savedUser.getUserId(),
                providerId,
                temporaryToken,
                temporaryTokenExpiredAt
        );
    }

    private KakaoLoginResponseDto updateTemporaryToken(
            Users user,
            String providerId
    ) {
        String temporaryToken = generateUniqueTemporaryToken();
        LocalDateTime temporaryTokenExpiredAt =
                LocalDateTime.now().plusMinutes(TEMPORARY_TOKEN_VALID_MINUTES);

        user.setTemporaryToken(temporaryToken);
        user.setTemporaryTokenExpiredAt(temporaryTokenExpiredAt);

        return KakaoLoginResponseDto.temporaryUser(
                user.getUserId(),
                providerId,
                temporaryToken,
                temporaryTokenExpiredAt
        );
    }

    private String generateUniqueTemporaryToken() {
        String temporaryToken;

        do {
            temporaryToken = generateTemporaryToken();
        } while (userRepository.existsByTemporaryToken(temporaryToken));

        return temporaryToken;
    }

    private String generateTemporaryToken() {
        byte[] randomBytes = new byte[TEMPORARY_TOKEN_BYTES];
        SECURE_RANDOM.nextBytes(randomBytes);
        return Base64.getUrlEncoder()
                .withoutPadding()
                .encodeToString(randomBytes);
    }
}
