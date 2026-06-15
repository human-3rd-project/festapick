package com.human.festapick.service;

import com.human.festapick.dto.response.FavoriteListResDto;
import com.human.festapick.entity.Favorites;
import com.human.festapick.entity.FestivalLikes;
import com.human.festapick.entity.Festivals;
import com.human.festapick.entity.Users;
import com.human.festapick.repository.FavoriteRepository;
import com.human.festapick.repository.FestivalLikeRepository;
import com.human.festapick.repository.FestivalRepository;
import com.human.festapick.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class FestivalActionService {

    private final FavoriteRepository favoriteRepository;
    private final FestivalLikeRepository festivalLikeRepository;
    private final UserRepository userRepository;
    private final FestivalRepository festivalRepository;

    // 찜 등록
    @Transactional
    public void addFavorite(Long userId, Long festivalId) {
        // 이미 찜한 축제인지 확인
        if (favoriteRepository.existsByUsers_UserIdAndFestivals_FestivalId(userId, festivalId)) {
            return;
        }

        // 회원 조회
        Users user = getUser(userId);
        // 축제 조회
        Festivals festival = getFestival(festivalId);

        // 조회된 데이터를 이용해 Favorites Entity 생성
        Favorites favorite = Favorites.builder()
                .users(user)
                .festivals(festival)
                .build();

        // DB에 저장
        favoriteRepository.save(favorite);
        festival.increaseFavoriteCount();
    }

    // 찜 취소
    // userId, festivalId를 이용해 해당 사용자의 해당 축제에 대한 찜 데이터 조회
    @Transactional
    public void cancelFavorite(Long userId, Long festivalId) {
        favoriteRepository.findByUsers_UserIdAndFestivals_FestivalId(userId, festivalId)
                .ifPresent(favorite -> {
                    favoriteRepository.delete(favorite);
                    favorite.getFestivals().decreaseFavoriteCount();
                });
    }

    // 찜 여부 조회
    // 프론트에서 찜 - 하트 표시 위해 사용
    public boolean isFavorite(Long userId, Long festivalId) {
        return favoriteRepository.existsByUsers_UserIdAndFestivals_FestivalId(userId, festivalId);
    }

    // 내 찜 목록 조회
    public Page<FavoriteListResDto> getMyFavoriteList(Long userId, Pageable pageable) {
        return favoriteRepository.findFavoriteListByUserId(userId, pageable);
    }

    // 특정 축제의 찜 개수 조회
    public long getFavoriteCount(Long festivalId) {
        return favoriteRepository.countByFestivals_FestivalId(festivalId);
    }

    // 전체 축제 목록 중 현재 사용자가 찜한 축제 ID 목록 조회
    // 캘린더에서 찜한 축제를 표시해주는 용도로 사용
    public Set<Long> getFavoriteFestivalIdSet(Long userId, List<Long> festivalIds) {
        if (festivalIds == null || festivalIds.isEmpty()) {
            return Set.of();
        }

        // 전체 축제 ID 목록 중 현재 사용자가 찜한 축제 ID만 조회
        List<Long> favoriteFestivalIds =
                favoriteRepository.findFavoriteFestivalIdsByUserIdAndFestivalIds(
                        userId,
                        festivalIds
                );

        return new HashSet<>(favoriteFestivalIds);
    }

    // 좋아요 등록
    @Transactional
    public void addLike(Long userId, Long festivalId) {
        // 이미 좋아요를 눌렀는지 확인
        if (festivalLikeRepository.existsByUsers_UserIdAndFestivals_FestivalId(userId, festivalId)) {
            return;
        }

        // 회원 조회
        Users user = getUser(userId);
        // 축제 조회
        Festivals festival = getFestival(festivalId);

        // FestivalLikes Entity 생성
        FestivalLikes festivalLike = FestivalLikes.builder()
                .users(user)
                .festivals(festival)
                .build();

        // DB에 저장
        festivalLikeRepository.save(festivalLike);
        festival.increaseLikeCount();
    }

    // 좋아요 취소
    @Transactional
    public void cancelLike(Long userId, Long festivalId) {
        festivalLikeRepository.findByUsers_UserIdAndFestivals_FestivalId(userId, festivalId)
                .ifPresent(festivalLike -> {
                    festivalLikeRepository.delete(festivalLike);
                    festivalLike.getFestivals().decreaseLikeCount();
                });
    }

    // 좋아요 여부 조회
    // 프론트 표시용
    public boolean isLiked(Long userId, Long festivalId) {
        return festivalLikeRepository.existsByUsers_UserIdAndFestivals_FestivalId(userId, festivalId);
    }

    // 특정 축제의 좋아요 개수 조회
    public long getLikeCount(Long festivalId) {
        return festivalLikeRepository.countByFestivals_FestivalId(festivalId);
    }

    // 회원 조회 공통 메서드 - Entity 생성용
    private Users getUser(Long userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("회원을 찾을 수 없습니다."));
    }

    // 축제 조회 공통 메서드 - Entity 생성용
    private Festivals getFestival(Long festivalId) {
        return festivalRepository.findById(festivalId)
                .orElseThrow(() -> new RuntimeException("축제를 찾을 수 없습니다."));
    }
}
