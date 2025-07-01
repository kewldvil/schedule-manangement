package com.moi.noc.schedule.repositories;

import com.moi.noc.schedule.models.Uniform;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface UniformRepo extends JpaRepository<Uniform, Long> {
    List<Uniform> findAllByIsActiveTrue();
}
