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

const softBounce = keyframes`
  0%, 100% {
    transform: translateY(0);
  }

  50% {
    transform: translateY(-8px);
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
  padding: 28px 24px 48px;

  &::before,
  &::after {
    content: "";
    position: absolute;
    pointer-events: none;
    border-radius: 999px;
    opacity: 0.6;
  }

  &::before {
    top: -160px;
    left: -120px;
    width: 320px;
    height: 320px;
    background: rgba(255, 176, 205, 0.05);
    filter: blur(100px);
  }

  &::after {
    right: -240px;
    bottom: -220px;
    width: 520px;
    height: 520px;
    background: rgba(221, 183, 255, 0.05);
    filter: blur(120px);
  }

  @media (max-width: 768px) {
    margin-left: 0;
    padding: 24px 16px 40px;
  }
`;

export const ContentShell = styled.section`
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  width: min(100%, 1280px);
  min-height: calc(100vh - 76px);
  margin: 0 auto;
  animation: ${fadeUp} 700ms ease both;
`;

export const HeaderRow = styled.div`
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 24px;
  margin-bottom: 24px;

  ${({ $isEmpty }) =>
    $isEmpty &&
    `
      margin-bottom: 30px;
    `}

  @media (max-width: 980px) {
    align-items: stretch;
    flex-direction: column;
  }
`;

export const HeaderCopy = styled.div`
  min-width: 0;
`;

export const PageTitle = styled.h2`
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
  flex-wrap: wrap;
  justify-content: flex-end;

  @media (max-width: 560px) {
    flex-direction: column;
    align-items: stretch;
    justify-content: flex-start;
  }
`;

export const SearchBox = styled.label`
  position: relative;
  display: block;
  width: 256px;

  @media (max-width: 560px) {
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

export const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  max-width: 576px;
  margin: clamp(16px, 5vh, 56px) auto 0;
  text-align: center;
`;

export const EmptyIllustration = styled.div`
  position: relative;
  margin-bottom: 24px;
`;

export const IllustrationGlow = styled.div`
  position: absolute;
  inset: 0;
  border-radius: 999px;
  background: rgba(221, 183, 255, 0.2);
  filter: blur(60px);
  transform: scale(0.76);
  transition: transform 700ms ease;

  ${EmptyIllustration}:hover & {
    transform: scale(1);
  }
`;

export const EmptyImage = styled.img`
  position: relative;
  display: block;
  width: 256px;
  height: 256px;
  border: 1px solid rgba(221, 183, 255, 0.2);
  border-radius: 999px;
  object-fit: cover;
  opacity: 0.6;
  mix-blend-mode: lighten;
  background: rgba(23, 31, 51, 0.6);
  box-shadow: 0 24px 48px rgba(0, 0, 0, 0.38);
  backdrop-filter: blur(16px);

  & + svg {
    position: absolute;
    top: 50%;
    left: 50%;
    width: 80px;
    height: 80px;
    color: #ddb7ff;
    opacity: 0.9;
    transform: translate(-50%, -50%);
  }

  @media (max-width: 560px) {
    width: 200px;
    height: 200px;
  }
`;

export const EmptyChip = styled.span`
  position: absolute;
  z-index: 1;
  display: inline-flex;
  align-items: center;
  min-height: 32px;
  padding: 8px 16px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 999px;
  color: ${({ $position }) => ($position === "right" ? "#ffb0cd" : "#ddb7ff")};
  background: rgba(23, 31, 51, 0.6);
  box-shadow: 0 16px 28px rgba(0, 0, 0, 0.18);
  backdrop-filter: blur(16px);
  font-size: 12px;
  font-weight: 500;
  line-height: 16px;
  animation: ${softBounce} 3s ease-in-out infinite;

  ${({ $position }) =>
    $position === "right"
      ? `
        top: -16px;
        right: -32px;
      `
      : `
        top: 96px;
        left: -48px;
        animation-delay: -1.5s;
      `}

  @media (max-width: 560px) {
    display: none;
  }
`;

export const EmptyTitle = styled.h3`
  margin: 0 0 8px;
  color: #dae2fd;
  font-size: 24px;
  font-weight: 600;
  line-height: 32px;
  letter-spacing: 0;
`;

export const EmptyDescription = styled.p`
  margin: 0;
  color: #cfc2d6;
  font-size: 16px;
  font-weight: 400;
  line-height: 24px;
`;

export const TableCard = styled.div`
  position: relative;
  z-index: 1;
  display: flex;
  flex: 1;
  flex-direction: column;
  overflow: visible;
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 16px;
  background: rgba(23, 31, 51, 0.7);
  box-shadow: 0 24px 48px rgba(0, 0, 0, 0.36);
  backdrop-filter: blur(20px);
`;

export const TableScroll = styled.div`
  flex: 1;
  overflow-x: auto;
  overflow-y: visible;
`;

export const Table = styled.table`
  width: 100%;
  min-width: 920px;
  border-collapse: collapse;
  text-align: left;

  thead tr {
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    background: rgba(255, 255, 255, 0.05);
  }

  th,
  td {
    padding: 16px 24px;
  }

  th {
    color: #ddb7ff;
    font-size: 14px;
    font-weight: 600;
    line-height: 20px;
    letter-spacing: 0.05em;
  }

  td {
    color: #cfc2d6;
    font-size: 14px;
    line-height: 20px;
    border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  }

  th:last-child,
  td:last-child {
    text-align: right;
  }

  tbody tr {
    transition: background-color 160ms ease;
  }

  tbody tr:hover {
    background: rgba(255, 255, 255, 0.025);
  }
`;

