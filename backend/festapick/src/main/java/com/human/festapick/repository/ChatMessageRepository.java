package com.human.festapick.repository;

import java.util.Collection;
import java.util.Optional;

import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Slice;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.human.festapick.constant.ChatMessageType;
import com.human.festapick.entity.ChatMessages;

public interface ChatMessageRepository extends JpaRepository<ChatMessages, Long> {
  // 메시지 저장 - save() 자동 생성

  // 이전 채팅 내역 조회 - 최신순
  Slice<ChatMessages> findByChatRoom_ChatRoomIdAndMessageTypeInOrderByCreatedAtDesc(
    Long chatRoomId,
    Collection<ChatMessageType> messageTypes,
    Pageable pageable
  );

  // 최근 메시지 1건 조회
  Optional<ChatMessages> findTopByChatRoom_ChatRoomIdOrderByCreatedAtDesc(
    Long chatRoomId
  );

  Optional<ChatMessages> findTopByChatRoom_ChatRoomIdAndMessageTypeOrderByCreatedAtDesc(
    Long chatRoomId,
    ChatMessageType messageType
  );

  @Query("""
      SELECT chatMessage
      FROM ChatMessages chatMessage
      WHERE chatMessage.chatRoom.chatRoomId = :chatRoomId
        AND chatMessage.messageType IN :messageTypes
        AND chatMessage.message IS NOT NULL
        AND TRIM(chatMessage.message) <> ''
      ORDER BY chatMessage.createdAt DESC
      """)
  Slice<ChatMessages> findTextMessagesForSummary(
    @Param("chatRoomId") Long chatRoomId,
    @Param("messageTypes") Collection<ChatMessageType> messageTypes,
    Pageable pageable
  );
}
