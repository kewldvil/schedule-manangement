package com.moi.noc.schedule.dtos;

import com.moi.noc.schedule.models.Location;
import com.moi.noc.schedule.models.Presidium;
import com.moi.noc.schedule.models.Uniform;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Setter
@Getter
@ToString
public class ScheduleRequest {
    private Long id;
    private String date;
    private String startTime;
    private String description;
    private Long presidium;
    private Long uniform;
    private Long location;
    private String status;


}
