package com.human.festapick.config;

import com.human.festapick.security.JwtAccessDeniedHandle;
import com.human.festapick.security.JwtAuthenticationEntryPoint;
import com.human.festapick.security.JwtSecurityConfig;
import com.human.festapick.security.TokenProvider;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    private final TokenProvider               tokenProvider;
    private final JwtAuthenticationEntryPoint jwtAuthenticationEntryPoint;
    private final JwtAccessDeniedHandle       jwtAccessDeniedHandler;

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
                // CSRF: JWT 방식이므로 비활성화
                .csrf(csrf -> csrf.disable())

                // 세션 미사용 (Stateless) — JWT 핵심 설정
                .sessionManagement(session ->
                        session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))

                // 예외 핸들러 등록
                .exceptionHandling(exception -> exception
                        .authenticationEntryPoint(jwtAuthenticationEntryPoint)  // 401
                        .accessDeniedHandler(jwtAccessDeniedHandler))           // 403

                // URL 별 권한 설정 (위에서 아래 순서로 첫 번째 매칭 적용)
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()
                        .requestMatchers(
                                "/",
                                "/index.html",
                                "/static/**",
                                "/favicon.ico",
                                "/manifest.json",
                                "/asset-manifest.json",
                                "/robots.txt"
                        ).permitAll()
                        .requestMatchers(HttpMethod.GET,
                                "/search",
                                "/nearby",
                                "/calendar",
                                "/ai",
                                "/ai-recommend",
                                "/donation/**",
                                "/mypage/**",
                                "/admin",
                                "/admin/members",
                                "/admin/reviews",
                                "/admin/festivals",
                                "/admin/donations",
                                "/login",
                                "/signup",
                                "/find-id",
                                "/find-password",
                                "/reset-password",
                                "/social-login",
                                "/oauth/kakao/callback",
                                "/detail/**"
                        ).permitAll()
                        .requestMatchers(HttpMethod.HEAD,
                                "/search",
                                "/nearby",
                                "/calendar",
                                "/ai",
                                "/ai-recommend",
                                "/donation/**",
                                "/mypage/**",
                                "/admin",
                                "/admin/members",
                                "/admin/reviews",
                                "/admin/festivals",
                                "/admin/donations",
                                "/login",
                                "/signup",
                                "/find-id",
                                "/find-password",
                                "/reset-password",
                                "/social-login",
                                "/oauth/kakao/callback",
                                "/detail/**"
                        ).permitAll()
                        .requestMatchers("/auth/**", "/ws/chat", "/chat/rooms/*/messages", "/festivals/*/favorites/count", "/donations/statistics").permitAll()                            // 로그인/회원가입 허용
                        .requestMatchers("/festivals/*/likes/count", "/festivals/*/reviews", "/festivals/*/reviews/count").permitAll()  // Swagger 허용
                        .requestMatchers("/ai/field-summary/**", "/calendar/monthly",  "/calendar/filters/regions", "/calendar/filters/themes", "/calendar").permitAll()
                        .requestMatchers(HttpMethod.GET, "/festivals/**", "/main/**", "/detail/**").permitAll()
                        .requestMatchers("/admin/**").hasRole("ADMIN")
                        .anyRequest().authenticated()                                      // 나머지는 인증 필요
                )

                // JwtFilter를 필터 체인에 등록
                .with(new JwtSecurityConfig(tokenProvider), Customizer.withDefaults());

        return http.build();
    }
}
