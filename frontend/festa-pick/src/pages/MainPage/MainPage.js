import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  CalendarDays,
  ChevronRight,
  Compass,
  Pause,
  Play,
  MapPin,
  Sparkles,
  TrendingUp,
} from "lucide-react";
import AxiosApi from "../../api/AxiosApi";
import {
  Badge,
  CardImage,
  EmptyState,
  EmptyStateIcon,
  FestivalCard,
  FestivalGrid,
  HeroActions,
  HeroBadge,
  HeroContent,
  HeroImageLayer,
  HeroNavButton,
  HeroPlaybackButton,
  HeroSection,
  HeroTitle,
  Indicator,
  IndicatorGroup,
  LiveBadge,
  LocationCard,
  MainContainer,
  MainPageWrapper,
  MonthlyHeader,
  NearbyCard,
  NearbyGrid,
  NearbyImage,
  NearbyInfo,
  NearbyMeta,
  NearbySectionLead,
  PrimaryButton,
  RankingFeatured,
  RankingGrid,
  RankingItem,
  RankingList,
  SecondaryButton,
  Section,
  SectionHeader,
  SectionLink,
  SectionTitle,
  TextButton,
} from "./MainPageCss";
import { useAuth } from "../../context/AuthContext";

const heroImage =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuDBrYn5jMWZYXDrlPprdhFpepITwihd3_4MAWAPXZkK8ja_yqOFcgyTJeTb_bP0T0h8NXQRuA2s1smT1Iy90oT9yS0mRwG3Tx4NTC7TfIYrDTtGgFAIbqd_6IWeMaDpkjqmlZ7mxyeR8eLR6Hy8nCiJU1aK1pgtGS9T_S5x-2-AoYzxQ7R9DZqWYP3tmJxgafWNaKqvyMyQ0-GjpHD3Oph-rMYHD8Q3Odx81BKuIzu5ICvtAqO2hFnY3LBTAvUvud_Nfy1u1Lg5TA";

const heroFallbackSlides = [heroImage];

const emptyMainData = {
  nearbyFestivals: [],
  monthlyFestivals: [],
  popularFestivals: [],
};

const unwrapApiData = (response) => response.data?.data || response.data;

//날짜를 화면용으로 바꿔주는 함수
const formatDateText = (date) => {
  if (!date) {
    return "";
  }

  const [, month, day] = String(date).split("-");
  return month && day ? `${month}.${day}` : String(date);
};

// 축제 기간을 화면용 텍스트로 변환
const formatFestivalPeriod = (festival) => {
  const startText = formatDateText(festival.eventStartDate);
  const endText = formatDateText(festival.eventEndDate);

  if (startText && endText) {
    return `${startText} - ${endText}`;
  }

  return startText || endText || "";
};

//지역/장소 텍스트를 만드는 함수
const getFestivalRegion = (festival) => {
  return [festival.addr1, festival.addr2].filter(Boolean).join(" ");
};

//heroImage 이미지가 없을 때도 기본 이미지라도 보이게 함
const getFestivalImage = (festival) => {
  return festival.firstImage || heroImage;
};

//축제 하나를 카드에서 쓸 수 있는 형태로 바꾸는 함수
const normalizeFestivalCard = (festival, index, options = {}) => {
  const id = festival.festivalId || `${options.prefix || "festival"}-${index}`;
  const title = festival.title || "축제 정보";
  const region = getFestivalRegion(festival);
  const date = formatFestivalPeriod(festival);

  return {
    ...festival,
    id,
    festivalId: id,
    rank: index + 1,
    title,
    name: title,
    region,
    location: region,
    venue: region,
    date,
    image: getFestivalImage(festival),
    category: festival.categoryName || "축제",
    meta: `실시간 ${festival.liveCount || 0} · 찜 ${
      festival.favoriteCount || 0
    } · 좋아요 ${festival.likeCount || 0}`,
    description: `평점 ${festival.averageRating || 0} · 리뷰 ${
      festival.reviewCount || 0
    }개`,
    distance: "",
  };
};

//메인페이지 전체 API 응답을 정리하는 함수
const normalizeMainData = (rawData) => {
  const data = rawData || {};

  return {
    nearbyFestivals: (data.nearbyFestivals || []).map((festival, index) =>
      normalizeFestivalCard(festival, index, { prefix: "nearby" }),
    ),
    monthlyFestivals: (data.monthlyFestivals || []).map((festival, index) =>
      normalizeFestivalCard(festival, index, { prefix: "monthly" }),
    ),
    popularFestivals: (data.popularFestivals || []).map((festival, index) =>
      normalizeFestivalCard(festival, index, { prefix: "popular" }),
    ),
  };
};

