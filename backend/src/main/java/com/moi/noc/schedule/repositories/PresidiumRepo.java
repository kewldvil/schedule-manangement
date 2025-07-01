package com.moi.noc.schedule.repositories;

import com.moi.noc.schedule.models.Presidium;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PresidiumRepo extends JpaRepository<Presidium, Long> {
    List<Presidium> findAllByIsActiveTrue();
}
