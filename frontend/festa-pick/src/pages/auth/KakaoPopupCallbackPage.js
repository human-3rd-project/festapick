import { useEffect } from "react";
import AxiosApi from "../../api/AxiosApi";

const KAKAO_MESSAGE_SOURCE = "festapick-kakao";
const KAKAO_STORAGE_KEY = "festapick:kakao-auth-result";
const processedKakaoCodes = new Set();

const moveOpener = (path) => {
  if (!window.opener || window.opener.closed) {
    return;
  }

  window.opener.location.href = `${window.location.origin}${path}`;
};

const deliverToParent = (type, payload = {}) => {
  const message = {
    source: KAKAO_MESSAGE_SOURCE,
    type,
    payload,
    createdAt: Date.now(),
  };

  localStorage.setItem(KAKAO_STORAGE_KEY, JSON.stringify(message));

  if (!window.opener || window.opener.closed) {
    return;
  }

  window.opener.postMessage(message, window.location.origin);
};

function KakaoPopupCallbackPage() {
  useEffect(() => {
    const closePopup = () => {
      window.setTimeout(() => window.close(), 100);
    };

    const handleKakaoCallback = async () => {
      const params = new URLSearchParams(window.location.search);
      const code = params.get("code");
      const error = params.get("error");
      const errorDescription = params.get("error_description");

      if (error) {
        deliverToParent("KAKAO_AUTH_ERROR", {
          message: errorDescription || "카카오 로그인이 취소되었습니다.",
        });
        closePopup();
        return;
      }

      if (!code) {
        deliverToParent("KAKAO_AUTH_ERROR", {
          message: "카카오 인가 코드가 없습니다.",
        });
        closePopup();
        return;
      }

      if (processedKakaoCodes.has(code)) {
        return;
      }

      processedKakaoCodes.add(code);

      try {
        const response = await AxiosApi.kakaoLogin(code);
        const kakaoData = response.data?.data || response.data;

        if (kakaoData?.signupRequired) {
          deliverToParent("KAKAO_SIGNUP_REQUIRED", kakaoData);
          moveOpener("/social-login");
          closePopup();
          return;
        }

        if (!kakaoData?.accessToken) {
          throw new Error("카카오 로그인 토큰이 응답에 포함되지 않았습니다.");
        }

        deliverToParent("KAKAO_LOGIN_SUCCESS", kakaoData);
        localStorage.setItem("accessToken", kakaoData.accessToken);

        if (kakaoData.refreshToken) {
          localStorage.setItem("refreshToken", kakaoData.refreshToken);
        }

        moveOpener("/");
      } catch (callbackError) {
        deliverToParent("KAKAO_AUTH_ERROR", {
          message:
            callbackError?.response?.data?.message ||
            callbackError.message ||
            "카카오 로그인 처리에 실패했습니다.",
        });
      } finally {
        closePopup();
      }
    };

    handleKakaoCallback();
  }, []);

  return <div>카카오 로그인 처리 중...</div>;
}

export default KakaoPopupCallbackPage;
