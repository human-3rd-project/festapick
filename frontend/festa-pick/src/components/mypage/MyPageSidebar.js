import React from "react";
import { NavLink } from "react-router-dom";
import {
  Heart,
  MapPin,
  NotebookTabs,
  PenLine,
  Settings,
  UserRound,
} from "lucide-react";
import * as S from "./MyPageSidebarCss";

const menuItems = [
  {
    name: "\uD504\uB85C\uD544 \uC815\uBCF4",
    path: "/mypage/profile",
    icon: UserRound,
  },
  {
    name: "\uD65C\uB3D9 \uC9C0\uC5ED",
    path: "/mypage/region",
    icon: MapPin,
  },
  {
    name: "\uCC1C \uBAA9\uB85D",
    path: "/mypage/favorite",
    icon: Heart,
  },
  {
    name: "\uB098\uC758 \uAE30\uB85D",
    path: "/mypage/record",
    icon: NotebookTabs,
  },
  {
    name: "\uB098\uC758 \uB9AC\uBDF0",
    path: "/mypage/review",
    icon: PenLine,
  },
  {
    name: "\uACC4\uC815 \uAD00\uB9AC",
    path: "/mypage/account",
    icon: Settings,
  },
];

function MyPageSidebar({ activePath }) {
  return (
    <S.Sidebar aria-label="\uB9C8\uC774\uD398\uC774\uC9C0 \uBA54\uB274">
      <S.ProfileBox>
        <S.Avatar aria-hidden="true">FP</S.Avatar>
        <S.ProfileText>
          <S.ProfileName>FestaPick</S.ProfileName>
          <S.ProfileMeta>
            \uCD95\uC81C \uCDE8\uD5A5 \uBD84\uC11D\uC911
          </S.ProfileMeta>
        </S.ProfileText>
      </S.ProfileBox>

      <S.MenuList>
        {menuItems.map(({ name, path, icon: Icon }) => (
          <S.MenuItem key={path}>
            <S.MenuLink
              as={NavLink}
              to={path}
              className={({ isActive }) =>
                isActive || activePath === path ? "active" : undefined
              }
            >
              <S.IconWrap aria-hidden="true">
                <Icon size={18} strokeWidth={2.2} />
              </S.IconWrap>
              <S.MenuText>{name}</S.MenuText>
            </S.MenuLink>
          </S.MenuItem>
        ))}
      </S.MenuList>
    </S.Sidebar>
  );
}

export default MyPageSidebar;
