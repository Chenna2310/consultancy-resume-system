package com.consultancy.resume.service;

import com.consultancy.resume.dto.CandidateRequest;
import com.consultancy.resume.dto.CandidateResponse;
import com.consultancy.resume.entity.Candidate;
import com.consultancy.resume.entity.User;
import com.consultancy.resume.repository.CandidateRepository;
import com.consultancy.resume.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class CandidateService {

    @Autowired
    private CandidateRepository candidateRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private FileStorageService fileStorageService;

    public CandidateResponse createCandidate(CandidateRequest request, MultipartFile resume, 
                                           UserPrincipal currentUser) {
        Candidate candidate = new Candidate();
        candidate.setFullName(request.getFullName());
        candidate.setVisaStatus(request.getVisaStatus());
        candidate.setCity(request.getCity());
        candidate.setState(request.getState());
        candidate.setPrimarySkill(request.getPrimarySkill());
        candidate.setExperienceYears(request.getExperienceYears());
        candidate.setContactInfo(request.getContactInfo());
        candidate.setNotes(request.getNotes());
        
        if (request.getStatus() != null) {
            candidate.setStatus(request.getStatus());
        }

        // Set the user who created this candidate
        User user = userRepository.findById(currentUser.getId())
            .orElseThrow(() -> new RuntimeException("User not found"));
        candidate.setCreatedBy(user);

        // Handle file upload
        if (resume != null && !resume.isEmpty()) {
            String filename = fileStorageService.storeFile(resume);
            candidate.setResumeFilename(resume.getOriginalFilename());
            candidate.setResumePath(filename);
        }

        Candidate savedCandidate = candidateRepository.save(candidate);
        return new CandidateResponse(savedCandidate);
    }

    public Page<CandidateResponse> getAllCandidates(Pageable pageable) {
        Page<Candidate> candidates = candidateRepository.findAll(pageable);
        return candidates.map(CandidateResponse::new);
    }

    public CandidateResponse getCandidateById(Long id) {
        Candidate candidate = candidateRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Candidate not found with id: " + id));
        return new CandidateResponse(candidate);
    }

    public CandidateResponse updateCandidate(Long id, CandidateRequest request, MultipartFile resume) {
        Candidate candidate = candidateRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Candidate not found with id: " + id));

        candidate.setFullName(request.getFullName());
        candidate.setVisaStatus(request.getVisaStatus());
        candidate.setCity(request.getCity());
        candidate.setState(request.getState());
        candidate.setPrimarySkill(request.getPrimarySkill());
        candidate.setExperienceYears(request.getExperienceYears());
        candidate.setContactInfo(request.getContactInfo());
        candidate.setNotes(request.getNotes());
        
        if (request.getStatus() != null) {
            candidate.setStatus(request.getStatus());
        }

        // Handle file upload
        if (resume != null && !resume.isEmpty()) {
            // Delete old file if exists
            if (candidate.getResumePath() != null) {
                fileStorageService.deleteFile(candidate.getResumePath());
            }
            
            String filename = fileStorageService.storeFile(resume);
            candidate.setResumeFilename(resume.getOriginalFilename());
            candidate.setResumePath(filename);
        }

        Candidate updatedCandidate = candidateRepository.save(candidate);
        return new CandidateResponse(updatedCandidate);
    }

    public void deleteCandidate(Long id) {
        Candidate candidate = candidateRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Candidate not found with id: " + id));

        // Delete resume file if exists
        if (candidate.getResumePath() != null) {
            fileStorageService.deleteFile(candidate.getResumePath());
        }

        candidateRepository.delete(candidate);
    }

    public Page<CandidateResponse> searchCandidates(String fullName, Candidate.VisaStatus visaStatus,
                                                   String primarySkill, String state, 
                                                   Candidate.CandidateStatus status, Pageable pageable) {
        Page<Candidate> candidates = candidateRepository.searchCandidates(
            fullName, visaStatus, primarySkill, state, status, pageable);
        return candidates.map(CandidateResponse::new);
    }

    public List<CandidateResponse> getCandidatesByStatus(Candidate.CandidateStatus status) {
        List<Candidate> candidates = candidateRepository.findByStatus(status);
        return candidates.stream()
                .map(CandidateResponse::new)
                .collect(Collectors.toList());
    }

    public Long getCountByStatus(Candidate.CandidateStatus status) {
        return candidateRepository.countByStatus(status);
    }

    public List<CandidateResponse> getRecentCandidates(Pageable pageable) {
        List<Candidate> candidates = candidateRepository.findRecentCandidates(pageable);
        return candidates.stream()
                .map(CandidateResponse::new)
                .collect(Collectors.toList());
    }

    public byte[] getResumeFile(Long candidateId) {
        Candidate candidate = candidateRepository.findById(candidateId)
            .orElseThrow(() -> new RuntimeException("Candidate not found with id: " + candidateId));

        if (candidate.getResumePath() == null) {
            throw new RuntimeException("No resume file found for candidate");
        }

        return fileStorageService.loadFileAsBytes(candidate.getResumePath());
    }
}