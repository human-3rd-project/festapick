import styled from "styled-components";
import { Link } from "react-router-dom";

export const Page = styled.section`
  min-height: 100vh;
  background:
    radial-gradient(
      circle at 18% 0%,
      rgba(255, 45, 117, 0.24),
      transparent 30%
    ),
    radial-gradient(circle at 84% 12%, rgba(0, 212, 255, 0.2), transparent 32%),
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

export const TitleRow = styled.div`
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 22px;
`;

export const TitleGroup = styled.div`
  min-width: 0;
`;

export const Eyebrow = styled.p`
  margin: 0 0 6px;
  color: #00d4ff;
  font-size: 13px;
  font-weight: 900;
  text-shadow: 0 0 18px rgba(0, 212, 255, 0.45);
`;

export const Title = styled.h1`
  margin: 0;
  color: #ffffff;
  font-size: 30px;
  font-weight: 900;
  line-height: 1.2;
`;

export const CountBadge = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 56px;
  height: 34px;
  padding: 0 14px;
  border: 1px solid rgba(143, 157, 255, 0.24);
  border-radius: 999px;
  background: rgba(15, 19, 38, 0.76);
  color: #f8fbff;
  font-size: 14px;
  font-weight: 900;
  box-shadow: 0 0 22px rgba(0, 212, 255, 0.12);
`;

export const FavoriteGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 18px;

  @media (max-width: 1100px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  @media (max-width: 620px) {
    grid-template-columns: 1fr;
  }
`;

export const FestivalCard = styled(Link)`
  display: flex;
  min-width: 0;
  min-height: 318px;
  flex-direction: column;
  border: 1px solid rgba(143, 157, 255, 0.24);
  border-radius: 8px;
  background: rgba(13, 16, 32, 0.88);
  color: inherit;
  overflow: hidden;
  text-decoration: none;
  box-shadow:
    0 18px 48px rgba(0, 0, 0, 0.34),
    0 0 36px rgba(0, 212, 255, 0.08);

  &:hover {
    border-color: rgba(255, 45, 117, 0.58);
    box-shadow:
      0 18px 48px rgba(0, 0, 0, 0.34),
      0 0 34px rgba(255, 45, 117, 0.2);
  }
`;

export const FestivalPoster = styled.div`
  position: relative;
  display: flex;
  height: 168px;
  align-items: flex-end;
  padding: 16px;
  background:
    linear-gradient(145deg, rgba(8, 9, 20, 0.04), rgba(8, 9, 20, 0.78)),
    radial-gradient(
      circle at 32% 20%,
      rgba(255, 255, 255, 0.56),
      transparent 28%
    ),
    radial-gradient(
      circle at 82% 70%,
      rgba(0, 212, 255, 0.34),
      transparent 34%
    ),
    linear-gradient(135deg, ${({ $color }) => $color || "#ff2d75"}, #080914);
`;

export const PosterCategory = styled.span`
  display: inline-flex;
  align-items: center;
  min-height: 30px;
  padding: 0 11px;
  border-radius: 999px;
  background: rgba(8, 9, 20, 0.76);
  color: #ffffff;
  font-size: 12px;
  font-weight: 900;
`;

export const PosterHeart = styled.span`
  position: absolute;
  top: 14px;
  right: 14px;
  display: grid;
  place-items: center;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: rgba(8, 9, 20, 0.78);
  color: #ff2d75;
  box-shadow: 0 0 24px rgba(255, 45, 117, 0.38);
`;

export const FestivalInfo = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: 10px;
  padding: 18px;
`;

export const FestivalTitle = styled.h2`
  margin: 0 0 4px;
  color: #ffffff;
  font-size: 17px;
  font-weight: 900;
  line-height: 1.36;
`;

export const MetaRow = styled.p`
  display: flex;
  align-items: flex-start;
  gap: 8px;
  margin: 0;
  color: #b5bed2;
  font-size: 13px;
  line-height: 1.45;
`;

export const Pagination = styled.nav`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  margin-top: 26px;
`;

export const PageButton = styled.button`
  display: grid;
  place-items: center;
  width: 36px;
  height: 36px;
  border: 1px solid rgba(143, 157, 255, 0.24);
  border-radius: 6px;
  background: rgba(15, 19, 38, 0.76);
  color: #f8fbff;
  cursor: pointer;

  &:disabled {
    color: rgba(248, 251, 255, 0.32);
    cursor: not-allowed;
  }
`;

export const PageNumberButton = styled.button`
  min-width: 36px;
  height: 36px;
  padding: 0 10px;
  border: 1px solid
    ${({ $active }) =>
      $active ? "rgba(255, 45, 117, 0.68)" : "rgba(143, 157, 255, 0.24)"};
  border-radius: 6px;
  background: ${({ $active }) =>
    $active
      ? "linear-gradient(135deg, #ff2d75, #9b5cff)"
      : "rgba(15, 19, 38, 0.76)"};
  color: #ffffff;
  font: inherit;
  font-size: 14px;
  font-weight: 900;
  cursor: pointer;
  box-shadow: ${({ $active }) =>
    $active ? "0 0 24px rgba(255, 45, 117, 0.26)" : "none"};
`;

export const FindMoreButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 180px;
  height: 46px;
  margin: 26px auto 0;
  padding: 0 24px;
  border: 0;
  border-radius: 6px;
  background: linear-gradient(135deg, #ff2d75, #9b5cff);
  color: #ffffff;
  font: inherit;
  font-size: 15px;
  font-weight: 900;
  cursor: pointer;
  box-shadow: 0 0 24px rgba(255, 45, 117, 0.28);

  &:hover {
    background: linear-gradient(135deg, #ff4f8b, #b076ff);
  }
`;

export const EmptyState = styled.div`
  display: flex;
  min-height: 440px;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 48px 24px;
  border: 1px solid rgba(143, 157, 255, 0.24);
  border-radius: 8px;
  background: rgba(13, 16, 32, 0.88);
  text-align: center;
  box-shadow:
    0 18px 48px rgba(0, 0, 0, 0.34),
    0 0 36px rgba(0, 212, 255, 0.08);
`;

export const EmptyIcon = styled.div`
  display: grid;
  place-items: center;
  width: 88px;
  height: 88px;
  margin-bottom: 22px;
  border-radius: 50%;
  background: rgba(255, 45, 117, 0.14);
  color: #ff8bb5;
  box-shadow: 0 0 30px rgba(255, 45, 117, 0.22);
`;

export const EmptyTitle = styled.h2`
  margin: 0;
  color: #ffffff;
  font-size: 24px;
  font-weight: 900;
  line-height: 1.35;
`;

export const EmptyDescription = styled.p`
  width: min(100%, 420px);
  margin: 12px 0 0;
  color: #b5bed2;
  font-size: 15px;
  line-height: 1.65;
`;
