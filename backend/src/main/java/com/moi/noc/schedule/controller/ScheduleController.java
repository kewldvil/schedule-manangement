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
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.*;

import java.util.List;

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
    public ResponseEntity<List<ScheduleResponse>> getSchedules() {
        log.info("Fetching all schedules");
        List<ScheduleResponse> schedules = scheduleService.getSchedules();
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
