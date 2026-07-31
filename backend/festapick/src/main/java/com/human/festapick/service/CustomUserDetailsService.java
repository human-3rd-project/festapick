package com.human.festapick.service;

import java.util.Collections;

import com.human.festapick.entity.Users;
import com.human.festapick.exception.CustomException;
import com.human.festapick.repository.UserRepository;
import com.human.festapick.security.CustomUserDetail;
import org.springframework.http.HttpStatus;
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

  private final UserRepository userRepository;

  @Override
  public UserDetails loadUserByUsername(String loginId) throws UsernameNotFoundException {
    Users user = userRepository.findByLoginId(loginId)
            .orElseThrow(() -> new CustomException(HttpStatus.NOT_FOUND, "사용자를 찾을수 없습니다"));
    return createUserDetails(user);
  }

  // 확인 필요 2
  private UserDetails createUserDetails(Users user) {
    GrantedAuthority authority = new SimpleGrantedAuthority("ROLE_" + user.getRole().name());

    return new CustomUserDetail(
            user,
            Collections.singleton(authority)
    );
  }

}
