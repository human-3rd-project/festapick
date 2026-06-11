package com.human.festapick.repository;

import java.util.List;

import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Slice;
import org.springframework.data.jpa.repository.JpaRepository;

import com.human.festapick.constant.NotificationType;
import com.human.festapick.entity.Notification;

public interface NotificationRepository extends JpaRepository<Notification, Long> {
  // 알림 목록 조회
  Slice<Notification> findByUsers_UserIdOrderByCreatedAtDesc(
    Long userId,
    Pageable pageable
  );

  // 읽지 않은 알림 개수 (알림 읽음 처리 - Service)
  long countByUsers_UserIdAndReadStatusFalse(Long userId);

  // 축제 시작 알림 조회
  Slice<Notification> findByUsers_UserIdAndNotificationTypeOrderByCreatedAtDesc(
    Long userId,
    NotificationType notificationType,
    Pageable pageable
  );

  // 시스템 알림 조회
  List<Notification> findByReferenceTypeAndReferenceIdAndNotificationType(
    String referenceType,
    Long referenceId,
    NotificationType notificationType
  );
  
  // 중복 알림 확인
  boolean existsByUsers_UserIdAndReferenceTypeAndReferenceIdAndNotifyBeforeMinutes(
    Long userId,
    String referenceType,
    Long referenceId,
    Integer notifyBeforeMinutes
  );
}
