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

const pulse = keyframes`
  0%, 100% {
    opacity: 0.55;
    transform: scale(0.95);
  }

  50% {
    opacity: 0.9;
    transform: scale(1.05);
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
    top: -11%;
    right: -5%;
    width: 600px;
    height: 600px;
    background: rgba(221, 183, 255, 0.1);
    filter: blur(120px);
  }

  &::after {
    bottom: -10%;
    left: -5%;
    width: 400px;
    height: 400px;
    background: rgba(255, 176, 205, 0.1);
    filter: blur(100px);
  }

  @media (max-width: 768px) {
    margin-left: 0;
  }
`;

export const ContentArea = styled.div`
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  flex: 1;
  gap: 24px;
  min-height: 100vh;
  padding: 48px;
  animation: ${fadeUp} 650ms ease both;

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
  max-width: 1280px;
  margin: 0 auto;

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
  justify-content: flex-end;
`;

export const PreviewControls = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  min-height: 42px;
  padding: 4px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 8px;
  background: rgba(19, 27, 46, 0.82);
  backdrop-filter: blur(12px);

  @media (max-width: 560px) {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    width: 100%;
  }
`;

export const PreviewButton = styled.button`
  min-height: 32px;
  padding: 6px 12px;
  border: 0;
  border-radius: 6px;
  color: ${({ $active }) => ($active ? "#490080" : "#cfc2d6")};
  background: ${({ $active }) => ($active ? "#ddb7ff" : "transparent")};
  box-shadow: ${({ $active }) =>
    $active ? "0 0 12px rgba(183, 109, 255, 0.35)" : "none"};
  font-size: 12px;
  font-weight: 700;
  line-height: 16px;
  white-space: nowrap;
  cursor: pointer;
  transition:
    background-color 160ms ease,
    color 160ms ease;

  &:hover {
    background: ${({ $active }) => ($active ? "#ddb7ff" : "rgba(255, 255, 255, 0.08)")};
  }
`;

export const TableCard = styled.section`
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 1280px;
  min-height: calc(100vh - 160px);
  margin: 0 auto;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  background: rgba(45, 52, 73, 0.4);
  box-shadow: 0 24px 48px rgba(0, 0, 0, 0.34);
  backdrop-filter: blur(16px);
`;

export const HeaderBar = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding: 16px 24px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  background: rgba(255, 255, 255, 0.05);

  h2 {
    margin: 0;
    color: #dae2fd;
    font-size: 24px;
    font-weight: 600;
    line-height: 32px;
    letter-spacing: 0;
  }

  @media (max-width: 640px) {
    align-items: stretch;
    flex-direction: column;
  }
`;

export const SearchBox = styled.label`
  position: relative;
  display: block;
  width: 256px;

  @media (max-width: 640px) {
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
  min-height: 40px;
  padding: 8px 16px 8px 40px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  outline: 0;
  color: #dae2fd;
  background: rgba(255, 255, 255, 0.05);
  font-size: 14px;
  font-weight: 600;
  line-height: 20px;
  transition:
    border-color 180ms ease,
    box-shadow 180ms ease;

  &::placeholder {
    color: rgba(207, 194, 214, 0.7);
  }

  &:focus {
    border-color: rgba(221, 183, 255, 0.65);
    box-shadow: 0 0 0 2px rgba(221, 183, 255, 0.22);
  }
`;

export const TableScroll = styled.div`
  flex: 1;
  overflow-x: auto;
`;

export const Table = styled.table`
  width: 100%;
  min-width: 920px;
  border-collapse: collapse;
  text-align: left;

  th,
  td {
    padding: 16px 24px;
  }

  thead tr {
    border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  }

  th {
    color: #cfc2d6;
    font-size: 14px;
    font-weight: 600;
    line-height: 20px;
    letter-spacing: 0.05em;
  }

  td {
    color: #cfc2d6;
    font-size: 14px;
    font-weight: 600;
    line-height: 20px;
    border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  }

  th:nth-child(2),
  td:nth-child(2) {
    text-align: right;
  }

  th:last-child,
  td:last-child {
    text-align: center;
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
`;

