import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import AxiosApi from "../api/AxiosApi";
import { useAuth } from "../context/AuthContext";
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
  NotificationContentButton,
  NotificationIconBox,
  NotificationItem,
  NotificationPanel,
  NotificationPanelHeader,
  NotificationReadButton,
  NotificationText,
  ProfileButton,
  SearchBox,
  SearchInput,
  UnreadDot,
} from "./HeaderCss";

const getResponseData = (response) =>
  response?.data?.data ?? response?.data ?? response;

const getSliceContent = (data) => {
  if (Array.isArray(data)) {
    return data;
  }

  if (Array.isArray(data?.content)) {
    return data.content;
  }

  return [];
};

const formatNotificationTime = (createdAt) => {
  if (!createdAt) {
    return "";
  }

  return String(createdAt).replace("T", " ").slice(0, 16);
};

/*
 * 백엔드 Notification 응답을 Header 알림창에서 쓰는 형태로 변환합니다.
 * 실제 백엔드 필드명:
 * - notificationId
 * - title
 * - content
 * - referenceId
 * - readStatus
 * - targetUrl
 * - createdAt
 * - createdA
 */
const normalizeNotification = (notification, index) => {
  const id =
    notification.notificationId ||
    notification.id ||
    notification.referenceId ||
    `notification-${index}`;

  return {
    id,
    notificationId: notification.notificationId || notification.id || null,
    title:
      notification.title ||
      notification.content ||
      "찜한 축제 시작 알림이 도착했습니다.",
    time:
      notification.time ||
      formatNotificationTime(notification.createdAt || notification.createdA),
    type: notification.notificationType === "SYSTEM" ? "system" : "calendar",
    unread:
      typeof notification.readStatus === "boolean"
        ? !notification.readStatus
        : true,
    referenceId: notification.referenceId || null,
    targetUrl: notification.targetUrl || null,
  };
};

