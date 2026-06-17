import styled from "styled-components";

export const Page = styled.section`
  min-height: 100vh;
  background:
    radial-gradient(
      circle at 18% 0%,
      rgba(255, 45, 117, 0.22),
      transparent 30%
    ),
    radial-gradient(
      circle at 84% 12%,
      rgba(0, 212, 255, 0.18),
      transparent 32%
    ),
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

export const TitleRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 22px;
`;

export const Title = styled.h1`
  margin: 0;
  color: #ffffff;
  font-size: 30px;
  font-weight: 900;
  line-height: 1.2;
`;

export const RecordLayout = styled.section`
  display: grid;
  grid-template-columns: minmax(360px, 1fr)
    ${({ $hasSelectedDate }) => ($hasSelectedDate ? "280px" : "0")};
  gap: 22px;
  align-items: start;

  @media (max-width: 1080px) {
    grid-template-columns: 1fr;
  }
`;

export const CalendarPanel = styled.div`
  min-width: 0;
  padding: 24px;
  border: 1px solid rgba(143, 157, 255, 0.24);
  border-radius: 8px;
  background:
    linear-gradient(180deg, rgba(17, 21, 42, 0.94), rgba(13, 16, 32, 0.9)),
    radial-gradient(
      circle at 100% 0%,
      rgba(155, 92, 255, 0.16),
      transparent 34%
    );
  box-shadow:
    0 18px 48px rgba(0, 0, 0, 0.34),
    0 0 36px rgba(0, 212, 255, 0.08);
`;

export const CalendarHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 14px;
  margin-bottom: 22px;
`;

export const MonthTitle = styled.h2`
  margin: 0;
  color: #ffffff;
  font-size: 20px;
  font-weight: 900;
  line-height: 1.3;
`;

export const MonthControls = styled.div`
  display: flex;
  gap: 6px;
`;

export const MonthButton = styled.button`
  display: grid;
  place-items: center;
  width: 34px;
  height: 34px;
  border: 1px solid rgba(143, 157, 255, 0.22);
  border-radius: 8px;
  background: rgba(15, 19, 38, 0.72);
  color: #f8fbff;

  &:hover {
    border-color: rgba(255, 45, 117, 0.5);
    color: #ff9fc2;
  }
`;

export const WeekGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(7, minmax(0, 1fr));
  gap: 8px;
  margin-bottom: 8px;
`;

export const WeekDay = styled.div`
  display: grid;
  place-items: center;
  height: 30px;
  color: #8f9ab5;
  font-size: 12px;
  font-weight: 900;
`;

export const DayGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(7, minmax(0, 1fr));
  gap: 8px;
`;

export const EmptyDay = styled.div`
  aspect-ratio: 1;
`;

export const DayButton = styled.button`
  position: relative;
  display: grid;
  place-items: center;
  aspect-ratio: 1;
  min-height: 42px;
  border: 1px solid
    ${({ $active }) =>
      $active ? "rgba(255, 143, 199, 0.86)" : "rgba(143, 157, 255, 0)"};
  border-radius: 8px;
  background: ${({ $active }) =>
    $active ? "rgba(255, 143, 199, 0.18)" : "transparent"};
  color: ${({ $active }) => ($active ? "#ffffff" : "#c9d2e8")};
  font: inherit;
  font-size: 13px;
  font-weight: 800;
  box-shadow: ${({ $active }) =>
    $active ? "0 0 0 2px rgba(255, 143, 199, 0.12)" : "none"};

  &::after {
    position: absolute;
    bottom: 5px;
    left: 50%;
    width: 5px;
    height: 5px;
    border-radius: 50%;
    background: #ff2d75;
    content: "";
    opacity: ${({ $hasRecord }) => ($hasRecord ? 1 : 0)};
    transform: translateX(-50%);
    box-shadow: 0 0 12px rgba(255, 45, 117, 0.8);
  }

  &:hover {
    background: rgba(255, 255, 255, 0.06);
  }
`;

export const SidePanel = styled.aside`
  display: flex;
  min-width: 0;
  flex-direction: column;
  gap: 14px;
