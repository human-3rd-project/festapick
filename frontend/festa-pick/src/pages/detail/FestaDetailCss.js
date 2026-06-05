import styled, { keyframes } from "styled-components";

const pulse = keyframes`
  0%, 100% {
    opacity: 0.55;
    transform: scale(0.92);
  }

  50% {
    opacity: 1;
    transform: scale(1);
  }
`;

const marquee = keyframes`
  0% {
    transform: translateX(100%);
  }

  100% {
    transform: translateX(-100%);
  }
`;

const slideUp = keyframes`
  from {
    opacity: 0;
    transform: translateY(24px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

export const Page = styled.main`
  min-height: 100vh;
  padding-bottom: 64px;
  background:
    radial-gradient(circle at 14% 8%, rgba(221, 183, 255, 0.12), transparent 28%),
    radial-gradient(circle at 88% 34%, rgba(255, 176, 205, 0.1), transparent 30%),
    #0b1326;
  color: #dae2fd;
`;

export const Hero = styled.section`
  position: relative;
  min-height: 512px;
  overflow: hidden;

  @media (max-width: 680px) {
    min-height: 470px;
  }
`;

export const HeroImage = styled.img`
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

export const HeroOverlay = styled.div`
  position: absolute;
  inset: 0;
  background:
    linear-gradient(180deg, rgba(11, 19, 38, 0.08) 0%, rgba(11, 19, 38, 0.92) 100%),
    linear-gradient(90deg, rgba(6, 14, 32, 0.76), rgba(6, 14, 32, 0.08));
`;

export const HeroContent = styled.div`
  position: absolute;
  right: 0;
  bottom: 0;
  left: 0;
  width: min(920px, calc(100% - 32px));
  margin: 0 auto;
  padding: 0 0 28px;
`;

export const TagRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 12px;
`;

export const Badge = styled.span`
  display: inline-flex;
  align-items: center;
  width: fit-content;
  gap: 6px;
  padding: ${({ $variant }) => ($variant === "mine" ? "4px 10px" : "5px 10px")};
  border: 1px solid
    ${({ $variant }) =>
      $variant === "live"
        ? "rgba(239, 68, 68, 0.34)"
        : $variant === "muted"
          ? "rgba(255, 176, 205, 0.3)"
          : "rgba(221, 183, 255, 0.32)"};
  border-radius: ${({ $variant }) => ($variant === "mine" ? "0 0 8px 0" : "999px")};
  background:
    ${({ $variant }) =>
      $variant === "live"
        ? "rgba(239, 68, 68, 0.18)"
        : $variant === "muted"
          ? "rgba(255, 176, 205, 0.14)"
          : "rgba(221, 183, 255, 0.16)"};
  color:
    ${({ $variant }) =>
      $variant === "live" ? "#f87171" : $variant === "muted" ? "#ffb0cd" : "#ddb7ff"};
  font-size: 12px;
  font-weight: 700;
  line-height: 16px;
`;

export const LiveDot = styled.span`
  display: inline-block;
  width: 7px;
  height: 7px;
  flex: 0 0 auto;
  border-radius: 999px;
  background: currentColor;
  box-shadow: 0 0 12px currentColor;
  animation: ${pulse} 1.7s infinite;
`;

export const Title = styled.h1`
  max-width: 720px;
  margin: 0;
  color: #ffffff;
  font-size: 40px;
  font-weight: 800;
  line-height: 48px;
  letter-spacing: 0;

  @media (max-width: 680px) {
    font-size: 30px;
    line-height: 38px;
  }
`;

export const HeroActions = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 18px;

  @media (max-width: 680px) {
    gap: 6px;
  }
`;

