package com.human.festapick.service;

import com.human.festapick.exception.CustomException;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class EmailSenderService {

    private final JavaMailSender mailSender;

    /**
     * 비밀번호 재설정 링크를 이메일로 발송합니다.
     */
    public void sendPasswordResetEmail(String email, String resetUrl) {

        String content =
                "<h2>비밀번호 재설정</h2>"
                        + "<p>아래 링크를 클릭해서 비밀번호를 재설정하세요.</p>"
                        + "<p>이 링크는 30분 동안만 유효합니다.</p>"
                        + "<a href='" + resetUrl + "'>비밀번호 재설정하기</a>";

        sendHtmlEmail(
                email,
                "[FestaPick] 비밀번호 재설정 안내",
                content,
                "비밀번호 재설정 이메일 발송에 실패했습니다."
        );
    }

    /**
     * 회원가입 이메일 인증번호를 발송합니다.
     */
    public void sendEmailVerificationCode(String email, String verificationCode, int expireMinutes) {

        String content =
                "<h2>FestaPick 이메일 인증</h2>"
                        + "<p>아래 인증번호를 회원가입 화면에 입력해주세요.</p>"
                        + "<h3>" + verificationCode + "</h3>"
                        + "<p>이 인증번호는 " + expireMinutes + "분 동안만 유효합니다.</p>";

        sendHtmlEmail(
                email,
                "[FestaPick] 이메일 인증번호 안내",
                content,
                "이메일 인증번호 발송에 실패했습니다."
        );
    }

    private void sendHtmlEmail(String email, String subject, String content, String failureMessage) {

        MimeMessage message = mailSender.createMimeMessage();

        try {
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setTo(email);
            helper.setSubject(subject);
            helper.setText(content, true);

            mailSender.send(message);

        } catch (Exception e) {
            throw new CustomException(HttpStatus.INTERNAL_SERVER_ERROR, failureMessage);
        }
    }
}
