import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  Baby,
  CalendarDays,
  ForkKnife,
  MapPin,
  Moon,
  Send,
  Sparkles,
} from "lucide-react";
import AxiosApi from "../../api/AxiosApi";
import { useAuth } from "../../context/AuthContext";
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

const nearbyKeywords = ["내 주변", "주변", "근처", "가까운"];

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

const fallbackImage =
  "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=900&q=80";

const formatDateText = (date) => {
  if (!date) {
    return "";
  }

  const [, month, day] = String(date).split("-");
  return month && day ? `${month}.${day}` : String(date);
};

const formatFestivalPeriod = (festival) => {
  const startText = formatDateText(festival.eventStartDate);
  const endText = formatDateText(festival.eventEndDate);

  if (startText && endText) {
    return `${startText} - ${endText}`;
  }

  return startText || endText || "";
};

const getFestivalRegion = (festival) => {
  return [festival.addr1, festival.addr2].filter(Boolean).join(" ");
};

const normalizeFestival = (festival, index) => {
  const id = festival.festivalId || `ai-festival-${index}`;

  const title = festival.title || festival.name || "축제 정보";
  const location = getFestivalRegion(festival);
  const date = formatFestivalPeriod(festival);

  return {
    ...festival,
    id,
    festivalId: festival.festivalId || id,
    name: title,
    title,
    location,
    venue: location,
    date,
    period: date,
    image: festival.firstImage || fallbackImage,
    reason:
      festival.reason ||
      festival.recommendReason ||
      "AI가 입력하신 조건과 어울리는 축제로 추천했어요.",
  };
};

const getResponseData = (response) =>
  response?.data?.data ?? response?.data ?? {};

const isNearbyPrompt = (prompt) =>
  nearbyKeywords.some((keyword) => prompt.includes(keyword));

const hasRegionCode = (regionContext) =>
  Boolean(regionContext.ldongRegnCd || regionContext.ldongSignguCd);

