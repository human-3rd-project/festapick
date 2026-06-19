package com.human.festapick.service;

import com.human.festapick.constant.FestivalStatus;
import com.human.festapick.constant.ReviewStatus;
import com.human.festapick.constant.UserRole;
import com.human.festapick.constant.UserStatus;
import com.human.festapick.dto.request.UserManageReqDto;
import com.human.festapick.dto.response.DonationManageResDto;
import com.human.festapick.dto.response.DonationStatisticsResDto;
import com.human.festapick.dto.response.FestivalDetailResponseDto;
import com.human.festapick.dto.response.FestivalInfoResponseDto;
import com.human.festapick.dto.response.ReviewResDto;
import com.human.festapick.dto.response.UserManageResDto;
import com.human.festapick.entity.FestivalCategoryCodes;
import com.human.festapick.entity.FestivalImages;
import com.human.festapick.entity.Festivals;
import com.human.festapick.entity.Reviews;
import com.human.festapick.entity.Users;
import com.human.festapick.exception.CustomException;
import com.human.festapick.repository.ChatRoomRepository;
import com.human.festapick.repository.FestivalCategoryCodeRepository;
import com.human.festapick.repository.FestivalImageRepository;
import com.human.festapick.repository.FestivalRepository;
import com.human.festapick.repository.ReviewRepository;
import com.human.festapick.repository.UserRepository;
import jakarta.persistence.EntityManager;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Comparator;
import java.util.List;
import java.util.Locale;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class AdminService {

    private final UserRepository userRepository;
    private final ReviewRepository reviewRepository;
    private final FestivalRepository festivalRepository;
    private final FestivalImageRepository festivalImageRepository;
    private final FestivalCategoryCodeRepository festivalCategoryCodeRepository;
    private final ChatRoomRepository chatRoomRepository;
    private final DonationService donationService;
    private final EntityManager entityManager;
    private Pageable pageable;

    public Page<UserManageResDto> getUsers(Pageable pageable) {
        return userRepository.findAll(pageable)
                .map(this::toUserManageResDto);
    }

    public Page<UserManageResDto> searchUsers(String keyword, Pageable pageable) {
        String normalizedKeyword = normalizeKeyword(keyword);

        if (normalizedKeyword == null) {
            return getUsers(pageable);
        }

        return userRepository.searchAdminUsers(
                        toLikePattern(normalizedKeyword),
                        parseLong(normalizedKeyword),
                        parseUserStatus(normalizedKeyword),
                        parseUserRole(normalizedKeyword),
                        pageable
                )
                .map(this::toUserManageResDto);
    }

    public UserManageResDto getUser(Long userId) {
        return toUserManageResDto(getUserEntity(userId));
    }

    @Transactional
    public UserManageResDto changeUserStatus(UserManageReqDto request) {
        if (request == null) {
            throw new CustomException(HttpStatus.BAD_REQUEST, "회원 상태 변경 요청 정보가 없습니다.");
        }
        return changeUserStatus(request.getUserId(), request.getStatus());
    }

    @Transactional
    public UserManageResDto changeUserStatus(Long userId, UserStatus status) {
        if (status == null) {
            throw new CustomException(HttpStatus.BAD_REQUEST, "회원 상태는 필수입니다.");
        }

        Users user = getUserEntity(userId);
        user.setStatus(status);
        return toUserManageResDto(user);
    }

    @Transactional
    public UserManageResDto suspendUser(Long userId) {
        return changeUserStatus(userId, UserStatus.SUSPENDED);
    }

    public Page<ReviewResDto> getReviews(Pageable pageable) {
        this.pageable = pageable;
        return reviewRepository.findAll(pageable)
                .map(ReviewResDto::of);
    }

    public Page<ReviewResDto> searchReviews(String keyword, Pageable pageable) {
        String normalizedKeyword = normalizeKeyword(keyword);

        if (normalizedKeyword == null) {
            return getReviews(pageable);
        }

        return reviewRepository.searchAdminReviews(
                        toLikePattern(normalizedKeyword),
                        parseLong(normalizedKeyword),
                        parseInteger(normalizedKeyword),
                        pageable
                )
                .map(ReviewResDto::of);
    }

    public ReviewResDto getReview(Long reviewId) {
        return ReviewResDto.of(getReviewEntity(reviewId));
    }

    @Transactional
    public void deleteReview(Long reviewId) {
        Reviews review = getReviewEntity(reviewId);
        reviewRepository.delete(review);
    }

    public Page<FestivalInfoResponseDto> getFestivals(Pageable pageable) {
        return festivalRepository.findByStatusNot(FestivalStatus.HIDDEN, pageable)
                .map(this::toFestivalInfoResponseDto);
    }

    public Page<FestivalInfoResponseDto> searchFestivals(String keyword, Pageable pageable) {
        String normalizedKeyword = normalizeKeyword(keyword);

        if (normalizedKeyword == null) {
            return getFestivals(pageable);
        }

        return festivalRepository.searchAdminFestivals(
                        toLikePattern(normalizedKeyword),
                        parseLong(normalizedKeyword),
                        parseFestivalStatus(normalizedKeyword),
                        FestivalStatus.HIDDEN,
                        pageable
                )
                .map(this::toFestivalInfoResponseDto);
    }

    public FestivalDetailResponseDto getFestivalDetail(Long festivalId) {
        Festivals festival = getFestivalEntity(festivalId);
        return toFestivalDetailResponseDto(festival);
    }

    @Transactional
    public void deleteFestival(Long festivalId) {
        Festivals festival = getFestivalEntity(festivalId);
        festival.hide();
    }

    public Page<DonationManageResDto> getDonations(Long donationId, String keyword, Pageable pageable) {
        return donationService.getDonationHistory(donationId, keyword, pageable);
    }

    public Page<DonationManageResDto> searchDonations(String keyword, Pageable pageable) {
        return donationService.searchDonationHistory(keyword, pageable);
    }

    @Transactional
    public void deleteDonation(Long donationId) {
        donationService.cancelDonation(donationId);
    }

    private UserManageResDto toUserManageResDto(Users user) {
        return UserManageResDto.builder()
                .userId(user.getUserId())
                .nickname(user.getNickname())
                .email(user.getEmail())
                .status(user.getStatus())
                .role(user.getRole())
                .createdAt(user.getCreatedAt())
                .build();
    }

    private FestivalInfoResponseDto toFestivalInfoResponseDto(Festivals festival) {
        return FestivalInfoResponseDto.builder()
                .festivalId(festival.getFestivalId())
                .contentId(festival.getContentId())
                .title(festival.getTitle())
                .categoryName(resolveCategoryName(festival))
                .firstImage(festival.getFirstImage())
                .addr1(festival.getAddr1())
                .addr2(festival.getAddr2())
                .eventStartDate(festival.getEventStartDate())
                .eventEndDate(festival.getEventEndDate())
                .averageRating(festival.getAverageRating())
                .liveCount(0L)
                .favoriteCount(festival.getFavoriteCount())
                .likeCount(festival.getLikeCount())
                .reviewCount(festival.getReviewCount())
                .status(festival.getStatus() == null ? null : festival.getStatus().name())
                .build();
    }

    private FestivalDetailResponseDto toFestivalDetailResponseDto(Festivals festival) {
        List<String> imageUrls = festivalImageRepository.findByFestivalId(festival.getFestivalId())
                .stream()
                .sorted(Comparator.comparing(FestivalImages::getSortOrder))
                .map(FestivalImages::getImageUrl)
                .toList();

        if (imageUrls.isEmpty() && festival.getFirstImage() != null) {
            imageUrls = List.of(festival.getFirstImage());
        }

        return FestivalDetailResponseDto.builder()
                .festivalId(festival.getFestivalId())
                .chatRoomId(resolveChatRoomId(festival.getFestivalId()))
                .contentId(festival.getContentId())
                .title(festival.getTitle())
                .categoryName(resolveCategoryName(festival))
                .progressType(festival.getProgressType())
                .imageUrls(imageUrls)
                .addr1(festival.getAddr1())
                .addr2(festival.getAddr2())
                .eventStartDate(festival.getEventStartDate())
                .eventEndDate(festival.getEventEndDate())
                .description(festival.getDescription())
                .mapX(festival.getMapX())
                .mapY(festival.getMapY())
                .averageRating(festival.getAverageRating())
                .reviewCount(festival.getReviewCount())
                .status(festival.getStatus() == null ? null : festival.getStatus().name())
                .build();
    }

    private String resolveCategoryName(Festivals festival) {
        return festivalCategoryCodeRepository
                .findByLclsCodeAndMclsCodeAndSclsCode(
                        festival.getLclsSystm1(),
                        festival.getLclsSystm2(),
                        festival.getLclsSystm3()
                )
                .map(this::getMostSpecificCategoryName)
                .orElseGet(() -> festival.getFestivalType() == null
                        ? festival.getLclsSystm3()
                        : festival.getFestivalType());
    }

    private Long resolveChatRoomId(Long festivalId) {
        return chatRoomRepository.findByFestival_FestivalIdAndActiveTrue(festivalId)
                .map(chatRoom -> chatRoom.getChatRoomId())
                .orElse(null);
    }

    private String getMostSpecificCategoryName(FestivalCategoryCodes categoryCode) {
        if (categoryCode.getSclsName() != null && !categoryCode.getSclsName().isBlank()) {
            return categoryCode.getSclsName();
        }
        if (categoryCode.getMclsName() != null && !categoryCode.getMclsName().isBlank()) {
            return categoryCode.getMclsName();
        }
        return categoryCode.getLclsName();
    }

    private String normalizeKeyword(String keyword) {
        return keyword == null || keyword.isBlank() ? null : keyword.trim();
    }

    private String toLikePattern(String keyword) {
        return "%" + keyword.toLowerCase(Locale.ROOT) + "%";
    }

    private Long parseLong(String keyword) {
        try {
            return Long.valueOf(keyword);
        } catch (NumberFormatException e) {
            return null;
        }
    }

    private Integer parseInteger(String keyword) {
        try {
            return Integer.valueOf(keyword);
        } catch (NumberFormatException e) {
            return null;
        }
    }

    private UserStatus parseUserStatus(String keyword) {
        try {
            return UserStatus.valueOf(keyword.toUpperCase(Locale.ROOT));
        } catch (IllegalArgumentException e) {
            return null;
        }
    }

    private UserRole parseUserRole(String keyword) {
        try {
            return UserRole.valueOf(keyword.toUpperCase(Locale.ROOT));
        } catch (IllegalArgumentException e) {
            return null;
        }
    }

    private FestivalStatus parseFestivalStatus(String keyword) {
        try {
            return FestivalStatus.valueOf(keyword.toUpperCase(Locale.ROOT));
        } catch (IllegalArgumentException e) {
            return null;
        }
    }

    private Users getUserEntity(Long userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> new CustomException(HttpStatus.NOT_FOUND, "회원을 찾을 수 없습니다."));
    }

    private Reviews getReviewEntity(Long reviewId) {
        return reviewRepository.findById(reviewId)
                .orElseThrow(() -> new CustomException(HttpStatus.NOT_FOUND, "리뷰를 찾을 수 없습니다."));
    }

    private Festivals getFestivalEntity(Long festivalId) {
        return festivalRepository.findById(festivalId)
                .orElseThrow(() -> new CustomException(HttpStatus.NOT_FOUND, "축제를 찾을 수 없습니다."));
    }
}
