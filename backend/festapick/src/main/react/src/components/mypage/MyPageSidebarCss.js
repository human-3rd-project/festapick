import styled from "styled-components";

export const Sidebar = styled.aside`
  align-self: start;
  position: sticky;
  top: 24px;
  border: 1px solid rgba(143, 157, 255, 0.24);
  border-radius: 8px;
  background:
    linear-gradient(180deg, rgba(17, 21, 42, 0.94), rgba(8, 9, 20, 0.94)),
    radial-gradient(circle at 12% 0%, rgba(255, 45, 117, 0.2), transparent 34%);
  box-shadow:
    0 18px 48px rgba(0, 0, 0, 0.34),
    0 0 34px rgba(155, 92, 255, 0.1);
  overflow: hidden;

  @media (max-width: 900px) {
    position: static;
  }
`;

export const ProfileBox = styled.div`
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 22px 20px;
  border-bottom: 1px solid rgba(143, 157, 255, 0.18);
`;

export const Avatar = styled.div`
  display: grid;
  place-items: center;
  flex: 0 0 auto;
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: linear-gradient(135deg, #ff2d75, #9b5cff);
  color: #ffffff;
  font-size: 15px;
  font-weight: 900;
  box-shadow: 0 0 24px rgba(255, 45, 117, 0.34);
`;

export const AvatarImage = styled.img`
  display: block;
  flex: 0 0 auto;
  width: 48px;
  height: 48px;
  border: 2px solid rgba(155, 92, 255, 0.72);
  border-radius: 50%;
  background: #f7f8fc;
  object-fit: cover;
  box-shadow:
    0 0 0 3px rgba(255, 45, 117, 0.12),
    0 0 24px rgba(155, 92, 255, 0.24);
`;

export const ProfileText = styled.div`
  min-width: 0;
`;

export const ProfileName = styled.p`
  overflow: hidden;
  margin: 0;
  color: #ffffff;
  font-size: 15px;
  font-weight: 900;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

export const ProfileMeta = styled.p`
  overflow: hidden;
  margin: 5px 0 0;
  color: #9da8c3;
  font-size: 12px;
  font-weight: 600;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

export const MenuList = styled.nav`
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 10px;
`;

export const MenuItem = styled.div`
  min-width: 0;
`;

export const MenuLink = styled.a`
  display: flex;
  align-items: center;
  gap: 11px;
  min-height: 46px;
  padding: 0 13px;
  border-radius: 6px;
  color: #b8c1d8;
  text-decoration: none;
  transition:
    background-color 0.18s ease,
    color 0.18s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.07);
    color: #ffffff;
  }

  &.active {
    background: linear-gradient(
      135deg,
      rgba(255, 45, 117, 0.94),
      rgba(155, 92, 255, 0.9)
    );
    color: #ffffff;
    box-shadow: 0 0 24px rgba(255, 45, 117, 0.26);
  }
`;

export const IconWrap = styled.span`
  display: grid;
  place-items: center;
  flex: 0 0 auto;
  width: 24px;
  height: 24px;
`;

export const MenuText = styled.span`
  min-width: 0;
  font-size: 14px;
  font-weight: 800;
`;
