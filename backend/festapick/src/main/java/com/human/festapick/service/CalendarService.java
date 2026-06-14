package com.human.festapick.service;

import com.human.festapick.dto.response.CalendarResDto;
import com.human.festapick.dto.response.FavoriteListResDto;
import com.human.festapick.dto.response.FestivalInfoResponseDto;
import com.human.festapick.entity.FestivalCategoryCodes;
import com.human.festapick.entity.LegalDongCodes;
import com.human.festapick.repository.FavoriteRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.YearMonth;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class CalendarService {

  private static final int DEFAULT_PAGE = 0;
  private static final int DEFAULT_SIZE = 20;

  private final FestivalService festivalService;
  private final FavoriteRepository favoriteRepository;

  // 월별 축제 조회: FestivalService의 월별 조회 결과를 캘린더 화면에서 사용합니다.
  public List<FestivalInfoResponseDto> getMonthlyFestivals(YearMonth targetMonth) {
    return festivalService.getMonthlyFestivals(targetMonth);
  }

  // 지역 필터 조회: 캘린더 필터 옵션으로 사용할 활성 지역 목록입니다.
  public List<LegalDongCodes> getRegionFilters() {
    return festivalService.getRegionFilters();
  }

  // 테마 필터 조회: 캘린더 필터 옵션으로 사용할 활성 테마 목록입니다.
  public List<FestivalCategoryCodes> getThemeFilters() {
    return festivalService.getThemeFilters();
  }

  // 찜한 축제 일정 조회: 마이페이지/캘린더에서 찜한 축제를 일정 DTO로 표시합니다.
  public Page<CalendarResDto> getFavoriteCalendars(Long userId, Pageable pageable) {
    Pageable safePageable = Optional.ofNullable(pageable).orElse(PageRequest.of(DEFAULT_PAGE, DEFAULT_SIZE));

    return favoriteRepository.findFavoriteListByUserId(userId, safePageable)
            .map(this::toCalendarResDto);
  }

  private CalendarResDto toCalendarResDto(FavoriteListResDto favorite) {
    return new CalendarResDto(
            favorite.getFestivalId(),
            favorite.getTitle(),
            favorite.getThumbnailUrl(),
            favorite.getCategoryName(),
            favorite.getRegionName(),
            favorite.getEventStartDate(),
            favorite.getEventEndDate(),
            true
    );
  }
}
