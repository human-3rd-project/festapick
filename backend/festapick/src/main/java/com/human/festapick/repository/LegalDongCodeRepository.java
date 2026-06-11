package com.human.festapick.repository;

import com.human.festapick.entity.LegalDongCodes;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface LegalDongCodeRepository extends JpaRepository<LegalDongCodes, Long> {

    List<LegalDongCodes> findByActiveTrue();

    List<LegalDongCodes> findBySidoNameAndActiveTrue(String sidoName);

    List<LegalDongCodes> findBySidoNameAndSigunguNameAndActiveTrue(
            String sidoName,
            String sigunguName
    );

    Optional<LegalDongCodes> findByLdongRegnCdAndLdongSignguCd(
            String ldongRegnCd,
            String ldongSignguCd
    );

    Optional<LegalDongCodes> findByLdongRegnCdAndLdongSignguCdAndActiveTrue(
            String ldongRegnCd,
            String ldongSignguCd
    );

    List<LegalDongCodes> findByFullNameContainingAndActiveTrue(String keyword);

    boolean existsByLdongRegnCdAndLdongSignguCd(
            String ldongRegnCd,
            String ldongSignguCd
    );
}