import { useEffect, useMemo, useRef, useState } from "react";
import { ImagePlus, Send, X } from "lucide-react";

import {
  AiBoard,
  AiDot,
  AiLabel,
  AiSummary,
  Avatar,
  Backdrop,
  ChatBody,
  ChatBubble,
  ChatMeta,
  ChatName,
  ChatRow,
  CloseButton,
  Composer,
  ComposerBox,
  Footer,
  Header,
  HeaderInfo,
  InputArea,
  LiveDot,
  ModalPanel,
  PhotoPreview,
  QuickChip,
  QuickChipList,
  RemovePhotoButton,
  SelectedPhoto,
  SelectedPhotoInfo,
  SelectedPhotoPreview,
  SendButton,
  StatusText,
  SystemNotice,
  Textarea,
  Title,
  UploadButton,
} from "./LiveTalkModalCss";

const DEFAULT_SUMMARY =
  "현재 현장은 입구 대기 줄이 약 15분 정도로 짧습니다. 메인 스테이지 근처는 이미 열기가 뜨거우며, F&B 존에서는 '네온 에이드'가 가장 인기 있는 메뉴로 꼽히고 있습니다.";

const QUICK_CHIPS = ["분위기 대박", "인증샷!", "친구 구함", "푸드존 후기"];

