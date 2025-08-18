package com.consultancy.resume.controller;

import com.consultancy.resume.dto.BenchCandidateRequest;
import com.consultancy.resume.dto.BenchCandidateResponse;
import com.consultancy.resume.dto.CandidateDocumentResponse;
import com.consultancy.resume.entity.BenchCandidate;
import com.consultancy.resume.service.BenchCandidateService;
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
@RequestMapping("/bench-candidates")
public class BenchCandidateController {

    @Autowired
    private BenchCandidateService benchCandidateService;

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<BenchCandidateResponse> createBenchCandidate(
            @Valid @ModelAttribute BenchCandidateRequest request,
            @RequestParam(value = "documents", required = false) MultipartFile[] documents,
            @AuthenticationPrincipal UserPrincipal currentUser) {
        
        BenchCandidateResponse candidate = benchCandidateService.createBenchCandidate(request, documents, currentUser);
        return ResponseEntity.ok(candidate);
    }

    @GetMapping
    public ResponseEntity<Page<BenchCandidateResponse>> getAllBenchCandidates(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDir) {
        
        Sort sort = sortDir.equalsIgnoreCase("desc") ? 
            Sort.by(sortBy).descending() : Sort.by(sortBy).ascending();
        
        Pageable pageable = PageRequest.of(page, size, sort);
        Page<BenchCandidateResponse> candidates = benchCandidateService.getAllBenchCandidates(pageable);
        
        return ResponseEntity.ok(candidates);
    }

    @GetMapping("/{id}")
    public ResponseEntity<BenchCandidateResponse> getBenchCandidateById(@PathVariable Long id) {
        BenchCandidateResponse candidate = benchCandidateService.getBenchCandidateById(id);
        return ResponseEntity.ok(candidate);
    }

    @PutMapping("/{id}")
    public ResponseEntity<BenchCandidateResponse> updateBenchCandidate(
            @PathVariable Long id,
            @Valid @ModelAttribute BenchCandidateRequest request,
            @RequestParam(value = "documents", required = false) MultipartFile[] documents) {
        
        BenchCandidateResponse candidate = benchCandidateService.updateBenchCandidate(id, request, documents);
        return ResponseEntity.ok(candidate);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteBenchCandidate(@PathVariable Long id) {
        benchCandidateService.deleteBenchCandidate(id);
        return ResponseEntity.ok().body("{\"message\": \"Bench candidate deleted successfully!\"}");
    }

    @GetMapping("/search")
    public ResponseEntity<Page<BenchCandidateResponse>> searchBenchCandidates(
            @RequestParam(required = false) String fullName,
            @RequestParam(required = false) BenchCandidate.VisaStatus visaStatus,
            @RequestParam(required = false) String primarySkill,
            @RequestParam(required = false) String state,
            @RequestParam(required = false) String assignedConsultantName,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        Page<BenchCandidateResponse> candidates = benchCandidateService.searchBenchCandidates(
            fullName, visaStatus, primarySkill, state, assignedConsultantName, pageable);
        
        return ResponseEntity.ok(candidates);
    }

    @GetMapping("/consultant/{consultantId}")
    public ResponseEntity<List<BenchCandidateResponse>> getBenchCandidatesByConsultant(
            @PathVariable Long consultantId) {
        List<BenchCandidateResponse> candidates = benchCandidateService.getBenchCandidatesByConsultant(consultantId);
        return ResponseEntity.ok(candidates);
    }

    // Legacy resume download endpoint (backward compatibility)
    @GetMapping("/{id}/resume")
    public ResponseEntity<byte[]> downloadResume(@PathVariable Long id) {
        byte[] resumeData = benchCandidateService.getResumeFile(id);
        BenchCandidateResponse candidate = benchCandidateService.getBenchCandidateById(id);
        
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, 
                       "attachment; filename=\"" + candidate.getResumeFilename() + "\"")
                .contentType(MediaType.APPLICATION_OCTET_STREAM)
                .body(resumeData);
    }

    // Document management endpoints
    @GetMapping("/{id}/documents")
    public ResponseEntity<List<CandidateDocumentResponse>> getCandidateDocuments(@PathVariable Long id) {
        List<CandidateDocumentResponse> documents = benchCandidateService.getCandidateDocuments(id);
        return ResponseEntity.ok(documents);
    }

    @PostMapping("/{id}/documents")
    public ResponseEntity<CandidateDocumentResponse> uploadDocument(
            @PathVariable Long id,
            @RequestParam("file") MultipartFile file,
            @AuthenticationPrincipal UserPrincipal currentUser) {
        
        CandidateDocumentResponse document = benchCandidateService.uploadDocument(id, file, currentUser);
        return ResponseEntity.ok(document);
    }

    @PostMapping("/{id}/documents/multiple")
    public ResponseEntity<List<CandidateDocumentResponse>> uploadMultipleDocuments(
            @PathVariable Long id,
            @RequestParam("files") MultipartFile[] files,
            @AuthenticationPrincipal UserPrincipal currentUser) {
        
        List<CandidateDocumentResponse> documents = new java.util.ArrayList<>();
        for (MultipartFile file : files) {
            if (!file.isEmpty()) {
                CandidateDocumentResponse document = benchCandidateService.uploadDocument(id, file, currentUser);
                documents.add(document);
            }
        }
        return ResponseEntity.ok(documents);
    }

    @GetMapping("/{candidateId}/documents/{documentId}")
    public ResponseEntity<byte[]> downloadDocument(
            @PathVariable Long candidateId,
            @PathVariable Long documentId) {
        
        byte[] documentData = benchCandidateService.downloadDocument(candidateId, documentId);
        CandidateDocumentResponse document = benchCandidateService.getDocumentById(candidateId, documentId);
        
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, 
                       "attachment; filename=\"" + document.getOriginalFilename() + "\"")
                .contentType(MediaType.APPLICATION_OCTET_STREAM)
                .body(documentData);
    }

    @DeleteMapping("/{candidateId}/documents/{documentId}")
    public ResponseEntity<?> deleteDocument(
            @PathVariable Long candidateId,
            @PathVariable Long documentId) {
        
        benchCandidateService.deleteDocument(candidateId, documentId);
        return ResponseEntity.ok().body("{\"message\": \"Document deleted successfully!\"}");
    }

    @GetMapping("/{candidateId}/documents/{documentId}/info")
    public ResponseEntity<CandidateDocumentResponse> getDocumentInfo(
            @PathVariable Long candidateId,
            @PathVariable Long documentId) {
        
        CandidateDocumentResponse document = benchCandidateService.getDocumentById(candidateId, documentId);
        return ResponseEntity.ok(document);
    }
}