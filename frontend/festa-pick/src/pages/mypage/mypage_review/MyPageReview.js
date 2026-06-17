import React, { useEffect, useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Edit3,
  ExternalLink,
  MessageSquareText,
  Star,
} from "lucide-react";
import AxiosApi from "../../../api/AxiosApi";
import MyPageSidebar from "../../../components/mypage/MyPageSidebar";
import * as S from "./MyPageReviewStyle";

const REVIEWS_PER_PAGE = 4;

const fallbackImage =
  "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=700&q=80";

// ApiResponse<T>와 axios response 양쪽 형태에서 실제 data만 꺼냅니다.
const getResponseData = (response) => response?.data?.data ?? response?.data;

const formatReviewDate = (createdAt) => {
  if (!createdAt) {
    return "작성일 정보 없음";
  }

  return `${String(createdAt).slice(0, 10)} 작성`;
};

// MyReviewResDto를 기존 리뷰 카드 UI에서 쓰는 필드명으로 변환합니다.
const mapReview = (review) => ({
  id: review.festivalId,
  reviewId: review.reviewId,
  title: review.title || "제목 없는 축제",
  date: formatReviewDate(review.createdAt),
  category: review.categoryName || "축제",
  rating: review.rating || 0,
  image: review.thumbnailUrl || fallbackImage,
  content: review.content || "리뷰 내용이 없습니다.",
});

function MyPageReview() {
  const [page, setPage] = useState(1);
  const [reviews, setReviews] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [pageCount, setPageCount] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const hasReviews = reviews.length > 0;

  useEffect(() => {
    const loadReviews = async () => {
      setIsLoading(true);
      setErrorMessage("");

      try {
        // 백엔드 Pageable은 0부터 시작하고, 화면 페이지는 1부터 시작합니다.
        const response = await AxiosApi.getMyReviewList({
          page: page - 1,
          size: REVIEWS_PER_PAGE,
        });
        const pageData = getResponseData(response);
        const content = pageData?.content || [];

        setReviews(content.map(mapReview));
        setTotalCount(pageData?.totalElements ?? content.length);
        setPageCount(Math.max(pageData?.totalPages || 1, 1));
      } catch (error) {
        setReviews([]);
        setTotalCount(0);
        setPageCount(1);
        setErrorMessage(
          error.response?.data?.message || "리뷰 목록을 불러오지 못했습니다.",
        );
      } finally {
        setIsLoading(false);
      }
    };

    loadReviews();
  }, [page]);

  const movePage = (nextPage) => {
    setPage(Math.min(Math.max(nextPage, 1), pageCount));
  };

  const getReviewFestivalLink = (review) => ({
    to: `/festivals/${review.id}`,
    state: {
      festival: {
        id: review.id,
        title: review.title,
        name: review.title,
        category: review.category,
        image: review.image,
        rating: review.rating,
        reviews: [
          {
            id: review.reviewId,
            author: "나",
            rating: review.rating,
            date: review.date,
            content: review.content,
          },
        ],
      },
    },
  });

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
                <S.TotalNumber>{totalCount}</S.TotalNumber>
                <S.TotalLabel>TOTAL REVIEWS</S.TotalLabel>
              </S.TotalBox>
            )}
          </S.HeaderRow>

          {isLoading ? (
            <S.EmptyPanel>
              <S.EmptyContent>
                <S.EmptyTitle>리뷰 목록을 불러오는 중입니다</S.EmptyTitle>
              </S.EmptyContent>
            </S.EmptyPanel>
          ) : errorMessage ? (
            <S.EmptyPanel>
              <S.EmptyContent>
                <S.EmptyTitle>{errorMessage}</S.EmptyTitle>
              </S.EmptyContent>
            </S.EmptyPanel>
          ) : hasReviews ? (
            <>
              <S.ReviewGrid>
                {reviews.map((review) => (
                  <S.ReviewCard key={review.reviewId}>
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
                        <S.ReviewLink
                          to={getReviewFestivalLink(review).to}
                          state={getReviewFestivalLink(review).state}
                        >
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
                <S.EmptyTitle>아직 작성한 리뷰가 없어요</S.EmptyTitle>
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
