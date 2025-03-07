package com.moi.noc.schedule.controller;

import com.moi.noc.schedule.models.Presidium;
import com.moi.noc.schedule.services.PresidiumService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/presidiums")
@RequiredArgsConstructor
@Slf4j
public class PresidiumController {

    private final PresidiumService presidiumService;
    private final SimpMessagingTemplate messagingTemplate; // Inject WebSocket Messaging Template
    // Create a new Presidium
    @PostMapping
    public ResponseEntity<Presidium> createPresidium(@RequestBody Presidium presidium) {
        log.info("Creating a new Presidium: {}", presidium);
        Presidium createdPresidium = presidiumService.createPresidium(presidium);
        return new ResponseEntity<>(createdPresidium, HttpStatus.CREATED);
    }

    //     Get all Presidiums
    @GetMapping
    public ResponseEntity<List<Presidium>> getAllPresidiums() {
        log.info("Fetching all Presidiums");
        List<Presidium> presidiums = presidiumService.getAllPresidiums();
        return new ResponseEntity<>(presidiums, HttpStatus.OK);
    }

    // Get a Presidium by ID
    @GetMapping("/{id}")
    public ResponseEntity<Presidium> getPresidiumById(@PathVariable Long id) {
        log.info("Fetching Presidium with ID: {}", id);
        Presidium presidium = presidiumService.getPresidiumById(id);
        return new ResponseEntity<>(presidium, HttpStatus.OK);
    }

    // Update a Presidium
    @PutMapping("/{id}")
    public ResponseEntity<Presidium> updatePresidium(@PathVariable Long id, @RequestBody Presidium presidiumDetails) {
        log.info("Updating Presidium with ID: {}", id);
        Presidium updatedPresidium = presidiumService.updatePresidium(id, presidiumDetails);
        messagingTemplate.convertAndSend("/topic/schedules", "Updated presidium with ID: " + id);
        return new ResponseEntity<>(updatedPresidium, HttpStatus.OK);
    }

    // Delete a Presidium
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePresidium(@PathVariable Long id) {
        log.info("Deleting Presidium with ID: {}", id);
        presidiumService.deletePresidium(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }
}