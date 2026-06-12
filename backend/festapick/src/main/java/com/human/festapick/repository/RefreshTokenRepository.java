package com.human.festapick.repository;

import com.human.festapick.entity.RefreshTokens;
import com.human.festapick.entity.Users;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface RefreshTokenRepository extends JpaRepository<RefreshTokens, Long> {

    // Refresh Token 문자열로 조회
    Optional<RefreshTokens> findByToken(String token);

    // Users 객체로 조회
    Optional<RefreshTokens> findByUsers(Users users);

    // Users 객체로 삭제
    void deleteByUsers(Users users);

    void deleteByToken(String token);
}