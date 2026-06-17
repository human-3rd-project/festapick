import styled from "styled-components";

export const Page = styled.section`
  min-height: 100vh;
  background:
    radial-gradient(circle at 18% 0%, rgba(255, 45, 117, 0.14), transparent 28%),
    radial-gradient(circle at 84% 12%, rgba(0, 212, 255, 0.1), transparent 30%),
    linear-gradient(180deg, #080914 0%, #0d1020 52%, #05060d 100%);
  color: #f8fbff;
`;

export const Container = styled.div`
  display: grid;
  grid-template-columns: 240px minmax(0, 1fr);
  gap: 32px;
  width: min(1120px, calc(100% - 40px));
  margin: 0 auto;
  padding: 56px 0 72px;

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
    gap: 20px;
    width: min(100% - 32px, 680px);
    padding: 28px 0 56px;
  }
`;

export const Content = styled.main`
  min-width: 0;
`;

export const DangerPanel = styled.section`
  box-sizing: border-box;
  width: 100%;
  min-height: 238px;
  padding: 42px 46px;
  border: 1px solid rgba(255, 130, 130, 0.28);
  border-radius: 8px;
  background:
    linear-gradient(180deg, rgba(17, 21, 42, 0.92), rgba(13, 16, 32, 0.88)),
    radial-gradient(circle at 100% 0%, rgba(255, 45, 117, 0.12), transparent 34%);
  box-shadow:
    0 18px 48px rgba(0, 0, 0, 0.28),
    0 0 28px rgba(255, 45, 117, 0.06);

  @media (max-width: 680px) {
    padding: 30px 22px;
  }
`;

export const PanelHeader = styled.div`
  padding-bottom: 20px;
  border-bottom: 1px solid rgba(255, 130, 130, 0.22);
`;

export const DangerTitle = styled.h1`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  margin: 0;
  color: #ff9b9b;
  font-size: 19px;
  font-weight: 900;
  line-height: 1.3;
`;

export const PanelBody = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 28px;
  padding-top: 26px;

  @media (max-width: 760px) {
    align-items: flex-start;
    flex-direction: column;
  }
`;

export const TextGroup = styled.div`
  min-width: 0;
`;

export const SectionTitle = styled.h2`
  margin: 0 0 12px;
  color: #ffffff;
  font-size: 16px;
  font-weight: 900;
  line-height: 1.4;
`;

export const Description = styled.p`
  max-width: 600px;
  margin: 0;
  color: #c0c8dc;
  font-size: 14px;
  font-weight: 700;
  line-height: 1.68;
`;

export const DeleteButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex: 0 0 auto;
  min-width: 136px;
  height: 50px;
  padding: 0 18px;
  border: 1px solid rgba(255, 154, 154, 0.72);
  border-radius: 8px;
  background: rgba(255, 45, 117, 0.04);
  color: #ffb2b2;
  font-size: 14px;
  font-weight: 900;
  box-shadow: inset 0 0 0 1px rgba(255, 154, 154, 0.06);

  &:hover {
    background: rgba(255, 45, 117, 0.13);
    color: #ffffff;
  }
`;

export const ResultMessage = styled.p`
  box-sizing: border-box;
  width: 100%;
  margin: 18px 0 0;
  padding: 14px 16px;
  border: 1px solid rgba(255, 154, 154, 0.32);
  border-radius: 8px;
  background: rgba(255, 45, 117, 0.08);
  color: #ffb2b2;
  font-size: 13px;
  font-weight: 900;
`;

export const ModalOverlay = styled.div`
  position: fixed;
  inset: 0;
  z-index: 40;
  display: grid;
  place-items: center;
  padding: 24px;
  background: rgba(5, 6, 13, 0.74);
  backdrop-filter: blur(4px);
`;

export const ModalPanel = styled.div`
  width: min(100%, 430px);
  padding: 30px;
  border: 1px solid rgba(255, 130, 130, 0.34);
  border-radius: 8px;
  background:
    linear-gradient(180deg, rgba(25, 30, 52, 0.98), rgba(17, 21, 42, 0.98)),
    radial-gradient(circle at 100% 0%, rgba(255, 45, 117, 0.16), transparent 34%);
  text-align: center;
  box-shadow:
    0 26px 70px rgba(0, 0, 0, 0.48),
    0 0 38px rgba(255, 45, 117, 0.14);
`;

export const ModalIcon = styled.div`
  display: grid;
  place-items: center;
  width: 64px;
  height: 64px;
  margin: 0 auto 18px;
  border-radius: 50%;
  background: rgba(255, 45, 117, 0.14);
  color: #ff9b9b;
  box-shadow: 0 0 28px rgba(255, 45, 117, 0.18);
`;

export const ModalTitle = styled.h2`
  margin: 0;
  color: #ffffff;
  font-size: 22px;
  font-weight: 900;
  line-height: 1.35;
`;

export const ModalDescription = styled.p`
  margin: 12px 0 24px;
  color: #c0c8dc;
  font-size: 14px;
  font-weight: 700;
  line-height: 1.65;
`;

export const ModalActions = styled.div`
  display: flex;
  justify-content: center;
  gap: 10px;
`;

export const CancelButton = styled.button`
  min-width: 92px;
  height: 42px;
  padding: 0 16px;
  border: 1px solid rgba(143, 157, 255, 0.24);
  border-radius: 8px;
  background: rgba(15, 19, 38, 0.72);
  color: #c0c8dc;
  font-size: 14px;
  font-weight: 900;

  &:hover {
    background: rgba(255, 255, 255, 0.07);
    color: #ffffff;
  }
`;

export const ConfirmDeleteButton = styled.button`
  min-width: 104px;
  height: 42px;
  padding: 0 16px;
  border: 1px solid rgba(255, 154, 154, 0.72);
  border-radius: 8px;
  background: rgba(255, 45, 117, 0.16);
  color: #ffb2b2;
  font-size: 14px;
  font-weight: 900;

  &:hover {
    background: rgba(255, 45, 117, 0.24);
    color: #ffffff;
  }
`;
