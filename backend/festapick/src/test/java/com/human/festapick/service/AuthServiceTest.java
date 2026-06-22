package com.human.festapick.service;

import com.human.festapick.constant.OAuthProvider;
import com.human.festapick.constant.UserRole;
import com.human.festapick.constant.UserStatus;
import com.human.festapick.dto.request.LoginRequestDto;
import com.human.festapick.dto.response.LoginResponseDto;
import com.human.festapick.entity.RefreshTokens;
import com.human.festapick.entity.Users;
import com.human.festapick.exception.CustomException;
import com.human.festapick.repository.EmailVerificationsRepository;
import com.human.festapick.repository.RefreshTokenRepository;
import com.human.festapick.repository.UserRepository;
import com.human.festapick.security.TokenProvider;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.time.LocalDateTime;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class AuthServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private EmailVerificationsRepository emailVerificationsRepository;

    @Mock
    private RefreshTokenRepository refreshTokenRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private TokenProvider tokenProvider;

    @InjectMocks
    private AuthService authService;

    @Test
    void loginWithSuspendedUserAndWrongPasswordKeepsGenericFailureMessage() {
        Users user = createUser(UserStatus.SUSPENDED);
        LoginRequestDto request = new LoginRequestDto("member01", "wrong-password");

        when(userRepository.findByLoginId("member01")).thenReturn(Optional.of(user));
        when(passwordEncoder.matches("wrong-password", user.getPassword())).thenReturn(false);

        assertThatThrownBy(() -> authService.login(request))
                .isInstanceOf(CustomException.class)
                .satisfies(error -> {
                    CustomException exception = (CustomException) error;
                    assertThat(exception.getStatus()).isEqualTo(HttpStatus.UNAUTHORIZED);
                    assertThat(exception.getMessage()).isEqualTo("아이디 또는 비밀번호가 올바르지 않습니다.");
                });

        verify(tokenProvider, never()).generateTokenDto(any());
    }

    @Test
    void loginWithSuspendedUserAndCorrectPasswordShowsSuspendedMessage() {
        Users user = createUser(UserStatus.SUSPENDED);
        LoginRequestDto request = new LoginRequestDto("member01", "correct-password");

        when(userRepository.findByLoginId("member01")).thenReturn(Optional.of(user));
        when(passwordEncoder.matches("correct-password", user.getPassword())).thenReturn(true);

        assertThatThrownBy(() -> authService.login(request))
                .isInstanceOf(CustomException.class)
                .satisfies(error -> {
                    CustomException exception = (CustomException) error;
                    assertThat(exception.getStatus()).isEqualTo(HttpStatus.FORBIDDEN);
                    assertThat(exception.getMessage()).isEqualTo("정지된 계정입니다. 관리자에게 문의해 주세요.");
                });

        verify(tokenProvider, never()).generateTokenDto(any());
    }

    @Test
    void loginWithActiveUserAndCorrectPasswordIssuesToken() {
        Users user = createUser(UserStatus.ACTIVE);
        LoginRequestDto request = new LoginRequestDto("member01", "correct-password");
        LoginResponseDto token = LoginResponseDto.builder()
                .grantType("Bearer")
                .accessToken("access-token")
                .refreshToken("refresh-token")
                .accessTokenExpiresIn(1000L)
                .build();

        when(userRepository.findByLoginId("member01")).thenReturn(Optional.of(user));
        when(passwordEncoder.matches("correct-password", user.getPassword())).thenReturn(true);
        when(tokenProvider.generateTokenDto(any())).thenReturn(token);
        when(tokenProvider.getRefreshTokenExpiry()).thenReturn(LocalDateTime.now().plusDays(14));
        when(refreshTokenRepository.findByUsers(user)).thenReturn(Optional.empty());

        LoginResponseDto response = authService.login(request);

        assertThat(response.getAccessToken()).isEqualTo("access-token");
        assertThat(response.getRefreshToken()).isEqualTo("refresh-token");
        assertThat(response.getNickname()).isEqualTo("테스트회원");
        verify(refreshTokenRepository).save(any(RefreshTokens.class));
    }

    private Users createUser(UserStatus status) {
        return Users.builder()
                .userId(1L)
                .loginId("member01")
                .password("encoded-password")
                .email("member01@example.com")
                .nickname("테스트회원")
                .profileImageUrl("https://example.com/profile.png")
                .role(UserRole.USER)
                .provider(OAuthProvider.LOCAL)
                .status(status)
                .build();
    }
}