export const DonationIdentity = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

export const DonationAvatar = styled.div`
  display: flex;
  flex-shrink: 0;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
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
  font-size: 12px;
  font-weight: 700;
`;

export const DonationName = styled.p`
  margin: 0;
  color: #dae2fd;
  font-size: 14px;
  font-weight: 600;
  line-height: 20px;
`;

export const DonationMeta = styled.p`
  margin: 0;
  color: #cfc2d6;
  font-size: 10px;
  font-weight: 500;
  line-height: 14px;
`;

export const AmountText = styled.span`
  color: #ddb7ff;
  font-size: 24px;
  font-weight: 600;
  line-height: 32px;
`;

export const TransactionText = styled.span`
  font-family:
    "SFMono-Regular",
    Consolas,
    "Liberation Mono",
    monospace;
`;

export const ActionCell = styled.div`
  position: relative;
  display: inline-flex;
  justify-content: center;

  > button:first-child {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    min-height: 30px;
    padding: 4px 12px;
    border: 1px solid rgba(255, 180, 171, 0.2);
    border-radius: 8px;
    color: #ffb4ab;
    background: transparent;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12);
    font-size: 12px;
    font-weight: 600;
    line-height: 16px;
    cursor: pointer;
    transition:
      background-color 160ms ease,
      border-color 160ms ease;

    svg {
      width: 14px;
      height: 14px;
    }

    &:hover {
      border-color: rgba(255, 180, 171, 0.34);
      background: rgba(255, 180, 171, 0.1);
    }
  }
`;

export const ConfirmDelete = styled.button`
  position: absolute;
  top: calc(100% + 8px);
  right: 0;
  z-index: 5;
  width: 128px;
  padding: 10px 12px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  color: #ffb4ab;
  background: #171f33;
  box-shadow: 0 18px 32px rgba(0, 0, 0, 0.35);
  font-size: 12px;
  font-weight: 700;
  line-height: 16px;
  text-align: left;
  cursor: pointer;

  &:hover {
    background: #222a3d;
  }
`;

export const EmptyState = styled.section`
  width: min(100%, 576px);
  margin: auto;
  text-align: center;
`;

export const EmptyImageFrame = styled.div`
  position: relative;
  display: inline-block;
  margin-bottom: 24px;
`;

export const EmptyGlow = styled.div`
  position: absolute;
  pointer-events: none;
  border-radius: 999px;
  animation: ${pulse} 3s ease-in-out infinite;

  ${({ $position }) =>
    $position === "top"
      ? `
        top: -48px;
        left: -48px;
        width: 128px;
        height: 128px;
        background: rgba(221, 183, 255, 0.2);
        filter: blur(32px);
      `
      : `
        right: -32px;
        bottom: -32px;
        width: 160px;
        height: 160px;
        background: rgba(255, 176, 205, 0.2);
        filter: blur(48px);
        animation-delay: 1s;
      `}
`;

export const EmptyImage = styled.img`
  position: relative;
  display: block;
  width: 256px;
  height: 256px;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 40px;
  object-fit: cover;
  opacity: 0.8;
  mix-blend-mode: lighten;
  background: rgba(23, 31, 51, 0.6);
  box-shadow: 0 0 20px rgba(183, 109, 255, 0.2);
  backdrop-filter: blur(16px);

  @media (max-width: 560px) {
    width: 208px;
    height: 208px;
    border-radius: 32px;
  }
`;

export const EmptyCopy = styled.div`
  position: relative;
  z-index: 1;

  p {
    max-width: 448px;
    margin: 16px auto 0;
    color: #cfc2d6;
    font-size: 18px;
    font-weight: 400;
    line-height: 28px;
  }
`;

export const EmptyTitle = styled.h3`
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