export const ActionButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 42px;
  gap: 8px;
  padding: 10px 14px;
  border: 1px solid
    ${({ $active }) =>
      $active ? "rgba(221, 183, 255, 0.58)" : "rgba(255, 255, 255, 0.1)"};
  border-radius: 999px;
  background: ${({ $active }) =>
    $active ? "rgba(221, 183, 255, 0.18)" : "rgba(23, 31, 51, 0.64)"};
  color: ${({ $active }) => ($active ? "#ddb7ff" : "#dae2fd")};
  cursor: pointer;
  font: inherit;
  font-size: 13px;
  font-weight: 700;
  backdrop-filter: blur(16px);
  transition: border-color 160ms ease, background-color 160ms ease, transform 160ms ease;

  svg {
    color: currentColor;
  }

  &:hover {
    border-color: rgba(221, 183, 255, 0.38);
    background: rgba(221, 183, 255, 0.12);
    transform: translateY(-1px);
  }
`;

export const AiMarquee = styled.div`
  display: flex;
  align-items: center;
  min-height: 40px;
  margin-top: 22px;
  overflow: hidden;
  border-block: 1px solid rgba(221, 183, 255, 0.22);
  background: ${({ $disabled }) =>
    $disabled ? "rgba(45, 52, 73, 0.28)" : "rgba(221, 183, 255, 0.1)"};
  color: ${({ $disabled }) => ($disabled ? "rgba(207, 194, 214, 0.56)" : "#ddb7ff")};
  font-size: 14px;
  font-weight: 700;
  line-height: 20px;

  > span {
    width: 100%;
    text-align: center;
  }
`;

export const AiMarqueeContent = styled.div`
  display: inline-block;
  min-width: max-content;
  white-space: nowrap;
  animation: ${marquee} 24s linear infinite;
`;

export const BodyGrid = styled.div`
  display: block;
  width: min(920px, calc(100% - 32px));
  margin: 32px auto 0;

  @media (max-width: 860px) {
    width: min(100% - 32px, 760px);
    margin-top: 24px;
  }
`;

export const MainColumn = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  gap: 52px;
  min-width: 0;
  margin: 0 auto;
`;

export const Sidebar = styled.aside`
  min-width: 0;
`;

export const SidebarSticky = styled.div`
  position: sticky;
  top: 96px;
  display: flex;
  flex-direction: column;
  gap: 18px;
`;

export const InfoGrid = styled.section`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 24px;
  padding: 28px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 12px;
  background: rgba(23, 31, 51, 0.7);
  backdrop-filter: blur(16px);

  @media (max-width: 620px) {
    grid-template-columns: 1fr;
  }
`;

export const InfoLabel = styled.p`
  margin: 0 0 6px;
  color: #cfc2d6;
  font-size: 12px;
  font-weight: 700;
  line-height: 16px;
  text-transform: uppercase;
`;

export const InfoValue = styled.p`
  margin: 0;
  color: #dae2fd;
  font-size: 22px;
  font-weight: 800;
  line-height: 30px;
`;

export const MetaText = styled.p`
  margin: 4px 0 0;
  color: rgba(207, 194, 214, 0.78);
  font-size: 14px;
  line-height: 21px;
`;

export const Section = styled.section`
  min-width: 0;
`;

export const SectionTitle = styled.h2`
  display: flex;
  align-items: center;
  gap: 10px;
  margin: 0 0 16px;
  color: #dae2fd;
  font-size: 24px;
  font-weight: 800;
  line-height: 32px;
  letter-spacing: 0;

  &::before {
    display: block;
    width: 4px;
    height: 25px;
    border-radius: 999px;
    background: ${({ $tone }) =>
      $tone === "secondary" ? "#ffb0cd" : $tone === "tertiary" ? "#ffb690" : "#ddb7ff"};
    content: "";
  }
`;

export const DetailText = styled.div`
  display: flex;
  flex-direction: column;
  gap: 14px;
  color: #cfc2d6;
  font-size: 17px;
  line-height: 28px;

  p {
    margin: 0;
  }
`;

export const MapCanvas = styled.div`
  position: relative;
  min-height: ${({ $disabled }) => ($disabled ? "320px" : "400px")};
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  background:
    linear-gradient(rgba(11, 19, 38, 0.24), rgba(11, 19, 38, 0.42)),
    url("https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&w=1200&q=80")
      center / cover;
  filter: ${({ $disabled }) => ($disabled ? "grayscale(1)" : "none")};
`;

