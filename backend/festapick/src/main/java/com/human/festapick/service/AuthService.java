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
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
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
    private final AuthenticationManagerBuilder managerBuilder;

    public void signup(SignupRequestDto request) {

        if (userRepository.existsByLoginId(request.getLoginId())) {
            throw new CustomException(HttpStatus.CONFLICT, "이미 사용중인 아이디 입니다.");
        }

        if (userRepository.existsByEmail(request.getEmail())) {
            throw new CustomException(HttpStatus.CONFLICT, "이미 사용중인 이메일 입니다.");
        }

        if (userRepository.existsByNickname(request.getNickname())) {
            throw new CustomException(HttpStatus.CONFLICT, "이미 사용중인 닉네임 입니다.");
        }

        boolean emailVerified =
                emailVerificationsRepository.existsByEmailAndVerifiedTrue(request.getEmail());

        if (!emailVerified) {
            throw new CustomException(HttpStatus.BAD_REQUEST, "이메일 인증이 필요합니다.");
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
    public LoginResponseDto login(LoginRequestDto dto) {
        UsernamePasswordAuthenticationToken authToken = dto.toAuthenticationToken();
        Authentication authentication = managerBuilder.getObject().authenticate(authToken);
        LoginResponseDto tokenDto = tokenProvider.generateTokenDto(authentication);

        CustomUserDetail userDetail = (CustomUserDetail) authentication.getPrincipal();
        Long userId = userDetail.getUserId();
        LocalDateTime expiry = tokenProvider.getRefreshTokenExpiry();
        Users user = userRepository.findById(userId)
                        .orElseThrow(() -> new CustomException(HttpStatus.NOT_FOUND,"존재하지 않는 유저 입니다."));

        refreshTokenRepository.findByUsers(user)
                .ifPresentOrElse(
                        rt -> rt.updateToken(tokenDto.getRefreshToken(), expiry),
                        () -> refreshTokenRepository.save(
                                RefreshTokens.builder()
                                        .users(user)
                                        .token(tokenDto.getRefreshToken())
                                        .expiredAt(expiry)
                                        .build())
                );
        // 회원 이름을 조회해서 TokenDto에 포함
        String userNickName = user.getNickname();
        String profileImgUrl = user.getProfileImageUrl();
        tokenDto.setNickname(userNickName);
        tokenDto.setProfileImageUrl(profileImgUrl);

        return tokenDto;
    }

    public void logout(Long userId) {

        Users user = userRepository.findById(userId)
                .orElseThrow(() ->
                        new CustomException(HttpStatus.NOT_FOUND, "사용자를 찾을수 없습니다.")
                );

        refreshTokenRepository.deleteByUsers(user);
    }
}
