import React, { useCallback, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { MessageSquareText, Search, SearchX, Star, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import AdminNav from "./AdminNav";
import AdminPageNation from "./AdminPageNation";
import AxiosApi from "../../api/AxiosApi";
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
  FestivalLink,
  SearchBox,
  SearchIcon,
  SearchInput,
  StatPill,
  Table,
  TableCard,
  TableScroll,
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

function readPageResponse(response) {
  const page = response?.data?.data || {};

  return {
    content: Array.isArray(page.content) ? page.content : [],
    totalElements: Number(page.totalElements || 0),
  };
}

function getAdminErrorMessage(error, fallbackMessage) {
  if (error?.response?.status === 403) {
    return "관리자 권한이 필요합니다.";
  }

  return error?.response?.data?.message || fallbackMessage;
}

function getReviewKey(review, index) {
  return review.reviewId || review.id || review.uuid || index;
}

function getReviewerName(review) {
  return review.reviewerName || review.userName || review.memberName || review.nickname || "익명 사용자";
}

function getReviewerEmail(review) {
  return review.email || review.userEmail || review.memberEmail || "이메일 없음";
}

function getReviewerAvatar(review) {
  return review.profileImageUrl || review.avatar || review.profileImage || "";
}

function getFestivalName(review) {
  const festivalId = getFestivalId(review);
  return (
    review.festivalName ||
    review.festivalTitle ||
    review.title ||
    review.festival?.title ||
    review.festival?.name ||
    (festivalId ? `축제 #${festivalId}` : "-")
  );
}

function getReviewText(review) {
  return review.content || review.reviewContent || review.comment || review.text || "-";
}

function getFestivalId(review) {
  return review.festivalId || review.festival?.festivalId || review.festival?.id || null;
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

function AdminReview() {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [reviews, setReviews] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [totalItems, setTotalItems] = useState(0);

  const fetchReviews = useCallback(async () => {
    setIsLoading(true);
    setError("");

    try {
      const response = await AxiosApi.adminReviewSearch(
        debouncedSearchTerm,
        currentPage - 1,
        PAGE_SIZE,
      );
      const page = readPageResponse(response);

      setReviews(page.content);
      setTotalItems(page.totalElements);
    } catch (fetchError) {
      setReviews([]);
      setTotalItems(0);
      setError(getAdminErrorMessage(fetchError, "리뷰 목록을 불러오지 못했습니다."));
    } finally {
      setIsLoading(false);
    }
  }, [currentPage, debouncedSearchTerm]);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setDebouncedSearchTerm(searchTerm.trim());
    }, 300);

    return () => window.clearTimeout(timer);
  }, [searchTerm]);

  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  const hasReviews = reviews.length > 0;

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
    setCurrentPage(1);
  };

  const confirmDelete = async (review) => {
    const reviewId = review.reviewId || review.id;

    if (!reviewId) {
      setError("삭제할 리뷰 ID가 없습니다.");
      setDeleteTarget(null);
      return;
    }

    try {
      await AxiosApi.adminReviewDelete(reviewId);
      setDeleteTarget(null);
      await fetchReviews();
    } catch (deleteError) {
      setError(getAdminErrorMessage(deleteError, "리뷰를 삭제하지 못했습니다."));
      setDeleteTarget(null);
    }
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

  const goFestivalDetail = (review) => {
    const festivalId = getFestivalId(review);

    if (festivalId) {
      navigate(`/detail/${festivalId}`);
    }
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
                <strong>{totalItems.toLocaleString("ko-KR")}</strong>
                <span>총 리뷰 수</span>
              </StatPill>
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
                    {reviews.map((review, index) => {
                      const key = getReviewKey(review, index);
                      const reviewerName = getReviewerName(review);
                      const reviewerAvatar = getReviewerAvatar(review);
                      const rating = getRating(review);
                      const festivalId = getFestivalId(review);

                      return (
                        <tr key={key}>
                          <td>
                            <ReviewerIdentity>
                              <ReviewerAvatar $tone={index % 4}>
                                {reviewerAvatar ? (
                                  <img
                                    src={reviewerAvatar}
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
                          <td>
                            <FestivalLink
                              type="button"
                              disabled={!festivalId}
                              onClick={() => goFestivalDetail(review)}
                            >
                              {getFestivalName(review)}
                            </FestivalLink>
                          </td>
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
                                  onClick={() => confirmDelete(review)}
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
                onPageChange={setCurrentPage}
                pageSize={PAGE_SIZE}
                totalItems={totalItems}
                visibleItems={reviews.length}
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
                  {isLoading
                    ? "리뷰 목록을 불러오는 중입니다"
                    : error || (searchTerm ? "검색 결과가 없습니다" : "아직 리뷰가 없습니다")}
                </EmptyTitle>
                <p>
                  {isLoading
                    ? "잠시만 기다려 주세요."
                    : error
                      ? "로그인 상태와 관리자 권한을 확인해 주세요."
                      : searchTerm
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
