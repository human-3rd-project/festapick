package com.human.festapick.config;

import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.socket.config.annotation.EnableWebSocket;
import org.springframework.web.socket.config.annotation.WebSocketConfigurer;
import org.springframework.web.socket.config.annotation.WebSocketHandlerRegistry;

@Configuration
@RequiredArgsConstructor
@EnableWebSocket
public class WebSocketConfig implements WebSocketConfigurer {

    private final WebSocketHandler webSocketHandler;
    private final JwtHandshakeInterceptor jwtHandshakeInterceptor;
    private final JwtHandshakeHandler jwtHandshakeHandler;

    @Override
    public void registerWebSocketHandlers(WebSocketHandlerRegistry registry) {
        registry.addHandler(webSocketHandler, "/ws/chat")
                .addInterceptors(jwtHandshakeInterceptor)
                .setHandshakeHandler(jwtHandshakeHandler)
                .setAllowedOrigins("*");
    }
}
