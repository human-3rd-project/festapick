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
public class LiveChatResDto {
  private Long chatMessageId;
  
  // chatMessages > chatRoomId > festivalId 연결되는 느낌?
  private Long chatRoomId;

  // 작성자 - JWT 사용자와 비교해 본인 메시지 여부 확인
  private Long userId;
  private String nickname;
  private String profileImageUrl;

  // 채팅 메시지 - imageUrl 존재 시 프론트에서 이미지 렌더링
  private String message;
  private String imageUrl;

  // CHAT / SYSTEM / AI_NOTICE
  private ChatMessageType messageType;

  // 메시지 생성 시간
  private LocalDateTime createdAt;

  // Entity -> DTO 변환
  public static LiveChatResDto of(ChatMessages chatMessage) {
    return LiveChatResDto.builder()
      .chatMessageId(chatMessage.getChatMessageId())
      .chatRoomId(chatMessage.getChatRoom().getChatRoomId())
      .userId(chatMessage.getUser().getUserId())
      .nickname(chatMessage.getUser().getNickname())
      .profileImageUrl(chatMessage.getUser().getProfileImageUrl())
      .message(chatMessage.getMessage())
      .imageUrl(chatMessage.getImageUrl())
      .messageType(chatMessage.getMessageType())
      .createdAt(chatMessage.getCreatedAt())
      .build();
  }
}
