package com.human.festapick.repository;

import com.human.festapick.entity.FestivalImages;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FestivalImageRepository extends JpaRepository<FestivalImages, Long> {

    List<FestivalImages> findByFestivalId(Long festivalId);

    boolean existsByFestivalId(Long festivalId);
}