package com.human.festapick.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
@AllArgsConstructor
public class DonationStatisticsResDto {
    // 총 후원 금액
    private Long totalDonationAmount;

    // 총 후원 참여자 수
    private Long totalDonorCount;
}
