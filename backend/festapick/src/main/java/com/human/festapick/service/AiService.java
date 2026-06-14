package com.human.festapick.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.google.genai.Client;
import com.google.genai.types.GenerateContentResponse;
import com.human.festapick.constant.ChatMessageType;
import com.human.festapick.constant.FestivalStatus;
import com.human.festapick.dto.response.AiAnswerResDto;
import com.human.festapick.dto.response.AiRecommendationResDto;
import com.human.festapick.dto.response.FestivalInfoResponseDto;
import com.human.festapick.entity.ChatMessages;
import com.human.festapick.entity.Festivals;
import com.human.festapick.repository.ChatMessageRepository;
import com.human.festapick.repository.FestivalRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.ObjectProvider;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Slice;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;

@Service
@RequiredArgsConstructor
@Transactional
public class AiService {

    /*
     * GeminiConfig에서 Client Bean을 만들면 여기로 주입됨.
     *
     * ObjectProvider<Client>를 쓰는 이유:
     * - 아직 GeminiConfig가 완성되지 않았거나
     * - Client Bean이 등록되지 않았을 때
     * 서버 실행 자체가 바로 터지는 걸 방지하기 위함.
     */
    private final ObjectProvider<Client> geminiClientProvider;

    /*
     * 실시간 현장톡 메시지를 조회하기 위한 Repository.
     * AI 현장 요약 기능에서 최근 채팅 메시지를 가져올 때 사용.
     */
    private final ChatMessageRepository chatMessageRepository;

    /*
     * 축제 정보를 DB에서 가져오기 위한 Repository.
     * AI 추천 채팅에서 Gemini에게 제공할 축제 목록을 조회할 때 사용.
     */
    private final FestivalRepository festivalRepository;

    private final ObjectMapper objectMapper;

    /*
     * application.properties에 있는 gemini.model 값을 가져옴.
     *
     * 예:
     * gemini.model=gemini-2.5-flash
     *
     * 만약 설정값이 없으면 기본값으로 gemini-2.5-flash 사용.
     */
    @Value("${gemini.model:gemini-2.5-flash}")
    private String model;

    /**
     * AI 질문 전송
     *
     * 사용 예:
     * - 사용자가 AI 추천 페이지에서 질문 입력
     * - "이번 주말 서울에서 갈만한 축제 추천해줘"
     *
     * 동작 흐름:
     * 1. 사용자 질문을 받음
     * 2. DB에서 축제 목록을 가져옴
     * 3. 축제 목록을 Gemini가 읽을 수 있는 문자열로 변환
     * 4. Gemini에게 사용자 질문 + 축제정보 + 응답 JSON 형태를 전달
     * 5. Gemini가 고른 축제 ID로 DB 축제 정보를 다시 조회해서 반환
     */
    @Transactional(readOnly = true)
    public AiRecommendationResDto sendQuestion(String question) {

        if (question == null || question.isBlank()) {
            return AiRecommendationResDto.builder()
                    .message("질문을 입력해 주세요.")
                    .festivals(List.of())
                    .build();
        }

        /*
         * DB에서 축제 정보 가져오기
         *
         * festivalRepository.findAll()
         * - festivals 테이블의 전체 축제를 가져옴.
         *
         * filter(festival -> festival.getStatus() == FestivalStatus.ACTIVE)
         * - 그중 ACTIVE 상태인 축제만 사용.
         *
         * limit(30)
         * - Gemini에게 너무 많은 축제를 보내면 프롬프트가 길어지므로 우선 30개만 사용.
         *
         * 나중에 추천 품질을 높이려면 findAll() 대신
         * 지역/키워드/인기순 검색 Repository 메서드로 바꾸는 게 좋음.
         */
        List<Festivals> festivals = festivalRepository.findAll()
                .stream()
                .filter(festival -> festival.getStatus() == FestivalStatus.ACTIVE)
                .limit(30)
                .toList();

        /*
         * DB에서 가져온 축제 목록을 Gemini가 읽을 수 있는 텍스트로 변환.
         *
         * Gemini는 Java 객체인 Festivals를 직접 이해하는 게 아니라,
         * 아래처럼 "축제ID: 1, 축제명: ..." 형태의 문자열을 읽고 판단함.
         */
        String festivalInfo = festivals.stream()
                .map(festival -> """
                        축제ID: %s
                        축제명: %s
                        주소: %s
                        시작일: %s
                        종료일: %s
                        축제유형: %s
                        설명: %s
                        """.formatted(
                        festival.getFestivalId(),
                        festival.getTitle(),
                        festival.getAddr1(),
                        festival.getEventStartDate(),
                        festival.getEventEndDate(),
                        festival.getFestivalType(),
                        festival.getDescription()
                ))
                .toList()
                .toString();

        /*
         * Gemini에게 보낼 최종 프롬프트.
         *
         * 핵심:
         * - 사용자의 질문을 같이 보냄.
         * - DB에서 가져온 축제정보를 같이 보냄.
         * - Gemini가 아무 형식으로 답하지 않도록 JSON 응답 형태를 지정함.
         *
         * festivalIds만 받는 이유:
         * - 카드에 필요한 진짜 축제 정보는 DB에서 가져오는 게 안전함.
         * - Gemini가 축제명/이미지/주소를 새로 만들게 하면 틀릴 수 있음.
         */
        String prompt = """
                너는 FestaPick의 AI 축제 추천 도우미야.
                사용자의 질문에 맞는 축제를 아래 축제정보 안에서만 골라서 추천해줘.

                사용자 질문:
                %s

                축제정보:
                %s

                응답형태(Json):
                {
                  "message": "사용자에게 보여줄 친절한 추천 문장",
                  "festivalIds": [추천할 축제ID 3개]
                }

                응답 조건:
                1. 반드시 위 축제정보 안에 있는 축제만 추천해.
                2. 없는 축제는 절대 만들지 마.
                3. festivalIds에는 위 축제정보에 있는 축제ID만 넣어.
                4. 추천 축제는 최대 3개만 골라.
                5. JSON 형태만 응답해.
                """.formatted(question, festivalInfo);

        String aiResponse = askGemini(prompt);
        return toRecommendationResponse(aiResponse);
    }

