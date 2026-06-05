import styled, { keyframes } from "styled-components";

const pulse = keyframes`
  0%, 100% {
    opacity: 1;
  }

  50% {
    opacity: 0.45;
  }
`;

const fadeIn = keyframes`
  from {
    opacity: 0.35;
    transform: translateY(4px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

export const MainPageWrapper = styled.div`
  min-height: 100vh;
  background:
    radial-gradient(circle at 12% 6%, rgba(255, 176, 205, 0.16), transparent 30%),
    radial-gradient(circle at 88% 16%, rgba(221, 183, 255, 0.18), transparent 32%),
    #0b1326;
  color: #dae2fd;
  font-family: "Plus Jakarta Sans", "Pretendard", "Noto Sans KR", sans-serif;
`;

export const MainContainer = styled.main`
  width: min(100%, 1280px);
  margin: 0 auto;
  padding: 48px 40px 72px;
  display: flex;
  flex-direction: column;
  gap: 48px;

  @media (max-width: 768px) {
    padding: 24px 16px 56px;
    gap: 40px;
  }
`;

export const HeroSection = styled.section`
  position: relative;
  min-height: 480px;
  overflow: hidden;
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  background: #171f33;

  @media (max-width: 768px) {
    min-height: 560px;
  }
`;

export const HeroImageLayer = styled.div`
  position: absolute;
  inset: 0;
  background-image:
    linear-gradient(90deg, #0b1326 0%, rgba(11, 19, 38, 0.76) 44%, rgba(11, 19, 38, 0.16) 100%),
    url(${({ $image }) => $image});
  background-position: center;
  background-size: cover;
  opacity: ${({ $active }) => ($active ? 1 : 0)};
  transform: ${({ $active }) => ($active ? "scale(1.035)" : "scale(1)")};
  transition:
    opacity 850ms ease,
    transform 5200ms ease;
  will-change: opacity, transform;

  ${HeroSection}:hover & {
    transform: ${({ $active }) => ($active ? "scale(1.055)" : "scale(1)")};
  }

  @media (max-width: 768px) {
    background-image:
      linear-gradient(180deg, rgba(11, 19, 38, 0.28) 0%, #0b1326 78%),
      url(${({ $image }) => $image});
  }
`;

export const HeroContent = styled.div`
  position: relative;
  z-index: 1;
  min-height: 480px;
  max-width: 680px;
  padding: 64px 48px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 28px;

  p {
    margin: 16px 0 0;
    color: #cfc2d6;
    font-size: 18px;
    line-height: 1.55;
  }

  @media (max-width: 768px) {
    min-height: 560px;
    padding: 36px 24px 88px;
    justify-content: flex-end;

    p {
      font-size: 16px;
    }
  }
`;

export const HeroNavButton = styled.button`
  position: absolute;
  top: 50%;
  ${({ $direction }) => ($direction === "prev" ? "left: 18px;" : "right: 18px;")}
  z-index: 2;
  width: 44px;
  height: 44px;
  border: 1px solid rgba(255, 255, 255, 0.14);
  border-radius: 999px;
  display: grid;
  place-items: center;
  background: rgba(11, 19, 38, 0.54);
  color: #dae2fd;
  opacity: 0;
  cursor: pointer;
  backdrop-filter: blur(12px);
  transform: translateY(-50%)
    ${({ $direction }) => ($direction === "prev" ? "rotate(180deg)" : "rotate(0deg)")};
  transition:
    opacity 180ms ease,
    background 180ms ease,
    border-color 180ms ease;

  ${HeroSection}:hover & {
    opacity: 1;
  }

  &:hover {
    border-color: rgba(221, 183, 255, 0.45);
    background: rgba(34, 42, 61, 0.78);
    color: #ddb7ff;
  }

  @media (max-width: 768px) {
    display: none;
  }
`;

export const HeroBadge = styled.span`
  display: inline-flex;
  margin-bottom: 10px;
  color: #ffb0cd;
  font-size: 14px;
  font-weight: 800;
  letter-spacing: 0;
  text-transform: uppercase;
`;

export const HeroTitle = styled.h1`
  margin: 0;
  color: #dae2fd;
  font-size: 48px;
  line-height: 1.15;
  font-weight: 800;
  letter-spacing: 0;

  span {
    background: linear-gradient(90deg, #ddb7ff, #ffb0cd);
    background-clip: text;
    -webkit-background-clip: text;
    color: transparent;
  }

  @media (max-width: 768px) {
    font-size: 34px;
  }
`;

export const HeroActions = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
`;

const BaseButton = styled.button`
  border: 0;
  min-height: 48px;
  padding: 0 26px;
  border-radius: 999px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  font-size: 16px;
  font-weight: 800;
  letter-spacing: 0;
  cursor: pointer;
  transition:
    transform 180ms ease,
    filter 180ms ease,
    background 180ms ease,
    color 180ms ease;

  &:hover {
    filter: brightness(1.08);
  }

  &:active {
    transform: scale(0.97);
  }
`;

export const PrimaryButton = styled(BaseButton)`
  background: linear-gradient(135deg, #ddb7ff 0%, #ffb0cd 100%);
  color: #490080;
`;

export const SecondaryButton = styled(BaseButton)`
  border: 1px solid rgba(221, 183, 255, 0.36);
  background: rgba(255, 255, 255, 0.05);
  color: #dae2fd;
  backdrop-filter: blur(12px);
`;

export const IndicatorGroup = styled.div`
  position: absolute;
  right: 48px;
  bottom: 32px;
  z-index: 1;
  align-items: center;
  display: flex;
  gap: 8px;
`;

export const Indicator = styled.span`
  width: ${({ $active }) => ($active ? "32px" : "8px")};
  height: 6px;
  border-radius: 999px;
  background: ${({ $active }) => ($active ? "#ddb7ff" : "rgba(255, 255, 255, 0.32)")};
`;

export const HeroPlaybackButton = styled.button`
  width: 28px;
  height: 28px;
  border: 1px solid rgba(255, 255, 255, 0.14);
  border-radius: 999px;
  display: grid;
  place-items: center;
  background: rgba(11, 19, 38, 0.52);
  color: #dae2fd;
  cursor: pointer;
  backdrop-filter: blur(12px);
  transition:
    color 180ms ease,
    background 180ms ease,
    border-color 180ms ease;

  &:hover {
    border-color: rgba(221, 183, 255, 0.45);
    background: rgba(34, 42, 61, 0.78);
    color: #ddb7ff;
  }
`;

export const Section = styled.section`
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

export const SectionHeader = styled.div`
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 16px;

  @media (max-width: 640px) {
    align-items: flex-start;
    flex-direction: column;
  }
`;

export const MonthlyHeader = styled(SectionHeader)`
  align-items: center;
`;

export const SectionTitle = styled.h2`
  margin: 0;
  display: flex;
  align-items: center;
  gap: 10px;
  color: #dae2fd;
  font-size: 32px;
  line-height: 1.25;
  font-weight: 800;
  letter-spacing: 0;

  svg {
    color: #ffb0cd;
    flex: 0 0 auto;
  }

  @media (max-width: 768px) {
    font-size: 24px;
  }
`;

export const SectionLink = styled.a`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  color: #cfc2d6;
  font-size: 14px;
  font-weight: 700;
  text-decoration: none;

  &:hover {
    color: #ddb7ff;
  }
`;

export const LocationCard = styled.div`
  position: relative;
  min-height: 320px;
  overflow: hidden;
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  background:
    linear-gradient(rgba(11, 19, 38, 0.68), rgba(11, 19, 38, 0.84)),
    url(${({ $image }) => $image}) center / cover;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 14px;
  padding: 48px 24px;
  text-align: center;
  box-shadow: inset 0 0 80px rgba(221, 183, 255, 0.1);

  svg {
    color: #ffb0cd;
    filter: drop-shadow(0 0 15px rgba(255, 176, 205, 0.4));
    animation: ${pulse} 2.4s ease-in-out infinite;
  }

  h3 {
    margin: 0;
    color: #dae2fd;
    font-size: 24px;
    line-height: 1.35;
    font-weight: 800;
  }

  p {
    max-width: 460px;
    margin: 0;
    color: #cfc2d6;
    font-size: 16px;
    line-height: 1.5;
  }
`;

export const TextButton = styled(BaseButton)`
  min-height: 42px;
  margin-top: 6px;
  border: 1px solid rgba(221, 183, 255, 0.36);
  background: #222a3d;
  color: #ddb7ff;

  &:hover {
    background: #ddb7ff;
    color: #490080;
  }
`;

export const NearbySectionLead = styled.p`
  margin: -10px 0 0;
  color: #cfc2d6;
  font-size: 16px;
  line-height: 1.5;
  font-weight: 500;
`;

export const NearbyGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 24px;

  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
  }
`;

export const NearbyCard = styled.article`
  overflow: hidden;
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  background: rgba(255, 255, 255, 0.045);
  backdrop-filter: blur(12px);
  display: flex;
  flex-direction: column;
  min-height: 100%;
  transition:
    border-color 180ms ease,
    transform 180ms ease,
    box-shadow 180ms ease;

  &:hover {
    border-color: rgba(221, 183, 255, 0.32);
    box-shadow: 0 18px 48px rgba(0, 0, 0, 0.22);
    transform: translateY(-3px);
  }

  @media (max-width: 1024px) {
    display: grid;
    grid-template-columns: minmax(220px, 0.42fr) minmax(0, 1fr);
  }

  @media (max-width: 640px) {
    display: flex;
  }
`;

export const NearbyImage = styled.img`
  width: 100%;
  height: 190px;
  display: block;
  object-fit: cover;
  background: #171f33;

  @media (max-width: 1024px) {
    height: 100%;
    min-height: 220px;
  }

  @media (max-width: 640px) {
    height: 190px;
    min-height: auto;
  }
`;

export const NearbyInfo = styled.div`
  padding: 18px;
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: 12px;

  > span {
    width: fit-content;
    border-radius: 999px;
    padding: 4px 9px;
    background: rgba(221, 183, 255, 0.12);
    color: #ddb7ff;
    font-size: 12px;
    line-height: 16px;
    font-weight: 800;
  }

  h3 {
    margin: 0;
    color: #dae2fd;
    font-size: 22px;
    line-height: 1.32;
    font-weight: 850;
    letter-spacing: 0;
  }

  p {
    margin: 0;
    color: #cfc2d6;
    font-size: 14px;
    line-height: 1.55;
    font-weight: 500;
  }

  a {
    min-height: 40px;
    margin-top: auto;
    border-radius: 8px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    background: linear-gradient(135deg, #ddb7ff 0%, #ffb0cd 100%);
    color: #490080;
    font-size: 14px;
    line-height: 20px;
    font-weight: 900;
    text-decoration: none;
    transition: filter 180ms ease;
  }

  a:hover {
    filter: brightness(1.08);
  }
`;

export const NearbyMeta = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
  color: #cfc2d6;
  font-size: 13px;
  line-height: 18px;
  font-weight: 650;

  span {
    display: inline-flex;
    align-items: center;
    gap: 6px;
  }

  svg {
    color: #ffb0cd;
    flex: 0 0 auto;
  }
`;

export const FestivalGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 24px;

  @media (max-width: 900px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  @media (max-width: 520px) {
    grid-template-columns: 1fr;
  }
`;

export const FestivalCard = styled.button`
  border: 0;
  padding: 0;
  background: transparent;
  color: inherit;
  text-align: left;
  cursor: pointer;

  span {
    display: block;
    margin-top: 12px;
    color: #ddb7ff;
    font-size: 12px;
    line-height: 1.4;
    font-weight: 800;
  }

  h3 {
    margin: 3px 0 4px;
    color: #dae2fd;
    font-size: 18px;
    line-height: 1.35;
    font-weight: 800;
    transition: color 180ms ease;
  }

  p {
    margin: 0;
    color: #cfc2d6;
    font-size: 12px;
    line-height: 1.4;
  }

  &:hover h3 {
    color: #ddb7ff;
  }
`;

export const CardImage = styled.img`
  width: 100%;
  aspect-ratio: 4 / 3;
  display: block;
  border-radius: 12px;
  object-fit: cover;
  background: #171f33;
  border: 1px solid rgba(255, 255, 255, 0.1);
  transition: transform 240ms ease;

  ${FestivalCard}:hover & {
    transform: scale(1.02);
  }
`;

export const LiveBadge = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 4px 8px;
  border-radius: 4px;
  background: rgba(255, 180, 171, 0.18);
  color: #ffb4ab;
  font-size: 11px;
  font-weight: 900;

  span {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: #ffb4ab;
    animation: ${pulse} 1.2s ease-in-out infinite;
  }
`;

export const RankingGrid = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 7fr) minmax(360px, 5fr);
  gap: 24px;

  @media (max-width: 980px) {
    grid-template-columns: 1fr;
  }
`;

export const RankingFeatured = styled.button`
  position: relative;
  min-height: 320px;
  overflow: hidden;
  border: 0;
  border-radius: 12px;
  padding: 0;
  color: #dae2fd;
  text-align: left;
  cursor: pointer;
  background: #171f33;
  box-shadow: 0 24px 60px rgba(0, 0, 0, 0.25);
  animation: ${fadeIn} 360ms ease both;

  > img {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 700ms ease;
  }

  &::after {
    content: "";
    position: absolute;
    inset: 0;
    background: linear-gradient(0deg, rgba(11, 19, 38, 0.95), rgba(11, 19, 38, 0.12));
  }

  > strong {
    position: absolute;
    top: 24px;
    left: 24px;
    z-index: 1;
    width: 48px;
    height: 48px;
    border-radius: 12px;
    display: grid;
    place-items: center;
    background: #ddb7ff;
    color: #490080;
    font-size: 28px;
    font-weight: 900;
  }

  > div {
    position: absolute;
    left: 24px;
    right: 24px;
    bottom: 24px;
    z-index: 1;
  }

  h3 {
    margin: 12px 0 8px;
    color: #ffffff;
    font-size: 32px;
    line-height: 1.15;
    font-weight: 900;
  }

  p {
    margin: 0;
    color: #cfc2d6;
    font-size: 16px;
    line-height: 1.5;
  }

  &:hover > img {
    transform: scale(1.05);
  }

  @media (max-width: 520px) {
    h3 {
      font-size: 26px;
    }
  }
`;

export const Badge = styled.span`
  display: inline-flex;
  margin-right: 8px;
  padding: 4px 8px;
  border-radius: 4px;
  border: 1px solid rgba(255, 176, 205, 0.42);
  background: rgba(255, 176, 205, 0.18);
  color: #ffb0cd;
  font-size: 12px;
  font-weight: 800;
`;

export const RankingList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

export const RankingItem = styled.button`
  min-height: 80px;
  border: 1px solid
    ${({ $active }) => ($active ? "rgba(221, 183, 255, 0.55)" : "rgba(255, 255, 255, 0.1)")};
  border-radius: 12px;
  padding: 14px 16px;
  display: grid;
  grid-template-columns: 36px 64px minmax(0, 1fr) 24px;
  align-items: center;
  gap: 14px;
  background: ${({ $active }) =>
    $active ? "rgba(221, 183, 255, 0.12)" : "rgba(255, 255, 255, 0.04)"};
  color: #dae2fd;
  text-align: left;
  cursor: pointer;
  backdrop-filter: blur(12px);
  transition:
    background 180ms ease,
    border-color 180ms ease,
    box-shadow 180ms ease,
    transform 180ms ease;
  box-shadow: ${({ $active }) =>
    $active ? "0 0 24px rgba(221, 183, 255, 0.16)" : "none"};

  > strong {
    color: #ddb7ff;
    font-size: 28px;
    font-style: italic;
    font-weight: 900;
    opacity: ${({ $active, $muted }) => ($active || !$muted ? 1 : 0.68)};
    text-align: center;
  }

  img {
    width: 64px;
    height: 64px;
    border-radius: 8px;
    object-fit: cover;
  }

  h3 {
    margin: 0 0 4px;
    color: #dae2fd;
    font-size: 16px;
    line-height: 1.4;
    font-weight: 800;
    transition: color 180ms ease;
  }

  p {
    margin: 0;
    color: #cfc2d6;
    font-size: 12px;
    line-height: 1.4;
  }

  svg {
    color: ${({ $active, $muted }) => ($active || !$muted ? "#ffb0cd" : "#cfc2d6")};
    opacity: ${({ $active, $muted }) => ($active || !$muted ? 1 : 0.5)};
  }

  &:hover {
    border-color: rgba(221, 183, 255, 0.36);
    background: ${({ $active }) =>
      $active ? "rgba(221, 183, 255, 0.16)" : "rgba(255, 255, 255, 0.07)"};
    transform: translateY(-1px);
  }

  &:hover h3 {
    color: #ddb7ff;
  }

  @media (max-width: 520px) {
    grid-template-columns: 28px 56px minmax(0, 1fr);

    img {
      width: 56px;
      height: 56px;
    }

    svg {
      display: none;
    }
  }
`;
