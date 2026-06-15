package com.human.festapick.service;

import com.human.festapick.dto.request.PasswordResetLinkRequestDto;
import com.human.festapick.dto.request.PasswordResetRequestDto;
import com.human.festapick.entity.PasswordResetTokens;
import com.human.festapick.entity.Users;
import com.human.festapick.exception.CustomException;
import com.human.festapick.repository.PasswordResetTokenRepository;
import com.human.festapick.repository.UserRepository;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
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
    private final JavaMailSender mailSender;
    private final PasswordEncoder passwordEncoder;

    @Value("${frontend.url}")
    private String frontendUrl;

    // 아이디 찾기
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
     * 비밀번호 재설정 이메일 발송
     */
    public void sendPasswordResetEmail(PasswordResetLinkRequestDto request) {

        Users user = userRepository.findByLoginId(request.getLoginId())
                .orElseThrow(() -> new CustomException(HttpStatus.NOT_FOUND,"존재하지 않는 아이디입니다."));

        if (!user.getEmail().equals(request.getEmail())) {
            throw new CustomException(HttpStatus.NOT_FOUND,"아이디와 이메일이 일치하지 않습니다.");
        }

        String token = UUID.randomUUID().toString();

        PasswordResetTokens resetToken = PasswordResetTokens.builder()
                .users(user)
                .token(token)
                .used(false)
                .expiredAt(LocalDateTime.now().plusMinutes(30))
                .build();

        passwordResetTokenRepository.save(resetToken);

        String resetUrl =
                frontendUrl + "/reset-password?token=" + token;

        sendResetPasswordEmail(user.getEmail(), resetUrl);
    }

    /**
     * 비밀번호 재설정 토큰 검증
     */
    public void validateResetToken(String token) {

        PasswordResetTokens resetToken = passwordResetTokenRepository.findByToken(token)
                .orElseThrow(() -> new CustomException(HttpStatus.BAD_REQUEST,"유효하지 않은 토큰입니다."));

        if (resetToken.isUsed()) {
            throw new CustomException(HttpStatus.BAD_REQUEST,"이미 사용된 토큰입니다.");
        }

        if (resetToken.getExpiredAt().isBefore(LocalDateTime.now())) {
            throw new CustomException(HttpStatus.BAD_REQUEST,"만료된 토큰입니다.");
        }
    }

    /**
     * 새 비밀번호로 변경
     */
    public void resetPassword(PasswordResetRequestDto request) {

        PasswordResetTokens resetToken = passwordResetTokenRepository.findByToken(request.getToken())
                .orElseThrow(() -> new CustomException(HttpStatus.BAD_REQUEST,"유효하지 않은 토큰입니다."));

        if (resetToken.isUsed()) {
            throw new CustomException(HttpStatus.BAD_REQUEST,"이미 사용된 토큰입니다.");
        }

        if (resetToken.getExpiredAt().isBefore(LocalDateTime.now())) {
            throw new CustomException(HttpStatus.BAD_REQUEST,"만료된 토큰입니다.");
        }

        Users user = resetToken.getUsers();

        String encodedPassword = passwordEncoder.encode(request.getNewPassword());

        user.setPassword(encodedPassword);

        resetToken.setUsed(true);
    }

    /**
     * 실제 이메일 발송 로직
     */
    private void sendResetPasswordEmail(String email, String resetUrl) {

        MimeMessage message = mailSender.createMimeMessage();

        try {
            MimeMessageHelper helper =
                    new MimeMessageHelper(message, true, "UTF-8");

            helper.setTo(email);
            helper.setSubject("[FestaPick] 비밀번호 재설정 안내");

            String content =
                    "<h2>비밀번호 재설정</h2>"
                            + "<p>아래 링크를 클릭해서 비밀번호를 재설정하세요.</p>"
                            + "<p>이 링크는 30분 동안만 유효합니다.</p>"
                            + "<a href='" + resetUrl + "'>비밀번호 재설정하기</a>";

            helper.setText(content, true);

            mailSender.send(message);

        } catch (Exception e) {
            throw new CustomException(
                    HttpStatus.INTERNAL_SERVER_ERROR,"비밀번호 재설정 이메일 발송에 실패했습니다.");
        }
    }
}