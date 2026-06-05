import styled from "styled-components";

export const ModalBackdrop = styled.div`
  position: fixed;
  inset: 0;
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(6px);
  padding: 16px;
`;

export const ModalPanel = styled.div`
  --background: #0b1326;
  --surface-container-lowest: #060e20;
  --surface-container-low: #131b2e;
  --surface-container: #171f33;
  --surface-container-high: #222a3d;
  --surface-container-highest: #2d3449;
  --on-surface: #dae2fd;
  --on-surface-variant: #cfc2d6;
  --outline: #988d9f;
  --primary: #ddb7ff;
  --primary-container: #b76dff;
  --on-primary: #490080;
  --inverse-primary: #842bd2;

  width: min(100%, 800px);
  max-height: 90vh;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  background: rgba(23, 31, 51, 0.7);
  color: var(--on-surface);
  font-family: "Plus Jakarta Sans", system-ui, sans-serif;
  box-shadow: 0 24px 80px rgba(0, 0, 0, 0.48), 0 0 15px rgba(221, 183, 255, 0.3);
  backdrop-filter: blur(20px);

  @media (max-width: 720px) {
    max-height: 94vh;
  }
`;

export const ModalHeader = styled.header`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  padding: 16px 24px;

  @media (max-width: 720px) {
    padding-left: 16px;
    padding-right: 16px;
  }
`;

export const ModalTitle = styled.h1`
  margin: 0;
  color: var(--primary);
  font-size: 24px;
  font-weight: 700;
  line-height: 32px;
  letter-spacing: 0;
`;

export const CloseButton = styled.button`
  display: inline-flex;
  width: 40px;
  height: 40px;
  align-items: center;
  justify-content: center;
  border: 0;
  border-radius: 999px;
  background: transparent;
  color: var(--on-surface-variant);
  cursor: pointer;
  transition:
    background 160ms ease,
    color 160ms ease,
    transform 160ms ease;

  &:hover {
    background: rgba(255, 255, 255, 0.1);
    color: var(--primary);
  }

  &:active {
    transform: scale(0.95);
  }
`;

export const ModalContent = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 24px;

  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-track {
    background: rgba(255, 255, 255, 0.05);
  }

  &::-webkit-scrollbar-thumb {
    border-radius: 999px;
    background: rgba(221, 183, 255, 0.4);
  }

  @media (max-width: 720px) {
    padding-left: 16px;
    padding-right: 16px;
  }
`;

export const ContentGrid = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
  gap: 24px;

  @media (max-width: 720px) {
    grid-template-columns: 1fr;
  }
`;

export const LeftColumn = styled.div`
  display: grid;
  align-content: start;
  gap: 48px;

  @media (max-width: 720px) {
    gap: 32px;
  }
`;

export const Section = styled.section`
  display: grid;
  gap: 16px;
`;

export const SectionHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  color: var(--primary);
`;

export const SectionTitle = styled.h2`
  margin: 0;
  color: var(--on-surface-variant);
  font-size: 14px;
  font-weight: 600;
  line-height: 20px;
  letter-spacing: 0.05em;
  text-transform: uppercase;
`;

export const FieldStack = styled.div`
  display: grid;
  gap: 8px;
`;

export const FieldLabel = styled.label`
  color: var(--outline);
  font-size: 12px;
  font-weight: 500;
  line-height: 16px;
  margin-left: 4px;
`;

export const SelectWrap = styled.div`
  position: relative;

  svg:last-child {
    position: absolute;
    right: 12px;
    top: 50%;
    pointer-events: none;
    color: var(--outline);
    transform: translateY(-50%);
  }
`;

export const Select = styled.select`
  width: 100%;
  height: 48px;
  appearance: none;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  background: var(--surface-container-high);
  color: var(--on-surface);
  cursor: pointer;
  font: inherit;
  font-size: 16px;
  line-height: 24px;
  outline: none;
  padding: 0 44px 0 16px;
  transition:
    border-color 160ms ease,
    box-shadow 160ms ease;

  &:focus {
    border-color: transparent;
    box-shadow: 0 0 0 2px var(--primary), 0 0 15px rgba(221, 183, 255, 0.3);
  }
