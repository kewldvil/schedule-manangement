package com.moi.noc.schedule.utilities;

import com.moi.noc.schedule.services.ScheduleService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

@Component
@Slf4j
public class ScheduleTask {
    @Autowired
    private ScheduleService scheduleService;

    // Run every day at midnight
    @Scheduled(cron = "0 0 0 * * ?") // Runs daily at midnight
    public void updateSchedules() {
        log.info("Starting scheduled task to update schedule statuses");
        try {
            scheduleService.updateScheduleStatus();
            log.info("Successfully updated schedule statuses");
        } catch (Exception e) {
            log.error("Failed to update schedule statuses", e);
        }
    }
}
