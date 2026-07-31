package com.human.festapick.dto.response;

import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@Builder
public class DonationManageResDto {
    private Long donationId;

    private String nickname;

    private String email;

    private String profileImageUrl;

    private Integer amount;

    private LocalDateTime approvedAt;

    private String orderId;
}
