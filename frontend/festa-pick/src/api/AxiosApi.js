import AxiosInstance from "./AxiosInstance";
import axios from "axios";
import Common from "../utils/Common";

// 인증이 필요 없는 공개 API
const publicApi = axios.create({ baseURL: Common.HM_DOMAIN });

const AxiosApi = {
  // 관리자 사용자 검색 API
  adminUserSearch: (keyword, page = 0, size = 10) =>
    AxiosInstance.get("/admin/users/search", {
      params: { keyword, page, size },
    }),

  // 관리자 사용자 상태 업데이트 API
  adminUserUpdate: (userId, status) =>
    AxiosInstance.patch("/admin/users/status", { userId, status }),

  // 관리자 리뷰 검색 API
  adminReviewSearch: (keyword, page = 0, size = 10) =>
    AxiosInstance.get("/admin/reviews/search", {
      params: { keyword, page, size },
    }),

  // 관리자 리뷰 삭제 API
  adminReviewDelete: (reviewId) =>
    AxiosInstance.delete(`/admin/reviews/${reviewId}`),

  // 관리자 축제 검색 API
  adminFestivalSearch: (keyword, page = 0, size = 10) =>
    AxiosInstance.get("/admin/festivals/search", {
      params: { keyword, page, size },
    }),

  // 관리자 축제 삭제 API
  adminFestivalDelete: (festivalId) =>
    AxiosInstance.delete(`/admin/festivals/${festivalId}`),

  // 관리자 후원 검색 API
  adminDonationSearch: (keyword, page = 0, size = 10) =>
    AxiosInstance.get("/admin/donations/search", {
      params: { keyword, page, size },
    }),

  adminSponsorshipSearch: (keyword, page = 0, size = 10) =>
    AxiosInstance.get("/admin/donations/search", {
      params: { keyword, page, size },
    }),

  // 채팅방 채팅 기록 조회 API
  getChatHistory: (chatRoomId, size = 30) =>
    publicApi.get(`/chat/rooms/${chatRoomId}/messages`, { params: { size } }),

  // 후원 신청 생성
  donationApply: (amount = 10000) =>
    AxiosInstance.post("/donations", null, {
      params: { amount },
    }),

  // 후원 결제 요청 생성
  donationPayments: (donationId, orderId) =>
    AxiosInstance.post(`/donations/${donationId}/payments`, null, {
      params: { orderId },
    }),

  // 후원 최종 승인 API
  donationApprove: (data) =>
    AxiosInstance.post(`/donations/payments/confirm`, data),

  // 후원 실패 저장
  donationFail: (orderId, failReason) =>
    AxiosInstance.post("/donations/payments/failure", null, {
      params: { orderId, failReason },
    }),

  // 후원 성공 정보 조회
  donationSuccessInfo: (orderId) =>
    AxiosInstance.get("/donations/payments/success", {
      params: { orderId },
    }),

  // 후원 실패 정보 조회
  donationFailureInfo: (orderId) =>
    AxiosInstance.get("/donations/payments/failure", {
      params: { orderId },
    }),

  // 후원 통계 API
  donationStatistics: () => publicApi.get(`/donations/statistics`),

  // 알람 조회 API
  getAlarms: () => AxiosInstance.get(`/notifications/festival-start`),

  // 알람 읽지 않은 개수 조회 API
  getUnreadAlarmsCount: () => AxiosInstance.get(`/notifications/unread-count`),

  // 알람 읽음 처리 API
  markAlarmAsRead: (notificationId) =>
    AxiosInstance.patch(`/notifications/${notificationId}/read`),

  // 축제 찜 등록
  createFavorite: (festivalId) =>
    AxiosInstance.post(`/festivals/${festivalId}/favorites`),
  // 축제 찜 삭제
  deleteFavorite: (festivalId) =>
    AxiosInstance.delete(`/festivals/${festivalId}/favorites`),
  // 내 축제 찜 여부 조회
  isFavorite: (festivalId) =>
    AxiosInstance.get(`/festivals/${festivalId}/favorites/me`),
  // 내 찜 목록 페이지 조회
  getMyFavoriteList: (params = {}) =>
    AxiosInstance.get("/me/favorites", { params }),
  // 축제 찜 개수 조회
  getFavoriteCount: (festivalId) =>
    publicApi.get(`/festivals/${festivalId}/favorites/count`),
  // 축제 좋아요 등록
  createLike: (festivalId) =>
    AxiosInstance.post(`/festivals/${festivalId}/likes`),
  // 축제 좋아요 삭제
  deleteLike: (festivalId) =>
    AxiosInstance.delete(`/festivals/${festivalId}/likes`),
  // 내 축제 좋아요 여부 조회
  isLiked: (festivalId) =>
    AxiosInstance.get(`/festivals/${festivalId}/likes/me`),
  // 축제 좋아요 개수 조회
  getLikeCount: (festivalId) =>
    publicApi.get(`/festivals/${festivalId}/likes/count`),

  // 축제 리뷰 목록 페이지 조회
  getReviewList: (festivalId, params = {}) =>
    publicApi.get(`/festivals/${festivalId}/reviews`, { params }),
  // 리뷰 작성
  createReview: (reviewData) => AxiosInstance.post("/reviews", reviewData),
  // 리뷰 수정
  updateReview: (reviewId, reviewData) =>
    AxiosInstance.put(`/reviews/${reviewId}`, reviewData),
  // 리뷰 삭제
  deleteReview: (reviewId) => AxiosInstance.delete(`/reviews/${reviewId}`),
  // 내 리뷰 목록 페이지 조회
  getMyReviewList: (params = {}) =>
    AxiosInstance.get("/me/reviews", { params }),
  // 축제 리뷰 개수 조회
  getReviewCount: (festivalId) =>
    publicApi.get(`/festivals/${festivalId}/reviews/count`),

  // 방문 기록 등록
  createVisitHistory: (visitHistoryData) =>
    AxiosInstance.post("/visit-histories", visitHistoryData),
  // 방문 기록 기간별 목록 조회
  getVisitHistoryList: (startDate, endDate) =>
    AxiosInstance.get("/visit-histories", { params: { startDate, endDate } }),
  // 방문 기록 상세 조회
  getVisitHistory: (visitHistoryId) =>
    AxiosInstance.get(`/visit-histories/${visitHistoryId}`),
  // 방문 기록 수정
  updateVisitHistory: (visitHistoryId, visitHistoryData) =>
    AxiosInstance.put(`/visit-histories/${visitHistoryId}`, visitHistoryData),
  // 방문 기록 삭제
  deleteVisitHistory: (visitHistoryId) =>
    AxiosInstance.delete(`/visit-histories/${visitHistoryId}`),
  // 내 방문 기록 개수 조회
  getVisitHistoryCount: () => AxiosInstance.get("/visit-histories/count"),

  // AI에게 질문 보내기
  sendQuestion: (question, regionContext = {}) =>
    publicApi.post("/ai/question", {
      question,
      ...regionContext,
    }),

  // 현장톡 내용 AI 요약 조회
  getAiFieldSummary: (chatRoomId) =>
    AxiosInstance.get(`/ai/field-summary/${chatRoomId}`),

  // 인증 - 중복 확인
  checkLoginId: (loginId) =>
    publicApi.get("/auth/check-login-id", { params: { loginId } }),
  checkNickname: (nickname) =>
    publicApi.get("/auth/check-nickname", { params: { nickname } }),
  checkEmail: (email) =>
    publicApi.get("/auth/check-email", { params: { email } }),

  // 인증 - 회원가입/로그인
  login: (loginId, password) =>
    publicApi.post("/auth/login", { loginId, password }),
  signup: (memberData) => publicApi.post("/auth/signup", memberData),
  kakaoLogin: (code) =>
    publicApi.get("/auth/kakao/login", { params: { code } }),
  socialSignup: (temporaryToken, data) =>
    publicApi.post("/auth/social/signup", data, {
      headers: { "Temporary-Token": temporaryToken },
    }),
  reissueToken: (refreshToken) =>
    publicApi.post("/auth/reissue", null, {
      headers: { "Refresh-Token": refreshToken },
    }),
  logout: () => AxiosInstance.post("/auth/logout"),

  // 이메일 인증
  sendEmailVerification: (email) =>
    publicApi.post("/auth/email-verifications/send", null, {
      params: { email },
    }),
  verifyEmail: (data) =>
    publicApi.post("/auth/email-verifications/verify", data),

  // 계정 찾기/비밀번호 재설정
  findLoginId: (email) =>
    publicApi.get("/auth/account/login-id", { params: { email } }),
  requestPasswordReset: (data) =>
    publicApi.post("/auth/account/password-reset/request", data),
  validatePasswordResetToken: (token) =>
    publicApi.get("/auth/account/password-reset/validate", {
      params: { token },
    }),
  resetPassword: (data) => publicApi.post("/auth/account/password-reset", data),

  // 마이페이지 - 프로필/계정
  getMyProfile: () => AxiosInstance.get("/users/me"),
  updateMyProfile: (data) => AxiosInstance.patch("/users/me", data),
  changeMyPassword: (currentPassword, newPassword) =>
    AxiosInstance.post("/users/me/password", { currentPassword, newPassword }),
  deleteMyAccount: () => AxiosInstance.delete("/users/me"),

  // 이미지 업로드 - 로그인 필요, multipart/form-data의 file 파라미터로 전달
  uploadImage: (file) => {
    const formData = new FormData();
    formData.append("file", file);

    // multipart boundary는 브라우저/axios가 자동으로 붙이도록 헤더를 직접 지정하지 않습니다.
    return AxiosInstance.post("/uploads/images", formData);
  },

  // 마이페이지 - 관심 지역
  getMyRegion: () => AxiosInstance.get("/users/me/region"),
  updateMyRegion: (data) => AxiosInstance.patch("/users/me/region", data),

  // 게시글 페이지네이션
  getPosts: (page = 0, size = 10) =>
    AxiosInstance.get("/api/posts", { params: { page, size } }),
  // 게시글 상세 조회
  getPost: (id) => AxiosInstance.get(`/api/posts/${id}`),
  // 게시글 쓰기
  createPost: (data) => AxiosInstance.post("/api/posts", data),
  // 게시글 수정
  updatePost: (id, data) => AxiosInstance.put(`/api/posts/${id}`, data),
  // 게시글 삭제
  deletePost: (postId) => AxiosInstance.delete(`/api/posts/${postId}`),
  // 댓글 조회
  getComments: (postId) => AxiosInstance.get(`/api/posts/${postId}/comments`),
  // 댓글 쓰기
  createComment: (postId, data) =>
    AxiosInstance.post(`/api/posts/${postId}/comments`, data),
  // 댓글 수정
  updateComment: (postId, commentId, data) =>
    AxiosInstance.put(`/api/posts/${postId}/comments/${commentId}`, data),
  // 댓글 삭제
  deleteComment: (postId, commentId) =>
    AxiosInstance.delete(`/api/posts/${postId}/comments/${commentId}`),

  // 회원 전체 조회
  getMembers: () => AxiosInstance.get("/api/members"),
  // 개별 회원 조회
  getMember: (id) => AxiosInstance.get(`/api/members/${id}`),
  // 채팅방 목록 조회
  chatList: async () => {
    return await publicApi.get("/chat/list");
  },
  // 채팅방 생성
  chatCreate: async (name) => {
    return await publicApi.post("/chat/new", { name });
  },
  // 채팅방 정보 조회
  chatDetail: async (roomId) => {
    return await publicApi.get(`/chat/room/${roomId}`);
  },

  // 월별 축제 조회 - 공개 API
  getCalendarMonthlyFestivals: (targetMonth) =>
    publicApi.get("/calendar/monthly", { params: { targetMonth } }),

  // 지역 필터 조회 - 공개 API
  getCalendarRegionFilters: () => publicApi.get("/calendar/filters/regions"),

  // 테마 필터 조회 - 공개 API
  getCalendarThemeFilters: () => publicApi.get("/calendar/filters/themes"),

  // 찜한 축제 일정 조회 - 로그인 필요
  getFavoriteCalendars: (page = 0, size = 10) =>
    AxiosInstance.get("/calendar/favorites", { params: { page, size } }),

  // 캘린더 축제 필터 조회 - 로그인 필요
  getFilteredCalendars: ({
    year,
    month,
    ldongRegnCd,
    ldongSignguCd,
    categoryCode,
    favoriteOnly,
    page = 0,
    size = 10,
  }) =>
    AxiosInstance.get("/calendar", {
      params: {
        year,
        month,
        ldongRegnCd,
        ldongSignguCd,
        categoryCode,
        favoriteOnly,
        page,
        size,
      },
    }),

  // 축제 목록 조회
  getFestivalList: (page = 0, size = 10) =>
    publicApi.get("/festivals", { params: { page, size } }),

  // 축제 통합 검색
  searchFestivals: ({
    keyword,
    ldongRegnCd,
    ldongSignguCd,
    lclsSystm,
    startDate,
    endDate,
    sortType,
    page = 0,
    size = 10,
  }) =>
    publicApi.get("/festivals/search", {
      params: {
        keyword,
        ldongRegnCd,
        ldongSignguCd,
        lclsSystm,
        startDate,
        endDate,
        sortType,
        page,
        size,
      },
    }),

  // 키워드 검색
  searchByKeyword: (keyword, page = 0, size = 10) =>
    publicApi.get("/festivals/search/keyword", {
      params: { keyword, page, size },
    }),

  // 지역 검색
  searchByRegion: (ldongRegnCd, ldongSignguCd, page = 0, size = 10) =>
    publicApi.get("/festivals/search/region", {
      params: { ldongRegnCd, ldongSignguCd, page, size },
    }),

  // 테마 검색
  searchByTheme: (lclsSystm, page = 0, size = 10) =>
    publicApi.get("/festivals/search/theme", {
      params: { lclsSystm, page, size },
    }),

  // 기간 검색 - startDate, endDate는 "yyyy-MM-dd" 형태
  searchByPeriod: (startDate, endDate, page = 0, size = 10) =>
    publicApi.get("/festivals/search/period", {
      params: { startDate, endDate, page, size },
    }),

  // 지도 표시용 축제 조회
  getMapFestivals: (ldongRegnCd, ldongSignguCd) =>
    publicApi.get("/festivals/map", { params: { ldongRegnCd, ldongSignguCd } }),

  // 월별 축제 조회 - targetMonth는 "yyyy-MM" 형태
  getFestivalMonthlyFestivals: (targetMonth) =>
    publicApi.get("/festivals/monthly", { params: { targetMonth } }),

  // 지역 필터 조회
  getFestivalRegionFilters: () => publicApi.get("/festivals/filters/regions"),

  // 테마 필터 조회
  getFestivalThemeFilters: () => publicApi.get("/festivals/filters/themes"),

  // 축제 상세 조회
  getFestivalDetail: (festivalId) => publicApi.get(`/festivals/${festivalId}`),

  // 축제 위치 조회
  getFestivalLocation: (festivalId) =>
    publicApi.get(`/festivals/${festivalId}/location`),

  // 메인 화면 조회
  getMainPage: (ldongRegnCd, ldongSignguCd) =>
    publicApi.get("/main", { params: { ldongRegnCd, ldongSignguCd } }),

  // 메인 배너 조회
  getBannerFestivals: () => publicApi.get("/main/banners"),

  // 주변 추천 축제 조회
  getNearbyFestivalRecommendations: (ldongRegnCd, ldongSignguCd) =>
    AxiosInstance.get("/main/nearby", {
      params: { ldongRegnCd, ldongSignguCd },
    }),

  // 월별 전국 축제 조회 - targetMonth: "yyyy-MM"
  getMonthlyNationalFestivals: (targetMonth) =>
    publicApi.get("/main/monthly", { params: { targetMonth } }),

  // 실시간 인기 축제 조회
  getRealtimePopularFestivals: () => publicApi.get("/main/popular"),
};

export default AxiosApi;
