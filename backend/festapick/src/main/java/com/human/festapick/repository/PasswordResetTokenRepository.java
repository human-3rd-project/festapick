package com.human.festapick.repository;

import com.human.festapick.entity.PasswordResetTokens;
import com.human.festapick.entity.Users;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface PasswordResetTokenRepository extends JpaRepository<PasswordResetTokens, Long> {

    // 비밀번호 재설정 토큰 조회
    Optional<PasswordResetTokens> findByToken(String token);

    // 사용자 기준 토큰 조회
    Optional<PasswordResetTokens> findByUsers(Users users);

    // 사용자 기준 기존 토큰 삭제
    void deleteByUsers(Users users);

    // 토큰 존재 여부 확인
    boolean existsByToken(String token);
}