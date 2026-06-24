import React from "react";
import { ClipboardList, History, PartyPopper, Users } from "lucide-react";
import {
  AdminSidebar,
  BrandArea,
  BrandIcon,
  BrandLabel,
  BrandName,
  BrandText,
  MenuItem,
  MenuList,
  SidebarFooter,
} from "./AdminNavCss";

const adminMenus = [
  {
    label: "회원 관리",
    path: "/admin/members",
    icon: Users,
  },
  {
    label: "리뷰 관리",
    path: "/admin/reviews",
    icon: ClipboardList,
  },
  {
    label: "페스티벌 관리",
    path: "/admin/festivals",
    icon: PartyPopper,
  },
  {
    label: "후원 내역",
    path: "/admin/donations",
    icon: History,
  },
];

function AdminNav() {
  return (
    <AdminSidebar aria-label="관리자 메뉴">
      <BrandArea>
        <BrandIcon aria-hidden="true">
          <PartyPopper />
        </BrandIcon>
        <BrandText>
          <BrandName>FestaPick</BrandName>
          <BrandLabel>관리자 콘솔</BrandLabel>
        </BrandText>
      </BrandArea>

      <MenuList>
        {adminMenus.map(({ label, path, icon: Icon }) => (
          <MenuItem key={path} to={path}>
            <Icon aria-hidden="true" />
            <span>{label}</span>
          </MenuItem>
        ))}
      </MenuList>

      <SidebarFooter aria-hidden="true" />
    </AdminSidebar>
  );
}

export default AdminNav;
