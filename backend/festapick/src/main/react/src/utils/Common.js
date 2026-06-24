import axios from "axios";

const Common = {
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
      // ✅ 상대 경로 사용 (도메인 없이)
      const res = await axios.post("/auth/reissue", {
        accessToken: Common.getAccessToken(),
        refreshToken: Common.getRefreshToken(),
      });
      Common.setAccessToken(res.data.data.accessToken);
      Common.setRefreshToken(res.data.data.refreshToken);
      return true;
    } catch (err) {
      localStorage.clear();
      return false;
    }
  },
};

export default Common;
