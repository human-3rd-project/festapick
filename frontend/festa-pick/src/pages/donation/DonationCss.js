import styled, { keyframes } from "styled-components";

const pulseBlob = keyframes`
  0%, 100% {
    opacity: 0.28;
    transform: scale(1);
  }

  50% {
    opacity: 0.58;
    transform: scale(1.06);
  }
`;

const pulseDot = keyframes`
  0% {
    opacity: 0.85;
    transform: scale(1);
  }

  75%, 100% {
    opacity: 0;
    transform: scale(2.35);
  }
`;

export const DonationPage = styled.main`
  position: relative;
  min-height: 100vh;
  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 96px 16px 64px;
  background: #0b1326;
  color: #dae2fd;
  font-family:
    "Plus Jakarta Sans",
    "Pretendard",
    "Apple SD Gothic Neo",
    sans-serif;

  * {
    box-sizing: border-box;
  }

  @media (max-width: 768px) {
    align-items: flex-start;
    padding: 56px 16px 48px;
  }
`;

export const BackgroundLayer = styled.div`
  position: absolute;
  inset: 0;
  z-index: 0;
  pointer-events: none;

  &::before {
    content: "";
    position: absolute;
    inset: 0;
    background:
      linear-gradient(180deg, rgba(11, 19, 38, 0.12), #0b1326 96%),
      url("https://lh3.googleusercontent.com/aida-public/AB6AXuBjbVeRKtYueOnHViYWDEETwrVjAfWxhgrvOu3fmzsFOI-1jzeVNstYrzmSH24w9bctwdO3n9aIN_-PN-0FxFsNkEu9aeVW2tFmEG5yWI3DwmcKwWi8C3wTTN275UHti03BIABaDHhRSjx3aN0v86vrDiW5ejxF6erc5opbK1VgteQZisYYc_SBwklt8oB_my7inhEIr7-ydtQOPNLxDmr94hqzShjSL0MHw-BDgv1ScIdLXzWUjX4iamkXh2AiRoesM1mKioW_YxJq")
        center / cover;
    mix-blend-mode: overlay;
    opacity: 0.2;
  }
`;

export const GlowBlob = styled.div`
  position: absolute;
  width: 600px;
  height: 600px;
  border-radius: 999px;
  filter: blur(120px);
  animation: ${pulseBlob} 4s cubic-bezier(0.4, 0, 0.6, 1) infinite;

  ${({ $variant }) =>
    $variant === "secondary"
      ? `
        right: -240px;
        bottom: 20%;
        background: rgba(255, 176, 205, 0.1);
        animation-delay: 2s;
      `
      : `
        left: -240px;
        top: 18%;
        background: rgba(221, 183, 255, 0.1);
      `}

  @media (max-width: 768px) {
    width: 360px;
    height: 360px;
    filter: blur(88px);
  }
`;

export const ContentShell = styled.div`
  position: relative;
  z-index: 1;
  width: min(100%, 1024px);
  text-align: center;
`;

export const HeroPanel = styled.section`
  position: relative;
  overflow: hidden;
  padding: 80px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 32px;
  background: rgba(23, 31, 51, 0.4);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.37);
  backdrop-filter: blur(20px);

  @media (max-width: 768px) {
    padding: 44px 22px;
    border-radius: 24px;
  }
`;

export const Decoration = styled.div`
  position: absolute;
  top: 24px;
  right: 24px;
  color: rgba(221, 183, 255, 0.2);
  transform: rotate(12deg);

  svg {
    width: 120px;
    height: 120px;
    stroke-width: 1.5;
  }

  @media (max-width: 768px) {
    top: 16px;
    right: 16px;

    svg {
      width: 84px;
      height: 84px;
    }
  }
`;

export const HeroContent = styled.div`
  position: relative;
  z-index: 1;
`;

export const Eyebrow = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 16px;
  padding: 4px 16px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.05);
`;

export const LiveDot = styled.span`
  position: relative;
  width: 8px;
  height: 8px;
  border-radius: 999px;
  background: #ffb0cd;

  &::after {
    content: "";
    position: absolute;
    inset: 0;
    border-radius: inherit;
    background: inherit;
    animation: ${pulseDot} 1.7s cubic-bezier(0, 0, 0.2, 1) infinite;
  }
`;

export const EyebrowText = styled.span`
  color: #ffb0cd;
  font-size: 12px;
  font-weight: 500;
  line-height: 16px;
  letter-spacing: 0.12em;
  text-transform: uppercase;
`;

export const Title = styled.h1`
  margin: 0;
  color: #dae2fd;
  font-size: 56px;
  font-weight: 800;
  line-height: 1.08;
  letter-spacing: 0;

  @media (max-width: 768px) {
    font-size: 36px;
    line-height: 1.16;
  }
