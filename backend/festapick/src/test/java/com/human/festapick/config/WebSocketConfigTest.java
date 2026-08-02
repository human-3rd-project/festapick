package com.human.festapick.config;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.web.socket.config.annotation.WebSocketHandlerRegistration;
import org.springframework.web.socket.config.annotation.WebSocketHandlerRegistry;

import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class WebSocketConfigTest {

    @Mock
    private WebSocketHandler webSocketHandler;

    @Mock
    private JwtHandshakeInterceptor jwtHandshakeInterceptor;

    @Mock
    private JwtHandshakeHandler jwtHandshakeHandler;

    @Mock
    private WebSocketHandlerRegistry registry;

    @Mock
    private WebSocketHandlerRegistration registration;

    @Test
    void allowsOnlyConfiguredFrontendOrigin() {
        String frontendUrl = "https://festapick.example.com";
        WebSocketConfig config = new WebSocketConfig(
                webSocketHandler,
                jwtHandshakeInterceptor,
                jwtHandshakeHandler,
                frontendUrl
        );

        when(registry.addHandler(webSocketHandler, "/ws/chat")).thenReturn(registration);
        when(registration.addInterceptors(jwtHandshakeInterceptor)).thenReturn(registration);
        when(registration.setHandshakeHandler(jwtHandshakeHandler)).thenReturn(registration);

        config.registerWebSocketHandlers(registry);

        verify(registration).setAllowedOrigins(frontendUrl);
    }
}
