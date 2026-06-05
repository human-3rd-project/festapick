import React, { useMemo, useRef, useState } from "react";
import {
  Baby,
  CalendarDays,
  ForkKnife,
  MapPin,
  Moon,
  Send,
  Sparkles,
} from "lucide-react";
import {
  AiAvatar,
  ChatArea,
  ChatBubble,
  EmptyCard,
  EmptyCardIcon,
  EmptyGrid,
  EmptyIcon,
  EmptyState,
  ExampleMeta,
  FestivalCard,
  FestivalImage,
  FestivalInfo,
  FestivalMeta,
  FestivalReason,
  FormShell,
  Input,
  InputIcon,
  InputRow,
  PageContainer,
  PageHeader,
  QuickButton,
  QuickButtons,
  RecommendationGrid,
  ResultGroup,
  SendButton,
  UserMessage,
} from "./AiRecommendPageCss";

const quickPrompts = [
  "내 주변 축제 추천",
  "아이와 가기 좋은 축제",
  "음식 축제 추천",
  "야간 축제 추천",
];

const examplePrompts = [
  {
    icon: CalendarDays,
    title: '"이번 주말 서울에서 갈만한 축제 추천해줘"',
    meta: "#서울 #주말 #데이트",
  },
  {
    icon: Baby,
    title: '"아이와 가기 좋은 축제 알려줘"',
    meta: "#가족 #키즈 #나들이",
  },
  {
    icon: ForkKnife,
    title: '"음식 축제 추천해줘"',
    meta: "#미식 #야시장 #디저트",
  },
  {
    icon: Moon,
    title: '"야간에 즐길 수 있는 축제 추천해줘"',
    meta: "#조명 #심야 #야경",
  },
];

const festivalRecommendations = [
  {
    id: 1,
    name: "서울 불빛 판타지",
    location: "반포 한강공원",
    date: "11.23 - 11.24",
    reason:
      "한강의 야경과 초대형 라이트 아트가 어우러져 로맨틱한 분위기를 선사합니다.",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDxEEFpPJPEZq4STMAj-kQInQ8AWwRK-HF7XlgHOYCYV8FIR1QEL6oiETr725kVNS1H23Kkj5NxEqOxKYI-Cye9okybmCEiPN_HIqDibXnZADhp83CP-Q0Zbtd333Ip8oWktjHgAYhtU-nv7QnqEW59RlGVcHg5ue1VrN_OKunOB0Gr61ivZjTgerBXn7s_FPUzhEB_l2dYTqGEkI6bFJ1_uNvq40ngfJMVp3nBP1QbGzYfwmri9CBZTDNX8V3JwYRw65pAXmqefw",
  },
  {
    id: 2,
    name: "DDP 루미나리에",
    location: "동대문 DDP",
    date: "11.22 - 11.30",
    reason:
      "DDP 외벽에 펼쳐지는 미디어 파사드가 환상적인 사진 스팟이 되어줍니다.",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuD-W3VEbQYO5YngMfRogwqHaFllbEf6cwht-lSnc4g33mYpcj2JlQzS56qL7aeeMu4c0omiQpNNj9f7Wv6qqcuHObKSyyYbklAgsfxySF_pY2o_TI7i3UCxocHZGy1qMY0LLaTT1xWXb7cO7xYPtz9diC8KDhLs2R8vREjse7puWOARpXYiFBRoAmnnny7ev2-UpWy0pwmYA3nCEuKZRUcPZXd3xQiSgsUKEcxlGLokhGb8ffsGznwTXScfAp1btdKtlRxr4bGbhA",
  },
  {
    id: 3,
    name: "경복궁 별빛야행",
    location: "경복궁",
    date: "11.15 - 12.01",
    reason:
      "고궁의 고즈넉함과 화려한 조명이 어우러져 한국적인 밤 산책을 즐기기 좋습니다.",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBQgr2HfkOqtGTxwLlFCt9-g76NjX43kJUgrYVVEN1sb9zghLpXeyDDX6wxIZVWoMzhBblVe7qCPraiiD8VZodDyEyzRCrgiSwEs3cN9MhFwHkV4raAja-khLFsqDxuFoAu5tw6z5vLyWkX821jo79VDD_1a5QwSS0z4y8yTjh72wo9CXl-pNiAs3mRePe3X-2EFZ5I7EJDFW8zfMtmChJPg_J7jrr945GwyjIZW36n19OvnrAZr62xbXVcIwduarRE0jwApRkWAQ",
  },
];

