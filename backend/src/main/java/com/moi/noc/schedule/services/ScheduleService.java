package com.moi.noc.schedule.services;

import com.moi.noc.schedule.dtos.ScheduleRequest;
import com.moi.noc.schedule.dtos.ScheduleResponse;
import com.moi.noc.schedule.enums.ScheduleStatus;
import com.moi.noc.schedule.models.Location;
import com.moi.noc.schedule.models.Presidium;
import com.moi.noc.schedule.models.Schedule;
import com.moi.noc.schedule.models.Uniform;
import com.moi.noc.schedule.repositories.LocationRepo;
import com.moi.noc.schedule.repositories.PresidiumRepo;
import com.moi.noc.schedule.repositories.ScheduleRepo;
import com.moi.noc.schedule.repositories.UniformRepo;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;


import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ScheduleService {

    private final ScheduleRepo scheduleRepo;
    private final PresidiumRepo presidiumRepository;
    private final UniformRepo uniformRepository;
    private final LocationRepo locationRepository;

    public Schedule createSchedule(ScheduleRequest scheduleRequest) {
        // Fetch related entities from the database
        Presidium presidium = presidiumRepository.findById(scheduleRequest.getPresidium())
                .orElseThrow(() -> new RuntimeException("Presidium not found"));
        Uniform uniform = uniformRepository.findById(scheduleRequest.getUniform())
                .orElseThrow(() -> new RuntimeException("Uniform not found"));
        Location location = locationRepository.findById(scheduleRequest.getLocation())
                .orElseThrow(() -> new RuntimeException("Location not found"));

        // Create and populate the Schedule entity
        Schedule schedule = new Schedule();
        schedule.setDate(LocalDate.parse(scheduleRequest.getDate()));
        schedule.setStartTime(LocalTime.parse(scheduleRequest.getStartTime()));
        schedule.setDescription(scheduleRequest.getDescription());
        schedule.setPresidium(presidium);
        schedule.setUniform(uniform);
        schedule.setLocation(location);
        schedule.setStatus(ScheduleStatus.valueOf(scheduleRequest.getStatus()));

        // Save the Schedule entity to the database
        return scheduleRepo.save(schedule);
    }

    // Retrieve all schedules
// Retrieve all schedules
//    @Transactional
//    public Page<ScheduleResponse> getSchedules(Pageable pageable) {
//        return scheduleRepo.findAllOrderByPendingStatusFirst(pageable)
//                .map(schedule -> {
//                    ScheduleResponse scheduleResponse = new ScheduleResponse();
//                    scheduleResponse.setId(schedule.getId());
//                    scheduleResponse.setDate(schedule.getDate()); // No need to parse, assuming it's already LocalDate
//                    scheduleResponse.setStartTime(schedule.getStartTime()); // No need to parse, assuming it's already LocalTime
//                    scheduleResponse.setDescription(schedule.getDescription());
//                    scheduleResponse.setPresidium(schedule.getPresidium().getName());
//                    scheduleResponse.setUniform(schedule.getUniform().getName());
//                    scheduleResponse.setLocation(schedule.getLocation().getName());
//                    scheduleResponse.setStatus(schedule.getStatus().name());
//                    return scheduleResponse;
//                });
//    }
    @Transactional
    public Page<Schedule> getSchedules(Pageable pageable) {
        return scheduleRepo.findAllOrderByPendingStatusFirst(pageable);
    }

    @Transactional
    public List<ScheduleResponse> getPendingSchedulesForToday() {
        LocalDate today = LocalDate.now();
        return scheduleRepo.findByStatusAndDateOrderByDateAscStartTimeAsc(ScheduleStatus.PENDING, today)
                .stream()
                .map(schedule -> {
                    ScheduleResponse scheduleResponse = new ScheduleResponse();
                    scheduleResponse.setId(schedule.getId());
                    scheduleResponse.setDate(schedule.getDate());
                    scheduleResponse.setStartTime(schedule.getStartTime());
                    scheduleResponse.setDescription(schedule.getDescription());
                    scheduleResponse.setPresidium(schedule.getPresidium() != null ? schedule.getPresidium().getName() : null);
                    scheduleResponse.setUniform(schedule.getUniform() != null ? schedule.getUniform().getName() : null);
                    scheduleResponse.setLocation(schedule.getLocation() != null ? schedule.getLocation().getName() : null);
                    scheduleResponse.setStatus(schedule.getStatus().name());
                    return scheduleResponse;
                })
                .toList();
    }


    // Update an existing schedule
    public void updateSchedule(Long id, ScheduleRequest scheduleRequest) {
        // Find the existing schedule
        Schedule schedule = scheduleRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Schedule not found"));

        // Fetch related entities from the database
        var presidium = presidiumRepository.findById(scheduleRequest.getPresidium())
                .orElseThrow(() -> new RuntimeException("Presidium not found"));
        var uniform = uniformRepository.findById(scheduleRequest.getUniform())
                .orElseThrow(() -> new RuntimeException("Uniform not found"));
        var location = locationRepository.findById(scheduleRequest.getLocation())
                .orElseThrow(() -> new RuntimeException("Location not found"));

        // Update the Schedule entity
        schedule.setDate(LocalDate.parse(scheduleRequest.getDate()));
        schedule.setStartTime(LocalTime.parse(scheduleRequest.getStartTime()));
        schedule.setDescription(scheduleRequest.getDescription());
        schedule.setPresidium(presidium);
        schedule.setUniform(uniform);
        schedule.setLocation(location);
        schedule.setStatus(ScheduleStatus.valueOf(scheduleRequest.getStatus()));

        // Save the updated Schedule entity
        scheduleRepo.save(schedule);
    }

    // Delete a schedule by ID
    public void deleteSchedule(Long id) {
        scheduleRepo.deleteById(id);
    }

    @Transactional
    public void updateScheduleStatus() {
        LocalDate today = LocalDate.now();
        List<Schedule> schedules = scheduleRepo.findByDateBeforeAndStatus(today, ScheduleStatus.valueOf("PENDING"));

        for (Schedule schedule : schedules) {
            schedule.setStatus(ScheduleStatus.valueOf("COMPLETED"));
            scheduleRepo.save(schedule);
        }
    }
}
