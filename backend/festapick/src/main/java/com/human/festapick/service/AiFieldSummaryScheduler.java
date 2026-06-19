package com.human.festapick.service;

import com.human.festapick.entity.ChatRooms;
import com.human.festapick.repository.ChatRoomRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

@Slf4j
@Component
@RequiredArgsConstructor
public class AiFieldSummaryScheduler {

    private final ChatRoomRepository chatRoomRepository;
    private final AiService aiService;

    @Scheduled(cron = "0 */30 * * * *", zone = "Asia/Seoul")
    public void runAiFieldSummaryScheduler() {
        int createdCount = 0;

        for (ChatRooms chatRoom : chatRoomRepository.findByActiveTrue()) {
            try {
                if (aiService.createFieldSummaryIfNeeded(chatRoom.getChatRoomId())) {
                    createdCount++;
                }
            } catch (RuntimeException e) {
                log.warn(
                        "AI 현장 요약 스케줄러 처리 실패. chatRoomId={}, reason={}",
                        chatRoom.getChatRoomId(),
                        e.getMessage()
                );
            }
        }

        log.info("AI 현장 요약 스케줄러 완료. createdCount={}", createdCount);
    }
}
