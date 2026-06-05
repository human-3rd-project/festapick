import styled from "styled-components";

export const Backdrop = styled.div`
  position: fixed;
  inset: 0;
  z-index: 1100;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px;
  background: rgba(0, 0, 0, 0.78);
  backdrop-filter: blur(6px);
`;

export const ModalPanel = styled.main`
  position: relative;
  width: min(520px, 100%);
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  background: rgba(23, 31, 51, 0.78);
  box-shadow: 0 0 20px rgba(221, 183, 255, 0.2), 0 28px 90px rgba(0, 0, 0, 0.45);
  color: #dae2fd;
  backdrop-filter: blur(20px);

  &::before {
    position: absolute;
    top: 0;
    right: 0;
    left: 0;
    height: 4px;
    background: linear-gradient(90deg, #ddb7ff, #aa0266, #ffb690);
    content: "";
  }
`;

export const Content = styled.form`
  display: flex;
  flex-direction: column;
  gap: 24px;
  padding: 48px;

  @media (max-width: 560px) {
    padding: 32px 24px 24px;
  }
`;

export const Header = styled.header`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 18px;

  p {
    margin: 4px 0 0;
    color: #cfc2d6;
    font-size: 16px;
    line-height: 24px;
  }
`;

export const Title = styled.h1`
  margin: 0;
  color: #dae2fd;
  font-size: 32px;
  font-weight: 800;
  line-height: 40px;
  letter-spacing: 0;

  @media (max-width: 560px) {
    font-size: 24px;
    line-height: 32px;
  }
`;

export const CloseButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 38px;
  height: 38px;
  flex: 0 0 auto;
  border: 0;
  border-radius: 999px;
  background: transparent;
  color: #cfc2d6;
  cursor: pointer;
  transition: background-color 160ms ease, color 160ms ease;

  &:hover {
    background: rgba(255, 255, 255, 0.08);
    color: #ddb7ff;
  }
`;

export const FestivalCard = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px;
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 8px;
  background: #222a3d;

  div {
    min-width: 0;
  }

  strong {
    display: block;
    overflow: hidden;
    color: #ddb7ff;
    font-size: 22px;
    font-weight: 800;
    line-height: 30px;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  span {
    display: block;
    margin-top: 2px;
    color: #cfc2d6;
    font-size: 14px;
    font-weight: 700;
    line-height: 20px;
  }
`;

export const FestivalImage = styled.img`
  width: 64px;
  height: 64px;
  flex: 0 0 auto;
  border-radius: 8px;
  object-fit: cover;
`;

export const RatingSection = styled.section`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  text-align: center;

  > div {
    display: flex;
    gap: 8px;
  }

  p {
    display: flex;
    align-items: baseline;
    gap: 4px;
    margin: 0;
  }

  strong {
    color: #ddb7ff;
    font-size: 48px;
    font-weight: 800;
    line-height: 56px;
  }

  span {
    color: #cfc2d6;
    font-size: 14px;
    font-weight: 700;
  }
`;

export const StarButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  border: 0;
  background: transparent;
  color: ${({ $active }) => ($active ? "#ddb7ff" : "#4d4354")};
  cursor: pointer;
  transition: color 160ms ease, transform 160ms ease;

  &:hover {
    color: #ddb7ff;
    transform: translateY(-2px);
  }

  &:active {
    transform: scale(0.92);
  }
`;

export const TextareaGroup = styled.section`
  display: flex;
  flex-direction: column;
  gap: 8px;

  label {
    padding: 0 4px;
    color: #cfc2d6;
    font-size: 14px;
    font-weight: 700;
    line-height: 20px;
  }
`;

export const Textarea = styled.textarea`
  width: 100%;
  min-height: 144px;
  padding: 16px;
  border: 1px solid #4d4354;
  border-radius: 12px;
  outline: 0;
  resize: none;
  background: #060e20;
  color: #dae2fd;
  font: inherit;
  font-size: 16px;
  line-height: 24px;
  transition: border-color 160ms ease, box-shadow 160ms ease;

  &::placeholder {
    color: #988d9f;
  }

  &:focus {
    border-color: #ddb7ff;
    box-shadow: 0 0 0 1px rgba(221, 183, 255, 0.4);
  }
`;

export const CharacterCount = styled.span`
  align-self: flex-end;
  padding: 0 4px;
  color: #988d9f;
  font-size: 12px;
  font-weight: 500;
  line-height: 16px;
`;

export const Footer = styled.footer`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 24px;

  @media (max-width: 420px) {
    grid-template-columns: 1fr;
    gap: 10px;
  }
`;

export const ActionButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  height: 56px;
  border: 0;
  border-radius: 999px;
  background: ${({ $primary }) =>
    $primary ? "linear-gradient(135deg, #b76dff 0%, #aa0266 100%)" : "#2d3449"};
  color: ${({ $primary }) => ($primary ? "#ffffff" : "#cfc2d6")};
  cursor: ${({ disabled }) => (disabled ? "not-allowed" : "pointer")};
  font: inherit;
  font-size: 14px;
  font-weight: 800;
  line-height: 20px;
  opacity: ${({ disabled }) => (disabled ? "0.5" : "1")};
  box-shadow: ${({ $primary }) => ($primary ? "0 14px 28px rgba(221, 183, 255, 0.18)" : "none")};
  transition: filter 160ms ease, transform 160ms ease, background-color 160ms ease;

  &:hover {
    filter: ${({ disabled }) => (disabled ? "none" : "brightness(1.08)")};
    background: ${({ $primary }) =>
      $primary ? "linear-gradient(135deg, #b76dff 0%, #aa0266 100%)" : "rgba(255, 255, 255, 0.1)"};
  }

  &:active {
    transform: ${({ disabled }) => (disabled ? "none" : "scale(0.96)")};
  }
`;