    private AiRecommendationResDto toRecommendationResponse(String aiResponse) {
        try {
            JsonNode root = objectMapper.readTree(extractJson(aiResponse));
            String message = root.path("message").asText("");
            List<Long> festivalIds = extractFestivalIds(root.path("festivalIds"));

            Map<Long, Festivals> festivalMap = new LinkedHashMap<>();
            festivalRepository.findAllById(festivalIds).stream()
                    .filter(festival -> festival.getStatus() == FestivalStatus.ACTIVE)
                    .forEach(festival -> festivalMap.put(festival.getFestivalId(), festival));

            List<FestivalInfoResponseDto> recommendedFestivals = festivalIds.stream()
                    .map(festivalMap::get)
                    .filter(Objects::nonNull)
                    .map(this::toFestivalInfoResponseDto)
                    .toList();

            return AiRecommendationResDto.builder()
                    .message(message)
                    .festivals(recommendedFestivals)
                    .build();
        } catch (JsonProcessingException e) {
            return AiRecommendationResDto.builder()
                    .message(aiResponse)
                    .festivals(List.of())
                    .build();
        }
    }

    private String extractJson(String response) {
        String safeResponse = response == null ? "" : response.trim();
        int start = safeResponse.indexOf('{');
        int end = safeResponse.lastIndexOf('}');

        if (start >= 0 && end > start) {
            return safeResponse.substring(start, end + 1);
        }
        return safeResponse;
    }

    private List<Long> extractFestivalIds(JsonNode festivalIdsNode) {
        if (!festivalIdsNode.isArray()) {
            return List.of();
        }

        List<Long> festivalIds = new java.util.ArrayList<>();
        festivalIdsNode.forEach(node -> {
            if (node.canConvertToLong()) {
                festivalIds.add(node.asLong());
            }
        });
        return festivalIds;
    }

    private FestivalInfoResponseDto toFestivalInfoResponseDto(Festivals festival) {
        return FestivalInfoResponseDto.builder()
                .festivalId(festival.getFestivalId())
                .contentId(festival.getContentId())
                .title(festival.getTitle())
                .categoryName(resolveCategoryName(festival))
                .firstImage(festival.getFirstImage())
                .addr1(festival.getAddr1())
                .addr2(festival.getAddr2())
                .eventStartDate(festival.getEventStartDate())
                .eventEndDate(festival.getEventEndDate())
                .averageRating(festival.getAverageRating())
                .liveCount(0L)
                .favoriteCount(defaultLong(festival.getFavoriteCount()))
                .likeCount(defaultLong(festival.getLikeCount()))
                .reviewCount(defaultLong(festival.getReviewCount()))
                .status(festival.getStatus() == null ? null : festival.getStatus().name())
                .build();
    }