export const MapPinBadge = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  color: #ddb7ff;
  transform: translate(-50%, -50%);

  svg {
    filter: drop-shadow(0 0 18px rgba(221, 183, 255, 0.72));
  }

  span {
    padding: 7px 12px;
    border: 1px solid rgba(221, 183, 255, 0.32);
    border-radius: 8px;
    background: rgba(34, 42, 61, 0.84);
    color: #ddb7ff;
    font-size: 12px;
    font-weight: 800;
    backdrop-filter: blur(14px);
  }
`;

export const MapControls = styled.div`
  position: absolute;
  right: 16px;
  bottom: 16px;
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

export const SmallIconButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 34px;
  height: 34px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  background: rgba(34, 42, 61, 0.78);
  color: #dae2fd;
  cursor: pointer;
  font: inherit;
  font-weight: 800;
  backdrop-filter: blur(12px);
  transition: background-color 160ms ease, color 160ms ease, transform 160ms ease;

  &:hover {
    background: rgba(45, 52, 73, 0.9);
    color: #ddb7ff;
  }

  &:active {
    transform: scale(0.94);
  }
`;

export const CtaButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: ${({ $compact }) => ($compact ? "auto" : "100%")};
  min-height: ${({ $compact }) => ($compact ? "38px" : "56px")};
  gap: 8px;
  padding: ${({ $compact }) => ($compact ? "8px 16px" : "14px 18px")};
  border: 0;
  border-radius: ${({ $compact }) => ($compact ? "999px" : "12px")};
  background: ${({ disabled }) => (disabled ? "#2d3449" : "#ddb7ff")};
  color: ${({ disabled }) => (disabled ? "rgba(207, 194, 214, 0.52)" : "#490080")};
  cursor: ${({ disabled }) => (disabled ? "not-allowed" : "pointer")};
  font: inherit;
  font-size: ${({ $compact }) => ($compact ? "13px" : "22px")};
  font-weight: 800;
  line-height: 28px;
  box-shadow: ${({ disabled }) =>
    disabled ? "none" : "0 16px 34px rgba(221, 183, 255, 0.24)"};
  transition: filter 160ms ease, transform 160ms ease;

  &:hover {
    filter: ${({ disabled }) => (disabled ? "none" : "brightness(1.06)")};
  }
`;

export const DisabledOverlay = styled.div`
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 24px;
  background: rgba(11, 19, 38, 0.62);
  color: #cfc2d6;
  text-align: center;
  backdrop-filter: blur(8px);

  svg {
    margin-bottom: 14px;
    color: #ffb4ab;
  }

  strong {
    color: #dae2fd;
    font-size: 22px;
    line-height: 30px;
  }

  span {
    margin-top: 6px;
    color: rgba(207, 194, 214, 0.72);
    font-size: 14px;
  }
`;

export const TextButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: fit-content;
  gap: 6px;
  margin-top: ${({ $danger }) => ($danger ? "0" : "12px")};
  padding: 0;
  border: 0;
  background: transparent;
  color: ${({ $danger }) => ($danger ? "#ffb4ab" : "#ddb7ff")};
  cursor: pointer;
  font: inherit;
  font-size: 14px;
  font-weight: 700;

  &:hover {
    text-decoration: underline;
  }
`;

export const ReviewHeader = styled.div`
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 16px;

  @media (max-width: 680px) {
    align-items: flex-start;
    flex-direction: column;
  }
`;

export const RatingLine = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ $small }) => ($small ? "4px" : "8px")};
  margin-top: ${({ $small }) => ($small ? "0" : "4px")};
  color: #ddb7ff;

  strong {
    font-size: 24px;
    line-height: 32px;
  }

  span {
    display: inline-flex;
    align-items: center;
  }

  em {
    color: rgba(207, 194, 214, 0.7);
    font-style: normal;
    font-size: 14px;
  }
`;

export const ReviewList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 14px;

  > ${TextButton}:last-child {
    align-self: center;
    margin-top: 6px;
  }
