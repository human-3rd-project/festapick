import React, { useEffect, useMemo, useState } from "react";
import { LockKeyhole, Mail, UserRound } from "lucide-react";
import { useNavigate } from "react-router-dom";
import AxiosApi from "../../../api/AxiosApi";
import MyPageSidebar from "../../../components/mypage/MyPageSidebar";
import * as S from "./MyPageInfoStyle";

const defaultProfileImageUrl =
  "data:image/svg+xml;utf8," +
  encodeURIComponent(`
    <svg width="240" height="240" viewBox="0 0 240 240" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="240" height="240" rx="54" fill="#F7F8FC"/>
      <g filter="url(#shadow)">
        <rect x="40" y="34" width="160" height="160" rx="40" fill="#F4F6FB"/>
        <circle cx="120" cy="93" r="30" fill="#5B4BDB"/>
        <path d="M74 152C77.8 131.7 97.6 120 120 120C142.4 120 162.2 131.7 166 152C167.2 158.4 162.1 164 155.6 164H84.4C77.9 164 72.8 158.4 74 152Z" fill="#5B4BDB"/>
      </g>
      <defs>
        <filter id="shadow" x="22" y="18" width="196" height="196" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
          <feDropShadow dx="0" dy="12" stdDeviation="14" flood-color="#D7DCE8" flood-opacity="0.8"/>
        </filter>
      </defs>
    </svg>
  `);

const fallbackUser = {
  nickname: "밤하늘뮤직광",
  email: "user@festapick.com",
  profileImageUrl: defaultProfileImageUrl,
};

// ApiResponse<T>와 axios response 양쪽 형태에서 실제 data만 꺼냅니다.
const getResponseData = (response) => response?.data?.data ?? response?.data;

function MyPageInfo() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(fallbackUser);
  const [nickname, setNickname] = useState(fallbackUser.nickname);
  const [profileImageUrl, setProfileImageUrl] = useState(
    fallbackUser.profileImageUrl,
  );
  const [nicknameStatus, setNicknameStatus] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);

  const nicknameChanged = useMemo(
    () => nickname.trim() !== profile.nickname,
    [nickname, profile.nickname],
  );

  useEffect(() => {
    const loadProfile = async () => {
      setIsLoading(true);
      setStatusMessage("");

      try {
        // 로그인 사용자의 프로필을 가져와 정적 기본값 대신 화면 상태로 사용합니다.
        const response = await AxiosApi.getMyProfile();
        const profileData = getResponseData(response) || fallbackUser;

        setProfile(profileData);
        setNickname(profileData.nickname || "");
        setProfileImageUrl(profileData.profileImageUrl || fallbackUser.profileImageUrl);
      } catch (error) {
        setStatusMessage(
          error.response?.data?.message || "프로필 정보를 불러오지 못했습니다.",
        );
      } finally {
        setIsLoading(false);
      }
    };

    loadProfile();
  }, []);

  const checkNickname = async () => {
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

    try {
      // 백엔드 중복 확인 API는 true면 중복, false면 사용 가능입니다.
      const response = await AxiosApi.checkNickname(trimmedNickname);
      const isDuplicate = getResponseData(response);

      setNicknameStatus(
        isDuplicate ? "이미 사용 중인 닉네임입니다." : "사용 가능한 닉네임입니다.",
      );
    } catch (error) {
      setNicknameStatus(
        error.response?.data?.message || "닉네임 중복 확인에 실패했습니다.",
      );
    }
  };

  const cancelChanges = () => {
    setNickname(profile.nickname || "");
    setProfileImageUrl(profile.profileImageUrl || fallbackUser.profileImageUrl);
    setNicknameStatus("");
    setStatusMessage("");
    setIsEditing(false);
  };

  const handleProfileImageUpload = async (event) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    setIsEditing(true);
    setIsUploadingImage(true);
    setStatusMessage("프로필 이미지를 업로드하는 중입니다.");

    try {
      // ImageUploadController는 multipart/form-data의 file 파라미터를 받고 이미지 URL을 반환합니다.
      const response = await AxiosApi.uploadImage(file);
      const uploadedImageUrl = getResponseData(response);

      setProfileImageUrl(uploadedImageUrl || fallbackUser.profileImageUrl);
      setStatusMessage("프로필 이미지가 업로드되었습니다. 저장하기를 눌러 반영하세요.");
    } catch (error) {
      setStatusMessage(
        error.response?.data?.message || "프로필 이미지 업로드에 실패했습니다.",
      );
    } finally {
      setIsUploadingImage(false);
      event.target.value = "";
    }
  };

  const editProfile = async () => {
    if (!isEditing) {
      setIsEditing(true);
      return;
    }

    const trimmedNickname = nickname.trim();

    if (!trimmedNickname) {
      setNicknameStatus("닉네임을 입력해 주세요.");
      return;
    }

    try {
      // 프로필 이미지는 Firebase 업로드 후 받은 URL을 profileImageUrl로 저장합니다.
      const response = await AxiosApi.updateMyProfile({
        nickname: trimmedNickname,
        profileImageUrl,
      });
      const updatedProfile = getResponseData(response);

      setProfile(updatedProfile);
      setNickname(updatedProfile.nickname || "");
      setProfileImageUrl(updatedProfile.profileImageUrl || fallbackUser.profileImageUrl);
      setNicknameStatus("");
      setStatusMessage("프로필 정보가 저장되었습니다.");
      setIsEditing(false);
    } catch (error) {
      setStatusMessage(
        error.response?.data?.message || "프로필 정보를 저장하지 못했습니다.",
      );
    }
  };

  const startImageUpload = () => {
    setIsEditing(true);
  };

  return (
    <S.Page>
      <S.Container>
        <MyPageSidebar activePath="/mypage/profile" />

        <S.Content>
          <S.ProfilePanel>
            <S.Title>프로필 정보</S.Title>
            {isLoading && <S.HelperText>프로필 정보를 불러오는 중입니다.</S.HelperText>}
            {statusMessage && <S.HelperText>{statusMessage}</S.HelperText>}

            <S.ProfileBody>
              <S.AvatarColumn>
                <S.AvatarUploadLabel>
                  <S.AvatarImage
                    src={profileImageUrl}
                    alt=""
                    onClick={startImageUpload}
                  />
                  <S.AvatarFileInput
                    type="file"
                    accept="image/jpeg,image/png,image/gif,image/webp"
                    onChange={handleProfileImageUpload}
                    disabled={isUploadingImage}
                  />
                </S.AvatarUploadLabel>
                <S.AvatarCaption>
                  {isUploadingImage
                    ? "프로필 사진을 업로드하는 중입니다"
                    : "프로필 사진은 Firebase 업로드 URL로 저장됩니다"}
                </S.AvatarCaption>
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
                      value={profile.email || ""}
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
                    {isEditing ? "저장하기" : "수정하기"}
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
