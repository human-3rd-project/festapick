import AxiosInstance from "./AxiosInstance";
import axios from "axios";
import Common from "../utils/Common";

// 인증이 필요 없는 공개 API
const publicApi = axios.create({ baseURL: Common.HM_DOMAIN });

const AxiosApi = {
  // 인증 (Auth)
  login: (email, password) =>
    publicApi.post("/auth/login", { email, password }),
  signup: (memberData) => publicApi.post("/auth/signup", memberData),

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
};

export default AxiosApi;
