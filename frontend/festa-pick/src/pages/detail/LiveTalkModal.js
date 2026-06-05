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
  SendButton,
  StatusText,
  SystemNotice,
  Textarea,
  Title,
  UploadButton,
} from "./LiveTalkModalCss";

const DEFAULT_SUMMARY =
  "현재 현장은 입구 대기 줄이 약 15분 정도로 짧습니다. 메인 스테이지 근처는 이미 열기가 뜨거우며, F&B 존에서는 '네온 에이드'가 가장 인기 있는 메뉴로 꼽히고 있습니다.";

const DEFAULT_MESSAGES = [
  {
    id: 1,
    author: "DJ 루나",
    time: "오후 10:24",
    text: "지금 분위기 완전 미쳤어요! 메인 스테이지로 다들 모이세요!",
    image:
      "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?auto=format&fit=crop&w=900&q=80",
    avatar:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=160&q=80",
  },
  {
    id: 2,
    author: "나",
    time: "오후 10:25",
    text: "맥주 부스 줄 엄청 기네요... 그래도 음악이 좋아서 참을만함!",
    isMine: true,
    avatar:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=160&q=80",
  },
  {
    id: 3,
    author: "페스타러버",
    time: "오후 10:26",
    text: "혹시 B구역 근처에 계신 분? 보조배터리 빌려주실 수 있나요?",
    avatar:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=160&q=80",
  },
];

const QUICK_CHIPS = ["분위기 대박", "인증샷!", "친구 구함", "푸드존 후기"];

function RealTimeTalkModal({
  isOpen = true,
  onClose,
  messages = DEFAULT_MESSAGES,
  onSend,
  onUploadPhoto,
  aiSummary = DEFAULT_SUMMARY,
  participantCount = 1248,
}) {
  const [message, setMessage] = useState("");
  const chatBodyRef = useRef(null);
  const fileInputRef = useRef(null);

  const formattedParticipantCount = useMemo(
    () => Number(participantCount || 0).toLocaleString("ko-KR"),
    [participantCount],
  );

  useEffect(() => {
    if (isOpen && chatBodyRef.current) {
      chatBodyRef.current.scrollTop = chatBodyRef.current.scrollHeight;
    }
  }, [isOpen, messages]);

  if (!isOpen) {
    return null;
  }

  const handleSubmit = (event) => {
    event.preventDefault();

    const trimmedMessage = message.trim();
    if (!trimmedMessage) {
      return;
    }

    if (onSend) {
      onSend(trimmedMessage);
    }

    setMessage("");
  };

  const handleUpload = (event) => {
    const file = event.target.files?.[0];

    if (file && onUploadPhoto) {
      onUploadPhoto(file);
    }

    event.target.value = "";
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
            <StatusText>현장 인원 {formattedParticipantCount}명</StatusText>
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
          {messages.map((chat) => (
            <ChatRow $isMine={chat.isMine} key={chat.id}>
              <Avatar alt="" src={chat.avatar} />
              <ChatMeta $isMine={chat.isMine}>
                <div>
                  <ChatName $isMine={chat.isMine}>{chat.author}</ChatName>
                  <span>{chat.time}</span>
                </div>
                <ChatBubble $isMine={chat.isMine}>
                  <p>{chat.text}</p>
                  {chat.image && <PhotoPreview alt="" src={chat.image} />}
                </ChatBubble>
              </ChatMeta>
            </ChatRow>
          ))}

          <SystemNotice>
            쾌적한 채팅을 위해 비속어 사용을 자제해주세요.
          </SystemNotice>
        </ChatBody>

        <Footer>
          <Composer onSubmit={handleSubmit}>
            <ComposerBox>
              <UploadButton
                aria-label="사진 업로드"
                onClick={() => fileInputRef.current?.click()}
                type="button"
              >
                <ImagePlus size={24} />
              </UploadButton>
              <InputArea>
                <Textarea
                  onChange={(event) => setMessage(event.target.value)}
                  placeholder="현장 메시지를 입력하세요..."
                  rows={1}
                  value={message}
                />
              </InputArea>
              <SendButton aria-label="메시지 보내기" type="submit">
                <Send size={22} fill="currentColor" />
              </SendButton>
            </ComposerBox>
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