`;

export const ReviewCard = styled.article`
  position: relative;
  overflow: hidden;
  padding: ${({ $isMine }) => ($isMine ? "36px 16px 16px" : "16px")};
  border: 1px solid ${({ $isMine }) => ($isMine ? "rgba(221, 183, 255, 0.4)" : "rgba(255, 255, 255, 0.08)")};
  border-radius: 12px;
  background: rgba(23, 31, 51, 0.7);
  backdrop-filter: blur(16px);

  > ${Badge} {
    position: absolute;
    top: 0;
    left: 0;
    border-top: 0;
    border-left: 0;
    background: #ddb7ff;
    color: #490080;
  }

  p {
    margin: 12px 0 0;
    color: #cfc2d6;
    font-size: 15px;
    line-height: 24px;
  }
`;

export const ReviewActions = styled.div`
  display: flex;
  align-items: ${({ $right }) => ($right ? "center" : "flex-start")};
  justify-content: ${({ $right }) => ($right ? "flex-end" : "space-between")};
  gap: 14px;
  margin-top: ${({ $right }) => ($right ? "10px" : "0")};

  strong {
    color: #dae2fd;
    font-size: 14px;
  }

  > span {
    color: rgba(207, 194, 214, 0.58);
    font-size: 12px;
  }

  ${({ $right }) =>
    $right &&
    `
      ${TextButton} {
        margin-top: 0;
      }
    `}
`;

export const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 220px;
  padding: 48px 24px;
  border: 1px dashed rgba(255, 255, 255, 0.14);
  border-radius: 12px;
  background: rgba(23, 31, 51, 0.68);
  text-align: center;

  strong {
    margin-top: 14px;
    color: rgba(218, 226, 253, 0.78);
    font-size: 22px;
    line-height: 30px;
  }

  span {
    margin-top: 6px;
    color: rgba(207, 194, 214, 0.62);
    font-size: 14px;
  }
`;

export const EmptyIcon = styled.div`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 64px;
  height: 64px;
  border-radius: 999px;
  background: #2d3449;
  color: rgba(207, 194, 214, 0.5);
`;

export const ConfirmBackdrop = styled.div`
  position: fixed;
  inset: 0;
  z-index: 1200;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  background: rgba(6, 14, 32, 0.76);
  backdrop-filter: blur(6px);
`;

export const ConfirmDialog = styled.div`
  width: min(360px, 100%);
  padding: 24px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  background: rgba(23, 31, 51, 0.92);
  box-shadow: 0 24px 70px rgba(0, 0, 0, 0.42);
  color: #dae2fd;
  text-align: center;

  strong {
    display: block;
    font-size: 20px;
    font-weight: 800;
    line-height: 28px;
  }

  p {
    margin: 8px 0 0;
    color: rgba(207, 194, 214, 0.72);
    font-size: 14px;
    line-height: 22px;
  }
`;

export const ConfirmActions = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 10px;
  margin-top: 22px;
`;

export const ConfirmButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 44px;
  border: 1px solid
    ${({ $danger }) => ($danger ? "rgba(255, 180, 171, 0.38)" : "rgba(255, 255, 255, 0.1)")};
  border-radius: 999px;
  background: ${({ $danger }) => ($danger ? "rgba(147, 0, 10, 0.5)" : "#2d3449")};
  color: ${({ $danger }) => ($danger ? "#ffb4ab" : "#dae2fd")};
  cursor: pointer;
  font: inherit;
  font-size: 14px;
  font-weight: 800;
  transition: filter 160ms ease, transform 160ms ease;

  &:hover {
    filter: brightness(1.08);
  }

  &:active {
    transform: scale(0.96);
  }
`;

export const StatusCard = styled.div`
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 18px 16px;
  padding: 24px;
  border: 1px solid
    ${({ $disabled }) => ($disabled ? "rgba(221, 183, 255, 0.16)" : "rgba(221, 183, 255, 0.3)")};
  border-radius: 12px;
  background: rgba(23, 31, 51, 0.7);
  box-shadow: ${({ $disabled }) =>
    $disabled ? "none" : "0 0 20px rgba(221, 183, 255, 0.2)"};
  opacity: ${({ $disabled }) => ($disabled ? "0.72" : "1")};
  backdrop-filter: blur(16px);

  ${CtaButton} {
    grid-column: 1 / -1;
  }
`;

