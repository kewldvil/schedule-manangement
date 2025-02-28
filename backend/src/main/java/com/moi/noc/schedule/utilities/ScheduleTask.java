package com.moi.noc.schedule.utilities;

import com.moi.noc.schedule.services.ScheduleService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

@Component
@Slf4j
@RequiredArgsConstructor
public class ScheduleTask {
    @Autowired
    private ScheduleService scheduleService;
    private final SimpMessagingTemplate messagingTemplate; // Inject WebSocket Messaging Template
    // Run every day at midnight
    @Scheduled(cron = "0 0 17 * * ?") // Runs daily at midnight
    public void updateSchedules() {
        log.info("Starting scheduled task to update schedule statuses");
        try {
            scheduleService.updateScheduleStatus();
            log.info("Successfully updated schedule statuses");
            // Notify WebSocket clients about the update
            messagingTemplate.convertAndSend("/topic/schedules", "Schedules updated at " + new java.util.Date());
        } catch (Exception e) {
            log.error("Failed to update schedule statuses", e);
        }
    }
}
