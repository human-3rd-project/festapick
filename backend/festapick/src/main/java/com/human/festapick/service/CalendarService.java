package com.human.festapick.service;

import com.human.festapick.constant.FestivalStatus;
import com.human.festapick.dto.response.CalendarResDto;
import com.human.festapick.dto.response.FavoriteListResDto;
import com.human.festapick.dto.response.FestivalInfoResponseDto;
import com.human.festapick.entity.FestivalCategoryCodes;
import com.human.festapick.entity.Festivals;
import com.human.festapick.entity.LegalDongCodes;
import com.human.festapick.repository.FavoriteRepository;
import com.human.festapick.repository.FestivalRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.YearMonth;
import java.util.Comparator;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class CalendarService {

  private static final int DEFAULT_PAGE = 0;
  private static final int DEFAULT_SIZE = 20;

  private final FestivalService festivalService;
  private final FestivalRepository festivalRepository;
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

  public Page<CalendarResDto> getFilteredCalendars(
          Long userId,
          Integer year,
          Integer month,
          String ldongRegnCd,
          String ldongSignguCd,
          String categoryCode,
          Boolean favoriteOnly,
          Pageable pageable
  ) {
    Pageable safePageable = Optional.ofNullable(pageable).orElse(PageRequest.of(DEFAULT_PAGE, DEFAULT_SIZE));
    YearMonth targetMonth = resolveTargetMonth(year, month);
    LocalDate startDate = targetMonth.atDay(1);
    LocalDate endDate = targetMonth.atEndOfMonth();

    List<Festivals> filteredFestivals = festivalRepository.findAll().stream()
            .filter(this::isActiveFestival)
            .filter(festival -> matchesPeriod(festival, startDate, endDate))
            .filter(festival -> matchesRegion(festival, ldongRegnCd, ldongSignguCd))
            .filter(festival -> matchesTheme(festival, categoryCode))
            .sorted(Comparator
                    .comparing(Festivals::getEventStartDate, Comparator.nullsLast(Comparator.naturalOrder()))
                    .thenComparing(Festivals::getTitle, Comparator.nullsLast(Comparator.naturalOrder())))
            .toList();

    Set<Long> favoriteFestivalIds = getFavoriteFestivalIds(userId, filteredFestivals);
    if (Boolean.TRUE.equals(favoriteOnly)) {
      filteredFestivals = filteredFestivals.stream()
              .filter(festival -> favoriteFestivalIds.contains(festival.getFestivalId()))
              .toList();
    }

    Map<String, String> regionNameMap = getRegionNameMap();
    List<CalendarResDto> calendars = filteredFestivals.stream()
            .map(festival -> toCalendarResDto(
                    festival,
                    regionNameMap,
                    favoriteFestivalIds.contains(festival.getFestivalId())
            ))
            .toList();

    return toPage(calendars, safePageable);
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

  private CalendarResDto toCalendarResDto(Festivals festival, Map<String, String> regionNameMap, boolean favorite) {
    return new CalendarResDto(
            festival.getFestivalId(),
            festival.getTitle(),
            festival.getFirstImage2(),
            festival.getLclsSystm3(),
            resolveRegionName(festival, regionNameMap),
            festival.getEventStartDate(),
            festival.getEventEndDate(),
            favorite
    );
  }

  private YearMonth resolveTargetMonth(Integer year, Integer month) {
    if (year == null || month == null) {
      return YearMonth.now();
    }
    return YearMonth.of(year, month);
  }

  private boolean isActiveFestival(Festivals festival) {
    return festival.getStatus() == FestivalStatus.ACTIVE;
  }

  private boolean matchesRegion(Festivals festival, String ldongRegnCd, String ldongSignguCd) {
    if (ldongRegnCd != null && !ldongRegnCd.isBlank() && !Objects.equals(festival.getLdongRegnCd(), ldongRegnCd)) {
      return false;
    }
    return ldongSignguCd == null || ldongSignguCd.isBlank() || Objects.equals(festival.getLdongSignguCd(), ldongSignguCd);
  }

  private boolean matchesTheme(Festivals festival, String categoryCode) {
    return categoryCode == null
            || categoryCode.isBlank()
            || Objects.equals(festival.getLclsSystm1(), categoryCode)
            || Objects.equals(festival.getLclsSystm2(), categoryCode)
            || Objects.equals(festival.getLclsSystm3(), categoryCode);
  }

  private boolean matchesPeriod(Festivals festival, LocalDate startDate, LocalDate endDate) {
    LocalDate eventStartDate = Optional.ofNullable(festival.getEventStartDate()).orElse(LocalDate.MIN);
    LocalDate eventEndDate = Optional.ofNullable(festival.getEventEndDate()).orElse(LocalDate.MAX);

    return !eventStartDate.isAfter(endDate) && !eventEndDate.isBefore(startDate);
  }

  private Set<Long> getFavoriteFestivalIds(Long userId, List<Festivals> festivals) {
    if (userId == null || festivals.isEmpty()) {
      return Set.of();
    }

    List<Long> festivalIds = festivals.stream()
            .map(Festivals::getFestivalId)
            .toList();

    return new HashSet<>(favoriteRepository.findFavoriteFestivalIdsByUserIdAndFestivalIds(userId, festivalIds));
  }

  private Map<String, String> getRegionNameMap() {
    return festivalService.getRegionFilters().stream()
            .collect(Collectors.toMap(
                    region -> createRegionKey(region.getLdongRegnCd(), region.getLdongSignguCd()),
                    LegalDongCodes::getFullName,
                    (first, second) -> first
            ));
  }

  private String resolveRegionName(Festivals festival, Map<String, String> regionNameMap) {
    return regionNameMap.getOrDefault(
            createRegionKey(festival.getLdongRegnCd(), festival.getLdongSignguCd()),
            festival.getAddr1()
    );
  }

  private String createRegionKey(String ldongRegnCd, String ldongSignguCd) {
    return Optional.ofNullable(ldongRegnCd).orElse("") + ":" + Optional.ofNullable(ldongSignguCd).orElse("");
  }

  private <T> Page<T> toPage(List<T> content, Pageable pageable) {
    int start = (int) pageable.getOffset();
    int end = Math.min(start + pageable.getPageSize(), content.size());
    List<T> pageContent = start >= content.size() ? List.of() : content.subList(start, end);
    return new PageImpl<>(pageContent, pageable, content.size());
  }
}
