import styled from "styled-components";
import { Link } from "react-router-dom";

export const Page = styled.section`
  min-height: 100vh;
  background:
    radial-gradient(circle at 18% 0%, rgba(255, 45, 117, 0.2), transparent 30%),
    radial-gradient(circle at 88% 12%, rgba(0, 212, 255, 0.16), transparent 30%),
    linear-gradient(180deg, #080914 0%, #0d1020 50%, #05060d 100%);
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

export const HeaderRow = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 18px;
  margin-bottom: 24px;
`;

export const TitleGroup = styled.div`
  min-width: 0;
`;

export const Title = styled.h1`
  margin: 0;
  color: #ffffff;
  font-size: 30px;
  font-weight: 900;
  line-height: 1.25;
`;

export const Description = styled.p`
  margin: 8px 0 0;
  color: #aab4cd;
  font-size: 14px;
  font-weight: 700;
  line-height: 1.55;
`;

export const TotalBox = styled.div`
  min-width: 88px;
  text-align: right;
`;

export const TotalNumber = styled.p`
  margin: 0;
  color: #ffffff;
  font-size: 20px;
  font-weight: 900;
  line-height: 1;
`;

export const TotalLabel = styled.p`
  margin: 4px 0 0;
  color: #8f9ab5;
  font-size: 10px;
  font-weight: 900;
`;

export const ReviewGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 22px;

  @media (max-width: 760px) {
    grid-template-columns: 1fr;
  }
`;

export const ReviewCard = styled.article`
  min-width: 0;
  border: 1px solid rgba(143, 157, 255, 0.22);
  border-radius: 8px;
  background: rgba(17, 21, 42, 0.92);
  overflow: hidden;
  box-shadow:
    0 18px 48px rgba(0, 0, 0, 0.28),
    0 0 34px rgba(155, 92, 255, 0.08);
`;

export const CardImageWrap = styled.div`
  position: relative;
  height: 168px;
  overflow: hidden;
`;

export const CardImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  filter: saturate(1.08);
`;

export const CategoryBadge = styled.span`
  position: absolute;
  left: 14px;
  bottom: 14px;
  display: inline-flex;
  align-items: center;
  min-height: 24px;
  padding: 0 9px;
  border-radius: 999px;
  background: rgba(8, 9, 20, 0.76);
  color: #dfc4ff;
  font-size: 10px;
  font-weight: 900;
`;

export const CardBody = styled.div`
  padding: 18px;
`;

export const CardTitleRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
`;

export const CardTitle = styled.h2`
  margin: 0;
  color: #ffffff;
  font-size: 18px;
  font-weight: 900;
  line-height: 1.35;
`;

export const StarList = styled.div`
  display: flex;
  flex: 0 0 auto;
  gap: 2px;
  color: #ffd36c;
`;

export const CardDate = styled.p`
  margin: 5px 0 12px;
  color: #8f9ab5;
  font-size: 12px;
  font-weight: 800;
`;

export const CardText = styled.p`
  display: -webkit-box;
  min-height: 66px;
  margin: 0;
  color: #b5bed2;
  font-size: 13px;
  line-height: 1.6;
  overflow: hidden;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 3;
`;

export const CardActions = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-top: 16px;
`;

export const ReviewLink = styled(Link)`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 5px;
  min-height: 34px;
  padding: 0 12px;
  border: 1px solid rgba(143, 157, 255, 0.24);
  border-radius: 999px;
  background: rgba(15, 19, 38, 0.66);
  color: #f8fbff;
  font-size: 12px;
  font-weight: 900;
  text-decoration: none;

  &:hover {
    border-color: rgba(255, 45, 117, 0.58);
    color: #ff9fc2;
  }
`;

export const Pagination = styled.nav`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  margin: 34px auto 0;
`;

export const PageButton = styled.button`
  display: grid;
  place-items: center;
  width: 36px;
  height: 36px;
  border: 1px solid rgba(143, 157, 255, 0.28);
  border-radius: 8px;
  background: rgba(15, 19, 38, 0.66);
  color: #f8fbff;

  &:disabled {
    color: rgba(248, 251, 255, 0.3);
    cursor: not-allowed;
  }
`;

export const PageNumberButton = styled.button`
  min-width: 36px;
  height: 36px;
  padding: 0 10px;
  border: 1px solid
    ${({ $active }) =>
      $active ? "rgba(255, 45, 117, 0.68)" : "rgba(143, 157, 255, 0.28)"};
  border-radius: 8px;
  background: ${({ $active }) =>
    $active
      ? "linear-gradient(135deg, #ff2d75, #9b5cff)"
      : "rgba(15, 19, 38, 0.66)"};
  color: #ffffff;
  font: inherit;
  font-size: 13px;
  font-weight: 900;
  box-shadow: ${({ $active }) =>
    $active ? "0 0 24px rgba(255, 45, 117, 0.26)" : "none"};
`;

export const EmptyPanel = styled.section`
  display: grid;
  min-height: 560px;
  place-items: center;
  padding: 48px 24px;
  border: 1px solid rgba(143, 157, 255, 0.24);
  border-radius: 8px;
  background:
    linear-gradient(180deg, rgba(17, 21, 42, 0.9), rgba(13, 16, 32, 0.86)),
    radial-gradient(circle at 100% 100%, rgba(155, 92, 255, 0.18), transparent 34%);
  box-shadow:
    0 18px 48px rgba(0, 0, 0, 0.34),
    0 0 36px rgba(0, 212, 255, 0.08);
`;

export const EmptyContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
`;

export const EmptyIcon = styled.div`
  display: grid;
  place-items: center;
  width: 94px;
  height: 94px;
  margin-bottom: 22px;
  border: 1px solid rgba(201, 155, 255, 0.42);
  border-radius: 50%;
  background: rgba(155, 92, 255, 0.13);
  color: #c99bff;
  box-shadow:
    0 0 0 8px rgba(155, 92, 255, 0.06),
    0 0 32px rgba(155, 92, 255, 0.24);
`;

export const EmptyTitle = styled.h2`
  margin: 0;
  color: #ffffff;
  font-size: 20px;
  font-weight: 900;
  line-height: 1.35;
`;

export const EmptyDescription = styled.p`
  margin: 10px 0 24px;
  color: #b5bed2;
  font-size: 13px;
  font-weight: 700;
  line-height: 1.65;
`;

export const EmptyButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 7px;
  height: 42px;
  padding: 0 18px;
  border: 1px solid rgba(143, 157, 255, 0.28);
  border-radius: 999px;
  background: rgba(15, 19, 38, 0.66);
  color: #f8fbff;
  font-size: 13px;
  font-weight: 900;

  &:hover {
    border-color: rgba(255, 45, 117, 0.58);
    color: #ff9fc2;
  }
`;