`;

export const GradientText = styled.span`
  background: linear-gradient(90deg, #ddb7ff, #ffb0cd);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
`;

export const Lead = styled.p`
  max-width: 680px;
  margin: 24px auto 0;
  color: #cfc2d6;
  font-size: 18px;
  font-weight: 400;
  line-height: 28px;

  @media (max-width: 768px) {
    font-size: 16px;
    line-height: 25px;

    br {
      display: none;
    }
  }
`;

export const ActionArea = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 48px;

  @media (max-width: 768px) {
    padding-top: 36px;
  }
`;

export const DonateButton = styled.button`
  position: relative;
  overflow: hidden;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 16px;
  min-height: 80px;
  padding: 20px 48px;
  border: 0;
  border-radius: 999px;
  color: #490080;
  background: linear-gradient(90deg, #ddb7ff, #ffb0cd);
  box-shadow: 0 0 20px rgba(221, 183, 255, 0.4);
  cursor: pointer;
  transition:
    transform 180ms ease,
    box-shadow 180ms ease;

  &::before {
    content: "";
    position: absolute;
    inset: 0;
    border-radius: inherit;
    background: rgba(255, 255, 255, 0.2);
    opacity: 0;
    transition: opacity 180ms ease;
  }

  &:hover {
    transform: scale(1.04);
    box-shadow:
      0 0 20px rgba(221, 183, 255, 0.4),
      0 0 20px rgba(255, 176, 205, 0.4);
  }

  &:hover::before {
    opacity: 1;
  }

  &:active {
    transform: scale(0.96);
  }

  span,
  svg {
    position: relative;
    z-index: 1;
  }

  svg {
    width: 26px;
    height: 26px;
    transition: transform 180ms ease;
  }

  &:hover svg {
    transform: translateX(4px);
  }

  @media (max-width: 520px) {
    width: 100%;
    min-height: 68px;
    padding: 18px 24px;
  }
`;

export const DonateButtonText = styled.span`
  font-size: 24px;
  font-weight: 600;
  line-height: 32px;

  @media (max-width: 520px) {
    font-size: 18px;
    line-height: 26px;
  }
`;

export const Stats = styled.div`
  display: flex;
  align-items: center;
  gap: 48px;
  margin-top: 24px;
  opacity: 0.6;

  @media (max-width: 520px) {
    gap: 28px;
  }
`;

export const StatItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

export const StatValue = styled.span`
  color: #dae2fd;
  font-size: 24px;
  font-weight: 600;
  line-height: 32px;
`;

export const StatLabel = styled.span`
  color: #cfc2d6;
  font-size: 12px;
  font-weight: 500;
  line-height: 16px;
`;

export const StatDivider = styled.span`
  width: 1px;
  height: 32px;
  background: rgba(255, 255, 255, 0.1);
`;

export const FeatureGrid = styled.section`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 24px;
  margin-top: 48px;
  text-align: left;

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
  }
`;

export const FeatureCard = styled.article`
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 24px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  background: rgba(23, 31, 51, 0.4);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.37);
  backdrop-filter: blur(20px);
  transition: border-color 180ms ease;

  &:hover {
    border-color: ${({ $tone }) =>
      $tone === "secondary"
        ? "rgba(255, 176, 205, 0.3)"
        : $tone === "tertiary"
          ? "rgba(255, 182, 144, 0.3)"
          : "rgba(221, 183, 255, 0.3)"};
  }
`;

export const FeatureIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  margin-bottom: 8px;
  border-radius: 8px;
  color: ${({ $tone }) =>
    $tone === "secondary"
      ? "#ffb0cd"
      : $tone === "tertiary"
        ? "#ffb690"
        : "#ddb7ff"};
  background: ${({ $tone }) =>
    $tone === "secondary"
      ? "rgba(255, 176, 205, 0.1)"
      : $tone === "tertiary"
        ? "rgba(255, 182, 144, 0.1)"
        : "rgba(221, 183, 255, 0.1)"};

  svg {
    width: 24px;
    height: 24px;
    fill: currentColor;
    stroke-width: 1.8;
  }
`;

export const FeatureTitle = styled.h3`
  margin: 0;
  color: #dae2fd;
  font-size: 24px;
  font-weight: 600;
  line-height: 32px;
  letter-spacing: 0;

  @media (max-width: 520px) {
    font-size: 20px;
    line-height: 28px;
  }
`;

export const FeatureDescription = styled.p`
  margin: 0;
  color: #cfc2d6;
  font-size: 16px;
  font-weight: 400;
  line-height: 24px;
`;
