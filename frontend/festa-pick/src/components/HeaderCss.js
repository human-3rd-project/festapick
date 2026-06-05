import styled from "styled-components";

const colors = {
  background: "#0b1326",
  surface: "#171f33",
  surfaceHigh: "#222a3d",
  surfaceHighest: "#2d3449",
  primary: "#ddb7ff",
  secondary: "#ffb0cd",
  tertiary: "#ffb690",
  onSurface: "#dae2fd",
  onSurfaceVariant: "#cfc2d6",
  onPrimary: "#490080",
  error: "#ffb4ab",
};

export const HeaderBar = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 50;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  background: rgba(11, 19, 38, 0.82);
  backdrop-filter: blur(20px);
  box-shadow: 0 0 20px rgba(221, 183, 255, 0.1);
  color: ${colors.onSurface};
  font-family: "Plus Jakarta Sans", "Pretendard", "Noto Sans KR", sans-serif;
`;

export const HeaderInner = styled.div`
  position: relative;
  width: min(100%, 1280px);
  height: 64px;
  margin: 0 auto;
  padding: 0 40px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 50px;

  @media (max-width: 768px) {
    padding: 0 16px;
    gap: 14px;
  }
`;

export const BrandLink = styled.a`
  display: inline-flex;
  align-items: center;
  gap: 9px;
  color: ${colors.primary};
  font-size: 24px;
  line-height: 32px;
  font-weight: 800;
  letter-spacing: 0;
  text-decoration: none;
  white-space: nowrap;

  &:hover {
    color: ${colors.secondary};
  }
`;

export const LogoMark = styled.span`
  width: 30px;
  height: 30px;
  border-radius: 9px;
  display: grid;
  place-items: center;
  background: linear-gradient(
    135deg,
    ${colors.primary} 0%,
    ${colors.secondary} 100%
  );
  color: ${colors.onPrimary};
  font-size: 17px;
  font-weight: 900;
  box-shadow: 0 0 15px rgba(221, 183, 255, 0.28);
`;

export const Nav = styled.nav`
  display: flex;
  align-items: center;
  gap: 24px;
  margin-right: auto;

  @media (max-width: 860px) {
    display: none;
  }
`;

export const NavLink = styled.a`
  position: relative;
  padding: 4px 0;
  color: ${({ $active }) =>
    $active ? colors.primary : colors.onSurfaceVariant};
  font-size: 16px;
  line-height: 24px;
  font-weight: ${({ $active }) => ($active ? 800 : 600)};
  letter-spacing: 0;
  text-decoration: none;
  transition: color 180ms ease;

  &::after {
    content: "";
    position: absolute;
    left: 0;
    right: 0;
    bottom: -6px;
    height: 2px;
    border-radius: 999px;
    background: ${colors.primary};
    opacity: ${({ $active }) => ($active ? 1 : 0)};
  }

  &:hover {
    color: ${colors.secondary};
  }
`;

export const ActionArea = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  gap: 16px;

  @media (max-width: 520px) {
    gap: 10px;
  }
`;

export const SearchBox = styled.label`
  width: 256px;
  min-height: 36px;
  border-radius: 999px;
  display: flex;
  align-items: center;
  gap: 9px;
  padding: 0 14px;
  background: ${colors.surface};
  color: ${colors.onSurfaceVariant};
  transition: box-shadow 180ms ease;

  &:focus-within {
    box-shadow: 0 0 0 2px rgba(221, 183, 255, 0.35);
  }

  @media (max-width: 640px) {
    display: none;
  }
`;

export const SearchInput = styled.input`
  width: 100%;
  border: 0;
  outline: 0;
  background: transparent;
  color: ${colors.onSurface};
  font-size: 14px;
  line-height: 20px;
  font-weight: 600;
  letter-spacing: 0;

  &::placeholder {
    color: ${colors.onSurfaceVariant};
  }
`;

export const LoginButton = styled.button`
  min-height: 36px;
  border: 0;
  border-radius: 999px;
  padding: 0 22px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  background: linear-gradient(
    135deg,
    ${colors.primary} 0%,
    ${colors.secondary} 100%
  );
  color: ${colors.onPrimary};
  font-size: 14px;
  line-height: 20px;
  font-weight: 800;
  letter-spacing: 0;
  cursor: pointer;
  transition:
    filter 180ms ease,
    transform 180ms ease;

  &:hover {
    filter: brightness(1.08);
  }

  &:active {
    transform: scale(0.96);
  }
`;

