package com.human.festapick.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(
        name = "legal_dong_codes",
        uniqueConstraints = {
                @UniqueConstraint(
                        name = "uk_legal_dong_codes_ldong",
                        columnNames = {"ldong_regn_cd", "ldong_signgu_cd"}
                )
        },
        indexes = {
                @Index(
                        name = "idx_legal_dong_codes_name",
                        columnList = "sido_name, sigungu_name"
                )
        }
)
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Builder
public class LegalDongCodes {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "legal_dong_code_id")
    private Long legalDongCodeId;

    @Column(name = "ldong_regn_cd", nullable = false, length = 10)
    private String ldongRegnCd;

    @Column(name = "ldong_signgu_cd", nullable = false, length = 10)
    private String ldongSignguCd;

    @Column(name = "sido_name", nullable = false, length = 50)
    private String sidoName;

    @Column(name = "sigungu_name", nullable = false, length = 50)
    private String sigunguName;

    @Column(name = "full_name", nullable = false, length = 100)
    private String fullName;

    @Builder.Default
    @Column(name = "active", nullable = false)
    private Boolean active = true;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;
}
