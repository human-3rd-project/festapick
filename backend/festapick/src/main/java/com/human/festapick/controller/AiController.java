package com.human.festapick.controller;

import com.human.festapick.dto.request.AiQuestionReqDto;
import com.human.festapick.dto.response.AiAnswerResDto;
import com.human.festapick.dto.response.AiRecommendationResDto;
import com.human.festapick.dto.response.ApiResponse;
import com.human.festapick.service.AiService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/ai")
public class AiController {

    /*
     * AI 관련 비즈니스 로직을 처리하는 Service.
     *
     * Controller는 요청을 받고,
     * Service를 호출하고,
     * 응답을 반환하는 역할만 한다.
     * 실제 AI 추천 로직, Gemini 호출, 현장톡 요약 로직은 AiService에서 처리한다.
     */
    private final AiService aiService;

    /**
     * AI 질문 전송
     *
     * 사용자가 AI 추천 페이지에서 입력한 질문을 받아
     * AiService의 sendQuestion()으로 전달한다.
     *
     * 요청 예시:
     * POST /ai/question
     *
     * {
     *   "question": "서울에서 데이트하기 좋은 축제 추천해줘"
     * }
     *
     * 응답:
     * {
     *   "success": true,
     *   "message": "AI 추천 결과 조회 성공",
     *   "data": {
     *     "message": "추천 문장",
     *     "festivals": [...]
     *   }
     * }
     */
    @PostMapping("/question")
    public ResponseEntity<ApiResponse<AiRecommendationResDto>> sendQuestion(
            @RequestBody AiQuestionReqDto request
    ) {
        AiRecommendationResDto response = aiService.sendQuestion(request);

        return ResponseEntity.ok(
                ApiResponse.ok("AI 추천 결과 조회 성공", response)
        );
    }

    /**
     * AI 현장 상황 요약 조회
     *
     * 특정 채팅방의 최근 현장톡 메시지를 기반으로
     * AI가 현장 상황을 요약한다.
     *
     * 요청 예시:
     * GET /ai/field-summary/1
     *
     * 응답:
     * {
     *   "success": true,
     *   "message": "AI 현장 상황 요약 조회 성공",
     *   "data": {
     *     "chatRoomId": 1,
     *     "message": "현재 현장은 사람이 많고 입구 대기줄이 있습니다.",
     *     "messageType": "AI_NOTICE",
     *     "createdAt": "2026-06-16T..."
     *   }
     * }
     */
    @GetMapping("/field-summary/{chatRoomId}")
    public ResponseEntity<ApiResponse<AiAnswerResDto>> getAiFieldSummary(
            @PathVariable Long chatRoomId
    ) {
        AiAnswerResDto response = aiService.getAiFieldSummary(chatRoomId);

        return ResponseEntity.ok(
                ApiResponse.ok("AI 현장 상황 요약 조회 성공", response)
        );
    }
}
