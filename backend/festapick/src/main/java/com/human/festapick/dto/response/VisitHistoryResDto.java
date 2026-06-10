package com.human.festapick.dto.response;

import lombok.AllArgsConstructor;
import lombok.Getter;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Getter
@AllArgsConstructor
public class VisitHistoryResDto {

    // 방문 기록 ID
    private Long visitHistoryId;

    // 기록 제목
    private String historyTitle;

    // 방문일
    private LocalDate visitDate;

    // 기록 내용
    private String memo;

    // 카드에 출력할 대표 이미지 URL
    // imageUrls 중 첫 번째 이미지를 대표 이미지로 사용
    private String thumbnailUrl;

    // 방문 기록 이미지 URL 목록
    private List<String> imageUrls;

    // 기록 생성일
    private LocalDateTime createdAt;
}