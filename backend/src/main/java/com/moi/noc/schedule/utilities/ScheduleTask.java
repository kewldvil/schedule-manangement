package com.moi.noc.schedule.utilities;

import com.moi.noc.schedule.services.ScheduleService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

@Component
public class ScheduleTask {
    @Autowired
    private ScheduleService scheduleService;

    // Run every day at midnight
    @Scheduled(cron = "0 0 7 * * ?")
    public void updateSchedules() {
        scheduleService.updateScheduleStatus();
    }
}
