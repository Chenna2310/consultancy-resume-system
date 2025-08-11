package com.consultancy.resume.controller;

import com.consultancy.resume.dto.CandidateRequest;
import com.consultancy.resume.dto.CandidateResponse;
import com.consultancy.resume.entity.Candidate;
import com.consultancy.resume.service.CandidateService;
import com.consultancy.resume.service.UserPrincipal;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/candidates")
public class CandidateController {

    @Autowired
    private CandidateService candidateService;

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<CandidateResponse> createCandidate(
            @Valid @ModelAttribute CandidateRequest request,
            @RequestParam(value = "resume", required = false) MultipartFile resume,
            @AuthenticationPrincipal UserPrincipal currentUser) {
        
        CandidateResponse candidate = candidateService.createCandidate(request, resume, currentUser);
        return ResponseEntity.ok(candidate);
    }

    @GetMapping
    public ResponseEntity<Page<CandidateResponse>> getAllCandidates(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDir) {
        
        Sort sort = sortDir.equalsIgnoreCase("desc") ? 
            Sort.by(sortBy).descending() : Sort.by(sortBy).ascending();
        
        Pageable pageable = PageRequest.of(page, size, sort);
        Page<CandidateResponse> candidates = candidateService.getAllCandidates(pageable);
        
        return ResponseEntity.ok(candidates);
    }

    @GetMapping("/{id}")
    public ResponseEntity<CandidateResponse> getCandidateById(@PathVariable Long id) {
        CandidateResponse candidate = candidateService.getCandidateById(id);
        return ResponseEntity.ok(candidate);
    }

    @PutMapping("/{id}")
    public ResponseEntity<CandidateResponse> updateCandidate(
            @PathVariable Long id,
            @Valid @ModelAttribute CandidateRequest request,
            @RequestParam(value = "resume", required = false) MultipartFile resume) {
        
        CandidateResponse candidate = candidateService.updateCandidate(id, request, resume);
        return ResponseEntity.ok(candidate);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteCandidate(@PathVariable Long id) {
        candidateService.deleteCandidate(id);
        return ResponseEntity.ok().body("{\"message\": \"Candidate deleted successfully!\"}");
    }

    @GetMapping("/search")
    public ResponseEntity<Page<CandidateResponse>> searchCandidates(
            @RequestParam(required = false) String fullName,
            @RequestParam(required = false) Candidate.VisaStatus visaStatus,
            @RequestParam(required = false) String primarySkill,
            @RequestParam(required = false) String state,
            @RequestParam(required = false) Candidate.CandidateStatus status,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        Page<CandidateResponse> candidates = candidateService.searchCandidates(
            fullName, visaStatus, primarySkill, state, status, pageable);
        
        return ResponseEntity.ok(candidates);
    }

    @GetMapping("/status/{status}")
    public ResponseEntity<List<CandidateResponse>> getCandidatesByStatus(
            @PathVariable Candidate.CandidateStatus status) {
        List<CandidateResponse> candidates = candidateService.getCandidatesByStatus(status);
        return ResponseEntity.ok(candidates);
    }

    @GetMapping("/{id}/resume")
    public ResponseEntity<byte[]> downloadResume(@PathVariable Long id) {
        byte[] resumeData = candidateService.getResumeFile(id);
        CandidateResponse candidate = candidateService.getCandidateById(id);
        
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, 
                       "attachment; filename=\"" + candidate.getResumeFilename() + "\"")
                .contentType(MediaType.APPLICATION_OCTET_STREAM)
                .body(resumeData);
    }
}