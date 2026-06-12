package com.human.festapick.service;

import com.human.festapick.dto.request.PasswordResetLinkRequestDto;
import com.human.festapick.dto.request.PasswordResetRequestDto;
import com.human.festapick.entity.PasswordResetTokens;
import com.human.festapick.entity.Users;
import com.human.festapick.repository.PasswordResetTokenRepository;
import com.human.festapick.repository.UserRepository;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
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

    /**
     * 비밀번호 재설정 이메일 발송
     */
    public void sendPasswordResetEmail(PasswordResetLinkRequestDto request) {

        Users user = userRepository.findByLoginId(request.getLoginId())
                .orElseThrow(() -> new RuntimeException("존재하지 않는 아이디입니다."));

        if (!user.getEmail().equals(request.getEmail())) {
            throw new RuntimeException("아이디와 이메일이 일치하지 않습니다.");
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
                .orElseThrow(() -> new RuntimeException("유효하지 않은 토큰입니다."));

        if (resetToken.isUsed()) {
            throw new RuntimeException("이미 사용된 토큰입니다.");
        }

        if (resetToken.getExpiredAt().isBefore(LocalDateTime.now())) {
            throw new RuntimeException("만료된 토큰입니다.");
        }
    }

    /**
     * 새 비밀번호로 변경
     */
    public void resetPassword(PasswordResetRequestDto request) {

        PasswordResetTokens resetToken = passwordResetTokenRepository.findByToken(request.getToken())
                .orElseThrow(() -> new RuntimeException("유효하지 않은 토큰입니다."));

        if (resetToken.isUsed()) {
            throw new RuntimeException("이미 사용된 토큰입니다.");
        }

        if (resetToken.getExpiredAt().isBefore(LocalDateTime.now())) {
            throw new RuntimeException("만료된 토큰입니다.");
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
            throw new RuntimeException("비밀번호 재설정 이메일 발송에 실패했습니다.");
        }
    }
}