package com.human.festapick.dto.request;

import com.human.festapick.constant.ChatMessageType;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
public class LiveChatReqDto {
  // user - JWT 기반 조회
  // chat_message_id - AUTO_INCREMENT
  // created_at - 자동 입력
  // message_type - default CHAT

  // WebSocket 연결 URL에서 chatRoomId를 이미 받은 경우 생략 가능
  private Long chatRoomId;

  private ChatMessageType messageType;

  // 이미지 전송 시 "(사진)" 같은 문구 저장 가능(?) - Service 에서 처리
  private String message;

  // Null 가능
  private String imageUrl;
}
