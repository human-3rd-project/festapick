package com.human.festapick.controller;

import com.human.festapick.dto.response.ApiResponse;
import com.human.festapick.service.WebSocketTicketService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/ws")
@RequiredArgsConstructor
public class WebSocketTicketController {

    private final WebSocketTicketService webSocketTicketService;

    @PostMapping("/ticket")
    public ResponseEntity<ApiResponse<String>> issueTicket(Authentication authentication) {
        return ResponseEntity.ok(ApiResponse.ok(webSocketTicketService.issue(authentication)));
    }
}