function RealTimeTalkModal({
  isOpen = true,
  onClose,
  messages = [],
  onSend,
  onUploadPhoto,
  aiSummary = DEFAULT_SUMMARY,
  participantCount = null,
  canSend = true,
  isUploading = false,
  placeholder = "현장 메시지를 입력하세요...",
  statusMessage = "",
}) {
  const [message, setMessage] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const chatBodyRef = useRef(null);
  const fileInputRef = useRef(null);
  const selectedImagePreview = useMemo(
    () => (selectedFile ? URL.createObjectURL(selectedFile) : ""),
    [selectedFile],
  );

  const formattedParticipantCount = useMemo(
    () =>
      participantCount === null || participantCount === undefined
        ? ""
        : Number(participantCount || 0).toLocaleString("ko-KR"),
    [participantCount],
  );

  useEffect(() => {
    if (isOpen && chatBodyRef.current) {
      chatBodyRef.current.scrollTop = chatBodyRef.current.scrollHeight;
    }
  }, [isOpen, messages]);

  useEffect(() => {
    if (!isOpen) {
      setMessage("");
      setSelectedFile(null);
    }
  }, [isOpen]);

  useEffect(() => () => {
    if (selectedImagePreview) {
      URL.revokeObjectURL(selectedImagePreview);
    }
  }, [selectedImagePreview]);

  if (!isOpen) {
    return null;
  }

  const handleSubmit = async (event) => {
    event.preventDefault();

    const trimmedMessage = message.trim();
    if (!canSend || (!trimmedMessage && !selectedFile)) {
      return;
    }

    if (selectedFile) {
      if (!onUploadPhoto) {
        return;
      }

      const sent = await onUploadPhoto(selectedFile, trimmedMessage);

      if (sent !== false) {
        setMessage("");
        setSelectedFile(null);
      }

      return;
    }

    if (!onSend) {
      return;
    }

    const sent = await onSend(trimmedMessage);

    if (sent !== false) {
      setMessage("");
    }
  };

  const handleTextareaKeyDown = (event) => {
    if (event.key !== "Enter" || event.shiftKey) {
      return;
    }

    event.preventDefault();
    event.currentTarget.form?.requestSubmit();
  };

  const handleUpload = async (event) => {
    const file = event.target.files?.[0];

    if (file) {
      setSelectedFile(file);
    }

    event.target.value = "";
  };

  const handleRemoveSelectedFile = () => {
    setSelectedFile(null);
  };

  return (
    <Backdrop onClick={onClose}>
      <ModalPanel
        aria-modal="true"
        aria-label="실시간 현장 톡 모달"
        onClick={(event) => event.stopPropagation()}
        role="dialog"
      >
        <Header>
          <HeaderInfo>
            <LiveDot aria-hidden="true" />
            <Title>실시간 현장 톡</Title>
            {formattedParticipantCount && (
              <StatusText>현장 인원 {formattedParticipantCount}명</StatusText>
            )}
          </HeaderInfo>
          <CloseButton
            aria-label="실시간 현장 톡 닫기"
            onClick={onClose}
            type="button"
          >
            <X size={22} />
          </CloseButton>
        </Header>

        <AiBoard>
          <AiLabel>
            <AiDot aria-hidden="true" />
            AI 실시간 현장 요약
          </AiLabel>
          <AiSummary>&quot;{aiSummary}&quot;</AiSummary>
        </AiBoard>

        <ChatBody ref={chatBodyRef}>
          {messages.length > 0 ? messages.map((chat) => (
            <ChatRow $isMine={chat.isMine} key={chat.id}>
              {chat.avatar ? (
                <Avatar alt="" src={chat.avatar} />
              ) : (
                <Avatar as="div" aria-hidden="true">
                  {(chat.author || "익").slice(0, 1)}
                </Avatar>
              )}
              <ChatMeta $isMine={chat.isMine}>
                <div>
                  <ChatName $isMine={chat.isMine}>{chat.author}</ChatName>
                  <span>{chat.time}</span>
                </div>
                <ChatBubble $isMine={chat.isMine}>
                  {chat.text && <p>{chat.text}</p>}
                  {chat.image && <PhotoPreview alt="" src={chat.image} />}
                </ChatBubble>
              </ChatMeta>
            </ChatRow>
          )) : (
            <SystemNotice>아직 실시간 톡 메시지가 없습니다.</SystemNotice>
          )}

          <SystemNotice>
            {statusMessage || "쾌적한 채팅을 위해 비속어 사용을 자제해주세요."}
          </SystemNotice>
        </ChatBody>

        <Footer>
          <Composer onSubmit={handleSubmit}>
            <ComposerBox>
              <UploadButton
                aria-label="사진 업로드"
                disabled={!canSend || isUploading}
                onClick={() => fileInputRef.current?.click()}
                type="button"
              >
                <ImagePlus size={24} />
              </UploadButton>
              <InputArea>
                <Textarea
                  disabled={!canSend || isUploading}
                  onChange={(event) => setMessage(event.target.value)}
                  onKeyDown={handleTextareaKeyDown}
                  placeholder={
                    isUploading
                      ? "이미지를 업로드하는 중입니다."
                      : selectedFile
                        ? "사진과 함께 보낼 메시지를 입력하세요..."
                        : placeholder
                  }
                  rows={1}
                  value={message}
                />
              </InputArea>
              <SendButton
                aria-label="메시지 보내기"
                disabled={!canSend || isUploading || (!message.trim() && !selectedFile)}
                type="submit"
              >
                <Send size={22} fill="currentColor" />
              </SendButton>
            </ComposerBox>
            {selectedFile && (
              <SelectedPhoto>
                {selectedImagePreview && (
                  <SelectedPhotoPreview alt="" src={selectedImagePreview} />
                )}
                <SelectedPhotoInfo>
                  <strong>{selectedFile.name}</strong>
                  <span>전송 버튼을 누르면 사진이 올라갑니다.</span>
                </SelectedPhotoInfo>
                <RemovePhotoButton
                  aria-label="선택한 사진 제거"
                  disabled={isUploading}
                  onClick={handleRemoveSelectedFile}
                  type="button"
                >
                  <X size={16} />
                </RemovePhotoButton>
              </SelectedPhoto>
            )}
            <input
              accept="image/*"
              hidden
              onChange={handleUpload}
              ref={fileInputRef}
              type="file"
            />
          </Composer>

          <QuickChipList>
            {QUICK_CHIPS.map((chip) => (
              <QuickChip
                disabled={!canSend || isUploading}
                key={chip}
                onClick={() => setMessage(chip)}
                type="button"
              >
                {chip}
              </QuickChip>
            ))}
          </QuickChipList>
        </Footer>
      </ModalPanel>
    </Backdrop>
  );
}

export default RealTimeTalkModal;