function AiRecommendPage() {
  const [inputValue, setInputValue] = useState("");
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const pendingTimer = useRef(null);

  const hasMessages = messages.length > 0;
  const placeholder = useMemo(
    () => "예: 이번 주말 서울에서 갈만한 축제 추천해줘",
    [],
  );

  const addRecommendation = (prompt) => {
    const trimmedPrompt = prompt.trim();

    if (!trimmedPrompt || isLoading) {
      return;
    }

    if (pendingTimer.current) {
      window.clearTimeout(pendingTimer.current);
    }

    setMessages((prevMessages) => [
      ...prevMessages,
      { id: Date.now(), type: "user", text: trimmedPrompt },
    ]);
    setInputValue("");
    setIsLoading(true);

    pendingTimer.current = window.setTimeout(() => {
      setMessages((prevMessages) => [
        ...prevMessages,
        {
          id: Date.now() + 1,
          type: "ai",
          text: "좋아요! 입력하신 조건에 맞춰 지금 즐기기 좋은 축제 3곳을 골라봤어요. 일정과 분위기를 함께 비교해보세요.",
        },
      ]);
      setIsLoading(false);
      pendingTimer.current = null;
    }, 500);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    addRecommendation(inputValue);
  };

  const handleQuickPrompt = (prompt) => {
    addRecommendation(prompt);
  };

  return (
    <PageContainer>
      <PageHeader>
        <h1>AI 축제 추천</h1>
        <p>원하는 지역, 분위기, 일정에 맞춰 AI가 축제를 추천해드려요.</p>
      </PageHeader>

      <FormShell onSubmit={handleSubmit}>
        <InputRow>
          <InputIcon aria-hidden="true">
            <Sparkles size={22} />
          </InputIcon>
          <Input
            value={inputValue}
            onChange={(event) => setInputValue(event.target.value)}
            placeholder={placeholder}
            aria-label="AI 축제 추천 입력"
          />
          <SendButton type="submit" aria-label="추천 요청 보내기">
            <Send size={20} aria-hidden="true" />
          </SendButton>
        </InputRow>
      </FormShell>

      <QuickButtons aria-label="빠른 추천">
        {quickPrompts.map((prompt) => (
          <QuickButton
            key={prompt}
            type="button"
            onClick={() => handleQuickPrompt(prompt)}
          >
            {prompt}
          </QuickButton>
        ))}
      </QuickButtons>

      {!hasMessages && !isLoading && (
        <EmptyState>
          <EmptyIcon aria-hidden="true">
            <Sparkles size={52} />
          </EmptyIcon>
          <h2>어떤 축제를 찾고 계신가요?</h2>
          <p>지역, 일정, 분위기를 입력하면 AI가 맞춤 축제를 추천해드려요.</p>
          <EmptyGrid>
            {examplePrompts.map((prompt) => {
              const Icon = prompt.icon;

              return (
                <EmptyCard
                  key={prompt.title}
                  type="button"
                  onClick={() => handleQuickPrompt(prompt.title)}
                >
                  <EmptyCardIcon aria-hidden="true">
                    <Icon size={22} />
                  </EmptyCardIcon>
                  <div>
                    <strong>{prompt.title}</strong>
                    <ExampleMeta>{prompt.meta}</ExampleMeta>
                  </div>
                </EmptyCard>
              );
            })}
          </EmptyGrid>
        </EmptyState>
      )}

      {(hasMessages || isLoading) && (
        <ChatArea>
          {messages.map((message) =>
            message.type === "user" ? (
              <UserMessage key={message.id}>
                <ChatBubble $type="user">{message.text}</ChatBubble>
              </UserMessage>
            ) : (
              <ResultGroup key={message.id}>
                <AiAvatar aria-hidden="true">
                  <Sparkles size={22} />
                </AiAvatar>
                <div>
                  <ChatBubble $type="ai">{message.text}</ChatBubble>
                  <RecommendationGrid>
                    {festivalRecommendations.map((festival) => (
                      <FestivalCard key={festival.id}>
                        <FestivalImage src={festival.image} alt="" />
                        <FestivalInfo>
                          <h3>{festival.name}</h3>
                          <FestivalMeta>
                            <span>
                              <MapPin size={15} aria-hidden="true" />
                              {festival.location}
                            </span>
                            <span>
                              <CalendarDays size={15} aria-hidden="true" />
                              {festival.date}
                            </span>
                          </FestivalMeta>
                          <FestivalReason>
                            <strong>
                              <Sparkles size={15} aria-hidden="true" />
                              추천 이유
                            </strong>
                            <p>{festival.reason}</p>
                          </FestivalReason>
                          <a href="/">상세보기</a>
                        </FestivalInfo>
                      </FestivalCard>
                    ))}
                  </RecommendationGrid>
                </div>
              </ResultGroup>
            ),
          )}

          {isLoading && (
            <ResultGroup>
              <AiAvatar aria-hidden="true">
                <Sparkles size={22} />
              </AiAvatar>
              <ChatBubble $type="ai">추천 축제를 고르고 있어요...</ChatBubble>
            </ResultGroup>
          )}
        </ChatArea>
      )}
    </PageContainer>
  );
}

export default AiRecommendPage;
