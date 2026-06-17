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

export const ProfilePanel = styled.section`
  min-height: 560px;
  padding: 38px 40px;
  border: 1px solid rgba(143, 157, 255, 0.24);
  border-radius: 8px;
  background:
    linear-gradient(180deg, rgba(17, 21, 42, 0.9), rgba(13, 16, 32, 0.86)),
    radial-gradient(circle at 0% 100%, rgba(155, 92, 255, 0.16), transparent 34%);
  box-shadow:
    0 18px 48px rgba(0, 0, 0, 0.34),
    0 0 36px rgba(0, 212, 255, 0.08);

  @media (max-width: 720px) {
    padding: 28px 22px;
  }
`;

export const Title = styled.h1`
  margin: 0 0 34px;
  color: #ffffff;
  font-size: 28px;
  font-weight: 800;
  line-height: 1.2;
`;

export const ProfileBody = styled.div`
  display: grid;
  grid-template-columns: 138px minmax(0, 1fr);
  gap: 44px;
  align-items: start;

  @media (max-width: 720px) {
    grid-template-columns: 1fr;
    gap: 24px;
  }
`;

export const AvatarColumn = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 14px;
`;

export const AvatarImage = styled.img`
  width: 112px;
  height: 112px;
  border: 3px solid rgba(155, 92, 255, 0.78);
  border-radius: 50%;
  object-fit: cover;
  box-shadow:
    0 0 0 4px rgba(255, 45, 117, 0.16),
    0 0 34px rgba(155, 92, 255, 0.26);
`;

export const AvatarCaption = styled.p`
  width: 130px;
  margin: 0;
  color: #aab4cd;
  font-size: 12px;
  font-weight: 700;
  line-height: 1.5;
  text-align: center;
`;

export const FormArea = styled.div`
  display: flex;
  min-width: 0;
  flex-direction: column;
  gap: 24px;
`;

export const FieldGroup = styled.div`
  min-width: 0;
`;

export const Label = styled.label`
  display: block;
  margin: 0 0 9px;
  color: #bfc8dc;
  font-size: 13px;
  font-weight: 800;
`;

export const InputRow = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  gap: 10px;

  @media (max-width: 560px) {
    grid-template-columns: 1fr;
  }
`;

export const IconField = styled.div`
  display: flex;
  align-items: center;
  min-width: 0;
  height: 48px;
  padding: 0 14px;
  border: 1px solid rgba(143, 157, 255, 0.22);
  border-radius: 8px;
  background: ${({ $disabled }) =>
    $disabled ? "rgba(31, 38, 64, 0.64)" : "rgba(22, 27, 48, 0.92)"};
  color: ${({ $disabled }) => ($disabled ? "#7d879d" : "#aeb8d2")};
`;

export const TextInput = styled.input`
  width: 100%;
  min-width: 0;
  height: 100%;
  margin-left: 10px;
  border: 0;
  background: transparent;
  color: #ffffff;
  font-size: 14px;
  font-weight: 700;

  &[readonly] {
    color: #a2acc3;
    cursor: not-allowed;
  }
`;

export const HelperText = styled.p`
  min-height: 20px;
  margin: 8px 0 0;
  color: ${({ $success }) => ($success ? "#75f0bf" : "#8f9ab5")};
  font-size: 12px;
  line-height: 1.45;
`;

export const CheckButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  height: 48px;
  padding: 0 16px;
  border: 1px solid rgba(0, 212, 255, 0.42);
  border-radius: 8px;
  background: rgba(0, 212, 255, 0.08);
  color: #8ff0ff;
  font-size: 13px;
  font-weight: 900;
  white-space: nowrap;

  &:hover {
    background: rgba(0, 212, 255, 0.15);
  }

  &:disabled {
    border-color: rgba(143, 157, 255, 0.16);
    background: rgba(31, 38, 64, 0.54);
    color: #6f7a92;
    cursor: not-allowed;
  }
`;

export const SecurityCard = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 18px;
  min-height: 72px;
  padding: 14px 16px;
  border: 1px solid rgba(143, 157, 255, 0.18);
  border-radius: 8px;
  background: rgba(22, 27, 48, 0.72);

  @media (max-width: 560px) {
    align-items: stretch;
    flex-direction: column;
  }
`;

export const SecurityInfo = styled.div`
  display: flex;
  align-items: center;
  min-width: 0;
  gap: 12px;
`;

export const SecurityIcon = styled.span`
  display: grid;
  place-items: center;
  flex: 0 0 auto;
  width: 38px;
  height: 38px;
  border-radius: 50%;
  background: rgba(143, 157, 255, 0.16);
  color: #bac4ff;
`;

export const SecurityTitle = styled.p`
  margin: 0;
  color: #ffffff;
  font-size: 14px;
  font-weight: 900;
`;

export const SecurityMeta = styled.p`
  margin: 4px 0 0;
  color: #8f9ab5;
  font-size: 12px;
  font-weight: 700;
`;

export const SecondaryButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  height: 36px;
  padding: 0 14px;
  border: 1px solid rgba(143, 157, 255, 0.32);
  border-radius: 8px;
  background: rgba(13, 16, 32, 0.86);
  color: #ffffff;
  font-size: 13px;
  font-weight: 800;

  &:hover {
    border-color: rgba(255, 45, 117, 0.54);
    color: #ff9fc2;
  }
`;

export const ActionRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 14px;
  margin-top: 8px;
`;

export const CancelButton = styled.button`
  min-width: 74px;
  height: 44px;
  color: #aab4cd;
  font-size: 14px;
  font-weight: 800;
`;

export const PrimaryButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 138px;
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