export const NotificationButton = styled.button`
  position: relative;
  width: 40px;
  height: 40px;
  border: 0;
  border-radius: 999px;
  display: grid;
  place-items: center;
  background: transparent;
  color: ${colors.onSurfaceVariant};
  cursor: pointer;
  transition:
    color 180ms ease,
    background 180ms ease,
    transform 180ms ease;

  &:hover {
    color: ${colors.primary};
    background: rgba(255, 255, 255, 0.05);
  }

  &:active {
    transform: scale(0.94);
  }
`;

export const NotificationBadge = styled.span`
  position: absolute;
  top: 4px;
  right: 3px;
  min-width: 16px;
  height: 16px;
  padding: 0 4px;
  border-radius: 999px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: ${colors.error};
  color: #690005;
  font-size: 10px;
  line-height: 1;
  font-weight: 900;
  box-shadow: 0 0 12px rgba(255, 180, 171, 0.36);
`;

export const ProfileButton = styled.button`
  min-height: 40px;
  border: 0;
  border-left: 1px solid rgba(255, 255, 255, 0.1);
  padding: 0 0 0 12px;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: transparent;
  color: ${colors.onSurface};
  font-size: 14px;
  line-height: 20px;
  font-weight: 800;
  letter-spacing: 0;
  cursor: pointer;
  transition: color 180ms ease;

  &:hover {
    color: ${colors.primary};
  }

  @media (max-width: 520px) {
    span {
      display: none;
    }
  }
`;

export const Avatar = styled.span`
  width: 32px;
  height: 32px;
  border-radius: 999px;
  border: 1px solid rgba(221, 183, 255, 0.36);
  display: grid;
  place-items: center;
  background: linear-gradient(
    135deg,
    rgba(221, 183, 255, 0.18),
    rgba(255, 176, 205, 0.12)
  );
  color: ${colors.primary};
  overflow: hidden;
  transition: border-color 180ms ease;

  ${ProfileButton}:hover & {
    border-color: ${colors.primary};
  }
`;

export const Dropdown = styled.div`
  position: absolute;
  top: calc(100% + 12px);
  right: 0;
  width: 192px;
  overflow: hidden;
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  background: rgba(11, 19, 38, 0.86);
  backdrop-filter: blur(18px);
  box-shadow:
    0 18px 48px rgba(0, 0, 0, 0.42),
    0 0 18px rgba(221, 183, 255, 0.1);
  z-index: 60;
`;

export const DropdownHeader = styled.div`
  padding: 12px 16px 10px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);

  strong {
    display: block;
    color: ${colors.primary};
    font-size: 14px;
    line-height: 20px;
    font-weight: 800;
  }
`;

export const DropdownMeta = styled.p`
  margin: 0 0 2px;
  color: ${colors.onSurfaceVariant};
  font-size: 12px;
  line-height: 16px;
  font-weight: 600;
`;

export const DropdownLink = styled.a`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 16px;
  color: ${({ $danger }) => ($danger ? colors.error : colors.onSurface)};
  font-size: 14px;
  line-height: 20px;
  font-weight: 650;
  letter-spacing: 0;
  text-decoration: none;
  transition:
    background 180ms ease,
    color 180ms ease;

  &:hover {
    background: ${({ $danger }) =>
      $danger ? "rgba(255, 180, 171, 0.1)" : "rgba(255, 255, 255, 0.08)"};
    color: ${({ $danger }) => ($danger ? colors.error : colors.primary)};
  }
`;

export const AdminMenuLink = styled(DropdownLink)`
  color: ${colors.secondary};
  font-weight: 800;
`;

export const MenuDivider = styled.div`
  height: 1px;
  margin: 4px 0;
  background: rgba(255, 255, 255, 0.1);
`;

