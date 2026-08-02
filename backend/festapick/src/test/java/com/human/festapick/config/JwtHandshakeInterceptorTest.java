package com.human.festapick.config;

import com.human.festapick.service.WebSocketTicketService;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.http.server.ServerHttpRequest;
import org.springframework.http.server.ServerHttpResponse;
import org.springframework.security.core.Authentication;
import org.springframework.web.socket.WebSocketHandler;

import java.net.URI;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class JwtHandshakeInterceptorTest {

    @Mock
    private WebSocketTicketService webSocketTicketService;

    @Mock
    private ServerHttpRequest request;

    @Mock
    private ServerHttpResponse response;

    @Mock
    private WebSocketHandler webSocketHandler;

    @Mock
    private Authentication authentication;

    @InjectMocks
    private JwtHandshakeInterceptor interceptor;

    @Test
    void authenticatesByConsumingOneTimeTicket() {
        Map<String, Object> attributes = new HashMap<>();
        when(request.getURI()).thenReturn(
                URI.create("https://festapick.example.com/ws/chat?chatRoomId=1&ticket=one-time-ticket")
        );
        when(webSocketTicketService.consume("one-time-ticket"))
                .thenReturn(Optional.of(authentication));

        boolean allowed = interceptor.beforeHandshake(
                request,
                response,
                webSocketHandler,
                attributes
        );

        assertThat(allowed).isTrue();
        assertThat(attributes.get(JwtHandshakeInterceptor.AUTHENTICATION_ATTRIBUTE))
                .isSameAs(authentication);
        verify(webSocketTicketService).consume("one-time-ticket");
    }

    @Test
    void rejectsInvalidTicket() {
        when(request.getURI()).thenReturn(
                URI.create("https://festapick.example.com/ws/chat?chatRoomId=1&ticket=invalid")
        );
        when(webSocketTicketService.consume("invalid")).thenReturn(Optional.empty());

        boolean allowed = interceptor.beforeHandshake(
                request,
                response,
                webSocketHandler,
                new HashMap<>()
        );

        assertThat(allowed).isFalse();
        verify(response).setStatusCode(HttpStatus.UNAUTHORIZED);
    }
}
