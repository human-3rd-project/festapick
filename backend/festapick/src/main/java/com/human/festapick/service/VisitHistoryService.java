package com.human.festapick.service;

import com.human.festapick.dto.request.VisitHistoryReqDto;
import com.human.festapick.dto.response.VisitHistoryResDto;
import com.human.festapick.entity.Users;
import com.human.festapick.entity.VisitHistories;
import com.human.festapick.entity.VisitHistoryImages;
import com.human.festapick.repository.UserRepository;
import com.human.festapick.repository.VisitHistoryImageRepository;
import com.human.festapick.repository.VisitHistoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class VisitHistoryService {

    private final VisitHistoryRepository visitHistoryRepository;
    private final VisitHistoryImageRepository visitHistoryImageRepository;
    private final UserRepository userRepository;

    // 방문 기록 등록
    @Transactional
    public VisitHistoryResDto createVisitHistory(Long userId, VisitHistoryReqDto reqDto) {
        // 회원 조회
        Users user = getUser(userId);

        // 방문 기록 Entity 생성
        VisitHistories visitHistory = VisitHistories.builder()
                .users(user)
                .historyTitle(reqDto.getHistoryTitle())
                .visitDate(reqDto.getVisitDate())
                .memo(reqDto.getMemo())
                .build();

        // 방문 기록 저장
        VisitHistories savedVisitHistory = visitHistoryRepository.save(visitHistory);

        // 이미지 URL 목록 정리
        List<String> imageUrls = normalizeImageUrls(reqDto.getImageUrls());

        // 방문 기록 이미지 저장
        saveImages(savedVisitHistory, imageUrls);

        // 응답 DTO 변환
        return toDto(savedVisitHistory, imageUrls);
    }

    // 캘린더 - 특정 기간 방문 기록 목록 조회
    public List<VisitHistoryResDto> getVisitHistoryList(
            Long userId,
            LocalDate startDate,
            LocalDate endDate
    ) {
        // 특정 사용자의 특정 기간 방문 기록 목록 조회
        List<VisitHistories> visitHistories =
                visitHistoryRepository.findByUsers_UserIdAndVisitDateBetweenOrderByVisitDateAscCreatedAtAsc(
                        userId,
                        startDate,
                        endDate
                );

        // 방문 기록이 없으면 빈 리스트 반환
        if (visitHistories.isEmpty()) {
            return List.of();
        }

        // 방문 기록 목록을 응답 DTO 목록으로 변환
        List<VisitHistoryResDto> result = new ArrayList<>();

        for (VisitHistories visitHistory : visitHistories) {
            List<String> imageUrls =
                    visitHistoryImageRepository.findImageUrlsByVisitHistoryId(
                            visitHistory.getVisitHistoryId()
                    );

            result.add(toDto(visitHistory, imageUrls));
        }

        return result;
    }

    // 방문 기록 상세 조회
    public VisitHistoryResDto getVisitHistory(Long userId, Long visitHistoryId) {
        // 방문 기록 ID와 사용자 ID를 함께 사용해서 본인 기록만 조회
        VisitHistories visitHistory = getVisitHistoryByUser(visitHistoryId, userId);

        // 해당 방문 기록의 이미지 URL 목록 조회
        List<String> imageUrls =
                visitHistoryImageRepository.findImageUrlsByVisitHistoryId(visitHistoryId);

        // 응답 DTO 변환
        return toDto(visitHistory, imageUrls);
    }

    // 방문 기록 수정
    @Transactional
    public VisitHistoryResDto updateVisitHistory(
            Long userId,
            Long visitHistoryId,
            VisitHistoryReqDto reqDto
    ) {
        // 방문 기록 ID와 사용자 ID를 함께 사용해서 본인 기록만 조회
        VisitHistories visitHistory = getVisitHistoryByUser(visitHistoryId, userId);

        // 방문 기록 제목, 방문일, 메모 수정
        visitHistory.updateHistory(
                reqDto.getHistoryTitle(),
                reqDto.getVisitDate(),
                reqDto.getMemo()
        );

        // 기존 이미지 전체 삭제
        visitHistoryImageRepository.deleteByVisitHistories_VisitHistoryIdAndVisitHistories_Users_UserId(
                visitHistoryId,
                userId
        );

        // 새 이미지 URL 목록 정리
        List<String> imageUrls = normalizeImageUrls(reqDto.getImageUrls());

        // 새 이미지 저장
        saveImages(visitHistory, imageUrls);

        // 응답 DTO 변환
        return toDto(visitHistory, imageUrls);
    }

    // 방문 기록 삭제
    @Transactional
    public void deleteVisitHistory(Long userId, Long visitHistoryId) {
        // 방문 기록 ID와 사용자 ID를 함께 사용해서 본인 기록만 조회
        VisitHistories visitHistory = getVisitHistoryByUser(visitHistoryId, userId);

        // 방문 기록 이미지 먼저 삭제
        visitHistoryImageRepository.deleteByVisitHistories_VisitHistoryIdAndVisitHistories_Users_UserId(
                visitHistoryId,
                userId
        );

        // 방문 기록 삭제
        visitHistoryRepository.delete(visitHistory);
    }

    // 특정 회원의 방문 기록 개수 조회
    public long getVisitHistoryCount(Long userId) {
        return visitHistoryRepository.countByUsers_UserId(userId);
    }

    // 방문 기록 이미지 저장
    private void saveImages(VisitHistories visitHistory, List<String> imageUrls) {
        for (int i = 0; i < imageUrls.size(); i++) {
            VisitHistoryImages image = VisitHistoryImages.builder()
                    .visitHistories(visitHistory)
                    .imageUrl(imageUrls.get(i))
                    .sortOrder(i)
                    .build();

            visitHistoryImageRepository.save(image);
        }
    }

    // 요청으로 들어온 이미지 URL 목록 정리
    private List<String> normalizeImageUrls(List<String> imageUrls) {
        if (imageUrls == null || imageUrls.isEmpty()) {
            return List.of();
        }

        List<String> result = new ArrayList<>();

        for (String imageUrl : imageUrls) {
            if (imageUrl != null && !imageUrl.isBlank()) {
                result.add(imageUrl);
            }
        }

        return result;
    }

    // Entity를 응답 DTO로 변환
    private VisitHistoryResDto toDto(VisitHistories visitHistory, List<String> imageUrls) {
        String thumbnailUrl = null;

        if (imageUrls != null && !imageUrls.isEmpty()) {
            thumbnailUrl = imageUrls.get(0);
        }

        return new VisitHistoryResDto(
                visitHistory.getVisitHistoryId(),
                visitHistory.getHistoryTitle(),
                visitHistory.getVisitDate(),
                visitHistory.getMemo(),
                thumbnailUrl,
                imageUrls,
                visitHistory.getCreatedAt()
        );
    }

    // 회원 조회 공통 메서드
    private Users getUser(Long userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("회원을 찾을 수 없습니다."));
    }

    // 방문 기록 조회 공통 메서드
    private VisitHistories getVisitHistoryByUser(Long visitHistoryId, Long userId) {
        return visitHistoryRepository.findByVisitHistoryIdAndUsers_UserId(
                        visitHistoryId,
                        userId
                )
                .orElseThrow(() -> new RuntimeException("방문 기록을 찾을 수 없습니다."));
    }
}