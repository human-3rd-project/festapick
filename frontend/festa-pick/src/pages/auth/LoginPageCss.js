import styled from "styled-components";

export const Page = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  min-height: 100vh;
  overflow: hidden;
  background: #101626;
  color: #dae2fd;
  font-family: "Plus Jakarta Sans", sans-serif;
  padding: 48px 18px;
`;

export const BackgroundGradient = styled.div`
  position: fixed;
  inset: 0;
  z-index: 0;
  pointer-events: none;
  background:
    linear-gradient(
      180deg,
      rgba(18, 24, 42, 0.28) 0%,
      rgba(9, 15, 29, 0.72) 100%
    ),
    radial-gradient(
      circle at 49% 16%,
      rgba(221, 183, 255, 0.24) 0%,
      transparent 30%
    ),
    radial-gradient(
      circle at 75% 78%,
      rgba(255, 2, 141, 0.18) 0%,
      transparent 34%
    ),
    radial-gradient(
      circle at 18% 64%,
      rgba(183, 109, 255, 0.16) 0%,
      transparent 36%
    );
`;

export const BackgroundPhoto = styled.div`
  position: fixed;
  inset: 0;
  z-index: 0;
  opacity: 0.38;
  pointer-events: none;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    filter: grayscale(0.75) contrast(1.08) brightness(1.08);
  }
`;

export const Main = styled.main`
  position: relative;
  width: 100%;
  max-width: 440px;
  margin: 0 auto;
  z-index: 1;
`;

export const LogoArea = styled.div`
  text-align: center;
  margin-bottom: 44px;

  a {
    display: inline-block;
    color: inherit;
    text-decoration: none;
  }

  h1 {
    font-size: 48px;
    line-height: 56px;
    font-weight: 800;
    font-style: italic;
    color: #ddb7ff;
    margin: 0;
    cursor: pointer;
    text-shadow: 0 0 22px rgba(221, 183, 255, 0.34);
  }

  p {
    margin: 6px 0 0;
    color: #cfc2d6;
    font-size: 14px;
    line-height: 20px;
    font-weight: 600;
    letter-spacing: 0.02em;
  }
`;

export const GlassContainer = styled.div`
  border-radius: 12px;
  padding: 48px;
  background: rgba(20, 27, 44, 0.88);
  backdrop-filter: blur(14px);
  -webkit-backdrop-filter: blur(14px);
  border: 1px solid rgba(221, 183, 255, 0.16);
  box-shadow:
    0 30px 80px rgba(0, 0, 0, 0.36),
    0 0 38px rgba(183, 109, 255, 0.08),
    inset 0 1px 0 rgba(255, 255, 255, 0.06);

  @media (max-width: 520px) {
    padding: 34px 24px;
  }
`;

export const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

export const Field = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;

  label {
    display: block;
    margin-left: 4px;
    font-size: 14px;
    line-height: 20px;
    font-weight: 700;
    letter-spacing: 0;
    color: #e2e8fb;
  }
`;

export const InputGroup = styled.div`
  position: relative;
  display: flex;
  align-items: center;
`;

export const Icon = styled.span`
  position: absolute;
  left: 16px;
  top: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  transform: translateY(-50%);
  color: #d8d1e8;
  opacity: 0.9;
  transition: color 0.2s ease;

  ${InputGroup}:focus-within & {
    color: #ddb7ff;
    opacity: 1;
  }
`;

export const Input = styled.input`
  width: 100%;
  background: rgba(53, 62, 86, 0.92);
  border: 1px solid rgba(207, 194, 214, 0.2);
  border-radius: 8px;
  padding: 12px 16px 12px 48px;
  color: #dae2fd;
  font-size: 16px;
  line-height: 24px;
  font-weight: 400;
  transition:
    border-color 0.2s ease,
    box-shadow 0.2s ease;

  &::placeholder {
    color: rgba(207, 194, 214, 0.58);
  }

  &:focus {
    outline: none;
    border-color: #ddb7ff;
    background: rgba(59, 68, 95, 0.98);
    box-shadow:
      0 0 0 3px rgba(221, 183, 255, 0.12),
      0 0 16px rgba(221, 183, 255, 0.24);
  }

  &[aria-invalid="true"] {
    border-color: rgba(255, 180, 171, 0.76);
    box-shadow: 0 0 0 3px rgba(255, 180, 171, 0.12);
  }
`;

export const StatusMessage = styled.div`
  display: block;
  min-height: 16px;
  margin-top: -8px;
  margin-bottom: -10px;
  font-size: 12px;
  line-height: 16px;
  font-weight: 600;
  color: #ffb4ab;
  opacity: 0;
  transition: opacity 0.2s ease;

  &.visible {
    opacity: 1;
  }

  &.success {
    color: #ddb7ff;
  }

  &.error {
    color: #ffb4ab;
  }
`;

