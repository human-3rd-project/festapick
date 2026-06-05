import styled from "styled-components";
import { Link } from "react-router-dom";

export const Page = styled.section`
  min-height: 100vh;
  background:
    radial-gradient(circle at 16% 0%, rgba(255, 45, 117, 0.18), transparent 30%),
    radial-gradient(circle at 90% 12%, rgba(0, 212, 255, 0.12), transparent 32%),
    linear-gradient(180deg, #080914 0%, #0d1020 52%, #05060d 100%);
  color: #f8fbff;
`;

export const Content = styled.main`
  width: min(1120px, calc(100% - 40px));
  margin: 0 auto;
  padding: 52px 0 72px;

  @media (max-width: 720px) {
    width: min(100% - 28px, 640px);
    padding: 34px 0 56px;
  }
`;

export const HeaderRow = styled.div`
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 20px;
  margin-bottom: 22px;

  @media (max-width: 680px) {
    align-items: stretch;
    flex-direction: column;
  }
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
  color: #9ea9c4;
  font-size: 14px;
  font-weight: 700;
`;

export const Toolbar = styled.div`
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
`;

export const ToolButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 7px;
  min-width: 88px;
  height: 38px;
  padding: 0 14px;
  border: 1px solid
    ${({ $active }) =>
      $active ? "rgba(255, 143, 199, 0.58)" : "rgba(143, 157, 255, 0.2)"};
  border-radius: 999px;
  background: ${({ $active }) =>
    $active ? "rgba(255, 45, 117, 0.16)" : "rgba(15, 19, 38, 0.72)"};
  color: ${({ $active }) => ($active ? "#ffb7d4" : "#f8fbff")};
  font-size: 13px;
  font-weight: 900;

  &:hover {
    border-color: rgba(255, 143, 199, 0.56);
  }
`;

export const CalendarPanel = styled.section`
  padding: 20px;
  border: 1px solid rgba(143, 157, 255, 0.2);
  border-radius: 8px;
  background:
    linear-gradient(180deg, rgba(13, 16, 32, 0.94), rgba(9, 12, 26, 0.92)),
    radial-gradient(circle at 100% 0%, rgba(155, 92, 255, 0.12), transparent 34%);
  box-shadow:
    0 18px 48px rgba(0, 0, 0, 0.34),
    0 0 36px rgba(0, 212, 255, 0.06);
`;

export const CalendarHeader = styled.div`
  display: grid;
  grid-template-columns: 38px minmax(0, 1fr) 38px;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
`;

export const MonthButton = styled.button`
  display: grid;
  place-items: center;
  width: 38px;
  height: 38px;
  border: 1px solid rgba(143, 157, 255, 0.22);
  border-radius: 8px;
  background: rgba(15, 19, 38, 0.72);
  color: #f8fbff;

  &:hover {
    border-color: rgba(255, 45, 117, 0.48);
    color: #ff9fc2;
  }
`;

export const MonthTitle = styled.h2`
  margin: 0;
  color: #ffffff;
  font-size: 20px;
  font-weight: 900;
  text-align: center;
`;

export const WeekGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(7, minmax(0, 1fr));
  border-top: 1px solid rgba(143, 157, 255, 0.12);
  border-left: 1px solid rgba(143, 157, 255, 0.12);
`;

export const WeekDay = styled.div`
  display: grid;
  place-items: center;
  height: 36px;
  border-right: 1px solid rgba(143, 157, 255, 0.12);
  color: #9ea9c4;
  font-size: 12px;
  font-weight: 900;
`;

export const DayGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(7, minmax(0, 1fr));
  border-left: 1px solid rgba(143, 157, 255, 0.12);
`;

export const EmptyCell = styled.div`
  min-height: 112px;
  border-right: 1px solid rgba(143, 157, 255, 0.12);
  border-top: 1px solid rgba(143, 157, 255, 0.12);
  border-bottom: 1px solid rgba(143, 157, 255, 0.12);
  background: rgba(8, 9, 20, 0.22);

  @media (max-width: 760px) {
    min-height: 88px;
  }
`;

export const DayCell = styled.div`
  min-width: 0;
  min-height: 112px;
  padding: 10px;
  border-right: 1px solid rgba(143, 157, 255, 0.12);
  border-top: 1px solid rgba(143, 157, 255, 0.12);
  border-bottom: 1px solid rgba(143, 157, 255, 0.12);
  background: ${({ $hasFestival }) =>
    $hasFestival ? "rgba(17, 21, 42, 0.72)" : "rgba(8, 9, 20, 0.18)"};

  @media (max-width: 760px) {
    min-height: 88px;
    padding: 7px;
  }
