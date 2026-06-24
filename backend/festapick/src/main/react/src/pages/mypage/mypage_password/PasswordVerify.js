import React, { useEffect, useState } from "react";
import { CheckCircle, LockKeyhole } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import AxiosApi from "../../../api/AxiosApi";
import MyPageSidebar from "../../../components/mypage/MyPageSidebar";
import * as S from "./PasswordStyle";

const initialStatus = {
  type: "",
  message: "",
};

// ApiResponse<T>와 axios response 양쪽 형태에서 실제 data만 꺼냅니다.
const getResponseData = (response) => response?.data?.data ?? response?.data;

function PasswordVerify() {
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState("");
  const [provider, setProvider] = useState(location.state?.provider || "");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [status, setStatus] = useState(initialStatus);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const isSocialAccount = provider && provider !== "LOCAL";

  useEffect(() => {
    const loadProfile = async () => {
      try {
        // 이메일 표시는 프로필 API로만 가져오고, 비밀번호 값은 프론트에 보관하지 않습니다.
        const response = await AxiosApi.getMyProfile();
        const profile = getResponseData(response);

        setEmail(profile?.email || "");
        setProvider(profile?.provider || "");
      } catch (error) {
        setStatus({
          type: "error",
          message:
            error.response?.data?.message || "계정 정보를 불러오지 못했습니다.",
        });
      }
    };

    loadProfile();
  }, []);

  const changePassword = async (event) => {
    event.preventDefault();

    if (isSocialAccount) {
      setStatus({
        type: "error",
        message: "소셜 로그인 계정은 비밀번호를 변경할 수 없습니다.",
      });
      return;
    }

    const normalizedNewPassword = newPassword.trim();
    const normalizedConfirmPassword = confirmPassword.trim();
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d).{8,}$/;

    if (!currentPassword) {
      setStatus({ type: "error", message: "현재 비밀번호를 입력해 주세요." });
      return;
    }

    if (!passwordRegex.test(normalizedNewPassword)) {
      setStatus({
        type: "error",
        message: "새 비밀번호는 영문과 숫자를 포함해 8자 이상이어야 합니다.",
      });
      return;
    }

    if (normalizedNewPassword !== normalizedConfirmPassword) {
      setStatus({ type: "error", message: "새 비밀번호가 일치하지 않습니다." });
      return;
    }

    setIsSubmitting(true);
    setStatus(initialStatus);

    try {
      // 마이페이지 비밀번호 변경은 로그인 토큰과 현재 비밀번호로 백엔드에서 검증합니다.
      await AxiosApi.changeMyPassword(currentPassword, normalizedNewPassword);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setIsCompleted(true);
    } catch (error) {
      setStatus({
        type: "error",
        message: error.response?.data?.message || "비밀번호 변경에 실패했습니다.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <S.Page>
      <S.Container>
        <MyPageSidebar activePath="/mypage/profile" />

        <S.Content>
          <S.Panel as="form" onSubmit={changePassword}>
            <S.IconCircle aria-hidden="true">
              {isCompleted ? <CheckCircle size={28} /> : <LockKeyhole size={28} />}
            </S.IconCircle>
            <S.Title>
              {isSocialAccount
                ? "비밀번호 변경 불가"
                : isCompleted
                  ? "비밀번호 변경 완료"
                  : "비밀번호 변경"}
            </S.Title>
            <S.Description>
              {isSocialAccount
                ? "소셜 로그인 계정은 FestaPick에서 비밀번호를 변경할 수 없습니다. 카카오/네이버/구글 계정 설정에서 변경해 주세요."
                : isCompleted
                ? "새 비밀번호가 정상적으로 저장되었습니다."
                : "현재 비밀번호와 새 비밀번호를 입력해 주세요."}
            </S.Description>

            <S.AccountBox>
              <S.AccountLabel>이메일 계정</S.AccountLabel>
              <S.AccountValue>{email || "계정 정보 확인 중"}</S.AccountValue>
            </S.AccountBox>

            {isSocialAccount ? null : isCompleted ? (
              <S.HelperText>다음 로그인부터 새 비밀번호를 사용해 주세요.</S.HelperText>
            ) : (
              <>
                <S.FieldGroup>
                  <S.Label htmlFor="current-password">현재 비밀번호</S.Label>
                  <S.TextInput
                    id="current-password"
                    type="password"
                    value={currentPassword}
                    onChange={(event) => {
                      setCurrentPassword(event.target.value);
                      setStatus(initialStatus);
                    }}
                    autoComplete="current-password"
                  />
                </S.FieldGroup>

                <S.FieldGroup>
                  <S.Label htmlFor="new-password">새 비밀번호</S.Label>
                  <S.TextInput
                    id="new-password"
                    type="password"
                    value={newPassword}
                    onChange={(event) => {
                      setNewPassword(event.target.value);
                      setStatus(initialStatus);
                    }}
                    autoComplete="new-password"
                    placeholder="영문, 숫자 포함 8자 이상"
                  />
                </S.FieldGroup>

                <S.FieldGroup>
                  <S.Label htmlFor="confirm-password">새 비밀번호 확인</S.Label>
                  <S.TextInput
                    id="confirm-password"
                    type="password"
                    value={confirmPassword}
                    onChange={(event) => {
                      setConfirmPassword(event.target.value);
                      setStatus(initialStatus);
                    }}
                    autoComplete="new-password"
                  />
                  <S.HelperText role="alert">{status.message}</S.HelperText>
                </S.FieldGroup>
              </>
            )}

            <S.ActionRow>
              {isSocialAccount ? (
                <S.PrimaryButton type="button" onClick={() => navigate("/mypage/profile")}>
                  프로필로 이동
                </S.PrimaryButton>
              ) : (
                <>
                  <S.CancelButton type="button" onClick={() => navigate(-1)}>
                    취소
                  </S.CancelButton>
                  {isCompleted ? (
                    <S.PrimaryButton type="button" onClick={() => navigate("/mypage/profile")}>
                      프로필로 이동
                    </S.PrimaryButton>
                  ) : (
                    <S.PrimaryButton type="submit" disabled={isSubmitting}>
                      {isSubmitting ? "변경 중" : "변경하기"}
                    </S.PrimaryButton>
                  )}
                </>
              )}
            </S.ActionRow>
          </S.Panel>
        </S.Content>
      </S.Container>
    </S.Page>
  );
}

export default PasswordVerify;
