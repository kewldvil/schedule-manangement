package com.moi.noc.schedule.controller;

import com.moi.noc.schedule.dtos.ScheduleRequest;
import com.moi.noc.schedule.dtos.ScheduleResponse;
import com.moi.noc.schedule.models.Presidium;
import com.moi.noc.schedule.models.Schedule;
import com.moi.noc.schedule.services.ScheduleService;
import com.moi.noc.schedule.utilities.ScheduleTask;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/v1/schedules")
@RequiredArgsConstructor
@Slf4j
public class ScheduleController {
    private final ScheduleService scheduleService;
    private final SimpMessagingTemplate messagingTemplate; // Inject WebSocket Messaging Template

    @PostMapping
    public ResponseEntity<Schedule> createSchedule(@RequestBody ScheduleRequest scheduleRequest) {
        log.info("Creating a new Schedule: {}", scheduleRequest);
        Schedule createdSchedule = scheduleService.createSchedule(scheduleRequest);
        // Notify clients via WebSocket
        messagingTemplate.convertAndSend("/topic/schedules", createdSchedule);
        return new ResponseEntity<>(createdSchedule, HttpStatus.CREATED);
    }

    // Retrieve all schedules
    @GetMapping
    public ResponseEntity<Map<String, Object>> getSchedules(@RequestParam(defaultValue = "0") int page,
                                                            @RequestParam(defaultValue = "10") int size) {
        Pageable pageable = PageRequest.of(page, size);
        log.info("Fetching all schedules");
        Page<Schedule> schedules = scheduleService.getSchedules(pageable);

        // Map users to DTOs
        List<ScheduleResponse> scheduleResponse =
                schedules.map(
                        schedule -> {
                            ScheduleResponse sr = new ScheduleResponse();
                            sr.setId(schedule.getId());
                            sr.setDate(schedule.getDate()); // No need to parse, assuming it's already LocalDate
                            sr.setStartTime(schedule.getStartTime()); // No need to parse, assuming it's already LocalTime
                            sr.setDescription(schedule.getDescription());
                            sr.setPresidium(schedule.getPresidium().getName());
                            sr.setUniform(schedule.getUniform().getName());
                            sr.setLocation(schedule.getLocation().getName());
                            sr.setStatus(schedule.getStatus().name());
                            return sr;
                        }
                ).toList();

        // Prepare response with pagination details
        Map<String, Object> response = new HashMap<>();
        response.put("schedules", scheduleResponse);
        response.put("currentPage", schedules.getNumber());
        response.put("totalItems", schedules.getTotalElements());
        response.put("totalPages", schedules.getTotalPages());

        return ResponseEntity.ok(response);
    }

    // Retrieve all pending schedules
    @GetMapping("/pending")
    public ResponseEntity<List<ScheduleResponse>> getPendingSchedules() {
        log.info("Fetching all pending schedules");
        List<ScheduleResponse> schedules = scheduleService.getPendingSchedules();
        return ResponseEntity.ok(schedules);
    }

    // Update an existing schedule
    @PutMapping("/{id}")
    public ResponseEntity<Void> updateSchedule(@PathVariable Long id, @RequestBody ScheduleRequest scheduleRequest) {
        log.info("Updating schedule with ID {}: {}", id, scheduleRequest);
        scheduleService.updateSchedule(id, scheduleRequest);
        // Notify clients about the update
        messagingTemplate.convertAndSend("/topic/schedules", "Updated schedule with ID: " + id);

        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

    // Delete a schedule by ID
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteSchedule(@PathVariable Long id) {
        log.info("Deleting schedule with ID {}", id);
        scheduleService.deleteSchedule(id);
        // Notify clients about the deletion
        messagingTemplate.convertAndSend("/topic/schedules", "Deleted schedule with ID: " + id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

}
