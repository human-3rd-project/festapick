import axios from "axios";
import Common from "../utils/Common";

const AxiosInstance = axios.create({
  baseURL: Common.HM_DOMAIN,
});

// 요청 인터셉터 - 모든 요청에 Authrization 헤더 자동 첨부
AxiosInstance.interceptors.request.use(
  (config) => {
    const accessToken = Common.getAccessToken();
    config.headers.Authorization = `Bearer ${accessToken}`;
    return config;
  },
  (error) => Promise.reject(error),
);

// 응답 인터셉터 - 401 발생 시 재발급 시도
AxiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true; // 무한 루프 방지
      const isRefreshed = await Common.handleUnauthorized();

      if (isRefreshed) {
        originalRequest.headers.Authorization = `Bearer ${Common.getAccessToken()}`;
        return axios(originalRequest); // 원본 요청 재시도
      }
      // 재발급 실패 → 로그아웃 처리
      localStorage.clear();
      window.location.href = "/";
    }
    return Promise.reject(error);
  },
);

export default AxiosInstance;
