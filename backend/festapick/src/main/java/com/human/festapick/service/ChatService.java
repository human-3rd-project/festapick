package com.human.festapick.service;

import com.human.festapick.entity.ChatMessages;
import com.human.festapick.entity.ChatRooms;
import com.human.festapick.repository.ChatMessageRepository;
import com.human.festapick.repository.ChatRoomRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Slice;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional
public class ChatService {

    /*
     * 채팅방 조회용 Repository.
     *
     * 현재 Repository에 있는 메서드:
     * - findByFestival_FestivalId(...)
     * - findByFestival_FestivalIdAndActiveTrue(...)
     */
    private final ChatRoomRepository chatRoomRepository;

    /*
     * 채팅 메시지 조회/저장용 Repository.
     *
     * 현재 Repository에 있는 메서드:
     * - findByChatRoom_ChatRoomIdOrderByCreatedAtDesc(...)
     * - findTopByChatRoom_ChatRoomIdOrderByCreatedAtDesc(...)
     */
    private final ChatMessageRepository chatMessageRepository;

    @Transactional(readOnly = true)
    public boolean isLiveTalkAvailable(Long festivalId) {

        if (festivalId == null) {
            throw new IllegalArgumentException("축제 ID가 필요합니다.");
        }

        return chatRoomRepository.findByFestival_FestivalIdAndActiveTrue(festivalId)
                .isPresent();
    }
    /**
     * 채팅방 입장
     *
     * 축제 상세 페이지에서 LIVE TALK 창을 열 때 사용.
     *
     * 현재 구조:
     * - 축제마다 채팅방 1개
     * - 활성화된 채팅방만 입장 가능
     */
    @Transactional(readOnly = true)
    public ChatRooms enterChatRoom(Long festivalId) {

        if (festivalId == null) {
            throw new IllegalArgumentException("축제 ID가 필요합니다.");
        }

        return chatRoomRepository.findByFestival_FestivalIdAndActiveTrue(festivalId)
                .orElseThrow(() -> new IllegalArgumentException("활성화된 채팅방이 없습니다."));
    }

    /**
     * 채팅방 나가기
     *
     * 현재 엔티티 구조에는 채팅방 참여자 테이블이 없음.
     * 그래서 지금은 실제 DB 처리 없이 메서드 틀만 둠.
     *
     * 추후 ChatParticipant 같은 테이블이 생기면:
     * - userId 기준 참여 상태 변경
     * - 퇴장 시간 저장
     * 등을 여기서 처리하면 됨.
     */
    public void leaveChatRoom(Long chatRoomId, Long userId) {

        if (chatRoomId == null) {
            throw new IllegalArgumentException("채팅방 ID가 필요합니다.");
        }

        if (userId == null) {
            throw new IllegalArgumentException("사용자 ID가 필요합니다.");
        }

        // TODO:
        // 채팅 참여자 테이블이 생기면 여기서 퇴장 처리
    }

    /**
     * 실시간 메시지 송신
     *
     * 사용자가 LIVE TALK 입력창에 메시지를 입력하고 전송할 때 사용.
     *
     * 주의:
     * 현재 ChatMessages 엔티티는 생성자가 protected라서
     * Service에서 바로 new ChatMessages()로 생성할 수 없음.
     *
     * 그래서 실제 저장은 ChatMessages 엔티티에
     * create 메서드나 @Builder가 추가된 뒤 구현해야 함.
     */
    public ChatMessages sendMessage(Long chatRoomId, Long userId, String message) {

        if (chatRoomId == null) {
            throw new IllegalArgumentException("채팅방 ID가 필요합니다.");
        }

        if (userId == null) {
            throw new IllegalArgumentException("사용자 ID가 필요합니다.");
        }

        if (message == null || message.isBlank()) {
            throw new IllegalArgumentException("메시지를 입력해 주세요.");
        }

        // TODO:
        // 1. ChatRooms chatRoom = chatRoomRepository.findById(chatRoomId)...
        // 2. Users user = userRepository.findById(userId)...
        // 3. ChatMessages chatMessage = ChatMessages.create(...)
        // 4. chatMessageRepository.save(chatMessage)
        // 5. WebSocket으로 같은 채팅방 사용자에게 전송

        throw new UnsupportedOperationException("ChatMessages 생성 메서드 추가 후 구현 필요");
    }

    /**
     * 실시간 메시지 수신
     *
     * WebSocket에서 메시지를 수신했을 때 사용할 수 있는 메서드.
     * 현재는 송신과 같은 저장 로직을 사용하면 되므로 sendMessage를 재사용.
     */
    public ChatMessages receiveMessage(Long chatRoomId, Long userId, String message) {
        return sendMessage(chatRoomId, userId, message);
    }

    /**
     * 이전 채팅 내역 조회
     *
     * 사용 위치:
     * - 작은 LIVE TALK 창 열었을 때 최근 메시지 몇 개 조회
     * - 중간 크기 확대 시 더 많은 메시지 조회
     * - 전체 채팅 모달 열었을 때 이전 메시지 조회
     */
    @Transactional(readOnly = true)
    public Slice<ChatMessages> getPreviousMessages(Long chatRoomId, int size) {

        if (chatRoomId == null) {
            throw new IllegalArgumentException("채팅방 ID가 필요합니다.");
        }

        int pageSize = size <= 0 ? 30 : size;

        return chatMessageRepository.findByChatRoom_ChatRoomIdOrderByCreatedAtDesc(
                chatRoomId,
                PageRequest.of(0, pageSize)
        );
    }

    /**
     * 최근 메시지 1건 조회
     *
     * 축제 상세 페이지 오른쪽 작은 LIVE TALK 미리보기에서 사용 가능.
     */
    @Transactional(readOnly = true)
    public ChatMessages getLatestMessage(Long chatRoomId) {

        if (chatRoomId == null) {
            throw new IllegalArgumentException("채팅방 ID가 필요합니다.");
        }

        return chatMessageRepository.findTopByChatRoom_ChatRoomIdOrderByCreatedAtDesc(chatRoomId)
                .orElse(null);
    }
}