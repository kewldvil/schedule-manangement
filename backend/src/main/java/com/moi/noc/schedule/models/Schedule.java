package com.moi.noc.schedule.models;

import com.moi.noc.schedule.enums.ScheduleStatus;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

@Entity
@AllArgsConstructor
@NoArgsConstructor
@Setter
@Getter
public class Schedule {
    @Id
    @GeneratedValue(strategy = jakarta.persistence.GenerationType.IDENTITY)
    private Long id;
    private LocalDate date;
    private LocalTime startTime;
    @Lob
    @Column(columnDefinition = "TEXT")
    private String description;
    @OneToOne(cascade = CascadeType.ALL)
    private Presidium presidium;
    @OneToOne(cascade = CascadeType.ALL)
    private Uniform uniform;
    @OneToOne(cascade = CascadeType.ALL)
    private Location location;
    @Enumerated(EnumType.STRING)
    private ScheduleStatus status;


    @CreationTimestamp
    @Column(updatable = false, nullable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(nullable = false)
    private LocalDateTime updatedAt;

}
