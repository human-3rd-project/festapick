package com.human.festapick.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Getter
@Setter
@Table(name = "email_verifications")
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Builder

public class EmailVerifications {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "email_verifications")
    private Long emailVerifications;

    @Column(name = "email", length = 100, nullable = false)
    private String email;

    @Column(name = "verification_code", length = 10, nullable = false)
    private String verificationCode;

    @Column(name = "verified", nullable = false)
    private boolean verified;

    @Column(name = "expired_at", nullable = false)
    private LocalDateTime expiredAt;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;
}
