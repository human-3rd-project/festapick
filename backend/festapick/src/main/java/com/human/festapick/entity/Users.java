package com.human.festapick.entity;

import com.human.festapick.constant.OAuthProvider;
import com.human.festapick.constant.UserRole;
import com.human.festapick.constant.UserStatus;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(
        name = "users",
        uniqueConstraints = {
                @UniqueConstraint(name = "uk_users_login_id", columnNames = "login_id"),
                @UniqueConstraint(name = "uk_users_email", columnNames = "email"),
                @UniqueConstraint(name = "uk_users_nickname", columnNames = "nickname")
        }
)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Users {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "user_id")
    private Long userId;

    // 관심 지역 법정동 시도 코드
    // legal_dong_codes 테이블과 직접 FK 연결하지 않음
    @Column(name = "ldong_regn_cd", length = 10)
    private String ldongRegnCd;

    // 관심 지역 법정동 시군구 코드
    // legal_dong_codes 테이블과 직접 FK 연결하지 않음
    @Column(name = "ldong_signgu_cd", length = 10)
    private String ldongSignguCd;

    // 일반 로그인 아이디
    // 소셜 회원은 NULL 가능
    @Column(name = "login_id", length = 50)
    private String loginId;

    @Column(name = "email", length = 100, nullable = false)
    private String email;

    // 암호화 비밀번호
    // 소셜 회원은 NULL 가능
    @Column(name = "password", length = 255)
    private String password;

    @Column(name = "nickname", length = 50, nullable = false)
    private String nickname;

    @Column(name = "profile_image_url", length = 500)
    private String profileImageUrl;

    @Enumerated(EnumType.STRING)
    @Column(name = "role", length = 20, nullable = false)
    private UserRole role;

    @Enumerated(EnumType.STRING)
    @Column(name = "provider", length = 20, nullable = false)
    private OAuthProvider provider;

    // OAuth 제공자 회원 ID
    // 일반 회원은 NULL 가능
    @Column(name = "provider_id", length = 100)
    private String providerId;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", length = 20, nullable = false)
    private UserStatus status;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;
}