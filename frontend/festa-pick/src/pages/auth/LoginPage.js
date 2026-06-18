import React, { useState } from "react";
import { Lock, User } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import AxiosApi from "../../api/AxiosApi";
import Common from "../../utils/Common";
import Styles from "./LoginPageCss";

const KAKAO_AUTH_URL = "https://kauth.kakao.com/oauth/authorize";

/*
 * 로그인 페이지 흐름
 * 1. 사용자가 아이디와 비밀번호를 입력합니다.
 * 2. 제출 전에 빈 값 여부를 먼저 검사해서 불필요한 API 호출을 막습니다.
 * 3. 백엔드 LoginRequestDto 필드명에 맞춰 { loginId, password }로 /auth/login을 호출합니다.
 * 4. 성공하면 accessToken, refreshToken을 저장하고 성공 메시지를 보여준 뒤 메인 화면으로 이동합니다.
 * 5. 실패하면 백엔드 ApiResponse.message 또는 화면 기본 문구를 상태 메시지 영역에 표시합니다.
 */
const LoginPage = () => {
  const navigate = useNavigate();

  // 로그인 폼의 실제 입력값입니다.
  // input의 value와 연결된 controlled component 방식이라,
  // 사용자가 입력할 때마다 handleInputChange에서 이 state가 갱신됩니다.
  const [formValues, setFormValues] = useState({
    userId: "",
    password: "",
  });

  // 상태 메시지 영역에 보여줄 정보를 한 곳에서 관리합니다.
  // visible: 메시지를 화면에 보여줄지 여부
  // type: "success" 또는 "error"처럼 CSS 색상/역할을 나누는 값
  // text: 실제 사용자에게 보여줄 문구
  const [status, setStatus] = useState({ visible: false, type: "", text: "" });

  // 로그인 API 요청이 진행 중인지 나타냅니다.
  // true일 때는 버튼을 비활성화하고, 같은 요청이 여러 번 전송되는 것을 막습니다.
  const [isSubmitting, setIsSubmitting] = useState(false);

  const setStatusMessage = (type, text) => {
    // text가 빈 문자열이면 Boolean(text)는 false입니다.
    // 즉 보여줄 문구가 있을 때만 visible을 true로 만들어 메시지 영역을 노출합니다.
    setStatus({ visible: Boolean(text), type, text });
  };

  // 서버 메시지가 없거나 인코딩이 깨진 경우 로그인 화면의 안정적인 기본 문구를 사용합니다.
  const getApiMessage = (error, fallbackMessage) => {
    const serverMessage = error?.response?.data?.message;

    return serverMessage &&
      !serverMessage.includes("�") &&
      !serverMessage.includes("?")
      ? serverMessage
      : fallbackMessage;
  };

  const handleInputChange = (fieldName, e) => {
    const value = e.currentTarget.value;

    // fieldName에는 "userId" 또는 "password"가 들어옵니다.
    // [fieldName] 문법을 쓰면 두 input에 같은 함수 하나를 재사용할 수 있습니다.
    // 예: fieldName이 "userId"면 { userId: value }를 갱신합니다.
    setFormValues((prevValues) => ({
      ...prevValues,
      [fieldName]: value,
    }));

    // 사용자가 다시 입력하는 동안에는 이전 실패/성공 메시지를 지워 현재 입력 흐름만 보이게 합니다.
    if (status.visible) {
      setStatusMessage("", "");
    }
  };

  const validateLoginForm = () => {
    // 아이디는 앞뒤 공백을 제거해서 "  abc  "를 "abc"로 처리합니다.
    // 비밀번호는 공백도 실제 비밀번호 문자가 될 수 있으므로 trim하지 않습니다.
    const loginId = formValues.userId.trim();
    const password = formValues.password;

    // return을 만나면 함수는 즉시 종료됩니다.
    // 따라서 아이디가 비어 있으면 아래의 isValid: true까지 내려가지 않습니다.
    if (!loginId) {
      return {
        isValid: false,
        message: "아이디를 입력해 주세요.",
      };
    }

    // 아이디가 통과된 뒤 비밀번호가 비어 있는지 검사합니다.
    // 여기서도 return되면 함수가 끝나므로 로그인 API는 호출되지 않습니다.
    if (!password) {
      return {
        isValid: false,
        message: "비밀번호를 입력해 주세요.",
      };
    }

    // 위의 실패 조건 두 개를 모두 통과한 경우에만 여기까지 도착합니다.
    // values에는 백엔드 로그인 API에 보낼 최종 값을 담아 handleSubmit에서 재사용합니다.
    return {
      isValid: true,
      values: { loginId, password },
    };
  };

  const handleSubmit = async (e) => {
    // form submit의 기본 동작은 페이지 새로고침입니다.
    // React에서 직접 검증과 API 호출을 처리해야 하므로 기본 동작을 막습니다.
    e.preventDefault();

    // 이미 로그인 요청 중이면 새 요청을 만들지 않습니다.
    // 더블 클릭이나 Enter 연타로 같은 로그인 요청이 중복 전송되는 것을 막는 안전장치입니다.
    if (isSubmitting) {
      return;
    }

    // API를 호출하기 전에 화면에서 먼저 빈 값 검증을 합니다.
    // validateLoginForm은 성공/실패 결과를 객체로 반환합니다.
    const validation = validateLoginForm();

    // 검증 실패 시 사용자에게 이유를 보여주고 여기서 함수가 끝납니다.
    // 이 return 때문에 아래 AxiosApi.login은 실행되지 않습니다.
    if (!validation.isValid) {
      setStatusMessage("error", validation.message);
      return;
    }

    // 여기부터는 검증을 통과한 상태입니다.
    // 버튼 문구를 "로그인 중"으로 바꾸고, 상태 메시지도 진행 중으로 표시합니다.
    setIsSubmitting(true);
    setStatusMessage("success", "로그인 정보를 확인하고 있습니다.");

    try {
      // AxiosApi.login은 내부에서 POST /auth/login을 호출합니다.
      // 백엔드 LoginRequestDto가 loginId, password 필드를 받으므로 이 두 값을 넘깁니다.
      const response = await AxiosApi.login(
        validation.values.loginId,
        validation.values.password,
      );

      // 백엔드 표준 응답은 { success, message, data } 구조입니다.
      // data 안에 LoginResponseDto가 들어오지만, 혹시 data 래핑이 없는 경우도 대비합니다.
      const loginData = response.data?.data || response.data;

      // AuthService.login 응답의 토큰을 기존 Common 유틸 저장 방식에 맞춰 보관합니다.
      if (loginData?.accessToken) {
        Common.setAccessToken(loginData.accessToken);
      }

      if (loginData?.refreshToken) {
        Common.setRefreshToken(loginData.refreshToken);
      }

      // 로그인 성공 응답인데 accessToken이 없다면 이후 인증 요청을 할 수 없습니다.
      // 이 경우 정상 로그인으로 볼 수 없으므로 catch로 보내 실패 메시지를 보여줍니다.
      if (!loginData?.accessToken) {
        throw new Error("로그인 토큰이 응답에 포함되지 않았습니다.");
      }

      setStatusMessage(
        "success",
        "로그인에 성공했습니다. 메인 페이지로 이동합니다.",
      );

      // 성공 메시지를 아주 짧게 보여준 뒤 메인 페이지로 이동합니다.
      // replace: true를 사용해서 브라우저 뒤로가기로 로그인 페이지에 다시 돌아오지 않게 합니다.
      window.setTimeout(() => {
        navigate("/", { replace: true });
      }, 700);
    } catch (error) {
      // 서버가 내려준 메시지가 있으면 우선 사용하고,
      // 네트워크 오류처럼 응답이 없으면 기본 실패 문구를 보여줍니다.
      setStatusMessage(
        "error",
        getApiMessage(
          error,
          "로그인에 실패했습니다. 아이디와 비밀번호를 확인해 주세요.",
        ),
      );
    } finally {
      // 성공/실패와 관계없이 요청이 끝나면 버튼을 다시 누를 수 있게 되돌립니다.
      setIsSubmitting(false);
    }
  };

  const handleSocialLogin = (provider) => {
    if (provider === "kakao") {
      // React 앱의 환경변수는 REACT_APP_ 접두사가 있어야 브라우저 코드에서 접근 가능합니다.
      const kakaoClientId = process.env.REACT_APP_KAKAO_REST_API_KEY;

      if (!kakaoClientId) {
        setStatusMessage(
          "error",
          "카카오 로그인을 사용하려면 REACT_APP_KAKAO_REST_API_KEY 설정이 필요합니다.",
        );
        return;
      }

      // 카카오 인증 후 돌아올 프론트 콜백 주소입니다.
      // 카카오 개발자 콘솔과 백엔드 kakao.redirect-uri 설정도 같은 주소여야 합니다.
      const redirectUri = `${window.location.origin}/oauth/kakao/callback`;

      // URLSearchParams를 사용해 OAuth query string을 안전하게 구성합니다.
      const searchParams = new URLSearchParams({
        client_id: kakaoClientId,
        redirect_uri: redirectUri,
        response_type: "code",
      });

      window.location.href = `${KAKAO_AUTH_URL}?${searchParams.toString()}`;
      return;
    }

    // 백엔드에 네이버 로그인 API가 아직 없으므로 잘못된 요청을 보내지 않고 사용자에게 현재 상태를 안내합니다.
    setStatusMessage(
      "error",
      "네이버 로그인 API는 아직 준비되어 있지 않습니다.",
    );
  };

  return (
    <Styles.Page>
      <Styles.BackgroundGradient />
      <Styles.BackgroundPhoto aria-hidden="true">
        <img
          alt=""
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuBIj15k-ljVdcr_iF9_MAF0i6UfyVlHxlbV0FGb-qfnh-wnhNY4Afn8-L6Hs5znPNOBHGiJ6V5WGdrx55qqUOFLC29ZRK3tR9dy4LXulOkRQWIPgUE3Yt9lVRu_-nPDoy21dfA3DdYtIu9auk5AQp6x_lh_Oci6P9dyWclv2GyjcupQvflq5WZhe0x-zMJOfP2MKbcHLP3RjNqmfADYfCnASQ_D_9FXRWJZCiV7vefM8wf4woe_de4tfVvY-HG770NHuR66QpoLJC1d"
        />
      </Styles.BackgroundPhoto>

      <Styles.Main>
        <Styles.LogoArea>
          <h1>FestaPick</h1>
          <p>Feel the rhythm of the night.</p>
        </Styles.LogoArea>

        <Styles.GlassContainer>
          <Styles.Form id="loginForm" onSubmit={handleSubmit} noValidate>
            <Styles.Field>
              <label htmlFor="userId">아이디</label>
              <Styles.InputGroup>
                <Styles.Icon aria-hidden="true">
                  <User size={22} strokeWidth={2} />
                </Styles.Icon>
                {/* aria-invalid는 접근성 속성이면서 CSS 오류 스타일 조건으로도 사용합니다. */}
                <Styles.Input
                  id="userId"
                  name="userId"
                  placeholder="아이디를 입력하세요"
                  type="text"
                  value={formValues.userId}
                  autoComplete="username"
                  aria-invalid={
                    status.type === "error" && !formValues.userId.trim()
                  }
                  onChange={(e) => handleInputChange("userId", e)}
                  required
                />
              </Styles.InputGroup>
            </Styles.Field>

            <Styles.Field>
              <label htmlFor="password">비밀번호</label>
              <Styles.InputGroup>
                <Styles.Icon aria-hidden="true">
                  <Lock size={22} strokeWidth={2} />
                </Styles.Icon>
                {/* 비밀번호가 비어 있을 때 발생한 오류라면 입력 테두리를 오류 스타일로 표시합니다. */}
                <Styles.Input
                  id="password"
                  name="password"
                  placeholder="비밀번호를 입력하세요"
                  type="password"
                  value={formValues.password}
                  autoComplete="current-password"
                  aria-invalid={status.type === "error" && !formValues.password}
                  onChange={(e) => handleInputChange("password", e)}
                  required
                />
              </Styles.InputGroup>
            </Styles.Field>

            {/*
              error일 때는 스크린리더가 더 적극적으로 읽도록 alert 역할을 줍니다.
              일반 진행/성공 메시지는 status 역할로 부드럽게 알립니다.
            */}
            <Styles.StatusMessage
              className={`${status.visible ? "visible" : ""} ${
                status.type === "error" ? "error" : ""
              } ${status.type === "success" ? "success" : ""}`}
              id="statusMessage"
              role={status.type === "error" ? "alert" : "status"}
              aria-live="polite"
            >
              {status.text || "메시지 영역"}
            </Styles.StatusMessage>

            <Styles.NeonButton type="submit" disabled={isSubmitting}>
              {isSubmitting ? "로그인 중" : "로그인"}
            </Styles.NeonButton>

            <Styles.LinksRow>
              <Styles.RecoveryLinks>
                <Link to="/find-id">아이디 찾기</Link>
                <Link to="/find-password">비밀번호 찾기</Link>
              </Styles.RecoveryLinks>
              <Styles.SignupLink as={Link} to="/signup">
                회원가입
              </Styles.SignupLink>
            </Styles.LinksRow>
          </Styles.Form>

          <Styles.Divider>
            <span>or continue with</span>
          </Styles.Divider>

          <Styles.Socials>
            <Styles.KakaoButton
              type="button"
              onClick={() => handleSocialLogin("kakao")}
            >
              <Styles.FilledIcon aria-hidden="true">
                <svg className="w-5 h-5" fill="#3C1E1E" viewBox="0 0 24 24">
                  <path d="M12 3c-4.97 0-9 3.18-9 7.11 0 2.55 1.7 4.79 4.26 6.06l-.82 3.01c-.05.18.06.37.24.42.06.02.12.01.18-.01l3.52-2.34c.54.06 1.1.09 1.62.09 4.97 0 9-3.18 9-7.11 0-3.93-4.03-7.22-9-7.22z"></path>
                </svg>
              </Styles.FilledIcon>
              <span>카카오톡으로 로그인</span>
            </Styles.KakaoButton>
            <Styles.NaverButton
              type="button"
              onClick={() => handleSocialLogin("naver")}
            >
              <Styles.NaverMark>N</Styles.NaverMark>
              <span>네이버로 로그인</span>
            </Styles.NaverButton>
          </Styles.Socials>
        </Styles.GlassContainer>
      </Styles.Main>
    </Styles.Page>
  );
};

export default LoginPage;
