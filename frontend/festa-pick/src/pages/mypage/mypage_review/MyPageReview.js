import React, { useMemo, useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Edit3,
  ExternalLink,
  MessageSquareText,
  Star,
} from "lucide-react";
import MyPageSidebar from "../../../components/mypage/MyPageSidebar";
import * as S from "./MyPageReviewStyle";

const REVIEWS_PER_PAGE = 4;

const reviews = [
  {
    id: 1,
    reviewId: 1001,
    title: "서울 락스페 2024",
    date: "2024년 6월 14일 작성",
    category: "ROCK / INDIE",
    rating: 5,
    image:
      "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=700&q=80",
    content:
      "역대 최고의 락 페스티벌이었습니다. 사운드 엔지니어링이 정말 훌륭했고 라인업도 다양했습니다. 내년 공연이 벌써 기다려지네요.",
  },
  {
    id: 2,
    reviewId: 1002,
    title: "네온 비츠 미드나잇",
    date: "2024년 7월 2일 작성",
    category: "ELECTRONIC",
    rating: 5,
    image:
      "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=700&q=80",
    content:
      "시각 효과가 정말 압도적이었습니다. 마지막 드롭 구간의 연출은 잊기 힘들어요. 관객 동선과 스테이지 구성도 좋았습니다.",
  },
  {
    id: 3,
    reviewId: 1003,
    title: "트와일라잇 재즈 나잇",
    date: "2024년 8월 9일 작성",
    category: "JAZZ / ARTS",
    rating: 5,
    image:
      "https://images.unsplash.com/photo-1511192336575-5a79af67a629?auto=format&fit=crop&w=700&q=80",
    content:
      "야외 분위기와 재즈 사운드가 잘 어울렸습니다. 무대가 아늑했고 음식 부스의 품질도 훌륭했습니다.",
  },
  {
    id: 4,
    reviewId: 1004,
    title: "글로벌 컬쳐 페스트",
    date: "2024년 9월 20일 작성",
    category: "CULTURE",
    rating: 5,
    image:
      "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=700&q=80",
    content:
      "다양한 나라의 문화 체험과 공연을 즐길 수 있었습니다. 안내 동선이 좋아 가족과 함께 방문하기에도 좋았어요.",
  },
  {
    id: 5,
    reviewId: 1005,
    title: "문라이트 푸드마켓",
    date: "2024년 10월 5일 작성",
    category: "FOOD",
    rating: 4,
    image:
      "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=700&q=80",
    content:
      "야시장 분위기와 로컬 푸드 구성이 좋았습니다. 인기 부스는 대기가 길어서 동선을 미리 잡는 게 좋겠어요.",
  },
  {
    id: 6,
    reviewId: 1006,
    title: "시티 라이트 아트페어",
    date: "2024년 10월 18일 작성",
    category: "ART",
    rating: 4,
    image:
      "https://images.unsplash.com/photo-1547826039-bfc35e0f1ea8?auto=format&fit=crop&w=700&q=80",
    content:
      "밤 조명과 미디어아트가 잘 어우러진 전시였습니다. 포토존이 많고 관람 동선도 편했습니다.",
  },
];

const hasReviews = reviews.length > 0;

function MyPageReview() {
  const [page, setPage] = useState(1);
  const pageCount = Math.ceil(reviews.length / REVIEWS_PER_PAGE);

  const visibleReviews = useMemo(() => {
    const startIndex = (page - 1) * REVIEWS_PER_PAGE;

    return reviews.slice(startIndex, startIndex + REVIEWS_PER_PAGE);
  }, [page]);

  const movePage = (nextPage) => {
    setPage(Math.min(Math.max(nextPage, 1), pageCount));
  };

  return (
    <S.Page>
      <S.Container>
        <MyPageSidebar activePath="/mypage/review" />

        <S.Content>
          <S.HeaderRow>
            <S.TitleGroup>
              <S.Title>나의 리뷰</S.Title>
              <S.Description>
                지금까지 방문한 페스티벌에 대해 작성한 리뷰들입니다.
              </S.Description>
            </S.TitleGroup>

            {hasReviews && (
              <S.TotalBox>
                <S.TotalNumber>{reviews.length}</S.TotalNumber>
                <S.TotalLabel>TOTAL REVIEWS</S.TotalLabel>
              </S.TotalBox>
            )}
          </S.HeaderRow>

          {hasReviews ? (
            <>
              <S.ReviewGrid>
                {visibleReviews.map((review) => (
                  <S.ReviewCard key={review.id}>
                    <S.CardImageWrap>
                      <S.CardImage src={review.image} alt="" />
                      <S.CategoryBadge>{review.category}</S.CategoryBadge>
                    </S.CardImageWrap>

                    <S.CardBody>
                      <S.CardTitleRow>
                        <S.CardTitle>{review.title}</S.CardTitle>
                        <S.StarList aria-label={`${review.rating}점`}>
                          {Array.from({ length: review.rating }).map(
                            (_, index) => (
                              <Star
                                key={index}
                                size={12}
                                fill="currentColor"
                                aria-hidden="true"
                              />
                            ),
                          )}
                        </S.StarList>
                      </S.CardTitleRow>
                      <S.CardDate>{review.date}</S.CardDate>
                      <S.CardText>{review.content}</S.CardText>

                      <S.CardActions>
                        <S.ReviewLink to={`/reviews/${review.reviewId}`}>
                          <ExternalLink size={13} aria-hidden="true" />내 리뷰
                          보러가기
                        </S.ReviewLink>
                      </S.CardActions>
                    </S.CardBody>
                  </S.ReviewCard>
                ))}
              </S.ReviewGrid>

              {pageCount > 1 && (
                <S.Pagination aria-label="나의 리뷰 페이지">
                  <S.PageButton
                    type="button"
                    disabled={page === 1}
                    onClick={() => movePage(page - 1)}
                    aria-label="이전 페이지"
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
                    aria-label="다음 페이지"
                  >
                    <ChevronRight size={18} aria-hidden="true" />
                  </S.PageButton>
                </S.Pagination>
              )}
            </>
          ) : (
            <S.EmptyPanel>
              <S.EmptyContent>
                <S.EmptyIcon aria-hidden="true">
                  <MessageSquareText size={46} strokeWidth={1.7} />
                </S.EmptyIcon>
                <S.EmptyTitle>아직 작성한 리뷰가 없습니다</S.EmptyTitle>
                <S.EmptyDescription>
                  경험했던 멋진 순간들을 사람들과 공유해보세요.
                  <br />
                  리뷰를 남기면 특별한 뱃지를 획득할 수 있습니다.
                </S.EmptyDescription>
                <S.EmptyButton type="button">
                  <Edit3 size={14} aria-hidden="true" />
                  리뷰 작성하러 가기
                </S.EmptyButton>
              </S.EmptyContent>
            </S.EmptyPanel>
          )}
        </S.Content>
      </S.Container>
    </S.Page>
  );
}

export default MyPageReview;