function AiRecommendPage() {
  const auth = useAuth() || {};
  const user = auth.user || {};
  const [inputValue, setInputValue] = useState("");
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const hasMessages = messages.length > 0;
  const placeholder = "예: 이번 주말 서울에서 갈만한 축제 추천해줘";

  const getFestivalLink = (festival) => ({
    to: `/detail/${festival.festivalId || festival.id}`,
    state: {
      festival: {
        ...festival,
        title: festival.title || festival.name,
        name: festival.name || festival.title,
        venue: festival.venue || festival.location,
        location: festival.location || festival.venue,
      },
    },
  });

  const getStoredValue = (key) => {
    if (typeof window === "undefined") {
      return "";
    }

    return localStorage.getItem(key) || "";
  };

  const getRegionContext = () => ({
    ldongRegnCd: user.ldongRegnCd || getStoredValue("ldongRegnCd"),
    ldongSignguCd: user.ldongSignguCd || getStoredValue("ldongSignguCd"),
    regionName:
      user.regionName ||
      user.region ||
      user.userRegion ||
      user.address ||
      getStoredValue("userRegion") ||
      getStoredValue("region") ||
      getStoredValue("address"),
  });

  const insertAiMessageAfter = (userMessageId, aiMessageData) => {
    setMessages((prevMessages) => {
      const userMessageIndex = prevMessages.findIndex(
        (message) => message.id === userMessageId,
      );

      if (userMessageIndex < 0) {
        return [aiMessageData, ...prevMessages];
      }

      return [
        ...prevMessages.slice(0, userMessageIndex + 1),
        aiMessageData,
        ...prevMessages.slice(userMessageIndex + 1),
      ];
    });
  };

  const addRecommendation = async (prompt) => {
    const trimmedPrompt = prompt.trim();

    if (!trimmedPrompt || isLoading) {
      return;
    }

    const userMessageId = Date.now();

    setMessages((prevMessages) => [
      {
        id: userMessageId,
        type: "user",
        text: trimmedPrompt,
      },
      ...prevMessages,
    ]);

    setInputValue("");

    const regionContext = getRegionContext();

    if (isNearbyPrompt(trimmedPrompt) && !hasRegionCode(regionContext)) {
      insertAiMessageAfter(userMessageId, {
        id: Date.now() + 1,
        type: "ai",
        text: "관심 지역을 설정하면 주변 축제를 추천받을 수 있어요.",
        festivals: [],
      });
      return;
    }

    setIsLoading(true);

    try {
      const response = await AxiosApi.sendQuestion(trimmedPrompt, regionContext);
      const data = getResponseData(response);

      const aiMessage =
        data.message ||
        response.data?.message ||
        "입력하신 조건에 맞는 축제를 추천해드릴게요.";

      const festivals = Array.isArray(data.festivals)
        ? data.festivals.map(normalizeFestival)
        : [];

      insertAiMessageAfter(userMessageId, {
        id: Date.now() + 1,
        type: "ai",
        text: aiMessage,
        festivals,
      });
    } catch (error) {
      console.error("AI 축제 추천 요청 실패:", error);

      insertAiMessageAfter(userMessageId, {
        id: Date.now() + 1,
        type: "ai",
        text:
          error.response?.data?.message ||
          "AI 추천을 불러오지 못했어요. 잠시 후 다시 시도해주세요.",
        festivals: [],
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    addRecommendation(inputValue);
  };

  const handleQuickPrompt = (prompt) => {
    addRecommendation(prompt.replaceAll('"', ""));
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
            disabled={isLoading}
          />
          <SendButton
            type="submit"
            aria-label="추천 요청 보내기"
            disabled={isLoading}
          >
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
            disabled={isLoading}
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
          {messages.map((message, index) => (
            <React.Fragment key={message.id}>
              {message.type === "user" ? (
                <UserMessage>
                  <ChatBubble $type="user">{message.text}</ChatBubble>
                </UserMessage>
              ) : (
                <ResultGroup>
                  <AiAvatar aria-hidden="true">
                    <Sparkles size={22} />
                  </AiAvatar>
                  <div>
                    <ChatBubble $type="ai">{message.text}</ChatBubble>

                    {message.festivals?.length > 0 && (
                      <RecommendationGrid>
                        {message.festivals.map((festival) => (
                          <FestivalCard key={festival.id}>
                            <FestivalImage src={festival.image} alt="" />
                            <FestivalInfo>
                              <h3>{festival.name}</h3>
                              <FestivalMeta>
                                <span>
                                  <MapPin size={15} aria-hidden="true" />
                                  {festival.location || "위치 정보 없음"}
                                </span>
                                <span>
                                  <CalendarDays size={15} aria-hidden="true" />
                                  {festival.date || "일정 정보 없음"}
                                </span>
                              </FestivalMeta>
                              <FestivalReason>
                                <strong>
                                  <Sparkles size={15} aria-hidden="true" />
                                  추천 이유
                                </strong>
                                <p>{festival.reason}</p>
                              </FestivalReason>
                              <Link
                                to={getFestivalLink(festival).to}
                                state={getFestivalLink(festival).state}
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                상세보기
                              </Link>
                            </FestivalInfo>
                          </FestivalCard>
                        ))}
                      </RecommendationGrid>
                    )}
                  </div>
                </ResultGroup>
              )}

              {isLoading && index === 0 && message.type === "user" && (
                <ResultGroup>
                  <AiAvatar aria-hidden="true">
                    <Sparkles size={22} />
                  </AiAvatar>
                  <ChatBubble $type="ai">
                    추천 축제를 고르고 있어요...
                  </ChatBubble>
                </ResultGroup>
              )}
            </React.Fragment>
          ))}
        </ChatArea>
      )}
    </PageContainer>
  );
}

export default AiRecommendPage;
