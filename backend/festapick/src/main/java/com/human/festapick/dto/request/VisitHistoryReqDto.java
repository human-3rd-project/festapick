package com.human.festapick.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
public class VisitHistoryReqDto {

    // 기록 제목
    @NotBlank(message = "제목을 입력해 주세요.")
    @Size(max = 20, message = "제목은 20자 이하로 입력해 주세요.")
    private String historyTitle;

    // 방문일
    @NotNull(message = "방문일을 선택해 주세요.")
    private LocalDate visitDate;

    // 기록 내용
    private String memo;

    // 방문 기록 이미지 URL 목록
    // Firebase 또는 외부 저장소에 이미지 업로드 후 생성된 URL을 저장할 때 사용
    private List<String> imageUrls;
}
