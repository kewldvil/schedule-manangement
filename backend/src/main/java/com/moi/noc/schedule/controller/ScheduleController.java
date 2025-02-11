package com.moi.noc.schedule.controller;

import com.moi.noc.schedule.services.ScheduleService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/schedule")
@RequiredArgsConstructor
@Slf4j
public class ScheduleController {
    private final ScheduleService scheduleService;
    public ResponseEntity<?> createSchedule() {
        return null;
    }

    public ResponseEntity<?> getSchedule() {
        return null;
    }

    public ResponseEntity<?> updateSchedule() {
        return null;
    }

    public ResponseEntity<?> deleteSchedule() {
        return null;
    }

}