export const NeonButton = styled.button`
  width: 100%;
  padding: 12px;
  border-radius: 8px;
  background: linear-gradient(135deg, #bd5ff2 0%, #ff0c93 100%);
  box-shadow:
    0 10px 24px rgba(255, 2, 141, 0.24),
    0 8px 22px rgba(183, 109, 255, 0.24);
  color: #fff;
  border: none;
  font-size: 14px;
  line-height: 20px;
  font-weight: 600;
  cursor: pointer;
  transition:
    transform 0.3s ease,
    box-shadow 0.3s ease;

  &:hover {
    box-shadow:
      0 16px 34px rgba(255, 2, 141, 0.3),
      0 12px 28px rgba(183, 109, 255, 0.32);
    transform: translateY(-2px);
  }

  &:focus-visible {
    outline: 3px solid rgba(221, 183, 255, 0.32);
    outline-offset: 3px;
  }

  &:active {
    transform: scale(0.95);
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.64;
    transform: none;
    box-shadow:
      0 8px 18px rgba(255, 2, 141, 0.14),
      0 6px 16px rgba(183, 109, 255, 0.14);
  }
`;

export const LinksRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
  padding: 0 4px;

  a {
    text-decoration: none;
    transition:
      color 0.2s ease,
      text-decoration-color 0.2s ease;
  }

  @media (max-width: 380px) {
    align-items: flex-start;
    flex-direction: column;
  }
`;

export const RecoveryLinks = styled.div`
  display: flex;
  gap: 16px;

  a {
    color: #d8d1e8;
    font-size: 12px;
    line-height: 16px;
    font-weight: 700;
  }

  a:hover {
    color: #ddb7ff;
  }

  a:focus-visible {
    outline: 2px solid rgba(221, 183, 255, 0.34);
    outline-offset: 3px;
    border-radius: 4px;
  }
`;

export const SignupLink = styled.a`
  color: #ddb7ff;
  font-size: 14px;
  line-height: 20px;
  font-weight: 700;

  &:hover {
    text-decoration: underline;
    text-decoration-color: #ddb7ff;
  }
`;

export const Divider = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  margin: 16px 0;

  span {
    flex-shrink: 0;
    color: rgba(216, 209, 232, 0.9);
    font-size: 12px;
    line-height: 16px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.12em;
  }

  &::before,
  &::after {
    content: "";
    flex: 1;
    height: 1px;
    background: rgba(255, 255, 255, 0.1);
  }
`;

export const Socials = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

export const SocialButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  width: 100%;
  min-height: 44px;
  padding: 10px 16px;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  font-size: 14px;
  line-height: 20px;
  font-weight: 600;
  box-shadow: 0 10px 22px rgba(0, 0, 0, 0.12);
  transition:
    filter 0.2s ease,
    transform 0.2s ease,
    box-shadow 0.2s ease;

  &:hover {
    filter: brightness(1.1);
    box-shadow: 0 12px 26px rgba(0, 0, 0, 0.18);
  }

  &:focus-visible {
    outline: 3px solid rgba(221, 183, 255, 0.32);
    outline-offset: 3px;
  }

  &:active {
    transform: scale(0.95);
  }

  &:disabled {
    cursor: not-allowed;
    filter: grayscale(0.25);
    opacity: 0.68;
    transform: none;
  }
`;

export const KakaoButton = styled(SocialButton)`
  background: #ffe100;
  color: #3c1e1e;
`;

export const NaverButton = styled(SocialButton)`
  background: #03c75a;
  color: #fff;
`;

export const FilledIcon = styled.span`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  flex: 0 0 28px;
  height: 24px;
  color: #3c1e1e;

  svg {
    display: block;
    width: 24px;
    height: 24px;
    transform: translateY(1px);
  }
`;

export const NaverMark = styled.span`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  flex: 0 0 24px;
  height: 24px;
  color: #fff;
  font-size: 18px;
  line-height: 1;
  font-weight: 700;
  font-family: Arial, sans-serif;
`;

const Styles = {
  Page,
  BackgroundGradient,
  BackgroundPhoto,
  Main,
  LogoArea,
  GlassContainer,
  Form,
  Field,
  InputGroup,
  Icon,
  Input,
  StatusMessage,
  NeonButton,
  LinksRow,
  RecoveryLinks,
  SignupLink,
  Divider,
  Socials,
  SocialButton,
  KakaoButton,
  NaverButton,
  FilledIcon,
  NaverMark,
};

export default Styles;
