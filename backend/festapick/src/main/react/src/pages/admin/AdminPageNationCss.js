import styled from "styled-components";

export const PageNationBar = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding: 16px 24px;
  border-top: 1px solid rgba(255, 255, 255, 0.08);
  background: rgba(255, 255, 255, 0.05);

  @media (max-width: 560px) {
    align-items: flex-start;
    flex-direction: column;
  }
`;

export const PageInfo = styled.span`
  color: #cfc2d6;
  font-size: 12px;
  font-weight: 500;
  line-height: 16px;

  strong {
    color: #dae2fd;
  }
`;

export const PageNationControls = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;

  span {
    margin: 0 4px;
    color: #cfc2d6;
  }
`;

export const PageButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 32px;
  height: 32px;
  padding: 0 8px;
  border: 0;
  border-radius: 8px;
  color: ${({ $active }) => ($active ? "#490080" : "#cfc2d6")};
  background: ${({ $active }) => ($active ? "#ddb7ff" : "transparent")};
  box-shadow: ${({ $active }) =>
    $active ? "0 0 10px rgba(183, 109, 255, 0.35)" : "none"};
  font-size: 12px;
  font-weight: 700;
  cursor: pointer;
  transition:
    background-color 160ms ease,
    color 160ms ease;

  svg {
    width: 20px;
    height: 20px;
  }

  &:hover:not(:disabled) {
    background: ${({ $active }) => ($active ? "#ddb7ff" : "rgba(255, 255, 255, 0.1)")};
  }

  &:disabled {
    cursor: default;
    opacity: 0.3;
  }
`;
