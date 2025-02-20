package com.moi.noc.schedule.controller;

import com.moi.noc.schedule.models.Uniform;
import com.moi.noc.schedule.services.UniformService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/uniforms")
@RequiredArgsConstructor
@Slf4j
public class UniformController {
    private final UniformService uniformService;

    // Create a new Uniform
    @PostMapping
    public ResponseEntity<Uniform> createUniform(@RequestBody Uniform uniform) {
        log.info("Creating a new Uniform: {}", uniform);
        Uniform createdUniform = uniformService.createUniform(uniform);
        return new ResponseEntity<>(createdUniform, HttpStatus.CREATED);
    }

    //     Get all Uniforms
    @GetMapping
    public ResponseEntity<List<Uniform>> getAllUniforms() {
        log.info("Fetching all Uniforms");
        List<Uniform> uniforms = uniformService.getAllUniforms();
        return new ResponseEntity<>(uniforms, HttpStatus.OK);
    }

    // Get a Uniform by ID
    @GetMapping("/{id}")
    public ResponseEntity<Uniform> getUniformById(@PathVariable Long id) {
        log.info("Fetching Uniform with ID: {}", id);
        Uniform uniform = uniformService.getUniformById(id);
        return new ResponseEntity<>(uniform, HttpStatus.OK);
    }

    // Update a Uniform
    @PutMapping("/{id}")
    public ResponseEntity<Uniform> updateUniform(@PathVariable Long id, @RequestBody Uniform uniformDetails) {
        log.info("Updating Uniform with ID: {}", id);
        Uniform updatedUniform = uniformService.updateUniform(id, uniformDetails);
        return new ResponseEntity<>(updatedUniform, HttpStatus.OK);
    }

    // Delete a Uniform
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteUniform(@PathVariable Long id) {
        log.info("Deleting Uniform with ID: {}", id);
        uniformService.deleteUniform(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }
}
