package com.human.festapick.dto.response;

import com.human.festapick.controller.NotificationController;
import com.human.festapick.entity.Notification;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Builder
@Setter
public class NotificationResDto {
    private Long notificationId;
    private String title;
    private String content;
    private String notificationType;
    private String referenceType;
    private Long referenceId;
    private Integer notifyBeforeMinutes;
    private Boolean readStatus;
    private LocalDateTime readAt;
    private String targetUrl;
    private LocalDateTime createdA;

    public static NotificationResDto from(Notification notification) {
        return new NotificationResDto(
                notification.getNotificationId(),
                notification.getTitle(),
                notification.getContent(),
                notification.getNotificationType().name(),
                notification.getReferenceType(),
                notification.getReferenceId(),
                notification.getNotifyBeforeMinutes(),
                notification.getReadStatus(),
                notification.getReadAt(),
                notification.getTargetUrl(),
                notification.getCreatedAt()
        );
    }
}
