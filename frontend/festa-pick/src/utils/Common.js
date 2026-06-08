import axios from "axios";

const Common = {
  // 백엔드 주소
  HM_DOMAIN: "http://localhost:8111",

  // 엑세스 토큰 관리 (localStrage)
  getAccessToken: () => localStorage.getItem("accessToken"),
  setAccessToken: (token) => localStorage.setItem("accessToken", token),

  // 리프레시 토큰 관리 (localStorage)
  getRefreshToken: () => localStorage.getItem("refreshToken"),
  setRefreshToken: (token) => localStorage.setItem("refreshToken", token),

  // 401 에러 시 자동 토큰 재발급
  handleUnauthorized: async () => {
    const tokenRequestDto = {
      accessToken: Common.getAccessToken(),
      refreshToken: Common.getRefreshToken(),
    };
    try {
      // 재발급 엔드포인트: POST /auth/reissue
      const res = await axios.post(
        `${Common.HM_DOMAIN}/auth/reissue`,
        tokenRequestDto,
      );
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
