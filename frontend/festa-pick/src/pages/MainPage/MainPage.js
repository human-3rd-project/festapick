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
import {
  Badge,
  CardImage,
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

const fallbackHeroSlides = [
  heroImage,
  "https://lh3.googleusercontent.com/aida-public/AB6AXuD1VGpq9wqZGX6RUGI37IiGuqPM1isG5Q10F9xxVytPkauqG7yMCd2pJ_gInrvBA-Cdt1ge5s5bS5afhJ2rxj-iiIg9bwIv_Y_fvPwl0vM4YKJkfgJEUyEUBfFJgQMVscdJjbe6Dy6sHfAmx1hXwzq_5hp9ltWInG7gCZ33QqIr7NwKn4DN_AKQsdD4mA4sGkRN-IaFTEMH8bnoO5oi7p7VUXX7851y-N53_3ge-tObxo0Aq5lg88jz2n4maWbH2cxYspCEKyHknA",
  "https://lh3.googleusercontent.com/aida-public/AB6AXuCtgNLtXcRyenXfIjFgSLP_Nkx2Dx_glc49QvEJhDd5nESjyg996g_zmCG-rqx1u1xdtmFbN8jKWerv3BW8WBjDBQu15OUq8DRZThUL6supO7NFZAlQrsYuad9q1aYHbvd5LlZIaVJp8NHgbwzTnYs1ElrBM5M0i0YQe0Y9uqGz_qFLkpS66wAkIFfF2xcrMoZaM62ZSmuNO704ICck58WM69aQofh0ZPSTw1-lxtpWiik4RJObeRcBhu4_CPIfr1_vGVuhQDyvXw",
];

const fallbackMonthlyFestivals = [
  {
    region: "전라남도 해남",
    title: "해남 매화나무 축제",
    date: "04.28 - 05.04",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCpsr_o4C_FwhE_QpbhydlKwWjJs6uLwYumP_37LxCqMy38ZOUvSKb2EsThLLp4OlOpbt0WqDIssrYAQCmxPD9pux1TpMP3bZ_aJp6aBKmrD9AaXlt8-PfGNeXu9OLHbqREbCAq5DQPfga0udh4w4wHBHEz5YkeeBwwbtm1HzCrmuFs2Mc7zh9SwgjFI1FJb7aafuw3cgdQITDnMjoWwvgDyv_eJ0W2YMMBBEHtDiMQuO9qJUvMDW2HNGtGGKph0WUVvHEGa977ew",
  },
  {
    region: "경상남도 진주",
    title: "진주 남강 유등축제",
    date: "04.10 - 04.25",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuD1VGpq9wqZGX6RUGI37IiGuqPM1isG5Q10F9xxVytPkauqG7yMCd2pJ_gInrvBA-Cdt1ge5s5bS5afhJ2rxj-iiIg9bwIv_Y_fvPwl0vM4YKJkfgJEUyEUBfFJgQMVscdJjbe6Dy6sHfAmx1hXwzq_5hp9ltWInG7gCZ33QqIr7NwKn4DN_AKQsdD4mA4sGkRN-IaFTEMH8bnoO5oi7p7VUXX7851y-N53_3ge-tObxo0Aq5lg88jz2n4maWbH2cxYspCEKyHknA",
  },
  {
    region: "부산광역시 수영구",
    title: "광안리 바다축제",
    date: "05.12 - 05.14",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCs5bgCmOY1Yn1HY-uyyDsFCQA1M0J9h7NNMfjnzqSiTTcEDdI3Es3mbNiM8GiB6neEMb5yF39iwZyhUjsk3d42ALpFmtN2Bu6XKbLb2SIibZdwisUO9zsQANxplWF9uC9JWETW8gtfc0uzzhBsHNGlWFpD44ckFpnwPB6w_XYsWmbJ_vXQMPSgPzmOU397KSh_3q2lz_VHcjrUf5RO5CbhzG77uwoV_Tz9CYNltqpdOUQawCnIXkN9Ou4a0u14PpPuDPkNyOYQ8Q",
  },
  {
    region: "제주특별자치도",
    title: "제주 재즈숲 축제",
    date: "04.01 - 04.30",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCtgNLtXcRyenXfIjFgSLP_Nkx2Dx_glc49QvEJhDd5nESjyg996g_zmCG-rqx1u1xdtmFbN8jKWerv3BW8WBjDBQu15OUq8DRZThUL6supO7NFZAlQrsYuad9q1aYHbvd5LlZIaVJp8NHgbwzTnYs1ElrBM5M0i0YQe0Y9uqGz_qFLkpS66wAkIFfF2xcrMoZaM62ZSmuNO704ICck58WM69aQofh0ZPSTw1-lxtpWiik4RJObeRcBhu4_CPIfr1_vGVuhQDyvXw",
  },
];

const fallbackNearbyFestivals = [
  {
    name: "서울억새축제",
    region: "서울 마포구 하늘공원",
    distance: "은평구에서 약 7.8km",
    date: "10.18 - 10.24",
    description:
      "가을 억새밭과 노을을 함께 즐길 수 있는 서울 대표 산책형 축제예요.",
    image:
      "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=900&q=80",
  },
  {
    name: "경복궁 별빛야행",
    region: "서울 종로구 경복궁",
    distance: "은평구에서 약 8.9km",
    date: "04.02 - 05.04",
    description:
      "고궁의 야경, 전통 공연, 궁중음식을 한 번에 경험할 수 있는 야간 프로그램입니다.",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBQgr2HfkOqtGTxwLlFCt9-g76NjX43kJUgrYVVEN1sb9zghLpXeyDDX6wxIZVWoMzhBblVe7qCPraiiD8VZodDyEyzRCrgiSwEs3cN9MhFwHkV4raAja-khLFsqDxuFoAu5tw6z5vLyWkX821jo79VDD_1a5QwSS0z4y8yTjh72wo9CXl-pNiAs3mRePe3X-2EFZ5I7EJDFW8zfMtmChJPg_J7jrr945GwyjIZW36n19OvnrAZr62xbXVcIwduarRE0jwApRkWAQ",
  },
  {
    name: "서울거리예술축제",
    region: "서울 중구 서울광장 일대",
    distance: "은평구에서 약 10.5km",
    date: "09.29 - 10.01",
    description:
      "도심 곳곳에서 거리극, 퍼포먼스, 음악 공연을 만나는 열린 예술 축제입니다.",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCs5bgCmOY1Yn1HY-uyyDsFCQA1M0J9h7NNMfjnzqSiTTcEDdI3Es3mbNiM8GiB6neEMb5yF39iwZyhUjsk3d42ALpFmtN2Bu6XKbLb2SIibZdwisUO9zsQANxplWF9uC9JWETW8gtfc0uzzhBsHNGlWFpD44ckFpnwPB6w_XYsWmbJ_vXQMPSgPzmOU397KSh_3q2lz_VHcjrUf5RO5CbhzG77uwoV_Tz9CYNltqpdOUQawCnIXkN9Ou4a0u14PpPuDPkNyOYQ8Q",
  },
];

const fallbackPopularFestivals = [
  {
    rank: 1,
    title: "월드 뮤직 페스티벌",
    category: "음악",
    region: "서울 올림픽공원",
    date: "06.14 - 06.16",
    meta: "7.2k+ 실시간",
    description: "지금 가장 많은 사람들이 검색하고 있는 글로벌 음악 축제예요.",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDBPBmu2AOw2vpBkRpxavTrf3xGPGHa-E8xS8ueJMPCZ6cYLCFzVofvC_D0R3bIptC7VpmCZt_PATRPLaXo6TdtunBLSYybHb2M02X6YPY6jI2aM81pE0THEonsNO4_00nW7yqieFr-csZDuA0-WXDohVXsPskltPRMYA-7eVwnHg_2lkQexGrhsvODJIBqb41Vqo8EclqkF6I2e2_h-OR7mlqWh_FISyoE2Djgm_I8ih1eOrIHJoLaSQx1MVmL5P2AxFCd5pMMUw",
  },
  {
    rank: 2,
    title: "이천 도자기 축제",
    category: "공예",
    region: "경기 이천시",
    date: "04.25 - 05.06",
    meta: "조회수 2.5k · 관심 1.2k",
    description:
      "도자 전시와 체험 프로그램이 함께 열려 가족 나들이로 인기예요.",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAMTdWRkgYZN_aoTdq7gf8UoUZJC4QK4B2n-qPb-H02hMGcX9usbfmI7dv9Qy8mOYb55ntVfpYy6yInoGWKLBaBdkRi5B0-WLIt9GmyX0erD7mKQZc1gRWmFpMDxzK7dCnmQFqKCFF89DxxkmV8mLFsh37bvKH-jcVv0YybIieowLiub2MRcE_tGTTVt_W36OpuRQQQQJPJaicS71nCAHRIYOobUQvDfbWARvCCrzPrw_zIMajcFcRUT2k-HYoajRlvTa-welaEXw",
  },
  {
    rank: 3,
    title: "연세 아카라카 축제",
    category: "대학축제",
    region: "서울 서대문구",
    date: "05.22 - 05.24",
    meta: "조회수 2.1k · 관심 980",
    description: "화려한 라인업과 캠퍼스 열기가 더해져 실시간 관심이 높아요.",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuD4vBCUmNl7C0y4IuzbDpVkte-xudaeTcVVUlRLURjikQzNKcr69fOwa5lkclyjVT2hpqrxKG2I1bKm5RyAsxFPmUQSmNBkTJC9PmNU20kbbhLz0E41wkFCFirwe1lG81eoi4JHVx7cWRIVmR1BsNLqEniQXJQI_lN3pUYYbhk5J7eBR2dSBQQSTSEk5i3ZGNT0UOjnpwrEj561tie7NQSlG6dTgPjwYiwkQe2sygv9uC0jMQM62xjwyIC0c6zrPAKb09kMrwWl4A",
  },
  {
    rank: 4,
    title: "평창 꽃밭 축제",
    category: "자연",
    region: "강원 평창군",
    date: "06.01 - 06.30",
    meta: "조회수 1.8k · 관심 850",
    description: "초여름 야생화와 산책 코스가 어우러진 힐링형 축제입니다.",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDydSygp0ZlZrJrj7isqLoatskgxXv1F4SdrDGv1AhIKhy1zuptFmwWFEXJLkGzantUrZOC5WrO4DTnMYs1Kkq3wUvo2AHInjuy14McqGD9JUhph_QKEm_UmJn8ErhZbEY_pqT-rzpuDe9LfoNO7xqqDpm4HThb9FxEgmdJXDyxrC6NKgSKXreP6m1cVrqx8jVH1lgBJLsG86BXk3Jm4jZ-1gc-2NinYzNPE9PzGL88d56T6h0-EOIYDO2RNb_Q8prHNBW8QV5yQw",
    muted: true,
  },
  {
    rank: 5,
    title: "수원 야간 기행",
    category: "야간",
    region: "경기 수원시",
    date: "07.05 - 07.21",
    meta: "조회수 1.5k · 관심 720",
    description: "성곽 야경과 역사 해설을 함께 즐기는 밤 산책 프로그램이에요.",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCbyC2QpUYgeq2X3AKHybFw-pJwbppIGJ2tkqEMQtqod_KocVrnotje1bIJGuItogV_su62FQvbVIF6RabP-gQwO6c9bxzVwyIolTkJHLSF-_V3SE0GL5PQqVkEeZM3qdp9vbI39i6zS61mfiymHgdBVe-JFAxpMleBcZdmgY33Ag4z0PnaMtu0udf8jcZA2D3v7k6NjVN6YP7vxakntR7Rq8RGB6MshMFa7QQQgmHCdZvj3g0Pb8KPbe22RWyCuZHcHKE13iSKCA",
  },
];

function MainPage() {
  const auth = useAuth();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isHeroPlaying, setIsHeroPlaying] = useState(true);
  const [selectedPopularRank, setSelectedPopularRank] = useState(1);
  const isMainLoading = false;
  const user = auth?.user || {};
  const storedUserRegion =
    typeof window !== "undefined"
      ? localStorage.getItem("userRegion") ||
        localStorage.getItem("region") ||
        localStorage.getItem("address") ||
        localStorage.getItem("ldongRegnCd") ||
        localStorage.getItem("ldongSignguCd")
      : null;
  const isLoggedIn =
    Boolean(auth?.isLoggedIn) ||
    (typeof window !== "undefined" &&
      Boolean(localStorage.getItem("accessToken")));
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
  const locationSettingPath = isLoggedIn ? "/mypage/region" : "/signup";
  const displayHeroSlides = fallbackHeroSlides;
  const displayRegionFestivals = fallbackNearbyFestivals;
  const displayMonthlyFestivals = fallbackMonthlyFestivals;
  const displayPopularFestivals = fallbackPopularFestivals;
  const selectedPopularFestival =
    displayPopularFestivals.find(
      (festival) => festival.rank === selectedPopularRank,
    ) || displayPopularFestivals[0];
  const rankingItems = displayPopularFestivals;

  useEffect(() => {
    // TODO: AxiosApi 함수명 확정 후 연결 필요
    // AxiosApi.getBannerFestivals()
    // AxiosApi.getNearbyFestivalRecommendations()
    // AxiosApi.getMonthlyNationalFestivals()
    // AxiosApi.getRealtimePopularFestivals()
  }, []);

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
      festival.id || festival.rank || festival.title || festival.name;

    return {
      to: `/festivals/${encodeURIComponent(festivalId)}`,
      state: {
        festival: {
          ...festival,
          id: festivalId,
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
            서울 은평구 근처 추천 축제를 가까운 순서대로 골랐어요.
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
                      <span>{festival.distance}</span>
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
        </Section>

        <Section>
          <SectionHeader>
            <SectionTitle>실시간 인기 축제</SectionTitle>
            <LiveBadge>
              <span />
              LIVE
            </LiveBadge>
          </SectionHeader>
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
        </Section>
      </MainContainer>
    </MainPageWrapper>
  );
}

export default MainPage;
