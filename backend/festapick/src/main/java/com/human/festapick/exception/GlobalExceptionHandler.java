package com.human.festapick.exception;

import com.human.festapick.dto.response.ApiResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.stream.Collectors;

@Slf4j
@RestControllerAdvice   // 모든 @RestController에 적용
public class GlobalExceptionHandler {
    // 1. 비즈니스 예외 처리 : CustomException 처리, 서비스 레이어에서 직접 던지 비즈니스 예외를 처리
    @ExceptionHandler(CustomException.class)
    public ResponseEntity<ApiResponse<Void>> handleCustomException(CustomException e) {
        log.warn("CustomException: {}", e.getMessage());
        return ResponseEntity.status(e.getStatus())
                .body(ApiResponse.fail(e.getMessage()));
    }

    // 2. @Valid 검증 실패 처리 : @Valid를 붙인 DTO가 검증에 실패 했을 때 Spring이 자동으로 던지 예외
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ApiResponse<Void>> handleValidation(MethodArgumentNotValidException e) {
        String msg = e.getBindingResult().getFieldErrors().stream()
                .map(FieldError::getDefaultMessage)
                .collect(Collectors.joining(", "));
        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(ApiResponse.fail(msg));
    }

    // 3. 예상치 못한 서버 에러 : 위의 두 핸들러가 처리하지 못한 모든 나머지 예외를 처리
    @ExceptionHandler(Exception.class)
    public ResponseEntity<ApiResponse<Void>> handleException(Exception e) {
        log.error("Unhandled Exception: ", e);
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(ApiResponse.fail("서버 내부 오류가 발생했습니다."));
    }

}