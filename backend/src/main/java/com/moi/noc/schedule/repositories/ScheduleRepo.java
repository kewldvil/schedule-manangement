package com.moi.noc.schedule.repositories;

import com.moi.noc.schedule.enums.ScheduleStatus;
import com.moi.noc.schedule.models.Schedule;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface  ScheduleRepo extends JpaRepository<Schedule, Long> {
    List<Schedule> findByDateBeforeAndStatus(LocalDate date, ScheduleStatus status);
}
