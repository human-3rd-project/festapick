import styled from "styled-components";

export const Page = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  min-height: 100vh;
  overflow: hidden;
  background: #0b1326;
  color: #dae2fd;
  font-family: "Plus Jakarta Sans", sans-serif;
  padding: 80px 16px 24px;
`;

export const BackgroundGradient = styled.div`
  position: fixed;
  inset: 0;
  z-index: 0;
  pointer-events: none;
  background:
    radial-gradient(
      circle at 20% 30%,
      rgba(221, 183, 255, 0.15) 0%,
      transparent 40%
    ),
    radial-gradient(
      circle at 80% 70%,
      rgba(170, 2, 102, 0.15) 0%,
      transparent 40%
    ),
    linear-gradient(
      180deg,
      rgba(11, 19, 38, 0.16) 0%,
      rgba(11, 19, 38, 0.78) 100%
    );
`;

export const BackgroundPhoto = styled.div`
  position: fixed;
  inset: 0;
  z-index: 0;
  opacity: 0.3;
  pointer-events: none;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    filter: grayscale(1);
  }
`;

export const Main = styled.main`
  position: relative;
  z-index: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
`;

export const GlassContainer = styled.section`
  width: 100%;
  max-width: 440px;
  min-height: 0;
  border-radius: 12px;
  padding: 48px;
  background: rgba(19, 27, 46, 0.7);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow:
    0 0 40px rgba(221, 183, 255, 0.05),
    0 30px 70px rgba(0, 0, 0, 0.28);

  &.result-visible {
    display: flex;
    flex-direction: column;
    justify-content: center;
    min-height: 560px;
  }

  @media (max-width: 520px) {
    padding: 34px 24px;

    &.result-visible {
      min-height: 520px;
    }
  }
`;

export const Header = styled.div`
  text-align: center;
  margin-bottom: 24px;

  h2 {
    margin: 0 0 8px;
    color: #ddb7ff;
    font-size: 32px;
    line-height: 40px;
    font-weight: 700;
    letter-spacing: 0;
  }

  p {
    margin: 0;
    color: #cfc2d6;
    font-size: 16px;
    line-height: 24px;
    font-weight: 400;
    letter-spacing: 0;
  }
`;

export const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

export const Fields = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

export const Field = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;

  label {
    margin-left: 4px;
    color: #dae2fd;
    font-size: 14px;
    line-height: 20px;
    font-weight: 600;
    letter-spacing: 0;
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
  color: rgba(207, 194, 214, 0.78);
  transition: color 0.2s ease;

  ${InputGroup}:focus-within & {
    color: #ddb7ff;
  }
`;

export const Input = styled.input`
  width: 100%;
  height: 44px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  background: #2d3449;
  padding: 10px 16px 10px 48px;
  color: #dae2fd;
  font-size: 16px;
  line-height: 24px;
  font-weight: 400;
  letter-spacing: 0;
  transition:
    border-color 0.2s ease,
    box-shadow 0.2s ease;

  &::placeholder {
    color: rgba(207, 194, 214, 0.5);
  }

  &:focus {
    outline: none;
    border-color: #ddb7ff;
    box-shadow: 0 0 10px rgba(221, 183, 255, 0.4);
  }

  &.error {
    border-color: #ffb4ab;
  }
`;

export const ErrorMessage = styled.p`
  display: none;
  margin: 4px 0 0;
  color: #ffb4ab;
  font-size: 12px;
  line-height: 16px;
  font-weight: 500;
  letter-spacing: 0;

  &.visible {
    display: block;
  }
`;

export const StatusMessage = styled.div`
  display: none;
  border-radius: 4px;
  border: 1px solid rgba(221, 183, 255, 0.2);
  background: rgba(221, 183, 255, 0.1);
  padding: 4px 8px;
  color: #ddb7ff;
  font-size: 12px;
  line-height: 16px;
  font-weight: 500;
  letter-spacing: 0;

  &.visible {
    display: block;
  }

  &.error {
    border-color: rgba(255, 180, 171, 0.2);
    color: #ffb4ab;
  }
`;

export const NeonButton = styled.button`
  width: 100%;
  border: none;
  border-radius: 8px;
  padding: 12px;
  background: linear-gradient(135deg, #b76dff 0%, #ff028d 100%);
  box-shadow: 0 4px 15px rgba(183, 109, 255, 0.4);
  color: #fff;
  font-size: 14px;
  line-height: 20px;
  font-weight: 600;
  letter-spacing: 0;
  cursor: pointer;
  transition:
    transform 0.3s ease,
    box-shadow 0.3s ease;

  &:hover {
    box-shadow: 0 0 25px rgba(183, 109, 255, 0.6);
  }

  &:focus-visible {
    outline: 3px solid rgba(221, 183, 255, 0.32);
    outline-offset: 3px;
  }

  &:active {
    transform: scale(0.95);
  }
`;

