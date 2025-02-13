package com.moi.noc.schedule.repositories;

import com.moi.noc.schedule.models.Schedule;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface  ScheduleRepo extends JpaRepository<Schedule, Long> {
}
