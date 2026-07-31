package com.human.festapick.security;

import com.human.festapick.constant.UserStatus;
import com.human.festapick.entity.Users;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;

@Getter
@RequiredArgsConstructor
public class CustomUserDetail implements UserDetails {

    private final Users user;
    private final Collection<? extends GrantedAuthority> authorities;

    public String getEmail() {
        return user.getEmail();
    }

    public String getNickname() {
        return user.getNickname();
    }

    public Long getUserId(){
        return user.getUserId();
    }

    public String getLoginId() {
        return user.getLoginId();
    }

    public String getProfileImageUrl(){
        return user.getProfileImageUrl();
    }

    public String getRole() {
        return user.getRole().name();
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return authorities;
    }

    @Override
    public String getPassword() {
        return user.getPassword();
    }

    @Override
    public String getUsername() {
        return user.getLoginId();
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return user.getStatus() == UserStatus.ACTIVE;
    }
}