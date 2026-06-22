package com.human.festapick.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.google.genai.Client;
import com.google.genai.types.GenerateContentResponse;
import com.human.festapick.constant.ChatMessageType;
import com.human.festapick.constant.FestivalStatus;
import com.human.festapick.constant.OAuthProvider;
import com.human.festapick.constant.UserRole;
import com.human.festapick.constant.UserStatus;
import com.human.festapick.dto.request.AiQuestionReqDto;
import com.human.festapick.dto.response.AiAnswerResDto;
import com.human.festapick.dto.response.AiRecommendationResDto;
import com.human.festapick.dto.response.FestivalInfoResponseDto;
import com.human.festapick.entity.ChatMessages;
import com.human.festapick.entity.ChatRooms;
import com.human.festapick.entity.Festivals;
import com.human.festapick.entity.Users;
import com.human.festapick.exception.CustomException;
import com.human.festapick.repository.ChatMessageRepository;
import com.human.festapick.repository.ChatRoomRepository;
import com.human.festapick.repository.FestivalRepository;
import com.human.festapick.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.ObjectProvider;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Slice;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Transactional
public class AiService {

    private static final String AI_SYSTEM_LOGIN_ID = "festapick_ai";
    private static final String AI_SYSTEM_EMAIL = "festapick_ai@festapick.local";
    private static final String AI_SYSTEM_NICKNAME = "FestaPick AI";
    private static final List<ChatMessageType> SUMMARY_SOURCE_MESSAGE_TYPES = List.of(
            ChatMessageType.CHAT,
            ChatMessageType.IMAGE
    );

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

    private final ChatRoomRepository chatRoomRepository;

    private final UserRepository userRepository;

    /*
     * 축제 정보를 DB에서 가져오기 위한 Repository.
     * AI 추천 채팅에서 Gemini에게 제공할 축제 목록을 조회할 때 사용.
     */
    private final FestivalRepository festivalRepository;

    private final ObjectMapper objectMapper;

    private final PasswordEncoder passwordEncoder;

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
    public AiRecommendationResDto sendQuestion(AiQuestionReqDto request) {
        if (request == null) {
            return sendQuestion(null, null, null, null);
        }

        return sendQuestion(
                request.getQuestion(),
                request.getLdongRegnCd(),
                request.getLdongSignguCd(),
                request.getRegionName()
        );
    }

    @Transactional(readOnly = true)
    public AiRecommendationResDto sendQuestion(String question) {
        return sendQuestion(question, null, null, null);
    }

