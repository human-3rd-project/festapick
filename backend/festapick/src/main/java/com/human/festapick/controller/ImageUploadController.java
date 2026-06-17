package com.human.festapick.controller;

import com.human.festapick.dto.response.ApiResponse;
import com.human.festapick.exception.CustomException;
import com.human.festapick.security.CustomUserDetail;
import com.human.festapick.service.ImageUploadService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/uploads")
@RequiredArgsConstructor
public class ImageUploadController {

    private final ImageUploadService imageUploadService;

    @PostMapping("/images")
    public ResponseEntity<ApiResponse<String>> uploadImage(
            @AuthenticationPrincipal CustomUserDetail userDetail,
            @RequestParam(value = "file", required = false) MultipartFile file
    ) {
        String imageUrl = imageUploadService.uploadImage(getUserId(userDetail), file);

        return ResponseEntity.ok(ApiResponse.ok("이미지 업로드가 완료되었습니다.", imageUrl));
    }

    private Long getUserId(CustomUserDetail userDetail) {
        if (userDetail == null) {
            throw new CustomException(HttpStatus.UNAUTHORIZED, "로그인이 필요한 서비스입니다.");
        }

        return userDetail.getUserId();
    }
}
