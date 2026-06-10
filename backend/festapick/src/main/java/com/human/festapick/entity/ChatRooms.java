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
}
