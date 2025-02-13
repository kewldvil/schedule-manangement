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
        scheduleRepo.save(schedule); // Save the schedule to the database
    }

    public List<Schedule> getSchedule() {
        return scheduleRepo.findAll(); // Retrieve all schedules from the database
    }

    public void updateSchedule(Schedule schedule) {
        scheduleRepo.save(schedule); // Update the schedule in the database
    }

    public void deleteSchedule(Long id) {
        scheduleRepo.deleteById(id); // Delete the schedule by ID
    }
}
