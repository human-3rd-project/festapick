import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  Link,
  NavLink as RouterNavLink,
  useLocation,
  useNavigate,
} from "react-router-dom";
import {
  Bell,
  CalendarDays,
  ChevronDown,
  LogIn,
  LogOut,
  Search,
  ShieldCheck,
  Sparkles,
  User,
  X,
} from "lucide-react";
import {
  ActionArea,
  AdminMenuLink,
  Avatar,
  BrandLink,
  CloseButton,
  Dropdown,
  DropdownHeader,
  DropdownLink,
  DropdownMeta,
  HeaderBar,
  HeaderInner,
  LoginButton,
  MenuDivider,
  Nav,
  NavLink,
  NotificationBadge,
  NotificationButton,
  NotificationFooter,
  NotificationIconBox,
  NotificationItem,
  NotificationPanel,
  NotificationPanelHeader,
  NotificationText,
  PanelActionButton,
  ProfileButton,
  SearchBox,
  SearchInput,
  UnreadDot,
} from "./HeaderCss";

const TEST_USER_TYPE = "admin"; // "guest" | "user" | "admin"
const TEST_USER_NAME = TEST_USER_TYPE === "admin" ? "관리자님" : "사용자님";

const notifications = [
  {
    id: 1,
    title: "찜한 축제 '서울 재즈 페스티벌'의 시작일이 2일 남았습니다.",
    time: "2시간 전",
    type: "calendar",
    unread: true,
  },
  {
    id: 2,
    title: "찜한 축제 '부산 불꽃축제'가 오늘 6시에 시작됩니다.",
    time: "5시간 전",
    type: "festival",
    unread: true,
  },
  {
    id: 3,
    title: "찜한 축제 'K-푸드 페스타'가 내일 시작됩니다.",
    time: "8시간 전",
    type: "food",
    unread: true,
  },
  {
    id: 4,
    title: "AI가 회원님에게 어울리는 축제를 추천했어요.",
    time: "어제",
    type: "ai",
    unread: false,
  },
  {
    id: 5,
    title: "새로운 공지사항이 등록되었습니다.",
    time: "3일 전",
    type: "notice",
    unread: false,
  },
];

