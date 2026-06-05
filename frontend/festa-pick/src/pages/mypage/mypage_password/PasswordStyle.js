import styled from "styled-components";

export const Page = styled.section`
  min-height: 100vh;
  background:
    radial-gradient(circle at 20% 12%, rgba(255, 45, 117, 0.14), transparent 32%),
    radial-gradient(circle at 82% 8%, rgba(0, 212, 255, 0.14), transparent 30%),
    linear-gradient(180deg, #080914 0%, #0d1020 48%, #05060d 100%);
  color: #f8fbff;
`;

export const Container = styled.div`
  display: grid;
  grid-template-columns: 240px minmax(0, 1fr);
  gap: 32px;
  width: min(1120px, calc(100% - 40px));
  margin: 0 auto;
  padding: 48px 0 72px;

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

export const Panel = styled.section`
  display: flex;
  width: min(100%, 560px);
  min-height: 460px;
  flex-direction: column;
  align-items: stretch;
  padding: 40px;
  border: 1px solid rgba(143, 157, 255, 0.24);
  border-radius: 8px;
  background: rgba(17, 21, 42, 0.9);
  box-shadow:
    0 18px 48px rgba(0, 0, 0, 0.34),
    0 0 36px rgba(0, 212, 255, 0.08);

  @media (max-width: 620px) {
    padding: 30px 22px;
  }
`;

export const IconCircle = styled.div`
  display: grid;
  place-items: center;
  width: 58px;
  height: 58px;
  margin-bottom: 20px;
  border-radius: 50%;
  background: rgba(255, 45, 117, 0.14);
  color: #ff8bb5;
`;

export const Title = styled.h1`
  margin: 0;
  color: #ffffff;
  font-size: 28px;
  font-weight: 900;
  line-height: 1.2;
`;

export const Description = styled.p`
  margin: 10px 0 28px;
  color: #aab4cd;
  font-size: 14px;
  line-height: 1.6;
`;

export const AccountBox = styled.div`
  margin-bottom: 24px;
  padding: 15px 16px;
  border: 1px solid rgba(143, 157, 255, 0.18);
  border-radius: 8px;
  background: rgba(22, 27, 48, 0.72);
`;

export const AccountLabel = styled.p`
  margin: 0 0 5px;
  color: #8f9ab5;
  font-size: 12px;
  font-weight: 800;
`;

export const AccountValue = styled.p`
  margin: 0;
  color: #ffffff;
  font-size: 14px;
  font-weight: 900;
`;

export const FieldGroup = styled.div`
  margin-bottom: 22px;
`;

export const Label = styled.label`
  display: block;
  margin-bottom: 9px;
  color: #bfc8dc;
  font-size: 13px;
  font-weight: 800;
`;

export const TextInput = styled.input`
  width: 100%;
  height: 48px;
  padding: 0 14px;
  border: 1px solid rgba(143, 157, 255, 0.22);
  border-radius: 8px;
  background: rgba(22, 27, 48, 0.92);
  color: #ffffff;
  font-size: 14px;
  font-weight: 800;
`;

export const HelperText = styled.p`
  min-height: 20px;
  margin: 8px 0 0;
  color: #ff8bb5;
  font-size: 12px;
  line-height: 1.45;
`;

export const ActionRow = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 14px;
  margin-top: auto;
`;

export const CancelButton = styled.button`
  min-width: 74px;
  height: 44px;
  color: #aab4cd;
  font-size: 14px;
  font-weight: 800;
`;

export const PrimaryButton = styled.button`
  min-width: 108px;
  height: 44px;
  padding: 0 18px;
  border-radius: 8px;
  background: linear-gradient(135deg, #9b5cff, #ff8fc7);
  color: #ffffff;
  font-size: 14px;
  font-weight: 900;
  box-shadow: 0 0 24px rgba(255, 45, 117, 0.26);

  &:hover {
    background: linear-gradient(135deg, #ad75ff, #ffa4d3);
  }
`;
