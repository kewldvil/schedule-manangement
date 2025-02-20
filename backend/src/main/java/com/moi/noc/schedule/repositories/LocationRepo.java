package com.moi.noc.schedule.repositories;

import com.moi.noc.schedule.ScheduleApplication;
import com.moi.noc.schedule.models.Location;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface LocationRepo extends JpaRepository<Location, Long> {


}
