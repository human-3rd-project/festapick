package com.human.festapick.entity;

import java.time.LocalDateTime;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "chat_rooms")
@Getter
@Setter
@ToString(exclude = "festival")
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class ChatRooms {
  private static final int ROOM_NAME_MAX_LENGTH = 100;

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  @Column(name = "chat_room_id")
  private Long chatRoomId;

  @OneToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "festival_id", nullable = false, unique = true)
  private Festivals festival;

  @Column(nullable = false, length = 100)
  private String roomName;

  @Column(nullable = false)
  private boolean active = false;

  @Column(nullable = false)
  private LocalDateTime createdAt;

  @PrePersist
  public void prePersist() {
    createdAt = LocalDateTime.now();
  }

  public static ChatRooms create(Festivals festival) {
    ChatRooms chatRoom = new ChatRooms();
    chatRoom.festival = festival;
    chatRoom.roomName = createRoomName(festival);
    chatRoom.active = true;
    return chatRoom;
  }

  private static String createRoomName(Festivals festival) {
    String title = festival.getTitle() == null ? "축제" : festival.getTitle();
    String roomName = title + " LIVE TALK";

    if (roomName.length() <= ROOM_NAME_MAX_LENGTH) {
      return roomName;
    }

    return roomName.substring(0, ROOM_NAME_MAX_LENGTH);
  }
}
