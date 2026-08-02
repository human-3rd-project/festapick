package com.human.festapick.ratelimit;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.human.festapick.security.CustomUserDetail;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.CsvSource;
import org.springframework.mock.web.MockHttpServletRequest;
import org.springframework.mock.web.MockHttpServletResponse;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;

import java.time.Clock;
import java.time.Instant;
import java.time.ZoneOffset;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

class RateLimitInterceptorTest {

    private RateLimitInterceptor interceptor;

    @BeforeEach
    void setUp() {
        Clock clock = Clock.fixed(Instant.parse("2026-07-27T00:00:00Z"), ZoneOffset.UTC);
        interceptor = new RateLimitInterceptor(new ObjectMapper(), clock);
    }

    @AfterEach
    void tearDown() {
        SecurityContextHolder.clearContext();
    }

    @ParameterizedTest
    @CsvSource({
            "/auth/login,10",
            "/auth/email-verifications/send,5",
            "/auth/email-verifications/verify,10",
            "/auth/account/password-reset/request,5",
            "/auth/account/password-reset,5"
    })
    void publicEndpointReturns429AfterIpLimit(String path, int limit) throws Exception {
        for (int count = 0; count < limit; count++) {
            MockHttpServletResponse allowedResponse = new MockHttpServletResponse();
            assertThat(interceptor.preHandle(
                    request(path, "203.0.113.10"),
                    allowedResponse,
                    new Object()
            )).isTrue();
        }

        MockHttpServletResponse blockedResponse = new MockHttpServletResponse();
        assertThat(interceptor.preHandle(
                request(path, "203.0.113.10"),
                blockedResponse,
                new Object()
        )).isFalse();
        assertThat(blockedResponse.getStatus()).isEqualTo(429);
        assertThat(blockedResponse.getHeader("Retry-After")).isNotBlank();
        assertThat(blockedResponse.getContentAsString()).contains("요청이 너무 많습니다");

        MockHttpServletResponse anotherIpResponse = new MockHttpServletResponse();
        assertThat(interceptor.preHandle(
                request(path, "203.0.113.11"),
                anotherIpResponse,
                new Object()
        )).isTrue();
    }

    @Test
    void aiQuestionLimitIsSeparatedByAuthenticatedUser() throws Exception {
        authenticate(1L);

        for (int count = 0; count < 5; count++) {
            assertThat(interceptor.preHandle(
                    request("/ai/question", "203.0.113.10"),
                    new MockHttpServletResponse(),
                    new Object()
            )).isTrue();
        }

        MockHttpServletResponse blockedResponse = new MockHttpServletResponse();
        assertThat(interceptor.preHandle(
                request("/ai/question", "203.0.113.10"),
                blockedResponse,
                new Object()
        )).isFalse();
        assertThat(blockedResponse.getStatus()).isEqualTo(429);

        authenticate(2L);
        assertThat(interceptor.preHandle(
                request("/ai/question", "203.0.113.10"),
                new MockHttpServletResponse(),
                new Object()
        )).isTrue();
    }

    private MockHttpServletRequest request(String path, String remoteAddress) {
        MockHttpServletRequest request = new MockHttpServletRequest("POST", path);
        request.setRemoteAddr(remoteAddress);
        return request;
    }

    private void authenticate(Long userId) {
        CustomUserDetail principal = mock(CustomUserDetail.class);
        when(principal.getUserId()).thenReturn(userId);

        SecurityContextHolder.getContext().setAuthentication(
                new UsernamePasswordAuthenticationToken(principal, null, List.of())
        );
    }
}
