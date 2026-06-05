import styled, { css } from "styled-components";

const cardLift = css`
  transition:
    transform 220ms ease,
    box-shadow 220ms ease,
    border-color 220ms ease;

  &:hover {
    border-color: rgba(221, 183, 255, 0.36);
    box-shadow: 0 0 28px rgba(221, 183, 255, 0.16);
    transform: translateY(-4px);
  }
`;

export const Page = styled.main`
  --background: #0b1326;
  --surface: #0b1326;
  --surface-container-low: #131b2e;
  --surface-container: #171f33;
  --surface-container-high: #222a3d;
  --surface-container-highest: #2d3449;
  --on-background: #dae2fd;
  --on-surface: #dae2fd;
  --on-surface-variant: #cfc2d6;
  --outline: #988d9f;
  --outline-variant: #4d4354;
  --primary: #ddb7ff;
  --primary-container: #b76dff;
  --on-primary: #490080;
  --secondary: #ffb0cd;
  --secondary-container: #aa0266;
  --tertiary: #ffb690;
  --tertiary-container: #ec6a06;

  min-height: 100vh;
  background:
    radial-gradient(circle at 10% 2%, rgba(183, 109, 255, 0.18), transparent 28%),
    radial-gradient(circle at 88% 8%, rgba(170, 2, 102, 0.18), transparent 30%),
    linear-gradient(180deg, #0b1326 0%, #060e20 100%);
  color: var(--on-background);
  font-family: "Plus Jakarta Sans", system-ui, sans-serif;
  padding: 64px 16px 80px;
`;

export const Container = styled.div`
  width: min(100%, 1024px);
  margin: 0 auto;
`;

export const PageHeader = styled.header`
  margin-bottom: 64px;
`;

export const Title = styled.h1`
  margin: 0 0 8px;
  color: var(--on-surface);
  font-family: "Plus Jakarta Sans", system-ui, sans-serif;
  font-size: 32px;
  font-weight: 800;
  line-height: 1.3;
  letter-spacing: 0;
`;

export const Description = styled.p`
  margin: 0;
  color: var(--on-surface-variant);
  font-size: 16px;
  line-height: 1.6;
`;

export const FilterPanel = styled.section`
  position: relative;
  margin-bottom: 64px;
  padding: 32px;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 12px;
  background: rgba(45, 52, 73, 0.4);
  box-shadow: 0 0 20px rgba(221, 183, 255, 0.2);
  backdrop-filter: blur(16px);

  &::after {
    position: absolute;
    inset: auto 24px 0;
    height: 3px;
    content: "";
    border-radius: 999px 999px 0 0;
    background: linear-gradient(90deg, var(--primary-container), var(--secondary-container));
    opacity: 0.85;
  }
`;

export const SearchForm = styled.form`
  display: grid;
  grid-template-columns: minmax(0, 1fr) 210px;
  gap: 16px;
`;

export const SearchInput = styled.input`
  width: 100%;
  height: 52px;
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 8px;
  background: var(--surface-container-high);
  color: var(--on-surface);
  font: inherit;
  font-size: 16px;
  padding: 0 16px;
  outline: none;
  transition:
    border-color 180ms ease,
    background 180ms ease,
    box-shadow 180ms ease;

  &::placeholder {
    color: rgba(207, 194, 214, 0.62);
  }

  &:focus {
    border-color: rgba(221, 183, 255, 0.58);
    background: var(--surface-container-high);
    box-shadow: 0 0 20px rgba(221, 183, 255, 0.2);
  }
`;

export const ButtonGroup = styled.div`
  display: flex;
  align-items: stretch;
  gap: 8px;
`;

export const IconButton = styled.button`
  display: inline-flex;
  width: 56px;
  height: 52px;
  flex: 0 0 56px;
  align-items: center;
  justify-content: center;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  background: var(--surface-container-high);
  color: var(--on-surface-variant);
  cursor: pointer;
  transition:
    transform 160ms ease,
    background 160ms ease,
    color 160ms ease;

  &:hover {
    background: var(--surface-container-highest);
    color: var(--primary);
  }

  &:active {
    transform: scale(0.98);
  }
`;

