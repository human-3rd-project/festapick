package com.human.festapick.dto.response;

import com.human.festapick.constant.UserRole;
import com.human.festapick.constant.UserStatus;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@Builder
public class UserManageResDto {
    private Long userId;

    private String nickname;

    private String email;

    private UserStatus status;

    private UserRole role;

    private LocalDateTime createdAt;
}
