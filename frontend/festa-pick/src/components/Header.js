import React, { useEffect, useMemo, useRef, useState } from "react";
// 실제 API 연결할 때 주석 해제
// import AxiosApi from "../api/AxiosApi";
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
  NotificationIconBox,
  NotificationItem,
  NotificationPanel,
  NotificationPanelHeader,
  NotificationText,
  ProfileButton,
  SearchBox,
  SearchInput,
  UnreadDot,
} from "./HeaderCss";

/*
 * 현재는 로그인 API가 아직 연결 전이라 테스트용 로그인 상태를 사용합니다.
 * "guest" → 비로그인 화면
 * "user" → 일반 회원 로그인 화면
 * "admin" → 관리자 로그인 화면
 */
const TEST_USER_TYPE = "admin"; // "guest" | "user" | "admin"
const TEST_USER_NAME = TEST_USER_TYPE === "admin" ? "관리자님" : "사용자님";

/*
 * 현재 알림 API 연결 전이므로 더미 데이터 사용.
 * 백엔드 Notification 엔티티 기준 실제 필드명은:
 * notificationId, title, content, notificationType, referenceType,
 * referenceId, readStatus, targetUrl, createdAt 입니다.
 */
const initialNotifications = [
  {
    id: 1,
    title: "찜한 축제 '서울 재즈 페스티벌'의 시작일이 2일 남았습니다.",
    time: "2시간 전",
    type: "calendar",
    unread: true,
    referenceId: null,
    targetUrl: null,
  },
  {
    id: 2,
    title: "찜한 축제 '부산 불꽃축제'가 오늘 6시에 시작됩니다.",
    time: "5시간 전",
    type: "festival",
    unread: true,
    referenceId: null,
    targetUrl: null,
  },
  {
    id: 3,
    title: "찜한 축제 'K-푸드 페스타'가 내일 시작됩니다.",
    time: "8시간 전",
    type: "calendar",
    unread: true,
    referenceId: null,
    targetUrl: null,
  },
];

const getHiddenNotificationIds = () => {
  try {
    return JSON.parse(localStorage.getItem("hiddenNotificationIds") || "[]");
  } catch {
    return [];
  }
};

