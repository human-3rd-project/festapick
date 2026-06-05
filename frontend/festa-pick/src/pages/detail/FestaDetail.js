import { useEffect, useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import {
  Bell,
  CalendarPlus,
  ChevronDown,
  ChevronUp,
  Heart,
  MapPin,
  Maximize2,
  MessageCircle,
  Navigation,
  RefreshCw,
  Send,
  Share2,
  Star,
  ThumbsUp,
  Ticket,
} from "lucide-react";

import RealTimeTalkModal from "./LiveTalkModal";
import ReviewModal from "./ReviewModal";
import {
  ActionButton,
  ActionRow,
  AiMarquee,
  AiMarqueeContent,
  Badge,
  BodyGrid,
  Card,
  CtaButton,
  DetailText,
  DisabledOverlay,
  EmptyIcon,
  EmptyState,
  FloatingTalk,
  FloatingTalkBody,
  FloatingTalkHeader,
  FloatingTalkInput,
  FloatingTalkMessage,
  FloatingTalkPreview,
  Hero,
  HeroActions,
  HeroContent,
  HeroImage,
  HeroOverlay,
  InfoGrid,
  InfoLabel,
  InfoValue,
  LiveDot,
  MainColumn,
  MapCanvas,
  MapControls,
  MapPinBadge,
  MetaText,
  Page,
  RatingLine,
  ReviewActions,
  ReviewCard,
  ReviewHeader,
  ReviewList,
  Section,
  SectionTitle,
  Sidebar,
  SidebarSticky,
  SmallIconButton,
  StatusCard,
  StatusIcon,
  TagRow,
  TalkComposer,
  TalkControlGroup,
  TalkMiniLine,
  TextButton,
  Title,
} from "./FestaDetailCss";

const DEFAULT_FESTIVAL = {
  title: "일렉트로닉 나이트 페스티벌 2024",
  category: "MUSIC",
  image:
    "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&w=1800&q=85",
  period: "2024.11.24 - 11.26",
  time: "18:00 - 02:00",
  location: "서울 난지 한강공원",
  venue: "제1축제광장 일대",
  description: [
    "서울의 밤을 깨우는 가장 뜨거운 순간, 일렉트로닉 나이트 페스티벌 2024에 여러분을 초대합니다. 이번 페스티벌은 Digital Neon을 테마로 하여 가상과 현실이 교차하는 듯한 몽환적인 공간 경험을 제공합니다.",
    "세계적인 비주얼 아티스트들과의 협업으로 탄생한 360도 미디어 파사드 스테이지에서 압도적인 몰입감을 느껴보세요. 트렌디한 일렉트로닉 사운드와 함께 도심 속 해방감을 만끽할 수 있는 최고의 기회입니다.",
  ],
  price: "88,000원",
  remainCount: 124,
  rating: 4.8,
  reviewCount: 1240,
};

const DEFAULT_REVIEWS = [
  {
    id: "mine",
    author: "김페스",
    time: "방금 전",
    rating: 5,
    text: "진짜 역대급 페스티벌입니다! 사운드 퀄리티랑 조명 연출이 미쳤어요. 밤새도록 놀고 싶네요.",
    isMine: true,
  },
  {
    id: "review-1",
    author: "지니_DJ",
    time: "10분 전",
    rating: 5,
    text: "라인업 실화인가요... DJ Luminous 셋리스트 미쳤습니다. 지금 당장 오세요!",
  },
  {
    id: "review-2",
    author: "Hyein_P",
    time: "32분 전",
    rating: 4,
    text: "사람이 좀 많긴 한데 그만큼 분위기가 뜨겁습니다. 화장실 줄이 긴 건 조금 아쉽네요.",
  },
];

const LIVE_MESSAGES = [
  {
    id: 1,
    author: "지니_DJ",
    text: "지금 입구 쪽 입장 원활해요!! 빨리 오세요!",
  },
  { id: 2, author: "나", text: "거의 다 왔어요! 셔틀 금방 오네요", mine: true },
  {
    id: 3,
    author: "BassDrop_Fan",
    text: "메인 스테이지 조명 진짜 예술이다...",
  },
  { id: 4, author: "TechnoKing", text: "물품보관소 줄 어떤가요?" },
];

function FestaDetail({
  festival: festivalProp,
  reviews = DEFAULT_REVIEWS,
  isFestivalActive,
  hasMap = true,
}) {
  const location = useLocation();
  const [isTalkExpanded, setIsTalkExpanded] = useState(false);
  const [isTalkModalOpen, setIsTalkModalOpen] = useState(false);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [editingReview, setEditingReview] = useState(null);
  const [localReviews, setLocalReviews] = useState(reviews);
  const [talkMessage, setTalkMessage] = useState("");
  const [isFavorite, setIsFavorite] = useState(Boolean(festivalProp?.favorite));
  const [isLiked, setIsLiked] = useState(Boolean(festivalProp?.liked));

  const routedFestival = location.state?.festival;
  const festival = useMemo(() => {
    const sourceFestival = festivalProp || routedFestival;

    if (!sourceFestival) {
      return DEFAULT_FESTIVAL;
    }

    return {
      ...DEFAULT_FESTIVAL,
      ...sourceFestival,
      category: sourceFestival.category || DEFAULT_FESTIVAL.category,
      location: sourceFestival.location || DEFAULT_FESTIVAL.location,
      rating:
        typeof sourceFestival.rating === "string"
          ? Number.parseFloat(sourceFestival.rating) || DEFAULT_FESTIVAL.rating
          : sourceFestival.rating || DEFAULT_FESTIVAL.rating,
      reviewCount: sourceFestival.reviewCount || DEFAULT_FESTIVAL.reviewCount,
      venue:
        sourceFestival.venue ||
        sourceFestival.location ||
        DEFAULT_FESTIVAL.venue,
    };
  }, [festivalProp, routedFestival]);

  const resolvedIsFestivalActive =
    isFestivalActive ??
    (typeof festival.live === "boolean" ? festival.live : true);

  useEffect(() => {
    setIsFavorite(Boolean(festival.favorite));
    setIsLiked(Boolean(festival.liked));
  }, [festival.favorite, festival.liked]);

  useEffect(() => {
    setLocalReviews(reviews);
  }, [reviews]);

  const myReview = useMemo(
    () => localReviews.find((review) => review.isMine),
    [localReviews],
  );
  const hasReviews = localReviews.length > 0;
  const visibleReviews = useMemo(
    () => localReviews.slice(0, 3),
    [localReviews],
  );

  const handleTalkSubmit = (event) => {
    event.preventDefault();

    if (!talkMessage.trim()) {
      return;
    }

    setTalkMessage("");
  };

  const openCreateReviewModal = () => {
    setEditingReview(null);
    setIsReviewModalOpen(true);
  };

  const openEditReviewModal = (review) => {
    setEditingReview(review);
    setIsReviewModalOpen(true);
  };

  const closeReviewModal = () => {
    setIsReviewModalOpen(false);
    setEditingReview(null);
  };

  const handleDeleteMyReview = () => {
    setLocalReviews((currentReviews) =>
      currentReviews.filter((review) => !review.isMine),
    );
  };

  const handleSubmitReview = (reviewValue) => {
    const savedReview = {
      id: reviewValue.id || "mine",
      author: reviewValue.author || "김페스",
      time: reviewValue.id ? reviewValue.time : "방금 전",
      rating: reviewValue.rating,
      text: reviewValue.text,
      isMine: true,
    };

    setLocalReviews((currentReviews) => {
      const hasMyReview = currentReviews.some((review) => review.isMine);

      if (hasMyReview) {
        return currentReviews.map((review) =>
          review.isMine ? { ...review, ...savedReview } : review,
        );
      }

      return [savedReview, ...currentReviews];
    });
    closeReviewModal();
  };

  return (
    <Page>
      <Hero>
        <HeroImage alt="" src={festival.image} />
        <HeroOverlay />
        <HeroContent>
          <TagRow>
            <Badge>{festival.category}</Badge>
            <Badge $variant={resolvedIsFestivalActive ? "live" : "muted"}>
              {resolvedIsFestivalActive && <LiveDot />}
              {resolvedIsFestivalActive ? "LIVE" : "SCHEDULED"}
            </Badge>
          </TagRow>

          <Title>{festival.title}</Title>

          <HeroActions>
            <ActionButton
              $active={isFavorite}
              aria-pressed={isFavorite}
              onClick={() => setIsFavorite((value) => !value)}
              type="button"
            >
              <Heart fill={isFavorite ? "currentColor" : "none"} size={18} />
              {isFavorite ? "찜 완료" : "찜하기"}
            </ActionButton>
            <ActionButton
              $active={isLiked}
              aria-pressed={isLiked}
              onClick={() => setIsLiked((value) => !value)}
              type="button"
            >
              <ThumbsUp fill={isLiked ? "currentColor" : "none"} size={18} />
              {isLiked ? "좋아요 완료" : "좋아요"}
            </ActionButton>
            <ActionButton type="button">
              <Share2 size={18} />
              공유
            </ActionButton>
          </HeroActions>

          <AiMarquee $disabled={!resolvedIsFestivalActive}>
            {resolvedIsFestivalActive ? (
              <AiMarqueeContent>
                AI Live 요약: 현재 메인 스테이지 공연이 절정에 달하고 있습니다.
                인파가 몰리고 있으니 서브 스테이지 구역을 권장합니다. 셔틀버스는
                15분 간격으로 운행 중입니다.
              </AiMarqueeContent>
            ) : (
              <span>현재 축제 기간이 아닙니다.</span>
            )}
          </AiMarquee>
        </HeroContent>
      </Hero>

      <BodyGrid>
        <MainColumn>
          <InfoGrid>
            <div>
              <InfoLabel>Date & Time</InfoLabel>
              <InfoValue>{festival.period}</InfoValue>
              <MetaText>
                {resolvedIsFestivalActive
                  ? `진행 중 (${festival.time})`
                  : festival.time}
              </MetaText>
            </div>
            <div>
              <InfoLabel>Location</InfoLabel>
              <InfoValue>{festival.location}</InfoValue>
              <MetaText>{festival.venue}</MetaText>
            </div>
          </InfoGrid>

          <Section>
            <SectionTitle $tone="primary">축제 상세 정보</SectionTitle>
            <DetailText>
              {festival.description.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </DetailText>
          </Section>

          <Section>
            <SectionTitle $tone="secondary">찾아오시는 길</SectionTitle>
            <MapCanvas $disabled={!hasMap}>
              {hasMap ? (
                <>
                  <MapPinBadge>
                    <MapPin size={42} />
                    <span>{festival.venue}</span>
                  </MapPinBadge>
                  <MapControls>
                    <SmallIconButton type="button">+</SmallIconButton>
                    <SmallIconButton type="button">-</SmallIconButton>
                  </MapControls>
                  <CtaButton $compact type="button">
                    <Navigation size={18} />
                    길찾기
                  </CtaButton>
                </>
              ) : (
                <DisabledOverlay>
                  <MapPin size={48} />
                  <strong>지도 정보를 불러올 수 없습니다</strong>
                  <span>
                    네트워크 연결 상태를 확인하거나 잠시 후 다시 시도해 주세요.
                  </span>
                  <TextButton type="button">
                    <RefreshCw size={16} />
                    다시 시도
                  </TextButton>
                </DisabledOverlay>
              )}
            </MapCanvas>
          </Section>

          <Section>
            <ReviewHeader>
              <div>
                <SectionTitle $tone="tertiary">리뷰</SectionTitle>
                <RatingLine>
                  <strong>{hasReviews ? festival.rating : "0.0"}</strong>
                  <span>
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        fill="currentColor"
                        key={star}
                        size={17}
                        strokeWidth={0}
                      />
                    ))}
                  </span>
                  <em>
                    (
                    {hasReviews
                      ? festival.reviewCount.toLocaleString("ko-KR")
                      : 0}{" "}
                    reviews)
                  </em>
                </RatingLine>
              </div>
              {!myReview && (
                <TextButton onClick={openCreateReviewModal} type="button">
                  리뷰 작성하기
                </TextButton>
              )}
            </ReviewHeader>

            {hasReviews ? (
              <ReviewList>
                {visibleReviews.map((review) => (
                  <ReviewCard $isMine={review.isMine} key={review.id}>
                    {review.isMine && <Badge $variant="mine">My Review</Badge>}
                    <ReviewActions>
                      <div>
                        <strong>{review.author}</strong>
                        <RatingLine $small>
                          <span>
                            {Array.from({ length: review.rating }).map(
                              (_, index) => (
                                <Star
                                  fill="currentColor"
                                  key={`${review.id}-${index}`}
                                  size={14}
                                  strokeWidth={0}
                                />
                              ),
                            )}
                          </span>
                        </RatingLine>
                      </div>
                      <span>{review.time}</span>
                    </ReviewActions>
                    <p>{review.text}</p>
                    {review.isMine && (
                      <ReviewActions $right>
                        <TextButton
                          onClick={() => openEditReviewModal(review)}
                          type="button"
                        >
                          수정
                        </TextButton>
                        <TextButton
                          $danger
                          onClick={handleDeleteMyReview}
                          type="button"
                        >
                          삭제
                        </TextButton>
                      </ReviewActions>
                    )}
                  </ReviewCard>
                ))}
                <TextButton type="button">리뷰 더보기</TextButton>
              </ReviewList>
            ) : (
              <EmptyState>
                <EmptyIcon>
                  <MessageCircle size={30} />
                </EmptyIcon>
                <strong>아직 작성된 리뷰가 없습니다</strong>
                <span>첫 번째로 축제 현장의 생생한 감동을 공유해보세요!</span>
              </EmptyState>
            )}
          </Section>
        </MainColumn>

        <Sidebar>
          <SidebarSticky>
            <StatusCard $disabled={!resolvedIsFestivalActive}>
              <div>
                <InfoLabel>Ticket Status</InfoLabel>
                <InfoValue>
                  {resolvedIsFestivalActive
                    ? "예매 가능"
                    : "진행 기간이 아닙니다"}
                </InfoValue>
              </div>
              <StatusIcon $disabled={!resolvedIsFestivalActive}>
                <Ticket size={30} />
              </StatusIcon>
              <Card>
                <span>입장료</span>
                <strong>
                  {resolvedIsFestivalActive ? festival.price : "-"}
                </strong>
              </Card>
              <Card>
                <span>
                  {resolvedIsFestivalActive ? "잔여 티켓" : "잔여 인원"}
                </span>
                <strong>
                  {resolvedIsFestivalActive
                    ? `${festival.remainCount}매 남음`
                    : "종료됨"}
                </strong>
              </Card>
              <CtaButton disabled={!resolvedIsFestivalActive} type="button">
                {resolvedIsFestivalActive ? "지금 예매하기" : "신청 불가"}
              </CtaButton>
            </StatusCard>

            <ActionRow>
              <ActionButton type="button">
                <CalendarPlus size={20} />
                일정 추가
              </ActionButton>
              {resolvedIsFestivalActive && (
                <ActionButton type="button">
                  <Bell size={20} />
                  알림 받기
                </ActionButton>
              )}
            </ActionRow>
          </SidebarSticky>
        </Sidebar>
      </BodyGrid>

      {resolvedIsFestivalActive && (
        <FloatingTalk $expanded={isTalkExpanded}>
          <FloatingTalkHeader>
            <span>
              <LiveDot />
              LIVE TALK
            </span>
            <TalkControlGroup>
              <SmallIconButton
                aria-label={
                  isTalkExpanded ? "실시간 톡 최소화" : "실시간 톡 열기"
                }
                onClick={() => setIsTalkExpanded((value) => !value)}
                type="button"
              >
                {isTalkExpanded ? (
                  <ChevronDown size={17} />
                ) : (
                  <ChevronUp size={17} />
                )}
              </SmallIconButton>
              <SmallIconButton
                aria-label="실시간 톡 최대화"
                onClick={() => setIsTalkModalOpen(true)}
                type="button"
              >
                <Maximize2 size={16} />
              </SmallIconButton>
            </TalkControlGroup>
          </FloatingTalkHeader>

          {isTalkExpanded ? (
            <>
              <FloatingTalkBody>
                {LIVE_MESSAGES.map((message) => (
                  <FloatingTalkMessage $mine={message.mine} key={message.id}>
                    {!message.mine && <strong>{message.author}</strong>}
                    <span>{message.text}</span>
                  </FloatingTalkMessage>
                ))}
              </FloatingTalkBody>
              <TalkComposer onSubmit={handleTalkSubmit}>
                <FloatingTalkInput
                  onChange={(event) => setTalkMessage(event.target.value)}
                  placeholder="메시지를 입력하세요..."
                  value={talkMessage}
                />
                <SmallIconButton aria-label="메시지 보내기" type="submit">
                  <Send size={17} />
                </SmallIconButton>
              </TalkComposer>
            </>
          ) : (
            <FloatingTalkPreview
              onClick={() => setIsTalkExpanded(true)}
              type="button"
            >
              <TalkMiniLine>
                <strong>지니_DJ</strong>
                지금 입구 쪽 입장 원활해요!! 빨리 오세요!
              </TalkMiniLine>
            </FloatingTalkPreview>
          )}
        </FloatingTalk>
      )}

      <RealTimeTalkModal
        isOpen={isTalkModalOpen}
        onClose={() => setIsTalkModalOpen(false)}
      />
      <ReviewModal
        festival={festival}
        isOpen={isReviewModalOpen}
        onClose={closeReviewModal}
        onSubmit={handleSubmitReview}
        review={editingReview}
      />
    </Page>
  );
}

export default FestaDetail;
