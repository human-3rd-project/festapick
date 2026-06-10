package com.human.festapick.dto.request;

import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
public class UserManageReqDto {
    @NotNull(message = "회원 ID는 필수입니다.")
    private Long userId;

    @NotNull(message = "회원 상태는 필수입니다.")
    private UserStatus status;
}
