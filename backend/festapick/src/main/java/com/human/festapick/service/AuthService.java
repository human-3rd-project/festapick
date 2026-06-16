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

    /**
     * 일반 회원가입을 처리합니다.
     * 중복 검사와 이메일 인증 여부를 확인한 뒤 LOCAL 회원으로 저장합니다.
     */
    public void signup(SignupRequestDto request) {

        // 같은 로그인 ID로 이미 가입한 사용자가 있는지 확인합니다.
        if (userRepository.existsByLoginId(request.getLoginId())) {
            throw new CustomException(HttpStatus.CONFLICT, "이미 사용중인 아이디 입니다.");
        }

        // 같은 이메일은 하나의 계정에서만 사용할 수 있습니다.
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new CustomException(HttpStatus.CONFLICT, "이미 사용중인 이메일 입니다.");
        }

        // 닉네임도 서비스 안에서 중복되지 않도록 검사합니다.
        if (userRepository.existsByNickname(request.getNickname())) {
            throw new CustomException(HttpStatus.CONFLICT, "이미 사용중인 닉네임 입니다.");
        }

        // 이메일 인증이 완료된 주소만 회원가입을 허용합니다.
        boolean emailVerified =
                emailVerificationsRepository.existsByEmailAndVerifiedTrue(request.getEmail());

        if (!emailVerified) {
            throw new CustomException(HttpStatus.BAD_REQUEST, "이메일 인증이 필요합니다.");
        }

        // DB에는 원문 비밀번호가 아니라 암호화된 비밀번호만 저장합니다.
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

        // 회원가입이 끝난 인증 정보는 재사용하지 않도록 삭제합니다.
        emailVerificationsRepository.deleteByEmail(request.getEmail());
    }

    /**
     * 로그인 요청을 인증하고 access token / refresh token을 발급합니다.
     * 기존 리프레시 토큰이 있으면 갱신하고, 없으면 새로 저장합니다.
     */
    @Transactional
    public LoginResponseDto login(LoginRequestDto dto) {
        // Spring Security 인증 매니저에 로그인 ID/비밀번호 인증을 위임합니다.
        UsernamePasswordAuthenticationToken authToken = dto.toAuthenticationToken();
        Authentication authentication = managerBuilder.getObject().authenticate(authToken);

        // 인증된 사용자 정보를 기준으로 access token과 refresh token을 생성합니다.
        LoginResponseDto tokenDto = tokenProvider.generateTokenDto(authentication);

        CustomUserDetail userDetail = (CustomUserDetail) authentication.getPrincipal();
        Long userId = userDetail.getUserId();
        LocalDateTime expiry = tokenProvider.getRefreshTokenExpiry();
        Users user = userRepository.findById(userId)
                        .orElseThrow(() -> new CustomException(HttpStatus.NOT_FOUND,"존재하지 않는 유저 입니다."));

        // 사용자별 리프레시 토큰은 하나만 유지합니다.
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
        // 클라이언트에서 바로 사용할 수 있도록 사용자 표시 정보를 응답에 포함합니다.
        String userNickName = user.getNickname();
        String profileImgUrl = user.getProfileImageUrl();
        tokenDto.setNickname(userNickName);
        tokenDto.setProfileImageUrl(profileImgUrl);

        return tokenDto;
    }

    /**
     * 로그아웃 시 서버에 저장된 리프레시 토큰을 삭제합니다.
     * access token은 stateless 토큰이므로 클라이언트에서 함께 폐기해야 합니다.
     */
    public void logout(Long userId) {

        // 유효한 사용자에 대해서만 저장된 리프레시 토큰을 제거합니다.
        Users user = userRepository.findById(userId)
                .orElseThrow(() ->
                        new CustomException(HttpStatus.NOT_FOUND, "사용자를 찾을수 없습니다.")
                );

        refreshTokenRepository.deleteByUsers(user);
    }
}
