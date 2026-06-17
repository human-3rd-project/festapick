package com.human.festapick.dto.response;

import com.human.festapick.constant.UserRole;
import lombok.AllArgsConstructor;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@AllArgsConstructor
public class ProfileResDto {

    // 회원 ID
    private Long userId;

    // 이메일
    private String email;

    // 닉네임
    private String nickname;

    // 프로필 이미지 URL
    private String profileImageUrl;

    // 사용자 권한
    private UserRole role;

}