    private String resolveCategoryName(Festivals festival) {
        if (festival.getFestivalType() != null && !festival.getFestivalType().isBlank()) {
            return festival.getFestivalType();
        }
        return festival.getLclsSystm3();
    }

    private Long defaultLong(Long value) {
        return value == null ? 0L : value;
    }

    /**
     * AI 현장 상황 조회
     *
     * 축제 상세 페이지의 실시간 현장톡 메시지를 AI가 요약하는 기능.
     *
     * 예:
     * - "입구 줄이 길어요"
     * - "메인 스테이지 사람 많아요"
     * - "푸드존 대기 20분이에요"
     *
     * 위 메시지들을 모아서:
     * - 현재 혼잡도
     * - 대기줄
     * - 인기 구역
     * - 주의사항
     * 등을 1~2문장으로 요약.
     */
    @Transactional(readOnly = true)
    public AiAnswerResDto getAiFieldSummary(Long chatRoomId) {

        if (chatRoomId == null) {
            throw new IllegalArgumentException("채팅방 ID가 필요합니다.");
        }

        /*
         * 해당 채팅방의 최근 메시지 30개 조회.
         *
         * findByChatRoom_ChatRoomIdOrderByCreatedAtDesc
         * - chatRoomId 기준으로 메시지 조회
         * - createdAt 기준 최신순 정렬
         */
        Slice<ChatMessages> recentMessages =
                chatMessageRepository.findByChatRoom_ChatRoomIdOrderByCreatedAtDesc(
                        chatRoomId,
                        PageRequest.of(0, 30)
                );

        /*
         * ChatMessages 엔티티 목록에서 message 문자열만 꺼냄.
         * null이거나 공백인 메시지는 제외.
         */
        List<String> messages = recentMessages.getContent()
                .stream()
                .map(ChatMessages::getMessage)
                .filter(message -> message != null && !message.isBlank())
                .toList();

        if (messages.isEmpty()) {
            return AiAnswerResDto.builder()
                    .chatRoomId(chatRoomId)
                    .message("아직 요약할 현장톡 메시지가 없습니다.")
                    .messageType(ChatMessageType.AI_NOTICE)
                    .createdAt(LocalDateTime.now())
                    .build();
        }

        /*
         * 여러 개의 채팅 메시지를 줄바꿈으로 합쳐서 하나의 문자열로 만듦.
         * Gemini에게 한 번에 보내기 위한 작업.
         */
        String joinedMessages = String.join("\n", messages);

        /*
         * Gemini에게 현장톡 메시지를 요약해달라고 요청하는 프롬프트.
         */
        String prompt = """
                너는 축제 현장 상황을 요약하는 AI야.

                아래는 실시간 현장톡 메시지들이야.

                %s

                위 메시지를 보고 현재 현장 상황을 1~2문장으로 요약해줘.
                대기줄, 혼잡도, 인기 구역, 주의사항이 있으면 포함해줘.
                """.formatted(joinedMessages);

        String summary = askGemini(prompt);

        return AiAnswerResDto.builder()
                .chatRoomId(chatRoomId)
                .message(summary)
                .messageType(ChatMessageType.AI_NOTICE)
                .createdAt(LocalDateTime.now())
                .build();
    }

    /**
     * Gemini API 실제 호출 메서드.
     *
     * private으로 둔 이유:
     * - 외부 Controller에서 직접 Gemini를 호출하지 못하게 하기 위해
     * - AiService 내부 기능들이 공통으로 사용하도록 하기 위해
     */
    private String askGemini(String prompt) {

        Client client = geminiClientProvider.getIfAvailable();

        if (client == null) {
            return "Gemini 설정이 아직 연결되지 않았습니다.";
        }

        GenerateContentResponse response =
                client.models.generateContent(
                        model,
                        prompt,
                        null
                );

        return response.text();
    }
}
