package com.human.festapick.service;

import com.human.festapick.constant.OAuthProvider;
import com.human.festapick.constant.UserRole;
import com.human.festapick.constant.UserStatus;
import com.human.festapick.dto.request.SocialSignupRequestDto;
import com.human.festapick.dto.response.KakaoLoginResponseDto;
import com.human.festapick.dto.response.KakaoTokenResponseDto;
import com.human.festapick.dto.response.KakaoUserInfoResponseDto;
import com.human.festapick.dto.response.LoginResponseDto;
import com.human.festapick.entity.RefreshTokens;
import com.human.festapick.entity.Users;
import com.human.festapick.exception.CustomException;
import com.human.festapick.repository.RefreshTokenRepository;
import com.human.festapick.repository.UserRepository;
import com.human.festapick.security.CustomUserDetail;
import com.human.festapick.security.TokenProvider;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.security.SecureRandom;
import java.time.LocalDateTime;
import java.util.Base64;
import java.util.Collections;

@Service
@RequiredArgsConstructor
@Transactional
public class KakaoAuthService {

    private static final int TEMPORARY_TOKEN_BYTES = 32;
    private static final int TEMPORARY_TOKEN_VALID_MINUTES = 10;
    private static final SecureRandom SECURE_RANDOM = new SecureRandom();

    private final KakaoApiClient kakaoApiClient;
    private final UserRepository userRepository;
    private final RefreshTokenRepository refreshTokenRepository;
    private final TokenProvider tokenProvider;

    public Object loginWithKakaoCode(String code) {
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

    public LoginResponseDto completeSocialSignup(
            String temporaryToken,
            SocialSignupRequestDto request
    ) {
        if (temporaryToken == null || temporaryToken.isBlank()) {
            throw new CustomException(HttpStatus.BAD_REQUEST, "임시 토큰이 필요합니다.");
        }

        Users user = userRepository.findByTemporaryToken(temporaryToken)
                .orElseThrow(() ->
                        new CustomException(HttpStatus.UNAUTHORIZED, "유효하지 않은 임시 토큰입니다.")
                );

        return completeSocialSignup(user, request);
    }

    public LoginResponseDto completeSocialSignup(
            Long userId,
            SocialSignupRequestDto request
    ) {
        if (userId == null) {
            throw new CustomException(HttpStatus.BAD_REQUEST, "사용자 식별값이 필요합니다.");
        }

        Users user = userRepository.findById(userId)
                .orElseThrow(() ->
                        new CustomException(HttpStatus.NOT_FOUND, "사용자를 찾을 수 없습니다.")
                );

        return completeSocialSignup(user, request);
    }

    private Object resolveExistingKakaoUser(
            Users user,
            String providerId
    ) {
        if (isSignupRequired(user)) {
            return updateTemporaryToken(user, providerId);
        }

        if (user.getStatus() != UserStatus.ACTIVE) {
            throw new CustomException(HttpStatus.FORBIDDEN, "활성 회원이 아닙니다.");
        }

        return issueLoginToken(user);
    }

    private LoginResponseDto completeSocialSignup(
            Users user,
            SocialSignupRequestDto request
    ) {
        validateSocialSignupRequest(request);
        validateTemporaryUser(user);
        validateSocialSignupDuplicate(request);

        user.setEmail(request.getEmail());
        user.setNickname(request.getNickname());
        user.setStatus(UserStatus.ACTIVE);
        user.setTemporaryToken(null);
        user.setTemporaryTokenExpiredAt(null);

        return issueLoginToken(user);
    }

    private void validateSocialSignupRequest(SocialSignupRequestDto request) {
        if (request == null) {
            throw new CustomException(HttpStatus.BAD_REQUEST, "회원가입 정보가 필요합니다.");
        }

        if (request.getEmail() == null || request.getEmail().isBlank()) {
            throw new CustomException(HttpStatus.BAD_REQUEST, "이메일 정보가 없습니다.");
        }

        if (request.getNickname() == null || request.getNickname().isBlank()) {
            throw new CustomException(HttpStatus.BAD_REQUEST, "닉네임을 입력해주세요.");
        }

        if (!request.isTermsAgreed()) {
            throw new CustomException(HttpStatus.BAD_REQUEST, "약관 동의는 필수입니다.");
        }
    }

    private void validateTemporaryUser(Users user) {
        if (user.getProvider() != OAuthProvider.KAKAO) {
            throw new CustomException(HttpStatus.BAD_REQUEST, "카카오 임시 사용자가 아닙니다.");
        }

        if (user.getStatus() == UserStatus.ACTIVE && user.getTemporaryToken() == null) {
            throw new CustomException(HttpStatus.CONFLICT, "이미 가입이 완료된 사용자입니다.");
        }

        if (user.getStatus() != UserStatus.SUSPENDED) {
            throw new CustomException(HttpStatus.FORBIDDEN, "가입 가능한 임시 사용자가 아닙니다.");
        }

        if (user.getTemporaryToken() == null || user.getTemporaryTokenExpiredAt() == null) {
            throw new CustomException(HttpStatus.UNAUTHORIZED, "유효하지 않은 임시 사용자입니다.");
        }

        if (!user.getTemporaryTokenExpiredAt().isAfter(LocalDateTime.now())) {
            throw new CustomException(HttpStatus.UNAUTHORIZED, "만료된 임시 토큰입니다.");
        }
    }

    private void validateSocialSignupDuplicate(SocialSignupRequestDto request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new CustomException(HttpStatus.CONFLICT, "이미 사용중인 이메일 입니다.");
        }

        if (userRepository.existsByNickname(request.getNickname())) {
            throw new CustomException(HttpStatus.CONFLICT, "이미 사용중인 닉네임 입니다.");
        }
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

    private LoginResponseDto issueLoginToken(Users user) {
        SimpleGrantedAuthority authority =
                new SimpleGrantedAuthority("ROLE_" + user.getRole().name());
        CustomUserDetail principal =
                new CustomUserDetail(user, Collections.singleton(authority));
        Authentication authentication =
                new UsernamePasswordAuthenticationToken(principal, null, principal.getAuthorities());

        LoginResponseDto tokenDto = tokenProvider.generateTokenDto(authentication);
        LocalDateTime expiry = tokenProvider.getRefreshTokenExpiry();

        refreshTokenRepository.findByUsers(user)
                .ifPresentOrElse(
                        refreshToken -> refreshToken.updateToken(tokenDto.getRefreshToken(), expiry),
                        () -> refreshTokenRepository.save(
                                RefreshTokens.builder()
                                        .users(user)
                                        .token(tokenDto.getRefreshToken())
                                        .expiredAt(expiry)
                                        .build()
                        )
                );

        tokenDto.setNickname(user.getNickname());
        tokenDto.setProfileImageUrl(user.getProfileImageUrl());

        return tokenDto;
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
