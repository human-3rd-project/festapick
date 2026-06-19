package com.human.festapick.repository;

import com.human.festapick.constant.FestivalStatus;
import com.human.festapick.dto.response.FavoriteListResDto;
import com.human.festapick.entity.Favorites;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
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
                        CASE
                            WHEN festival.firstImage2 IS NOT NULL AND festival.firstImage2 <> '' THEN festival.firstImage2
                            ELSE festival.firstImage
                        END,
                        festival.lclsSystm3,
                        legal.fullName,
                        festival.eventStartDate,
                        festival.eventEndDate,
                        festival.lclsSystm1,
                        festival.lclsSystm2,
                        festival.lclsSystm3,
                        festival.festivalType
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

    /*
     * 날짜 알림용 조회
     *
     * 특정 날짜에 시작하는 ACTIVE 축제를 찜한 목록을 가져옴.
     *
     * 예:
     * targetDate = 오늘
     * → 오늘 시작하는 축제를 찜한 사용자들 조회
     *
     * targetDate = 오늘 + 2일
     * → 2일 뒤 시작하는 축제를 찜한 사용자들 조회
     *
     * JOIN FETCH를 쓰는 이유:
     * - 알림 생성할 때 favorite.getUsers()
     * - favorite.getFestivals()
     * 를 바로 사용해야 하기 때문.
     */
    @Query("""
            SELECT fav
            FROM Favorites fav
            JOIN FETCH fav.users user
            JOIN FETCH fav.festivals festival
            WHERE festival.eventStartDate = :targetDate
              AND festival.status = :status
            """)
    List<Favorites> findFavoritesForFestivalStartNotification(
            @Param("targetDate") LocalDate targetDate,
            @Param("status") FestivalStatus status
    );
}
