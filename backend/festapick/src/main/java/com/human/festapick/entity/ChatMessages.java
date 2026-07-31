package com.human.festapick.entity;

import java.time.LocalDateTime;

import com.human.festapick.constant.ChatMessageType;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "chat_messages")
@Getter
@Setter
@ToString(exclude = {"user", "chatRoom"})
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class ChatMessages {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  @Column(name = "chat_message_id")
  private Long chatMessageId;

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "chat_room_id", nullable = false)
  private ChatRooms chatRoom;

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "user_id", nullable = false)
  private Users user;

  @Column(columnDefinition = "TEXT")
  private String message;

  @Column(length = 500)
  private String imageUrl;

  @Enumerated(EnumType.STRING)
  @Column(nullable = false)
  private ChatMessageType messageType = ChatMessageType.CHAT;

  @Column(nullable = false)
  private LocalDateTime createdAt;

  @PrePersist
  public void prePersist() {
    createdAt = LocalDateTime.now();
  }

  public static ChatMessages create(
      ChatRooms chatRoom,
      Users user,
      String message,
      String imageUrl,
      ChatMessageType messageType
  ) {
    ChatMessages chatMessage = new ChatMessages();
    chatMessage.chatRoom = chatRoom;
    chatMessage.user = user;
    chatMessage.message = message;
    chatMessage.imageUrl = imageUrl;
    chatMessage.messageType = messageType == null ? ChatMessageType.CHAT : messageType;
    return chatMessage;
  }
}
