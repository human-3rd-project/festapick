import React, { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Bookmark,
  CalendarDays,
  ChevronDown,
  Heart,
  Search as SearchIcon,
  SearchX,
  SlidersHorizontal,
  Star,
  ThumbsUp,
  X,
} from "lucide-react";
import FilterModal from "./FilterModal";
import AxiosApi from "../../api/AxiosApi";
import { useAuth } from "../../context/AuthContext";
import {
  ButtonGroup,
  CardBody,
  CardFooter,
  CardMeta,
  CardTitle,
  CategoryBadge,
  Chip,
  ChipRemove,
  ChipRow,
  Container,
  Description,
  DetailLink,
  EmptyCopy,
  EmptyIcon,
  EmptyState,
  FestivalCard,
  FilterDivider,
  FilterPanel,
  HeartButton,
  IconButton,
  ImageOverlay,
  ImageWrap,
  LiveBadge,
  LoadMoreButton,
  LoadMoreWrap,
  MetaItem,
  Page,
  PageHeader,
  ResetButton,
  ResponsiveStyles,
  ResultCount,
  ResultGrid,
  ResultsHeader,
  ResultsTitle,
  ResultsTitleWrap,
  SearchButton,
  SearchForm,
  SearchInput,
  SortGroup,
  SortSelect,
  StatGroup,
  Title,
} from "./FestaSearchCss";

const SEARCH_PAGE_SIZE = 30;
const SORT_RECOMMENDED = "recommended";
const SORT_LATEST = "latest";
const SORT_POPULAR = "popular";

const DEFAULT_FILTER_VALUES = {
  location: "",
  period: "",
  theme: "",
  ldongRegnCd: "",
  ldongSignguCd: "",
  lclsSystm: "",
};

// 추가: ApiResponse(data 래핑)와 일반 axios 응답을 모두 안전하게 꺼내기 위한 헬퍼입니다.
const getResponseData = (response) =>
  response?.data?.data ?? response?.data ?? null;

// 추가: Spring Page 응답(content)과 일반 배열 응답을 모두 검색 결과 배열로 처리합니다.
const getPageContent = (value) => {
  if (Array.isArray(value)) {
    return value;
  }

  if (Array.isArray(value?.content)) {
    return value.content;
  }

  return [];
};

const getPageNumber = (value, fallback = 0) => {
  const pageNumber = Number(value?.number);
  return Number.isInteger(pageNumber) && pageNumber >= 0
    ? pageNumber
    : fallback;
};

const getTotalElements = (value, fallback = 0) => {
  const totalElements = Number(value?.totalElements);
  return Number.isInteger(totalElements) && totalElements >= 0
    ? totalElements
    : fallback;
};

const getHasNextPage = (value) => {
  if (typeof value?.last === "boolean") {
    return !value.last;
  }

  const pageNumber = Number(value?.number);
  const totalPages = Number(value?.totalPages);

  return (
    Number.isInteger(pageNumber) &&
    Number.isInteger(totalPages) &&
    pageNumber + 1 < totalPages
  );
};

// 추가: 백엔드 LocalDate 문자열과 기존 period 문자열을 카드 표시용으로 통일합니다.
const formatDate = (value) => {
  if (!value) {
    return "";
  }

  return String(value).replaceAll("-", ".");
};