function Header() {
  const location = useLocation();
  const navigate = useNavigate();
  const profileButtonRef = useRef(null);
  const dropdownRef = useRef(null);
  const notificationButtonRef = useRef(null);
  const notificationPanelRef = useRef(null);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [searchKeyword, setSearchKeyword] = useState("");

  const isLoggedIn = TEST_USER_TYPE === "user" || TEST_USER_TYPE === "admin";
  const isAdmin = TEST_USER_TYPE === "admin";
  const unreadCount = useMemo(
    () => notifications.filter((notification) => notification.unread).length,
    [],
  );

  const handleProfileClick = () => {
    setIsUserMenuOpen((prev) => !prev);
    setIsNotificationOpen(false);
  };

  const handleNotificationClick = () => {
    setIsNotificationOpen((prev) => !prev);
    setIsUserMenuOpen(false);
  };

  const closeMenus = () => {
    setIsUserMenuOpen(false);
    setIsNotificationOpen(false);
  };

  const handleLoginClick = () => {
    closeMenus();
    navigate("/login");
  };

  const handleSearchSubmit = (event) => {
    event.preventDefault();
    const trimmedKeyword = searchKeyword.trim();

    navigate(
      trimmedKeyword
        ? `/search?keyword=${encodeURIComponent(trimmedKeyword)}`
        : "/search",
      { state: { keyword: trimmedKeyword } },
    );
    closeMenus();
  };

  const isActivePath = (path) => {
    if (path === "/") {
      return location.pathname === "/";
    }

    return (
      location.pathname === path || location.pathname.startsWith(`${path}/`)
    );
  };

  useEffect(() => {
    const handleOutsideClick = (event) => {
      const target = event.target;
      const isProfileArea =
        profileButtonRef.current?.contains(target) ||
        dropdownRef.current?.contains(target);
      const isNotificationArea =
        notificationButtonRef.current?.contains(target) ||
        notificationPanelRef.current?.contains(target);

      if (!isProfileArea) {
        setIsUserMenuOpen(false);
      }

      if (!isNotificationArea) {
        setIsNotificationOpen(false);
      }
    };

    const handleEscapeKey = (event) => {
      if (event.key === "Escape") {
        setIsUserMenuOpen(false);
        setIsNotificationOpen(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    document.addEventListener("keydown", handleEscapeKey);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
      document.removeEventListener("keydown", handleEscapeKey);
    };
  }, []);

  return (
    <HeaderBar>
      <HeaderInner>
        <BrandLink as={Link} to="/" onClick={closeMenus}>
          FestaPick
        </BrandLink>

        <Nav aria-label="주요 메뉴">
          <NavLink
            as={RouterNavLink}
            to="/search"
            $active={isActivePath("/search")}
          >
            축제 탐색
          </NavLink>
          <NavLink
            as={RouterNavLink}
            to="/donation"
            $active={isActivePath("/donation")}
          >
            후원
          </NavLink>
          <NavLink
            as={RouterNavLink}
            to="/calendar"
            $active={isActivePath("/calendar")}
          >
            캘린더
          </NavLink>
          <NavLink as={RouterNavLink} to="/ai" $active={isActivePath("/ai")}>
            AI 추천
          </NavLink>
        </Nav>

        <ActionArea>
          <SearchBox as="form" onSubmit={handleSearchSubmit}>
            <Search size={17} aria-hidden="true" />
            <SearchInput
              value={searchKeyword}
              onChange={(event) => setSearchKeyword(event.target.value)}
              type="search"
              placeholder="어떤 축제를 찾으세요?"
              aria-label="축제 검색"
            />
          </SearchBox>

          {!isLoggedIn && (
            <LoginButton type="button" onClick={handleLoginClick}>
              <LogIn size={16} aria-hidden="true" />
              Login
            </LoginButton>
          )}

          {isLoggedIn && (
            <>
              <NotificationButton
                ref={notificationButtonRef}
                type="button"
                aria-label="알림 열기"
                aria-expanded={isNotificationOpen}
                onClick={handleNotificationClick}
              >
                <Bell size={22} aria-hidden="true" />
                {unreadCount > 0 && (
                  <NotificationBadge>{unreadCount}</NotificationBadge>
                )}
              </NotificationButton>

              <ProfileButton
                ref={profileButtonRef}
                type="button"
                aria-haspopup="menu"
                aria-expanded={isUserMenuOpen}
                onClick={handleProfileClick}
              >
                <Avatar aria-hidden="true">
                  {isAdmin ? <ShieldCheck size={17} /> : <User size={17} />}
                </Avatar>
                <span>{TEST_USER_NAME}</span>
                <ChevronDown size={16} aria-hidden="true" />
              </ProfileButton>

              {isUserMenuOpen && (
                <Dropdown ref={dropdownRef} role="menu">
                  <DropdownHeader>
                    <DropdownMeta>사용자 설정</DropdownMeta>
                    <strong>{TEST_USER_NAME}</strong>
                  </DropdownHeader>
                  <DropdownLink
                    as={Link}
                    to="/mypage/profile"
                    role="menuitem"
                    onClick={closeMenus}
                  >
                    <User size={16} aria-hidden="true" />
                    마이페이지
                  </DropdownLink>
                  {isAdmin && (
                    <AdminMenuLink
                      as={Link}
                      to="/admin/members"
                      role="menuitem"
                      onClick={closeMenus}
                    >
                      <ShieldCheck size={16} aria-hidden="true" />
                      관리자 페이지
                    </AdminMenuLink>
                  )}
                  <MenuDivider />
                  <DropdownLink
                    as={Link}
                    to="/login"
                    role="menuitem"
                    $danger
                    onClick={closeMenus}
                  >
                    <LogOut size={16} aria-hidden="true" />
                    로그아웃
                  </DropdownLink>
                </Dropdown>
              )}

              {isNotificationOpen && (
                <NotificationPanel ref={notificationPanelRef}>
                  <NotificationPanelHeader>
                    <div>
                      <CloseButton
                        type="button"
                        aria-label="알림 패널 닫기"
                        onClick={() => setIsNotificationOpen(false)}
                      >
                        <X size={18} aria-hidden="true" />
                      </CloseButton>
                      <h2>Notification</h2>
                    </div>
                    <button type="button">Mark all as read</button>
                  </NotificationPanelHeader>

                  <div>
                    {notifications.map((notification) => (
                      <NotificationItem
                        key={notification.id}
                        type="button"
                        $unread={notification.unread}
                      >
                        {notification.unread && <UnreadDot />}
                        <NotificationIconBox $type={notification.type}>
                          {notification.type === "calendar" && (
                            <CalendarDays size={21} aria-hidden="true" />
                          )}
                          {notification.type === "ai" && (
                            <Sparkles size={21} aria-hidden="true" />
                          )}
                          {notification.type !== "calendar" &&
                            notification.type !== "ai" && (
                              <Bell size={21} aria-hidden="true" />
                            )}
                        </NotificationIconBox>
                        <NotificationText>
                          <p>{notification.title}</p>
                          <span>{notification.time}</span>
                        </NotificationText>
                      </NotificationItem>
                    ))}
                  </div>

                  <NotificationFooter>
                    <PanelActionButton type="button">
                      View all notifications
                    </PanelActionButton>
                  </NotificationFooter>
                </NotificationPanel>
              )}
            </>
          )}
        </ActionArea>
      </HeaderInner>
    </HeaderBar>
  );
}

export default Header;