`;

export const DayNumber = styled.div`
  margin-bottom: 8px;
  color: #cbd5ec;
  font-size: 12px;
  font-weight: 900;
  text-align: right;
`;

export const EventList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 5px;
`;

export const EventPill = styled(Link)`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 5px;
  min-height: 22px;
  padding: 0 7px;
  border: 1px solid rgba(255, 143, 199, 0.38);
  border-radius: 4px;
  background: rgba(255, 143, 199, 0.16);
  color: #f8d4e8;
  font-size: 10px;
  font-weight: 900;
  text-decoration: none;

  span {
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  svg {
    flex: 0 0 auto;
    color: #ff8fc7;
  }

  &:hover {
    border-color: rgba(255, 143, 199, 0.72);
    background: rgba(255, 143, 199, 0.24);
    color: #ffffff;
  }
`;

export const ModalOverlay = styled.div`
  position: fixed;
  inset: 0;
  z-index: 40;
  display: grid;
  place-items: center;
  padding: 24px;
  background: rgba(5, 6, 13, 0.78);
  backdrop-filter: blur(5px);
`;

export const FilterModal = styled.div`
  width: min(100%, 590px);
  border: 1px solid rgba(143, 157, 255, 0.24);
  border-radius: 8px;
  background:
    linear-gradient(180deg, rgba(17, 21, 42, 0.98), rgba(13, 16, 32, 0.98)),
    radial-gradient(circle at 100% 0%, rgba(155, 92, 255, 0.12), transparent 34%);
  box-shadow:
    0 26px 70px rgba(0, 0, 0, 0.48),
    0 0 38px rgba(155, 92, 255, 0.14);
`;

export const ModalHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding: 20px 22px 10px;
`;

export const ModalTitle = styled.h2`
  margin: 0;
  color: #ffffff;
  font-size: 17px;
  font-weight: 900;
`;

export const CloseButton = styled.button`
  display: grid;
  place-items: center;
  width: 34px;
  height: 34px;
  border-radius: 8px;
  color: #b5bed2;

  &:hover {
    background: rgba(255, 255, 255, 0.07);
    color: #ffffff;
  }
`;

export const FilterSection = styled.section`
  padding: 14px 22px;
`;

export const FilterLabelRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
`;

export const FilterLabel = styled.p`
  margin: 0 0 10px;
  color: #ffb7d4;
  font-size: 12px;
  font-weight: 900;
`;

export const FilterHelp = styled.span`
  color: #8f9ab5;
  font-size: 10px;
  font-weight: 800;
`;

export const SelectGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;

  @media (max-width: 560px) {
    grid-template-columns: 1fr;
  }
`;

export const Select = styled.select`
  width: 100%;
  height: 44px;
  padding: 0 12px;
  border: 1px solid rgba(143, 157, 255, 0.2);
  border-radius: 6px;
  background: rgba(8, 9, 20, 0.5);
  color: #ffffff;
  font-size: 12px;
  font-weight: 800;
`;

export const ThemeGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 12px;

  @media (max-width: 560px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
`;

export const ThemeButton = styled.button`
  display: flex;
  min-height: 76px;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 7px;
  border: 1px solid
    ${({ $active }) =>
      $active ? "rgba(255, 143, 199, 0.68)" : "rgba(143, 157, 255, 0.2)"};
  border-radius: 6px;
  background: ${({ $active }) =>
    $active ? "rgba(255, 143, 199, 0.14)" : "rgba(8, 9, 20, 0.34)"};
  color: ${({ $active }) => ($active ? "#ffb7d4" : "#dce5fa")};
  font-size: 11px;
  font-weight: 900;
  box-shadow: ${({ $active }) =>
    $active ? "0 0 24px rgba(255, 45, 117, 0.18)" : "none"};
`;

export const ModalActions = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 2fr);
  gap: 12px;
  padding: 16px 22px 18px;
  border-top: 1px solid rgba(143, 157, 255, 0.16);
`;

export const ResetButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 7px;
  height: 40px;
  border: 1px solid rgba(143, 157, 255, 0.28);
  border-radius: 6px;
  background: rgba(8, 9, 20, 0.5);
  color: #dce5fa;
  font-size: 12px;
  font-weight: 900;
`;

export const ApplyButton = styled.button`
  height: 40px;
  border-radius: 6px;
  background: linear-gradient(135deg, #d99cff, #ff9fc2);
  color: #1a1830;
  font-size: 12px;
  font-weight: 900;
  box-shadow: 0 0 24px rgba(255, 143, 199, 0.26);
`;
