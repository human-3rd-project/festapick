import { createContext, useContext, useState } from "react";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(
    localStorage.getItem("accessToken") !== null,
  );

  // 새로고침 후에도 name/email 유지: localStorage에서 복원
  const [user, setUser] = useState(() => {
    const name = localStorage.getItem("userName");
    const email = localStorage.getItem("userEmail");
    return name ? { name, email } : null;
  });

  // 로그인 성공 시 호출
  const login = (userData) => {
    // localStorage에도 저장 → 새로고침 시 복원 가능
    if (userData.name) localStorage.setItem("userName", userData.name);
    if (userData.email) localStorage.setItem("userEmail", userData.email);
    setIsLoggedIn(true);
    setUser(userData);
  };

  // 로그아웃 시 호출
  const logout = () => {
    localStorage.clear();
    setIsLoggedIn(false);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
export default AuthContext;
