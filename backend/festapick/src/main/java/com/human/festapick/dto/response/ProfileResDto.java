package com.human.festapick.dto.response;

import com.human.festapick.constant.OAuthProvider;
import com.human.festapick.constant.UserRole;
import lombok.AllArgsConstructor;
import lombok.Getter;

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

    // 로그인 제공자
    private OAuthProvider provider;

    // 사용자 활동 지역 시도 코드
    private String ldongRegnCd;

    // 사용자 활동 지역 시군구 코드
    private String ldongSignguCd;

}
