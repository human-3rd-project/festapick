package com.human.festapick.dto.request;

import jakarta.validation.constraints.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class ReviewReqDto {
  // user - Service에서 id로 조회
  // review_id - AUTO_INCREMENT
  // created_at, updated_at - 자동 입력
  // status - default ACTIVE

  @NotNull
  private Long festivalId;

  @NotNull
  @Min(0)
  @Max(5)
  private Integer rating;

  @NotBlank
  private String content;
}