    @Transactional(readOnly = true)
    public AiRecommendationResDto sendQuestion(
            String question,
            String ldongRegnCd,
            String ldongSignguCd,
            String regionName
    ) {

        if (question == null || question.isBlank()) {
            return AiRecommendationResDto.builder()
                    .message("질문을 입력해 주세요.")
                    .festivals(List.of())
                    .build();
        }

        boolean nearbyQuestion = isNearbyQuestion(question);
        boolean hasRegionCode = hasRegionCode(ldongRegnCd, ldongSignguCd);

        if (nearbyQuestion && !hasRegionCode) {
            return AiRecommendationResDto.builder()
                    .message("관심 지역을 설정하면 주변 축제를 추천받을 수 있어요.")
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
        List<Festivals> activeFestivals = festivalRepository.findAll()
                .stream()
                .filter(festival -> festival.getStatus() == FestivalStatus.ACTIVE)
                .toList();

        List<Festivals> regionalFestivals = nearbyQuestion && hasRegionCode
                ? activeFestivals.stream()
                        .filter(festival -> matchesRegion(festival, ldongRegnCd, ldongSignguCd))
                        .toList()
                : List.of();

        List<Festivals> festivals = (nearbyQuestion && hasRegionCode && !regionalFestivals.isEmpty()
                ? regionalFestivals
                : activeFestivals)
                .stream()
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

                사용자 위치/관심지역 정보:
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
                6. "내 주변", "근처", "가까운" 같은 표현은 현재 위치가 아니라 사용자 관심지역 기준으로 해석해.
                7. 사용자 관심지역 정보가 있으면 위치 정보를 알 수 없다는 답변을 하지 마.
                """.formatted(question, buildRegionPromptContext(ldongRegnCd, ldongSignguCd, regionName), festivalInfo);

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

    private boolean isNearbyQuestion(String question) {
        String safeQuestion = question == null ? "" : question;
        return safeQuestion.contains("내 주변")
                || safeQuestion.contains("주변")
                || safeQuestion.contains("근처")
                || safeQuestion.contains("가까운");
    }

    private boolean hasRegionCode(String ldongRegnCd, String ldongSignguCd) {
        return (ldongRegnCd != null && !ldongRegnCd.isBlank())
                || (ldongSignguCd != null && !ldongSignguCd.isBlank());
    }

    private boolean matchesRegion(Festivals festival, String ldongRegnCd, String ldongSignguCd) {
        if (ldongRegnCd != null
                && !ldongRegnCd.isBlank()
                && !Objects.equals(festival.getLdongRegnCd(), ldongRegnCd)) {
            return false;
        }
        return ldongSignguCd == null
                || ldongSignguCd.isBlank()
                || Objects.equals(festival.getLdongSignguCd(), ldongSignguCd);
    }

    private String buildRegionPromptContext(String ldongRegnCd, String ldongSignguCd, String regionName) {
        String safeRegionName = regionName == null || regionName.isBlank() ? "미입력" : regionName;
        String safeLdongRegnCd = ldongRegnCd == null || ldongRegnCd.isBlank() ? "미입력" : ldongRegnCd;
        String safeLdongSignguCd = ldongSignguCd == null || ldongSignguCd.isBlank() ? "미입력" : ldongSignguCd;

        if (!hasRegionCode(ldongRegnCd, ldongSignguCd)) {
            return "사용자 관심지역이 설정되지 않았습니다.";
        }

        return """
                관심지역명: %s
                법정동 시도코드: %s
                법정동 시군구코드: %s
                """.formatted(safeRegionName, safeLdongRegnCd, safeLdongSignguCd);
    }

    /**
     * AI 현장 상황 조회
     *
     * 스케줄러가 미리 저장한 최신 AI_NOTICE 메시지를 반환한다.
     * 조회 시점에는 Gemini를 직접 호출하지 않는다.
     */
    @Transactional(readOnly = true)
    public AiAnswerResDto getAiFieldSummary(Long chatRoomId) {

        if (chatRoomId == null) {
            throw new CustomException(HttpStatus.BAD_REQUEST, "채팅방 ID가 필요합니다.");
        }

        return chatMessageRepository
                .findTopByChatRoom_ChatRoomIdAndMessageTypeOrderByCreatedAtDesc(
                        chatRoomId,
                        ChatMessageType.AI_NOTICE
                )
                .map(AiAnswerResDto::of)
                .orElseGet(() -> AiAnswerResDto.builder()
                        .chatRoomId(chatRoomId)
                        .message("아직 생성된 AI 현장 요약이 없습니다.")
                        .messageType(ChatMessageType.AI_NOTICE)
                        .createdAt(null)
                        .build());
    }

    public boolean createFieldSummaryIfNeeded(Long chatRoomId) {
        if (chatRoomId == null) {
            throw new CustomException(HttpStatus.BAD_REQUEST, "채팅방 ID가 필요합니다.");
        }

        ChatRooms chatRoom = chatRoomRepository.findById(chatRoomId)
                .orElseThrow(() -> new CustomException(HttpStatus.NOT_FOUND, "채팅방을 찾을 수 없습니다."));

        if (!chatRoom.isActive()) {
            return false;
        }

        return createFieldSummaryIfNeeded(chatRoom);
    }

    private boolean createFieldSummaryIfNeeded(ChatRooms chatRoom) {
        Long chatRoomId = chatRoom.getChatRoomId();

        Slice<ChatMessages> latestSourceMessages =
                chatMessageRepository.findTextMessagesForSummary(
                        chatRoomId,
                        SUMMARY_SOURCE_MESSAGE_TYPES,
                        PageRequest.of(0, 1)
                );

        if (latestSourceMessages.isEmpty()) {
            return false;
        }

        ChatMessages latestSourceMessage = latestSourceMessages.getContent().get(0);
        ChatMessages latestAiSummary = chatMessageRepository
                .findTopByChatRoom_ChatRoomIdAndMessageTypeOrderByCreatedAtDesc(
                        chatRoomId,
                        ChatMessageType.AI_NOTICE
                )
                .orElse(null);

        if (latestAiSummary != null
                && !latestSourceMessage.getCreatedAt().isAfter(latestAiSummary.getCreatedAt())) {
            return false;
        }

        Slice<ChatMessages> sourceMessages = chatMessageRepository.findTextMessagesForSummary(
                chatRoomId,
                SUMMARY_SOURCE_MESSAGE_TYPES,
                PageRequest.of(0, 30)
        );

        List<String> messages = sourceMessages.getContent()
                .stream()
                .map(ChatMessages::getMessage)
                .filter(message -> message != null && !message.isBlank())
                .toList();

        if (messages.isEmpty()) {
            return false;
        }

        String summary = askGemini(createFieldSummaryPrompt(messages));
        Users systemUser = getOrCreateAiSystemUser();

        chatMessageRepository.save(ChatMessages.create(
                chatRoom,
                systemUser,
                summary,
                null,
                ChatMessageType.AI_NOTICE
        ));

        return true;
    }

    private String createFieldSummaryPrompt(List<String> messages) {
        return """
                너는 축제 현장 상황을 요약하는 AI야.

                아래는 실시간 현장톡 메시지들이야.

                %s

                위 메시지를 보고 현재 현장 상황을 1~2문장으로 요약해줘.
                대기줄, 혼잡도, 인기 구역, 주의사항이 있으면 포함해줘.
                """.formatted(String.join("\n", messages));
    }

    private Users getOrCreateAiSystemUser() {
        return userRepository.findByLoginId(AI_SYSTEM_LOGIN_ID)
                .orElseGet(() -> userRepository.save(Users.builder()
                        .loginId(AI_SYSTEM_LOGIN_ID)
                        .email(AI_SYSTEM_EMAIL)
                        .password(passwordEncoder.encode(UUID.randomUUID().toString()))
                        .nickname(AI_SYSTEM_NICKNAME)
                        .role(UserRole.USER)
                        .provider(OAuthProvider.LOCAL)
                        .status(UserStatus.ACTIVE)
                        .build()));
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
            throw new CustomException(HttpStatus.SERVICE_UNAVAILABLE, "Gemini 설정이 아직 연결되지 않았습니다.");
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
