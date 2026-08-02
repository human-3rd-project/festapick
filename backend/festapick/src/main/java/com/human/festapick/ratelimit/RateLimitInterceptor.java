package com.human.festapick.ratelimit;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.human.festapick.dto.response.ApiResponse;
import com.human.festapick.security.CustomUserDetail;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.time.Clock;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicLong;

@Component
public class RateLimitInterceptor implements HandlerInterceptor {

    private static final String RATE_LIMIT_MESSAGE =
            "요청이 너무 많습니다. 잠시 후 다시 시도해 주세요.";
    private static final Map<Endpoint, Rule> RULES = Map.of(
            new Endpoint("POST", "/auth/login"),
            new Rule("login", 10, 60, false),
            new Endpoint("POST", "/auth/email-verifications/send"),
            new Rule("email-send", 5, 3_600, false),
            new Endpoint("POST", "/auth/email-verifications/verify"),
            new Rule("email-verify", 10, 60, false),
            new Endpoint("POST", "/auth/account/password-reset/request"),
            new Rule("password-reset-request", 5, 3_600, false),
            new Endpoint("POST", "/auth/account/password-reset"),
            new Rule("password-reset", 5, 600, false),
            new Endpoint("POST", "/ai/question"),
            new Rule("ai-question", 5, 3_600, true)
    );

    private final ObjectMapper objectMapper;
    private final Clock clock;
    private final ConcurrentHashMap<String, WindowCounter> counters = new ConcurrentHashMap<>();
    private final AtomicLong lastCleanupEpochSecond = new AtomicLong();

    @Autowired
    public RateLimitInterceptor(ObjectMapper objectMapper) {
        this(objectMapper, Clock.systemUTC());
    }

    RateLimitInterceptor(ObjectMapper objectMapper, Clock clock) {
        this.objectMapper = objectMapper;
        this.clock = clock;
    }

    @Override
    public boolean preHandle(
            HttpServletRequest request,
            HttpServletResponse response,
            Object handler
    ) throws IOException {
        String path = resolvePath(request);
        Rule rule = RULES.get(new Endpoint(request.getMethod(), path));

        if (rule == null) {
            return true;
        }

        long now = clock.instant().getEpochSecond();
        cleanupExpiredCounters(now);

        String identity = resolveIdentity(request, rule.preferAuthenticatedUser());
        String counterKey = rule.id() + ":" + identity;
        WindowCounter counter = counters.compute(
                counterKey,
                (key, current) -> nextCounter(current, rule, now)
        );

        int remaining = Math.max(0, rule.limit() - counter.count());
        response.setHeader("X-RateLimit-Limit", String.valueOf(rule.limit()));
        response.setHeader("X-RateLimit-Remaining", String.valueOf(remaining));

        if (counter.count() <= rule.limit()) {
            return true;
        }

        long retryAfter = Math.max(1, counter.expiresAtEpochSecond() - now);
        response.setStatus(HttpStatus.TOO_MANY_REQUESTS.value());
        response.setHeader("Retry-After", String.valueOf(retryAfter));
        response.setContentType(MediaType.APPLICATION_JSON_VALUE);
        response.setCharacterEncoding(StandardCharsets.UTF_8.name());
        objectMapper.writeValue(response.getWriter(), ApiResponse.fail(RATE_LIMIT_MESSAGE));
        return false;
    }

    private WindowCounter nextCounter(WindowCounter current, Rule rule, long now) {
        if (current == null || current.expiresAtEpochSecond() <= now) {
            return new WindowCounter(now + rule.windowSeconds(), 1);
        }

        int nextCount = Math.min(current.count() + 1, rule.limit() + 1);
        return new WindowCounter(current.expiresAtEpochSecond(), nextCount);
    }

    private String resolveIdentity(HttpServletRequest request, boolean preferAuthenticatedUser) {
        if (preferAuthenticatedUser) {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

            if (authentication != null
                    && authentication.getPrincipal() instanceof CustomUserDetail userDetail) {
                return "user:" + userDetail.getUserId();
            }
        }

        String remoteAddress = request.getRemoteAddr();
        return "ip:" + (remoteAddress == null || remoteAddress.isBlank() ? "unknown" : remoteAddress);
    }

    private String resolvePath(HttpServletRequest request) {
        String requestUri = request.getRequestURI();
        String contextPath = request.getContextPath();

        if (contextPath != null
                && !contextPath.isBlank()
                && requestUri.startsWith(contextPath)) {
            return requestUri.substring(contextPath.length());
        }

        return requestUri;
    }

    private void cleanupExpiredCounters(long now) {
        long lastCleanup = lastCleanupEpochSecond.get();

        if (now - lastCleanup < 60
                || !lastCleanupEpochSecond.compareAndSet(lastCleanup, now)) {
            return;
        }

        counters.entrySet().removeIf(entry -> entry.getValue().expiresAtEpochSecond() <= now);
    }

    private record Endpoint(String method, String path) {
    }

    private record Rule(
            String id,
            int limit,
            long windowSeconds,
            boolean preferAuthenticatedUser
    ) {
    }

    private record WindowCounter(long expiresAtEpochSecond, int count) {
    }
}
