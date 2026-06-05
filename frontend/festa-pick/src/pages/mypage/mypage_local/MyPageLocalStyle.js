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
    width: min(100% - 32px, 720px);
    padding: 28px 0 56px;
  }
`;

export const Content = styled.main`
  min-width: 0;
`;

export const Panel = styled.section`
  display: grid;
  grid-template-columns: minmax(0, 1fr) 330px;
  gap: 42px;
  align-items: center;
  min-height: 520px;
  padding: 48px;
  border: 1px solid rgba(143, 157, 255, 0.24);
  border-radius: 8px;
  background:
    linear-gradient(180deg, rgba(17, 21, 42, 0.92), rgba(13, 16, 32, 0.88)),
    radial-gradient(circle at 100% 0%, rgba(155, 92, 255, 0.18), transparent 34%);
  box-shadow:
    0 18px 48px rgba(0, 0, 0, 0.34),
    0 0 36px rgba(0, 212, 255, 0.08);

  @media (max-width: 1040px) {
    grid-template-columns: 1fr;
    align-items: stretch;
  }

  @media (max-width: 620px) {
    padding: 28px 22px;
  }
`;

export const FormSection = styled.div`
  width: min(100%, 350px);
`;

export const Title = styled.h1`
  display: flex;
  align-items: center;
  gap: 8px;
  margin: 0 0 34px;
  color: #ffffff;
  font-size: 28px;
  font-weight: 800;
  line-height: 1.2;
`;

export const RequiredDot = styled.span`
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #ff8fc7;
  box-shadow: 0 0 14px rgba(255, 45, 117, 0.78);
`;

export const FieldGroup = styled.div`
  margin-bottom: 18px;
`;

export const Label = styled.label`
  display: block;
  margin: 0 0 9px;
  color: #aab4cd;
  font-size: 13px;
  font-weight: 800;
`;

export const Select = styled.select`
  width: 100%;
  height: 54px;
  padding: 0 16px;
  border: 1px solid rgba(143, 157, 255, 0.24);
  border-radius: 8px;
  background: rgba(31, 38, 64, 0.78);
  color: #ffffff;
  font-size: 14px;
  font-weight: 800;
  outline: none;

  &:focus {
    border-color: rgba(255, 143, 199, 0.7);
    box-shadow: 0 0 0 3px rgba(255, 45, 117, 0.12);
  }
`;

export const PrimaryButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  width: 230px;
  height: 54px;
  margin: 14px 0 22px;
  border-radius: 8px;
  background: linear-gradient(135deg, #b65cff, #ff2d75);
  color: #ffffff;
  font-size: 14px;
  font-weight: 900;
  box-shadow: 0 0 26px rgba(255, 45, 117, 0.28);

  &:hover {
    background: linear-gradient(135deg, #c678ff, #ff4f8b);
  }
`;

export const NoticeBox = styled.div`
  display: flex;
  gap: 10px;
  width: min(100%, 330px);
  padding: 16px;
  border: 1px solid rgba(143, 157, 255, 0.18);
  border-radius: 8px;
  background: rgba(13, 16, 32, 0.58);
  color: #b5bed2;
  font-size: 13px;
  font-weight: 700;
  line-height: 1.55;

  svg {
    flex: 0 0 auto;
    margin-top: 2px;
    color: #c99bff;
  }
`;

export const MapCard = styled.aside`
  width: 100%;
  max-width: 340px;
  justify-self: end;
  border: 1px solid rgba(255, 143, 199, 0.28);
  border-radius: 8px;
  background: rgba(20, 25, 45, 0.86);
  box-shadow:
    0 0 0 1px rgba(155, 92, 255, 0.16),
    0 0 34px rgba(255, 143, 199, 0.18);
  overflow: hidden;

  @media (max-width: 1040px) {
    justify-self: start;
  }
`;

export const MapHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 48px;
  padding: 0 14px;
  border-bottom: 1px solid rgba(143, 157, 255, 0.16);
`;

export const MapTitle = styled.p`
  margin: 0;
  color: #cfd8ef;
  font-size: 12px;
  font-weight: 900;
`;

export const LiveBadge = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 5px;
  color: #ff8fc7;
  font-size: 11px;
  font-weight: 900;

  span {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: #ff2d75;
    box-shadow: 0 0 12px rgba(255, 45, 117, 0.8);
  }
`;

export const MapCanvas = styled.div`
  position: relative;
  height: 230px;
  background:
    radial-gradient(circle at 50% 55%, rgba(201, 155, 255, 0.28), transparent 18%),
    radial-gradient(circle at 50% 55%, rgba(255, 143, 199, 0.18), transparent 28%),
    linear-gradient(135deg, rgba(17, 21, 42, 0.64), rgba(4, 8, 18, 0.94));
  overflow: hidden;
`;

export const GridLines = styled.div`
  position: absolute;
  inset: -40px;
  background:
    linear-gradient(rgba(143, 157, 255, 0.08) 1px, transparent 1px),
    linear-gradient(90deg, rgba(143, 157, 255, 0.08) 1px, transparent 1px);
  background-size: 28px 28px;
  transform: rotate(-14deg);
`;

export const MapGlow = styled.div`
  position: absolute;
  inset: 42px 64px;
  border: 1px solid rgba(201, 155, 255, 0.44);
  border-radius: 50%;
  background: rgba(201, 155, 255, 0.12);
  filter: blur(0.2px);
`;

export const PinPulse = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  display: grid;
  place-items: center;
  width: 56px;
  height: 56px;
  border: 1px solid rgba(255, 255, 255, 0.36);
  border-radius: 50%;
  background: rgba(201, 155, 255, 0.35);
  color: #f1ddff;
  transform: translate(-50%, -50%);
  box-shadow:
    0 0 0 18px rgba(201, 155, 255, 0.08),
    0 0 30px rgba(201, 155, 255, 0.3);
`;

export const MapLabel = styled.div`
  position: absolute;
  left: 16px;
  bottom: 16px;
  padding: 8px 10px;
  border-radius: 6px;
  background: rgba(8, 9, 20, 0.72);
  color: #dbe5ff;
  font-size: 12px;
  font-weight: 800;
`;