export const ResultArea = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  text-align: center;
`;

export const ResultBox = styled.div`
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.05);
  padding: 24px;
  transition:
    background 0.25s ease,
    border-color 0.25s ease;

  &.success {
    border-color: rgba(105, 255, 184, 0.24);
    background:
      linear-gradient(
        180deg,
        rgba(105, 255, 184, 0.08) 0%,
        rgba(255, 255, 255, 0.04) 100%
      ),
      rgba(255, 255, 255, 0.05);
  }

  &.error {
    border-color: rgba(255, 180, 171, 0.28);
    background:
      linear-gradient(
        180deg,
        rgba(255, 180, 171, 0.08) 0%,
        rgba(255, 255, 255, 0.04) 100%
      ),
      rgba(255, 255, 255, 0.05);
  }
`;

export const ResultIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  margin: 0 auto 16px;
  border-radius: 9999px;
  background: rgba(221, 183, 255, 0.1);
  border: 1px solid rgba(221, 183, 255, 0.2);
  color: #ddb7ff;

  &.success {
    background: rgba(105, 255, 184, 0.12);
    border-color: rgba(105, 255, 184, 0.28);
    color: #69ffb8;
  }

  &.error {
    background: rgba(255, 180, 171, 0.12);
    border-color: rgba(255, 180, 171, 0.28);
    color: #ffb4ab;
  }
`;

export const ResultLabel = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 24px;
  margin-bottom: 10px;
  border-radius: 9999px;
  padding: 3px 10px;
  background: rgba(221, 183, 255, 0.1);
  color: #ddb7ff;
  font-size: 12px;
  line-height: 16px;
  font-weight: 700;
  letter-spacing: 0;
`;

export const ResultTitle = styled.h3`
  margin: 0 0 8px;
  color: #fff;
  font-size: 24px;
  line-height: 32px;
  font-weight: 700;
  letter-spacing: 0;
`;

export const ResultDescription = styled.p`
  margin: 12px 0 0;
  color: #cfc2d6;
  font-size: 14px;
  line-height: 20px;
  font-weight: 500;
  letter-spacing: 0;
`;

export const ResultNote = styled.p`
  margin: 0;
  color: #cfc2d6;
  font-size: 12px;
  line-height: 16px;
  font-weight: 500;
  letter-spacing: 0;
`;

export const ResultActions = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
`;

export const LoginLink = styled.a`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  align-self: center;
  width: fit-content;
  margin-top: -8px;
  border-radius: 4px;
  color: #ddb7ff;
  font-size: 12px;
  line-height: 16px;
  font-weight: 600;
  letter-spacing: 0;
  text-decoration: none;
  transition:
    color 0.2s ease,
    text-decoration-color 0.2s ease;

  &:hover {
    color: #fff;
    text-decoration: underline;
    text-decoration-color: rgba(221, 183, 255, 0.7);
  }

  &:focus-visible {
    outline: 2px solid rgba(221, 183, 255, 0.32);
    outline-offset: 3px;
  }

  &.result-link {
    margin-top: 0;
  }
`;

export const GlassButton = styled.button`
  width: 100%;
  border-radius: 8px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  padding: 12px;
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(4px);
  -webkit-backdrop-filter: blur(4px);
  color: #dae2fd;
  font-size: 14px;
  line-height: 20px;
  font-weight: 600;
  letter-spacing: 0;
  cursor: pointer;
  transition:
    background 0.2s ease,
    border-color 0.2s ease,
    transform 0.2s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.1);
    border-color: rgba(255, 255, 255, 0.4);
  }

  &:focus-visible {
    outline: 3px solid rgba(221, 183, 255, 0.32);
    outline-offset: 3px;
  }

  &:active {
    transform: scale(0.95);
  }
`;

export const TextButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  align-self: center;
  width: fit-content;
  border: none;
  border-radius: 4px;
  padding: 0 4px;
  background: transparent;
  color: #ddb7ff;
  font-size: 12px;
  line-height: 16px;
  font-weight: 500;
  letter-spacing: 0;
  cursor: pointer;

  &:hover {
    text-decoration: underline;
  }

  &:focus-visible {
    outline: 3px solid rgba(221, 183, 255, 0.32);
    outline-offset: 3px;
  }
`;

const Styles = {
  Page,
  BackgroundGradient,
  BackgroundPhoto,
  Main,
  GlassContainer,
  Header,
  Form,
  Fields,
  Field,
  InputGroup,
  Icon,
  Input,
  ErrorMessage,
  StatusMessage,
  NeonButton,
  ResultArea,
  ResultBox,
  ResultIcon,
  ResultLabel,
  ResultTitle,
  ResultDescription,
  ResultNote,
  ResultActions,
  LoginLink,
  GlassButton,
  TextButton,
};

export default Styles;
