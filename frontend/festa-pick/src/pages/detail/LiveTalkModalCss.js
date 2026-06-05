import styled, { keyframes } from "styled-components";

const pulse = keyframes`
  0% {
    opacity: 0.55;
    transform: scale(0.9);
  }

  50% {
    opacity: 1;
    transform: scale(1);
  }

  100% {
    opacity: 0.55;
    transform: scale(0.9);
  }
`;

const ping = keyframes`
  75%, 100% {
    opacity: 0;
    transform: scale(2.1);
  }
`;

export const Backdrop = styled.div`
  position: fixed;
  inset: 0;
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
  background:
    radial-gradient(circle at 18% 12%, rgba(221, 183, 255, 0.18), transparent 30%),
    radial-gradient(circle at 86% 88%, rgba(255, 176, 205, 0.14), transparent 34%),
    rgba(6, 14, 32, 0.74);
  color: #dae2fd;

  @media (max-width: 768px) {
    padding: 0;
  }
`;

export const ModalPanel = styled.main`
  display: flex;
  flex-direction: column;
  width: min(1024px, 100%);
  height: min(85vh, 900px);
  overflow: hidden;
  background: rgba(23, 31, 51, 0.78);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  box-shadow: 0 28px 90px rgba(0, 0, 0, 0.42);
  backdrop-filter: blur(20px);

  @media (max-width: 768px) {
    width: 100%;
    height: 100%;
    border-width: 0;
    border-radius: 0;
  }
`;

export const Header = styled.header`
  display: flex;
  flex-shrink: 0;
  align-items: center;
  justify-content: space-between;
  min-height: 72px;
  padding: 0 24px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);

  @media (max-width: 768px) {
    min-height: 64px;
    padding: 0 16px;
  }
`;

export const HeaderInfo = styled.div`
  display: flex;
  align-items: center;
  min-width: 0;
  gap: 10px;
`;

export const LiveDot = styled.span`
  width: 9px;
  height: 9px;
  flex: 0 0 auto;
  border-radius: 999px;
  background: #ffb0cd;
  box-shadow: 0 0 16px rgba(255, 176, 205, 0.75);
  animation: ${pulse} 2s infinite;
`;

export const Title = styled.h1`
  margin: 0;
  color: #dae2fd;
  font-size: 24px;
  font-weight: 700;
  line-height: 32px;
  letter-spacing: 0;

  @media (max-width: 768px) {
    font-size: 22px;
    line-height: 30px;
  }
`;

export const StatusText = styled.span`
  flex: 0 0 auto;
  color: rgba(207, 194, 214, 0.78);
  font-size: 12px;
  font-weight: 500;
  line-height: 16px;

  @media (max-width: 768px) {
    display: none;
  }
`;

export const CloseButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  flex: 0 0 auto;
  border: 0;
  border-radius: 999px;
  background: transparent;
  color: #dae2fd;
  cursor: pointer;
  transition: background-color 160ms ease, transform 160ms ease;

  &:hover {
    background: rgba(255, 255, 255, 0.1);
  }

  &:active {
    transform: scale(0.94);
  }
`;

export const AiBoard = styled.section`
  display: flex;
  flex-shrink: 0;
  align-items: center;
  gap: 16px;
  padding: 16px 24px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  background: rgba(34, 42, 61, 0.42);

  @media (max-width: 768px) {
    align-items: flex-start;
    flex-direction: column;
    gap: 10px;
    padding: 16px;
  }
`;

export const AiLabel = styled.div`
  display: inline-flex;
  align-items: center;
  min-width: max-content;
  gap: 10px;
  color: #ddb7ff;
  font-size: 13px;
  font-weight: 800;
  line-height: 20px;
`;

export const AiDot = styled.span`
  position: relative;
  width: 10px;
  height: 10px;
  border-radius: 999px;
  background: #ddb7ff;

  &::before {
    position: absolute;
    inset: 0;
    content: "";
    border-radius: inherit;
    background: inherit;
    animation: ${ping} 1.5s cubic-bezier(0, 0, 0.2, 1) infinite;
  }
`;

export const AiSummary = styled.p`
  margin: 0;
  color: #cfc2d6;
  font-size: 16px;
  font-style: italic;
  font-weight: 400;
  line-height: 24px;

  @media (max-width: 768px) {
    font-size: 15px;
    line-height: 23px;
  }
`;

export const ChatBody = styled.section`
  display: flex;
  flex: 1 1 auto;
  flex-direction: column;
  gap: 24px;
  min-height: 0;
  overflow-y: auto;
  padding: 24px;
  scrollbar-width: none;

  &::-webkit-scrollbar {
    display: none;
  }

  @media (max-width: 768px) {
    gap: 20px;
    padding: 16px;
  }
`;

export const ChatRow = styled.article`
  display: flex;
  flex-direction: ${({ $isMine }) => ($isMine ? "row-reverse" : "row")};
  gap: 8px;
`;

export const Avatar = styled.img`
  width: 40px;
  height: 40px;
  flex: 0 0 auto;
  border: 1px solid rgba(221, 183, 255, 0.34);
  border-radius: 999px;
  object-fit: cover;
