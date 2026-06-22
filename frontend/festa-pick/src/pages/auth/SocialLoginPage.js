import React, { useEffect, useState } from "react";
import { ArrowLeft, Check, ChevronRight, Loader2 } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import AxiosApi from "../../api/AxiosApi";
import { useAuth } from "../../context/AuthContext";
import Styles from "./SocialLoginPageCss";

const KAKAO_STORAGE_KEY = "festapick:kakao-auth-result";

const isValidEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
const isValidNickname = (value) => /^[가-힣a-zA-Z0-9]{2,12}$/.test(value);

const getApiMessage = (error, fallbackMessage) => {
  const serverMessage = error?.response?.data?.message;
  return serverMessage && !serverMessage.includes("�") && !serverMessage.includes("?")
    ? serverMessage
    : fallbackMessage;
};

const SocialLoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth() || {};
  const getSocialSignupState = () => {
    if (location.state?.temporaryToken) {
      return location.state;
    }

    try {
      const storedResult = JSON.parse(localStorage.getItem(KAKAO_STORAGE_KEY) || "null");

      if (storedResult?.type === "KAKAO_SIGNUP_REQUIRED") {
        return storedResult.payload || {};
      }
    } catch {
      localStorage.removeItem(KAKAO_STORAGE_KEY);
    }

    return {};
  };
  const socialSignupState = getSocialSignupState();
  const temporaryToken = socialSignupState.temporaryToken || "";

  const [email, setEmail] = useState("");
  const [nickname, setNickname] = useState("");
  const [checkedEmail, setCheckedEmail] = useState("");
  const [checkedNickname, setCheckedNickname] = useState("");
  const [agreements, setAgreements] = useState({
    all: false,
    terms: false,
    privacy: false,
  });
  const [message, setMessage] = useState({ field: "", type: "", text: "" });
  const [isCheckingEmail, setIsCheckingEmail] = useState(false);
  const [isCheckingNickname, setIsCheckingNickname] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!temporaryToken) {
      window.alert("카카오 추가 가입 정보가 없습니다. 다시 로그인해 주세요.");
      navigate("/login", { replace: true });
    }
  }, [navigate, temporaryToken]);

  const setFieldMessage = (field, type, text) => {
    setMessage({ field, type, text });
  };

  const renderFieldMessage = (fieldName) => {
    const fieldMessage = message.field === fieldName ? message : null;

    return (
      <Styles.FieldMessage
        className={`${fieldMessage?.type || ""} ${fieldMessage?.text ? "" : "empty"}`}
      >
        {fieldMessage?.text || "메시지 영역"}
      </Styles.FieldMessage>
    );
  };

  const handleEmailChange = (e) => {
    const nextEmail = e.currentTarget.value;
    setEmail(nextEmail);

    if (checkedEmail && checkedEmail !== nextEmail.trim()) {
      setCheckedEmail("");
    }

    if (message.field === "email") {
      setMessage({ field: "", type: "", text: "" });
    }
  };

  const handleNicknameChange = (e) => {
    const nextNickname = e.currentTarget.value;
    setNickname(nextNickname);

    if (checkedNickname && checkedNickname !== nextNickname.trim()) {
      setCheckedNickname("");
    }

    if (message.field === "nickname") {
      setMessage({ field: "", type: "", text: "" });
    }
  };

  const handleAgreementAll = (e) => {
    const checked = e.currentTarget.checked;

    setAgreements({
      all: checked,
      terms: checked,
      privacy: checked,
    });

    if (message.field === "terms") {
      setMessage({ field: "", type: "", text: "" });
    }
  };

  const handleAgreementChange = (name, e) => {
    const checked = e.currentTarget.checked;

    setAgreements((prevAgreements) => {
      const nextAgreements = {
        ...prevAgreements,
        [name]: checked,
      };

      return {
        ...nextAgreements,
        all: nextAgreements.terms && nextAgreements.privacy,
      };
    });

    if (message.field === "terms") {
      setMessage({ field: "", type: "", text: "" });
    }
  };

  const handleEmailCheck = async () => {
    const trimmedEmail = email.trim();

    if (!trimmedEmail) {
      setFieldMessage("email", "error", "이메일을 입력해 주세요.");
      return;
    }

    if (!isValidEmail(trimmedEmail)) {
      setFieldMessage("email", "error", "이메일 형식에 맞게 입력해 주세요.");
      return;
    }

    setIsCheckingEmail(true);

    try {
      const response = await AxiosApi.checkEmail(trimmedEmail);
      const isDuplicated = response.data?.data === true;

      if (email.trim() !== trimmedEmail) {
        return;
      }

      if (isDuplicated) {
        setCheckedEmail("");
        setFieldMessage("email", "error", "이미 사용 중인 이메일입니다.");
        return;
      }

      setCheckedEmail(trimmedEmail);
      setFieldMessage("email", "success", "사용 가능한 이메일입니다.");
    } catch (error) {
      setCheckedEmail("");
      setFieldMessage(
        "email",
        "error",
        getApiMessage(error, "이메일 중복 확인에 실패했습니다."),
      );
    } finally {
      setIsCheckingEmail(false);
    }
  };

  const handleNicknameCheck = async () => {
    const trimmedNickname = nickname.trim();

    if (!trimmedNickname) {
      setFieldMessage("nickname", "error", "닉네임을 입력해 주세요.");
      return;
    }

    if (!isValidNickname(trimmedNickname)) {
      setFieldMessage(
        "nickname",
        "error",
        "닉네임은 한글, 영문, 숫자 2~12자로 입력해 주세요.",
      );
      return;
    }

    setIsCheckingNickname(true);

    try {
      const response = await AxiosApi.checkNickname(trimmedNickname);
      const isDuplicated = response.data?.data === true;

      if (nickname.trim() !== trimmedNickname) {
        return;
      }

      if (isDuplicated) {
        setCheckedNickname("");
        setFieldMessage("nickname", "error", "이미 사용 중인 닉네임입니다.");
        return;
      }

      setCheckedNickname(trimmedNickname);
      setFieldMessage("nickname", "success", "사용 가능한 닉네임입니다.");
    } catch (error) {
      setCheckedNickname("");
      setFieldMessage(
        "nickname",
        "error",
        getApiMessage(error, "닉네임 중복 확인에 실패했습니다."),
      );
    } finally {
      setIsCheckingNickname(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isSubmitting || isCheckingEmail || isCheckingNickname) {
      return;
    }

    const trimmedEmail = email.trim();
    const trimmedNickname = nickname.trim();

    if (!temporaryToken) {
      setFieldMessage("form", "error", "카카오 추가 가입 정보가 없습니다. 다시 로그인해 주세요.");
      return;
    }

    if (!trimmedEmail) {
      setFieldMessage("email", "error", "이메일을 입력해 주세요.");
      return;
    }

    if (!isValidEmail(trimmedEmail)) {
      setFieldMessage("email", "error", "이메일 형식에 맞게 입력해 주세요.");
      return;
    }

    if (checkedEmail !== trimmedEmail) {
      setFieldMessage("email", "error", "이메일 중복 확인을 완료해 주세요.");
      return;
    }

    if (!isValidNickname(trimmedNickname)) {
      setFieldMessage(
        "nickname",
        "error",
        "닉네임은 한글, 영문, 숫자 2~12자로 입력해 주세요.",
      );
      return;
    }

    if (checkedNickname !== trimmedNickname) {
      setFieldMessage("nickname", "error", "닉네임 중복 확인을 완료해 주세요.");
      return;
    }

    if (!agreements.terms || !agreements.privacy) {
      setFieldMessage("terms", "error", "필수 약관에 모두 동의해 주세요.");
      return;
    }

    if (!login) {
      setFieldMessage("form", "error", "인증 컨텍스트를 사용할 수 없습니다.");
      return;
    }

    setIsSubmitting(true);
    setFieldMessage("form", "success", "가입 정보를 확인하고 있습니다.");

    try {
      const response = await AxiosApi.socialSignup(temporaryToken, {
        email: trimmedEmail,
        nickname: trimmedNickname,
        termsAgreed: true,
      });
      const responseData = response.data?.data || response.data;

      if (!responseData?.accessToken) {
        throw new Error("소셜 가입 로그인 토큰이 응답에 포함되지 않았습니다.");
      }

      await login(response);
      localStorage.removeItem(KAKAO_STORAGE_KEY);
      navigate("/", { replace: true });
    } catch (error) {
      setFieldMessage(
        "form",
        "error",
        getApiMessage(error, "소셜 회원가입에 실패했습니다. 입력값을 확인해 주세요."),
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Styles.Page>
      <Styles.BackgroundGradient />
      <Styles.BackgroundPhoto aria-hidden="true">
        <img
          alt=""
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuC6tJxnaSyQkuN2w9yVUxnuI1qb8jb35DWeQhgfe8JHrbzJ96E4-xTkx8uSZ71jEr0OOpblNIyOXPSpMzHt7ATD_c30FzrJc8Xyg9IvoNctBf9nD3Mqnn7nWFENWTIpcUfhB1mdRxwPHJMzGJ42zbvqy2R980BO7ggO9evbmW-XlaEBXs2M7daXYldXtDPUL4xNNjSvZOcPuYfn30s-uBX3UySWIRSoTuzXCup_gHcO4erA36E4hkDQCUtvMA9KtccNmJkKEU6I4JvV"
        />
      </Styles.BackgroundPhoto>

      <Styles.Main>
        <Styles.GlassPanel>
          <Styles.Heading>
            <h1>FestaPick</h1>
            <h2>추가 정보 입력</h2>
            <p>FestaPick 가입을 위해 추가 정보를 입력해주세요.</p>
          </Styles.Heading>

          <Styles.Form onSubmit={handleSubmit} noValidate>
            <Styles.Field>
              <label htmlFor="socialEmail">이메일</label>
              <Styles.FieldWithButton>
                <Styles.InputGroup>
                  <Styles.Input
                    id="socialEmail"
                    name="socialEmail"
                    type="email"
                    value={email}
                    placeholder="example@festapick.com"
                    inputMode="email"
                    aria-invalid={message.field === "email" && message.type === "error"}
                    onChange={handleEmailChange}
                  />
                </Styles.InputGroup>
                <Styles.GlassButton
                  type="button"
                  disabled={isCheckingEmail}
                  onClick={handleEmailCheck}
                >
                  {isCheckingEmail ? "확인 중" : "중복 확인"}
                </Styles.GlassButton>
              </Styles.FieldWithButton>
              {renderFieldMessage("email")}
            </Styles.Field>

            <Styles.Field>
              <label htmlFor="nickname">닉네임</label>
              <Styles.FieldWithButton>
                <Styles.InputGroup>
                  <Styles.Input
                    id="nickname"
                    name="nickname"
                    placeholder="닉네임을 입력해주세요"
                    type="text"
                    value={nickname}
                    aria-invalid={message.field === "nickname" && message.type === "error"}
                    onChange={handleNicknameChange}
                    onBlur={() => {
                      const trimmedNickname = nickname.trim();

                      if (trimmedNickname && !isValidNickname(trimmedNickname)) {
                        setFieldMessage(
                          "nickname",
                          "error",
                          "닉네임은 한글, 영문, 숫자 2~12자로 입력해 주세요.",
                        );
                      }
                    }}
                  />
                </Styles.InputGroup>
                <Styles.GlassButton
                  type="button"
                  disabled={isCheckingNickname}
                  onClick={handleNicknameCheck}
                >
                  {isCheckingNickname ? "확인 중" : "중복 확인"}
                </Styles.GlassButton>
              </Styles.FieldWithButton>
              <Styles.HelpText>한글, 영문, 숫자만 사용 가능 (2~12자 내)</Styles.HelpText>
              {renderFieldMessage("nickname")}
            </Styles.Field>

            <Styles.Divider />

            <Styles.TermsGroup>
              <Styles.MasterTerm>
                <Styles.CheckboxInput
                  id="allTerms"
                  type="checkbox"
                  checked={agreements.all}
                  onChange={handleAgreementAll}
                />
                <Styles.CustomCheckbox aria-hidden="true">
                  <Check size={16} strokeWidth={3} />
                </Styles.CustomCheckbox>
                <span>이용 약관</span>
              </Styles.MasterTerm>

              <Styles.TermList>
                <Styles.TermItem>
                  <span>
                    <Styles.SmallCheckbox
                      id="terms"
                      name="terms"
                      type="checkbox"
                      checked={agreements.terms}
                      onChange={(e) => handleAgreementChange("terms", e)}
                    />
                    <label htmlFor="terms">[필수] 이용 약관</label>
                  </span>
                  <Styles.TermLink as={Link} to="/" aria-label="이용 약관 보기">
                    <ChevronRight size={18} />
                  </Styles.TermLink>
                </Styles.TermItem>

                <Styles.TermItem>
                  <span>
                    <Styles.SmallCheckbox
                      id="privacy"
                      name="privacy"
                      type="checkbox"
                      checked={agreements.privacy}
                      onChange={(e) => handleAgreementChange("privacy", e)}
                    />
                    <label htmlFor="privacy">[필수] 개인 정보 수집 및 이용 동의</label>
                  </span>
                  <Styles.TermLink
                    as={Link}
                    to="/"
                    aria-label="개인 정보 수집 및 이용 동의 보기"
                  >
                    <ChevronRight size={18} />
                  </Styles.TermLink>
                </Styles.TermItem>
              </Styles.TermList>
              {renderFieldMessage("terms")}
            </Styles.TermsGroup>

            {renderFieldMessage("form")}

            <Styles.SubmitButton
              type="submit"
              disabled={isSubmitting || isCheckingEmail || isCheckingNickname}
            >
              {isSubmitting && <Loader2 size={18} aria-hidden="true" />}
              {isSubmitting ? "처리 중..." : "가입 완료"}
            </Styles.SubmitButton>

            <Styles.BackButton type="button" onClick={() => navigate("/login")}>
              <ArrowLeft size={18} aria-hidden="true" />
              로그인으로 돌아가기
            </Styles.BackButton>
          </Styles.Form>

          <Styles.CardGlowTop />
          <Styles.CardGlowBottom />
        </Styles.GlassPanel>
      </Styles.Main>
    </Styles.Page>
  );
};

export default SocialLoginPage;
