package com.human.festapick.repository;

import com.human.festapick.dto.response.FavoriteListResDto;
import com.human.festapick.entity.Favorites;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface FavoriteRepository extends JpaRepository<Favorites, Long> {

    // 찜 여부 확인
    boolean existsByUsers_UserIdAndFestivals_FestivalId(Long userId, Long festivalId);

    // 특정 회원의 특정 축제 찜 데이터 조회
    Optional<Favorites> findByUsers_UserIdAndFestivals_FestivalId(Long userId, Long festivalId);

    // 찜 취소
    void deleteByUsers_UserIdAndFestivals_FestivalId(Long userId, Long festivalId);

    // 특정 축제의 찜 개수 조회
    long countByFestivals_FestivalId(Long festivalId);

    // 내 찜 목록 조회
    @Query(
            // Entity 이름 매핑 -> DTO 생성자에 입력
            value = """
                    SELECT new com.human.festapick.dto.response.FavoriteListResDto(
                        fav.favoriteId,
                        festival.festivalId,
                        festival.title,
                        festival.firstImage2,
                        festival.lclsSystm3,
                        legal.fullName,
                        festival.eventStartDate,
                        festival.eventEndDate
                    )
                    FROM Favorites fav
                    JOIN fav.festivals festival
                    LEFT JOIN LegalDongCodes legal
                        ON festival.ldongRegnCd = legal.ldongRegnCd
                       AND festival.ldongSignguCd = legal.ldongSignguCd
                    WHERE fav.users.userId = :userId
                    ORDER BY fav.createdAt DESC
                    """,
            // 페이지네이션을 위한 전체 데이터 개수 조회
            countQuery = """ 
                    
                    SELECT COUNT(fav)
                    FROM Favorites fav
                    WHERE fav.users.userId = :userId
                    """
    )
    Page<FavoriteListResDto> findFavoriteListByUserId(
            @Param("userId") Long userId,
            Pageable pageable
    );
}