export const StatusIcon = styled.div`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 56px;
  height: 56px;
  border: 1px solid rgba(221, 183, 255, 0.2);
  border-radius: 12px;
  background: ${({ $disabled }) => ($disabled ? "#2d3449" : "rgba(221, 183, 255, 0.1)")};
  color: ${({ $disabled }) => ($disabled ? "#cfc2d6" : "#ddb7ff")};
`;

export const Card = styled.div`
  display: flex;
  grid-column: 1 / -1;
  justify-content: space-between;
  color: #cfc2d6;
  font-size: 14px;

  strong {
    color: #dae2fd;
  }
`;

export const ActionRow = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 8px;

  ${ActionButton} {
    flex-direction: column;
    min-height: 78px;
    border-radius: 12px;
  }

  @media (max-width: 680px) {
    grid-template-columns: 1fr;
  }
`;

export const FloatingTalk = styled.aside`
  position: fixed;
  right: 24px;
  bottom: 24px;
  z-index: 80;
  width: ${({ $expanded }) => ($expanded ? "320px" : "320px")};
  overflow: hidden;
  border: 1px solid rgba(221, 183, 255, 0.3);
  border-radius: 16px;
  background: rgba(23, 31, 51, 0.82);
  box-shadow: 0 24px 80px rgba(0, 0, 0, 0.38);
  backdrop-filter: blur(18px);
  animation: ${slideUp} 420ms ease-out;

  @media (max-width: 680px) {
    right: 16px;
    bottom: 16px;
    left: 16px;
    width: auto;
  }
`;

export const FloatingTalkHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 11px 12px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  background: rgba(221, 183, 255, 0.06);

  > span {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    color: #ddb7ff;
    font-size: 12px;
    font-weight: 800;
  }
`;

export const TalkControlGroup = styled.div`
  display: flex;
  gap: 5px;
`;

export const FloatingTalkPreview = styled.button`
  width: 100%;
  padding: 11px 12px 13px;
  border: 0;
  background: transparent;
  color: #dae2fd;
  cursor: pointer;
  text-align: left;
`;

export const TalkMiniLine = styled.span`
  display: block;
  overflow: hidden;
  color: #cfc2d6;
  font-size: 13px;
  line-height: 18px;
  text-overflow: ellipsis;
  white-space: nowrap;

  strong {
    margin-right: 8px;
    color: #ddb7ff;
  }
`;

export const FloatingTalkBody = styled.div`
  display: flex;
  flex-direction: column;
  max-height: 240px;
  gap: 10px;
  overflow-y: auto;
  padding: 12px;
  scrollbar-width: none;

  &::-webkit-scrollbar {
    display: none;
  }
`;

export const FloatingTalkMessage = styled.div`
  display: flex;
  flex-direction: column;
  align-items: ${({ $mine }) => ($mine ? "flex-end" : "flex-start")};
  gap: 4px;

  strong {
    color: #ddb7ff;
    font-size: 10px;
    font-weight: 800;
  }

  span {
    max-width: 88%;
    padding: 8px 10px;
    border-radius: ${({ $mine }) => ($mine ? "10px 0 10px 10px" : "0 10px 10px 10px")};
    background: ${({ $mine }) => ($mine ? "rgba(221, 183, 255, 0.18)" : "rgba(255, 255, 255, 0.06)")};
    color: #dae2fd;
    font-size: 12px;
    line-height: 17px;
  }
`;

export const TalkComposer = styled.form`
  position: relative;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  background: rgba(19, 27, 46, 0.78);
`;

export const FloatingTalkInput = styled.input`
  width: 100%;
  min-width: 0;
  height: 38px;
  padding: 0 12px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 10px;
  outline: 0;
  background: rgba(255, 255, 255, 0.06);
  color: #dae2fd;
  font: inherit;
  font-size: 13px;

  &:focus {
    border-color: rgba(221, 183, 255, 0.5);
  }

  &::placeholder {
    color: rgba(207, 194, 214, 0.58);
  }
`;
