import React, { useEffect, useState } from "react";
import {
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Heart,
  MapPin,
} from "lucide-react";
import AxiosApi from "../../../api/AxiosApi";
import MyPageSidebar from "../../../components/mypage/MyPageSidebar";
import * as S from "./MyPageFavoriteStyle";

const ITEMS_PER_PAGE = 6;

const text = {
  title: "\uCC1C \uBAA9\uB85D",
  eyebrow: "My Page",
  emptyTitle: "\uC544\uC9C1 \uCC1C\uD55C \uCD95\uC81C\uAC00 \uC5C6\uC5B4\uC694",
  emptyDescription:
    "\uAD00\uC2EC \uC788\uB294 \uCD95\uC81C\uB97C \uCC1C\uD558\uBA74 \uC774\uACF3\uC5D0\uC11C \uD55C\uB208\uC5D0 \uD655\uC778\uD560 \uC218 \uC788\uC5B4\uC694.",
  findMore: "\uCD95\uC81C \uB354 \uCC3E\uC544\uBCF4\uAE30",
  itemUnit: "\uAC1C",
};

const cardColors = ["#ff2d75", "#00d4ff", "#b8ff3d", "#9b5cff", "#ff9f1c", "#22e6a8"];

// ApiResponse<T>와 axios response 양쪽 형태에서 실제 data만 꺼냅니다.
const getResponseData = (response) => response?.data?.data ?? response?.data;

const formatFestivalDate = (startDate, endDate) => {
  if (!startDate && !endDate) {
    return "일정 정보 없음";
  }

  return [startDate, endDate].filter(Boolean).join(" - ");
};

// FavoriteListResDto를 기존 카드 UI에서 쓰는 필드명으로 변환합니다.
const mapFavoriteItem = (item, index) => ({
  id: item.festivalId,
  favoriteId: item.favoriteId,
  title: item.title || "제목 없는 축제",
  date: formatFestivalDate(item.eventStartDate, item.eventEndDate),
  place: item.regionName || "지역 정보 없음",
  category: item.categoryName || "축제",
  image: item.thumbnailUrl,
  color: cardColors[index % cardColors.length],
});

function MyPageFavorite() {
  const [page, setPage] = useState(1);
  const [favoriteItems, setFavoriteItems] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [pageCount, setPageCount] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const hasFavorites = favoriteItems.length > 0;

  useEffect(() => {
    const loadFavorites = async () => {
      setIsLoading(true);
      setErrorMessage("");

      try {
        // 백엔드 Pageable은 0부터 시작하고, 화면 페이지는 1부터 시작합니다.
        const response = await AxiosApi.getMyFavoriteList({
          page: page - 1,
          size: ITEMS_PER_PAGE,
        });
        const pageData = getResponseData(response);
        const content = pageData?.content || [];

        setFavoriteItems(content.map(mapFavoriteItem));
        setTotalCount(pageData?.totalElements ?? content.length);
        setPageCount(Math.max(pageData?.totalPages || 1, 1));
      } catch (error) {
        setFavoriteItems([]);
        setTotalCount(0);
        setPageCount(1);
        setErrorMessage(
          error.response?.data?.message || "찜 목록을 불러오지 못했습니다.",
        );
      } finally {
        setIsLoading(false);
      }
    };

    loadFavorites();
  }, [page]);

  const movePage = (nextPage) => {
    setPage(Math.min(Math.max(nextPage, 1), pageCount));
  };

  const getFestivalLink = (item) => ({
    to: `/festivals/${item.id}`,
    state: {
      festival: {
        id: item.id,
        title: item.title,
        name: item.title,
        date: item.date,
        location: item.place,
        venue: item.place,
        category: item.category,
        favorite: true,
      },
    },
  });

  return (
    <S.Page>
      <S.Container>
        <MyPageSidebar activePath="/mypage/favorite" />

        <S.Content>
          <S.TitleRow>
            <S.TitleGroup>
              <S.Eyebrow>{text.eyebrow}</S.Eyebrow>
              <S.Title>{text.title}</S.Title>
            </S.TitleGroup>
            <S.CountBadge>
              {totalCount}
              {text.itemUnit}
            </S.CountBadge>
          </S.TitleRow>

          {isLoading ? (
            <S.EmptyState>
              <S.EmptyTitle>찜 목록을 불러오는 중입니다</S.EmptyTitle>
            </S.EmptyState>
          ) : errorMessage ? (
            <S.EmptyState>
              <S.EmptyTitle>{errorMessage}</S.EmptyTitle>
            </S.EmptyState>
          ) : hasFavorites ? (
            <>
              <S.FavoriteGrid>
                {favoriteItems.map((item) => (
                  <S.FestivalCard
                    key={item.id}
                    to={getFestivalLink(item).to}
                    state={getFestivalLink(item).state}
                  >
                    <S.FestivalPoster $color={item.color}>
                      <S.PosterCategory>{item.category}</S.PosterCategory>
                      <S.PosterHeart aria-hidden="true">
                        <Heart size={18} fill="currentColor" />
                      </S.PosterHeart>
                    </S.FestivalPoster>

                    <S.FestivalInfo>
                      <S.FestivalTitle>{item.title}</S.FestivalTitle>
                      <S.MetaRow>
                        <CalendarDays size={15} aria-hidden="true" />
                        <span>{item.date}</span>
                      </S.MetaRow>
                      <S.MetaRow>
                        <MapPin size={15} aria-hidden="true" />
                        <span>{item.place}</span>
                      </S.MetaRow>
                    </S.FestivalInfo>
                  </S.FestivalCard>
                ))}
              </S.FavoriteGrid>

              {pageCount > 1 && (
                <S.Pagination aria-label="\uCC1C \uBAA9\uB85D \uD398\uC774\uC9C0">
                  <S.PageButton
                    type="button"
                    disabled={page === 1}
                    onClick={() => movePage(page - 1)}
                    aria-label="\uC774\uC804 \uD398\uC774\uC9C0"
                  >
                    <ChevronLeft size={18} aria-hidden="true" />
                  </S.PageButton>
                  {Array.from(
                    { length: pageCount },
                    (_, index) => index + 1,
                  ).map((pageNumber) => (
                    <S.PageNumberButton
                      key={pageNumber}
                      type="button"
                      $active={pageNumber === page}
                      onClick={() => movePage(pageNumber)}
                    >
                      {pageNumber}
                    </S.PageNumberButton>
                  ))}
                  <S.PageButton
                    type="button"
                    disabled={page === pageCount}
                    onClick={() => movePage(page + 1)}
                    aria-label="\uB2E4\uC74C \uD398\uC774\uC9C0"
                  >
                    <ChevronRight size={18} aria-hidden="true" />
                  </S.PageButton>
                </S.Pagination>
              )}

              <S.FindMoreButton type="button">{text.findMore}</S.FindMoreButton>
            </>
          ) : (
            <S.EmptyState>
              <S.EmptyIcon aria-hidden="true">
                <Heart size={42} strokeWidth={1.8} />
              </S.EmptyIcon>
              <S.EmptyTitle>{text.emptyTitle}</S.EmptyTitle>
              <S.EmptyDescription>{text.emptyDescription}</S.EmptyDescription>
              <S.FindMoreButton type="button">{text.findMore}</S.FindMoreButton>
            </S.EmptyState>
          )}
        </S.Content>
      </S.Container>
    </S.Page>
  );
}

export default MyPageFavorite;
