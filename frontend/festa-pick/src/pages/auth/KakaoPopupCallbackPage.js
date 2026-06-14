import { useEffect } from "react";

function KakaoPopupCallbackPage() {
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);

    const code = params.get("code");
    const error = params.get("error");
    const errorDescription = params.get("error_description");

    if (error) {
      alert(errorDescription || "카카오 로그인이 취소되었습니다.");
      window.close();
      return;
    }

    if (!code) {
      alert("카카오 인가 코드가 없습니다.");
      window.close();
      return;
    }

    if (window.opener) {
      window.opener.location.href = `http://localhost:3000/oauth/kakao/callback?code=${encodeURIComponent(code)}`;
    }

    window.close();
  }, []);

  return <div>카카오 로그인 처리 중...</div>;
}

export default KakaoPopupCallbackPage;
