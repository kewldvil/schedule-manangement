package com.moi.noc.schedule.controller;

import com.moi.noc.schedule.models.Location;
import com.moi.noc.schedule.models.Uniform;
import com.moi.noc.schedule.services.LocationService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/locations")
@RequiredArgsConstructor
@Slf4j
public class LocationController {
    private final LocationService locationService;
    private final SimpMessagingTemplate messagingTemplate; // Inject WebSocket Messaging Template
    // Create a new Location
    @PostMapping
    public ResponseEntity<Location> createLocation(@RequestBody Location location) {
        log.info("Creating a new Location: {}", location);
        Location createdLocation = locationService.createLocation(location);
        return new ResponseEntity<>(createdLocation, HttpStatus.CREATED);
    }

    //     Get all Locations
    @GetMapping
    public ResponseEntity<List<Location>> getAllLocations() {
        log.info("Fetching all Locations");
        List<Location> locations = locationService.getAllLocations();
        return new ResponseEntity<>(locations, HttpStatus.OK);
    }

    // Get a Location by ID
    @GetMapping("/{id}")
    public ResponseEntity<Location> getLocationById(@PathVariable Long id) {
        log.info("Fetching Location with ID: {}", id);
        Location location = locationService.getLocationById(id);
        return new ResponseEntity<>(location, HttpStatus.OK);
    }

    // Update a Location
    @PutMapping("/{id}")
    public ResponseEntity<Location> updateLocation(@PathVariable Long id, @RequestBody Location locationDetails) {
        log.info("Updating Location with ID: {}", id);
        Location updatedLocation = locationService.updateLocation(id, locationDetails);
        messagingTemplate.convertAndSend("/topic/schedules", "Updated location with ID: " + id);
        return new ResponseEntity<>(updatedLocation, HttpStatus.OK);
    }

    // Delete a Location
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteLocation(@PathVariable Long id) {
        log.info("Deleting Location with ID: {}", id);
        locationService.deleteLocation(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

    // Soft Delete a Location
    @PutMapping("/delete")
    public ResponseEntity<Location> softDelete(@RequestBody Long id) {
        log.info("Soft Deleting Location with ID: {}", id);
        Location updatedLocation = locationService.softDeleteLocation(id);
        return new ResponseEntity<>(updatedLocation, HttpStatus.OK);
    }
}
