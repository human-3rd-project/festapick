import styled, { keyframes } from "styled-components";

const fadeUp = keyframes`
  from {
    opacity: 0;
    transform: translateY(16px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const float = keyframes`
  0%, 100% {
    transform: translateY(0);
  }

  50% {
    transform: translateY(-10px);
  }
`;

export const PageFrame = styled.div`
  min-height: 100vh;
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
`;

export const MainCanvas = styled.main`
  position: relative;
  min-height: 100vh;
  margin-left: 256px;
  overflow: hidden;
  background: #0b1326;

  &::before,
  &::after {
    content: "";
    position: absolute;
    pointer-events: none;
    border-radius: 999px;
  }

  &::before {
    top: -160px;
    right: -160px;
    width: 384px;
    height: 384px;
    background: rgba(221, 183, 255, 0.1);
    filter: blur(120px);
  }

  &::after {
    bottom: -160px;
    left: -160px;
    width: 384px;
    height: 384px;
    background: rgba(255, 176, 205, 0.1);
    filter: blur(120px);
  }

  @media (max-width: 768px) {
    margin-left: 0;
  }
`;

export const ContentArea = styled.section`
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  gap: 24px;
  width: 100%;
  max-width: 1280px;
  min-height: 100vh;
  margin: 0 auto;
  padding: 48px 24px 24px;
  animation: ${fadeUp} 650ms ease both;

  ${({ $isEmpty }) =>
    $isEmpty &&
    `
      max-width: none;
      padding: 40px;
    `}

  @media (max-width: 1024px) {
    padding: 32px 24px;
  }

  @media (max-width: 560px) {
    padding: 24px 16px;
  }
`;

export const PageHeader = styled.div`
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 24px;
  width: 100%;

  @media (max-width: 860px) {
    align-items: stretch;
    flex-direction: column;
  }
`;

export const HeaderCopy = styled.div`
  min-width: 0;
`;

export const PageTitle = styled.h1`
  margin: 0;
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

export const PageSubtitle = styled.p`
  max-width: 720px;
  margin: 8px 0 0;
  color: #cfc2d6;
  font-size: 16px;
  font-weight: 400;
  line-height: 24px;
`;

export const HeaderActions = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  flex-wrap: nowrap;
  justify-content: flex-end;

  @media (max-width: 980px) {
    flex-wrap: wrap;
  }

  @media (max-width: 560px) {
    flex-direction: column;
    align-items: stretch;
    justify-content: flex-start;
  }
`;

export const SearchBox = styled.label`
  position: relative;
  display: block;
  flex: 0 0 256px;
  width: 256px;

  @media (max-width: 560px) {
    flex-basis: auto;
    width: 100%;
  }
`;

export const SearchIcon = styled.span`
  position: absolute;
  top: 50%;
  left: 12px;
  display: flex;
  color: #cfc2d6;
  transform: translateY(-50%);

  svg {
    width: 20px;
    height: 20px;
  }
`;

export const SearchInput = styled.input`
  width: 100%;
  min-height: 42px;
  padding: 8px 16px 8px 40px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  outline: 0;
  color: #dae2fd;
  background: #131b2e;
  font-size: 16px;
  line-height: 24px;
  transition:
    border-color 180ms ease,
    box-shadow 180ms ease;

  &::placeholder {
    color: rgba(207, 194, 214, 0.7);
  }

  &:focus {
    border-color: #ddb7ff;
    box-shadow: 0 0 0 1px #ddb7ff;
  }
`;

export const StatPill = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  min-height: 42px;
  padding: 8px 16px;
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 8px;
  background: #131b2e;
  white-space: nowrap;

  strong {
    color: #ddb7ff;
    font-weight: 700;
  }

  span {
    color: #cfc2d6;
    font-size: 12px;
    font-weight: 500;
    line-height: 16px;
  }
`;

export const TextButton = styled.button`
  min-height: 42px;
  padding: 8px 16px;
  border: 1px solid rgba(221, 183, 255, 0.25);
  border-radius: 8px;
  color: #ddb7ff;
  background: rgba(221, 183, 255, 0.08);
  font-size: 14px;
  font-weight: 700;
  line-height: 20px;
  white-space: nowrap;
  cursor: pointer;
  transition:
    background-color 160ms ease,
    border-color 160ms ease,
    transform 160ms ease;

  &:hover {
    border-color: rgba(221, 183, 255, 0.45);
    background: rgba(221, 183, 255, 0.14);
  }

  &:active {
    transform: scale(0.98);
  }
`;

export const TableCard = styled.section`
  position: relative;
  z-index: 1;
  display: flex;
  flex: 1;
  flex-direction: column;
  width: 100%;
  min-height: calc(100vh - 172px);
  overflow: visible;
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 16px;
  background: rgba(23, 31, 51, 0.7);
  box-shadow: 0 24px 48px rgba(0, 0, 0, 0.34);
  backdrop-filter: blur(16px);
`;

export const TableScroll = styled.div`
  flex: 1;
  overflow-x: auto;
  overflow-y: visible;
`;

