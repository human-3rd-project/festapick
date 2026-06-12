package com.human.festapick.service;

import com.human.festapick.constant.ReviewStatus;
import com.human.festapick.dto.request.ReviewReqDto;
import com.human.festapick.dto.response.MyReviewResDto;
import com.human.festapick.dto.response.ReviewResDto;
import com.human.festapick.entity.Festivals;
import com.human.festapick.entity.Reviews;
import com.human.festapick.entity.Users;
import com.human.festapick.repository.FestivalRepository;
import com.human.festapick.repository.ReviewRepository;
import com.human.festapick.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ReviewService {

    private final ReviewRepository reviewRepository;
    private final UserRepository userRepository;
    private final FestivalRepository festivalRepository;

    // 특정 축제의 리뷰 목록 조회
    public Page<ReviewResDto> getReviewList(Long festivalId, Pageable pageable) {
        return reviewRepository.findReviewListByFestivalId(
                festivalId,
                ReviewStatus.ACTIVE,
                pageable
        );
    }

    // 리뷰 작성
    @Transactional
    public ReviewResDto createReview(Long userId, ReviewReqDto reqDto) {
        // 같은 회원이 같은 축제에 이미 작성한 활성 리뷰가 있는지 확인
        if (reviewRepository.existsByUser_UserIdAndFestival_FestivalIdAndStatus(
                userId,
                reqDto.getFestivalId(),
                ReviewStatus.ACTIVE
        )) {
            throw new RuntimeException("이미 해당 축제에 리뷰를 작성했습니다.");
        }

        // 회원 조회
        Users user = getUser(userId);

        // 리뷰를 작성할 축제 조회
        Festivals festival = getFestival(reqDto.getFestivalId());

        // Reviews Entity 생성
        Reviews review = Reviews.builder()
                .user(user)
                .festival(festival)
                .content(reqDto.getContent())
                .rating(reqDto.getRating())
                .build();

        // DB에 저장
        Reviews savedReview = reviewRepository.save(review);

        // 리뷰 작성 후 해당 축제의 리뷰 개수 / 평균 별점 갱신
        updateFestivalReviewStats(festival.getFestivalId());

        // 저장된 리뷰 Entity를 응답 DTO로 변환
        return ReviewResDto.of(savedReview);
    }

    // 리뷰 수정
    @Transactional
    public ReviewResDto updateReview(Long userId, Long reviewId, ReviewReqDto reqDto) {
        // reviewId, userId, ACTIVE 상태를 모두 만족하는 리뷰 조회
        // 즉, 현재 로그인한 사용자가 작성한 삭제되지 않은 리뷰만 수정 가능
        Reviews review = reviewRepository.findByReviewIdAndUser_UserIdAndStatus(
                        reviewId,
                        userId,
                        ReviewStatus.ACTIVE
                )
                .orElseThrow(() -> new RuntimeException("수정할 리뷰를 찾을 수 없습니다."));

        // 리뷰 내용 / 별점 수정
        review.setContent(reqDto.getContent());
        review.setRating(reqDto.getRating());

        // 리뷰 수정 후 해당 축제의 리뷰 개수 / 평균 별점 갱신
        updateFestivalReviewStats(review.getFestival().getFestivalId());

        // @Transactional 상태이므로 별도 save 없이 변경 감지로 DB 반영
        return ReviewResDto.of(review);
    }

    // 리뷰 삭제
    @Transactional
    public void deleteReview(Long userId, Long reviewId) {
        // reviewId, userId, ACTIVE 상태를 모두 만족하는 리뷰 조회
        // 즉, 현재 로그인한 사용자가 작성한 삭제되지 않은 리뷰만 삭제 가능
        Reviews review = reviewRepository.findByReviewIdAndUser_UserIdAndStatus(
                        reviewId,
                        userId,
                        ReviewStatus.ACTIVE
                )
                .orElseThrow(() -> new RuntimeException("삭제할 리뷰를 찾을 수 없습니다."));

        Long festivalId = review.getFestival().getFestivalId();

        // 실제 DB 삭제가 아니라 상태값을 DELETED로 변경하는 소프트 삭제
        review.setStatus(ReviewStatus.DELETED);

        // 리뷰 삭제 후 해당 축제의 리뷰 개수 / 평균 별점 갱신
        updateFestivalReviewStats(festivalId);
    }

    // 마이페이지 - 내 리뷰 목록 조회
    public Page<MyReviewResDto> getMyReviewList(Long userId, Pageable pageable) {
        return reviewRepository.findMyReviewListByUserId(
                userId,
                ReviewStatus.ACTIVE,
                pageable
        );
    }

    // 특정 축제의 활성 리뷰 개수 조회
    public long getReviewCount(Long festivalId) {
        return reviewRepository.countByFestival_FestivalIdAndStatus(
                festivalId,
                ReviewStatus.ACTIVE
        );
    }

    // 축제의 리뷰 개수 / 평균 별점 갱신
    private void updateFestivalReviewStats(Long festivalId) {
        // 축제 조회
        Festivals festival = getFestival(festivalId);

        // ACTIVE 상태인 리뷰 개수 조회
        Long reviewCount = reviewRepository.countByFestival_FestivalIdAndStatus(
                festivalId,
                ReviewStatus.ACTIVE
        );

        // ACTIVE 상태인 리뷰 평균 별점 조회
        Double averageRatingValue = reviewRepository.findAverageRatingByFestivalIdAndStatus(
                festivalId,
                ReviewStatus.ACTIVE
        );

        // 평균 별점이 null이면 0.0으로 처리
        if (averageRatingValue == null) {
            averageRatingValue = 0.0;
        }

        // Double 값을 BigDecimal로 변환하고 소수점 첫째 자리까지 반올림
        BigDecimal averageRating = BigDecimal.valueOf(averageRatingValue)
                .setScale(1, RoundingMode.HALF_UP);

        // Festivals Entity의 리뷰 통계 값 갱신
        festival.updateReviewStats(reviewCount, averageRating);
    }

    // 회원 조회 공통 메서드
    private Users getUser(Long userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("회원을 찾을 수 없습니다."));
    }

    // 축제 조회 공통 메서드
    private Festivals getFestival(Long festivalId) {
        return festivalRepository.findById(festivalId)
                .orElseThrow(() -> new RuntimeException("축제를 찾을 수 없습니다."));
    }
}