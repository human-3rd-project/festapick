import React, { useMemo, useState } from "react";
import { LockKeyhole, Mail, UserRound } from "lucide-react";
import { useNavigate } from "react-router-dom";
import MyPageSidebar from "../../../components/mypage/MyPageSidebar";
import * as S from "./MyPageInfoStyle";

const currentUser = {
  nickname: "밤하늘뮤직광",
  email: "user@festapick.com",
  profileImage:
    "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=240&q=80",
};

const unavailableNicknames = ["FestaPick", "운영자", "admin", "밤하늘뮤직광"];

function MyPageInfo() {
  const navigate = useNavigate();
  const [nickname, setNickname] = useState(currentUser.nickname);
  const [nicknameStatus, setNicknameStatus] = useState("");
  const [isEditing, setIsEditing] = useState(false);

  const nicknameChanged = useMemo(
    () => nickname.trim() !== currentUser.nickname,
    [nickname],
  );

  const checkNickname = () => {
    if (!isEditing) {
      return;
    }

    const trimmedNickname = nickname.trim();

    if (!trimmedNickname) {
      setNicknameStatus("닉네임을 입력해 주세요.");
      return;
    }

    if (!nicknameChanged) {
      setNicknameStatus("현재 사용 중인 닉네임입니다.");
      return;
    }

    if (unavailableNicknames.includes(trimmedNickname)) {
      setNicknameStatus("이미 사용 중인 닉네임입니다.");
      return;
    }

    setNicknameStatus("사용 가능한 닉네임입니다.");
  };

  const cancelChanges = () => {
    setNickname(currentUser.nickname);
    setNicknameStatus("");
    setIsEditing(false);
  };

  const editProfile = () => {
    setIsEditing(true);
  };

  return (
    <S.Page>
      <S.Container>
        <MyPageSidebar activePath="/mypage/profile" />

        <S.Content>
          <S.ProfilePanel>
            <S.Title>프로필 정보</S.Title>

            <S.ProfileBody>
              <S.AvatarColumn>
                <S.AvatarImage src={currentUser.profileImage} alt="" />
                <S.AvatarCaption>프로필 사진은 클릭하여 변경하세요</S.AvatarCaption>
              </S.AvatarColumn>

              <S.FormArea>
                <S.FieldGroup>
                  <S.Label htmlFor="nickname">닉네임</S.Label>
                  <S.InputRow>
                    <S.IconField $disabled={!isEditing}>
                      <UserRound size={17} aria-hidden="true" />
                      <S.TextInput
                        id="nickname"
                        value={nickname}
                        readOnly={!isEditing}
                        aria-readonly={!isEditing}
                        onChange={(event) => {
                          setNickname(event.target.value);
                          setNicknameStatus("");
                        }}
                      />
                    </S.IconField>
                    <S.CheckButton
                      type="button"
                      onClick={checkNickname}
                      disabled={!isEditing}
                    >
                      중복체크
                    </S.CheckButton>
                  </S.InputRow>
                  <S.HelperText $success={nicknameStatus.includes("가능")}>
                    {nicknameStatus ||
                      (isEditing
                        ? "커뮤니티와 리뷰에 표시될 닉네임입니다."
                        : "수정하기를 누르면 닉네임을 변경할 수 있습니다.")}
                  </S.HelperText>
                </S.FieldGroup>

                <S.FieldGroup>
                  <S.Label htmlFor="email">이메일 계정</S.Label>
                  <S.IconField $disabled>
                    <Mail size={17} aria-hidden="true" />
                    <S.TextInput
                      id="email"
                      value={currentUser.email}
                      readOnly
                      aria-readonly="true"
                    />
                  </S.IconField>
                </S.FieldGroup>

                <S.SecurityCard>
                  <S.SecurityInfo>
                    <S.SecurityIcon aria-hidden="true">
                      <LockKeyhole size={19} />
                    </S.SecurityIcon>
                    <div>
                      <S.SecurityTitle>비밀번호</S.SecurityTitle>
                      <S.SecurityMeta>마지막 변경: 3개월 전</S.SecurityMeta>
                    </div>
                  </S.SecurityInfo>
                  <S.SecondaryButton
                    type="button"
                    onClick={() => navigate("/mypage/password/verify")}
                  >
                    변경하기
                  </S.SecondaryButton>
                </S.SecurityCard>

                <S.ActionRow>
                  {isEditing && (
                    <S.CancelButton type="button" onClick={cancelChanges}>
                      취소
                    </S.CancelButton>
                  )}
                  <S.PrimaryButton type="button" onClick={editProfile}>
                    수정하기
                  </S.PrimaryButton>
                </S.ActionRow>
              </S.FormArea>
            </S.ProfileBody>
          </S.ProfilePanel>
        </S.Content>
      </S.Container>
    </S.Page>
  );
}

export default MyPageInfo;
