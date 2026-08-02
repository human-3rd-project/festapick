package com.human.festapick.config;

import com.human.festapick.ratelimit.RateLimitInterceptor;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
@RequiredArgsConstructor
public class RateLimitWebConfig implements WebMvcConfigurer {

    private final RateLimitInterceptor rateLimitInterceptor;

    @Override
    public void addInterceptors(InterceptorRegistry registry) {
        registry.addInterceptor(rateLimitInterceptor)
                .addPathPatterns(
                        "/auth/login",
                        "/auth/email-verifications/send",
                        "/auth/email-verifications/verify",
                        "/auth/account/password-reset/request",
                        "/auth/account/password-reset",
                        "/ai/question"
                );
    }
}
