package com.human.festapick.service;

import com.human.festapick.dto.request.EmailVerificationRequestDto;
import com.human.festapick.entity.EmailVerifications;
import com.human.festapick.exception.CustomException;
import com.human.festapick.repository.EmailVerificationsRepository;
import com.human.festapick.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.security.SecureRandom;
import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
@Transactional
public class EmailVerificationService {

    private static final int CODE_BOUND = 1_000_000;
    private static final int CODE_EXPIRE_MINUTES = 5;

    private final EmailVerificationsRepository emailVerificationsRepository;
    private final UserRepository userRepository;
    private final EmailSenderService emailSenderService;
    private final SecureRandom secureRandom = new SecureRandom();

    /**
     * 회원가입 이메일 인증번호를 생성하고 메일로 발송합니다.
     * 같은 이메일로 다시 요청하면 기존 인증 정보를 새 코드로 갱신합니다.
     */
    public void sendVerificationCode(String email) {

        if (email == null || email.isBlank()) {
            throw new CustomException(HttpStatus.BAD_REQUEST, "이메일은 필수입니다.");
        }

        if (userRepository.existsByEmail(email)) {
            throw new CustomException(HttpStatus.CONFLICT, "이미 사용중인 이메일 입니다.");
        }

        String verificationCode = generateVerificationCode();
        LocalDateTime expiredAt = LocalDateTime.now().plusMinutes(CODE_EXPIRE_MINUTES);

        EmailVerifications verification = emailVerificationsRepository.findByEmail(email)
                .map(existingVerification -> {
                    existingVerification.setVerificationCode(verificationCode);
                    existingVerification.setVerified(false);
                    existingVerification.setExpiredAt(expiredAt);
                    return existingVerification;
                })
                .orElseGet(() -> EmailVerifications.builder()
                        .email(email)
                        .verificationCode(verificationCode)
                        .verified(false)
                        .expiredAt(expiredAt)
                        .build());

        emailVerificationsRepository.save(verification);
        emailSenderService.sendEmailVerificationCode(email, verificationCode, CODE_EXPIRE_MINUTES);
    }

    /**
     * 사용자가 입력한 인증번호를 검증하고, 성공하면 verified 값을 true로 변경합니다.
     */
    public void verifyEmail(EmailVerificationRequestDto request) {

        if (request == null) {
            throw new CustomException(HttpStatus.BAD_REQUEST, "이메일 인증 요청 정보가 없습니다.");
        }

        EmailVerifications verification = emailVerificationsRepository
                .findByEmailAndVerificationCode(
                        request.getEmail(),
                        request.getVerificationCode()
                )
                .orElseThrow(() -> new CustomException(HttpStatus.BAD_REQUEST, "인증번호가 일치하지 않습니다."));

        if (verification.getExpiredAt().isBefore(LocalDateTime.now())) {
            throw new CustomException(HttpStatus.BAD_REQUEST, "만료된 인증번호입니다.");
        }

        verification.setVerified(true);
    }

    private String generateVerificationCode() {
        return String.format("%06d", secureRandom.nextInt(CODE_BOUND));
    }

}
