package com.human.festapick.repository;

import java.util.Optional;

import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Slice;
import org.springframework.data.jpa.repository.JpaRepository;

import com.human.festapick.entity.ChatMessages;

public interface ChatMessageRepository extends JpaRepository<ChatMessages, Long> {
  // 메시지 저장 - save() 자동 생성

  // 이전 채팅 내역 조회 - 최신순
  Slice<ChatMessages> findByChatRoom_ChatRoomIdOrderByCreatedAtDesc(
    Long chatRoomId,
    Pageable pageable
  );

  // 최근 메시지 1건 조회
  Optional<ChatMessages> findTopByChatRoom_ChatRoomIdOrderByCreatedAtDesc(
    Long chatRoomId
  );
}