`;

export const RecordStack = styled.div`
  display: flex;
  flex-direction: column;
  gap: 14px;
`;

export const DetailCard = styled.article`
  position: relative;
  min-width: 0;
  border: 1px solid rgba(143, 157, 255, 0.24);
  border-radius: 8px;
  background: rgba(17, 21, 42, 0.94);
  overflow: hidden;
  box-shadow:
    0 18px 48px rgba(0, 0, 0, 0.34),
    0 0 32px rgba(255, 45, 117, 0.08);
`;

export const DetailImage = styled.img`
  width: 100%;
  height: 136px;
  object-fit: cover;
`;

export const CategoryBadge = styled.span`
  position: absolute;
  top: 12px;
  right: 12px;
  display: inline-flex;
  align-items: center;
  min-height: 26px;
  padding: 0 10px;
  border-radius: 999px;
  background: rgba(8, 9, 20, 0.74);
  color: #ffffff;
  font-size: 12px;
  font-weight: 900;
`;

export const DetailBody = styled.div`
  padding: 16px;
`;

export const DetailTitle = styled.h2`
  margin: 0 0 10px;
  color: #ffffff;
  font-size: 17px;
  font-weight: 900;
  line-height: 1.35;
`;

export const MetaItem = styled.p`
  display: flex;
  align-items: center;
  gap: 7px;
  margin: 0 0 6px;
  color: #98a4bf;
  font-size: 12px;
  font-weight: 800;
  line-height: 1.4;
`;

export const DetailText = styled.p`
  display: -webkit-box;
  margin: 12px 0 14px;
  color: #b5bed2;
  font-size: 13px;
  line-height: 1.58;
  overflow: hidden;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 3;
`;

export const CardActions = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 1fr) 38px;
  gap: 8px;
`;

export const EditButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 7px;
  height: 38px;
  border-radius: 8px;
  background: rgba(143, 157, 255, 0.12);
  color: #ffffff;
  font-size: 13px;
  font-weight: 900;

  &:hover {
    background: rgba(143, 157, 255, 0.2);
  }
`;

export const DeleteButton = styled.button`
  display: grid;
  place-items: center;
  height: 38px;
  border-radius: 8px;
  background: rgba(255, 45, 117, 0.12);
  color: #ff9fc2;

  &:hover {
    background: rgba(255, 45, 117, 0.2);
  }
`;

export const AddRecordButton = styled.button`
  display: flex;
  min-height: 118px;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
  border: 1px dashed rgba(255, 143, 199, 0.46);
  border-radius: 8px;
  background: rgba(17, 21, 42, 0.58);
  color: #b5bed2;
  font-size: 13px;
  font-weight: 800;

  &:hover {
    border-color: rgba(255, 143, 199, 0.72);
    background: rgba(255, 45, 117, 0.08);
    color: #ffffff;
  }
`;

export const AddIcon = styled.span`
  display: grid;
  place-items: center;
  width: 42px;
  height: 42px;
  border-radius: 50%;
  background: rgba(155, 92, 255, 0.38);
  color: #ffffff;
`;

export const ModalOverlay = styled.div`
  position: fixed;
  inset: 0;
  z-index: 40;
  display: grid;
  place-items: center;
  padding: 24px;
  background: rgba(5, 6, 13, 0.72);
  backdrop-filter: blur(4px);
  justify-items: center;
  align-items: center;
`;

export const ModalPanel = styled.div`
  width: min(100%, 560px);
  max-height: calc(95vh - 48px);
  border: 1px solid rgba(143, 157, 255, 0.26);
  border-radius: 8px;
  background:
    linear-gradient(180deg, rgba(25, 30, 52, 0.98), rgba(17, 21, 42, 0.98)),
    radial-gradient(
      circle at 100% 0%,
      rgba(155, 92, 255, 0.16),
      transparent 34%
    );
  box-shadow:
    0 26px 70px rgba(0, 0, 0, 0.48),
    0 0 38px rgba(155, 92, 255, 0.18);
  overflow: auto;
  margin-top: 60px;
