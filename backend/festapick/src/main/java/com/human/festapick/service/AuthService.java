package com.human.festapick.service;

import com.human.festapick.constant.OAuthProvider;
import com.human.festapick.constant.UserRole;
import com.human.festapick.constant.UserStatus;
import com.human.festapick.dto.request.LoginRequestDto;
import com.human.festapick.dto.request.SignupRequestDto;
import com.human.festapick.dto.response.LoginResponseDto;
import com.human.festapick.entity.RefreshTokens;
import com.human.festapick.entity.Users;
import com.human.festapick.exception.CustomException;
import com.human.festapick.repository.EmailVerificationsRepository;
import com.human.festapick.repository.RefreshTokenRepository;
import com.human.festapick.repository.UserRepository;
import com.human.festapick.security.CustomUserDetail;
import com.human.festapick.security.TokenProvider;
import com.nimbusds.oauth2.sdk.token.RefreshToken;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Collections;

@Service
@RequiredArgsConstructor
@Transactional
public class AuthService {

    private final UserRepository userRepository;
    private final EmailVerificationsRepository emailVerificationsRepository;
    private final RefreshTokenRepository refreshTokenRepository;
    private final PasswordEncoder passwordEncoder;
    private final TokenProvider tokenProvider;

    public void signup(SignupRequestDto request) {

        if (userRepository.existsByLoginId(request.getLoginId())) {
            throw new CustomException(HttpStatus.CONFLICT, "Already used login id.");
        }

        if (userRepository.existsByEmail(request.getEmail())) {
            throw new CustomException(HttpStatus.CONFLICT, "Already used email.");
        }

        if (userRepository.existsByNickname(request.getNickname())) {
            throw new CustomException(HttpStatus.CONFLICT, "Already used nickname.");
        }

        boolean emailVerified =
                emailVerificationsRepository.existsByEmailAndVerifiedTrue(request.getEmail());

        if (!emailVerified) {
            throw new CustomException(HttpStatus.BAD_REQUEST, "Email verification is required.");
        }

        String encodedPassword = passwordEncoder.encode(request.getPassword());

        Users user = Users.builder()
                .loginId(request.getLoginId())
                .email(request.getEmail())
                .nickname(request.getNickname())
                .password(encodedPassword)
                .role(UserRole.USER)
                .provider(OAuthProvider.LOCAL)
                .status(UserStatus.ACTIVE)
                .build();

        userRepository.save(user);
        emailVerificationsRepository.deleteByEmail(request.getEmail());
    }

        @Transactional
    public TokenDto login(LoginReqDto dto) {
        UsernamePasswordAuthenticationToken authToken = dto.toAuthenticationToken();
        Authentication authentication = managerBuilder.getObject().authenticate(authToken);
        TokenDto tokenDto = tokenProvider.generateTokenDto(authentication);

        // Refresh Token DB 저장
        Long memberId = Long.parseLong(authentication.getName());
        LocalDateTime expiry = tokenProvider.getRefreshTokenExpiry();

        refreshTokenRepository.findByMemberId(memberId)
                .ifPresentOrElse(
                        rt -> rt.updateToken(tokenDto.getRefreshToken(), expiry),
                        () -> refreshTokenRepository.save(
                                RefreshToken.builder()
                                        .memberId(memberId)
                                        .tokenValue(tokenDto.getRefreshToken())
                                        .expiresAt(expiry)
                                        .build())
                );
        // 회원 이름을 조회해서 TokenDto에 포함
        String memberName = memberRepository.findById(memberId)
                .map(Member::getName)
                .orElse("");
        tokenDto.setName(memberName);

        return tokenDto;
    }

    public void logout(Long userId) {

        Users user = userRepository.findById(userId)
                .orElseThrow(() ->
                        new CustomException(HttpStatus.NOT_FOUND, "User not found.")
                );

        refreshTokenRepository.deleteByUsers(user);
    }
}
