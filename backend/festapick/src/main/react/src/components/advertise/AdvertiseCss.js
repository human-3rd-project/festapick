import styled, { keyframes } from "styled-components";

const floatModal = keyframes`
  0%, 100% {
    transform: translateY(0);
  }

  50% {
    transform: translateY(-10px);
  }
`;

export const AdvertisePosition = styled.aside`
  position: fixed;
  right: 16px;
  bottom: 16px;
  z-index: 50;
  width: min(180px, calc(100vw - 32px));
  color: #dae2fd;
  font-family:
    "Plus Jakarta Sans",
    "Pretendard",
    "Apple SD Gothic Neo",
    sans-serif;
  animation: ${floatModal} 4s ease-in-out infinite;

  * {
    box-sizing: border-box;
  }

  &:hover {
    animation-play-state: paused;
  }

  @media (min-width: 768px) {
    right: 40px;
    bottom: 40px;
    width: 200px;
  }

  @media (prefers-reduced-motion: reduce) {
    animation: none;
  }
`;

export const AdvertiseCard = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  background: rgba(23, 31, 51, 0.72);
  box-shadow: 0 0 25px 2px rgba(221, 183, 255, 0.3);
  backdrop-filter: blur(20px);

  &::after {
    content: "";
    position: absolute;
    inset: 0;
    pointer-events: none;
    border: 1px solid rgba(255, 255, 255, 0.05);
    border-radius: 12px;
    box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.1);
  }
`;

export const CloseButton = styled.button`
  position: absolute;
  top: 8px;
  right: 8px;
  z-index: 2;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 26px;
  height: 26px;
  padding: 0;
  border: 0;
  border-radius: 999px;
  color: #dae2fd;
  background: rgba(45, 52, 73, 0.5);
  backdrop-filter: blur(12px);
  cursor: pointer;
  transition:
    color 180ms ease,
    background-color 180ms ease,
    transform 180ms ease;

  svg {
    width: 16px;
    height: 16px;
  }

  &:hover {
    color: #400071;
    background: #b76dff;
  }

  &:active {
    transform: scale(0.94);
  }
`;

export const AdBadge = styled.div`
  position: absolute;
  top: 8px;
  left: 8px;
  z-index: 2;
  padding: 3px 6px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 4px;
  color: #ffffff;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(12px);
  font-size: 10px;
  font-weight: 600;
  line-height: 12px;
  letter-spacing: 0;
`;

export const VisualArea = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 170px;
  overflow: hidden;
  background:
    radial-gradient(circle at 28% 22%, rgba(255, 176, 205, 0.55), transparent 27%),
    radial-gradient(circle at 78% 12%, rgba(221, 183, 255, 0.55), transparent 26%),
    linear-gradient(145deg, #131b2e 0%, #2d3449 44%, #0b1326 100%);

  &::before {
    content: "";
    position: absolute;
    inset: 0;
    background:
      linear-gradient(115deg, transparent 0 24%, rgba(255, 255, 255, 0.08) 24% 25%, transparent 25% 52%, rgba(255, 255, 255, 0.08) 52% 53%, transparent 53%),
      radial-gradient(circle at 50% 102%, rgba(236, 106, 6, 0.32), transparent 46%);
  }

  &::after {
    content: "";
    position: absolute;
    inset: 0;
    background: linear-gradient(to top, #0b1326 0%, rgba(11, 19, 38, 0.2) 52%, transparent 100%);
  }

  @media (min-width: 768px) {
    height: 190px;
  }
`;

export const VisualMark = styled.div`
  position: relative;
  z-index: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 64px;
  height: 64px;
  border: 1px solid rgba(255, 255, 255, 0.18);
  border-radius: 18px;
  color: #2c0051;
  background: linear-gradient(135deg, #ddb7ff 0%, #ffb0cd 100%);
  box-shadow:
    0 18px 40px rgba(0, 0, 0, 0.28),
    0 0 34px rgba(221, 183, 255, 0.42);

  svg {
    width: 34px;
    height: 34px;
    stroke-width: 2.2;
  }
`;

export const ContentArea = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding: 10px;
`;

export const CopyGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

export const Title = styled.h3`
  margin: 0;
  color: #ddb7ff;
  font-size: 16px;
  font-weight: 700;
  line-height: 22px;
  letter-spacing: 0;
`;

export const Description = styled.p`
  display: -webkit-box;
  overflow: hidden;
  margin: 0;
  color: #cfc2d6;
  font-size: 12px;
  font-weight: 400;
  line-height: 17px;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
`;

export const CtaButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  min-height: 34px;
  margin-top: 4px;
  padding: 8px 10px;
  border: 0;
  border-radius: 8px;
  color: #2c0051;
  background: linear-gradient(90deg, #ddb7ff 0%, #ffb0cd 100%);
  box-shadow: 0 4px 15px rgba(221, 183, 255, 0.4);
  font-size: 12px;
  font-weight: 600;
  line-height: 16px;
  letter-spacing: 0.03em;
  cursor: pointer;
  transition:
    filter 180ms ease,
    transform 180ms ease;

  &:hover {
    filter: brightness(1.1);
  }

  &:active {
    transform: scale(0.95);
  }
`;
