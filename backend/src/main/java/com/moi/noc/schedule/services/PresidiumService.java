package com.moi.noc.schedule.services;

import com.moi.noc.schedule.models.Presidium;
import com.moi.noc.schedule.repositories.PresidiumRepo;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
@RequiredArgsConstructor
public class PresidiumService {

    private final PresidiumRepo presidiumRepository;

    // Create a new Presidium
    public Presidium createPresidium(Presidium presidium) {
        return presidiumRepository.save(presidium);
    }

    // Get all Presidiums
    public List<Presidium> getAllPresidiums() {
        return presidiumRepository.findAll();
    }

    // Get a Presidium by ID
    public Presidium getPresidiumById(Long id) {
        return presidiumRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Presidium not found"));
    }

    // Update a Presidium
    public Presidium updatePresidium(Long id, Presidium presidiumDetails) {
        Presidium presidium = presidiumRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Presidium not found"));

        presidium.setName(presidiumDetails.getName());
        presidium.setName(presidiumDetails.getName());

        return presidiumRepository.save(presidium);
    }

    // Delete a Presidium
    public void deletePresidium(Long id) {
        Presidium presidium = presidiumRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Presidium not found"));

        presidiumRepository.delete(presidium);
    }
}