`;

export const ChatMeta = styled.div`
  display: flex;
  flex-direction: column;
  align-items: ${({ $isMine }) => ($isMine ? "flex-end" : "flex-start")};
  max-width: min(60%, 620px);
  gap: 4px;

  > div:first-child {
    display: flex;
    flex-direction: ${({ $isMine }) => ($isMine ? "row-reverse" : "row")};
    align-items: center;
    gap: 8px;
    color: rgba(207, 194, 214, 0.58);
    font-size: 12px;
    line-height: 16px;
  }

  @media (max-width: 768px) {
    max-width: 80%;
  }
`;

export const ChatName = styled.strong`
  color: ${({ $isMine }) => ($isMine ? "#ffb0cd" : "#ddb7ff")};
  font-size: 14px;
  font-weight: 700;
  line-height: 20px;
`;

export const ChatBubble = styled.div`
  overflow: hidden;
  padding: 14px 16px;
  border: ${({ $isMine }) => ($isMine ? "0" : "1px solid rgba(255, 255, 255, 0.1)")};
  border-radius: ${({ $isMine }) => ($isMine ? "12px 0 12px 12px" : "0 12px 12px 12px")};
  background: ${({ $isMine }) =>
    $isMine
      ? "linear-gradient(135deg, #b76dff 0%, #aa0266 100%)"
      : "rgba(23, 31, 51, 0.72)"};
  color: ${({ $isMine }) => ($isMine ? "#ffffff" : "#dae2fd")};
  box-shadow: ${({ $isMine }) => ($isMine ? "0 18px 34px rgba(170, 2, 102, 0.18)" : "none")};
  backdrop-filter: blur(18px);

  p {
    margin: 0;
    font-size: 16px;
    line-height: 24px;
  }

  @media (max-width: 768px) {
    padding: 12px 14px;
  }
`;

export const PhotoPreview = styled.img`
  display: block;
  width: 100%;
  max-width: 460px;
  aspect-ratio: 16 / 9;
  margin-top: 12px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 8px;
  object-fit: cover;
`;

export const SystemNotice = styled.div`
  align-self: center;
  padding: 6px 16px;
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 999px;
  background: rgba(45, 52, 73, 0.5);
  color: rgba(207, 194, 214, 0.8);
  font-size: 12px;
  font-weight: 500;
  line-height: 16px;
`;

export const Footer = styled.footer`
  flex-shrink: 0;
  padding: 18px 24px 20px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  background: rgba(23, 31, 51, 0.78);
  backdrop-filter: blur(20px);

  @media (max-width: 768px) {
    padding: 14px 16px 16px;
  }
`;

export const Composer = styled.form`
  margin: 0;
`;

export const ComposerBox = styled.div`
  display: flex;
  align-items: flex-end;
  gap: 8px;
  padding: 4px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  background: rgba(19, 27, 46, 0.58);
  transition: border-color 160ms ease, box-shadow 160ms ease;

  &:focus-within {
    border-color: rgba(221, 183, 255, 0.55);
    box-shadow: 0 0 15px rgba(221, 183, 255, 0.3);
  }
`;

export const UploadButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  flex: 0 0 auto;
  border: 0;
  border-radius: 12px;
  background: transparent;
  color: #ddb7ff;
  cursor: pointer;
  transition: background-color 160ms ease;

  &:hover {
    background: rgba(221, 183, 255, 0.1);
  }
`;

export const InputArea = styled.div`
  display: flex;
  flex: 1 1 auto;
  min-width: 0;
`;

export const Textarea = styled.textarea`
  width: 100%;
  max-height: 128px;
  min-height: 48px;
  padding: 12px 0;
  border: 0;
  outline: 0;
  resize: none;
  background: transparent;
  color: #dae2fd;
  font-family: inherit;
  font-size: 16px;
  line-height: 24px;
  scrollbar-width: none;

  &::placeholder {
    color: rgba(207, 194, 214, 0.58);
  }

  &::-webkit-scrollbar {
    display: none;
  }
`;

export const SendButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  flex: 0 0 auto;
  border: 0;
  border-radius: 12px;
  background: #ddb7ff;
  color: #490080;
  cursor: pointer;
  box-shadow: 0 10px 26px rgba(221, 183, 255, 0.22);
  transition: transform 160ms ease, box-shadow 160ms ease;

  &:hover {
    transform: scale(1.04);
    box-shadow: 0 12px 30px rgba(221, 183, 255, 0.28);
  }

  &:active {
    transform: scale(0.94);
  }
`;

export const QuickChipList = styled.div`
  display: flex;
  gap: 8px;
  overflow-x: auto;
  padding-top: 16px;
  scrollbar-width: none;

  &::-webkit-scrollbar {
    display: none;
  }
`;

export const QuickChip = styled.button`
  flex: 0 0 auto;
  padding: 6px 16px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 999px;
  background: rgba(23, 31, 51, 0.7);
  color: #cfc2d6;
  cursor: pointer;
  font-size: 12px;
  font-weight: 600;
  line-height: 16px;
  transition: border-color 160ms ease, color 160ms ease, background-color 160ms ease;

  &:hover {
    border-color: rgba(221, 183, 255, 0.58);
    background: rgba(221, 183, 255, 0.08);
    color: #ddb7ff;
  }
`;
