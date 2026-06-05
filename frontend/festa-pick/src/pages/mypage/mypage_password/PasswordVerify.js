import React, { useState } from "react";
import { LockKeyhole } from "lucide-react";
import { useNavigate } from "react-router-dom";
import MyPageSidebar from "../../../components/mypage/MyPageSidebar";
import * as S from "./PasswordStyle";

const currentAccount = {
  email: "user@festapick.com",
  password: "festapick123!",
};

const passwordResetPath = "/mypage/password/reset";

function PasswordVerify() {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const verifyPassword = (event) => {
    event.preventDefault();

    if (password !== currentAccount.password) {
      setErrorMessage("현재 비밀번호가 일치하지 않습니다.");
      return;
    }

    navigate(passwordResetPath, { state: { passwordVerified: true } });
  };

  return (
    <S.Page>
      <S.Container>
        <MyPageSidebar activePath="/mypage/profile" />

        <S.Content>
          <S.Panel as="form" onSubmit={verifyPassword}>
            <S.IconCircle aria-hidden="true">
              <LockKeyhole size={28} />
            </S.IconCircle>
            <S.Title>비밀번호 확인</S.Title>
            <S.Description>
              현재 로그인 된 계정의 비밀번호를 입력해 주세요.
            </S.Description>

            <S.AccountBox>
              <S.AccountLabel>이메일 계정</S.AccountLabel>
              <S.AccountValue>{currentAccount.email}</S.AccountValue>
            </S.AccountBox>

            <S.FieldGroup>
              <S.Label htmlFor="current-password">현재 비밀번호</S.Label>
              <S.TextInput
                id="current-password"
                type="password"
                value={password}
                onChange={(event) => {
                  setPassword(event.target.value);
                  setErrorMessage("");
                }}
                autoComplete="current-password"
              />
              <S.HelperText role="alert">{errorMessage}</S.HelperText>
            </S.FieldGroup>

            <S.ActionRow>
              <S.CancelButton type="button" onClick={() => navigate(-1)}>
                취소
              </S.CancelButton>
              <S.PrimaryButton type="submit">확인</S.PrimaryButton>
            </S.ActionRow>
          </S.Panel>
        </S.Content>
      </S.Container>
    </S.Page>
  );
}

export default PasswordVerify;
