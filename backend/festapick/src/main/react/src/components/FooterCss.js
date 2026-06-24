import styled from "styled-components";

const colors = {
  background: "#081124",
  border: "rgba(255, 255, 255, 0.08)",
  brand: "#ddb7ff",
  text: "#cfc2d6",
  muted: "rgba(207, 194, 214, 0.68)",
};

export const FooterBar = styled.footer`
  width: 100%;
  border-top: 1px solid ${colors.border};
  background: ${colors.background};
  color: ${colors.text};
  font-family: "Plus Jakarta Sans", "Pretendard", "Noto Sans KR", sans-serif;
`;

export const FooterInner = styled.div`
  width: min(100%, 1280px);
  min-height: 284px;
  margin: 0 auto;
  padding: 72px 40px 28px;
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(320px, 420px);
  grid-template-rows: 1fr auto;
  column-gap: 48px;

  @media (max-width: 768px) {
    min-height: auto;
    padding: 48px 24px 32px;
    grid-template-columns: 1fr;
    grid-template-rows: auto;
    gap: 42px;
  }
`;

export const FooterMenu = styled.nav`
  display: flex;
  flex-wrap: wrap;
  align-content: flex-start;
  gap: 14px 32px;
  max-width: 560px;

  @media (max-width: 768px) {
    max-width: 100%;
    gap: 12px 24px;
  }
`;

export const FooterLink = styled.a`
  color: ${colors.muted};
  font-size: 16px;
  line-height: 24px;
  font-weight: 500;
  letter-spacing: 0;
  text-decoration: none;
  transition: color 180ms ease;

  &:hover {
    color: ${colors.brand};
  }

  @media (max-width: 520px) {
    flex: 0 0 calc(50% - 12px);
    font-size: 15px;
  }
`;

export const FooterRight = styled.div`
  justify-self: end;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 18px;
  text-align: right;

  @media (max-width: 768px) {
    justify-self: start;
    align-items: flex-start;
    text-align: left;
  }
`;

export const IconGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 14px;
`;

export const IconButton = styled.a`
  width: 28px;
  height: 28px;
  display: inline-grid;
  place-items: center;
  color: ${colors.text};
  text-decoration: none;
  transition:
    color 180ms ease,
    transform 180ms ease;

  &:hover {
    color: ${colors.brand};
    transform: translateY(-1px);
  }
`;

export const Copyright = styled.p`
  max-width: 430px;
  margin: 0;
  color: ${colors.muted};
  font-size: 18px;
  line-height: 1.45;
  font-weight: 500;
  letter-spacing: 0;

  @media (max-width: 520px) {
    font-size: 15px;
  }
`;

export const BrandName = styled.a`
  align-self: end;
  justify-self: start;
  color: ${colors.brand};
  font-size: 28px;
  line-height: 36px;
  font-weight: 800;
  letter-spacing: 0;
  text-decoration: none;
  transition: color 180ms ease;

  &:hover {
    color: #ffb0cd;
  }

  @media (max-width: 768px) {
    order: 3;
  }
`;