export const NotificationPanel = styled.aside`
  position: fixed;
  top: 76px;
  right: 40px;
  z-index: 70;
  width: min(420px, calc(100vw - 32px));
  max-height: calc(100vh - 100px);
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  background: rgba(11, 19, 38, 0.86);
  backdrop-filter: blur(24px);
  box-shadow:
    0 20px 60px rgba(0, 0, 0, 0.62),
    0 0 15px rgba(221, 183, 255, 0.1);
  display: flex;
  flex-direction: column;
  overflow: hidden;

  > div:nth-child(2) {
    overflow-y: auto;
    padding: 8px 0;
  }

  @media (max-width: 640px) {
    inset: 0;
    width: 100%;
    max-height: none;
    border-radius: 0;
  }
`;

export const NotificationPanelHeader = styled.div`
  flex: 0 0 auto;
  padding: 16px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;

  > div {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  h2 {
    margin: 0;
    color: ${colors.onSurface};
    font-size: 24px;
    line-height: 32px;
    font-weight: 800;
    letter-spacing: 0;
  }

  > button {
    border: 0;
    background: transparent;
    color: ${colors.primary};
    font-size: 12px;
    line-height: 16px;
    font-weight: 800;
    letter-spacing: 0;
    text-transform: uppercase;
    cursor: pointer;
  }
`;

export const CloseButton = styled.button`
  width: 32px;
  height: 32px;
  border: 0;
  border-radius: 999px;
  display: none;
  place-items: center;
  background: rgba(255, 255, 255, 0.06);
  color: ${colors.onSurface};
  cursor: pointer;

  @media (max-width: 640px) {
    display: grid;
  }
`;

export const NotificationItem = styled.button`
  position: relative;
  width: 100%;
  border: 0;
  padding: 16px 16px;
  display: grid;
  grid-template-columns: 48px minmax(0, 1fr);
  gap: 16px;
  background: transparent;
  color: inherit;
  text-align: left;
  cursor: pointer;
  opacity: ${({ $unread }) => ($unread ? 1 : 0.72)};
  transition: background 180ms ease;

  &:hover {
    background: rgba(255, 255, 255, 0.05);
  }
`;

export const UnreadDot = styled.span`
  position: absolute;
  left: 4px;
  top: 50%;
  width: 6px;
  height: 6px;
  border-radius: 999px;
  background: ${colors.primary};
  box-shadow: 0 0 12px rgba(221, 183, 255, 0.5);
  transform: translateY(-50%);
`;

export const NotificationIconBox = styled.span`
  width: 48px;
  height: 48px;
  border-radius: 10px;
  display: grid;
  place-items: center;
  color: ${({ $type }) => {
    if ($type === "food") return colors.tertiary;
    if ($type === "festival") return colors.secondary;
    return colors.primary;
  }};
  background: ${({ $type }) => {
    if ($type === "calendar")
      return "linear-gradient(135deg, #b76dff 0%, #aa0266 100%)";
    if ($type === "food") return "rgba(236, 106, 6, 0.18)";
    if ($type === "festival") return "rgba(255, 176, 205, 0.14)";
    return "rgba(221, 183, 255, 0.12)";
  }};
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: ${({ $type }) =>
    $type === "calendar" ? "0 0 12px rgba(183, 109, 255, 0.34)" : "none"};

  svg {
    color: ${({ $type }) =>
      $type === "calendar" ? "#ffffff" : "currentColor"};
  }
`;

export const NotificationText = styled.div`
  display: flex;
  min-width: 0;
  flex-direction: column;
  gap: 4px;

  p {
    margin: 0;
    color: ${colors.onSurface};
    font-size: 16px;
    line-height: 1.35;
    font-weight: 650;
    letter-spacing: 0;
  }

  span {
    color: ${colors.onSurfaceVariant};
    font-size: 12px;
    line-height: 16px;
    font-weight: 600;
  }
`;

export const NotificationFooter = styled.div`
  flex: 0 0 auto;
  padding: 16px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
`;

export const PanelActionButton = styled.button`
  width: 100%;
  min-height: 40px;
  border-radius: 8px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  background: rgba(255, 255, 255, 0.04);
  color: ${colors.onSurface};
  font-size: 14px;
  line-height: 20px;
  font-weight: 800;
  letter-spacing: 0;
  cursor: pointer;
  transition:
    background 180ms ease,
    transform 180ms ease;

  &:hover {
    background: rgba(255, 255, 255, 0.1);
  }

  &:active {
    transform: scale(0.98);
  }
`;
