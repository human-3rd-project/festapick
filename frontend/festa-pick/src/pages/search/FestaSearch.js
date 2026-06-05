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

const FESTIVALS = [
  {
    id: 1,
    title: "네온 갤럭시 페스티벌 2024",
    category: "문화예술축제",
    categoryTone: "violet",
    location: "서울 강남구",
    period: "2024.08.15 - 08.17",
    rating: "4.8 (1.2k)",
    likes: "850",
    saves: "2.4k",
    live: true,
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuArg1f_X5Awzvi7aEs3vgBFmhpAQ4E3M6EB-aSBX5f6bEdoFB4ZHw_YyW4JmdAItBXLvjOExkQx1t0HhFmkWanyXtFeYPi-TWhzpPB5yr6yCfBiKrOazV0QLctEcHhOu8g2XKKDS5hbe7lGXMWRo4nRH5mnEzMYXTIIP_ovguDSIbDx2J8mKzwxODbAEXohc3RakDdjXqPlGlPkBYoyKeAZt0Vbh6PmhBNX5nC7nfRCBeyodbEXd08ChKuHjJRfvVNNJbvrpOJnuuCy",
  },
  {
    id: 2,
    title: "미드나잇 블루 재즈 페어",
    category: "문화예술축제",
    categoryTone: "amber",
    location: "부산 해운대구",
    period: "2024.09.02 - 09.04",
    rating: "4.9 (450)",
    likes: "320",
    saves: "1.1k",
    live: false,
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDvRXMyUblRDrPybiJtQ7N9hRaHqFenK4Esti_ijEnq1KaaN8Ed7WcR_x6OlJNztJV3VZa72wwFVEKtcTdp-_3x89im5bWleDuXTZwfaSuFASXnFXzJG4Yi0tylO20bYdFummfCKSIq_5CHA9jO12HLd1DbRtEw37lyJ5m8XB7T0IgjT-wCrGRH5kURQqv2_xatESvV7x0JzpTtVS3cqnJwbJuCGInoC9fxehglIjgH4BZ1s29PqxAw9ljD_e0xfWWNE7pCp4yMPvNt",
  },
  {
    id: 3,
    title: "루미너스 라이트 익스포",
    category: "문화관광축제",
    categoryTone: "coral",
    location: "대전 유성구",
    period: "2024.10.12 - 10.20",
    rating: "4.7 (890)",
    likes: "610",
    saves: "3.2k",
    live: false,
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBe5nxL_lPG74j7JT_XQhhi4y_K4QNBpzESNkp89SVytCYe1uUkxCyUzAsNKrbQFIHLSwtA-dhqoGfcFkl6ZLzm58ERVchkMUNvG5gSYCO51LOd0zbGwSfKjHcASfZVFoZoaEkhqvJFBzizVhCLqbidUSIRYuEsX0WUNZ69GJ3CIqMBuoy3iX7NdS-XooM4DhsF4Pj1ADglFlEVD1-Q2OiZKu27K2P1jygOenbQQPVPvyRrztuyr_EqRDRGA8GjBbrJqQTiWdFkHd_4",
  },
  {
    id: 4,
    title: "별빛 궁궐 야행",
    category: "전통역사축제",
    categoryTone: "violet",
    location: "서울 종로구",
    period: "2024.08.20 - 08.25",
    rating: "4.9 (2.1k)",
    likes: "1.2k",
    saves: "5.5k",
    live: false,
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCuM37ieKo2QKVF9zO3zNr1GdJ-FZBnCR2SCvE6ImlrjUadWzVk9t27ERL8XMMd3ghAjrau3HRWo9n3_rTPwFcjk7gB2ACtNNet-2sA4v4zFBrGQNMbnI7EfA2wOgI9Uhk6jIKOZ-Itv8EXbosk_-VDxnFfM-In9jnyhpk4RXY1bI5h7V1qDqvRtY0g5kek5lqwe3QbfZRElXcuryTNClus77gTjc61TzSabBAXg_Qo44-SAULaM792wMRNGQIfTgrHVoAY_Hn5TEuR",
  },
  {
    id: 5,
    title: "한강 선셋 푸드 페스타",
    category: "지역특산물축제",
    categoryTone: "amber",
    location: "서울 영등포구",
    period: "2024.09.18 - 09.22",
    rating: "4.6 (730)",
    likes: "540",
    saves: "1.8k",
    live: true,
    image:
      "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: 6,
    title: "제주 오름 뮤직 캠프",
    category: "생태자연축제",
    categoryTone: "coral",
    location: "제주특별자치도 제주시",
    period: "2024.10.03 - 10.06",
    rating: "4.8 (980)",
    likes: "780",
    saves: "2.9k",
    live: false,
    image:
      "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: 7,
    title: "전주 한옥 빛 축제",
    category: "전통역사축제",
    categoryTone: "violet",
    location: "전북특별자치도 전주시",
    period: "2024.11.01 - 11.10",
    rating: "4.9 (1.6k)",
    likes: "1.4k",
    saves: "4.1k",
    live: false,
    image:
      "https://images.unsplash.com/photo-1538485399081-7c8ed3b6bd71?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: 8,
    title: "목포 바다 재즈 나이트",
    category: "문화예술축제",
    categoryTone: "amber",
    location: "전라남도 목포시",
    period: "2024.09.27 - 09.29",
    rating: "4.7 (510)",
    likes: "410",
    saves: "1.5k",
    live: false,
    image:
      "https://images.unsplash.com/photo-1511192336575-5a79af67a629?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: 9,
    title: "나주 배꽃 문화제",
    category: "지역특산물축제",
    categoryTone: "coral",
    location: "전라남도 나주시",
    period: "2024.04.05 - 04.09",
    rating: "4.5 (360)",
    likes: "290",
    saves: "870",
    live: false,
    image:
      "https://images.unsplash.com/photo-1490750967868-88aa4486c946?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: 10,
    title: "부산 비치 EDM 위크",
    category: "문화관광축제",
    categoryTone: "violet",
    location: "부산 해운대구",
    period: "2024.08.01 - 08.04",
    rating: "4.8 (2.4k)",
    likes: "2.1k",
    saves: "6.2k",
    live: true,
    image:
      "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: 11,
    title: "강릉 커피 앤 아트 페어",
    category: "기타축제",
    categoryTone: "amber",
    location: "강원특별자치도 강릉시",
    period: "2024.10.18 - 10.20",
    rating: "4.6 (640)",
    likes: "520",
    saves: "1.9k",
    live: false,
    image:
      "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: 12,
    title: "대전 사이언스 라이트 페스티벌",
    category: "문화관광축제",
    categoryTone: "coral",
    location: "대전 유성구",
    period: "2024.12.06 - 12.15",
    rating: "4.7 (1.1k)",
    likes: "890",
    saves: "3.7k",
    live: false,
    hasMap: false,
    reviews: [],
    image:
      "https://images.unsplash.com/photo-1535223289827-42f1e9919769?auto=format&fit=crop&w=900&q=80",
  },
];

