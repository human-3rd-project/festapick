import styled, { keyframes } from "styled-components";

const pulse = keyframes`
  0%, 100% {
    opacity: 1;
    transform: scale(1);
  }

  50% {
    opacity: 0.72;
    transform: scale(1.04);
  }
`;

const colors = {
  background: "#0b1326",
  surface: "#111a2d",
  surfaceLow: "#171f33",
  surfaceHigh: "#222a3d",
  primary: "#ddb7ff",
  primaryStrong: "#b76dff",
  secondary: "#ffb0cd",
  onSurface: "#dae2fd",
  muted: "#9fa6ba",
  softText: "#cfc2d6",
  onPrimary: "#400071",
};

export const PageContainer = styled.main`
  min-height: 100vh;
  padding: 110px 24px 84px;
  background:
    radial-gradient(circle at 14% 22%, rgba(183, 109, 255, 0.16), transparent 30%),
    radial-gradient(circle at 84% 18%, rgba(255, 176, 205, 0.1), transparent 28%),
    ${colors.background};
  color: ${colors.onSurface};
  font-family: "Plus Jakarta Sans", "Pretendard", "Noto Sans KR", sans-serif;

  @media (max-width: 640px) {
    padding: 88px 16px 64px;
  }
`;

export const PageHeader = styled.section`
  max-width: 860px;
  margin: 0 auto 38px;
  text-align: center;

  h1 {
    margin: 0 0 10px;
    color: #ffffff;
    font-size: 32px;
    line-height: 1.25;
    font-weight: 800;
    letter-spacing: 0;
  }

  p {
    margin: 0;
    color: ${colors.muted};
    font-size: 16px;
    line-height: 1.55;
    font-weight: 500;
  }
`;

export const FormShell = styled.form`
  max-width: 1024px;
  margin: 0 auto;
  padding: 14px;
  border-radius: 12px;
  border: 1px solid rgba(221, 183, 255, 0.18);
  background: rgba(255, 255, 255, 0.045);
  backdrop-filter: blur(16px);
  box-shadow:
    0 0 34px rgba(183, 109, 255, 0.2),
    inset 0 0 0 1px rgba(255, 255, 255, 0.025);
`;

export const InputRow = styled.div`
  min-height: 56px;
  border-radius: 10px;
  border: 1px solid rgba(255, 255, 255, 0.07);
  padding: 0 12px 0 16px;
  display: grid;
  grid-template-columns: 30px minmax(0, 1fr) 42px;
  align-items: center;
  gap: 12px;
  background: rgba(17, 26, 45, 0.84);
  transition: border-color 180ms ease;

  &:focus-within {
    border-color: rgba(221, 183, 255, 0.42);
  }
`;

export const InputIcon = styled.span`
  display: grid;
  place-items: center;
  color: ${colors.primary};
`;

export const Input = styled.input`
  min-width: 0;
  border: 0;
  outline: 0;
  background: transparent;
  color: ${colors.onSurface};
  font-size: 16px;
  line-height: 24px;
  font-weight: 500;
  letter-spacing: 0;

  &::placeholder {
    color: rgba(159, 166, 186, 0.48);
  }
`;

export const SendButton = styled.button`
  width: 40px;
  height: 40px;
  border: 0;
  border-radius: 9px;
  display: grid;
  place-items: center;
  background: linear-gradient(135deg, ${colors.primaryStrong} 0%, #d728c4 100%);
  color: #ffffff;
  box-shadow: 0 10px 24px rgba(183, 109, 255, 0.28);
  cursor: pointer;
  transition:
    transform 180ms ease,
    filter 180ms ease;

  &:hover {
    filter: brightness(1.08);
  }

  &:active {
    transform: scale(0.92);
  }
`;

export const QuickButtons = styled.div`
  max-width: 1024px;
  margin: 24px auto 0;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 10px;
`;

export const QuickButton = styled.button`
  min-height: 32px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 999px;
  padding: 0 18px;
  background: rgba(255, 255, 255, 0.045);
  color: ${colors.softText};
  font-size: 14px;
  line-height: 20px;
  font-weight: 650;
  letter-spacing: 0;
  cursor: pointer;
  transition:
    border-color 180ms ease,
    color 180ms ease,
    box-shadow 180ms ease;

  &:hover {
    border-color: rgba(221, 183, 255, 0.45);
    color: ${colors.primary};
    box-shadow: 0 0 18px rgba(183, 109, 255, 0.18);
  }
`;

export const EmptyState = styled.section`
  max-width: 780px;
  margin: 78px auto 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;

  h2 {
    margin: 24px 0 12px;
    color: ${colors.onSurface};
    font-size: 17px;
    line-height: 1.45;
    font-weight: 700;
    letter-spacing: 0;
  }

  > p {
    margin: 0;
    color: ${colors.softText};
    font-size: 15px;
    line-height: 1.6;
    font-weight: 500;
  }

  @media (max-width: 640px) {
    margin-top: 56px;
  }
`;

export const EmptyIcon = styled.div`
  width: 96px;
  height: 96px;
  border-radius: 999px;
  display: grid;
  place-items: center;
  background: linear-gradient(135deg, #f5b2df 0%, ${colors.primary} 100%);
  color: ${colors.onPrimary};
  box-shadow: 0 20px 55px rgba(221, 183, 255, 0.18);
  animation: ${pulse} 3s ease-in-out infinite;
`;

