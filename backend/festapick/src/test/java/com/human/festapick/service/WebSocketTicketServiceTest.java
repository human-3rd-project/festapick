package com.human.festapick.service;

import com.human.festapick.exception.CustomException;
import com.human.festapick.security.CustomUserDetail;
import org.junit.jupiter.api.Test;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;

import java.time.Clock;
import java.time.Instant;
import java.time.ZoneOffset;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

class WebSocketTicketServiceTest {

    private static final Instant NOW = Instant.parse("2026-07-27T00:00:00Z");

    @Test
    void ticketCanBeConsumedOnlyOnce() {
        WebSocketTicketService service = new WebSocketTicketService(
                Clock.fixed(NOW, ZoneOffset.UTC)
        );
        Authentication authentication = authentication();

        String ticket = service.issue(authentication);

        assertThat(service.consume(ticket)).contains(authentication);
        assertThat(service.consume(ticket)).isEmpty();
    }

    @Test
    void expiredTicketCannotBeConsumed() {
        Clock clock = mock(Clock.class);
        when(clock.instant()).thenReturn(NOW, NOW.plusSeconds(31));
        WebSocketTicketService service = new WebSocketTicketService(clock);

        String ticket = service.issue(authentication());

        assertThat(service.consume(ticket)).isEmpty();
    }

    @Test
    void unauthenticatedUserCannotIssueTicket() {
        WebSocketTicketService service = new WebSocketTicketService(
                Clock.fixed(NOW, ZoneOffset.UTC)
        );

        assertThatThrownBy(() -> service.issue(null))
                .isInstanceOf(CustomException.class)
                .hasMessage("로그인이 필요한 서비스입니다.");
    }

    private Authentication authentication() {
        CustomUserDetail principal = mock(CustomUserDetail.class);
        return new UsernamePasswordAuthenticationToken(principal, null, List.of());
    }
}