const normalizeBannerSlides = (rawData) => {
  const banners = Array.isArray(rawData) ? rawData : [];
  const bannerImages = banners
    .map((festival) => festival.firstImage)
    .filter(Boolean);

  return bannerImages.length > 0 ? bannerImages : heroFallbackSlides;
};

const MainEmptyState = ({ icon, title, description, action }) => (
  <EmptyState>
    <EmptyStateIcon aria-hidden="true">{icon}</EmptyStateIcon>
    <h3>{title}</h3>
    <p>{description}</p>
    {action}
  </EmptyState>
);

function MainPage() {
  const auth = useAuth();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isHeroPlaying, setIsHeroPlaying] = useState(true);
  const [selectedPopularRank, setSelectedPopularRank] = useState(1);
  const [mainData, setMainData] = useState(emptyMainData);
  const [bannerSlides, setBannerSlides] = useState(heroFallbackSlides);
  const [mainError, setMainError] = useState("");
  //isMainLoading API 요청 중인지 아닌지 표시하는 상태
  const [isMainLoading, setIsMainLoading] = useState(false);
  const user = auth?.user || {};
  const storedLdongRegnCd =
    typeof window !== "undefined" ? localStorage.getItem("ldongRegnCd") : null;

  const storedLdongSignguCd =
    typeof window !== "undefined"
      ? localStorage.getItem("ldongSignguCd")
      : null;
  const storedUserRegion =
    typeof window !== "undefined"
      ? localStorage.getItem("userRegion") ||
        localStorage.getItem("region") ||
        localStorage.getItem("address") ||
        storedLdongRegnCd ||
        storedLdongSignguCd
      : null;
  const isLoggedIn =
    Boolean(auth?.isLoggedIn) ||
    (typeof window !== "undefined" &&
      Boolean(localStorage.getItem("accessToken")));
  const ldongRegnCd = user.ldongRegnCd || storedLdongRegnCd || "";
  const ldongSignguCd = user.ldongSignguCd || storedLdongSignguCd || "";

  // TODO: 사용자 지역 저장 필드 확정 후 ldongRegnCd/ldongSignguCd 기준으로 정리 필요
  const hasUserRegion = Boolean(
    user.ldongRegnCd ||
    user.ldongSignguCd ||
    user.region ||
    user.userRegion ||
    user.address ||
    user.sidoName ||
    user.sigunguName ||
    storedUserRegion,
  );
  const shouldShowLocationGuide = !isLoggedIn || !hasUserRegion;
  const locationSettingPath = isLoggedIn ? "/mypage/region" : "/login";

  const displayHeroSlides =
    bannerSlides.length > 0 ? bannerSlides : heroFallbackSlides;
  const displayRegionFestivals = mainData.nearbyFestivals || [];
  const displayMonthlyFestivals = mainData.monthlyFestivals || [];
  const displayPopularFestivals = mainData.popularFestivals || [];
  const selectedPopularFestival =
    displayPopularFestivals.find(
      (festival) => festival.rank === selectedPopularRank,
    ) || displayPopularFestivals[0] || null;
  const rankingItems = displayPopularFestivals;

  useEffect(() => {
    const fetchMainPage = async () => {
      setIsMainLoading(true);

      const [mainResult, bannerResult] = await Promise.allSettled([
        AxiosApi.getMainPage(ldongRegnCd, ldongSignguCd),
        AxiosApi.getBannerFestivals(),
      ]);

      if (mainResult.status === "fulfilled") {
        setMainData(normalizeMainData(unwrapApiData(mainResult.value)));
        setMainError("");
      } else {
        console.error("메인 페이지 조회 실패:", mainResult.reason);
        setMainData(emptyMainData);
        setMainError("메인 데이터를 불러오지 못했습니다.");
      }

      if (bannerResult.status === "fulfilled") {
        setBannerSlides(
          normalizeBannerSlides(unwrapApiData(bannerResult.value)),
        );
      } else {
        console.error("메인 배너 조회 실패:", bannerResult.reason);
        setBannerSlides(heroFallbackSlides);
      }

      setIsMainLoading(false);
    };

    fetchMainPage();
  }, [ldongRegnCd, ldongSignguCd]);

  useEffect(() => {
    setCurrentSlide(0);
  }, [displayHeroSlides.length]);

  useEffect(() => {
    if (!isHeroPlaying) {
      return undefined;
    }

    const slideTimer = window.setInterval(() => {
      setCurrentSlide(
        (prevSlide) => (prevSlide + 1) % displayHeroSlides.length,
      );
    }, 5000);

    return () => window.clearInterval(slideTimer);
  }, [displayHeroSlides.length, isHeroPlaying]);

  const showPreviousSlide = () => {
    setCurrentSlide(
      (prevSlide) =>
        (prevSlide - 1 + displayHeroSlides.length) % displayHeroSlides.length,
    );
  };

  const showNextSlide = () => {
    setCurrentSlide((prevSlide) => (prevSlide + 1) % displayHeroSlides.length);
  };

  const getFestivalLink = (festival) => {
    const festivalId =
      festival.festivalId || festival.id || festival.title || festival.name;

    return {
      to: `/festivals/${encodeURIComponent(festivalId)}`,
      state: {
        festival: {
          ...festival,
          id: festivalId,
          festivalId,
          title: festival.title || festival.name,
          name: festival.name || festival.title,
          location: festival.location || festival.region,
          venue: festival.location || festival.region,
        },
      },
    };
  };

  return (
    <MainPageWrapper aria-busy={isMainLoading}>
      <MainContainer>
        <HeroSection>
          {displayHeroSlides.map((slide, index) => (
            <HeroImageLayer
              key={slide}
              $image={slide}
              $active={index === currentSlide}
            />
          ))}
          <HeroNavButton
            type="button"
            $direction="prev"
            aria-label="이전 배너"
            onClick={showPreviousSlide}
          >
            <ChevronRight size={26} aria-hidden="true" />
          </HeroNavButton>
          <HeroNavButton
            type="button"
            $direction="next"
            aria-label="다음 배너"
            onClick={showNextSlide}
          >
            <ChevronRight size={26} aria-hidden="true" />
          </HeroNavButton>
          <HeroContent>
            <div>
              <HeroBadge>Special Event</HeroBadge>
              <HeroTitle>
                일상의 모든 즐거움,
                <br />
                <span>FestaPick</span>에서 만나보세요
              </HeroTitle>
              <p>
                실시간 현장 정보부터 AI 개인 맞춤 추천까지 한눈에 확인하세요.
              </p>
            </div>
            <HeroActions>
              <PrimaryButton as={Link} to="/search">
                축제 둘러보기
                <Compass size={18} />
              </PrimaryButton>
              <SecondaryButton as={Link} to="/ai">
                AI 추천 받기
                <Sparkles size={18} />
              </SecondaryButton>
            </HeroActions>
          </HeroContent>
          <IndicatorGroup aria-label="메인 배너 슬라이드">
            {displayHeroSlides.map((slide, index) => (
              <Indicator key={slide} $active={index === currentSlide} />
            ))}
            <HeroPlaybackButton
              type="button"
              aria-label={
                isHeroPlaying ? "배너 자동 재생 일시정지" : "배너 자동 재생"
              }
              onClick={() => setIsHeroPlaying((prevState) => !prevState)}
            >
              {isHeroPlaying ? (
                <Pause size={14} aria-hidden="true" />
              ) : (
                <Play size={14} aria-hidden="true" />
              )}
            </HeroPlaybackButton>
          </IndicatorGroup>
        </HeroSection>

        <Section>
          <SectionHeader>
            <SectionTitle>
              <MapPin size={28} />내 주변 추천 축제
            </SectionTitle>
            <SectionLink as={Link} to="/search">
              전체보기
              <ChevronRight size={18} />
            </SectionLink>
          </SectionHeader>
          <NearbySectionLead>
            {hasUserRegion
              ? "설정한 위치 근처 추천 축제를 가까운 순서대로 골랐어요."
              : "내 위치를 설정하면 주변의 핫한 축제를 추천받을 수 있어요."}
          </NearbySectionLead>
          {shouldShowLocationGuide ? (
            <LocationCard $image={heroImage}>
              <MapPin size={42} aria-hidden="true" />
              <h3>내 위치를 설정하면</h3>
              <p>주변의 핫한 축제들을 실시간으로 추천받을 수 있어요.</p>
              <TextButton as={Link} to={locationSettingPath}>
                위치 설정하기
              </TextButton>
            </LocationCard>
          ) : displayRegionFestivals.length === 0 ? (
            <MainEmptyState
              icon={<MapPin size={30} />}
              title="주변 추천 축제가 없습니다"
              description={
                mainError ||
                "설정한 지역 기준으로 진행 예정이거나 진행 중인 축제 데이터가 없습니다."
              }
              action={
                <TextButton as={Link} to="/search">
                  전국 축제 보기
                </TextButton>
              }
            />
          ) : (
            <NearbyGrid>
              {displayRegionFestivals.map((festival, index) => (
                <NearbyCard key={festival.id || festival.name}>
                  <NearbyImage src={festival.image} alt="" />
                  <NearbyInfo>
                    <span>{index + 1}번째로 가까워요</span>
                    <h3>{festival.name}</h3>
                    <NearbyMeta>
                      <span>
                        <MapPin size={15} aria-hidden="true" />
                        {festival.region}
                      </span>
                      {festival.distance && <span>{festival.distance}</span>}
                      <span>
                        <CalendarDays size={15} aria-hidden="true" />
                        {festival.date}
                      </span>
                    </NearbyMeta>
                    <p>{festival.description}</p>
                    <Link
                      to={getFestivalLink(festival).to}
                      state={getFestivalLink(festival).state}
                    >
                      상세보기
                    </Link>
                  </NearbyInfo>
                </NearbyCard>
              ))}
            </NearbyGrid>
          )}
        </Section>

        <Section>
          <MonthlyHeader>
            <SectionTitle>
              <CalendarDays size={28} />
              이달의 전국 축제
            </SectionTitle>
          </MonthlyHeader>
          {displayMonthlyFestivals.length === 0 ? (
            <MainEmptyState
              icon={<CalendarDays size={30} />}
              title="이달의 축제 데이터가 없습니다"
              description={
                mainError ||
                "이번 달 기간과 겹치는 전국 축제 데이터가 아직 등록되지 않았습니다."
              }
              action={
                <TextButton as={Link} to="/search">
                  축제 검색하기
                </TextButton>
              }
            />
          ) : (
            <FestivalGrid>
              {displayMonthlyFestivals.map((festival) => (
                <FestivalCard
                  key={festival.id || festival.title}
                  as={Link}
                  to={getFestivalLink(festival).to}
                  state={getFestivalLink(festival).state}
                >
                  <CardImage src={festival.image} alt="" />
                  <span>{festival.region}</span>
                  <h3>{festival.title}</h3>
                  <p>{festival.date}</p>
                </FestivalCard>
              ))}
            </FestivalGrid>
          )}
        </Section>

        <Section>
          <SectionHeader>
            <SectionTitle>실시간 인기 축제</SectionTitle>
            <LiveBadge>
              <span />
              LIVE
            </LiveBadge>
          </SectionHeader>
          {selectedPopularFestival ? (
            <RankingGrid>
              <RankingFeatured
                key={selectedPopularFestival.rank}
                as={Link}
                to={getFestivalLink(selectedPopularFestival).to}
                state={getFestivalLink(selectedPopularFestival).state}
              >
                <img src={selectedPopularFestival.image} alt="" />
                <strong>{selectedPopularFestival.rank}</strong>
                <div>
                  <Badge>{selectedPopularFestival.category}</Badge>
                  <Badge>{selectedPopularFestival.meta}</Badge>
                  <Badge>{selectedPopularFestival.region}</Badge>
                  <Badge>{selectedPopularFestival.date}</Badge>
                  <h3>{selectedPopularFestival.title}</h3>
                  <p>{selectedPopularFestival.description}</p>
                </div>
              </RankingFeatured>
              <RankingList>
                {rankingItems.map((item) => (
                  <RankingItem
                    key={item.rank}
                    type="button"
                    $active={selectedPopularRank === item.rank}
                    $muted={item.muted}
                    onClick={() => setSelectedPopularRank(item.rank)}
                  >
                    <strong>{item.rank}</strong>
                    <img src={item.image} alt="" />
                    <div>
                      <h3>{item.title}</h3>
                      <p>
                        {item.region} · {item.date}
                      </p>
                      <p>{item.meta}</p>
                    </div>
                    <TrendingUp size={22} />
                  </RankingItem>
                ))}
              </RankingList>
            </RankingGrid>
          ) : (
            <MainEmptyState
              icon={<TrendingUp size={30} />}
              title="실시간 인기 축제가 없습니다"
              description={
                mainError ||
                "현재 참여자 기준으로 집계된 인기 축제 데이터가 없습니다."
              }
              action={
                <TextButton as={Link} to="/search">
                  전체 축제 보기
                </TextButton>
              }
            />
          )}
        </Section>
      </MainContainer>
    </MainPageWrapper>
  );
}

export default MainPage;
