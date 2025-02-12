package com.moi.noc.schedule.services;

import com.moi.noc.schedule.models.Schedule;
import com.moi.noc.schedule.repositories.ScheduleRepo;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ScheduleService {



    public void createSchedule(Schedule schedule) {

    }

    public List<Schedule> getSchedule() {
        return List.of();
    }

    public void updateSchedule() {
    }

    public void deleteSchedule() {
    }
}
