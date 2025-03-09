package com.moi.noc.schedule.repositories;

import com.moi.noc.schedule.enums.ScheduleStatus;
import com.moi.noc.schedule.models.Schedule;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface  ScheduleRepo extends JpaRepository<Schedule, Long> {
    List<Schedule> findByDateBeforeAndStatus(LocalDate date, ScheduleStatus status);
//    List<Schedule> findByStatusAndDateOrderByDateAscStartTimeAsc(ScheduleStatus status, LocalDate date);
    List<Schedule> findByStatusOrderByDateAscStartTimeAsc(ScheduleStatus status);

    @Query("SELECT s FROM Schedule s ORDER BY " +
            "CASE WHEN s.status = 'PENDING' THEN 1 ELSE 2 END, " +
            "s.date ASC, s.startTime ASC")
    Page<Schedule> findAllOrderByPendingStatusFirst(Pageable pageable);

}
