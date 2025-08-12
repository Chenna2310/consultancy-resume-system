package com.consultancy.resume.controller;

import com.consultancy.resume.dto.WorkingCandidateRequest;
import com.consultancy.resume.dto.WorkingCandidateResponse;
import com.consultancy.resume.entity.WorkingCandidate;
import com.consultancy.resume.service.WorkingCandidateService;
import com.consultancy.resume.service.UserPrincipal;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/working-candidates")
public class WorkingCandidateController {

    @Autowired
    private WorkingCandidateService workingCandidateService;

    @PostMapping
    public ResponseEntity<WorkingCandidateResponse> createWorkingCandidate(
            @Valid @RequestBody WorkingCandidateRequest request,
            @AuthenticationPrincipal UserPrincipal currentUser) {
        
        WorkingCandidateResponse candidate = workingCandidateService.createWorkingCandidate(request, currentUser);
        return ResponseEntity.ok(candidate);
    }

    @GetMapping
    public ResponseEntity<Page<WorkingCandidateResponse>> getAllWorkingCandidates(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDir) {
        
        Sort sort = sortDir.equalsIgnoreCase("desc") ? 
            Sort.by(sortBy).descending() : Sort.by(sortBy).ascending();
        
        Pageable pageable = PageRequest.of(page, size, sort);
        Page<WorkingCandidateResponse> candidates = workingCandidateService.getAllWorkingCandidates(pageable);
        
        return ResponseEntity.ok(candidates);
    }

    @GetMapping("/{id}")
    public ResponseEntity<WorkingCandidateResponse> getWorkingCandidateById(@PathVariable Long id) {
        WorkingCandidateResponse candidate = workingCandidateService.getWorkingCandidateById(id);
        return ResponseEntity.ok(candidate);
    }

    @PutMapping("/{id}")
    public ResponseEntity<WorkingCandidateResponse> updateWorkingCandidate(
            @PathVariable Long id,
            @Valid @RequestBody WorkingCandidateRequest request) {
        
        WorkingCandidateResponse candidate = workingCandidateService.updateWorkingCandidate(id, request);
        return ResponseEntity.ok(candidate);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteWorkingCandidate(@PathVariable Long id) {
        workingCandidateService.deleteWorkingCandidate(id);
        return ResponseEntity.ok().body("{\"message\": \"Working candidate deleted successfully!\"}");
    }

    @GetMapping("/search")
    public ResponseEntity<Page<WorkingCandidateResponse>> searchWorkingCandidates(
            @RequestParam(required = false) String fullName,
            @RequestParam(required = false) WorkingCandidate.VisaStatus visaStatus,
            @RequestParam(required = false) String jobRole,
            @RequestParam(required = false) String clientName,
            @RequestParam(required = false) String placedByName,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        Page<WorkingCandidateResponse> candidates = workingCandidateService.searchWorkingCandidates(
            fullName, visaStatus, jobRole, clientName, placedByName, pageable);
        
        return ResponseEntity.ok(candidates);
    }
}