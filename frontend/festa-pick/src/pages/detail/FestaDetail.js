import { useEffect, useMemo, useRef, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import {
  ChevronDown,
  ChevronUp,
  Heart,
  MapPin,
  Maximize2,
  MessageCircle,
  Navigation,
  Send,
  Star,
  ThumbsUp,
} from "lucide-react";

import RealTimeTalkModal from "./LiveTalkModal";
import ReviewModal from "./ReviewModal";
import AxiosApi from "../../api/AxiosApi";
import ChatSocketApi from "../../api/ChatSocketApi";
import { useAuth } from "../../context/AuthContext";
import {
  ActionButton,
  AiMarquee,
  AiMarqueeContent,
  Badge,
  BodyGrid,
  ConfirmActions,
  ConfirmBackdrop,
  ConfirmButton,
  ConfirmDialog,
  DetailText,
  DisabledOverlay,
  EmptyIcon,
  EmptyState,
  FloatingTalk,
  FloatingTalkBody,
  FloatingTalkHeader,
  FloatingTalkInput,
  FloatingTalkMessage,
  FloatingTalkPreview,
  Hero,
  HeroActions,
  HeroContent,
  HeroImage,
  HeroOverlay,
  InfoGrid,
  InfoLabel,
  InfoValue,
  LiveDot,
  MainColumn,
  MapCanvas,
  MapControls,
  MapDirectionButton,
  MapPinBadge,
  MapViewport,
  MetaText,
  Page,
  RatingLine,
  ReviewActions,
  ReviewCard,
  ReviewHeader,
  ReviewList,
  Section,
  SectionTitle,
  SmallIconButton,
  TagRow,
  TalkComposer,
  TalkControlGroup,
  TalkMiniLine,
  TextButton,
  Title,
} from "./FestaDetailCss";

const REVIEW_PAGE_SIZE = 3;
const CHAT_HISTORY_SIZE = 30;
const KAKAO_MAP_SDK_ID = "kakao-map-sdk";
const STAR_VALUES = [1, 2, 3, 4, 5];
const DEFAULT_FIELD_SUMMARY = "AI가 현장톡을 요약할 준비를 하고 있습니다.";

let kakaoMapLoaderPromise = null;

const loadKakaoMapSdk = () => {
  if (window.kakao?.maps) {
    return Promise.resolve(window.kakao);
  }

  const appKey = process.env.REACT_APP_KAKAO_JAVASCRIPT_KEY;

  if (!appKey) {
    return Promise.reject(new Error("Kakao Maps JavaScript key is missing."));
  }

  if (!kakaoMapLoaderPromise) {
    kakaoMapLoaderPromise = new Promise((resolve, reject) => {
      const existingScript = document.getElementById(KAKAO_MAP_SDK_ID);

      const handleLoad = () => {
        if (!window.kakao?.maps) {
          reject(new Error("Kakao Maps SDK failed to initialize."));
          return;
        }

        window.kakao.maps.load(() => resolve(window.kakao));
      };

      if (existingScript) {
        existingScript.addEventListener("load", handleLoad, { once: true });
        existingScript.addEventListener("error", reject, { once: true });
        return;
      }

      const script = document.createElement("script");
      script.id = KAKAO_MAP_SDK_ID;
      script.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${encodeURIComponent(
        appKey,
      )}&libraries=services&autoload=false`;
      script.async = true;
      script.addEventListener("load", handleLoad, { once: true });
      script.addEventListener("error", reject, { once: true });
      document.head.appendChild(script);
    });
  }

  return kakaoMapLoaderPromise;
};

const EMPTY_FESTIVAL = {
  festivalId: null,
  chatRoomId: null,
  title: "축제 정보 없음",
  category: "분류 정보 없음",
  image: "",
  period: "일정 정보 없음",
  time: "시간 정보 없음",
  location: "지역 정보 없음",
  venue: "장소 정보 없음",
  description: [],
  rating: 0,
  reviewCount: 0,
  favorite: false,
  liked: false,
  live: false,
  hasMap: false,
};

// 추가: ApiResponse(data 래핑)와 일반 axios 응답을 모두 안전하게 꺼내기 위한 헬퍼입니다.
const getResponseData = (response) =>
  response?.data?.data ?? response?.data ?? null;

// 추가: Spring Page 응답(content)과 일반 배열 응답을 모두 리뷰 배열로 처리합니다.
const getPageContent = (value) => {
  if (Array.isArray(value)) {
    return value;
  }

  if (Array.isArray(value?.content)) {
    return value.content;
  }

  return [];
};

// 추가: 숫자/문자열/빈 값이 섞인 ID 후보 중 실제 사용할 축제 ID를 찾습니다.
const getFestivalId = (...sources) =>
  sources
    .flatMap((source) => [
      source?.festivalId,
      source?.id,
      source?.contentId,
      source,
    ])
    .find((value) => value !== undefined && value !== null && value !== "");

// 추가: 날짜 문자열이 없거나 잘못 들어와도 화면에는 기본 문구를 보여줍니다.
const formatDate = (value) => {
  if (!value) {
    return "";
  }

  return String(value).replaceAll("-", ".");
};

// 추가: 백엔드 날짜(eventStartDate/eventEndDate)와 기존 period 필드를 같은 표시 형식으로 맞춥니다.
const formatPeriod = (festival) => {
  if (festival?.period) {
    return festival.period;
  }

  const startDate = formatDate(festival?.eventStartDate);
  const endDate = formatDate(festival?.eventEndDate);

  if (startDate && endDate) {
    return `${startDate} - ${endDate}`;
  }

  return startDate || endDate || EMPTY_FESTIVAL.period;
};

// 추가: description이 문자열/배열/null 중 무엇으로 오든 map 가능한 배열로 정리합니다.
const normalizeDescription = (description) => {
  if (Array.isArray(description)) {
    return description.filter(Boolean);
  }

  if (typeof description === "string" && description.trim()) {
    return description
      .split(/\r?\n+/)
      .map((paragraph) => paragraph.trim())
      .filter(Boolean);
  }

  return [];
};

// 추가: 리뷰 작성자 판별용으로 로그인 사용자 ID 후보를 한곳에서 확인합니다.
const getUserId = (user) => user?.userId ?? user?.id ?? user?.memberId ?? null;

const createFallbackId = () => {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID();
  }

  return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
};

// 추가: 백엔드 리뷰 DTO와 기존 로컬 리뷰 형태를 ReviewCard에서 쓰는 필드로 정규화합니다.
const normalizeReview = (review, currentUserId) => ({
  ...review,
  id: review?.reviewId ?? review?.id ?? crypto.randomUUID(),
  reviewId: review?.reviewId ?? review?.id,
  author: review?.nickname ?? review?.author ?? "익명",
  time:
    review?.time ||
    (review?.updatedAt
      ? "수정됨"
      : review?.createdAt
        ? formatDate(review.createdAt)
        : ""),
  rating: Math.min(5, Math.max(0, Number(review?.rating) || 0)),
  text: review?.content ?? review?.text ?? "",
  content: review?.content ?? review?.text ?? "",
  isMine:
    Boolean(review?.isMine) ||
    (currentUserId !== null &&
      Number(review?.userId) === Number(currentUserId)),
});

const formatChatTime = (createdAt) => {
  if (!createdAt) {
    return "";
  }

  return String(createdAt).replace("T", " ").slice(0, 16);
};

const normalizeChatMessage = (chat, currentUserId) => {
  const messageId = chat?.chatMessageId ?? chat?.id ?? createFallbackId();
  const userId = chat?.userId ?? chat?.memberId ?? null;

  return {
    ...chat,
    id: messageId,
    userId,
    author: chat?.nickname ?? chat?.author ?? "익명",
    text: chat?.message ?? chat?.text ?? "",
    image: chat?.imageUrl ?? chat?.image ?? "",
    avatar: chat?.profileImageUrl ?? chat?.avatar ?? "",
    time: chat?.time ?? formatChatTime(chat?.createdAt),
    isMine:
      Boolean(chat?.isMine) ||
      (currentUserId !== null &&
        userId !== null &&
        Number(userId) === Number(currentUserId)),
  };
};

const getAverageRating = (reviews) => {
  if (!reviews.length) {
    return 0;
  }

  const totalRating = reviews.reduce(
    (sum, review) => sum + (Number(review.rating) || 0),
    0,
  );

  return totalRating / reviews.length;
};

const renderStars = (rating, size, keyPrefix) => {
  const normalizedRating = Number(rating) || 0;

  return STAR_VALUES.map((star) => {
    const isFilled = star <= normalizedRating;

    return (
      <Star
        fill={isFilled ? "currentColor" : "none"}
        key={`${keyPrefix}-${star}`}
        size={size}
        strokeWidth={1.7}
        style={{
          color: isFilled ? "#ddb7ff" : "rgba(207, 194, 214, 0.42)",
        }}
      />
    );
  });
};

// 추가: 백엔드 상세 DTO와 검색 화면의 축제 데이터를 FestaDetail 표시용 필드로 정규화합니다.
const normalizeFestival = (sourceFestival) => {
  if (!sourceFestival) {
    return EMPTY_FESTIVAL;
  }

  const imageUrls = Array.isArray(sourceFestival.imageUrls)
    ? sourceFestival.imageUrls
    : [];
  const address = [sourceFestival.addr1, sourceFestival.addr2]
    .filter(Boolean)
    .join(" ");

  return {
    ...EMPTY_FESTIVAL,
    ...sourceFestival,
    festivalId: getFestivalId(sourceFestival),
    chatRoomId: sourceFestival.chatRoomId ?? null,
    title: sourceFestival.title || EMPTY_FESTIVAL.title,
    category:
      sourceFestival.category ||
      sourceFestival.categoryName ||
      EMPTY_FESTIVAL.category,
    image:
      sourceFestival.image ||
      sourceFestival.firstImage ||
      imageUrls[0] ||
      EMPTY_FESTIVAL.image,
    period: formatPeriod(sourceFestival),
    time: sourceFestival.time || EMPTY_FESTIVAL.time,
    location: sourceFestival.location || address || EMPTY_FESTIVAL.location,
    venue:
      sourceFestival.venue ||
      sourceFestival.addr2 ||
      sourceFestival.addr1 ||
      EMPTY_FESTIVAL.venue,
    description: normalizeDescription(sourceFestival.description),
    rating:
      Number.parseFloat(
        sourceFestival.averageRating ?? sourceFestival.rating,
      ) || 0,
    reviewCount: Number(sourceFestival.reviewCount) || 0,
    favorite: Boolean(sourceFestival.favorite),
    liked: Boolean(sourceFestival.liked),
    live:
      typeof sourceFestival.live === "boolean"
        ? sourceFestival.live
        : sourceFestival.progressType === "ONGOING" ||
          sourceFestival.status === "ACTIVE",
    hasMap:
      typeof sourceFestival.hasMap === "boolean"
        ? sourceFestival.hasMap
        : Boolean(sourceFestival.mapX && sourceFestival.mapY),
  };
};

function FestaDetail({
  festival: festivalProp,
  reviews: reviewsProp,
  isFestivalActive,
  hasMap: hasMapProp,
}) {
  const location = useLocation();
  const { festivalId: routeFestivalId } = useParams();
  // AuthContext 역할: 찜/좋아요/내 리뷰 판별처럼 로그인 상태가 필요한 기능에 사용합니다.
  const auth = useAuth();
  const currentUserId = getUserId(auth?.user);
  // 수정: AuthProvider가 감싸져 있다고 가정하고 AuthContext의 로그인 상태만 사용합니다.
  const isLoggedIn = auth?.isLoggedIn ?? false;
  const isAuthLoading = auth?.isAuthLoading ?? false;

  // 실시간 톡/리뷰 모달 UI 상태를 관리합니다.
  const [isTalkExpanded, setIsTalkExpanded] = useState(false);
  const [isTalkModalOpen, setIsTalkModalOpen] = useState(false);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [editingReview, setEditingReview] = useState(null);
  const [deletingReview, setDeletingReview] = useState(null);

  // 추가: API로 불러온 상세/리뷰/오류 상태입니다. API 실패 시 빈 상태를 표시합니다.
  const [apiFestival, setApiFestival] = useState(null);
  const [detailError, setDetailError] = useState("");
  const [reviewError, setReviewError] = useState("");
  const [actionMessage, setActionMessage] = useState("");

  // 리뷰/톡/찜/좋아요 로컬 상태입니다.
  const [localReviews, setLocalReviews] = useState([]);
  const [talkMessage, setTalkMessage] = useState("");
  const [chatMessages, setChatMessages] = useState([]);
  const [chatStatusMessage, setChatStatusMessage] = useState("");
  const [aiSummary, setAiSummary] = useState(DEFAULT_FIELD_SUMMARY);
  const [isChatConnecting, setIsChatConnecting] = useState(false);
  const [isChatConnected, setIsChatConnected] = useState(false);
  const [isChatUploading, setIsChatUploading] = useState(false);
  const [isFavorite, setIsFavorite] = useState(Boolean(festivalProp?.favorite));
  const [isLiked, setIsLiked] = useState(Boolean(festivalProp?.liked));
  const [visibleReviewCount, setVisibleReviewCount] =
    useState(REVIEW_PAGE_SIZE);
  const [mapMessage, setMapMessage] = useState("");
  const mapContainerRef = useRef(null);
  const kakaoMapRef = useRef(null);
  const chatSocketRef = useRef(null);

  // 라우터 state에서 넘어온 축제 정보가 있으면 API 로딩 전 초기 화면에 사용합니다.
  const routedFestival = location.state?.festival;
  const requestedFestivalId = useMemo(
    () => getFestivalId(festivalProp, routedFestival, routeFestivalId),
    [festivalProp, routedFestival, routeFestivalId],
  );

  // 축제 상세 표시 데이터: API 상세 > props > route state > 기본값 순서로 사용합니다.
  const festival = useMemo(() => {
    const sourceFestival = apiFestival || festivalProp || routedFestival;
    return normalizeFestival(sourceFestival);
  }, [apiFestival, festivalProp, routedFestival]);

  const resolvedIsFestivalActive =
    isFestivalActive ??
    (typeof festival.live === "boolean" ? festival.live : true);
  const resolvedHasMap =
    hasMapProp ??
    (typeof festival.hasMap === "boolean" ? festival.hasMap : true);
  const mapCoordinates = useMemo(() => {
    const longitude = Number(festival.mapX);
    const latitude = Number(festival.mapY);

    if (!Number.isFinite(longitude) || !Number.isFinite(latitude)) {
      return null;
    }

    return { latitude, longitude };
  }, [festival.mapX, festival.mapY]);
  const canRenderKakaoMap = resolvedHasMap && Boolean(mapCoordinates);
  const chatRoomId = festival.chatRoomId;
  const canOpenChat = resolvedIsFestivalActive && Boolean(chatRoomId);
  const canConnectChat = canOpenChat && isLoggedIn && !isAuthLoading;
  const canSendChat = canConnectChat && isChatConnected && !isChatUploading;
  const canShowAiSummary = canOpenChat && isLoggedIn && !isAuthLoading;
  const chatInputPlaceholder = !chatRoomId
    ? "채팅방이 준비되지 않았습니다."
    : isAuthLoading
      ? "로그인 상태를 확인하고 있습니다."
      : isLoggedIn
        ? isChatConnecting
          ? "채팅 서버에 연결하는 중입니다."
          : isChatConnected
            ? "메시지를 입력하세요..."
            : "채팅 서버 연결 후 입력할 수 있습니다."
        : "로그인 후 채팅에 참여할 수 있습니다.";
  const latestChatMessage = chatMessages[chatMessages.length - 1] ?? null;
  const resolvedReviews = useMemo(() => {
    if (reviewsProp) {
      return reviewsProp.map((review) =>
        normalizeReview(review, currentUserId),
      );
    }

    if (Array.isArray(festival.reviews)) {
      return festival.reviews.map((review) =>
        normalizeReview(review, currentUserId),
      );
    }

    return [];
  }, [currentUserId, festival.reviews, reviewsProp]);

  // 추가: URL/검색 state에서 확인한 festivalId로 축제 상세 정보를 조회합니다.
  useEffect(() => {
    let isMounted = true;

    if (!requestedFestivalId) {
      setApiFestival(null);
      setDetailError("");
      return undefined;
    }

    const fetchFestivalDetail = async () => {
      try {
        const response = await AxiosApi.getFestivalDetail(requestedFestivalId);
        const detail = getResponseData(response);

        if (isMounted) {
          setApiFestival(detail);
          setDetailError("");
        }
      } catch (error) {
        if (isMounted) {
          console.error("FestaDetail detail load error:", error);
          setApiFestival(null);
          setDetailError(
            "축제 상세 정보를 불러오지 못해 기본 정보를 표시합니다.",
          );
        }
      }
    };

    fetchFestivalDetail();

    return () => {
      isMounted = false;
    };
  }, [requestedFestivalId]);

  // 추가: 축제 리뷰 목록을 조회하고, 응답이 비어 있으면 빈 리뷰 상태를 그대로 테스트할 수 있게 둡니다.
  useEffect(() => {
    let isMounted = true;

    if (!requestedFestivalId) {
      setLocalReviews(resolvedReviews);
      setVisibleReviewCount(REVIEW_PAGE_SIZE);
      return undefined;
    }

    const fetchReviews = async () => {
      try {
        const response = await AxiosApi.getReviewList(requestedFestivalId, {
          page: 0,
          size: 20,
        });
        const reviewPage = getResponseData(response);
        const reviews = getPageContent(reviewPage).map((review) =>
          normalizeReview(review, currentUserId),
        );

        if (isMounted) {
          setLocalReviews(reviews);
          setReviewError("");
          setVisibleReviewCount(REVIEW_PAGE_SIZE);
        }
      } catch (error) {
        if (isMounted) {
          console.error("FestaDetail review load error:", error);
          setLocalReviews([]);
          setReviewError("리뷰를 불러오지 못했습니다.");
          setVisibleReviewCount(REVIEW_PAGE_SIZE);
        }
      }
    };

    fetchReviews();

    return () => {
      isMounted = false;
    };
  }, [currentUserId, requestedFestivalId, resolvedReviews]);

  useEffect(() => {
    setIsFavorite(Boolean(festival.favorite));
    setIsLiked(Boolean(festival.liked));
  }, [festival.favorite, festival.liked]);

  useEffect(() => {
    let isCancelled = false;

    if (!canRenderKakaoMap) {
      kakaoMapRef.current = null;
      setMapMessage(
        resolvedHasMap
          ? "지도 좌표 정보가 없어 위치를 표시할 수 없습니다."
          : "",
      );
      return undefined;
    }

    setMapMessage("지도를 불러오는 중입니다.");

    loadKakaoMapSdk()
      .then((kakao) => {
        if (isCancelled || !mapContainerRef.current) {
          return;
        }

        const center = new kakao.maps.LatLng(
          mapCoordinates.latitude,
          mapCoordinates.longitude,
        );
        const level = Number(festival.mapLevel) || 4;
        const map = new kakao.maps.Map(mapContainerRef.current, {
          center,
          level,
        });

        new kakao.maps.Marker({
          map,
          position: center,
          title: festival.title,
        });

        kakaoMapRef.current = map;
        setMapMessage("");
      })
      .catch((error) => {
        if (isCancelled) {
          return;
        }

        console.error("FestaDetail Kakao map load error:", error);
        kakaoMapRef.current = null;
        setMapMessage(
          "지도를 불러오지 못했습니다. 카카오맵 설정을 확인해주세요.",
        );
      });

    return () => {
      isCancelled = true;
    };
  }, [
    canRenderKakaoMap,
    festival.mapLevel,
    festival.title,
    mapCoordinates,
    resolvedHasMap,
  ]);

  useEffect(() => {
    let isMounted = true;

    if (!canOpenChat) {
      setChatMessages([]);
      setChatStatusMessage(chatRoomId ? "" : "채팅방 정보를 찾을 수 없습니다.");
      return undefined;
    }

    const fetchChatHistory = async () => {
      setChatStatusMessage("이전 채팅을 불러오는 중입니다.");

      try {
        const response = await AxiosApi.getChatHistory(
          chatRoomId,
          CHAT_HISTORY_SIZE,
        );
        const history = getPageContent(getResponseData(response))
          .slice()
          .reverse()
          .map((chat) => normalizeChatMessage(chat, currentUserId));

        if (isMounted) {
          setChatMessages(history);
          setChatStatusMessage(
            isLoggedIn ? "" : "로그인하면 채팅에 참여할 수 있습니다.",
          );
        }
      } catch (error) {
        if (isMounted) {
          console.error("FestaDetail chat history load error:", error);
          setChatMessages([]);
          setChatStatusMessage("채팅 내역을 불러오지 못했습니다.");
        }
      }
    };

    fetchChatHistory();

    return () => {
      isMounted = false;
    };
  }, [canOpenChat, chatRoomId, currentUserId, isLoggedIn]);

  useEffect(() => {
    chatSocketRef.current?.close();
    chatSocketRef.current = null;
    setIsChatConnecting(false);
    setIsChatConnected(false);

    if (!canConnectChat) {
      return undefined;
    }

    setIsChatConnecting(true);
    setChatStatusMessage("채팅 서버에 연결하는 중입니다.");

    const chatSocket = ChatSocketApi.connect({
      chatRoomId,
      onOpen: () => {
        setIsChatConnecting(false);
        setIsChatConnected(true);
        setChatStatusMessage("");
      },
      onMessage: (message) => {
        setChatMessages((currentMessages) => {
          const normalizedMessage = normalizeChatMessage(
            message,
            currentUserId,
          );
          const exists = currentMessages.some(
            (chat) => String(chat.id) === String(normalizedMessage.id),
          );

          if (exists) {
            return currentMessages;
          }

          return [...currentMessages, normalizedMessage];
        });
      },
      onAuthFailure: () => {
        setIsChatConnecting(false);
        setIsChatConnected(false);
        setChatStatusMessage("로그인 세션이 만료되어 채팅 연결이 끊겼습니다.");
      },
      onError: () => {
        setIsChatConnecting(false);
        setIsChatConnected(false);
        setChatStatusMessage(
          "채팅 서버 연결에 실패했습니다. 잠시 후 다시 시도해 주세요.",
        );
      },
      onClose: (event, closeInfo = {}) => {
        if (chatSocketRef.current === chatSocket) {
          chatSocketRef.current = null;
        }

        setIsChatConnecting(false);
        setIsChatConnected(false);

        if (closeInfo.closedByClient || closeInfo.authFailed) {
          return;
        }

        setChatStatusMessage(
          closeInfo.wasOpened
            ? "채팅 서버 연결이 끊겼습니다. 새로고침 후 다시 시도해 주세요."
            : "채팅 서버 연결에 실패했습니다. 잠시 후 다시 시도해 주세요.",
        );
      },
    });

    chatSocketRef.current = chatSocket;

    return () => {
      chatSocket.close();
      if (chatSocketRef.current === chatSocket) {
        chatSocketRef.current = null;
      }
    };
  }, [canConnectChat, chatRoomId, currentUserId]);

  useEffect(() => {
    let isMounted = true;

    if (isAuthLoading) {
      return undefined;
    }

    if (!chatRoomId) {
      setAiSummary(
        "채팅방 정보를 찾을 수 없어 현장 요약을 불러올 수 없습니다.",
      );
      return undefined;
    }

    if (!isLoggedIn) {
      setAiSummary("로그인하면 AI 현장 요약을 확인할 수 있습니다.");
      return undefined;
    }

    const fetchAiSummary = async () => {
      setAiSummary("최신 AI 현장 요약을 불러오는 중입니다.");

      try {
        const response = await AxiosApi.getAiFieldSummary(chatRoomId);
        const summary = getResponseData(response)?.message;

        if (isMounted) {
          setAiSummary(summary || "요약할 현장톡 메시지가 없습니다.");
        }
      } catch (error) {
        if (isMounted) {
          console.error("FestaDetail AI field summary load error:", error);
          setAiSummary(
            error.response?.data?.message ||
              "AI 현장 요약을 불러오지 못했습니다.",
          );
        }
      }
    };

    fetchAiSummary();

    return () => {
      isMounted = false;
    };
  }, [chatRoomId, isAuthLoading, isLoggedIn]);

  // 추가: 로그인 상태에서만 현재 사용자의 찜/좋아요 여부를 백엔드와 동기화합니다.
  useEffect(() => {
    let isMounted = true;

    if (!requestedFestivalId || !isLoggedIn) {
      return undefined;
    }

    const fetchMemberActions = async () => {
      try {
        const [favoriteResponse, likeResponse] = await Promise.all([
          AxiosApi.isFavorite(requestedFestivalId),
          AxiosApi.isLiked(requestedFestivalId),
        ]);

        if (isMounted) {
          setIsFavorite(Boolean(getResponseData(favoriteResponse)));
          setIsLiked(Boolean(getResponseData(likeResponse)));
        }
      } catch (error) {
        console.error("FestaDetail member action load error:", error);
      }
    };

    fetchMemberActions();

    return () => {
      isMounted = false;
    };
  }, [isLoggedIn, requestedFestivalId]);

  const myReview = useMemo(
    () => localReviews.find((review) => review.isMine),
    [localReviews],
  );
  const hasReviews = localReviews.length > 0;
  const reviewSummary = useMemo(
    () => ({
      rating: getAverageRating(localReviews),
      count: localReviews.length,
    }),
    [localReviews],
  );
  const visibleReviews = useMemo(
    () => localReviews.slice(0, visibleReviewCount),
    [localReviews, visibleReviewCount],
  );
  const hasMoreReviews = visibleReviewCount < localReviews.length;

  const handleTalkSubmit = (event) => {
    event.preventDefault();

    if (!canSendChat || !talkMessage.trim()) {
      return;
    }

    const sent = chatSocketRef.current?.sendMessage({
      message: talkMessage.trim(),
      messageType: "CHAT",
    });

    if (!sent) {
      setChatStatusMessage("채팅 서버에 연결된 뒤 다시 전송해 주세요.");
      return;
    }

    setTalkMessage("");
  };

  const handleModalChatSend = (message) => {
    if (!canSendChat || !message.trim()) {
      return false;
    }

    const sent = chatSocketRef.current?.sendMessage({
      message: message.trim(),
      messageType: "CHAT",
    });

    if (!sent) {
      setChatStatusMessage("채팅 서버에 연결된 뒤 다시 전송해 주세요.");
      return false;
    }

    return true;
  };

  const handleChatPhotoUpload = async (file, caption = "") => {
    if (!canSendChat || !file) {
      return false;
    }

    setIsChatUploading(true);
    setChatStatusMessage("이미지를 업로드하는 중입니다.");

    try {
      const response = await AxiosApi.uploadImage(file);
      const imageUrl = getResponseData(response);

      if (!imageUrl) {
        setChatStatusMessage("업로드된 이미지 URL을 확인할 수 없습니다.");
        return false;
      }

      const sent = chatSocketRef.current?.sendMessage({
        message: caption.trim(),
        imageUrl,
        messageType: "IMAGE",
      });

      if (sent) {
        setChatStatusMessage("");
        return true;
      }

      setChatStatusMessage(
        "이미지는 업로드됐지만 채팅 서버 전송에 실패했습니다.",
      );
      return false;
    } catch (error) {
      console.error("FestaDetail chat image upload error:", error);
      setChatStatusMessage(
        error.response?.data?.message || "이미지 업로드에 실패했습니다.",
      );
      return false;
    } finally {
      setIsChatUploading(false);
    }
  };

  const openTalkModal = () => {
    setIsTalkModalOpen(true);
  };

  const closeTalkModal = () => {
    setIsTalkModalOpen(false);
  };

  const openCreateReviewModal = () => {
    if (!isLoggedIn) {
      window.alert("로그인 후 리뷰를 작성할 수 있습니다.");
      return;
    }

    setEditingReview(null);
    setIsReviewModalOpen(true);
  };

  const openEditReviewModal = (review) => {
    setEditingReview(review);
    setIsReviewModalOpen(true);
  };

  const closeReviewModal = () => {
    setIsReviewModalOpen(false);
    setEditingReview(null);
  };

  const openDeleteConfirm = (review) => {
    setDeletingReview(review || myReview || null);
    setIsDeleteConfirmOpen(true);
  };

  const closeDeleteConfirm = () => {
    setIsDeleteConfirmOpen(false);
    setDeletingReview(null);
  };

  // 추가: 리뷰 ID가 있으면 백엔드 삭제 API를 호출하고, ID가 없으면 로컬 상태만 정리합니다.
  const confirmDeleteMyReview = async () => {
    const targetReview = deletingReview || myReview;
    const targetReviewId = targetReview?.reviewId;

    try {
      if (targetReviewId && targetReviewId !== "mine") {
        await AxiosApi.deleteReview(targetReviewId);
      }

      setLocalReviews((currentReviews) =>
        currentReviews.filter((review) => review.id !== targetReview?.id),
      );
      setActionMessage("");
      closeDeleteConfirm();
    } catch (error) {
      console.error("FestaDetail review delete error:", error);
      setActionMessage("리뷰 삭제 중 오류가 발생했습니다.");
    }
  };

  const handleLoadMoreReviews = () => {
    setVisibleReviewCount((currentCount) =>
      Math.min(currentCount + REVIEW_PAGE_SIZE, localReviews.length),
    );
  };

  const handleMapZoomIn = () => {
    const map = kakaoMapRef.current;

    if (map) {
      map.setLevel(Math.max(1, map.getLevel() - 1));
    }
  };

  const handleMapZoomOut = () => {
    const map = kakaoMapRef.current;

    if (map) {
      map.setLevel(Math.min(14, map.getLevel() + 1));
    }
  };

  const openKakaoDirections = () => {
    if (!mapCoordinates) {
      return;
    }

    const destination = encodeURIComponent(festival.venue || festival.title);
    const url = `https://map.kakao.com/link/to/${destination},${mapCoordinates.latitude},${mapCoordinates.longitude}`;
    window.open(url, "_blank", "noopener,noreferrer");
  };

  // 추가: ReviewModal에서 저장된 리뷰를 받아 백엔드/로컬 필드명을 화면용으로 정규화합니다.
  const handleSubmitReview = (reviewValue) => {
    const normalizedReview = normalizeReview(reviewValue, currentUserId);
    const savedReview = {
      ...normalizedReview,
      id: normalizedReview.id || "mine",
      author: normalizedReview.author || "김페스",
      time: normalizedReview.id
        ? normalizedReview.time || "방금 전"
        : "방금 전",
      rating: normalizedReview.rating,
      text: normalizedReview.text,
      isMine: true,
    };

    setLocalReviews((currentReviews) => {
      const hasMyReview = currentReviews.some((review) => review.isMine);

      if (hasMyReview) {
        return currentReviews.map((review) =>
          review.isMine ? { ...review, ...savedReview } : review,
        );
      }

      return [savedReview, ...currentReviews];
    });
    closeReviewModal();
  };

  // 추가: 찜 버튼 클릭 시 로그인/API/Null ID 상황을 모두 방어하며 상태를 토글합니다.
  const toggleFavorite = async () => {
    if (!requestedFestivalId) {
      setIsFavorite((value) => !value);
      return;
    }

    if (!isLoggedIn) {
      window.alert("로그인 후 찜할 수 있습니다.");
      return;
    }

    const nextFavorite = !isFavorite;
    setIsFavorite(nextFavorite);
    setActionMessage("");

    try {
      if (nextFavorite) {
        await AxiosApi.createFavorite(requestedFestivalId);
      } else {
        await AxiosApi.deleteFavorite(requestedFestivalId);
      }
    } catch (error) {
      console.error("FestaDetail favorite toggle error:", error);
      setIsFavorite(!nextFavorite);
      setActionMessage("찜 상태 변경 중 오류가 발생했습니다.");
    }
  };

  // 추가: 좋아요 버튼 클릭 시 로그인/API/Null ID 상황을 모두 방어하며 상태를 토글합니다.
  const toggleLike = async () => {
    if (!requestedFestivalId) {
      setIsLiked((value) => !value);
      return;
    }

    if (!isLoggedIn) {
      window.alert("로그인 후 좋아요를 누를 수 있습니다.");
      return;
    }

    const nextLiked = !isLiked;
    setIsLiked(nextLiked);
    setActionMessage("");

    try {
      if (nextLiked) {
        await AxiosApi.createLike(requestedFestivalId);
      } else {
        await AxiosApi.deleteLike(requestedFestivalId);
      }
    } catch (error) {
      console.error("FestaDetail like toggle error:", error);
      setIsLiked(!nextLiked);
      setActionMessage("좋아요 상태 변경 중 오류가 발생했습니다.");
    }
  };

  return (
    <Page>
      <Hero>
        {festival.image && <HeroImage alt="" src={festival.image} />}
        <HeroOverlay />
        <HeroContent>
          <TagRow>
            <Badge>{festival.category}</Badge>
            {resolvedIsFestivalActive && (
              <Badge $variant="live">
                <LiveDot />
                LIVE
              </Badge>
            )}
          </TagRow>

          <Title>{festival.title}</Title>

          <HeroActions>
            <ActionButton
              $active={isFavorite}
              aria-pressed={isFavorite}
              onClick={toggleFavorite}
              type="button"
            >
              <Heart fill={isFavorite ? "currentColor" : "none"} size={18} />
              {isFavorite ? "찜" : "찜"}
            </ActionButton>
            <ActionButton
              $active={isLiked}
              aria-pressed={isLiked}
              onClick={toggleLike}
              type="button"
            >
              <ThumbsUp fill={isLiked ? "currentColor" : "none"} size={18} />
              {isLiked ? "좋아요" : "좋아요"}
            </ActionButton>
          </HeroActions>

          {canShowAiSummary && (
            <AiMarquee>
              <AiMarqueeContent>AI Live 요약: {aiSummary}</AiMarqueeContent>
            </AiMarquee>
          )}
          {/* 추가: API 실패/로그인 필요 안내를 기존 디자인을 해치지 않는 작은 문구로 표시합니다. */}
          {(detailError || actionMessage) && (
            <MetaText role="status">{actionMessage || detailError}</MetaText>
          )}
        </HeroContent>
      </Hero>

      <BodyGrid>
        <MainColumn>
          <Section>
            <SectionTitle $tone="primary">축제 상세 정보</SectionTitle>
            <InfoGrid>
              <div>
                <InfoLabel>Date & Time</InfoLabel>
                <InfoValue>{festival.period}</InfoValue>
                <MetaText>
                  {resolvedIsFestivalActive
                    ? `진행 중 (${festival.time})`
                    : festival.time}
                </MetaText>
              </div>
              <div>
                <InfoLabel>Location</InfoLabel>
                <InfoValue>{festival.location}</InfoValue>
                <MetaText>{festival.venue}</MetaText>
              </div>
            </InfoGrid>
            {festival.description.length > 0 && (
              <DetailText style={{ marginTop: "18px" }}>
                {festival.description.map((paragraph, index) => (
                  <p key={`${paragraph}-${index}`}>{paragraph}</p>
                ))}
              </DetailText>
            )}
          </Section>

          <Section>
            <SectionTitle $tone="secondary">찾아오시는 길</SectionTitle>
            <MapCanvas $disabled={!canRenderKakaoMap}>
              {canRenderKakaoMap ? (
                <>
                  <MapViewport ref={mapContainerRef} />
                  {mapMessage && (
                    <MapPinBadge>
                      <MapPin size={42} />
                      <span>{mapMessage}</span>
                    </MapPinBadge>
                  )}
                  <MapControls>
                    <SmallIconButton
                      aria-label="지도 확대"
                      onClick={handleMapZoomIn}
                      type="button"
                    >
                      +
                    </SmallIconButton>
                    <SmallIconButton
                      aria-label="지도 축소"
                      onClick={handleMapZoomOut}
                      type="button"
                    >
                      -
                    </SmallIconButton>
                  </MapControls>
                  <MapDirectionButton
                    $compact
                    onClick={openKakaoDirections}
                    type="button"
                  >
                    <Navigation size={18} />
                    길찾기
                  </MapDirectionButton>
                </>
              ) : (
                <DisabledOverlay>
                  <MapPin size={48} />
                  <strong>지도 정보를 표시할 수 없습니다</strong>
                  <span>
                    {mapMessage || "축제 위치 좌표가 준비되지 않았습니다."}
                  </span>
                </DisabledOverlay>
              )}
            </MapCanvas>
          </Section>

          <Section>
            <ReviewHeader>
              <div>
                <SectionTitle $tone="tertiary">리뷰</SectionTitle>
                {/* 추가: 리뷰 API 실패 시에도 화면은 유지하고 안내 문구만 표시합니다. */}
                {reviewError && (
                  <MetaText role="status">{reviewError}</MetaText>
                )}
                <RatingLine>
                  <strong>
                    {hasReviews ? reviewSummary.rating.toFixed(1) : "0.0"}
                  </strong>
                  <span>
                    {renderStars(reviewSummary.rating, 17, "review-summary")}
                  </span>
                  <em>
                    (
                    {hasReviews
                      ? reviewSummary.count.toLocaleString("ko-KR")
                      : 0}{" "}
                    reviews)
                  </em>
                </RatingLine>
              </div>
              {!myReview && (
                <TextButton onClick={openCreateReviewModal} type="button">
                  리뷰 작성하기
                </TextButton>
              )}
            </ReviewHeader>

            {hasReviews ? (
              <ReviewList>
                {visibleReviews.map((review) => (
                  <ReviewCard $isMine={review.isMine} key={review.id}>
                    {review.isMine && <Badge $variant="mine">My Review</Badge>}
                    <ReviewActions>
                      <div>
                        <strong>{review.author}</strong>
                        <RatingLine $small>
                          <span>
                            {renderStars(
                              review.rating,
                              14,
                              `review-${review.id}`,
                            )}
                          </span>
                        </RatingLine>
                      </div>
                      <span>{review.time}</span>
                    </ReviewActions>
                    <p>{review.text || "작성된 리뷰 내용이 없습니다."}</p>
                    {review.isMine && (
                      <ReviewActions $right>
                        <TextButton
                          onClick={() => openEditReviewModal(review)}
                          type="button"
                        >
                          수정
                        </TextButton>
                        <TextButton
                          $danger
                          onClick={() => openDeleteConfirm(review)}
                          type="button"
                        >
                          삭제
                        </TextButton>
                      </ReviewActions>
                    )}
                  </ReviewCard>
                ))}
                {hasMoreReviews && (
                  <TextButton onClick={handleLoadMoreReviews} type="button">
                    리뷰 더보기
                  </TextButton>
                )}
              </ReviewList>
            ) : (
              <EmptyState>
                <EmptyIcon>
                  <MessageCircle size={30} />
                </EmptyIcon>
                <strong>아직 작성된 리뷰가 없습니다</strong>
                <span>첫 번째로 축제 현장의 생생한 감동을 공유해보세요!</span>
              </EmptyState>
            )}
          </Section>
        </MainColumn>
      </BodyGrid>

      {resolvedIsFestivalActive && (
        <FloatingTalk $expanded={isTalkExpanded}>
          <FloatingTalkHeader>
            <span>
              <LiveDot />
              LIVE TALK
            </span>
            <TalkControlGroup>
              <SmallIconButton
                aria-label={
                  isTalkExpanded ? "실시간 톡 최소화" : "실시간 톡 열기"
                }
                onClick={() => setIsTalkExpanded((value) => !value)}
                type="button"
              >
                {isTalkExpanded ? (
                  <ChevronDown size={17} />
                ) : (
                  <ChevronUp size={17} />
                )}
              </SmallIconButton>
              <SmallIconButton
                aria-label="실시간 톡 최대화"
                onClick={openTalkModal}
                type="button"
              >
                <Maximize2 size={16} />
              </SmallIconButton>
            </TalkControlGroup>
          </FloatingTalkHeader>

          {isTalkExpanded ? (
            <>
              <FloatingTalkBody>
                {chatMessages.length > 0 ? (
                  chatMessages.slice(-5).map((chat) => (
                    <FloatingTalkMessage $mine={chat.isMine} key={chat.id}>
                      {!chat.isMine && <strong>{chat.author}</strong>}
                      <span>
                        {chat.text || (chat.image ? "사진을 보냈습니다." : "")}
                      </span>
                    </FloatingTalkMessage>
                  ))
                ) : (
                  <FloatingTalkMessage>
                    <span>
                      {chatStatusMessage || "아직 실시간 톡 메시지가 없습니다."}
                    </span>
                  </FloatingTalkMessage>
                )}
              </FloatingTalkBody>
              <TalkComposer onSubmit={handleTalkSubmit}>
                <FloatingTalkInput
                  disabled={!canSendChat || isChatUploading}
                  onChange={(event) => setTalkMessage(event.target.value)}
                  placeholder={chatInputPlaceholder}
                  value={talkMessage}
                />
                <SmallIconButton
                  aria-label="메시지 보내기"
                  disabled={!canSendChat || isChatUploading}
                  type="submit"
                >
                  <Send size={17} />
                </SmallIconButton>
              </TalkComposer>
            </>
          ) : (
            <FloatingTalkPreview
              onClick={() => setIsTalkExpanded(true)}
              type="button"
            >
              <TalkMiniLine>
                {latestChatMessage ? (
                  <>
                    <strong>{latestChatMessage.author}</strong>
                    {latestChatMessage.text ||
                      (latestChatMessage.image ? "사진을 보냈습니다." : "")}
                  </>
                ) : (
                  chatStatusMessage || "아직 실시간 톡 메시지가 없습니다."
                )}
              </TalkMiniLine>
            </FloatingTalkPreview>
          )}
        </FloatingTalk>
      )}

      <RealTimeTalkModal
        aiSummary={aiSummary}
        canSend={canSendChat}
        isUploading={isChatUploading}
        isOpen={isTalkModalOpen}
        messages={chatMessages}
        onClose={closeTalkModal}
        onSend={handleModalChatSend}
        onUploadPhoto={handleChatPhotoUpload}
        placeholder={chatInputPlaceholder}
        statusMessage={chatStatusMessage}
      />
      <ReviewModal
        festival={festival}
        isOpen={isReviewModalOpen}
        onClose={closeReviewModal}
        onSubmit={handleSubmitReview}
        review={editingReview}
      />
      {isDeleteConfirmOpen && (
        <ConfirmBackdrop onClick={closeDeleteConfirm}>
          <ConfirmDialog
            aria-label="리뷰 삭제 확인"
            aria-modal="true"
            onClick={(event) => event.stopPropagation()}
            role="dialog"
          >
            <strong>리뷰를 삭제할까요?</strong>
            <p>삭제한 관람평은 다시 복구할 수 없습니다.</p>
            <ConfirmActions>
              <ConfirmButton onClick={closeDeleteConfirm} type="button">
                취소
              </ConfirmButton>
              <ConfirmButton
                $danger
                onClick={confirmDeleteMyReview}
                type="button"
              >
                삭제
              </ConfirmButton>
            </ConfirmActions>
          </ConfirmDialog>
        </ConfirmBackdrop>
      )}
    </Page>
  );
}

export default FestaDetail;
