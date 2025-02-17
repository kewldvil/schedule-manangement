package com.moi.noc.schedule.services;

import com.moi.noc.schedule.models.Uniform;
import com.moi.noc.schedule.repositories.UniformRepo;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
@Service
@RequiredArgsConstructor
public class UniformService {
    private final UniformRepo uniformRepository;

    // Create a new Uniform
    public Uniform createUniform(Uniform uniform) {
        return uniformRepository.save(uniform);
    }

    // Get all Uniforms
    public List<Uniform> getAllUniforms() {
        return uniformRepository.findAll();
    }

    // Get a Uniform by ID
    public Uniform getUniformById(Long id) {
        return uniformRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Uniform not found"));
    }

    // Update a Uniform
    public Uniform updateUniform(Long id, Uniform uniformDetails) {
        Uniform uniform = uniformRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Uniform not found"));

        uniform.setName(uniformDetails.getName());
        return uniformRepository.save(uniform);
    }

    // Delete a Uniform
    public void deleteUniform(Long id) {
        Uniform uniform = uniformRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Uniform not found"));

        uniformRepository.delete(uniform);
    }
}

