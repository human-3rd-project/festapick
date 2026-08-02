package com.human.festapick.service;

import com.human.festapick.dto.request.PasswordResetLinkRequestDto;
import com.human.festapick.dto.request.PasswordResetRequestDto;
import com.human.festapick.entity.PasswordResetTokens;
import com.human.festapick.entity.Users;
import com.human.festapick.exception.CustomException;
import com.human.festapick.repository.PasswordResetTokenRepository;
import com.human.festapick.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Transactional
public class AccountService {

    private final UserRepository userRepository;
    private final PasswordResetTokenRepository passwordResetTokenRepository;
    private final PasswordEncoder passwordEncoder;
    private final EmailSenderService emailSenderService;

    @Value("${frontend.url}")
    private String frontendUrl;

    /**
     * 가입된 이메일로 로그인 ID를 찾고 일부만 마스킹해서 반환합니다.
     */
    @Transactional(readOnly = true)
    public String findLoginIdByEmail(String email) {

        Users user = userRepository.findByEmail(email)
                .orElseThrow(() -> new CustomException(HttpStatus.NOT_FOUND,"해당 이메일로 가입된 회원이 없습니다."));

        return maskLoginId(user.getLoginId());
    }

    private String maskLoginId(String loginId) {

        if (loginId == null || loginId.isBlank()) {
            throw new CustomException(HttpStatus.NOT_FOUND,"일반 로그인 아이디가 없는 계정입니다.");
        }

        if (loginId.length() <= 2) {
            return loginId.charAt(0) + "*";
        }

        return loginId.substring(0, 2) + "*".repeat(loginId.length() - 2);
    }

    /**
     * 비밀번호 재설정 요청을 처리합니다.
     * 사용자 확인, 토큰 저장, 재설정 링크 생성까지 담당하고 실제 이메일 전송은 EmailSenderService에 위임합니다.
     */
    public void requestPasswordReset(PasswordResetLinkRequestDto request) {

        if (request == null) {
            throw new CustomException(HttpStatus.BAD_REQUEST, "비밀번호 재설정 요청 정보가 없습니다.");
        }

        Users user = userRepository.findByLoginId(request.getLoginId())
                .orElseThrow(() -> new CustomException(HttpStatus.NOT_FOUND,"존재하지 않는 아이디입니다."));

        if (!user.getEmail().equals(request.getEmail())) {
            throw new CustomException(HttpStatus.NOT_FOUND,"아이디와 이메일이 일치하지 않습니다.");
        }

        String token = UUID.randomUUID().toString();
        LocalDateTime expiredAt = LocalDateTime.now().plusMinutes(30);

        PasswordResetTokens resetToken = passwordResetTokenRepository.findByUsers(user)
                .map(existingToken -> {
                    existingToken.setToken(token);
                    existingToken.setUsed(false);
                    existingToken.setExpiredAt(expiredAt);
                    return existingToken;
                })
                .orElseGet(() -> PasswordResetTokens.builder()
                        .users(user)
                        .token(token)
                        .used(false)
                        .expiredAt(expiredAt)
                        .build());

        passwordResetTokenRepository.save(resetToken);

        String resetUrl = buildPasswordResetUrl(token);

        emailSenderService.sendPasswordResetEmail(user.getEmail(), resetUrl);
    }

    private String buildPasswordResetUrl(String token) {
        if (frontendUrl == null || frontendUrl.isBlank()) {
            throw new CustomException(
                    HttpStatus.INTERNAL_SERVER_ERROR,
                    "프런트엔드 주소가 설정되지 않았습니다."
            );
        }

        String normalizedFrontendUrl = frontendUrl.trim().replaceAll("/+$", "");
        return normalizedFrontendUrl + "/reset-password?token=" + token;
    }

    /**
     * 비밀번호 재설정 화면 진입 전 토큰이 아직 사용할 수 있는 상태인지 확인합니다.
     */
    public void validateResetToken(String token) {
        getValidPasswordResetToken(token);
    }

    /**
     * 검증된 비밀번호 재설정 토큰으로 새 비밀번호를 저장하고 토큰을 사용 처리합니다.
     */
    public void resetPassword(PasswordResetRequestDto request) {

        if (request == null) {
            throw new CustomException(HttpStatus.BAD_REQUEST, "비밀번호 변경 요청 정보가 없습니다.");
        }

        PasswordResetTokens resetToken = getValidPasswordResetToken(request.getToken());
        Users user = resetToken.getUsers();

        // 현재 db 비밀번호 다른것만 통과 되도록 아니면 CustomException
        if (passwordEncoder.matches(request.getNewPassword(), user.getPassword())) {
            throw new CustomException(HttpStatus.BAD_REQUEST, "새 비밀번호는 현재 비밀번호와 달라야 합니다.");
        }

        String encodedPassword = passwordEncoder.encode(request.getNewPassword());

        user.setPassword(encodedPassword);

        resetToken.setUsed(true);
    }

    private PasswordResetTokens getValidPasswordResetToken(String token) {

        PasswordResetTokens resetToken = passwordResetTokenRepository.findByToken(token)
                .orElseThrow(() -> new CustomException(HttpStatus.BAD_REQUEST,"유효하지 않은 토큰입니다."));

        if (resetToken.isUsed()) {
            throw new CustomException(HttpStatus.BAD_REQUEST,"이미 사용된 토큰입니다.");
        }

        if (resetToken.getExpiredAt().isBefore(LocalDateTime.now())) {
            throw new CustomException(HttpStatus.BAD_REQUEST,"만료된 토큰입니다.");
        }

        return resetToken;
    }

}
