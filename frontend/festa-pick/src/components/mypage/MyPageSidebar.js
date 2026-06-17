import React, { useEffect, useMemo, useState } from "react";
import { NavLink } from "react-router-dom";
import {
  Heart,
  MapPin,
  NotebookTabs,
  PenLine,
  Settings,
  UserRound,
} from "lucide-react";
import AxiosApi from "../../api/AxiosApi";
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

const defaultProfileImageUrl =
  "data:image/svg+xml;utf8," +
  encodeURIComponent(`
    <svg width="240" height="240" viewBox="0 0 240 240" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="240" height="240" rx="54" fill="#F7F8FC"/>
      <g filter="url(#shadow)">
        <rect x="40" y="34" width="160" height="160" rx="40" fill="#F4F6FB"/>
        <circle cx="120" cy="93" r="30" fill="#5B4BDB"/>
        <path d="M74 152C77.8 131.7 97.6 120 120 120C142.4 120 162.2 131.7 166 152C167.2 158.4 162.1 164 155.6 164H84.4C77.9 164 72.8 158.4 74 152Z" fill="#5B4BDB"/>
      </g>
      <defs>
        <filter id="shadow" x="22" y="18" width="196" height="196" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
          <feDropShadow dx="0" dy="12" stdDeviation="14" flood-color="#D7DCE8" flood-opacity="0.8"/>
        </filter>
      </defs>
    </svg>
  `);

const fallbackProfile = {
  nickname: "밤하늘뮤직광",
  email: "user@festapick.com",
  profileImageUrl: defaultProfileImageUrl,
};

const getResponseData = (response) => response?.data?.data ?? response?.data;

function MyPageSidebar({ activePath }) {
  const [profile, setProfile] = useState(fallbackProfile);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const response = await AxiosApi.getMyProfile();
        const profileData = getResponseData(response);

        setProfile({
          nickname: profileData?.nickname || fallbackProfile.nickname,
          email: profileData?.email || fallbackProfile.email,
          profileImageUrl:
            profileData?.profileImageUrl || fallbackProfile.profileImageUrl,
        });
      } catch (error) {
        setProfile(fallbackProfile);
      }
    };

    loadProfile();
  }, []);

  const avatarText = useMemo(() => {
    const trimmedNickname = profile.nickname.trim();

    return trimmedNickname ? trimmedNickname.slice(0, 2) : "FP";
  }, [profile.nickname]);

  return (
    <S.Sidebar aria-label="\uB9C8\uC774\uD398\uC774\uC9C0 \uBA54\uB274">
      <S.ProfileBox>
        {profile.profileImageUrl ? (
          <S.AvatarImage src={profile.profileImageUrl} alt="" />
        ) : (
          <S.Avatar aria-hidden="true">{avatarText}</S.Avatar>
        )}
        <S.ProfileText>
          <S.ProfileName>{profile.nickname}</S.ProfileName>
          <S.ProfileMeta>{profile.email}</S.ProfileMeta>
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
