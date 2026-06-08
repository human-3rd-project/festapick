package com.human.festapick.exception;

import lombok.Getter;
import org.springframework.http.HttpStatus;

@Getter
public class CustomException extends RuntimeException {
    private final HttpStatus status;   // HTTP 상태 코드
    private final String message;      // 에러 메시지
    public CustomException(HttpStatus status, String message) {
        super(message);  // 부모의 매개변수가 있는 생성자 호출
        this.status = status;
        this.message = message;
    }
}