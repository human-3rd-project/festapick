package com.human.festapick.service;

import com.human.festapick.constant.ChatMessageType;
import com.human.festapick.dto.request.LiveChatReqDto;
import com.human.festapick.dto.response.LiveChatResDto;
import com.human.festapick.entity.ChatMessages;
import com.human.festapick.entity.ChatRooms;
import com.human.festapick.entity.Users;
import com.human.festapick.exception.CustomException;
import com.human.festapick.repository.ChatMessageRepository;
import com.human.festapick.repository.ChatRoomRepository;
import com.human.festapick.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Slice;
import org.springframework.http.HttpStatus;
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

    private final UserRepository userRepository;

    @Transactional(readOnly = true)
    public void validateActiveChatRoom(Long chatRoomId) {

        ChatRooms chatRoom = getChatRoom(chatRoomId);

        if (!chatRoom.isActive()) {
            throw new CustomException(HttpStatus.BAD_REQUEST, "활성화된 채팅방이 아닙니다.");
        }
    }

    public LiveChatResDto saveLiveMessage(Long chatRoomId, Long userId, LiveChatReqDto reqDto) {

        if (reqDto == null) {
            throw new CustomException(HttpStatus.BAD_REQUEST, "채팅 메시지 요청이 필요합니다.");
        }

        if (reqDto.getChatRoomId() != null && !reqDto.getChatRoomId().equals(chatRoomId)) {
            throw new CustomException(HttpStatus.BAD_REQUEST, "연결된 채팅방과 메시지 채팅방이 다릅니다.");
        }

        ChatMessageType messageType = resolveMessageType(reqDto);
        validateMessageContent(messageType, reqDto);

        ChatRooms chatRoom = getChatRoom(chatRoomId);
        Users user = getUser(userId);

        ChatMessages chatMessage = ChatMessages.create(
                chatRoom,
                user,
                trimToNull(reqDto.getMessage()),
                trimToNull(reqDto.getImageUrl()),
                messageType
        );

        return LiveChatResDto.of(chatMessageRepository.save(chatMessage));
    }

    public ChatMessages sendMessage(Long chatRoomId, Long userId, String message) {

        if (chatRoomId == null) {
            throw new CustomException(HttpStatus.BAD_REQUEST, "채팅방 ID가 필요합니다.");
        }

        if (userId == null) {
            throw new CustomException(HttpStatus.BAD_REQUEST, "사용자 ID가 필요합니다.");
        }

        if (message == null || message.isBlank()) {
            throw new CustomException(HttpStatus.BAD_REQUEST, "메시지를 입력해 주세요.");
        }

        ChatMessages chatMessage = ChatMessages.create(
                getChatRoom(chatRoomId),
                getUser(userId),
                message.trim(),
                null,
                ChatMessageType.CHAT
        );

        return chatMessageRepository.save(chatMessage);
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
    public Slice<LiveChatResDto> getPreviousMessages(Long chatRoomId, int size) {

        if (chatRoomId == null) {
            throw new CustomException(HttpStatus.BAD_REQUEST, "채팅방 ID가 필요합니다.");
        }

        int pageSize = size <= 0 ? 30 : size;

        return chatMessageRepository.findByChatRoom_ChatRoomIdOrderByCreatedAtDesc(
                chatRoomId,
                PageRequest.of(0, pageSize)
        ).map(LiveChatResDto::of);
    }

    private ChatRooms getChatRoom(Long chatRoomId) {

        if (chatRoomId == null) {
            throw new CustomException(HttpStatus.BAD_REQUEST, "채팅방 ID가 필요합니다.");
        }

        return chatRoomRepository.findById(chatRoomId)
                .orElseThrow(() -> new CustomException(HttpStatus.NOT_FOUND, "채팅방을 찾을 수 없습니다."));
    }

    private Users getUser(Long userId) {

        if (userId == null) {
            throw new CustomException(HttpStatus.BAD_REQUEST, "사용자 ID가 필요합니다.");
        }

        return userRepository.findById(userId)
                .orElseThrow(() -> new CustomException(HttpStatus.NOT_FOUND, "사용자를 찾을 수 없습니다."));
    }

    private ChatMessageType resolveMessageType(LiveChatReqDto reqDto) {

        if (reqDto.getMessageType() != null) {
            return reqDto.getMessageType();
        }

        return trimToNull(reqDto.getImageUrl()) == null ? ChatMessageType.CHAT : ChatMessageType.IMAGE;
    }

    private void validateMessageContent(ChatMessageType messageType, LiveChatReqDto reqDto) {

        if (messageType != ChatMessageType.CHAT && messageType != ChatMessageType.IMAGE) {
            throw new CustomException(HttpStatus.BAD_REQUEST, "전송할 수 없는 채팅 메시지 타입입니다.");
        }

        if (messageType == ChatMessageType.CHAT && trimToNull(reqDto.getMessage()) == null) {
            throw new CustomException(HttpStatus.BAD_REQUEST, "메시지를 입력해 주세요.");
        }

        if (messageType == ChatMessageType.IMAGE && trimToNull(reqDto.getImageUrl()) == null) {
            throw new CustomException(HttpStatus.BAD_REQUEST, "이미지 URL이 필요합니다.");
        }
    }

    private String trimToNull(String value) {

        if (value == null || value.isBlank()) {
            return null;
        }

        return value.trim();
    }
}