export const MemberIdentity = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
`;

export const MemberAvatar = styled.div`
  display: flex;
  flex-shrink: 0;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 999px;
  color: ${({ $tone }) => ($tone === 1 ? "#552100" : "#490080")};
  background: ${({ $tone }) => {
    if ($tone === 1) {
      return "linear-gradient(135deg, #ffb690 0%, #ec6a06 100%)";
    }

    if ($tone === 2) {
      return "linear-gradient(135deg, #ffb0cd 0%, #aa0266 100%)";
    }

    return "linear-gradient(135deg, #ddb7ff 0%, #b76dff 100%)";
  }};
  font-size: 12px;
  font-weight: 700;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

export const MemberName = styled.div`
  color: #dae2fd;
  font-size: 14px;
  font-weight: 600;
  line-height: 20px;
`;

export const MemberMeta = styled.div`
  color: rgba(207, 194, 214, 0.7);
  font-size: 12px;
  font-weight: 500;
  line-height: 16px;
  text-transform: lowercase;
`;

export const StatusBadge = styled.span`
  display: inline-flex;
  align-items: center;
  padding: 3px 10px;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 600;
  line-height: 16px;

  ${({ $status }) => {
    if ($status === "ACTIVE" || $status === "active" || $status === "활성") {
      return `
        color: #4ade80;
        background: rgba(34, 197, 94, 0.1);
        border: 1px solid rgba(34, 197, 94, 0.2);
      `;
    }

    if ($status === "SUSPENDED" || $status === "suspended" || $status === "정지") {
      return `
        color: #ffb4ab;
        background: #93000a;
        border: 1px solid rgba(255, 180, 171, 0.2);
      `;
    }

    return `
      color: #cfc2d6;
      background: rgba(255, 255, 255, 0.1);
      border: 1px solid rgba(255, 255, 255, 0.1);
    `;
  }}
`;

export const PlanBadge = styled.span`
  display: inline-flex;
  padding: 3px 8px;
  border: 1px solid
    ${({ $premium }) => ($premium ? "rgba(255, 176, 205, 0.2)" : "rgba(255, 255, 255, 0.1)")};
  border-radius: 4px;
  color: ${({ $premium }) => ($premium ? "#ffb0cd" : "#cfc2d6")};
  font-size: 12px;
  font-weight: 600;
  line-height: 16px;
`;

export const ActionGroup = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 8px;
`;

export const ActionButton = styled.button`
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
    color: ${({ $danger }) => ($danger ? "#ffb4ab" : "#ddb7ff")};
    background: rgba(255, 255, 255, 0.05);
  }
`;

export const ConfirmDelete = styled.button`
  position: fixed;
  top: ${({ $top }) => `${$top}px`};
  left: ${({ $left }) => `${$left}px`};
  z-index: 1000;
  width: 128px;
  padding: 10px 16px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  color: #ffb4ab;
  background: #222a3d;
  box-shadow: 0 16px 28px rgba(0, 0, 0, 0.3);
  font-size: 12px;
  font-weight: 600;
  text-align: left;
  cursor: pointer;

  &:hover {
    background: #2d3449;
  }
`;

export const ModalOverlay = styled.div`
  position: fixed;
  inset: 0;
  z-index: 100;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px;
`;

export const ModalBackdrop = styled.div`
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(6px);
`;

export const ModalCard = styled.div`
  position: relative;
  z-index: 1;
  width: min(100%, 448px);
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  background: #222a3d;
  box-shadow: 0 24px 56px rgba(0, 0, 0, 0.48);
`;

export const ModalHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding: 20px 24px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);

  h3 {
    margin: 0;
    color: #dae2fd;
    font-size: 18px;
    font-weight: 600;
    line-height: 24px;
  }
`;

export const ModalClose = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  padding: 0;
  border: 0;
  border-radius: 8px;
  color: #cfc2d6;
  background: transparent;
  cursor: pointer;

  svg {
    width: 20px;
    height: 20px;
  }

  &:hover {
    color: #dae2fd;
    background: rgba(255, 255, 255, 0.08);
  }
`;

export const ModalBody = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 24px;

  p {
    margin: 0 0 4px;
    color: #cfc2d6;
    font-size: 16px;
    line-height: 24px;
  }
`;

export const ModalOption = styled.label`
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 16px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  cursor: pointer;
  transition: background-color 160ms ease;

  &:hover {
    background: rgba(255, 255, 255, 0.05);
  }

  input {
    margin-top: 3px;
    accent-color: #ddb7ff;
  }

  span {
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  strong {
    color: #dae2fd;
    font-size: 14px;
    line-height: 20px;
  }

  small {
    color: #cfc2d6;
    font-size: 12px;
    line-height: 16px;
  }
`;

export const ModalActions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  padding: 20px 24px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  background: rgba(255, 255, 255, 0.02);
`;

export const TextButton = styled.button`
  min-height: 40px;
  padding: 8px 16px;
  border: 0;
  border-radius: 8px;
  color: ${({ $primary }) => ($primary ? "#490080" : "#cfc2d6")};
  background: ${({ $primary }) => ($primary ? "#ddb7ff" : "transparent")};
  box-shadow: ${({ $primary }) => ($primary ? "0 0 10px rgba(183, 109, 255, 0.35)" : "none")};
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;

  &:hover {
    background: ${({ $primary }) => ($primary ? "#f0dbff" : "rgba(255, 255, 255, 0.1)")};
  }
`;
