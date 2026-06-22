import axios from "axios";

const Common = {
  // 백엔드 주소
  HM_DOMAIN: "https://ba51-116-36-205-25.ngrok-free.app",

  // 엑세스 토큰 관리 (localStrage)
  getAccessToken: () => localStorage.getItem("accessToken"),
  setAccessToken: (token) => localStorage.setItem("accessToken", token),

  // 리프레시 토큰 관리 (localStorage)
  getRefreshToken: () => localStorage.getItem("refreshToken"),
  setRefreshToken: (token) => localStorage.setItem("refreshToken", token),

  // 401 에러 시 자동 토큰 재발급
  handleUnauthorized: async () => {
    const refreshToken = Common.getRefreshToken();

    if (!refreshToken) {
      localStorage.clear();
      return false;
    }

    try {
      // 재발급 엔드포인트: POST /auth/reissue
      const res = await axios.post(`${Common.HM_DOMAIN}/auth/reissue`, null, {
        headers: { "Refresh-Token": refreshToken },
        "ngrok-skip-browser-warning": "true",
      });
      // 백엔드 ApiResponse 구조: { status, message, data: { accessToken, ... } }
      Common.setAccessToken(res.data.data.accessToken);
      Common.setRefreshToken(res.data.data.refreshToken);
      return true;
    } catch (err) {
      console.error("리프레시 토큰 만료.");
      localStorage.clear();
      return false;
    }
  },
};

export default Common;