`;

export const CalendarPanel = styled.div`
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  background: rgba(19, 27, 46, 0.5);
  backdrop-filter: blur(12px);
  padding: 16px;
`;

export const CalendarHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 24px;
  padding: 0 4px;
`;

export const MonthLabel = styled.span`
  color: var(--on-surface);
  font-size: 14px;
  font-weight: 600;
  line-height: 20px;
`;

export const MonthControls = styled.div`
  display: flex;
  gap: 8px;
`;

export const MonthButton = styled.button`
  display: inline-flex;
  width: 28px;
  height: 28px;
  align-items: center;
  justify-content: center;
  border: 0;
  border-radius: 999px;
  background: transparent;
  color: var(--outline);
  cursor: pointer;
  padding: 0;

  &:hover {
    color: var(--primary);
  }
`;

export const WeekGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(7, minmax(0, 1fr));
  margin-bottom: 16px;
  color: rgba(152, 141, 159, 0.6);
  font-size: 11px;
  font-weight: 800;
  text-align: center;
  text-transform: uppercase;
`;

export const DayGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(7, minmax(0, 1fr));
  row-gap: 4px;
  text-align: center;
`;

export const DayCell = styled.button`
  height: 40px;
  border: 0;
  background: ${({ $selected }) =>
    $selected ? "rgba(221, 183, 255, 0.15)" : "transparent"};
  color: ${({ $muted, $edge }) =>
    $edge ? "var(--on-primary)" : $muted ? "rgba(152, 141, 159, 0.22)" : "var(--on-surface)"};
  cursor: ${({ $muted }) => ($muted ? "default" : "pointer")};
  font: inherit;
  font-size: 16px;
  font-weight: ${({ $edge }) => ($edge ? 700 : 400)};
  line-height: 24px;
  padding: 0;
  position: relative;

  ${({ $rangeStart }) =>
    $rangeStart &&
    `
      border-radius: 999px 0 0 999px;
      background: var(--primary);
    `}

  ${({ $rangeEnd }) =>
    $rangeEnd &&
    `
      border-radius: 0 999px 999px 0;
      background: var(--primary);
    `}

  ${({ $singleDay }) =>
    $singleDay &&
    `
      border-radius: 999px;
      background: var(--primary);
    `}

  &:hover {
    color: ${({ $muted }) => ($muted ? "rgba(152, 141, 159, 0.22)" : "var(--primary)")};
  }
`;

export const ModalFooter = styled.footer`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 16px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  background: rgba(6, 14, 32, 0.8);
  backdrop-filter: blur(12px);
  padding: 24px;

  @media (max-width: 720px) {
    padding-left: 16px;
    padding-right: 16px;
  }
`;

export const ResetButton = styled.button`
  height: 48px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  background: transparent;
  color: var(--on-surface);
  cursor: pointer;
  font-size: 14px;
  font-weight: 600;
  line-height: 20px;
  letter-spacing: 0.05em;
  transition:
    background 160ms ease,
    transform 160ms ease;

  &:hover {
    background: rgba(255, 255, 255, 0.05);
  }

  &:active {
    transform: scale(0.95);
  }
`;

export const ApplyButton = styled.button`
  height: 48px;
  border: 0;
  border-radius: 12px;
  background: linear-gradient(90deg, var(--primary), var(--inverse-primary));
  color: var(--on-primary);
  cursor: pointer;
  font-size: 14px;
  font-weight: 800;
  line-height: 20px;
  letter-spacing: 0.05em;
  box-shadow: 0 0 20px rgba(168, 85, 247, 0.4);
  transition:
    box-shadow 160ms ease,
    transform 160ms ease;

  &:hover {
    box-shadow: 0 0 30px rgba(168, 85, 247, 0.6);
  }

  &:active {
    transform: scale(0.95);
  }
`;
