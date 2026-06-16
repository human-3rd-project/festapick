package com.human.festapick.controller;

import com.human.festapick.dto.response.ApiResponse;
import com.human.festapick.dto.response.LiveChatResDto;
import com.human.festapick.service.ChatService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Slice;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/chat")
@RequiredArgsConstructor
public class ChatController {

    private final ChatService chatService;

    @GetMapping("/rooms/{chatRoomId}/messages")
    public ResponseEntity<ApiResponse<Slice<LiveChatResDto>>> getPreviousMessages(
            @PathVariable Long chatRoomId,
            @RequestParam(defaultValue = "30") int size
    ) {
        chatService.validateActiveChatRoom(chatRoomId);

        Slice<LiveChatResDto> messages = chatService.getPreviousMessages(chatRoomId, size);
        return ResponseEntity.ok(ApiResponse.ok(messages));
    }
}
