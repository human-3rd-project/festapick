package com.human.festapick.entity;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(
        name = "favorites",
        uniqueConstraints = {
                @UniqueConstraint(                                 // Unique 제약 조건
                        name = "uk_favorites_user_festival",       // 제약 조건 이름
                        columnNames = {"user_id", "festival_id"}   // "user_id"와 "festival_id"의 조합이 중복되면 안됨. 하나라도 다르면 가능
                )
        }
)

@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Favorites {
    // 찜 PK
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "favorite_id")
    private Long favoriteId;

    // 회원 ID FK
    @ManyToOne(fetch = FetchType.LAZY) // 회원 1 : 찜 n 관계, FetchType.LAZY : 지연로딩, 찜 목록을 조회할 때 멤버 정보를 모두 가져오는 것이 아닌 필요할 때 조회
    @JoinColumn(
            name = "user_id",
            nullable = false
    )
    private Users users;

    // 축제 ID FK
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(
            name = "festival_id",
            nullable = false
    )
    private Festivals festivals;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Builder
    public Favorites(Users users, Festivals festivals) {
        this.users = users;
        this.festivals = festivals;
    }

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
    }
}