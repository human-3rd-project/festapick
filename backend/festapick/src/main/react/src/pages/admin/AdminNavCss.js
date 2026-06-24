import styled from "styled-components";
import { NavLink } from "react-router-dom";

export const AdminSidebar = styled.aside`
  position: fixed;
  top: var(--app-header-height, 64px);
  left: 0;
  z-index: 40;
  display: flex;
  flex-direction: column;
  width: 256px;
  height: calc(100vh - var(--app-header-height, 64px));
  padding: 24px 16px;
  border-right: 1px solid rgba(255, 255, 255, 0.1);
  background: #060e20;
  box-shadow: 16px 0 40px rgba(0, 0, 0, 0.28);
  color: #dae2fd;
  font-family:
    "Plus Jakarta Sans",
    "Pretendard",
    "Apple SD Gothic Neo",
    sans-serif;

  * {
    box-sizing: border-box;
  }

  @media (max-width: 768px) {
    position: sticky;
    top: var(--app-header-height, 64px);
    width: 100%;
    height: auto;
    min-height: auto;
    padding: 16px;
    border-right: 0;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  }
`;

export const BrandArea = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 48px;

  @media (max-width: 768px) {
    margin-bottom: 16px;
  }
`;

export const BrandIcon = styled.div`
  display: flex;
  flex-shrink: 0;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  border-radius: 16px;
  color: #490080;
  background: linear-gradient(135deg, #ffb6d9 0%, #ffb0cd 100%);
  box-shadow: 0 0 20px rgba(255, 176, 205, 0.3);

  svg {
    width: 25px;
    height: 25px;
    stroke-width: 2.5;
  }
`;

export const BrandText = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  min-width: 0;
`;

export const BrandName = styled.h1`
  margin: 0;
  color: #dae2fd;
  font-size: 24px;
  font-weight: 800;
  line-height: 32px;
  letter-spacing: 0;
`;

export const BrandLabel = styled.p`
  margin: 0;
  color: #cfc2d6;
  font-size: 12px;
  font-weight: 700;
  line-height: 16px;
`;

export const MenuList = styled.nav`
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: 8px;

  @media (max-width: 768px) {
    flex: none;
    flex-direction: row;
    gap: 8px;
    overflow-x: auto;
    padding-bottom: 2px;
  }
`;

export const MenuItem = styled(NavLink)`
  display: flex;
  align-items: center;
  gap: 16px;
  min-height: 40px;
  padding: 8px 16px;
  border-radius: 8px;
  color: #cfc2d6;
  font-size: 14px;
  font-weight: 600;
  line-height: 20px;
  letter-spacing: 0.03em;
  text-decoration: none;
  white-space: nowrap;
  transition:
    color 180ms ease,
    background-color 180ms ease,
    box-shadow 180ms ease,
    transform 180ms ease;

  svg {
    flex-shrink: 0;
    width: 24px;
    height: 24px;
    stroke-width: 2;
  }

  &:hover {
    color: #dae2fd;
    background: rgba(255, 255, 255, 0.05);
  }

  &:active {
    transform: scale(0.98);
  }

  &.active,
  &[aria-current="page"] {
    color: #400071;
    background: #b76dff;
    box-shadow: 0 0 15px rgba(183, 109, 255, 0.4);
    font-weight: 700;
  }

  @media (max-width: 768px) {
    flex: 0 0 auto;
  }
`;

export const SidebarFooter = styled.div`
  margin-top: auto;
  padding-top: 16px;
  border-top: 1px solid rgba(255, 255, 255, 0.05);

  @media (max-width: 768px) {
    display: none;
  }
`;