`;

export const ModalHeader = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 18px;
  padding: 22px 24px 18px;
  border-bottom: 1px solid rgba(143, 157, 255, 0.16);
`;

export const ModalTitle = styled.h2`
  margin: 0;
  color: #ffffff;
  font-size: 18px;
  font-weight: 900;
  line-height: 1.35;
`;

export const ModalDescription = styled.p`
  margin: 4px 0 0;
  color: #aab4cd;
  font-size: 13px;
  line-height: 1.5;
`;

export const ModalCloseButton = styled.button`
  display: grid;
  place-items: center;
  flex: 0 0 auto;
  width: 34px;
  height: 34px;
  border-radius: 8px;
  color: #b5bed2;

  &:hover {
    background: rgba(255, 255, 255, 0.07);
    color: #ffffff;
  }
`;

export const ModalBody = styled.div`
  padding: 20px 24px 22px;
`;

export const FieldGroup = styled.div`
  margin-bottom: 16px;

  &:last-child {
    margin-bottom: 0;
  }
`;

export const FormLabel = styled.label`
  display: block;
  margin-bottom: 8px;
  color: #c5cee2;
  font-size: 12px;
  font-weight: 900;
`;

export const UploadBox = styled.div`
  min-width: 0;
`;

export const FileInput = styled.input`
  position: absolute;
  width: 1px;
  height: 1px;
  margin: -1px;
  padding: 0;
  border: 0;
  clip: rect(0 0 0 0);
  overflow: hidden;
`;

export const UploadLabel = styled.label`
  display: flex;
  min-height: 150px;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 7px;
  border: 1px dashed rgba(174, 184, 210, 0.44);
  border-radius: 8px;
  background: rgba(31, 38, 64, 0.54);
  color: #cdd6ea;
  cursor: pointer;
  overflow: hidden;

  &:hover {
    border-color: rgba(255, 143, 199, 0.62);
    background: rgba(255, 45, 117, 0.06);
  }
`;

export const UploadPreview = styled.img`
  width: 100%;
  height: 150px;
  object-fit: cover;
`;

export const UploadText = styled.span`
  color: #cdd6ea;
  font-size: 13px;
  font-weight: 800;
`;

export const UploadHint = styled.span`
  color: #8f9ab5;
  font-size: 11px;
  font-weight: 800;
`;

export const FormInput = styled.input`
  width: 100%;
  height: 42px;
  padding: 0 12px;
  border: 1px solid rgba(143, 157, 255, 0.22);
  border-radius: 8px;
  background: #ffffff;
  color: #1d2437;
  font-size: 13px;
  font-weight: 800;

  &::placeholder {
    color: #b3bbcc;
  }

  &[type="date"] {
    color: #7b8498;
  }
`;

export const FormTextarea = styled.textarea`
  width: 100%;
  min-height: 98px;
  resize: vertical;
  padding: 12px;
  border: 1px solid rgba(143, 157, 255, 0.22);
  border-radius: 8px;
  background: rgba(31, 38, 64, 0.72);
  color: #ffffff;
  font-size: 13px;
  font-weight: 800;
  line-height: 1.55;

  &::placeholder {
    color: #7e88a1;
  }
`;

export const ModalFooter = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  padding: 16px 24px;
  border-top: 1px solid rgba(143, 157, 255, 0.16);
  background: rgba(10, 13, 28, 0.5);
`;

export const GhostButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  height: 36px;
  padding: 0 12px;
  border: 1px solid rgba(143, 157, 255, 0.22);
  border-radius: 8px;
  background: rgba(15, 19, 38, 0.72);
  color: #b5bed2;
  font-size: 13px;
  font-weight: 900;
`;

export const SaveButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  height: 36px;
  padding: 0 14px;
  border-radius: 8px;
  background: linear-gradient(135deg, #9b5cff, #ff2d75);
  color: #ffffff;
  font-size: 13px;
  font-weight: 900;
  box-shadow: 0 0 22px rgba(255, 45, 117, 0.24);
`;
