import React from "react";
import { Lock, User } from "lucide-react";
import { Link } from "react-router-dom";
import Styles from "./LoginPageCss";

const LoginPage = () => {
  const status = { visible: false, type: "", text: "" };

  const handleSubmit = (e) => {
    e.preventDefault();
  };

  const handleSocialLogin = () => {};
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
                <Styles.Input
                  id="userId"
                  name="userId"
                  placeholder="아이디를 입력하세요"
                  type="text"
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
                <Styles.Input
                  id="password"
                  name="password"
                  placeholder="비밀번호를 입력하세요"
                  type="password"
                  required
                />
              </Styles.InputGroup>
            </Styles.Field>

            <Styles.StatusMessage
              className={`${status.visible ? "visible" : ""} ${status.type === "error" ? "error" : ""} ${status.type === "success" ? "success" : ""}`}
              id="statusMessage"
            >
              {status.text}
            </Styles.StatusMessage>

            <Styles.NeonButton type="submit">로그인</Styles.NeonButton>

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
