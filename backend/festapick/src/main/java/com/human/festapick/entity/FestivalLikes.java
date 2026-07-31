package com.human.festapick.entity;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(
        name = "festival_likes",
        uniqueConstraints = {
                @UniqueConstraint(
                        name = "uk_festival_likes_user_festival",
                        columnNames = {"user_id", "festival_id"}
                )
        }
)
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class FestivalLikes {
    // 좋아요 PK
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "like_id")
    private Long likeId;

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
    public FestivalLikes(Users users, Festivals festivals) {
        this.users = users;
        this.festivals = festivals;
    }

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
    }
}
