package com.human.festapick.config;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.human.festapick.dto.request.LiveChatReqDto;
import com.human.festapick.dto.response.LiveChatResDto;
import com.human.festapick.security.CustomUserDetail;
import com.human.festapick.service.ChatService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.CloseStatus;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.TextWebSocketHandler;
import org.springframework.web.util.UriComponentsBuilder;

import java.net.URI;
import java.security.Principal;
import java.util.Map;
import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;
import java.util.stream.Collectors;

@RequiredArgsConstructor  // 생성자를 통한 의존성 주입을 간단하게 처리
@Slf4j
@Component // Bean 등록
public class WebSocketHandler extends TextWebSocketHandler {
    private final ChatService chatService;
    private final ObjectMapper objectMapper;

    private final Map<WebSocketSession, Long> sessionRoomIdMap = new ConcurrentHashMap<>();
    private final Map<WebSocketSession, Long> sessionUserIdMap = new ConcurrentHashMap<>();
    private final Map<Long, Set<WebSocketSession>> roomSessionMap = new ConcurrentHashMap<>();

    // 메인 페이지 로딩 시점에 채팅방별 현재 WebSocket 접속자 수를 스냅샷으로 조회합니다.
    public Map<Long, Long> getLiveParticipantCountByChatRoomId() {
        return roomSessionMap.entrySet().stream()
                .collect(Collectors.toMap(
                        Map.Entry::getKey,
                        entry -> entry.getValue().stream()
                                .filter(WebSocketSession::isOpen)
                                .count()
                ));
    }

    @Override
    public void afterConnectionEstablished(WebSocketSession session) throws Exception {
        URI uri = session.getUri();

        if (uri == null) {
            session.close(CloseStatus.BAD_DATA);
            return;
        }

        String chatRoomIdParam = UriComponentsBuilder.fromUri(uri)
                .build()
                .getQueryParams()
                .getFirst("chatRoomId");

        if (chatRoomIdParam == null || chatRoomIdParam.isBlank()) {
            session.close(CloseStatus.BAD_DATA);
            return;
        }

        try {
            Long chatRoomId = Long.valueOf(chatRoomIdParam);
            Long userId = getUserId(session);

            chatService.validateActiveChatRoom(chatRoomId);

            sessionRoomIdMap.put(session, chatRoomId);
            sessionUserIdMap.put(session, userId);
            roomSessionMap.computeIfAbsent(chatRoomId, key -> ConcurrentHashMap.newKeySet())
                    .add(session);
        } catch (NumberFormatException e) {
            session.close(CloseStatus.BAD_DATA);
        } catch (RuntimeException e) {
            log.warn("WebSocket 연결을 거부했습니다. chatRoomId={}, reason={}", chatRoomIdParam, e.getMessage());
            session.close(CloseStatus.POLICY_VIOLATION);
        }
    }

    @Override
    protected void handleTextMessage(WebSocketSession session, TextMessage message) throws Exception {
        Long chatRoomId = sessionRoomIdMap.get(session);
        Long userId = sessionUserIdMap.get(session);

        if (chatRoomId == null || userId == null) {
            session.close(CloseStatus.POLICY_VIOLATION);
            return;
        }

        try {
            LiveChatReqDto reqDto = objectMapper.readValue(message.getPayload(), LiveChatReqDto.class);
            LiveChatResDto resDto = chatService.saveLiveMessage(chatRoomId, userId, reqDto);
            broadcast(chatRoomId, resDto);
        } catch (Exception e) {
            log.warn("잘못된 채팅 메시지입니다. chatRoomId={}, userId={}, reason={}",
                    chatRoomId, userId, e.getMessage());
            session.close(CloseStatus.BAD_DATA);
        }
    }

    // 브라우저 탭 닫기 등 비정상적인 종료 처리
    @Override
    public void afterConnectionClosed(WebSocketSession session,
                                      CloseStatus status) throws Exception {
        Long chatRoomId = sessionRoomIdMap.remove(session);
        sessionUserIdMap.remove(session);

        if (chatRoomId != null) {
            Set<WebSocketSession> roomSessions = roomSessionMap.get(chatRoomId);

            if (roomSessions != null) {
                roomSessions.remove(session);

                if (roomSessions.isEmpty()) {
                    roomSessionMap.remove(chatRoomId);
                }
            }
        }
    }

    private Long getUserId(WebSocketSession session) {
        Principal principal = session.getPrincipal();

        if (!(principal instanceof Authentication authentication)) {
            throw new IllegalArgumentException("인증 정보가 없는 WebSocket 연결입니다.");
        }

        Object userPrincipal = authentication.getPrincipal();

        if (!(userPrincipal instanceof CustomUserDetail userDetail)) {
            throw new IllegalArgumentException("지원하지 않는 인증 사용자 타입입니다.");
        }

        return userDetail.getUserId();
    }

    private void broadcast(Long chatRoomId, LiveChatResDto message) throws Exception {
        Set<WebSocketSession> roomSessions = roomSessionMap.get(chatRoomId);

        if (roomSessions == null || roomSessions.isEmpty()) {
            return;
        }

        String payload = objectMapper.writeValueAsString(message);

        for (WebSocketSession roomSession : roomSessions) {
            try {
                if (roomSession.isOpen()) {
                    roomSession.sendMessage(new TextMessage(payload));
                }
            } catch (Exception e) {
                log.warn("채팅 메시지 전송에 실패했습니다. chatRoomId={}, sessionId={}, reason={}",
                        chatRoomId, roomSession.getId(), e.getMessage());
            }
        }
    }
}
