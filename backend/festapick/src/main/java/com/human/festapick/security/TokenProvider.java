package com.human.festapick.security;

import io.jsonwebtoken.*;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.oauth2.jose.jws.SignatureAlgorithm;
import org.springframework.stereotype.Component;

import java.security.Key;
import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.Collection;
import java.util.Date;
import java.util.stream.Collectors;

@Component
@Slf4j
public class TokenProvider {
  private static final String AUTHORITIES_KEY = "auth";
  private static final long ACCESS_TOKEN_EXPIRE_TIME = 1000L * 60 * 60;
  private static final long REFRESH_TOKEN_EXPIRE_TIME = 1000L * 60 * 60 * 24 * 7;
  private final Key key;

  // application.properties jwt.secret 자동 주입
  public TokenProvider(@Value("${jwt.secret}") String secretKey) {
    byte[] keyBytes = Decoders.BASE64.decode(secretKey);
    this.key = Keys.hmacShaKeyFor(keyBytes);
  }

  // 토큰 생성
  public TokenDto generateTokenDto(Authentication authentication) {
    String authorities = authentication.getAuthorities().stream()
      .map(GrantedAuthority::getAuthority)
      .collect(Collectors.joining(",")
    );

    long now = (new Date().getTime());

    String accessToken = Jwts.builder()
      .setSubject(authentication.getName())
      .claim(AUTHORITIES_KEY, authorities)
      .setExpiration(new Date(now + ACCESS_TOKEN_EXPIRE_TIME))
      .signWith(key, SignatureAlgorithm.HS512)
      .compact();

    String refreshToken = Jwts.builder()
      .setExpiration(new Date(now + REFRESH_TOKEN_EXPIRE_TIME))
      .signWith(key, SignatureAlgorithm.HS512)
      .compact();

    return TokenDto.builder()
      .grantType("Bearer")
      .accessToken(accessToken)
      .refreshToken(refreshToken)
      .accessTokenExpiresIn(now + ACCESS_TOKEN_EXPIRE_TIME)
      .build();
  }

  // 토큰 → Authentification 객체 변환
  public Authentication getAuthentication(String accessToken) {
    Claims claims = parseClaims(accessToken);

    if (claims.get(AUTHORITIES_KEY) == null) {
        throw new RuntimeException("권한 정보가 없는 토큰입니다.");
    }

    Collection<? extends GrantedAuthority> authorities =
            Arrays.stream(claims.get(AUTHORITIES_KEY).toString().split(","))
                    .map(SimpleGrantedAuthority::new)
                    .collect(Collectors.toList());

    UserDetails principal = new User(claims.getSubject(), "", authorities);
    return new UsernamePasswordAuthenticationToken(principal, accessToken, authorities);
  }

  // 토큰 유효성 검증
  public boolean validateToken(String token) {
    try {
        Jwts.parserBuilder().setSigningKey(key).build().parseClaimsJws(token);
        return true;
    } catch (SecurityException | MalformedJwtException e) {
        log.info("잘못된 JWT 서명입니다.");
    } catch (ExpiredJwtException e) {
        log.info("만료된 JWT 토큰입니다.");
    } catch (UnsupportedJwtException e) {
        log.info("지원되지 않는 JWT 토큰입니다.");
    } catch (IllegalArgumentException e) {
        log.info("JWT 토큰이 잘못되었습니다.");
    }
    return false;
  }

  // 만료된 Access Token 에서 memberId 추출
  public Long getMemberIdFromToken(String accessToken) {
    Claims claims = parseClaims(accessToken);
    return Long.parseLong(claims.getSubject());
  }

  // Refresh Token DB 저장용 만료 시각 반환
  public LocalDateTime getRefreshTokenExpiry() {
    return LocalDateTime.now().plusDays(7); // 현재 시간 + 7일
  }

  private Claims parseClaims(String accessToken) {
    try {
      return Jwts.parserBuilder().setSigningKey(key).build()
        .parseClaimsJws(accessToken).getBody();
    } catch (ExpiredJwtException e) {
      return e.getClaims(); // 만료 토큰도 Claims 추출은 가능
    }
  }
}
