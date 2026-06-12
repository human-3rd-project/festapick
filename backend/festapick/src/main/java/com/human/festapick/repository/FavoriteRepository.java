package com.human.festapick.repository;

import com.human.festapick.dto.response.FavoriteListResDto;
import com.human.festapick.entity.Favorites;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface FavoriteRepository extends JpaRepository<Favorites, Long> {

    // 찜 여부 확인
    boolean existsByUsers_UserIdAndFestivals_FestivalId(Long userId, Long festivalId);

    // 특정 회원의 특정 축제 찜 데이터 조회
    Optional<Favorites> findByUsers_UserIdAndFestivals_FestivalId(
            Long userId,
            Long festivalId
    );

    // 찜 취소
    void deleteByUsers_UserIdAndFestivals_FestivalId(
            Long userId,
            Long festivalId
    );

    // 특정 축제의 찜 개수 조회
    long countByFestivals_FestivalId(Long festivalId);

    // 내 찜 목록 조회
    @Query(
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

    // 전체 축제 목록 중 현재 사용자가 찜한 축제 ID만 조회
    @Query("""
            SELECT fav.festivals.festivalId
            FROM Favorites fav
            WHERE fav.users.userId = :userId
              AND fav.festivals.festivalId IN :festivalIds
            """)
    List<Long> findFavoriteFestivalIdsByUserIdAndFestivalIds(
            @Param("userId") Long userId,
            @Param("festivalIds") List<Long> festivalIds
    );
}