import styled, { keyframes } from "styled-components";

const pulseGlow = keyframes`
  0% {
    opacity: 0.28;
    transform: scale(1);
  }

  100% {
    opacity: 0.58;
    transform: scale(1.1);
  }
`;

const floatPanel = keyframes`
  0%, 100% {
    transform: translateY(0);
  }

  50% {
    transform: translateY(8px);
  }
`;

export const FailPage = styled.main`
  position: relative;
  z-index: 0;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  padding: 128px 16px 80px;
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
    padding: 84px 16px 56px;
  }
`;

export const BackgroundLayer = styled.div`
  position: absolute;
  inset: 0;
  z-index: -1;
  overflow: hidden;
  pointer-events: none;
`;

export const GlowOrb = styled.div`
  position: absolute;
  border-radius: 999px;
  pointer-events: none;
  animation: ${pulseGlow} 4s ease-in-out infinite alternate;

  ${({ $tone }) => {
    if ($tone === "secondary") {
      return `
        top: 20%;
        right: -10%;
        width: 40%;
        height: 40%;
        min-width: 300px;
        min-height: 300px;
        background: rgba(255, 176, 205, 0.1);
        filter: blur(100px);
        animation-delay: -2s;
      `;
    }

    if ($tone === "tertiary") {
      return `
        left: 20%;
        bottom: -10%;
        width: 60%;
        height: 40%;
        min-width: 360px;
        min-height: 260px;
        background: rgba(236, 106, 6, 0.05);
        filter: blur(150px);
        animation-delay: -1s;
      `;
    }

    return `
      top: -10%;
      left: -10%;
      width: 50%;
      height: 50%;
      min-width: 360px;
      min-height: 360px;
      background: rgba(221, 183, 255, 0.1);
      filter: blur(120px);
    `;
  }}
`;

export const ContentWrap = styled.div`
  width: min(100%, 512px);
`;

export const FailCard = styled.section`
  position: relative;
  overflow: hidden;
  padding: 48px;
  text-align: center;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 24px;
  background: rgba(23, 31, 51, 0.7);
  box-shadow: 0 24px 48px rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(20px);
  animation: ${floatPanel} 7s ease-in-out infinite;

  &::before {
    content: "";
    position: absolute;
    z-index: -1;
    top: 0;
    left: 50%;
    width: 192px;
    height: 192px;
    border-radius: 999px;
    background: rgba(236, 106, 6, 0.2);
    filter: blur(60px);
    transform: translateX(-50%);
  }

  @media (prefers-reduced-motion: reduce) {
    animation: none;
  }

  @media (max-width: 560px) {
    padding: 40px 22px;
    border-radius: 22px;
  }
`;

export const IconWrap = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 24px;
`;

export const WarningBadge = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 80px;
  height: 80px;
  border: 1px solid rgba(236, 106, 6, 0.3);
  border-radius: 16px;
  color: #ec6a06;
  background: rgba(236, 106, 6, 0.1);
  box-shadow: 0 0 20px rgba(236, 106, 6, 0.3);

  svg {
    width: 48px;
    height: 48px;
    fill: none;
    stroke: currentColor;
    stroke-width: 2.2;
  }
`;

export const Title = styled.h1`
  margin: 0 0 8px;
  color: #dae2fd;
  font-size: 32px;
  font-weight: 700;
  line-height: 40px;
  letter-spacing: 0;

  @media (max-width: 560px) {
    font-size: 24px;
    line-height: 32px;
  }
`;

export const Description = styled.p`
  margin: 0 0 48px;
  color: #cfc2d6;
  font-size: 16px;
  font-weight: 400;
  line-height: 24px;

  @media (max-width: 560px) {
    margin-bottom: 36px;
  }
`;

export const ErrorBox = styled.div`
  margin-bottom: 48px;
  padding: 16px;
  text-align: left;
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 16px;
  background: rgba(34, 42, 61, 0.5);

  @media (max-width: 560px) {
    margin-bottom: 36px;
  }
`;

export const ErrorLabel = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 4px;
  color: #cfc2d6;

  svg {
    width: 18px;
    height: 18px;
  }
`;

export const ErrorLabelText = styled.span`
  font-size: 12px;
  font-weight: 500;
  line-height: 16px;
`;

export const ErrorReason = styled.p`
  margin: 0;
  color: #ffb690;
  font-size: 16px;
  font-weight: 400;
  line-height: 24px;
`;

export const RetryButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  width: 100%;
  min-height: 56px;
  padding: 16px 24px;
  border: 0;
  border-radius: 12px;
  color: #ffffff;
  background: linear-gradient(135deg, #b76dff 0%, #aa0266 100%);
  box-shadow: 0 0 15px rgba(221, 183, 255, 0.4);
  font-size: 14px;
  font-weight: 600;
  line-height: 20px;
  letter-spacing: 0.04em;
  cursor: pointer;
  transition:
    transform 180ms ease,
    box-shadow 180ms ease;

  svg {
    width: 20px;
    height: 20px;
  }

  &:hover {
    transform: translateY(-1px);
    box-shadow:
      0 0 15px rgba(221, 183, 255, 0.4),
      0 8px 24px rgba(170, 2, 102, 0.35);
  }

  &:active {
    transform: scale(0.98);
  }
`;

export const PoweredBy = styled.p`
  margin: 48px 0 0;
  text-align: center;
  color: rgba(207, 194, 214, 0.4);
  font-size: 12px;
  font-weight: 500;
  line-height: 16px;
  letter-spacing: 0.14em;
  text-transform: uppercase;
`;
