package com.human.festapick.repository;

import com.human.festapick.entity.FestivalLikes;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface FestivalLikeRepository extends JpaRepository<FestivalLikes, Long> {

    // 좋아요 여부 확인
    boolean existsByUsers_UserIdAndFestivals_FestivalId(Long userId, Long festivalId);

    // 특정 회원의 특정 축제 좋아요 데이터 조회
    Optional<FestivalLikes> findByUsers_UserIdAndFestivals_FestivalId(Long userId, Long festivalId);

    // 좋아요 취소
    void deleteByUsers_UserIdAndFestivals_FestivalId(Long userId, Long festivalId);

    // 특정 축제의 좋아요 개수 조회
    long countByFestivals_FestivalId(Long festivalId);
}