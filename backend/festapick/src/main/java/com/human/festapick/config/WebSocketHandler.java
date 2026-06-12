package com.human.festapick.config;

import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.CloseStatus;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.TextWebSocketHandler;

import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@RequiredArgsConstructor  // 생성자를 통한 의존성 주입을 간단하게 처리
@Slf4j
@Component // Bean 등록
public class WebSocketHandler extends TextWebSocketHandler {
    private final ChatService chatService;
    private final ObjectMapper objectMapper;

    private final Map<WebSocketSession, String> sessionRoomIdMap = new ConcurrentHashMap<>();

    @Override
    protected void handleTextMessage(WebSocketSession session, TextMessage message) throws Exception {
        String payload = message.getPayload();
        ChatMessageDto chatMessage = objectMapper.readValue(payload, ChatMessageDto.class);
        String roomId = chatMessage.getRoomId();
        sessionRoomIdMap.put(session, roomId);

        switch (chatMessage.getType()) {
            case ENTER -> chatService.addSessionAndHandleEnter(roomId, session, chatMessage);
            case CLOSE -> chatService.removeSessionAndHandleExit(roomId, session, chatMessage);
            default -> chatService.sendMessageToAll(roomId, chatMessage);
        }
    }

    // 브라우저 탭 닫기 등 비정상적인 종료 처리
    @Override
    public void afterConnectionClosed(WebSocketSession session,
                                      CloseStatus status) throws Exception {
        String roomId = sessionRoomIdMap.remove(session);
        if (roomId != null) {
            ChatMessageDto exitMsg = new ChatMessageDto();
            exitMsg.setType(ChatMessageDto.MessageType.CLOSE);
            chatService.removeSessionAndHandleExit(roomId, session, exitMsg);
        }
    }
}