const INITIAL_RESULT_COUNT = 6;
const RESULT_LOAD_SIZE = 3;

const DEFAULT_FILTER_VALUES = {
  location: "서울특별시 강남구",
  period: "2026.6.1 - 6.10",
  theme: "전통역사축제",
};

function Search() {
  const location = useLocation();
  const navigate = useNavigate();
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
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [favoriteFestivalIds, setFavoriteFestivalIds] = useState(
    () => new Set(),
  );
  const [visibleResultCount, setVisibleResultCount] =
    useState(INITIAL_RESULT_COUNT);

  const results = useMemo(() => {
    const query = submittedKeyword.trim().toLowerCase();

    if (!hasSearched) {
      return [];
    }

    if (!query) {
      return FESTIVALS;
    }

    return FESTIVALS.filter((festival) => {
      const searchableText = [
        festival.title,
        festival.category,
        festival.location,
        festival.period,
      ]
        .join(" ")
        .toLowerCase();

      return searchableText.includes(query);
    });
  }, [hasSearched, submittedKeyword]);
  const visibleResults = useMemo(
    () => results.slice(0, visibleResultCount),
    [results, visibleResultCount],
  );
  const hasMoreResults = visibleResultCount < results.length;

  useEffect(() => {
    const nextKeyword =
      location.state?.keyword ||
      new URLSearchParams(location.search).get("keyword") ||
      "";

    setKeyword(nextKeyword);
    setSubmittedKeyword(nextKeyword);
    setHasSearched(Boolean(nextKeyword));
    setVisibleResultCount(INITIAL_RESULT_COUNT);
  }, [location.search, location.state]);

  const handleSubmit = (event) => {
    event.preventDefault();
    setSubmittedKeyword(keyword);
    setHasSearched(true);
    setVisibleResultCount(INITIAL_RESULT_COUNT);
  };

  const handleResetFilters = () => {
    setFilters([]);
    setDraftFilterValues(DEFAULT_FILTER_VALUES);
  };

  const removeFilter = (targetFilter) => {
    setFilters((currentFilters) =>
      currentFilters.filter((filter) => filter !== targetFilter),
    );
  };

  const handleApplyFilters = (nextFilterValues) => {
    setDraftFilterValues(nextFilterValues);
    setFilters(
      [
        nextFilterValues.location,
        nextFilterValues.period,
        nextFilterValues.theme,
      ].filter(Boolean),
    );
    setIsFilterOpen(false);
    setVisibleResultCount(INITIAL_RESULT_COUNT);
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

  const toggleFavorite = (festivalId) => {
    setFavoriteFestivalIds((currentIds) => {
      const nextIds = new Set(currentIds);

      if (nextIds.has(festivalId)) {
        nextIds.delete(festivalId);
      } else {
        nextIds.add(festivalId);
      }

      return nextIds;
    });
  };

  const handleCardKeyDown = (event, festival) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      openFestivalDetail(festival);
    }
  };

  const handleLoadMore = () => {
    setVisibleResultCount((currentCount) =>
      Math.min(currentCount + RESULT_LOAD_SIZE, results.length),
    );
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
                  onClick={() => setIsFilterOpen(true)}
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

          {!hasSearched && (
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

          {hasSearched && results.length === 0 && (
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
                  <ResultCount>{results.length}개 결과</ResultCount>
                </ResultsTitleWrap>
                <SortGroup>
                  정렬 기준
                  <SortSelect aria-label="검색 결과 정렬">
                    <option>추천순</option>
                    <option>최신순</option>
                    <option>인기순</option>
                  </SortSelect>
                </SortGroup>
              </ResultsHeader>

              <ResultGrid>
                {visibleResults.map((festival) => (
                  <FestivalCard
                    key={festival.id}
                    onClick={() => openFestivalDetail(festival)}
                    onKeyDown={(event) => handleCardKeyDown(event, festival)}
                    role="button"
                    tabIndex={0}
                  >
                    <ImageWrap>
                      <img alt={festival.title} src={festival.image} />
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
                    <LoadMoreButton onClick={handleLoadMore} type="button">
                      더 많은 축제 보기
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
          onClose={() => setIsFilterOpen(false)}
          onReset={handleResetFilters}
          values={draftFilterValues}
        />
      </Page>
    </ResponsiveStyles>
  );
}

export default Search;
