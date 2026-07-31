package com.human.festapick.controller;

import com.human.festapick.dto.response.ApiResponse;
import com.human.festapick.dto.response.NotificationResDto;
import com.human.festapick.entity.Notification;
import com.human.festapick.exception.CustomException;
import com.human.festapick.security.CustomUserDetail;
import com.human.festapick.service.NotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Slice;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDateTime;

@RestController
@RequestMapping("/notifications")
@RequiredArgsConstructor
public class NotificationController {

    private final NotificationService notificationService;

    @GetMapping
    public ResponseEntity<ApiResponse<Slice<NotificationResDto>>> getNotificationList(
            @AuthenticationPrincipal CustomUserDetail userDetail,
            @RequestParam(defaultValue = "10") int size
    ) {
        Slice<NotificationResDto> notifications = notificationService
                .getNotificationList(getUserId(userDetail), size)
                .map(NotificationResDto::from);

        return ResponseEntity.ok(ApiResponse.ok(notifications));
    }

    @GetMapping("/unread-count")
    public ResponseEntity<ApiResponse<Long>> getUnreadCount(
            @AuthenticationPrincipal CustomUserDetail userDetail
    ) {
        long unreadCount = notificationService.getUnreadCount(getUserId(userDetail));

        return ResponseEntity.ok(ApiResponse.ok(unreadCount));
    }

    @PatchMapping("/{notificationId}/read")
    public ResponseEntity<ApiResponse<Void>> markAsRead(
            @AuthenticationPrincipal CustomUserDetail userDetail,
            @PathVariable Long notificationId
    ) {
        notificationService.markAsRead(notificationId, getUserId(userDetail));

        return ResponseEntity.ok(ApiResponse.<Void>ok("알림을 읽음 처리했습니다.", null));
    }

    @GetMapping("/festival-start")
    public ResponseEntity<ApiResponse<Slice<NotificationResDto>>> getFestivalStartNotifications(
            @AuthenticationPrincipal CustomUserDetail userDetail,
            @RequestParam(defaultValue = "10") int size
    ) {
        Slice<NotificationResDto> notifications = notificationService
                .getFestivalStartNotifications(getUserId(userDetail), size)
                .map(NotificationResDto::from);

        return ResponseEntity.ok(ApiResponse.ok(notifications));
    }

    @GetMapping("/system")
    public ResponseEntity<ApiResponse<Slice<NotificationResDto>>> getSystemNotifications(
            @AuthenticationPrincipal CustomUserDetail userDetail,
            @RequestParam(defaultValue = "10") int size
    ) {
        Slice<NotificationResDto> notifications = notificationService
                .getSystemNotifications(getUserId(userDetail), size)
                .map(NotificationResDto::from);

        return ResponseEntity.ok(ApiResponse.ok(notifications));
    }

    private Long getUserId(CustomUserDetail userDetail) {
        if (userDetail == null) {
            throw new CustomException(HttpStatus.UNAUTHORIZED, "로그인이 필요합니다.");
        }
        return userDetail.getUserId();
    }
}
