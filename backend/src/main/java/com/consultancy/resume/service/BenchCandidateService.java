package com.consultancy.resume.service;

import com.consultancy.resume.dto.BenchCandidateRequest;
import com.consultancy.resume.dto.BenchCandidateResponse;
import com.consultancy.resume.entity.BenchCandidate;
import com.consultancy.resume.entity.Employee;
import com.consultancy.resume.entity.User;
import com.consultancy.resume.repository.BenchCandidateRepository;
import com.consultancy.resume.repository.EmployeeRepository;
import com.consultancy.resume.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class BenchCandidateService {

    @Autowired
    private BenchCandidateRepository benchCandidateRepository;

    @Autowired
    private EmployeeRepository employeeRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private FileStorageService fileStorageService;

    public BenchCandidateResponse createBenchCandidate(BenchCandidateRequest request, MultipartFile resume, 
                                                      UserPrincipal currentUser) {
        BenchCandidate candidate = new BenchCandidate();
        candidate.setFullName(request.getFullName());
        candidate.setVisaStatus(request.getVisaStatus());
        candidate.setCity(request.getCity());
        candidate.setState(request.getState());
        candidate.setPrimarySkill(request.getPrimarySkill());
        candidate.setExperienceYears(request.getExperienceYears());
        candidate.setPhoneNumber(request.getPhoneNumber());
        candidate.setEmail(request.getEmail());
        candidate.setTargetRate(request.getTargetRate());
        candidate.setNotes(request.getNotes());

        // Set assigned consultant if provided
        if (request.getAssignedConsultantId() != null) {
            Employee consultant = employeeRepository.findById(request.getAssignedConsultantId())
                .orElseThrow(() -> new RuntimeException("Consultant not found"));
            candidate.setAssignedConsultant(consultant);
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

        BenchCandidate savedCandidate = benchCandidateRepository.save(candidate);
        return new BenchCandidateResponse(savedCandidate);
    }

    public Page<BenchCandidateResponse> getAllBenchCandidates(Pageable pageable) {
        Page<BenchCandidate> candidates = benchCandidateRepository.findAll(pageable);
        return candidates.map(BenchCandidateResponse::new);
    }

    public BenchCandidateResponse getBenchCandidateById(Long id) {
        BenchCandidate candidate = benchCandidateRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Bench candidate not found with id: " + id));
        return new BenchCandidateResponse(candidate);
    }

    public BenchCandidateResponse updateBenchCandidate(Long id, BenchCandidateRequest request, MultipartFile resume) {
        BenchCandidate candidate = benchCandidateRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Bench candidate not found with id: " + id));

        candidate.setFullName(request.getFullName());
        candidate.setVisaStatus(request.getVisaStatus());
        candidate.setCity(request.getCity());
        candidate.setState(request.getState());
        candidate.setPrimarySkill(request.getPrimarySkill());
        candidate.setExperienceYears(request.getExperienceYears());
        candidate.setPhoneNumber(request.getPhoneNumber());
        candidate.setEmail(request.getEmail());
        candidate.setTargetRate(request.getTargetRate());
        candidate.setNotes(request.getNotes());

        // Update assigned consultant
        if (request.getAssignedConsultantId() != null) {
            Employee consultant = employeeRepository.findById(request.getAssignedConsultantId())
                .orElseThrow(() -> new RuntimeException("Consultant not found"));
            candidate.setAssignedConsultant(consultant);
        } else {
            candidate.setAssignedConsultant(null);
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

        BenchCandidate updatedCandidate = benchCandidateRepository.save(candidate);
        return new BenchCandidateResponse(updatedCandidate);
    }

    public void deleteBenchCandidate(Long id) {
        BenchCandidate candidate = benchCandidateRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Bench candidate not found with id: " + id));

        // Delete resume file if exists
        if (candidate.getResumePath() != null) {
            fileStorageService.deleteFile(candidate.getResumePath());
        }

        benchCandidateRepository.delete(candidate);
    }

    public Page<BenchCandidateResponse> searchBenchCandidates(String fullName, BenchCandidate.VisaStatus visaStatus,
                                                             String primarySkill, String state, 
                                                             String assignedConsultantName, Pageable pageable) {
        Page<BenchCandidate> candidates = benchCandidateRepository.searchBenchCandidates(
            fullName, visaStatus, primarySkill, state, assignedConsultantName, pageable);
        return candidates.map(BenchCandidateResponse::new);
    }

    public List<BenchCandidateResponse> getBenchCandidatesByConsultant(Long consultantId) {
        Employee consultant = employeeRepository.findById(consultantId)
            .orElseThrow(() -> new RuntimeException("Consultant not found"));
        
        List<BenchCandidate> candidates = benchCandidateRepository.findByAssignedConsultant(consultant);
        return candidates.stream()
                .map(BenchCandidateResponse::new)
                .collect(Collectors.toList());
    }

    public List<BenchCandidateResponse> getRecentBenchCandidates(Pageable pageable) {
        List<BenchCandidate> candidates = benchCandidateRepository.findRecentBenchCandidates(pageable);
        return candidates.stream()
                .map(BenchCandidateResponse::new)
                .collect(Collectors.toList());
    }

    public byte[] getResumeFile(Long candidateId) {
        BenchCandidate candidate = benchCandidateRepository.findById(candidateId)
            .orElseThrow(() -> new RuntimeException("Bench candidate not found with id: " + candidateId));

        if (candidate.getResumePath() == null) {
            throw new RuntimeException("No resume file found for candidate");
        }

        return fileStorageService.loadFileAsBytes(candidate.getResumePath());
    }

    public Long getTotalBenchCandidatesCount() {
        return benchCandidateRepository.countBy();
    }
}