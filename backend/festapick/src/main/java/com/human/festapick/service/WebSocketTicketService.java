package com.human.festapick.service;

import com.human.festapick.exception.CustomException;
import com.human.festapick.security.CustomUserDetail;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

import java.security.SecureRandom;
import java.time.Clock;
import java.time.Instant;
import java.util.Base64;
import java.util.Optional;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class WebSocketTicketService {

    private static final long TICKET_VALID_SECONDS = 30;
    private static final int TICKET_BYTE_LENGTH = 32;

    private final ConcurrentHashMap<String, TicketEntry> tickets = new ConcurrentHashMap<>();
    private final SecureRandom secureRandom = new SecureRandom();
    private final Clock clock;

    public WebSocketTicketService() {
        this(Clock.systemUTC());
    }

    WebSocketTicketService(Clock clock) {
        this.clock = clock;
    }

    public String issue(Authentication authentication) {
        validateAuthentication(authentication);

        Instant now = clock.instant();
        tickets.entrySet().removeIf(entry -> !entry.getValue().expiresAt().isAfter(now));

        TicketEntry ticketEntry = new TicketEntry(
                authentication,
                now.plusSeconds(TICKET_VALID_SECONDS)
        );

        while (true) {
            String ticket = generateTicket();

            if (tickets.putIfAbsent(ticket, ticketEntry) == null) {
                return ticket;
            }
        }
    }

    public Optional<Authentication> consume(String ticket) {
        if (ticket == null || ticket.isBlank()) {
            return Optional.empty();
        }

        TicketEntry ticketEntry = tickets.remove(ticket);

        if (ticketEntry == null || !ticketEntry.expiresAt().isAfter(clock.instant())) {
            return Optional.empty();
        }

        return Optional.of(ticketEntry.authentication());
    }

    private void validateAuthentication(Authentication authentication) {
        if (authentication == null
                || !authentication.isAuthenticated()
                || !(authentication.getPrincipal() instanceof CustomUserDetail)) {
            throw new CustomException(HttpStatus.UNAUTHORIZED, "로그인이 필요한 서비스입니다.");
        }
    }

    private String generateTicket() {
        byte[] bytes = new byte[TICKET_BYTE_LENGTH];
        secureRandom.nextBytes(bytes);
        return Base64.getUrlEncoder().withoutPadding().encodeToString(bytes);
    }

    private record TicketEntry(Authentication authentication, Instant expiresAt) {
    }
}
