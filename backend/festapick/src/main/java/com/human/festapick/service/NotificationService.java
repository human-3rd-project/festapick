package com.human.festapick.service;

import com.human.festapick.constant.FestivalStatus;
import com.human.festapick.constant.NotificationType;
import com.human.festapick.entity.Favorites;
import com.human.festapick.entity.Festivals;
import com.human.festapick.entity.Notification;
import com.human.festapick.entity.Users;
import com.human.festapick.repository.FavoriteRepository;
import com.human.festapick.repository.NotificationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Slice;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.ZoneId;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class NotificationService {

    /*
     * 알림 조회/저장/읽음 처리용 Repository.
     */
    private final NotificationRepository notificationRepository;

    /*
     * 찜한 축제 조회용 Repository.
     *
     * 날짜 알림은 "사용자가 찜한 축제" 기준으로 만들어야 하므로 필요함.
     */
    private final FavoriteRepository favoriteRepository;

    /*
     * referenceType에 저장할 고정값.
     *
     * 이 알림이 어떤 대상과 연결된 알림인지 표시하는 값.
     * 축제 알림이므로 "FESTIVAL"로 저장.
     */
    private static final String REFERENCE_TYPE_FESTIVAL = "FESTIVAL";

    /*
     * 오늘 시작 알림 구분값.
     *
     * notifyBeforeMinutes = 0
     * 뜻: 축제 시작 당일 알림
     */
    private static final int TODAY_NOTIFY_MINUTES = 0;

    /*
     * 2일 전 알림 구분값.
     *
     * 2일 = 48시간
     * 48 * 60 = 2880분
     */
    private static final int TWO_DAYS_BEFORE_NOTIFY_MINUTES = 2880;

    /**
     * 알림 목록 조회
     *
     * 헤더 알림 아이콘 클릭 시 보여줄 전체 알림 목록.
     */
    @Transactional(readOnly = true)
    public Slice<Notification> getNotificationList(Long userId, int size) {

        if (userId == null) {
            throw new IllegalArgumentException("사용자 ID가 필요합니다.");
        }

        int pageSize = size <= 0 ? 10 : size;

        return notificationRepository.findByUsers_UserIdOrderByCreatedAtDesc(
                userId,
                PageRequest.of(0, pageSize)
        );
    }

    /**
     * 읽지 않은 알림 개수 조회
     *
     * 헤더 알림 아이콘 위에 표시되는 숫자 뱃지용.
     */
    @Transactional(readOnly = true)
    public long getUnreadCount(Long userId) {

        if (userId == null) {
            throw new IllegalArgumentException("사용자 ID가 필요합니다.");
        }

        return notificationRepository.countByUsers_UserIdAndReadStatusFalse(userId);
    }

    /**
     * 알림 읽음 처리
     *
     * 사용자가 알림을 클릭하거나 알림창을 확인했을 때 사용.
     */
    public void markAsRead(Long notificationId, Long userId) {

        if (notificationId == null) {
            throw new IllegalArgumentException("알림 ID가 필요합니다.");
        }

        if (userId == null) {
            throw new IllegalArgumentException("사용자 ID가 필요합니다.");
        }

        Notification notification = notificationRepository.findById(notificationId)
                .orElseThrow(() -> new IllegalArgumentException("알림을 찾을 수 없습니다."));

        if (!notification.getUsers().getUserId().equals(userId)) {
            throw new IllegalArgumentException("본인의 알림만 읽음 처리할 수 있습니다.");
        }

        notification.markAsRead();
    }

    /**
     * 축제 시작 알림 조회
     *
     * NotificationType enum 기준:
     * - FESTIVAL 사용
     */
    @Transactional(readOnly = true)
    public Slice<Notification> getFestivalStartNotifications(Long userId, int size) {

        if (userId == null) {
            throw new IllegalArgumentException("사용자 ID가 필요합니다.");
        }

        int pageSize = size <= 0 ? 10 : size;

        return notificationRepository.findByUsers_UserIdAndNotificationTypeOrderByCreatedAtDesc(
                userId,
                NotificationType.FESTIVAL,
                PageRequest.of(0, pageSize)
        );
    }

    /**
     * 시스템 알림 조회
     *
     * NotificationType enum 기준:
     * - SYSTEM 사용
     */
    @Transactional(readOnly = true)
    public Slice<Notification> getSystemNotifications(Long userId, int size) {

        if (userId == null) {
            throw new IllegalArgumentException("사용자 ID가 필요합니다.");
        }

        int pageSize = size <= 0 ? 10 : size;

        return notificationRepository.findByUsers_UserIdAndNotificationTypeOrderByCreatedAtDesc(
                userId,
                NotificationType.SYSTEM,
                PageRequest.of(0, pageSize)
        );
    }

    /**
     * 날짜 알림 자동 실행 메서드
     *
     * 새 Scheduler 파일을 만들지 않고,
     * NotificationService 안에서 직접 매일 오전 9시에 실행되게 하는 방식.
     *
     * cron = "0 0 9 * * *"
     *
     * 순서:
     * 초 분 시 일 월 요일
     *
     * 뜻:
     * 매일 오전 9시 0분 0초에 실행.
     */
    @Scheduled(cron = "0 0 9 * * *", zone = "Asia/Seoul")
    public void runFestivalStartNotificationScheduler() {

        LocalDate today = LocalDate.now(ZoneId.of("Asia/Seoul"));

        List<Notification> createdNotifications = createFestivalStartNotifications(today);

        System.out.println("[NotificationService] 생성된 축제 시작 알림 개수: " + createdNotifications.size());
    }

    /**
     * 축제 시작 알림 자동 생성
     *
     * 이 메서드는 위의 @Scheduled 메서드가 호출함.
     *
     * 예:
     * today = 2026-06-12
     *
     * 1. 2026-06-12에 시작하는 찜한 축제 조회
     *    → "찜한 축제가 오늘 시작합니다." 알림 생성
     *
     * 2. 2026-06-14에 시작하는 찜한 축제 조회
     *    → "찜한 축제가 2일 뒤 시작합니다." 알림 생성
     *
     * @param today 스케줄러 실행 기준 날짜
     * @return 새로 생성된 알림 목록
     */
    public List<Notification> createFestivalStartNotifications(LocalDate today) {

        if (today == null) {
            throw new IllegalArgumentException("기준 날짜가 필요합니다.");
        }

        List<Notification> createdNotifications = new ArrayList<>();

        /*
         * 오늘 시작하는 축제 알림 생성.
         */
        createdNotifications.addAll(
                createFestivalNotificationsByDate(
                        today,
                        TODAY_NOTIFY_MINUTES,
                        "찜한 축제가 오늘 시작합니다.",
                        "오늘 시작합니다."
                )
        );

        /*
         * 2일 뒤 시작하는 축제 알림 생성.
         *
         * today.plusDays(2)
         * = 오늘 기준 2일 뒤 날짜.
         */
        createdNotifications.addAll(
                createFestivalNotificationsByDate(
                        today.plusDays(2),
                        TWO_DAYS_BEFORE_NOTIFY_MINUTES,
                        "찜한 축제가 곧 시작합니다.",
                        "2일 뒤 시작합니다."
                )
        );

        /*
         * 최종적으로 새로 생성된 알림 객체 목록을 반환.
         */

        return createdNotifications;
    }

    /**
     * 특정 날짜에 시작하는 축제를 찜한 사용자들에게 알림 생성
     *
     * @param targetDate 축제 시작일 기준 날짜
     * @param notifyBeforeMinutes 당일 알림이면 0, 2일 전 알림이면 2880
     * @param title 알림 제목
     * @param contentSuffix 알림 내용 뒤에 붙일 문장
     * @return 새로 생성된 알림 개수
     */
    private List<Notification> createFestivalNotificationsByDate(
            LocalDate targetDate,
            int notifyBeforeMinutes,
            String title,
            String contentSuffix
    ) {

        /*
         * 특정 날짜에 시작하는 ACTIVE 축제를 찜한 목록 조회.
         *
         * 예:
         * targetDate = 오늘
         * → 오늘 시작하는 축제를 찜한 사람 목록
         *
         * targetDate = 오늘 + 2일
         * → 2일 뒤 시작하는 축제를 찜한 사람 목록
         */
        List<Favorites> favorites =
                favoriteRepository.findFavoritesForFestivalStartNotification(
                        targetDate,
                        FestivalStatus.ACTIVE
                );

        /*
         * 새로 생성된 알림 객체들을 담을 리스트.
         *
         * 기존에는 int createdCount로 개수만 세었지만,
         * 이제는 실제 저장된 Notification 객체를 담아서 반환할 거야.
         */
        List<Notification> createdNotifications = new ArrayList<>();

        for (Favorites favorite : favorites) {

            Users user = favorite.getUsers();
            Festivals festival = favorite.getFestivals();

            Long userId = user.getUserId();
            Long festivalId = festival.getFestivalId();

            /*
             * 이미 같은 알림이 만들어졌는지 확인.
             *
             * 같은 사용자 + 같은 축제 + 같은 알림 시점이면 중복으로 만들지 않음.
             */
            boolean alreadyExists =
                    notificationRepository.existsByUsers_UserIdAndReferenceTypeAndReferenceIdAndNotifyBeforeMinutes(
                            userId,
                            REFERENCE_TYPE_FESTIVAL,
                            festivalId,
                            notifyBeforeMinutes
                    );

            if (alreadyExists) {
                continue;
            }

            /*
             * 실제 알림 생성.
             */
            Notification notification = Notification.builder()
                    .users(user)
                    .title(title)
                    .content(festival.getTitle() + " 축제가 " + contentSuffix)
                    .notificationType(NotificationType.FESTIVAL)
                    .referenceType(REFERENCE_TYPE_FESTIVAL)
                    .referenceId(festivalId)
                    .notifyBeforeMinutes(notifyBeforeMinutes)
                    .readStatus(false)
                    .targetUrl("/detail/" + festivalId)
                    .build();

            /*
             * DB에 알림 저장.
             *
             * save(notification)의 결과를 savedNotification에 담는 이유:
             * DB에 저장된 알림 객체를 리스트에 넣어서 반환하기 위해서.
             */
            Notification savedNotification = notificationRepository.save(notification);

            /*
             * 새로 생성된 알림 목록에 추가.
             */
            createdNotifications.add(savedNotification);
        }

        /*
         * 생성된 알림 객체 목록 반환.
         */
        return createdNotifications;
    }
}