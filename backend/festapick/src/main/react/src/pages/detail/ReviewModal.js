import { useEffect, useMemo, useState } from "react";
import { Star, X } from "lucide-react";

import AxiosApi from "../../api/AxiosApi";
import { useAuth } from "../../context/AuthContext";
import {
  ActionButton,
  Backdrop,
  CharacterCount,
  CloseButton,
  Content,
  FestivalCard,
  FestivalImage,
  Footer,
  Header,
  ModalPanel,
  RatingSection,
  StarButton,
  Textarea,
  TextareaGroup,
  Title,
} from "./ReviewModalCss";

// 리뷰 본문 최대 길이: 백엔드와 별도 검증이 있더라도 프론트에서 먼저 입력을 제한합니다.
const MAX_REVIEW_LENGTH = 500;
const STAR_VALUES = [1, 2, 3, 4, 5];

// 추가: ApiResponse(data 래핑)와 일반 axios 응답을 모두 안전하게 꺼내기 위한 헬퍼입니다.
const getResponseData = (response) => response?.data?.data ?? response?.data ?? null;

// 추가: 백엔드/화면 데이터의 필드명이 섞여도 ReviewModal 내부에서는 같은 형태로 다루기 위한 헬퍼입니다.
const getReviewContent = (review) => review?.content ?? review?.text ?? "";

// 추가: festivalId 필드명이 아직 화면마다 다를 수 있어 가능한 후보를 순서대로 확인합니다.
const getFestivalId = (festival, review) =>
  festival?.festivalId ?? festival?.id ?? festival?.contentId ?? review?.festivalId ?? null;

// 추가: reviewId 필드명이 화면 데이터(id)와 백엔드 응답(reviewId)에서 달라질 수 있어 같이 처리합니다.
const getReviewId = (review) => review?.reviewId ?? review?.id ?? null;