export const SearchButton = styled.button`
  display: inline-flex;
  height: 52px;
  flex: 1;
  align-items: center;
  justify-content: center;
  gap: 8px;
  border: 0;
  border-radius: 8px;
  background: linear-gradient(135deg, var(--primary-container) 0%, var(--secondary-container) 100%);
  color: #ffffff;
  cursor: pointer;
  font-size: 14px;
  font-weight: 800;
  line-height: 1;
  box-shadow: 0 12px 28px rgba(221, 183, 255, 0.2);
  transition:
    filter 160ms ease,
    transform 160ms ease;

  &:hover {
    filter: brightness(1.05);
  }

  &:active {
    transform: scale(0.98);
  }
`;

export const FilterDivider = styled.div`
  height: 1px;
  margin: 32px 0 16px;
  background: rgba(255, 255, 255, 0.05);
`;

export const ChipRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px;
`;

export const Chip = styled.span`
  display: inline-flex;
  min-height: 32px;
  align-items: center;
  gap: 6px;
  border: 1px solid ${({ $tone }) => ($tone === "violet" ? "rgba(221, 183, 255, 0.3)" : $tone === "amber" ? "rgba(255, 182, 144, 0.3)" : "rgba(255, 176, 205, 0.3)")};
  border-radius: 999px;
  background: rgba(34, 42, 61, 0.5);
  color: var(--on-surface);
  font-size: 12px;
  font-weight: 800;
  padding: 5px 12px;
`;

export const ChipRemove = styled.button`
  display: inline-flex;
  width: 18px;
  height: 18px;
  align-items: center;
  justify-content: center;
  border: 0;
  border-radius: 50%;
  background: transparent;
  color: var(--on-surface-variant);
  cursor: pointer;
  padding: 0;

  &:hover {
    color: var(--primary);
  }
`;

export const ResetButton = styled.button`
  border: 0;
  background: transparent;
  color: rgba(221, 183, 255, 0.72);
  cursor: pointer;
  font-size: 12px;
  font-weight: 800;
  padding: 6px 8px;

  &:hover {
    color: var(--primary);
  }
`;

export const ResultsHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
  margin-bottom: 32px;
`;

export const ResultsTitleWrap = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

export const ResultsTitle = styled.h2`
  margin: 0;
  color: var(--on-surface);
  font-family: "Plus Jakarta Sans", system-ui, sans-serif;
  font-size: 24px;
  font-weight: 800;
  line-height: 1.4;
`;

export const ResultCount = styled.span`
  border-radius: 8px;
  background: var(--surface-container-highest);
  color: var(--primary);
  font-size: 12px;
  font-weight: 800;
  padding: 3px 8px;
`;

export const SortGroup = styled.label`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  color: var(--on-surface-variant);
  font-size: 12px;
  font-weight: 800;
`;

export const SortSelect = styled.select`
  border: 0;
  background: transparent;
  color: var(--primary);
  cursor: pointer;
  font: inherit;
  font-size: 14px;
  font-weight: 800;
  outline: none;
`;

export const ResultGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 32px;
  margin-bottom: 64px;
`;

export const FestivalCard = styled.article`
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  background: var(--surface-container);
  box-shadow: 0 10px 28px rgba(0, 0, 0, 0.18);
  ${cardLift}
`;

export const ImageWrap = styled.div`
  position: relative;
  height: 240px;
  overflow: hidden;
  background: var(--surface-container-highest);

  img {
    width: 100%;
    height: 100%;
    display: block;
    object-fit: cover;
    transition: transform 700ms ease;
  }

  ${FestivalCard}:hover & img {
    transform: scale(1.08);
  }