// 추가: FilterModal의 "yyyy.M.d - M.d" 표시값을 검색 API의 yyyy-MM-dd 값으로 변환합니다.
const toApiDate = (value, baseYear) => {
  const match = value?.trim().match(/(?:(\d{4})\.)?(\d{1,2})\.(\d{1,2})/);

  if (!match) {
    return "";
  }

  const year = match[1] || baseYear;
  const month = String(match[2]).padStart(2, "0");
  const day = String(match[3]).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

// 추가: 기간 필터 표시값을 startDate/endDate 검색 파라미터로 정규화합니다.
const parsePeriodForApi = (period) => {
  const [startValue, endValue] = period?.split(" - ") || [];
  const startDate = toApiDate(startValue);
  const startYear = startDate ? startDate.slice(0, 4) : "";
  const endDate = toApiDate(endValue, startYear) || startDate;

  return { startDate, endDate };
};

// 추가: 숫자값을 "1.2k" 형태의 짧은 표시 문자열로 바꿉니다.
const formatCount = (value) => {
  const numberValue = Number(value) || 0;

  if (numberValue >= 1000) {
    return `${(numberValue / 1000).toFixed(1).replace(".0", "")}k`;
  }

  return numberValue.toLocaleString("ko-KR");
};

// 추가: 카테고리명에 따라 기존 카드 배지 색상 톤을 안정적으로 배정합니다.
const getCategoryTone = (category = "") => {
  if (category.includes("예술") || category.includes("전통")) {
    return "violet";
  }

  if (category.includes("특산") || category.includes("기타")) {
    return "amber";
  }

  return "coral";
};

// 추가: 백엔드 축제 DTO를 카드/상세 이동에 쓰는 형태로 정규화합니다.
const normalizeFestival = (festival) => {
  const id = festival?.festivalId ?? festival?.id ?? festival?.contentId;
  const category = festival?.categoryName ?? festival?.category ?? "기타축제";
  const startDate = formatDate(festival?.eventStartDate);
  const endDate = formatDate(festival?.eventEndDate);
  const period =
    festival?.period ||
    (startDate && endDate
      ? `${startDate} - ${endDate}`
      : startDate || "일정 미정");
  const ratingValue =
    Number.parseFloat(festival?.averageRating ?? festival?.rating) || 0;

  return {
    ...festival,
    id,
    festivalId: festival?.festivalId ?? id,
    title: festival?.title || "이름 없는 축제",
    category,
    categoryTone: festival?.categoryTone || getCategoryTone(category),
    location:
      festival?.location ||
      [festival?.addr1, festival?.addr2].filter(Boolean).join(" ") ||
      "지역 정보 없음",
    period,
    rating:
      festival?.rating && typeof festival.rating === "string"
        ? festival.rating
        : `${ratingValue.toFixed(1)} (${formatCount(festival?.reviewCount)} reviews)`,
    likes: festival?.likes ?? formatCount(festival?.likeCount),
    saves: festival?.saves ?? formatCount(festival?.favoriteCount),
    live: Boolean(festival?.live || festival?.status === "ACTIVE"),
    image: festival?.image || festival?.firstImage || "",
  };
};

function Search() {
  const location = useLocation();
  const navigate = useNavigate();
  // AuthContext 역할: 찜 API는 로그인 사용자 기능이므로 로그인 여부를 확인합니다.
  const auth = useAuth();
  const isLoggedIn = auth?.isLoggedIn ?? false;
  const initialKeyword =
    location.state?.keyword ||
    new URLSearchParams(location.search).get("keyword") ||
    "";
  const [keyword, setKeyword] = useState(initialKeyword);
  const [submittedKeyword, setSubmittedKeyword] = useState(initialKeyword);
  const [hasSearched, setHasSearched] = useState(Boolean(initialKeyword));
  const [filters, setFilters] = useState([]);
  const [draftFilterValues, setDraftFilterValues] = useState(
    DEFAULT_FILTER_VALUES,
  );
  // 추가: 실제 검색에 적용된 필터입니다. 모달의 draft 값은 적용 버튼을 누르기 전까지 검색 조건에 쓰지 않습니다.
  const [appliedFilterValues, setAppliedFilterValues] = useState(null);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [favoriteFestivalIds, setFavoriteFestivalIds] = useState(
    () => new Set(),
  );
  // 추가: API 검색 결과와 로딩 상태를 별도 상태로 관리합니다.
  const [results, setResults] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [totalResultCount, setTotalResultCount] = useState(0);
  const [sortType, setSortType] = useState(SORT_RECOMMENDED);
  const [isSearching, setIsSearching] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  const searchParams = useMemo(() => {
    const periodParams = parsePeriodForApi(appliedFilterValues?.period);

    return {
      keyword: submittedKeyword.trim(),
      ldongRegnCd: appliedFilterValues?.ldongRegnCd || undefined,
      ldongSignguCd: appliedFilterValues?.ldongSignguCd || undefined,
      lclsSystm: appliedFilterValues?.lclsSystm || undefined,
      startDate: periodParams.startDate || undefined,
      endDate: periodParams.endDate || undefined,
      sortType,
    };
  }, [appliedFilterValues, sortType, submittedKeyword]);

  const hasMoreResults = hasNextPage;

  useEffect(() => {
    const nextKeyword =
      location.state?.keyword ||
      new URLSearchParams(location.search).get("keyword") ||
      "";

    setKeyword(nextKeyword);
    setSubmittedKeyword(nextKeyword);
    setHasSearched(Boolean(nextKeyword));
  }, [location.search, location.state]);

  // 추가: 검색어 또는 적용된 필터가 바뀌면 백엔드 축제 통합 검색 API를 호출합니다.
  useEffect(() => {
    let isMounted = true;

    if (!hasSearched) {
      setResults([]);
      setCurrentPage(0);
      setHasNextPage(false);
      setTotalResultCount(0);
      setIsLoadingMore(false);
      return undefined;
    }

    const fetchSearchResults = async () => {
      const requestParams = {
        ...searchParams,
        page: 0,
        size: SEARCH_PAGE_SIZE,
      };

      setIsSearching(true);
      setIsLoadingMore(false);

      try {
        const response = await AxiosApi.searchFestivals(requestParams);
        const pageData = getResponseData(response);
        const apiResults = getPageContent(pageData).map(normalizeFestival);

        if (isMounted) {
          setResults(apiResults);
          setCurrentPage(getPageNumber(pageData, 0));
          setHasNextPage(getHasNextPage(pageData));
          setTotalResultCount(getTotalElements(pageData, apiResults.length));
        }
      } catch (error) {
        if (isMounted) {
          console.error("FestaSearch search error:", error);
          setResults([]);
          setCurrentPage(0);
          setHasNextPage(false);
          setTotalResultCount(0);
        }
      } finally {
        if (isMounted) {
          setIsSearching(false);
        }
      }
    };

    fetchSearchResults();

    return () => {
      isMounted = false;
    };
  }, [hasSearched, searchParams]);

  const handleSubmit = (event) => {
    event.preventDefault();
    setSubmittedKeyword(keyword);
    setHasSearched(true);
  };

  const handleResetFilters = () => {
    setFilters([]);
    setDraftFilterValues(DEFAULT_FILTER_VALUES);
    setAppliedFilterValues(null);
  };

  const openFilterModal = () => {
    setIsFilterOpen(true);
  };

  const closeFilterModal = () => {
    setIsFilterOpen(false);
  };

  const removeFilter = (targetFilter) => {
    setFilters((currentFilters) =>
      currentFilters.filter((filter) => filter !== targetFilter),
    );
    // 추가: 칩을 개별 제거하면 적용된 검색 파라미터에서도 해당 조건을 함께 제거합니다.
    setAppliedFilterValues((currentValues) => {
      if (!currentValues) {
        return currentValues;
      }

      const nextValues = { ...currentValues };

      if (targetFilter === currentValues.location) {
        nextValues.location = "";
        nextValues.ldongRegnCd = "";
        nextValues.ldongSignguCd = "";
      }

      if (targetFilter === currentValues.period) {
        nextValues.period = "";
      }

      if (targetFilter === currentValues.theme) {
        nextValues.theme = "";
        nextValues.lclsSystm = "";
      }

      return nextValues;
    });
    setDraftFilterValues((currentValues) => {
      const nextValues = { ...currentValues };

      if (targetFilter === currentValues.location) {
        nextValues.location = "";
        nextValues.ldongRegnCd = "";
        nextValues.ldongSignguCd = "";
      }

      if (targetFilter === currentValues.period) {
        nextValues.period = "";
      }

      if (targetFilter === currentValues.theme) {
        nextValues.theme = "";
        nextValues.lclsSystm = "";
      }

      return nextValues;
    });
  };

  const handleApplyFilters = (nextFilterValues) => {
    setDraftFilterValues(nextFilterValues);
    setAppliedFilterValues(nextFilterValues);
    setFilters(
      [
        nextFilterValues.location,
        nextFilterValues.period,
        nextFilterValues.theme,
      ].filter(Boolean),
    );
    setHasSearched(true);
    closeFilterModal();
  };

  const handleSortChange = (event) => {
    setSortType(event.target.value);
  };

  const openFestivalDetail = (festival) => {
    navigate(`/detail/${festival.id}`, {
      state: {
        festival: {
          ...festival,
          favorite: favoriteFestivalIds.has(festival.id),
        },
      },
    });
  };

  // 추가: 찜 버튼은 로그인 상태에서 API를 호출하고, 실패 시 기존 로컬 상태로 되돌립니다.
  const toggleFavorite = async (festivalId) => {
    if (!festivalId) {
      return;
    }

    if (!isLoggedIn) {
      window.alert("로그인 후 축제를 찜할 수 있습니다.");
      return;
    }

    const wasFavorite = favoriteFestivalIds.has(festivalId);

    setFavoriteFestivalIds((currentIds) => {
      const nextIds = new Set(currentIds);

      if (nextIds.has(festivalId)) {
        nextIds.delete(festivalId);
      } else {
        nextIds.add(festivalId);
      }

      return nextIds;
    });

    try {
      if (wasFavorite) {
        await AxiosApi.deleteFavorite(festivalId);
      } else {
        await AxiosApi.createFavorite(festivalId);
      }
    } catch (error) {
      console.error("FestaSearch favorite toggle error:", error);
      setFavoriteFestivalIds((currentIds) => {
        const nextIds = new Set(currentIds);

        if (wasFavorite) {
          nextIds.add(festivalId);
        } else {
          nextIds.delete(festivalId);
        }

        return nextIds;
      });
    }
  };

  const handleCardKeyDown = (event, festival) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      openFestivalDetail(festival);
    }
  };

  const handleLoadMore = async () => {
    if (!hasNextPage || isLoadingMore) {
      return;
    }

    const nextPage = currentPage + 1;

    setIsLoadingMore(true);

    try {
      const response = await AxiosApi.searchFestivals({
        ...searchParams,
        page: nextPage,
        size: SEARCH_PAGE_SIZE,
      });
      const pageData = getResponseData(response);
      const apiResults = getPageContent(pageData).map(normalizeFestival);

      setResults((currentResults) => [...currentResults, ...apiResults]);
      setCurrentPage(getPageNumber(pageData, nextPage));
      setHasNextPage(getHasNextPage(pageData));
      setTotalResultCount((currentTotal) => {
        const fallbackTotal =
          currentTotal || results.length + apiResults.length;
        return getTotalElements(pageData, fallbackTotal);
      });
    } catch (error) {
      console.error("FestaSearch load more error:", error);
    } finally {
      setIsLoadingMore(false);
    }
  };

  return (
    <ResponsiveStyles>
      <Page>
        <Container>
          <PageHeader>
            <Title>축제 검색</Title>
            <Description>
              당신의 일상을 특별하게 해줄 완벽한 페스티벌을 찾아보세요.
            </Description>
          </PageHeader>

          <FilterPanel>
            <SearchForm onSubmit={handleSubmit}>
              <SearchInput
                aria-label="축제 검색어"
                onChange={(event) => setKeyword(event.target.value)}
                placeholder="축제 이름, 장소 등"
                type="text"
                value={keyword}
              />
              <ButtonGroup>
                <IconButton
                  aria-label="필터 설정"
                  onClick={openFilterModal}
                  title="필터 설정"
                  type="button"
                >
                  <SlidersHorizontal size={22} strokeWidth={2.2} />
                </IconButton>
                <SearchButton type="submit">
                  <SearchIcon size={18} strokeWidth={2.5} />
                  검색하기
                </SearchButton>
              </ButtonGroup>
            </SearchForm>

            {filters.length > 0 && (
              <>
                <FilterDivider />
                <ChipRow>
                  {filters.map((filter, index) => (
                    <Chip
                      $tone={
                        index === 1 ? "violet" : index === 2 ? "amber" : "coral"
                      }
                      key={filter}
                    >
                      {filter}
                      <ChipRemove
                        aria-label={`${filter} 필터 제거`}
                        onClick={() => removeFilter(filter)}
                        type="button"
                      >
                        <X size={13} strokeWidth={2.5} />
                      </ChipRemove>
                    </Chip>
                  ))}
                  <ResetButton onClick={handleResetFilters} type="button">
                    초기화
                  </ResetButton>
                </ChipRow>
              </>
            )}
          </FilterPanel>

          {!hasSearched && !isSearching && (
            <EmptyState>
              <EmptyIcon>
                <SearchIcon size={48} strokeWidth={1.8} />
              </EmptyIcon>
              <EmptyCopy>
                <h3>관심 있는 축제를 검색해 보세요</h3>
                <p>
                  키워드, 지역, 테마를 입력하여 나에게 딱 맞는 축제를
                  찾아보세요.
                </p>
              </EmptyCopy>
            </EmptyState>
          )}

          {hasSearched && !isSearching && results.length === 0 && (
            <EmptyState>
              <EmptyIcon>
                <SearchX size={48} strokeWidth={1.8} />
              </EmptyIcon>
              <EmptyCopy>
                <h3>검색 결과가 없습니다</h3>
                <p>
                  입력하신 키워드와 일치하는 축제를 찾을 수 없습니다.
                  <br />
                  다른 키워드나 필터로 다시 검색해 보세요.
                </p>
              </EmptyCopy>
            </EmptyState>
          )}

          {hasSearched && results.length > 0 && (
            <section>
              <ResultsHeader>
                <ResultsTitleWrap>
                  <ResultsTitle>검색 결과</ResultsTitle>
                  <ResultCount>
                    {totalResultCount || results.length}개 결과
                  </ResultCount>
                </ResultsTitleWrap>
                <SortGroup>
                  정렬 기준
                  <SortSelect
                    aria-label="검색 결과 정렬"
                    onChange={handleSortChange}
                    value={sortType}
                  >
                    <option value={SORT_RECOMMENDED}>추천순</option>
                    <option value={SORT_LATEST}>최신순</option>
                    <option value={SORT_POPULAR}>인기순</option>
                  </SortSelect>
                </SortGroup>
              </ResultsHeader>

              <ResultGrid>
                {results.map((festival) => (
                  <FestivalCard
                    key={festival.id}
                    onClick={() => openFestivalDetail(festival)}
                    onKeyDown={(event) => handleCardKeyDown(event, festival)}
                    role="button"
                    tabIndex={0}
                  >
                    <ImageWrap>
                      {festival.image && (
                        <img alt={festival.title} src={festival.image} />
                      )}
                      {festival.live && <LiveBadge>LIVE</LiveBadge>}
                      <HeartButton
                        $active={favoriteFestivalIds.has(festival.id)}
                        aria-label={`${festival.title} 찜하기`}
                        aria-pressed={favoriteFestivalIds.has(festival.id)}
                        onClick={(event) => {
                          event.stopPropagation();
                          toggleFavorite(festival.id);
                        }}
                        type="button"
                      >
                        <Heart
                          fill={
                            favoriteFestivalIds.has(festival.id)
                              ? "currentColor"
                              : "none"
                          }
                          size={20}
                          strokeWidth={2.3}
                        />
                      </HeartButton>
                      <ImageOverlay>
                        <CategoryBadge $tone={festival.categoryTone}>
                          {festival.category}
                        </CategoryBadge>
                        <CardTitle>{festival.title}</CardTitle>
                      </ImageOverlay>
                    </ImageWrap>

                    <CardBody>
                      <CardMeta>
                        <MetaItem>
                          <CalendarDays size={18} strokeWidth={2.2} />
                          {festival.period}
                        </MetaItem>
                        <MetaItem>
                          <Star size={18} strokeWidth={2.2} />
                          {festival.rating}
                        </MetaItem>
                      </CardMeta>

                      <CardFooter>
                        <StatGroup>
                          <MetaItem>
                            <ThumbsUp size={16} strokeWidth={2.1} />
                            {festival.likes}
                          </MetaItem>
                          <MetaItem>
                            <Bookmark size={16} strokeWidth={2.1} />
                            {festival.saves}
                          </MetaItem>
                        </StatGroup>
                        <DetailLink
                          onClick={(event) => {
                            event.stopPropagation();
                            openFestivalDetail(festival);
                          }}
                          type="button"
                        >
                          상세보기
                        </DetailLink>
                      </CardFooter>
                    </CardBody>
                  </FestivalCard>
                ))}

                {hasMoreResults && (
                  <LoadMoreWrap>
                    <LoadMoreButton
                      disabled={isLoadingMore}
                      onClick={handleLoadMore}
                      type="button"
                    >
                      {isLoadingMore ? "불러오는 중" : "더 많은 축제 보기"}
                      <ChevronDown size={18} strokeWidth={2.4} />
                    </LoadMoreButton>
                  </LoadMoreWrap>
                )}
              </ResultGrid>
            </section>
          )}
        </Container>

        <FilterModal
          isOpen={isFilterOpen}
          onApply={handleApplyFilters}
          onClose={closeFilterModal}
          onReset={handleResetFilters}
          values={draftFilterValues}
        />
      </Page>
    </ResponsiveStyles>
  );
}

export default Search;
