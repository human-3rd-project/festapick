package com.human.festapick.entity;

import com.human.festapick.constant.NotificationType;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(
        name = "notifications",
        uniqueConstraints = {
                @UniqueConstraint(
                        name = "uk_notification_festival_alarm",
                        columnNames = {
                                "user_id",
                                "reference_type",
                                "reference_id",
                                "notify_before_minutes"
                        }
                )
        }
)
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Builder

public class Notification {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "notification_id")
    private Long notificationId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private Users users;

    @Column(name = "title", nullable = false, length = 100)
    private String title;

    @Column(name = "content", nullable = false, length = 255)
    private String content;

    @Enumerated(EnumType.STRING)
    @Column(name = "notification_type", nullable = false, length = 30)
    private NotificationType notificationType;

    @Column(name = "reference_type", length = 30)
    private String referenceType;

    @Column(name = "reference_id")
    private Long referenceId;

    @Column(name = "notify_before_minutes")
    private Integer notifyBeforeMinutes;

    @Column(name = "read_status", nullable = false)
    private Boolean readStatus;

    @Column(name = "read_at")
    private LocalDateTime readAt;

    @Column(name = "target_url", length = 500)
    private String targetUrl;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();

        if (readStatus == null) {
            this.readStatus = false;
        }
    }

    public void markAsRead() {
        this.readStatus = true;
        this.readAt = LocalDateTime.now();
    }
}

}
