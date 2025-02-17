package com.moi.noc.schedule.services;

import com.moi.noc.schedule.models.Location;
import com.moi.noc.schedule.repositories.LocationRepo;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
@RequiredArgsConstructor
public class LocationService {
    private final LocationRepo locationRepository;

    // Create a new Location
    public Location createLocation(Location location) {
        return locationRepository.save(location);
    }

    // Get all Locations
    public List<Location> getAllLocations() {
        return locationRepository.findAll();
    }

    // Get a Location by ID
    public Location getLocationById(Long id) {
        return locationRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Location not found"));
    }

    // Update a Location
    public Location updateLocation(Long id, Location locationDetails) {
        Location location = locationRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Location not found"));

        location.setName(locationDetails.getName());
        return locationRepository.save(location);
    }

    // Delete a Location
    public void deleteLocation(Long id) {
        Location location = locationRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Location not found"));

        locationRepository.delete(location);
    }
}
