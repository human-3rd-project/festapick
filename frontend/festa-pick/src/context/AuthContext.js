import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
  useContext,
} from "react";
import AxiosInstance from "../api/AxiosInstance";
import Common from "../utils/Common";

const AuthContext = createContext(null);

const getResponseData = (response) =>
  response?.data?.data ?? response?.data ?? response;

const removeAuthTokens = () => {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
};

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(
    Common.getAccessToken() !== null,
  );
  const [user, setUser] = useState(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);

  const clearAuth = useCallback(() => {
    removeAuthTokens();
    setIsLoggedIn(false);
    setUser(null);
  }, []);

  const fetchCurrentUser = useCallback(async () => {
    const response = await AxiosInstance.get("/users/me");
    const profile = getResponseData(response);

    setUser(profile);
    setIsLoggedIn(true);
    return profile;
  }, []);

  useEffect(() => {
    const restoreAuth = async () => {
      if (!Common.getAccessToken()) {
        clearAuth();
        setIsAuthLoading(false);
        return;
      }

      try {
        await fetchCurrentUser();
      } catch (error) {
        clearAuth();
      } finally {
        setIsAuthLoading(false);
      }
    };

    restoreAuth();
  }, [clearAuth, fetchCurrentUser]);

  // 로그인 성공 응답을 받아 토큰을 저장하고, 현재 사용자 정보를 다시 조회한다.
  const login = useCallback(
    async (loginResponse) => {
      const loginData = getResponseData(loginResponse);

      if (loginData?.accessToken) {
        Common.setAccessToken(loginData.accessToken);
      }

      if (loginData?.refreshToken) {
        Common.setRefreshToken(loginData.refreshToken);
      }

      setIsLoggedIn(true);

      if (loginData?.nickname || loginData?.profileImageUrl) {
        setUser({
          nickname: loginData.nickname,
          profileImageUrl: loginData.profileImageUrl,
        });
      }

      if (Common.getAccessToken()) {
        try {
          return await fetchCurrentUser();
        } catch (error) {
          return getResponseData(loginResponse);
        }
      }

      return loginData;
    },
    [fetchCurrentUser],
  );

  // 로그아웃 시 호출
  const logout = useCallback(() => {
    clearAuth();
  }, [clearAuth]);

  const value = useMemo(
    () => ({
      isLoggedIn,
      isAuthLoading,
      user,
      login,
      logout,
      fetchCurrentUser,
    }),
    [fetchCurrentUser, isAuthLoading, isLoggedIn, login, logout, user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
export default AuthContext;
