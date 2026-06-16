package com.human.festapick.service;

import com.human.festapick.constant.FestivalStatus;
import com.human.festapick.config.WebSocketHandler;
import com.human.festapick.dto.response.FestivalInfoResponseDto;
import com.human.festapick.dto.response.MainPageResponseDto;
import com.human.festapick.dto.response.TourApiResDto;
import com.human.festapick.dto.response.TourFestivalItemDto;
import com.human.festapick.entity.ChatRooms;
import com.human.festapick.entity.FestivalCategoryCodes;
import com.human.festapick.entity.Festivals;
import com.human.festapick.repository.ChatRoomRepository;
import com.human.festapick.repository.FestivalCategoryCodeRepository;
import com.human.festapick.repository.FestivalRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.reactive.function.client.WebClient;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.YearMonth;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeParseException;
import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class MainService {
  private static final int DEFAULT_BANNER_LIMIT = 5;
  private static final int DEFAULT_SECTION_LIMIT = 10;
  private static final int TOUR_API_SYNC_PAGE_SIZE = 100;
  private static final int TOUR_API_SYNC_MAX_PAGE = 12;
  private static final DateTimeFormatter TOUR_DATE_FORMATTER = DateTimeFormatter.ofPattern("yyyyMMdd");

  private final FestivalRepository festivalRepository;
  private final FestivalCategoryCodeRepository festivalCategoryCodeRepository;
  private final ChatRoomRepository chatRoomRepository;
  private final WebSocketHandler webSocketHandler;
  private final WebClient.Builder webClientBuilder;

  @Value("${tourapi.base-url}")
  private String tourApiBaseUrl;

  @Value("${tourapi.service-key}")
  private String tourApiServiceKey;

  @Value("${tourapi.mobile-os:ETC}")
  private String tourApiMobileOs;

  @Value("${tourapi.mobile-app:FestaPick}")
  private String tourApiMobileApp;

  // 메인 화면에서 필요한 위치 추천/월별/인기 목록을 한 번에 묶어 내려주는 메서드입니다.
  public MainPageResponseDto getMainPage(String ldongRegnCd, String ldongSignguCd) {
    return MainPageResponseDto.builder()
            .nearbyFestivals(getNearbyFestivalRecommendations(ldongRegnCd, ldongSignguCd))
            .monthlyFestivals(getMonthlyNationalFestivals(YearMonth.now()))
            .popularFestivals(getRealtimePopularFestivals(webSocketHandler.getLiveParticipantCountByChatRoomId()))
            .build();
  }

  // 배너 목록 조회: 별도 배너 테이블이 없으므로 조회수/좋아요/찜 수가 높은 활성 축제를 배너로 사용합니다.
  public List<FestivalInfoResponseDto> getBannerFestivals() {
    return festivalRepository.findAll().stream()
            .filter(this::isActiveFestival)
            .sorted(Comparator
                    .comparing(Festivals::getViewCount, Comparator.nullsLast(Comparator.reverseOrder()))
                    .thenComparing(Festivals::getLikeCount, Comparator.nullsLast(Comparator.reverseOrder()))
                    .thenComparing(Festivals::getFavoriteCount, Comparator.nullsLast(Comparator.reverseOrder())))
            .limit(DEFAULT_BANNER_LIMIT)
            .map(this::toFestivalInfoResponseDto)
            .toList();
  }

  // 위치 기반 축제 추천 조회: 사용자의 법정동 코드와 같은 지역의 진행 예정/진행 중 축제를 우선 노출합니다.
  public List<FestivalInfoResponseDto> getNearbyFestivalRecommendations(String ldongRegnCd, String ldongSignguCd) {
    LocalDate today = LocalDate.now();

    return festivalRepository.findAll().stream()
            .filter(this::isActiveFestival)
            .filter(festival -> isSameRegion(festival, ldongRegnCd, ldongSignguCd))
            .filter(festival -> isOngoingOrUpcoming(festival, today))
            .sorted(Comparator
                    .comparing(Festivals::getEventStartDate, Comparator.nullsLast(Comparator.naturalOrder()))
                    .thenComparing(Festivals::getFavoriteCount, Comparator.nullsLast(Comparator.reverseOrder()))
                    .thenComparing(Festivals::getLikeCount, Comparator.nullsLast(Comparator.reverseOrder())))
            .limit(DEFAULT_SECTION_LIMIT)
            .map(this::toFestivalInfoResponseDto)
            .toList();
  }

  // 월별 전국 축제 조회: 선택한 월과 축제 기간이 하루라도 겹치면 해당 월 축제로 판단합니다.
  public List<FestivalInfoResponseDto> getMonthlyNationalFestivals(YearMonth targetMonth) {
    YearMonth month = Optional.ofNullable(targetMonth).orElse(YearMonth.now());
    LocalDate monthStart = month.atDay(1);
    LocalDate monthEnd = month.atEndOfMonth();

    return festivalRepository.findAll().stream()
            .filter(this::isActiveFestival)
            .filter(festival -> isOverlappedWithPeriod(festival, monthStart, monthEnd))
            .sorted(Comparator
                    .comparing(Festivals::getEventStartDate, Comparator.nullsLast(Comparator.naturalOrder()))
                    .thenComparing(Festivals::getTitle, Comparator.nullsLast(Comparator.naturalOrder())))
            .limit(DEFAULT_SECTION_LIMIT)
            .map(this::toFestivalInfoResponseDto)
            .toList();
  }

  // 실시간 인기 축제 조회: 별도 실시간 집계 테이블이 없으므로 현재 카운트 값을 가중 합산해 정렬합니다.
  public List<FestivalInfoResponseDto> getRealtimePopularFestivals() {
    return festivalRepository.findAll().stream()
            .filter(this::isActiveFestival)
            .sorted(Comparator
                    .comparingLong(this::popularScore)
                    .reversed()
                    .thenComparing(Festivals::getAverageRating, Comparator.nullsLast(Comparator.reverseOrder()))
                    .thenComparing(Festivals::getEventStartDate, Comparator.nullsLast(Comparator.naturalOrder())))
            .limit(DEFAULT_SECTION_LIMIT)
            .map(this::toFestivalInfoResponseDto)
            .toList();
  }

  // 실시간 인기 축제 조회: WebSocket 접속자 수를 채팅방 기준으로 받아 축제별 참여 인원 순서로 정렬합니다.
  public List<FestivalInfoResponseDto> getRealtimePopularFestivals(Map<Long, Long> liveParticipantCountByChatRoomId) {
    Map<Long, Long> safeLiveParticipantCountByChatRoomId =
            Optional.ofNullable(liveParticipantCountByChatRoomId).orElse(Map.of());

    Map<Long, Long> liveParticipantCountByFestivalId = chatRoomRepository.findAll().stream()
            .filter(ChatRooms::isActive)
            .filter(chatRoom -> chatRoom.getFestival() != null)
            .collect(java.util.stream.Collectors.toMap(
                    chatRoom -> chatRoom.getFestival().getFestivalId(),
                    chatRoom -> defaultLong(safeLiveParticipantCountByChatRoomId.get(chatRoom.getChatRoomId())),
                    Long::sum
            ));

    return festivalRepository.findAll().stream()
            .filter(this::isActiveFestival)
            .filter(festival -> liveParticipantCountByFestivalId.containsKey(festival.getFestivalId()))
            .sorted(Comparator
                    .comparingLong((Festivals festival) ->
                            liveParticipantCountByFestivalId.getOrDefault(festival.getFestivalId(), 0L))
                    .reversed()
                    .thenComparing(Festivals::getAverageRating, Comparator.nullsLast(Comparator.reverseOrder()))
                    .thenComparing(Festivals::getEventStartDate, Comparator.nullsLast(Comparator.naturalOrder())))
            .limit(DEFAULT_SECTION_LIMIT)
            .map(festival -> toFestivalInfoResponseDto(
                    festival,
                    liveParticipantCountByFestivalId.getOrDefault(festival.getFestivalId(), 0L)
            ))
            .toList();
  }

  // TourAPI 축제 목록 조회: 외부 API에서 축제 데이터를 가져오지만 DB에는 저장하지 않습니다.
  public List<TourFestivalItemDto> fetchTourApiFestivals(LocalDate eventStartDate, int page, int size) {
    TourApiResDto response = webClientBuilder
            .baseUrl(tourApiBaseUrl)
            .build()
            .get()
            .uri(uriBuilder -> uriBuilder
                    .path("/searchFestival2")
                    .queryParam("serviceKey", tourApiServiceKey)
                    .queryParam("MobileOS", tourApiMobileOs)
                    .queryParam("MobileApp", tourApiMobileApp)
                    .queryParam("_type", "json")
                    .queryParam("arrange", "O")
                    .queryParam("eventStartDate", formatTourApiDate(Optional.ofNullable(eventStartDate).orElse(LocalDate.now())))
                    .queryParam("pageNo", page <= 0 ? 1 : page)
                    .queryParam("numOfRows", size <= 0 ? DEFAULT_SECTION_LIMIT : size)
                    .build())
            .retrieve()
            .bodyToMono(TourApiResDto.class)
            .block();

    return Optional.ofNullable(response)
            .map(TourApiResDto::getFestivalItems)
            .orElse(List.of());
  }

  // TourAPI 축제 동기화: TourAPI에서 가져온 축제 중 DB에 없는 contentId만 신규 저장합니다.
  @Transactional
  public int syncTourApiFestivals(LocalDate eventStartDate, int page, int size) {
    List<TourFestivalItemDto> tourFestivals = fetchTourApiFestivals(eventStartDate, page, size);

    List<Festivals> newFestivals = tourFestivals.stream()
            .filter(item -> item.getContentId() != null && !item.getContentId().isBlank())
            .filter(item -> !festivalRepository.existsByContentId(item.getContentId()))
            .map(this::toFestivalEntity)
            .toList();

    List<Festivals> savedFestivals = festivalRepository.saveAll(newFestivals);
    List<ChatRooms> chatRooms = savedFestivals.stream()
            .map(ChatRooms::create)
            .toList();

    chatRoomRepository.saveAll(chatRooms);
    return newFestivals.size();
  }

  // TourAPI 축제 동기화: 매일 오전 9시에 오늘 이후 축제 데이터를 가져와 DB에 없는 항목만 저장합니다.
  @Scheduled(cron = "0 0 9 * * *", zone = "Asia/Seoul")
  @Transactional
  public void scheduledSyncTourApiFestivals() {
    LocalDate today = LocalDate.now();

    for (int page = 1; page <= TOUR_API_SYNC_MAX_PAGE; page++) {
      syncTourApiFestivals(today, page, TOUR_API_SYNC_PAGE_SIZE);
    }
  }

  // 화면 응답 DTO 변환: Festivals 엔티티를 메인/목록 카드에서 쓰는 공통 형태로 바꿉니다.
  private FestivalInfoResponseDto toFestivalInfoResponseDto(Festivals festival) {
    return toFestivalInfoResponseDto(festival, 0L);
  }

  // 화면 응답 DTO 변환: 실시간 채팅 참여 인원이 있으면 liveCount에 함께 담아 내려줍니다.
  private FestivalInfoResponseDto toFestivalInfoResponseDto(Festivals festival, Long liveCount) {
    return FestivalInfoResponseDto.builder()
            .festivalId(festival.getFestivalId())
            .contentId(festival.getContentId())
            .title(festival.getTitle())
            .categoryName(resolveCategoryName(festival))
            .firstImage(festival.getFirstImage())
            .addr1(festival.getAddr1())
            .addr2(festival.getAddr2())
            .eventStartDate(festival.getEventStartDate())
            .eventEndDate(festival.getEventEndDate())
            .averageRating(festival.getAverageRating())
            .liveCount(defaultLong(liveCount))
            .favoriteCount(defaultLong(festival.getFavoriteCount()))
            .likeCount(defaultLong(festival.getLikeCount()))
            .reviewCount(defaultLong(festival.getReviewCount()))
            .status(festival.getStatus() == null ? null : festival.getStatus().name())
            .build();
  }

  // TourAPI DTO를 신규 저장용 Festivals 엔티티로 변환합니다.
  private Festivals toFestivalEntity(TourFestivalItemDto item) {
    return Festivals.builder()
            .contentId(item.getContentId())
            .contentTypeId(item.getContentTypeId())
            .title(defaultString(item.getTitle(), "제목 없음"))
            .addr1(item.getAddr1())
            .addr2(item.getAddr2())
            .zipcode(item.getZipcode())
            .cat1(item.getCat1())
            .cat2(item.getCat2())
            .cat3(item.getCat3())
            .tourCreatedTime(item.getCreatedTime())
            .eventStartDate(parseTourApiDate(item.getEventStartDate()))
            .eventEndDate(parseTourApiDate(item.getEventEndDate()))
            .firstImage(item.getFirstImage())
            .firstImage2(item.getFirstImage2())
            .copyrightType(item.getCopyrightType())
            .mapX(parseBigDecimal(item.getMapX()))
            .mapY(parseBigDecimal(item.getMapY()))
            .mapLevel(item.getMapLevel())
            .tourModifiedTime(item.getModifiedTime())
            .tel(item.getTel())
            .ldongRegnCd(item.getLdongRegnCd())
            .ldongSignguCd(item.getLdongSignguCd())
            .lclsSystm1(item.getLclsSystm1())
            .lclsSystm2(item.getLclsSystm2())
            .lclsSystm3(item.getLclsSystm3())
            .progressType(item.getProgressType())
            .festivalType(item.getFestivalType())
            .status(FestivalStatus.ACTIVE)
            .build();
  }

  // 카테고리 코드가 있으면 코드 테이블에서 표시명을 찾고, 없으면 축제 타입/소분류 코드를 대체 표시명으로 사용합니다.
  private String resolveCategoryName(Festivals festival) {
    return festivalCategoryCodeRepository.findByLclsCodeAndMclsCodeAndSclsCode(
                    festival.getLclsSystm1(),
                    festival.getLclsSystm2(),
                    festival.getLclsSystm3()
            )
            .map(this::pickMostSpecificCategoryName)
            .orElseGet(() -> Optional.ofNullable(festival.getFestivalType())
                    .filter(type -> !type.isBlank())
                    .orElse(festival.getLclsSystm3()));
  }

  // 소분류명이 있으면 가장 구체적인 이름을, 없으면 중분류/대분류 순서로 표시명을 선택합니다.
  private String pickMostSpecificCategoryName(FestivalCategoryCodes categoryCode) {
    if (categoryCode.getSclsName() != null && !categoryCode.getSclsName().isBlank()) {
      return categoryCode.getSclsName();
    }
    if (categoryCode.getMclsName() != null && !categoryCode.getMclsName().isBlank()) {
      return categoryCode.getMclsName();
    }
    return categoryCode.getLclsName();
  }

  // ACTIVE 상태의 축제만 사용자 화면에 노출합니다.
  private boolean isActiveFestival(Festivals festival) {
    return festival.getStatus() == FestivalStatus.ACTIVE;
  }

  // 지역 코드가 비어 있으면 전국 기준, 시군구 코드가 비어 있으면 시도 기준으로 판단합니다.
  private boolean isSameRegion(Festivals festival, String ldongRegnCd, String ldongSignguCd) {
    if (ldongRegnCd == null || ldongRegnCd.isBlank()) {
      return true;
    }
    if (!Objects.equals(festival.getLdongRegnCd(), ldongRegnCd)) {
      return false;
    }
    return ldongSignguCd == null || ldongSignguCd.isBlank() || Objects.equals(festival.getLdongSignguCd(), ldongSignguCd);
  }

  // 종료일이 오늘 이후이거나 종료일이 없으면 진행 예정/진행 중 축제로 봅니다.
  private boolean isOngoingOrUpcoming(Festivals festival, LocalDate today) {
    LocalDate eventEndDate = festival.getEventEndDate();
    return eventEndDate == null || !eventEndDate.isBefore(today);
  }

  // 축제 기간과 검색 기간이 하루라도 겹치는지 확인합니다.
  private boolean isOverlappedWithPeriod(Festivals festival, LocalDate startDate, LocalDate endDate) {
    LocalDate eventStartDate = Optional.ofNullable(festival.getEventStartDate()).orElse(LocalDate.MIN);
    LocalDate eventEndDate = Optional.ofNullable(festival.getEventEndDate()).orElse(LocalDate.MAX);
    return !eventStartDate.isAfter(endDate) && !eventEndDate.isBefore(startDate);
  }

  // 인기 점수는 조회수보다 사용자 행동인 찜/좋아요/리뷰에 더 높은 가중치를 둡니다.
  private long popularScore(Festivals festival) {
    return defaultLong(festival.getViewCount())
            + defaultLong(festival.getLikeCount()) * 3
            + defaultLong(festival.getFavoriteCount()) * 4
            + defaultLong(festival.getReviewCount()) * 5;
  }

  // TourAPI 날짜 파라미터 형식인 yyyyMMdd 문자열로 변환합니다.
  private String formatTourApiDate(LocalDate date) {
    return date.format(TOUR_DATE_FORMATTER);
  }

  // TourAPI yyyyMMdd 날짜 문자열을 LocalDate로 변환합니다. 값이 없거나 형식이 다르면 null로 둡니다.
  private LocalDate parseTourApiDate(String value) {
    if (value == null || value.isBlank()) {
      return null;
    }
    try {
      return LocalDate.parse(value, TOUR_DATE_FORMATTER);
    } catch (DateTimeParseException e) {
      return null;
    }
  }

  // 좌표처럼 문자열로 내려오는 숫자 값을 BigDecimal로 변환합니다.
  private BigDecimal parseBigDecimal(String value) {
    if (value == null || value.isBlank()) {
      return null;
    }
    try {
      return new BigDecimal(value);
    } catch (NumberFormatException e) {
      return null;
    }
  }

  // null Long 값을 카운트 계산에 안전한 0으로 바꿉니다.
  private long defaultLong(Long value) {
    return value == null ? 0L : value;
  }

  // TourAPI에서 제목이 비어 내려오는 예외 상황을 대비한 기본 문자열 처리입니다.
  private String defaultString(String value, String defaultValue) {
    return value == null || value.isBlank() ? defaultValue : value;
  }
}
