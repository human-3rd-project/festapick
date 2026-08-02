package com.human.festapick.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.socket.config.annotation.EnableWebSocket;
import org.springframework.web.socket.config.annotation.WebSocketConfigurer;
import org.springframework.web.socket.config.annotation.WebSocketHandlerRegistry;

@Configuration
@EnableWebSocket
public class WebSocketConfig implements WebSocketConfigurer {

    private final WebSocketHandler webSocketHandler;
    private final JwtHandshakeInterceptor jwtHandshakeInterceptor;
    private final JwtHandshakeHandler jwtHandshakeHandler;
    private final String frontendUrl;

    public WebSocketConfig(
            WebSocketHandler webSocketHandler,
            JwtHandshakeInterceptor jwtHandshakeInterceptor,
            JwtHandshakeHandler jwtHandshakeHandler,
            @Value("${frontend.url}") String frontendUrl
    ) {
        this.webSocketHandler = webSocketHandler;
        this.jwtHandshakeInterceptor = jwtHandshakeInterceptor;
        this.jwtHandshakeHandler = jwtHandshakeHandler;
        this.frontendUrl = frontendUrl;
    }

    @Override
    public void registerWebSocketHandlers(WebSocketHandlerRegistry registry) {
        registry.addHandler(webSocketHandler, "/ws/chat")
                .addInterceptors(jwtHandshakeInterceptor)
                .setHandshakeHandler(jwtHandshakeHandler)
                .setAllowedOrigins(frontendUrl);
    }
}