`;

export const LiveBadge = styled.span`
  position: absolute;
  top: 12px;
  left: 12px;
  border-radius: 999px;
  background: rgba(221, 183, 255, 0.9);
  color: var(--on-primary);
  font-size: 12px;
  font-weight: 800;
  padding: 4px 12px;
  backdrop-filter: blur(12px);
`;

export const HeartButton = styled.button`
  position: absolute;
  top: 12px;
  right: 12px;
  display: inline-flex;
  width: 40px;
  height: 40px;
  align-items: center;
  justify-content: center;
  border: 1px solid
    ${({ $active }) =>
      $active ? "rgba(255, 218, 214, 0.72)" : "rgba(255, 255, 255, 0.4)"};
  border-radius: 999px;
  background: ${({ $active }) =>
    $active ? "rgba(170, 2, 102, 0.58)" : "rgba(25, 28, 30, 0.34)"};
  color: ${({ $active }) => ($active ? "#ffdad6" : "#ffffff")};
  cursor: pointer;
  backdrop-filter: blur(16px);
  transition:
    color 160ms ease,
    transform 160ms ease,
    background 160ms ease;

  &:hover {
    background: ${({ $active }) =>
      $active ? "rgba(170, 2, 102, 0.7)" : "rgba(25, 28, 30, 0.46)"};
    color: #ffdad6;
  }

  &:active {
    transform: scale(0.92);
  }
`;

export const ImageOverlay = styled.div`
  position: absolute;
  right: 0;
  bottom: 0;
  left: 0;
  padding: 42px 16px 16px;
  background: linear-gradient(180deg, rgba(11, 19, 38, 0), rgba(11, 19, 38, 0.92));
`;

export const CategoryBadge = styled.span`
  display: inline-flex;
  margin-bottom: 8px;
  border-radius: 8px;
  background: ${({ $tone }) => ($tone === "violet" ? "rgba(183, 109, 255, 0.84)" : $tone === "amber" ? "rgba(236, 106, 6, 0.86)" : "rgba(170, 2, 102, 0.86)")};
  color: ${({ $tone }) => ($tone === "violet" ? "#f0dbff" : $tone === "amber" ? "#ffdbca" : "#ffbad3")};
  font-size: 10px;
  font-weight: 900;
  letter-spacing: 0.04em;
  padding: 4px 8px;
`;

export const CardTitle = styled.h3`
  margin: 0;
  color: #ffffff;
  font-family: "Plus Jakarta Sans", system-ui, sans-serif;
  font-size: 20px;
  font-weight: 800;
  line-height: 1.25;
  text-shadow: 0 2px 12px rgba(0, 0, 0, 0.28);
`;

export const CardBody = styled.div`
  padding: 16px;
`;

export const CardMeta = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  color: var(--on-surface-variant);
  font-size: 12px;
  font-weight: 800;
`;

export const MetaItem = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 6px;
`;

export const CardFooter = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-top: 14px;
  border-top: 1px solid rgba(255, 255, 255, 0.05);
  padding-top: 12px;
`;

export const StatGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 14px;
  color: rgba(207, 194, 214, 0.7);
  font-size: 12px;
`;

export const DetailLink = styled.button`
  border: 0;
  background: transparent;
  color: var(--primary);
  cursor: pointer;
  font-size: 14px;
  font-weight: 900;
  padding: 0;
`;

export const LoadMoreWrap = styled.div`
  display: flex;
  grid-column: 1 / -1;
  justify-content: center;
  padding: 32px 0 0;
`;

export const LoadMoreButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  border: 1px solid rgba(221, 183, 255, 0.3);
  border-radius: 999px;
  background: transparent;
  color: var(--primary);
  cursor: pointer;
  font-size: 14px;
  font-weight: 800;
  padding: 12px 24px;

  &:hover {
    background: rgba(221, 183, 255, 0.1);
  }
`;

export const EmptyState = styled.section`
  display: flex;
  min-height: 320px;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 16px;
  text-align: center;
`;

