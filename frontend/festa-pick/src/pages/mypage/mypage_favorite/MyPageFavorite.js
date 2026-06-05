import React, { useMemo, useState } from "react";
import {
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Heart,
  MapPin,
} from "lucide-react";
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

const favoriteItems = [
  {
    id: 1,
    title: "\uC11C\uC6B8 \uC7AC\uC988 \uD398\uC2A4\uD2F0\uBC8C 2026",
    date: "2026.06.18 - 2026.06.21",
    place: "\uC11C\uC6B8 \uC62C\uB9BC\uD53D\uACF5\uC6D0",
    category: "\uC74C\uC545",
    color: "#ff2d75",
  },
  {
    id: 2,
    title: "\uBD80\uC0B0 \uBC14\uB2E4\uBE5B \uC57C\uAC04\uCD95\uC81C",
    date: "2026.07.04 - 2026.07.12",
    place: "\uBD80\uC0B0 \uD574\uC6B4\uB300\uAD6C",
    category: "\uC57C\uAC04",
    color: "#00d4ff",
  },
  {
    id: 3,
    title: "\uC804\uC8FC \uD55C\uC625\uB9C8\uC744 \uBBF8\uC2DD\uC8FC\uAC04",
    date: "2026.08.09 - 2026.08.16",
    place: "\uC804\uBD81 \uC804\uC8FC\uC2DC",
    category: "\uBBF8\uC2DD",
    color: "#b8ff3d",
  },
  {
    id: 4,
    title: "\uAC15\uB989 \uCEE4\uD53C \uC544\uD2B8 \uD398\uC5B4",
    date: "2026.09.02 - 2026.09.06",
    place: "\uAC15\uC6D0 \uAC15\uB989\uC2DC",
    category: "\uC804\uC2DC",
    color: "#9b5cff",
  },
  {
    id: 5,
    title: "\uC81C\uC8FC \uBD88\uAF43 \uBBA4\uC9C1 \uD398\uC2A4\uD0C0",
    date: "2026.10.10 - 2026.10.12",
    place: "\uC81C\uC8FC \uC11C\uADC0\uD3EC\uC2DC",
    category: "\uBD88\uAF43",
    color: "#ff9f1c",
  },
  {
    id: 6,
    title: "\uB300\uC804 \uC0AC\uC774\uC5B8\uC2A4 \uC57C\uD589",
    date: "2026.11.05 - 2026.11.08",
    place: "\uB300\uC804 \uC720\uC131\uAD6C",
    category: "\uCCB4\uD5D8",
    color: "#22e6a8",
  },
  {
    id: 7,
    title:
      "\uAD11\uC8FC \uBBF8\uB514\uC5B4\uC544\uD2B8 \uD398\uC2A4\uD2F0\uBC8C",
    date: "2026.12.01 - 2026.12.06",
    place: "\uAD11\uC8FC \uB3D9\uAD6C",
    category: "\uBBF8\uB514\uC5B4",
    color: "#6c7dff",
  },
];

function MyPageFavorite() {
  const [page, setPage] = useState(1);
  const pageCount = Math.ceil(favoriteItems.length / ITEMS_PER_PAGE);
  const hasFavorites = favoriteItems.length > 0;

  const visibleFavorites = useMemo(() => {
    const startIndex = (page - 1) * ITEMS_PER_PAGE;
    return favoriteItems.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [page]);

  const movePage = (nextPage) => {
    setPage(Math.min(Math.max(nextPage, 1), pageCount));
  };

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
              {favoriteItems.length}
              {text.itemUnit}
            </S.CountBadge>
          </S.TitleRow>

          {hasFavorites ? (
            <>
              <S.FavoriteGrid>
                {visibleFavorites.map((item) => (
                  <S.FestivalCard key={item.id} to={`/festivals/${item.id}`}>
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
