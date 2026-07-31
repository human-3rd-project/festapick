package com.human.festapick.repository;

import com.human.festapick.constant.OAuthProvider;
import com.human.festapick.constant.UserRole;
import com.human.festapick.constant.UserStatus;
import com.human.festapick.entity.Users;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<Users, Long> {

    // 아이디 중복 검사
    // 회원가입 시 loginId가 이미 존재하는지 확인
    boolean existsByLoginId(String loginId);


    // 닉네임 중복 검사
    boolean existsByNickname(String nickname);


    // 이메일 중복 검사
    boolean existsByEmail(String email);


    // 이메일 조회
    Optional<Users> findByEmail(String email);


    // 로그인 ID 조회
    Optional<Users> findByLoginId(String loginId);


    // 내 정보 조회

    // 회원가입

    // 프로필 수정

    // 비밀번호 변경

    // 회원 탈퇴

    // OAuth 로그인 회원 조회
    // 카카오 / 네이버 로그인 시 provider + providerId로 회원 조회
    Optional<Users> findByProviderAndProviderId(
            OAuthProvider provider,
            String providerId
    );


    // 소셜 임시 가입 회원 조회
    Optional<Users> findByTemporaryToken(String temporaryToken);


    // 소셜 임시 토큰 중복 확인
    boolean existsByTemporaryToken(String temporaryToken);


    // OAuth 계정 중복 확인
    // 소셜 회원가입 전 이미 가입된 소셜 계정인지 확인
    boolean existsByProviderAndProviderId(
            OAuthProvider provider,
            String providerId
    );

    @Query(
            value = """
                    SELECT u
                    FROM Users u
                    WHERE (:numericKeyword IS NOT NULL AND u.userId = :numericKeyword)
                       OR (:status IS NOT NULL AND u.status = :status)
                       OR (:role IS NOT NULL AND u.role = :role)
                       OR LOWER(u.loginId) LIKE :keyword
                       OR LOWER(u.email) LIKE :keyword
                       OR LOWER(u.nickname) LIKE :keyword
                    """,
            countQuery = """
                    SELECT COUNT(u)
                    FROM Users u
                    WHERE (:numericKeyword IS NOT NULL AND u.userId = :numericKeyword)
                       OR (:status IS NOT NULL AND u.status = :status)
                       OR (:role IS NOT NULL AND u.role = :role)
                       OR LOWER(u.loginId) LIKE :keyword
                       OR LOWER(u.email) LIKE :keyword
                       OR LOWER(u.nickname) LIKE :keyword
                    """
    )
    Page<Users> searchAdminUsers(
            @Param("keyword") String keyword,
            @Param("numericKeyword") Long numericKeyword,
            @Param("status") UserStatus status,
            @Param("role") UserRole role,
            Pageable pageable
    );
}
