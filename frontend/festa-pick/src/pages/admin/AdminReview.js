import React, { useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { MessageSquareText, Search, SearchX, Star, Trash2 } from "lucide-react";
import AdminNav from "./AdminNav";
import AdminPageNation from "./AdminPageNation";
import {
  ActionCell,
  ConfirmDelete,
  ContentArea,
  EmptyBadge,
  EmptyCopy,
  EmptyGlow,
  EmptyIconCard,
  EmptyState,
  EmptyTitle,
  HeaderActions,
  HeaderCopy,
  MainCanvas,
  PageFrame,
  PageHeader,
  PageSubtitle,
  PageTitle,
  RatingStars,
  ReviewContent,
  ReviewerAvatar,
  ReviewerIdentity,
  ReviewerMeta,
  ReviewerName,
  SearchBox,
  SearchIcon,
  SearchInput,
  StatPill,
  Table,
  TableCard,
  TableScroll,
  TextButton,
} from "./AdminReviewCss";

const PAGE_SIZE = 10;

function getDeletePopoverPosition(target) {
  const rect = target.getBoundingClientRect();
  const width = 128;
  const height = 44;
  const gap = 8;
  const left = Math.max(12, Math.min(rect.right - width, window.innerWidth - width - 12));
  const bottomTop = rect.bottom + gap;
  const top =
    bottomTop + height > window.innerHeight - 12 ? rect.top - height - gap : bottomTop;

  return { left, top };
}

const sampleReviews = [
  {
    id: 1,
    reviewerName: "조던 데이비스",
    email: "jordan@example.com",
    festivalName: "네온 펄스 2024",
    rating: 5,
    content: "정말 놀라운 경험이었습니다. 비주얼 매핑이 환상적이었어요. 내년이 너무 기대됩니다!",
    createdAt: "2024-10-12",
  },
  {
    id: 2,
    reviewerName: "사라 리아오",
    email: "sarah@example.com",
    festivalName: "문라이트 재즈",
    rating: 4,
    content: "분위기는 좋았지만 주차 문제는 약간 혼란스러웠습니다. 음악은 최고였어요.",
    createdAt: "2024-10-11",
  },
  {
    id: 3,
    reviewerName: "마커스 쏜",
    email: "marcus@example.com",
    festivalName: "사이버 펑크 페스트",
    rating: 3,
    content: "괜찮은 공연이었지만 음료 가격이 제공된 것에 비해 조금 높았습니다.",
    createdAt: "2024-10-09",
  },
  {
    id: 4,
    reviewerName: "엘레나 K.",
    email: "elena@example.com",
    festivalName: "레트로 웨이브 80s",
    rating: 5,
    content: "신스웨이브 세트는 마법 같았습니다. 1984년 네온 꿈속을 걷는 기분이었어요!",
    createdAt: "2024-10-08",
  },
];

function getReviewKey(review, index) {
  return review.id || review.reviewId || review.uuid || index;
}

function getReviewerName(review) {
  return review.reviewerName || review.userName || review.memberName || review.nickname || "익명 사용자";
}

function getReviewerEmail(review) {
  return review.email || review.userEmail || review.memberEmail || "이메일 없음";
}

function getFestivalName(review) {
  return review.festivalName || review.festivalTitle || review.title || review.festival || "-";
}

function getReviewText(review) {
  return review.content || review.reviewContent || review.comment || review.text || "-";
}

function getInitials(name = "") {
  const source = name.trim() || "리뷰";

  return source
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
}

function getRating(review) {
  const rating = Number(review.rating || review.score || review.star || 0);

  if (Number.isNaN(rating)) {
    return 0;
  }

  return Math.max(0, Math.min(5, Math.round(rating)));
}

function formatDate(value) {
  if (!value) {
    return "-";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}.${month}.${day}`;
}

function AdminReview({
  currentPage = 1,
  onDeleteReview,
  onPageChange,
  onSearchChange,
  reviews = [],
  totalItems,
}) {
  const [searchTerm, setSearchTerm] = useState("");
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deletedIds, setDeletedIds] = useState([]);
  // 임시 확인 버튼: 리뷰 데이터 있음/없음 디자인 확인용, 실제 기능 연결 시 제거
  const [showSampleReviews, setShowSampleReviews] = useState(false);
  // 임시 확인 버튼 끝

  // 임시 확인 버튼: 리뷰 데이터 있음/없음 디자인 확인용, 실제 기능 연결 시 제거
  const displayReviews = showSampleReviews ? sampleReviews : reviews;
  // 임시 확인 버튼 끝

  const visibleReviews = useMemo(
    () =>
      displayReviews.filter((review, index) => !deletedIds.includes(getReviewKey(review, index))),
    [deletedIds, displayReviews],
  );

  const filteredReviews = useMemo(() => {
    const keyword = searchTerm.trim().toLowerCase();

    if (!keyword) {
      return visibleReviews;
    }

    return visibleReviews.filter((review) => {
      const searchableText = [
        getReviewerName(review),
        getReviewerEmail(review),
        getFestivalName(review),
        getReviewText(review),
        review.rating,
        review.score,
        review.createdAt,
        review.reviewDate,
        review.id,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return searchableText.includes(keyword);
    });
  }, [searchTerm, visibleReviews]);

  const hasReviews = filteredReviews.length > 0;
  const totalCount = totalItems || visibleReviews.length;

  const handleSearchChange = (event) => {
    const value = event.target.value;
    setSearchTerm(value);

    if (onSearchChange) {
      onSearchChange(value);
    }
  };

  const confirmDelete = (review, index) => {
    if (onDeleteReview) {
      onDeleteReview(review);
    } else {
      setDeletedIds((prev) => [...prev, getReviewKey(review, index)]);
    }

    setDeleteTarget(null);
  };

  const toggleDeleteTarget = (id, target) => {
    setDeleteTarget((prev) => {
      if (prev?.id === id) {
        return null;
      }

      return {
        id,
        ...getDeletePopoverPosition(target),
      };
    });
  };

  return (
    <PageFrame>
      <AdminNav />

      <MainCanvas>
        <ContentArea $isEmpty={!hasReviews}>
          <PageHeader>
            <HeaderCopy>
              <PageTitle>리뷰 관리</PageTitle>
              <PageSubtitle>
                모든 활성 페스티벌의 사용자 피드백을 모니터링하고 조정합니다.
                FestaPick 커뮤니티의 품질을 유지하세요.
              </PageSubtitle>
            </HeaderCopy>

            <HeaderActions>
              <SearchBox>
                <SearchIcon aria-hidden="true">
                  <Search />
                </SearchIcon>
                <SearchInput
                  type="search"
                  placeholder="리뷰 검색..."
                  value={searchTerm}
                  onChange={handleSearchChange}
                />
              </SearchBox>

              <StatPill>
                <strong>{totalCount.toLocaleString("ko-KR")}</strong>
                <span>총 리뷰 수</span>
              </StatPill>

              {/* 임시 확인 버튼: 리뷰 데이터 있음/없음 디자인 확인용, 실제 기능 연결 시 제거 */}
              <TextButton
                type="button"
                onClick={() => setShowSampleReviews((prev) => !prev)}
              >
                {showSampleReviews ? "빈 상태 보기" : "목록 상태 보기"}
              </TextButton>
              {/* 임시 확인 버튼 끝 */}
            </HeaderActions>
          </PageHeader>

          {hasReviews ? (
            <TableCard>
              <TableScroll>
                <Table>
                  <thead>
                    <tr>
                      <th>리뷰어</th>
                      <th>페스티벌</th>
                      <th>평점</th>
                      <th>리뷰 내용</th>
                      <th>날짜</th>
                      <th>작업</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredReviews.map((review, index) => {
                      const key = getReviewKey(review, index);
                      const reviewerName = getReviewerName(review);
                      const rating = getRating(review);

                      return (
                        <tr key={key}>
                          <td>
                            <ReviewerIdentity>
                              <ReviewerAvatar $tone={index % 4}>
                                {review.avatar || review.profileImage ? (
                                  <img
                                    src={review.avatar || review.profileImage}
                                    alt={reviewerName}
                                  />
                                ) : (
                                  getInitials(reviewerName)
                                )}
                              </ReviewerAvatar>
                              <div>
                                <ReviewerName>{reviewerName}</ReviewerName>
                                <ReviewerMeta>{getReviewerEmail(review)}</ReviewerMeta>
                              </div>
                            </ReviewerIdentity>
                          </td>
                          <td>{getFestivalName(review)}</td>
                          <td>
                            <RatingStars aria-label={`${rating}점`}>
                              {Array.from({ length: 5 }, (_, starIndex) => (
                                <Star key={starIndex} data-filled={starIndex < rating} />
                              ))}
                            </RatingStars>
                          </td>
                          <td>
                            <ReviewContent>{getReviewText(review)}</ReviewContent>
                          </td>
                          <td>{formatDate(review.createdAt || review.reviewDate || review.date)}</td>
                          <td>
                            <ActionCell>
                              <button
                                type="button"
                                aria-label={`${reviewerName} 리뷰 삭제`}
                                onClick={(event) => toggleDeleteTarget(key, event.currentTarget)}
                              >
                                <Trash2 aria-hidden="true" />
                              </button>

                              {deleteTarget?.id === key &&
                                createPortal(
                                <ConfirmDelete
                                  type="button"
                                  $left={deleteTarget.left}
                                  $top={deleteTarget.top}
                                  onClick={() => confirmDelete(review, index)}
                                >
                                  삭제 확인
                                </ConfirmDelete>,
                                document.body,
                              )}
                            </ActionCell>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </Table>
              </TableScroll>

              <AdminPageNation
                currentPage={currentPage}
                itemLabel="개"
                itemNoun="리뷰"
                onPageChange={onPageChange}
                pageSize={PAGE_SIZE}
                totalItems={totalCount}
                visibleItems={filteredReviews.length}
              />
            </TableCard>
          ) : (
            <EmptyState>
              <EmptyIconCard>
                <EmptyGlow />
                <MessageSquareText aria-hidden="true" />
                <EmptyBadge>
                  <SearchX aria-hidden="true" />
                </EmptyBadge>
              </EmptyIconCard>

              <EmptyCopy>
                <EmptyTitle>
                  {searchTerm ? "검색 결과가 없습니다" : "아직 리뷰가 없습니다"}
                </EmptyTitle>
                <p>
                  {searchTerm
                    ? "입력한 검색어와 일치하는 리뷰를 찾을 수 없습니다."
                    : "페스티벌 시즌이 이제 막 시작되었습니다. 사용자들이 경험을 공유하기 시작하면, 여기에 그들의 리뷰와 평점이 표시되어 관리할 수 있습니다."}
                </p>
              </EmptyCopy>
            </EmptyState>
          )}
        </ContentArea>
      </MainCanvas>
    </PageFrame>
  );
}

export default AdminReview;
