package com.human.festapick.service;

import com.human.festapick.dto.response.CalendarResDto;
import com.human.festapick.dto.response.FavoriteListResDto;
import com.human.festapick.entity.Favorites;
import com.human.festapick.entity.FestivalLikes;
import com.human.festapick.entity.Festivals;
import com.human.festapick.entity.Users;
import com.human.festapick.exception.CustomException;
import com.human.festapick.repository.FavoriteRepository;
import com.human.festapick.repository.FestivalLikeRepository;
import com.human.festapick.repository.FestivalRepository;
import com.human.festapick.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class FestivalActionService {

  private static final int DEFAULT_PAGE = 0;
  private static final int DEFAULT_SIZE = 20;

  private final FavoriteRepository favoriteRepository;
  private final FestivalLikeRepository festivalLikeRepository;
  private final FestivalRepository festivalRepository;
  private final UserRepository userRepository;

  // 찜하기: 이미 찜한 상태면 찜 취소, 아니면 찜 등록을 수행합니다.
  @Transactional
  public boolean toggleFavorite(Long userId, Long festivalId) {
    if (isFavorite(userId, festivalId)) {
      removeFavorite(userId, festivalId);
      return false;
    }

    addFavorite(userId, festivalId);
    return true;
  }

  // 찜 등록: 회원과 축제를 확인한 뒤 favorites 테이블에 저장합니다.
  @Transactional
  public void addFavorite(Long userId, Long festivalId) {
    if (isFavorite(userId, festivalId)) {
      throw new CustomException(HttpStatus.CONFLICT, "이미 찜한 축제입니다.");
    }

    Users user = getUserOrThrow(userId);
    Festivals festival = getFestivalOrThrow(festivalId);

    favoriteRepository.save(Favorites.builder()
            .users(user)
            .festivals(festival)
            .build());
    festival.increaseFavoriteCount();
  }

  // 찜 취소: 회원의 특정 축제 찜 데이터가 있을 때만 삭제합니다.
  @Transactional
  public void removeFavorite(Long userId, Long festivalId) {
    Favorites favorite = favoriteRepository.findByUsers_UserIdAndFestivals_FestivalId(userId, festivalId)
            .orElseThrow(() -> new CustomException(HttpStatus.NOT_FOUND, "찜한 축제가 아닙니다."));

    favorite.getFestivals().decreaseFavoriteCount();
    favoriteRepository.delete(favorite);
  }

  // 찜 여부 확인: 상세 화면의 찜 버튼 상태를 표시할 때 사용합니다.
  public boolean isFavorite(Long userId, Long festivalId) {
    return favoriteRepository.existsByUsers_UserIdAndFestivals_FestivalId(userId, festivalId);
  }

  // 특정 축제의 찜 개수 조회: festivals.favoriteCount 컬럼 대신 실제 favorites row 수를 기준으로 계산합니다.
  public long getFavoriteCount(Long festivalId) {
    return favoriteRepository.countByFestivals_FestivalId(festivalId);
  }

  // 찜한 축제 일정 조회: 마이페이지/캘린더에서 사용하기 좋게 FavoriteListResDto를 CalendarResDto로 변환합니다.
  public Page<CalendarResDto> getFavoriteCalendars(Long userId, Pageable pageable) {
    Pageable safePageable = Optional.ofNullable(pageable).orElse(PageRequest.of(DEFAULT_PAGE, DEFAULT_SIZE));

    return favoriteRepository.findFavoriteListByUserId(userId, safePageable)
            .map(favorite -> new CalendarResDto(
                    favorite.getFestivalId(),
                    favorite.getTitle(),
                    favorite.getThumbnailUrl(),
                    favorite.getCategoryName(),
                    favorite.getRegionName(),
                    favorite.getEventStartDate(),
                    favorite.getEventEndDate(),
                    true
            ));
  }

  // 찜 목록 조회: 캘린더가 아닌 일반 카드 목록 화면에서 FavoriteListResDto 그대로 사용합니다.
  public Page<FavoriteListResDto> getFavoriteList(Long userId, Pageable pageable) {
    Pageable safePageable = Optional.ofNullable(pageable).orElse(PageRequest.of(DEFAULT_PAGE, DEFAULT_SIZE));
    return favoriteRepository.findFavoriteListByUserId(userId, safePageable);
  }

  @Transactional
  public boolean toggleLike(Long userId, Long festivalId) {
    if (isLiked(userId, festivalId)) {
      removeLike(userId, festivalId);
      return false;
    }

    addLike(userId, festivalId);
    return true;
  }

  // 좋아요 등록: 회원과 축제를 확인한 뒤 festival_likes 테이블에 저장합니다.
  @Transactional
  public void addLike(Long userId, Long festivalId) {
    if (isLiked(userId, festivalId)) {
      throw new CustomException(HttpStatus.CONFLICT, "이미 좋아요한 축제입니다.");
    }

    Users user = getUserOrThrow(userId);
    Festivals festival = getFestivalOrThrow(festivalId);

    festivalLikeRepository.save(FestivalLikes.builder()
            .users(user)
            .festivals(festival)
            .build());
    festival.increaseLikeCount();
  }

  // 좋아요 취소: 회원의 특정 축제 좋아요 데이터가 있을 때만 삭제합니다.
  @Transactional
  public void removeLike(Long userId, Long festivalId) {
    FestivalLikes like = festivalLikeRepository.findByUsers_UserIdAndFestivals_FestivalId(userId, festivalId)
            .orElseThrow(() -> new CustomException(HttpStatus.NOT_FOUND, "좋아요한 축제가 아닙니다."));

    like.getFestivals().decreaseLikeCount();
    festivalLikeRepository.delete(like);
  }

  // 좋아요 여부 확인: 상세 화면의 좋아요 버튼 상태를 표시할 때 사용합니다.
  public boolean isLiked(Long userId, Long festivalId) {
    return festivalLikeRepository.existsByUsers_UserIdAndFestivals_FestivalId(userId, festivalId);
  }

  // 특정 축제의 좋아요 개수 조회: festivals.likeCount 컬럼 대신 실제 festival_likes row 수를 기준으로 계산합니다.
  public long getLikeCount(Long festivalId) {
    return festivalLikeRepository.countByFestivals_FestivalId(festivalId);
  }

  // ID로 회원을 찾고, 없으면 공통 예외로 처리합니다.
  private Users getUserOrThrow(Long userId) {
    return userRepository.findById(userId)
            .orElseThrow(() -> new CustomException(HttpStatus.NOT_FOUND, "회원을 찾을 수 없습니다."));
  }

  // ID로 축제를 찾고, 없으면 공통 예외로 처리합니다.
  private Festivals getFestivalOrThrow(Long festivalId) {
    return festivalRepository.findById(festivalId)
            .orElseThrow(() -> new CustomException(HttpStatus.NOT_FOUND, "축제를 찾을 수 없습니다."));
  }
}