function ReviewModal({
  isOpen = false,
  festival,
  review,
  onClose,
  onSubmit,
}) {
  // AuthContext 역할: 리뷰 작성/수정은 인증 API이므로 로그인 여부와 사용자 정보를 확인합니다.
  const auth = useAuth();
  const isLoggedIn = auth?.isLoggedIn ?? false;
  const isAuthLoading = auth?.isAuthLoading ?? false;
  const user = auth?.user;

  // rating/text 역할: 모달 폼에서 사용자가 입력 중인 별점과 리뷰 내용을 관리합니다.
  const [rating, setRating] = useState(5);
  const [text, setText] = useState("");

  // 추가: API 요청 중 중복 제출을 막고, 실패/검증 메시지를 모달 안에서 보여주기 위한 상태입니다.
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState("");

  // review prop이 있으면 수정 모드, 없으면 작성 모드로 화면 문구와 API를 분기합니다.
  const isEditMode = Boolean(review);

  // 추가: festival/review가 null이어도 화면에서 안전하게 표시할 수 있도록 기본값을 합성합니다.
  const safeFestival = useMemo(
    () => ({
      festivalId: getFestivalId(festival, review),
      image: festival?.image || festival?.firstimage || "",
      title: festival?.title || festival?.name || festival?.festivalName || "축제 정보 없음",
      period: festival?.period || festival?.date || festival?.eventPeriod || "일정 정보 없음",
    }),
    [festival, review],
  );

  // 모달이 열릴 때마다 작성/수정 대상 리뷰를 기준으로 폼 값을 초기화합니다.
  useEffect(() => {
    if (!isOpen) {
      return;
    }

    setRating(Number(review?.rating) || 5);
    setText(getReviewContent(review));
    setSubmitMessage("");
    setIsSubmitting(false);
  }, [isOpen, review]);

  if (!isOpen) {
    return null;
  }

  // 추가: 백엔드 응답을 FestaDetail의 기존 로컬 리뷰 형태(text/id/isMine)와도 호환되게 정규화합니다.
  const normalizeSavedReview = (savedReview, requestPayload) => ({
    ...review,
    ...savedReview,
    id: savedReview?.reviewId ?? savedReview?.id ?? review?.id ?? "mine",
    reviewId: savedReview?.reviewId ?? review?.reviewId,
    festivalId: savedReview?.festivalId ?? requestPayload.festivalId,
    author: savedReview?.nickname ?? review?.author ?? user?.nickname ?? "나",
    time: review?.time || "방금 전",
    rating: savedReview?.rating ?? requestPayload.rating,
    text: savedReview?.content ?? requestPayload.content,
    content: savedReview?.content ?? requestPayload.content,
    isMine: true,
  });

  // 추가: 로그인/필수값/Null 상황을 먼저 확인한 뒤 createReview/updateReview를 호출합니다.
  const handleSubmit = async (event) => {
    event.preventDefault();

    const content = text.trim();
    const festivalId = getFestivalId(safeFestival, review);
    const reviewId = getReviewId(review);

    if (!content) {
      setSubmitMessage("리뷰 내용을 입력해 주세요.");
      return;
    }

    if (!isLoggedIn) {
      setSubmitMessage("로그인 후 리뷰를 작성할 수 있습니다.");
      return;
    }

    const reviewPayload = {
      festivalId,
      rating,
      content,
    };

    setIsSubmitting(true);
    setSubmitMessage("");

    try {
      // 추가: ID가 없는 경우 API 호출은 생략하고 부모 콜백으로 Null 처리 테스트가 가능하게 둡니다.
      const shouldUseApi = festivalId && (!isEditMode || reviewId);
      const response = shouldUseApi
        ? isEditMode
          ? await AxiosApi.updateReview(reviewId, reviewPayload)
          : await AxiosApi.createReview(reviewPayload)
        : null;

      const savedReview = normalizeSavedReview(getResponseData(response), reviewPayload);

      await onSubmit?.(savedReview, response);
      onClose?.();
    } catch (error) {
      // 추가: 서버 응답 구조가 달라도 사용자에게 최소한의 실패 메시지를 보여주고 콘솔에는 원인을 남깁니다.
      const errorMessage =
        error?.response?.data?.message ||
        error?.message ||
        "리뷰 저장 중 오류가 발생했습니다.";

      console.error("ReviewModal submit error:", error);
      setSubmitMessage(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Backdrop onClick={onClose}>
      <ModalPanel
        aria-label={isEditMode ? "리뷰 수정 모달" : "리뷰 작성 모달"}
        aria-modal="true"
        onClick={(event) => event.stopPropagation()}
        role="dialog"
      >
        <Content onSubmit={handleSubmit}>
          <Header>
            <div>
              <Title>{isEditMode ? "리뷰 수정" : "리뷰 작성"}</Title>
              <p>축제에서 느낀 경험을 별점과 글로 남겨 주세요.</p>
            </div>
            <CloseButton aria-label="리뷰 모달 닫기" onClick={onClose} type="button">
              <X size={28} />
            </CloseButton>
          </Header>

          {/* 축제 요약 영역: festival prop이 null이어도 기본 이미지/문구로 렌더링합니다. */}
          <FestivalCard>
            {safeFestival.image && <FestivalImage alt="" src={safeFestival.image} />}
            <div>
              <strong>{safeFestival.title}</strong>
              <span>{safeFestival.period}</span>
            </div>
          </FestivalCard>

          {/* 별점 선택 영역: 1~5점 버튼으로 rating 상태를 갱신합니다. */}
          <RatingSection>
            <div>
              {STAR_VALUES.map((value) => (
                <StarButton
                  $active={value <= rating}
                  aria-label={`${value}점 선택`}
                  aria-pressed={value === rating}
                  key={value}
                  onClick={() => setRating(value)}
                  type="button"
                >
                  <Star
                    fill={value <= rating ? "currentColor" : "none"}
                    size={40}
                    strokeWidth={1.6}
                  />
                </StarButton>
              ))}
            </div>
            <p>
              <strong>{rating.toFixed(1)}</strong>
              <span>/ 5.0</span>
            </p>
          </RatingSection>

          {/* 리뷰 입력 영역: content 필드로 백엔드에 전달되며 500자까지 입력할 수 있습니다. */}
          <TextareaGroup>
            <label htmlFor="review-text">상세 후기</label>
            <Textarea
              id="review-text"
              maxLength={MAX_REVIEW_LENGTH}
              onChange={(event) => {
                setText(event.target.value);
                setSubmitMessage("");
              }}
              placeholder="축제 분위기, 편의시설, 공연 경험 등을 자유롭게 적어 주세요."
              rows={5}
              value={text}
            />
            <CharacterCount>
              {text.length} / {MAX_REVIEW_LENGTH}
            </CharacterCount>
          </TextareaGroup>

          {/* 추가: 로그인/검증/API 실패 메시지를 Null 안전하게 표시합니다. */}
          {submitMessage && (
            <p
              role="alert"
              style={{
                color: "#ffb690",
                fontSize: "14px",
                fontWeight: 700,
                lineHeight: "20px",
                margin: "-8px 4px 0",
              }}
            >
              {submitMessage}
            </p>
          )}

          {/* 하단 버튼 영역: 취소는 닫기, 제출은 작성/수정 API와 부모 콜백을 실행합니다. */}
          <Footer>
            <ActionButton disabled={isSubmitting} onClick={onClose} type="button">
              취소
            </ActionButton>
            <ActionButton
              $primary
              disabled={!text.trim() || isSubmitting || isAuthLoading}
              type="submit"
            >
              {isSubmitting
                ? "저장 중..."
                : isEditMode
                  ? "수정하기"
                  : "등록하기"}
            </ActionButton>
          </Footer>
        </Content>
      </ModalPanel>
    </Backdrop>
  );
}

export default ReviewModal;