function Header() {
  const location = useLocation();
  const navigate = useNavigate();
  const auth = useAuth() || {};
  const {
    user,
    isLoggedIn: authIsLoggedIn = false,
    isAuthLoading = false,
    logout,
  } = auth;

  const profileButtonRef = useRef(null);
  const dropdownRef = useRef(null);
  const notificationButtonRef = useRef(null);
  const notificationPanelRef = useRef(null);

  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [notificationList, setNotificationList] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  /*
   * 실제 로그인 API 연결 시 사용할 로그인 판단 코드.
   * 백엔드 UserRole enum은 USER, PREMIUM, ADMIN 이므로 ADMIN도 체크합니다.
   */
  const isLoggedIn = Boolean(authIsLoggedIn);
  const shouldShowLoginButton = !isAuthLoading && !isLoggedIn;
  const isAdmin =
    user?.role === "ADMIN" ||
    user?.role === "ROLE_ADMIN" ||
    user?.authority === "ADMIN" ||
    user?.authority === "ROLE_ADMIN";
  const userName = user?.nickname || user?.name || user?.loginId || "사용자님";
  const profileImageUrl = user?.profileImageUrl || "";

  const visibleNotifications = useMemo(
    () => notificationList.filter((notification) => notification.unread),
    [notificationList],
  );

  const closeMenus = () => {
    setIsUserMenuOpen(false);
    setIsNotificationOpen(false);
  };

  const handleProfileClick = () => {
    setIsUserMenuOpen((prev) => !prev);
    setIsNotificationOpen(false);
  };

  const handleNotificationClick = () => {
    setIsNotificationOpen((prev) => !prev);
    setIsUserMenuOpen(false);
  };

  const handleLoginClick = () => {
    closeMenus();
    navigate("/login");
  };

  /*
   * 실제 로그아웃 API 연결 시 사용할 코드.
   * 서버 로그아웃 실패와 무관하게 프론트 인증 상태는 정리합니다.
   */
  const handleLogout = async () => {
    try {
      await AxiosApi.logout();
    } catch (error) {
      console.error("로그아웃 실패:", error);
    } finally {
      logout?.();
      setNotificationList([]);
      setUnreadCount(0);
      closeMenus();
      navigate("/");
    }
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

  const fetchUnreadCount = useCallback(async () => {
    if (!isLoggedIn) {
      setUnreadCount(0);
      return;
    }

    try {
      const response = await AxiosApi.getUnreadAlarmsCount();
      const count = Number(getResponseData(response));
      setUnreadCount(Number.isFinite(count) ? count : 0);
    } catch (error) {
      console.error("읽지 않은 알림 개수 조회 실패:", error);
    }
  }, [isLoggedIn]);

  const removeReadNotifications = (readIds) => {
    const readIdSet = new Set(readIds.map(String));

    setNotificationList((prevList) =>
      prevList.filter((item) => !readIdSet.has(String(item.notificationId))),
    );
    setUnreadCount((prevCount) => Math.max(prevCount - readIdSet.size, 0));
  };

  /*
   * 보이는 알림을 백엔드에서 읽음 처리하고, 성공한 항목만 화면에서 제거합니다.
   */
  const handleMarkAllAsRead = async () => {
    const targetNotifications = visibleNotifications.filter(
      (notification) => notification.notificationId,
    );

    if (targetNotifications.length === 0) {
      return;
    }

    const results = await Promise.allSettled(
      targetNotifications.map((notification) =>
        AxiosApi.markAlarmAsRead(notification.notificationId),
      ),
    );

    const readIds = targetNotifications
      .filter((_, index) => results[index].status === "fulfilled")
      .map((notification) => notification.notificationId);

    if (readIds.length > 0) {
      removeReadNotifications(readIds);
    }
  };

  const handleNotificationReadClick = async (notification) => {
    if (!notification.notificationId) {
      return;
    }

    try {
      await AxiosApi.markAlarmAsRead(notification.notificationId);
      removeReadNotifications([notification.notificationId]);
    } catch (error) {
      console.error("알림 읽음 처리 실패:", error);
    }
  };

  /*
   * 알림 본문 클릭은 연결된 화면으로 이동만 하고, 읽음 처리는 별도 버튼에서만 수행합니다.
   */
  const handleNotificationItemClick = (notification) => {
    if (notification.targetUrl) {
      navigate(notification.targetUrl);
      closeMenus();
      return;
    }

    if (notification.referenceId) {
      navigate(`/detail/${notification.referenceId}`);
      closeMenus();
    }
  };

  useEffect(() => {
    if (!isLoggedIn) {
      setNotificationList([]);
      setUnreadCount(0);
      return;
    }

    fetchUnreadCount();
  }, [fetchUnreadCount, isLoggedIn]);

  /*
   * 실제 알림 API 연결 시 주석 해제.
   * 알림창이 열렸고 로그인 상태일 때만 알림 목록을 조회합니다.
   *
   * 백엔드 Notification 필드 기준:
   * - notificationId
   * - title
   * - content
   * - readStatus
   * - referenceId
   * - targetUrl
   * - createdAt
   */
  useEffect(() => {
    if (!isNotificationOpen || !isLoggedIn) {
      return;
    }

    const fetchNotifications = async () => {
      try {
        const response = await AxiosApi.getAlarms();
        const notificationData = getSliceContent(getResponseData(response));
        const normalizedNotifications =
          notificationData.map(normalizeNotification);

        setNotificationList(normalizedNotifications);
        fetchUnreadCount();
      } catch (error) {
        console.error("알림 목록 조회 실패:", error);
      }
    };

    fetchNotifications();
  }, [fetchUnreadCount, isNotificationOpen, isLoggedIn]);

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

          {shouldShowLoginButton && (
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
                  {profileImageUrl ? (
                    <img alt="" src={profileImageUrl} />
                  ) : isAdmin ? (
                    <ShieldCheck size={17} />
                  ) : (
                    <User size={17} />
                  )}
                </Avatar>
                <span>{userName}</span>
                <ChevronDown size={16} aria-hidden="true" />
              </ProfileButton>

              {isUserMenuOpen && (
                <Dropdown ref={dropdownRef} role="menu">
                  <DropdownHeader>
                    <DropdownMeta>사용자 설정</DropdownMeta>
                    <strong>{userName}</strong>
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
                    as="button"
                    type="button"
                    role="menuitem"
                    $danger
                    onClick={handleLogout}
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
                      <h2>알림</h2>
                    </div>

                    <button type="button" onClick={handleMarkAllAsRead}>
                      모두 읽음
                    </button>
                  </NotificationPanelHeader>

                  <div>
                    {visibleNotifications.length === 0 ? (
                      <div
                        style={{
                          padding: "28px 16px",
                          color: "#cfc2d6",
                          fontSize: "14px",
                          fontWeight: 700,
                          textAlign: "center",
                        }}
                      >
                        새 알림이 없습니다.
                      </div>
                    ) : (
                      visibleNotifications.map((notification) => (
                        <NotificationItem
                          key={notification.id}
                          $unread={notification.unread}
                        >
                          {notification.unread && <UnreadDot />}

                          <NotificationContentButton
                            type="button"
                            aria-label={`${notification.title} 알림 열기`}
                            onClick={() =>
                              handleNotificationItemClick(notification)
                            }
                          >
                            <NotificationIconBox $type={notification.type}>
                              {notification.type === "calendar" ? (
                                <CalendarDays size={21} aria-hidden="true" />
                              ) : (
                                <Bell size={21} aria-hidden="true" />
                              )}
                            </NotificationIconBox>

                            <NotificationText>
                              <p>{notification.title}</p>
                              <span>{notification.time}</span>
                            </NotificationText>
                          </NotificationContentButton>

                          {notification.notificationId && (
                            <NotificationReadButton
                              type="button"
                              aria-label={`${notification.title} 읽음 처리`}
                              onClick={() =>
                                handleNotificationReadClick(notification)
                              }
                            >
                              읽음
                            </NotificationReadButton>
                          )}
                        </NotificationItem>
                      ))
                    )}
                  </div>
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
