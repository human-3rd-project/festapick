package com.human.festapick.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.human.festapick.entity.ChatRooms;

public interface ChatRoomRepository extends JpaRepository<ChatRooms, Long> {
  // 채팅방 생성 - save() 자동 생성

  List<ChatRooms> findByActiveTrue();

  // 축제별 채팅방 조회
  Optional<ChatRooms> findByFestival_FestivalId(Long festivalId);

  // 채팅방 활성 상태 조회
  Optional<ChatRooms> findByFestival_FestivalIdAndActiveTrue(Long festivalId);
}