const saveHiddenNotificationIds = (ids) => {
  localStorage.setItem("hiddenNotificationIds", JSON.stringify(ids));
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
    time: notification.time || formatNotificationTime(notification.createdAt),
    type: "calendar",
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

  const profileButtonRef = useRef(null);
  const dropdownRef = useRef(null);
  const notificationButtonRef = useRef(null);
  const notificationPanelRef = useRef(null);

  /*
   * 실제 로그인 API 연결 시 사용할 state.
   * 지금은 테스트 관리자 화면을 보기 위해 주석 처리합니다.
   */
  // const [userInfo, setUserInfo] = useState(null);

  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [notificationList, setNotificationList] = useState(() => {
    const hiddenIds = getHiddenNotificationIds();

    return initialNotifications.filter(
      (notification) => !hiddenIds.includes(String(notification.id)),
    );
  });

  /*
   * 실제 로그인 API 연결 시 사용할 로그인 판단 코드.
   * 백엔드 UserRole enum은 USER, PREMIUM, ADMIN 이므로 ADMIN도 체크합니다.
   */
  // const isLoggedIn = !!userInfo;
  // const isAdmin =
  //   userInfo?.role === "ADMIN" ||
  //   userInfo?.role === "ROLE_ADMIN" ||
  //   userInfo?.authority === "ADMIN" ||
  //   userInfo?.authority === "ROLE_ADMIN";
  // const userName =
  //   userInfo?.nickname || userInfo?.name || userInfo?.loginId || "사용자님";

  /*
   * 현재는 테스트용 관리자 로그인 상태.
   */
  const isLoggedIn = TEST_USER_TYPE === "user" || TEST_USER_TYPE === "admin";
  const isAdmin = TEST_USER_TYPE === "admin";
  const userName = TEST_USER_NAME;

  const visibleNotifications = useMemo(
    () => notificationList.filter((notification) => notification.unread),
    [notificationList],
  );

  const unreadCount = visibleNotifications.length;

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
   * 현재는 테스트 화면 확인용이라 API 호출 없이 이동만 처리합니다.
   */
  // const handleLogout = async () => {
  //   try {
  //     await AxiosApi.logout();
  //   } catch (error) {
  //     console.error("로그아웃 실패:", error);
  //   } finally {
  //     localStorage.removeItem("accessToken");
  //     localStorage.removeItem("refreshToken");
  //     localStorage.removeItem("token");
  //     setUserInfo(null);
  //     closeMenus();
  //     navigate("/login");
  //   }
  // };

  const handleLogout = () => {
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

  /*
   * Mark all as read는 백엔드 읽음 처리 API를 호출하지 않습니다.
   * 현재 화면에서만 알림을 숨기고, localStorage에 숨긴 알림 id를 저장합니다.
   */
  const handleMarkAllAsRead = () => {
    const currentIds = visibleNotifications.map((notification) =>
      String(notification.id),
    );
    const hiddenIds = getHiddenNotificationIds();
    const nextHiddenIds = Array.from(new Set([...hiddenIds, ...currentIds]));

    saveHiddenNotificationIds(nextHiddenIds);
    setNotificationList([]);
  };

  /*
   * 개별 알림 클릭도 백엔드 읽음 처리 없이 프론트에서만 숨김 처리합니다.
   * referenceId 또는 targetUrl이 있으면 나중에 상세 페이지 이동까지 연결 가능합니다.
   */
  const handleNotificationItemClick = (notification) => {
    const hiddenIds = getHiddenNotificationIds();
    const nextHiddenIds = Array.from(
      new Set([...hiddenIds, String(notification.id)]),
    );

    saveHiddenNotificationIds(nextHiddenIds);

    setNotificationList((prevList) =>
      prevList.filter((item) => item.id !== notification.id),
    );

    if (notification.targetUrl) {
      navigate(notification.targetUrl);
      closeMenus();
      return;
    }

    if (notification.referenceId) {
      navigate(`/festivals/${notification.referenceId}`);
      closeMenus();
    }
  };

  /*
   * 실제 로그인 API 연결 시 주석 해제.
   * Header가 처음 렌더링될 때 localStorage 토큰을 확인하고,
   * 토큰이 있으면 내 프로필 정보를 조회해서 userInfo에 저장합니다.
   */
  // useEffect(() => {
  //   const fetchMyProfile = async () => {
  //     const accessToken =
  //       localStorage.getItem("accessToken") || localStorage.getItem("token");
  //
  //     if (!accessToken) {
  //       setUserInfo(null);
  //       return;
  //     }
  //
  //     try {
  //       const response = await AxiosApi.getMyProfile();
  //       const profile = response.data?.data || response.data;
  //       setUserInfo(profile);
  //     } catch (error) {
  //       console.error("헤더 사용자 정보 조회 실패:", error);
  //       setUserInfo(null);
  //     }
  //   };
  //
  //   fetchMyProfile();
  // }, []);

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
  // useEffect(() => {
  //   if (!isNotificationOpen || !isLoggedIn) {
  //     return;
  //   }
  //
  //   const fetchNotifications = async () => {
  //     try {
  //       const response = await AxiosApi.getAlarms();
  //       const data = response.data?.data || response.data || [];
  //
  //       const notificationData = Array.isArray(data)
  //         ? data
  //         : data.content || [];
  //
  //       const hiddenIds = getHiddenNotificationIds();
  //
  //       const normalizedNotifications = notificationData
  //         .map(normalizeNotification)
  //         .filter(
  //           (notification) => !hiddenIds.includes(String(notification.id)),
  //         );
  //
  //       setNotificationList(normalizedNotifications);
  //     } catch (error) {
  //       console.error("알림 목록 조회 실패:", error);
  //     }
  //   };
  //
  //   fetchNotifications();
  // }, [isNotificationOpen, isLoggedIn]);

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
                      <h2>Notification</h2>
                    </div>

                    <button type="button" onClick={handleMarkAllAsRead}>
                      Mark all as read
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
                          type="button"
                          $unread={notification.unread}
                          onClick={() =>
                            handleNotificationItemClick(notification)
                          }
                        >
                          {notification.unread && <UnreadDot />}

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
