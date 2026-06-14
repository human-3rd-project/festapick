package com.human.festapick.service;

import com.human.festapick.constant.FestivalStatus;
import com.human.festapick.dto.request.FestivalSearchRequestDto;
import com.human.festapick.dto.response.FestivalDetailResponseDto;
import com.human.festapick.dto.response.FestivalInfoResponseDto;
import com.human.festapick.entity.FestivalCategoryCodes;
import com.human.festapick.entity.FestivalImages;
import com.human.festapick.entity.Festivals;
import com.human.festapick.entity.LegalDongCodes;
import com.human.festapick.exception.CustomException;
import com.human.festapick.repository.FestivalCategoryCodeRepository;
import com.human.festapick.repository.FestivalImageRepository;
import com.human.festapick.repository.FestivalRepository;
import com.human.festapick.repository.LegalDongCodeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.YearMonth;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.Objects;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class FestivalService {

  private static final int DEFAULT_PAGE = 0;
  private static final int DEFAULT_SIZE = 12;

  private final FestivalRepository festivalRepository;
  private final FestivalImageRepository festivalImageRepository;
  private final FestivalCategoryCodeRepository festivalCategoryCodeRepository;
  private final LegalDongCodeRepository legalDongCodeRepository;

  // 키워드 검색: 축제 제목에 keyword가 포함된 활성 축제를 조회합니다.
  public Page<FestivalInfoResponseDto> searchByKeyword(String keyword, Pageable pageable) {
    FestivalSearchRequestDto request = new FestivalSearchRequestDto();
    request.setKeyword(keyword);
    return searchFestivals(request, pageable);
  }

  // 지역 검색: 법정동 시도/시군구 코드가 일치하는 활성 축제를 조회합니다.
  public Page<FestivalInfoResponseDto> searchByRegion(String ldongRegnCd, String ldongSignguCd, Pageable pageable) {
    FestivalSearchRequestDto request = new FestivalSearchRequestDto();
    request.setLdongRegnCd(ldongRegnCd);
    request.setLdongSignguCd(ldongSignguCd);
    return searchFestivals(request, pageable);
  }

  // 테마 검색: 서비스분류체계 대/중/소 코드 중 하나가 lclsSystm 값과 일치하는 활성 축제를 조회합니다.
  public Page<FestivalInfoResponseDto> searchByTheme(String lclsSystm, Pageable pageable) {
    FestivalSearchRequestDto request = new FestivalSearchRequestDto();
    request.setLclsSystm(lclsSystm);
    return searchFestivals(request, pageable);
  }

  // 기간 검색: 입력 기간과 축제 기간이 하루라도 겹치는 활성 축제를 조회합니다.
  public Page<FestivalInfoResponseDto> searchByPeriod(LocalDate startDate, LocalDate endDate, Pageable pageable) {
    FestivalSearchRequestDto request = new FestivalSearchRequestDto();
    request.setStartDate(startDate);
    request.setEndDate(endDate);
    return searchFestivals(request, pageable);
  }

  // 검색 결과 조회: 키워드/지역/테마/기간 조건을 모두 조합해서 축제 목록을 조회합니다.
  public Page<FestivalInfoResponseDto> searchFestivals(FestivalSearchRequestDto request) {
    return searchFestivals(request, createPageable(request));
  }

  // 검색 결과 조회: Controller에서 Pageable을 직접 넘기는 경우를 위한 오버로드입니다.
  public Page<FestivalInfoResponseDto> searchFestivals(FestivalSearchRequestDto request, Pageable pageable) {
    FestivalSearchRequestDto safeRequest = Optional.ofNullable(request).orElseGet(FestivalSearchRequestDto::new);
    Pageable safePageable = Optional.ofNullable(pageable).orElseGet(() -> createPageable(safeRequest));

    List<FestivalInfoResponseDto> filteredFestivals = festivalRepository.findAll().stream()
            .filter(this::isActiveFestival)
            .filter(festival -> matchesKeyword(festival, safeRequest.getKeyword()))
            .filter(festival -> matchesRegion(festival, safeRequest.getLdongRegnCd(), safeRequest.getLdongSignguCd()))
            .filter(festival -> matchesTheme(festival, safeRequest.getLclsSystm()))
            .filter(festival -> matchesPeriod(festival, safeRequest.getStartDate(), safeRequest.getEndDate()))
            .sorted(Comparator
                    .comparing(Festivals::getEventStartDate, Comparator.nullsLast(Comparator.naturalOrder()))
                    .thenComparing(Festivals::getTitle, Comparator.nullsLast(Comparator.naturalOrder())))
            .map(this::toFestivalInfoResponseDto)
            .toList();

    return toPage(filteredFestivals, safePageable);
  }

  // 축제 상세 조회: 기본 정보, 이미지 목록, 위치, 리뷰 통계를 상세 DTO로 묶습니다.
  public FestivalDetailResponseDto getFestivalDetail(Long festivalId) {
    Festivals festival = getFestivalOrThrow(festivalId);

    return FestivalDetailResponseDto.builder()
            .festivalId(festival.getFestivalId())
            .contentId(festival.getContentId())
            .title(festival.getTitle())
            .categoryName(resolveCategoryName(festival))
            .progressType(festival.getProgressType())
            .imageUrls(resolveImageUrls(festival))
            .addr1(festival.getAddr1())
            .addr2(festival.getAddr2())
            .eventStartDate(festival.getEventStartDate())
            .eventEndDate(festival.getEventEndDate())
            .description(festival.getDescription())
            .mapX(festival.getMapX())
            .mapY(festival.getMapY())
            .averageRating(festival.getAverageRating())
            .reviewCount(defaultLong(festival.getReviewCount()))
            .status(festival.getStatus() == null ? null : festival.getStatus().name())
            .build();
  }

  // 축제 위치 조회: 지도 표시에는 상세 DTO의 mapX/mapY/주소 정보만 사용하면 됩니다.
  public FestivalDetailResponseDto getFestivalLocation(Long festivalId) {
    return getFestivalDetail(festivalId);
  }

  // 지도 정보 조회: 지역 코드가 있으면 해당 지역, 없으면 전국의 지도 표시 가능한 축제를 조회합니다.
  public List<FestivalInfoResponseDto> getMapFestivals(String ldongRegnCd, String ldongSignguCd) {
    return festivalRepository.findAll().stream()
            .filter(this::isActiveFestival)
            .filter(festival -> festival.getMapX() != null && festival.getMapY() != null)
            .filter(festival -> matchesRegion(festival, ldongRegnCd, ldongSignguCd))
            .map(this::toFestivalInfoResponseDto)
            .toList();
  }

  // 월별 축제 조회: 선택 월과 축제 기간이 겹치는 활성 축제를 조회합니다.
  public List<FestivalInfoResponseDto> getMonthlyFestivals(YearMonth targetMonth) {
    YearMonth month = Optional.ofNullable(targetMonth).orElse(YearMonth.now());
    LocalDate startDate = month.atDay(1);
    LocalDate endDate = month.atEndOfMonth();

    return festivalRepository.findAll().stream()
            .filter(this::isActiveFestival)
            .filter(festival -> matchesPeriod(festival, startDate, endDate))
            .sorted(Comparator.comparing(Festivals::getEventStartDate, Comparator.nullsLast(Comparator.naturalOrder())))
            .map(this::toFestivalInfoResponseDto)
            .toList();
  }

  // 지역 필터 조회: 활성화된 법정동 코드 목록을 내려줘서 프론트의 지역 선택 옵션으로 사용합니다.
  public List<LegalDongCodes> getRegionFilters() {
    return legalDongCodeRepository.findByActiveTrue();
  }

  // 테마 필터 조회: 활성화된 축제 카테고리 코드 목록을 내려줘서 프론트의 테마 선택 옵션으로 사용합니다.
  public List<FestivalCategoryCodes> getThemeFilters() {
    return festivalCategoryCodeRepository.findByActiveTrue();
  }

  // 축제 목록 조회: 활성 축제를 기본 최신 등록순으로 페이지 조회합니다.
  public Page<FestivalInfoResponseDto> getFestivalList(Pageable pageable) {
    Pageable safePageable = Optional.ofNullable(pageable)
            .orElse(PageRequest.of(DEFAULT_PAGE, DEFAULT_SIZE, Sort.by(Sort.Direction.DESC, "createdAt")));

    List<FestivalInfoResponseDto> festivals = festivalRepository.findAll().stream()
            .filter(this::isActiveFestival)
            .sorted(Comparator.comparing(Festivals::getCreatedAt, Comparator.nullsLast(Comparator.reverseOrder())))
            .map(this::toFestivalInfoResponseDto)
            .toList();

    return toPage(festivals, safePageable);
  }

  // 축제 수정: 현재 Festivals 엔티티에 수정 메서드/setter가 없어 실제 값 변경은 별도 엔티티 메서드 추가 후 구현해야 합니다.
  @Transactional
  public FestivalDetailResponseDto updateFestival(Long festivalId) {
    return getFestivalDetail(festivalId);
  }

  // 추천 축제 설정: 현재 추천 여부를 저장할 컬럼이 없어 상세 조회 결과만 반환합니다. 컬럼 추가 후 상태 변경 로직을 연결하면 됩니다.
  @Transactional
  public FestivalDetailResponseDto setRecommendedFestival(Long festivalId) {
    return getFestivalDetail(festivalId);
  }

  // ID로 축제를 찾고, 없으면 공통 예외로 처리합니다.
  private Festivals getFestivalOrThrow(Long festivalId) {
    return festivalRepository.findById(festivalId)
            .orElseThrow(() -> new CustomException(HttpStatus.NOT_FOUND, "축제를 찾을 수 없습니다."));
  }

  // 목록 카드 DTO 변환: 축제 엔티티를 프론트에서 반복 렌더링하기 쉬운 형태로 바꿉니다.
  private FestivalInfoResponseDto toFestivalInfoResponseDto(Festivals festival) {
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
            .liveCount(0L)
            .favoriteCount(defaultLong(festival.getFavoriteCount()))
            .likeCount(defaultLong(festival.getLikeCount()))
            .reviewCount(defaultLong(festival.getReviewCount()))
            .status(festival.getStatus() == null ? null : festival.getStatus().name())
            .build();
  }

  // 상세 이미지 목록 구성: firstImage를 먼저 넣고, festival_images 테이블의 추가 이미지를 뒤에 붙입니다.
  private List<String> resolveImageUrls(Festivals festival) {
    List<String> imageUrls = new ArrayList<>();

    if (festival.getFirstImage() != null && !festival.getFirstImage().isBlank()) {
      imageUrls.add(festival.getFirstImage());
    }

    festivalImageRepository.findByFestivalId(festival.getFestivalId()).stream()
            .sorted(Comparator.comparing(FestivalImages::getSortOrder, Comparator.nullsLast(Comparator.naturalOrder())))
            .map(FestivalImages::getImageUrl)
            .filter(imageUrl -> imageUrl != null && !imageUrl.isBlank())
            .filter(imageUrl -> !imageUrls.contains(imageUrl))
            .forEach(imageUrls::add);

    return imageUrls;
  }

  // 카테고리 표시명 조회: 코드 테이블에 매핑값이 있으면 이름을, 없으면 축제 타입/코드를 그대로 표시합니다.
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

  // 소분류/중분류/대분류 순서로 가장 구체적인 카테고리명을 선택합니다.
  private String pickMostSpecificCategoryName(FestivalCategoryCodes categoryCode) {
    if (categoryCode.getSclsName() != null && !categoryCode.getSclsName().isBlank()) {
      return categoryCode.getSclsName();
    }
    if (categoryCode.getMclsName() != null && !categoryCode.getMclsName().isBlank()) {
      return categoryCode.getMclsName();
    }
    return categoryCode.getLclsName();
  }

  // 활성 상태인 축제만 사용자 화면에 노출합니다.
  private boolean isActiveFestival(Festivals festival) {
    return festival.getStatus() == FestivalStatus.ACTIVE;
  }

  // 키워드가 비어 있으면 전체 통과, 값이 있으면 제목 포함 여부를 확인합니다.
  private boolean matchesKeyword(Festivals festival, String keyword) {
    return keyword == null
            || keyword.isBlank()
            || Optional.ofNullable(festival.getTitle()).orElse("").contains(keyword);
  }

  // 지역 코드가 비어 있으면 전체 통과, 시도/시군구 값이 있으면 각각 일치해야 통과합니다.
  private boolean matchesRegion(Festivals festival, String ldongRegnCd, String ldongSignguCd) {
    if (ldongRegnCd != null && !ldongRegnCd.isBlank() && !Objects.equals(festival.getLdongRegnCd(), ldongRegnCd)) {
      return false;
    }
    return ldongSignguCd == null || ldongSignguCd.isBlank() || Objects.equals(festival.getLdongSignguCd(), ldongSignguCd);
  }

  // 테마 코드는 대/중/소 분류 중 어느 하나와 일치하면 같은 테마로 판단합니다.
  private boolean matchesTheme(Festivals festival, String lclsSystm) {
    return lclsSystm == null
            || lclsSystm.isBlank()
            || Objects.equals(festival.getLclsSystm1(), lclsSystm)
            || Objects.equals(festival.getLclsSystm2(), lclsSystm)
            || Objects.equals(festival.getLclsSystm3(), lclsSystm);
  }

  // 검색 기간과 축제 기간이 하루라도 겹치면 기간 조건에 맞는 것으로 봅니다.
  private boolean matchesPeriod(Festivals festival, LocalDate startDate, LocalDate endDate) {
    if (startDate == null && endDate == null) {
      return true;
    }

    LocalDate searchStartDate = Optional.ofNullable(startDate).orElse(LocalDate.MIN);
    LocalDate searchEndDate = Optional.ofNullable(endDate).orElse(LocalDate.MAX);
    LocalDate eventStartDate = Optional.ofNullable(festival.getEventStartDate()).orElse(LocalDate.MIN);
    LocalDate eventEndDate = Optional.ofNullable(festival.getEventEndDate()).orElse(LocalDate.MAX);

    return !eventStartDate.isAfter(searchEndDate) && !eventEndDate.isBefore(searchStartDate);
  }

  // request에 page/size가 있으면 사용하고, 없으면 기본 페이지 설정을 사용합니다.
  private Pageable createPageable(FestivalSearchRequestDto request) {
    int page = Optional.ofNullable(request.getPage()).filter(value -> value >= 0).orElse(DEFAULT_PAGE);
    int size = Optional.ofNullable(request.getSize()).filter(value -> value > 0).orElse(DEFAULT_SIZE);
    return PageRequest.of(page, size);
  }

  // 이미 메모리에서 필터링된 목록을 Pageable 기준으로 잘라 Page 객체로 변환합니다.
  private <T> Page<T> toPage(List<T> content, Pageable pageable) {
    int start = (int) pageable.getOffset();
    int end = Math.min(start + pageable.getPageSize(), content.size());
    List<T> pageContent = start >= content.size() ? List.of() : content.subList(start, end);
    return new PageImpl<>(pageContent, pageable, content.size());
  }

  // null Long 값을 화면에 안전한 0으로 바꿉니다.
  private long defaultLong(Long value) {
    return value == null ? 0L : value;
  }
}
