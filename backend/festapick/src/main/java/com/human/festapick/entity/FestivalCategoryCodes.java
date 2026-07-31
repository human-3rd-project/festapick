package com.human.festapick.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(
        name = "festival_category_codes",
        uniqueConstraints = {
                @UniqueConstraint(
                        name = "uk_festival_category_codes",
                        columnNames = {"lcls_code", "mcls_code", "scls_code"}
                )
        },
        indexes = {
                @Index(name = "idx_festival_category_lcls_code", columnList = "lcls_code"),
                @Index(name = "idx_festival_category_mcls_code", columnList = "mcls_code"),
                @Index(name = "idx_festival_category_scls_code", columnList = "scls_code")
        }
)
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Builder
public class FestivalCategoryCodes {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "festival_category_code_id")
    private Long festivalCategoryCodeId;

    @Column(name = "lcls_code", nullable = false, length = 20)
    private String lclsCode;

    @Column(name = "lcls_name", nullable = false, length = 100)
    private String lclsName;

    @Column(name = "mcls_code", length = 20)
    private String mclsCode;

    @Column(name = "mcls_name", length = 100)
    private String mclsName;

    @Column(name = "scls_code", length = 20)
    private String sclsCode;

    @Column(name = "scls_name", length = 100)
    private String sclsName;

    @Column(name = "active", nullable = false)
    @Builder.Default
    private Boolean active = true;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;
}

