package com.moi.noc.schedule.services;

import com.moi.noc.schedule.models.Schedule;
import com.moi.noc.schedule.repositories.ScheduleRepo;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ScheduleService {
    private final ScheduleRepo scheduleRepo;
    public void createSchedule(Schedule schedule) {
        scheduleRepo.save(schedule);
    }

    public List<Schedule> getSchedule() {
        return scheduleRepo.findAll();
    }

    public void updateSchedule() {
    }

    public void deleteSchedule() {
    }
}
