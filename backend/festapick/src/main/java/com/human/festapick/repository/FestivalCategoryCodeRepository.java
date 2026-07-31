package com.human.festapick.repository;

import com.human.festapick.entity.FestivalCategoryCodes;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface FestivalCategoryCodeRepository extends JpaRepository<FestivalCategoryCodes, Long> {

    List<FestivalCategoryCodes> findByActiveTrue();

    List<FestivalCategoryCodes> findByLclsCodeAndActiveTrue(String lclsCode);

    List<FestivalCategoryCodes> findByMclsCodeAndActiveTrue(String mclsCode);

    List<FestivalCategoryCodes> findBySclsCodeAndActiveTrue(String sclsCode);

    Optional<FestivalCategoryCodes> findByLclsCodeAndMclsCodeAndSclsCode(
            String lclsCode,
            String mclsCode,
            String sclsCode
    );

    boolean existsByLclsCodeAndMclsCodeAndSclsCode(
            String lclsCode,
            String mclsCode,
            String sclsCode
    );
}