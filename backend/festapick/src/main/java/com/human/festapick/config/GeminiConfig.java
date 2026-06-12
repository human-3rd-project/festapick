package com.human.festapick.config;

import com.google.genai.Client;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class GeminiConfig {

    // application.properties에 있는 gemini.api-key 값을 가져옴
    // application.properties에는 gemini.api-key=${GEMINI_API_KEY} 이렇게 적혀 있어야 함
    @Value("${gemini.api-key}")
    private String apiKey;

    @Bean
    public Client geminiClient() {

        // API Key가 없거나 비어 있으면 서버 실행 시 바로 확인할 수 있게 예외 처리
        if (apiKey == null || apiKey.isBlank()) {
            throw new IllegalStateException("Gemini API Key가 설정되지 않았습니다.");
        }

        // Google Gemini API를 호출하기 위한 Client 객체 생성
        // 이 Client Bean은 AiService에서 주입받아 사용함
        return Client.builder()
                .apiKey(apiKey)
                .build();
    }
}