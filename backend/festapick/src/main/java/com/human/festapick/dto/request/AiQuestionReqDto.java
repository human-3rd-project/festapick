package com.human.festapick.dto.request;

import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
public class AiQuestionReqDto {

    private String question;

    private String ldongRegnCd;

    private String ldongSignguCd;

    private String regionName;
}
