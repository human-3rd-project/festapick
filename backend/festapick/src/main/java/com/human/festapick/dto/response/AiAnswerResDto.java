package com.human.festapick.dto.response;

import java.time.LocalDateTime;

import com.human.festapick.constant.ChatMessageType;
import com.human.festapick.entity.ChatMessages;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AiAnswerResDto {
  // AI 공지 대상 채팅방 확인
  private Long chatRoomId;

  // AI 요약, 공지 내용
  private String message;

  // 현 시점에선 AI_NOTICE 고정 사용 예정
  private ChatMessageType messageType;

  // 생성 시간
  private LocalDateTime createdAt;

  // Entity -> DTO 변환
  public static AiAnswerResDto of(ChatMessages chatMessage) {
    return AiAnswerResDto.builder()
        .chatRoomId(chatMessage.getChatRoom().getChatRoomId())
        .message(chatMessage.getMessage())
        .messageType(chatMessage.getMessageType())
        .createdAt(chatMessage.getCreatedAt())
        .build();
  }
}