export const EmptyGrid = styled.div`
  width: 100%;
  margin-top: 46px;
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 24px 34px;

  @media (max-width: 700px) {
    grid-template-columns: 1fr;
    gap: 14px;
  }
`;

export const EmptyCard = styled.button`
  min-height: 112px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 10px;
  padding: 24px;
  display: grid;
  grid-template-columns: 36px minmax(0, 1fr);
  align-items: flex-start;
  gap: 18px;
  background: rgba(255, 255, 255, 0.035);
  color: ${colors.onSurface};
  text-align: left;
  cursor: pointer;
  transition:
    transform 180ms ease,
    border-color 180ms ease,
    background 180ms ease;

  strong {
    display: block;
    color: ${colors.onSurface};
    font-size: 16px;
    line-height: 1.45;
    font-weight: 650;
    letter-spacing: 0;
  }

  &:hover {
    transform: translateY(-2px);
    border-color: rgba(221, 183, 255, 0.28);
    background: rgba(255, 255, 255, 0.055);
  }
`;

export const EmptyCardIcon = styled.span`
  width: 32px;
  height: 32px;
  border-radius: 8px;
  display: grid;
  place-items: center;
  background: rgba(221, 183, 255, 0.2);
  color: ${colors.primary};
`;

export const ExampleMeta = styled.span`
  display: block;
  margin-top: 4px;
  color: rgba(159, 166, 186, 0.72);
  font-size: 12px;
  line-height: 16px;
  font-weight: 500;
`;

export const ChatArea = styled.section`
  max-width: 1024px;
  margin: 48px auto 0;
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

export const UserMessage = styled.div`
  display: flex;
  justify-content: flex-end;
`;

export const ResultGroup = styled.div`
  display: grid;
  grid-template-columns: 42px minmax(0, 1fr);
  gap: 16px;

  @media (max-width: 560px) {
    grid-template-columns: 1fr;
  }
`;

export const AiAvatar = styled.div`
  width: 42px;
  height: 42px;
  border-radius: 999px;
  display: grid;
  place-items: center;
  background: linear-gradient(135deg, ${colors.primaryStrong} 0%, #aa0266 100%);
  color: #ffffff;
  box-shadow: 0 12px 30px rgba(183, 109, 255, 0.22);
`;

export const ChatBubble = styled.div`
  max-width: ${({ $type }) => ($type === "user" ? "80%" : "100%")};
  border-radius: ${({ $type }) =>
    $type === "user" ? "18px 18px 4px 18px" : "4px 18px 18px 18px"};
  padding: 16px;
  background: ${({ $type }) =>
    $type === "user" ? "rgba(183, 109, 255, 0.32)" : "rgba(255, 255, 255, 0.055)"};
  border: ${({ $type }) =>
    $type === "user" ? "1px solid rgba(221, 183, 255, 0.2)" : "1px solid rgba(255, 255, 255, 0.1)"};
  color: ${colors.onSurface};
  font-size: 16px;
  line-height: 1.55;
  font-weight: 500;
  backdrop-filter: blur(16px);

  @media (max-width: 560px) {
    max-width: 100%;
  }
`;

export const RecommendationGrid = styled.div`
  margin-top: 16px;
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 24px;

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
  }
`;

export const FestivalCard = styled.article`
  overflow: hidden;
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  background: rgba(255, 255, 255, 0.052);
  backdrop-filter: blur(16px);
  transition: transform 220ms ease;

  &:hover {
    transform: translateY(-6px);
  }
`;

export const FestivalImage = styled.img`
  width: 100%;
  height: 160px;
  display: block;
  object-fit: cover;
  background: ${colors.surfaceLow};
`;

export const FestivalInfo = styled.div`
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 12px;

  h3 {
    margin: 0;
    color: ${colors.onSurface};
    font-size: 20px;
    line-height: 1.35;
    font-weight: 750;
    letter-spacing: 0;
  }

  > a {
    min-height: 40px;
    border-radius: 8px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    background: linear-gradient(135deg, ${colors.primaryStrong} 0%, #aa0266 100%);
    color: #ffffff;
    font-size: 14px;
    line-height: 20px;
    font-weight: 800;
    letter-spacing: 0;
    text-decoration: none;
    transition: filter 180ms ease;
  }

  > a:hover {
    filter: brightness(1.08);
  }
`;

export const FestivalMeta = styled.div`
  display: flex;
  flex-direction: column;
  gap: 5px;
  color: ${colors.softText};
  font-size: 13px;
  line-height: 18px;
  font-weight: 600;

  span {
    display: inline-flex;
    align-items: center;
    gap: 6px;
  }
`;

export const FestivalReason = styled.div`
  border-radius: 10px;
  border: 1px solid rgba(221, 183, 255, 0.18);
  padding: 10px;
  background: rgba(45, 52, 73, 0.34);

  strong {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    margin-bottom: 5px;
    color: ${colors.primary};
    font-size: 13px;
    line-height: 18px;
    font-weight: 800;
  }

  p {
    margin: 0;
    color: ${colors.softText};
    font-size: 12px;
    line-height: 1.55;
    font-weight: 500;
  }
`;
