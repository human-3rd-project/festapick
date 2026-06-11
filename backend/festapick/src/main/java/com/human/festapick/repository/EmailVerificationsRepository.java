package com.human.festapick.repository;

import com.human.festapick.entity.EmailVerifications;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface EmailVerificationsRepository extends JpaRepository<EmailVerifications, Long> {

    // 이메일 인증번호 조회
    Optional<EmailVerifications> findByEmail(String email);

    // 이메일 + 인증번호로 조회
    Optional<EmailVerifications> findByEmailAndVerificationCode(
            String email,
            String verificationCode
    );

    // 이메일 인증 여부 확인
    boolean existsByEmailAndVerifiedTrue(String email);

    // 이메일 인증 데이터 삭제
    void deleteByEmail(String email);
}