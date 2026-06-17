import React, { useState } from "react";
import { AlertCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import AxiosApi from "../../../api/AxiosApi";
import MyPageSidebar from "../../../components/mypage/MyPageSidebar";
import * as S from "./MyPageAccountStyle";

function MyPageAccount() {
  const navigate = useNavigate();
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleteMessage, setDeleteMessage] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  const openDeleteModal = () => {
    setDeleteMessage("");
    setIsDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
  };

  const confirmDeleteAccount = async () => {
    setIsDeleting(true);
    setDeleteMessage("");

    try {
      // 로그인 사용자의 계정을 삭제하고 로컬 인증 정보를 비웁니다.
      await AxiosApi.deleteMyAccount();
      localStorage.clear();
      setDeleteMessage("계정 삭제 요청이 완료되었습니다.");
      setIsDeleteModalOpen(false);
      navigate("/");
    } catch (error) {
      setDeleteMessage(
        error.response?.data?.message || "계정 삭제 요청에 실패했습니다.",
      );
      setIsDeleteModalOpen(false);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <S.Page>
      <S.Container>
        <MyPageSidebar activePath="/mypage/account" />

        <S.Content>
          <S.DangerPanel>
            <S.PanelHeader>
              <S.DangerTitle>
                <AlertCircle size={18} fill="currentColor" aria-hidden="true" />
                Danger Zone
              </S.DangerTitle>
            </S.PanelHeader>

            <S.PanelBody>
              <S.TextGroup>
                <S.SectionTitle>회원 탈퇴</S.SectionTitle>
                <S.Description>
                  계정을 삭제하면 회원님의 모든 예매 내역, 작성한 리뷰,
                  찜한 페스티벌 정보가 영구적으로 삭제됩니다.
                  <br />
                  이 작업은 취소할 수 없으며, 삭제된 데이터는 절대 복구되지
                  않습니다.
                </S.Description>
              </S.TextGroup>

              <S.DeleteButton type="button" onClick={openDeleteModal}>
                계정 영구 삭제
              </S.DeleteButton>
            </S.PanelBody>
          </S.DangerPanel>

          {deleteMessage && <S.ResultMessage>{deleteMessage}</S.ResultMessage>}

          {isDeleteModalOpen && (
            <S.ModalOverlay role="presentation">
              <S.ModalPanel
                role="dialog"
                aria-modal="true"
                aria-labelledby="delete-account-title"
              >
                <S.ModalIcon aria-hidden="true">
                  <AlertCircle size={30} fill="currentColor" />
                </S.ModalIcon>
                <S.ModalTitle id="delete-account-title">
                  정말 삭제하시겠습니까?
                </S.ModalTitle>
                <S.ModalDescription>
                  계정을 삭제하면 모든 활동 내역과 저장된 정보가 영구적으로
                  삭제되며 복구할 수 없습니다.
                </S.ModalDescription>

                <S.ModalActions>
                  <S.CancelButton type="button" onClick={closeDeleteModal}>
                    취소
                  </S.CancelButton>
                  <S.ConfirmDeleteButton
                    type="button"
                    onClick={confirmDeleteAccount}
                    disabled={isDeleting}
                  >
                    {isDeleting ? "삭제 중" : "삭제하기"}
                  </S.ConfirmDeleteButton>
                </S.ModalActions>
              </S.ModalPanel>
            </S.ModalOverlay>
          )}
        </S.Content>
      </S.Container>
    </S.Page>
  );
}

export default MyPageAccount;
