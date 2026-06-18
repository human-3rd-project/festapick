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

// 🔴 이 3가지 CORS 관련 임포트를 정확하게 일치시켜야 합니다.
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;          // .reactive 지움
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;   // 정상 임포트 확인

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
                // CORS: React(3000포트) 허용
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))

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
                        .requestMatchers("/auth/**", "/chat/rooms/*/messages", "/festivals/*/favorites/count").permitAll()                            // 로그인/회원가입 허용
                        .requestMatchers("/festivals/*/likes/count", "/festivals/*/reviews", "/festivals/*/reviews/count").permitAll()  // Swagger 허용
                        .requestMatchers("/ai/question", "/calendar/monthly",  "/calendar/filters/regions", "/calendar/filters/themes").permitAll()
                        .requestMatchers("/festivals/**", "/main/**").permitAll()
                        .requestMatchers(HttpMethod.POST,   "/admin/**").hasRole("ADMIN") // 재고 등록
                        .requestMatchers(HttpMethod.PUT,    "/admin/**").hasRole("ADMIN") // 재고 수정
                        .requestMatchers(HttpMethod.DELETE, "/admin/**").hasRole("ADMIN") // 재고 삭제
                        .anyRequest().authenticated()                                      // 나머지는 인증 필요
                )

                // JwtFilter를 필터 체인에 등록
                .with(new JwtSecurityConfig(tokenProvider), Customizer.withDefaults());

        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration config = new CorsConfiguration();
        config.addAllowedOrigin("http://localhost:3000");  // React 개발 서버
        config.addAllowedHeader("*");                      // Authorization 헤더 포함 전체 허용
        config.addAllowedMethod("*");                      // GET/POST/PUT/DELETE/OPTIONS 전체 허용
        config.setAllowCredentials(true);                  // 자격증명(쿠키, Authorization) 허용

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);
        return source;
    }
}
