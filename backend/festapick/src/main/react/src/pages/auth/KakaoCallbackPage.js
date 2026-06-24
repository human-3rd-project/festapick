import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function KakaoCallbackPage() {
  const navigate = useNavigate();
  const alreadyRun = useRef(false);

  useEffect(() => {
    if (alreadyRun.current) return;
    alreadyRun.current = true;

    const kakaoLogin = async () => {
      const params = new URLSearchParams(window.location.search);
      const code = params.get("code");

      if (!code) {
        alert("카카오 인가 코드가 없습니다.");
        navigate("/login");
        return;
      }

      try {
        const response = await axios.post(
          "http://localhost:8080/api/auth/kakao/callback",
          {
            code: code,
          },
        );

        const data = response.data;

        // 신규 소셜 회원
        if (data.signupRequired) {
          // 추가 정보 입력 페이지로 이동 (예: /social-signup)
        }

        // 기존 회원
        localStorage.setItem("accessToken", data.accessToken);
        localStorage.setItem("refreshToken", data.refreshToken);

        navigate("/");
      } catch (error) {
        console.error(error);
        alert("카카오 로그인 처리에 실패했습니다.");
        navigate("/login");
      }
    };

    kakaoLogin();
  }, [navigate]);

  return <div>로그인 처리 중...</div>;
}

export default KakaoCallbackPage;
