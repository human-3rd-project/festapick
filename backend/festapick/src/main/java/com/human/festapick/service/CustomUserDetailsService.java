package com.human.festapick.service;

import java.util.Collections;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class CustomUserDetailsService implements UserDetailsService {
  private final MemberRepository memberRepository;

  @Override
  public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
    // 확인 필요 1
    return memberRepository.findByEmail(username)
        .map(this::createuserDetails)
        .orElseThrow(() -> new UsernameNotFoundException(username + " 을 찾을 수 없습니다."));
  }

  // 확인 필요 2
  private UserDetails createUserDetails(Members member) {
    GrantedAuthority authority = new SimpleGrantedAuthority(member.getRole().toString());

    return new User(String.valueOf(member.getId()),
        member.getPassword(),
        Collections.singleton(authority)
    );
  }

}