export const Table = styled.table`
  width: 100%;
  min-width: 960px;
  border-collapse: collapse;
  text-align: left;

  th,
  td {
    padding: 20px 32px;
    vertical-align: middle;
  }

  thead tr {
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    background: rgba(255, 255, 255, 0.05);
  }

  th {
    color: #ddb7ff;
    font-size: 14px;
    font-weight: 600;
    line-height: 20px;
    letter-spacing: 0.05em;
    text-transform: uppercase;
  }

  td {
    color: #cfc2d6;
    font-size: 14px;
    font-weight: 600;
    line-height: 20px;
    border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  }

  tbody tr {
    transition:
      background-color 160ms ease,
      opacity 220ms ease,
      transform 220ms ease;
  }

  tbody tr:hover {
    background: rgba(255, 255, 255, 0.02);
  }

  th:nth-child(3),
  td:nth-child(3),
  th:nth-child(5),
  td:nth-child(5),
  th:last-child,
  td:last-child {
    text-align: center;
  }
`;

export const ReviewerIdentity = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
`;

export const ReviewerAvatar = styled.div`
  display: flex;
  flex-shrink: 0;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 999px;
  color: ${({ $tone }) => {
    if ($tone === 1) return "#ffb0cd";
    if ($tone === 2) return "#ffb690";
    if ($tone === 3) return "#cfc2d6";
    return "#ddb7ff";
  }};
  background: ${({ $tone }) => {
    if ($tone === 1) return "rgba(170, 2, 102, 0.3)";
    if ($tone === 2) return "rgba(236, 106, 6, 0.3)";
    if ($tone === 3) return "rgba(255, 255, 255, 0.1)";
    return "rgba(183, 109, 255, 0.3)";
  }};
  font-size: 13px;
  font-weight: 800;

  img {
    display: block;
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

export const ReviewerName = styled.p`
  margin: 0;
  color: #dae2fd;
  font-size: 14px;
  font-weight: 700;
  line-height: 20px;
`;

export const ReviewerMeta = styled.p`
  margin: 2px 0 0;
  color: rgba(207, 194, 214, 0.7);
  font-size: 13px;
  font-weight: 500;
  line-height: 18px;
`;

export const RatingStars = styled.div`
  display: inline-flex;
  justify-content: center;
  gap: 2px;
  color: #ffb0cd;

  svg {
    width: 18px;
    height: 18px;
    stroke-width: 1.8;
  }

  svg[data-filled="true"] {
    fill: currentColor;
  }

  svg[data-filled="false"] {
    opacity: 0.45;
  }
`;

export const ReviewContent = styled.p`
  display: -webkit-box;
  max-width: 320px;
  margin: 0;
  overflow: hidden;
  color: #cfc2d6;
  font-size: 16px;
  font-weight: 400;
  line-height: 24px;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
`;

export const ActionCell = styled.div`
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;

  > button:first-child {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 36px;
    height: 36px;
    padding: 0;
    border: 0;
    border-radius: 8px;
    color: #cfc2d6;
    background: transparent;
    cursor: pointer;
    transition:
      color 160ms ease,
      background-color 160ms ease;

    svg {
      width: 20px;
      height: 20px;
    }

    &:hover {
      color: #ffb4ab;
      background: rgba(255, 255, 255, 0.05);
    }
  }
`;

export const ConfirmDelete = styled.button`
  position: fixed;
  top: ${({ $top }) => `${$top}px`};
  left: ${({ $left }) => `${$left}px`};
  z-index: 1000;
  width: 128px;
  padding: 10px 12px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  color: #ffb4ab;
  background: #2d3449;
  box-shadow: 0 18px 32px rgba(0, 0, 0, 0.35);
  font-size: 12px;
  font-weight: 700;
  line-height: 16px;
  text-align: left;
  cursor: pointer;

  &:hover {
    background: rgba(255, 180, 171, 0.12);
  }
`;

export const EmptyState = styled.section`
  display: flex;
  flex: 1;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 48px;
  text-align: center;

  @media (max-width: 560px) {
    padding: 32px 0;
  }
`;

export const EmptyIconCard = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 128px;
  height: 128px;
  margin-bottom: 24px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 24px;
  background: #222a3d;
  box-shadow: 0 24px 48px rgba(0, 0, 0, 0.34);
  animation: ${float} 4s ease-in-out infinite;

  > svg {
    position: relative;
    z-index: 1;
    width: 64px;
    height: 64px;
    color: rgba(221, 183, 255, 0.4);
    stroke-width: 1.3;
  }
`;

export const EmptyGlow = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  width: 192px;
  height: 192px;
  border-radius: 999px;
  background: linear-gradient(
    135deg,
    rgba(221, 183, 255, 0.2),
    rgba(255, 176, 205, 0.2)
  );
  filter: blur(32px);
  transform: translate(-50%, -50%);
`;

export const EmptyBadge = styled.div`
  position: absolute;
  right: -8px;
  bottom: -8px;
  z-index: 2;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  border: 2px solid #0b1326;
  border-radius: 999px;
  color: #ffffff;
  background: #aa0266;
  box-shadow: 0 14px 24px rgba(0, 0, 0, 0.24);

  svg {
    width: 22px;
    height: 22px;
  }
`;

export const EmptyCopy = styled.div`
  position: relative;
  z-index: 1;

  p {
    max-width: 384px;
    margin: 8px auto 0;
    color: #cfc2d6;
    font-size: 16px;
    font-weight: 400;
    line-height: 24px;
  }
`;

export const EmptyTitle = styled.h2`
  margin: 0;
  color: #dae2fd;
  font-size: 24px;
  font-weight: 600;
  line-height: 32px;
  letter-spacing: 0;
`;