export const EmptyIcon = styled.div`
  display: inline-flex;
  width: 80px;
  height: 80px;
  align-items: center;
  justify-content: center;
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 999px;
  background: rgba(45, 52, 73, 0.4);
  color: rgba(207, 194, 214, 0.38);
  box-shadow: 0 0 20px rgba(221, 183, 255, 0.12);
`;

export const EmptyCopy = styled.div`
  max-width: 440px;

  h3 {
    margin: 0 0 8px;
    color: var(--on-surface);
    font-family: "Plus Jakarta Sans", system-ui, sans-serif;
    font-size: 24px;
    font-weight: 800;
    line-height: 1.4;
  }

  p {
    margin: 0;
    color: var(--on-surface-variant);
    font-size: 16px;
    line-height: 1.6;
  }
`;

export const ModalBackdrop = styled.div`
  position: fixed;
  z-index: 1000;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(6, 14, 32, 0.72);
  padding: 20px;
`;

export const ModalPanel = styled.div`
  width: min(100%, 440px);
  border-radius: 24px;
  background: var(--surface-container);
  box-shadow: 0 24px 70px rgba(0, 0, 0, 0.45), 0 0 24px rgba(221, 183, 255, 0.16);
  padding: 24px;
`;

export const ModalHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 20px;

  h2 {
    margin: 0;
    color: var(--on-surface);
    font-family: "Plus Jakarta Sans", system-ui, sans-serif;
    font-size: 22px;
    font-weight: 800;
  }
`;

export const ModalClose = styled.button`
  display: inline-flex;
  width: 36px;
  height: 36px;
  align-items: center;
  justify-content: center;
  border: 0;
  border-radius: 999px;
  background: var(--surface-container-high);
  color: var(--on-surface-variant);
  cursor: pointer;
`;

export const ModalBody = styled.div`
  display: grid;
  gap: 18px;
`;

export const FilterField = styled.label`
  display: grid;
  gap: 8px;
  color: var(--on-surface-variant);
  font-size: 13px;
  font-weight: 800;

  select,
  input {
    height: 44px;
    border: 1px solid rgba(255, 255, 255, 0.08);
    border-radius: 14px;
    background: var(--surface-container-high);
    color: var(--on-surface);
    font: inherit;
    font-size: 14px;
    padding: 0 12px;
    outline: none;
  }
`;

export const ModalActions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  margin-top: 24px;
`;

export const SecondaryButton = styled.button`
  height: 44px;
  border: 1px solid rgba(221, 183, 255, 0.34);
  border-radius: 14px;
  background: transparent;
  color: var(--primary);
  cursor: pointer;
  font-size: 14px;
  font-weight: 800;
  padding: 0 16px;
`;

export const PrimaryButton = styled.button`
  height: 44px;
  border: 0;
  border-radius: 14px;
  background: linear-gradient(135deg, var(--primary-container) 0%, var(--secondary-container) 100%);
  color: #ffffff;
  cursor: pointer;
  font-size: 14px;
  font-weight: 800;
  padding: 0 18px;
`;

export const ResponsiveStyles = styled.div`
  @media (max-width: 900px) {
    ${SearchForm} {
      grid-template-columns: 1fr;
    }

    ${ResultGrid} {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }
  }

  @media (max-width: 640px) {
    ${Page} {
      padding-top: 40px;
    }

    ${PageHeader} {
      margin-bottom: 32px;
    }

    ${Title} {
      font-size: 26px;
    }

    ${FilterPanel} {
      margin-bottom: 40px;
      padding: 20px;
      border-radius: 20px;
    }

    ${ButtonGroup} {
      display: grid;
      grid-template-columns: 56px minmax(0, 1fr);
    }

    ${ResultsHeader} {
      align-items: flex-start;
      flex-direction: column;
    }

    ${ResultGrid} {
      grid-template-columns: 1fr;
      gap: 20px;
    }

    ${ImageWrap} {
      height: 220px;
    }

    ${CardMeta} {
      align-items: flex-start;
      flex-direction: column;
    }
  }
`;
