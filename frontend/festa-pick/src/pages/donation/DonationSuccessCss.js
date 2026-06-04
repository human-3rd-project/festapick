import styled, { keyframes } from "styled-components";

const floatCard = keyframes`
  0%, 100% {
    transform: translateY(0);
  }

  50% {
    transform: translateY(-10px);
  }
`;

const fall = keyframes`
  0% {
    opacity: 0;
    transform: translate3d(0, -24px, 0) rotate(0deg) scale(0.8);
  }

  12% {
    opacity: 0.9;
  }

  100% {
    opacity: 0;
    transform: translate3d(var(--x-offset), 760px, 0) rotate(var(--rotation)) scale(var(--scale));
  }
`;

export const SuccessPage = styled.main`
  position: relative;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  padding: 96px 16px 80px;
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
    padding: 64px 16px 56px;
  }
`;

export const BackgroundLayer = styled.div`
  position: absolute;
  inset: 0;
  pointer-events: none;
`;

export const Glow = styled.div`
  position: absolute;
  border-radius: 999px;
  pointer-events: none;

  ${({ $tone }) =>
    $tone === "secondary"
      ? `
        right: -80px;
        bottom: 22%;
        width: 320px;
        height: 320px;
        background: rgba(255, 176, 205, 0.2);
        filter: blur(100px);
      `
      : `
        left: -80px;
        top: 24%;
        width: 384px;
        height: 384px;
        background: rgba(221, 183, 255, 0.2);
        filter: blur(120px);
      `}

  @media (max-width: 768px) {
    width: 260px;
    height: 260px;
  }
`;

export const ConfettiLayer = styled.div`
  position: absolute;
  inset: 0;
  overflow: hidden;
`;

export const Confetti = styled.span`
  --x-offset: ${({ $xOffset }) => $xOffset}px;
  --rotation: ${({ $rotation }) => $rotation}deg;
  --scale: ${({ $scale }) => $scale};

  position: absolute;
  top: -12px;
  left: ${({ $left }) => $left}%;
  width: 8px;
  height: 8px;
  border-radius: 2px;
  background: ${({ $color }) => $color};
  opacity: 0;
  animation: ${fall} ${({ $duration }) => $duration}ms
    cubic-bezier(0, 0.9, 0.57, 1) ${({ $delay }) => $delay}ms infinite;
`;

export const ContentWrap = styled.div`
  position: relative;
  z-index: 1;
  width: min(100%, 600px);
  animation: ${floatCard} 6s ease-in-out infinite;

  @media (prefers-reduced-motion: reduce) {
    animation: none;
  }
`;

export const SuccessCard = styled.section`
  padding: 48px;
  text-align: center;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 32px;
  background: rgba(23, 31, 51, 0.7);
  box-shadow: 0 32px 64px rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(20px);

  @media (max-width: 560px) {
    padding: 36px 22px;
    border-radius: 26px;
  }
`;

export const CheckWrap = styled.div`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 96px;
  height: 96px;
  margin-bottom: 48px;
  padding: 4px;
  border-radius: 999px;
  background: linear-gradient(135deg, #ddb7ff 0%, #ffb0cd 100%);
  box-shadow:
    0 0 20px rgba(255, 176, 205, 0.4),
    0 0 40px rgba(255, 176, 205, 0.2);

  @media (max-width: 560px) {
    width: 84px;
    height: 84px;
    margin-bottom: 34px;
  }
`;

export const CheckInner = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  border-radius: inherit;
  background: #171f33;
  color: #ffb0cd;

  svg {
    width: 48px;
    height: 48px;
    fill: currentColor;
    stroke-width: 1.8;
  }

  @media (max-width: 560px) {
    svg {
      width: 42px;
      height: 42px;
    }
  }
`;

export const Title = styled.h1`
  margin: 0 0 16px;
  color: #dae2fd;
  font-size: 40px;
  font-weight: 700;
  line-height: 1.18;
  letter-spacing: 0;

  @media (max-width: 560px) {
    font-size: 30px;
    line-height: 1.24;
  }
`;

export const Message = styled.p`
  max-width: 400px;
  margin: 0 auto 48px;
  color: #cfc2d6;
  font-size: 18px;
  font-weight: 400;
  line-height: 28px;

  @media (max-width: 560px) {
    margin-bottom: 34px;
    font-size: 16px;
    line-height: 25px;
  }
`;

export const BenefitNotice = styled.div`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  max-width: 100%;
  margin-bottom: 48px;
  padding: 16px 24px;
  border: 1px solid rgba(255, 176, 205, 0.2);
  border-radius: 999px;
  background: rgba(255, 176, 205, 0.1);
  color: #ffb0cd;

  svg {
    flex: 0 0 auto;
    width: 20px;
    height: 20px;
  }

  @media (max-width: 560px) {
    align-items: flex-start;
    margin-bottom: 34px;
    padding: 14px 18px;
    border-radius: 20px;
  }
`;

export const BenefitText = styled.span`
  font-size: 14px;
  font-weight: 600;
  line-height: 20px;
  letter-spacing: 0;
`;

export const ActionButton = styled.button`
  width: 100%;
  min-height: 64px;
  padding: 16px 24px;
  border: 0;
  border-radius: 12px;
  color: #490080;
  background: linear-gradient(90deg, #ddb7ff, #ffb0cd);
  box-shadow: 0 8px 24px rgba(221, 183, 255, 0.3);
  font-size: 24px;
  font-weight: 600;
  line-height: 32px;
  cursor: pointer;
  transition:
    transform 180ms ease,
    box-shadow 180ms ease;

  &:hover {
    transform: scale(1.02);
    box-shadow:
      0 8px 24px rgba(221, 183, 255, 0.3),
      0 0 22px rgba(255, 176, 205, 0.26);
  }

  &:active {
    transform: scale(0.95);
  }

  @media (max-width: 560px) {
    min-height: 58px;
    font-size: 20px;
    line-height: 28px;
  }
`;
