package com.consultancy.resume.service;

import com.consultancy.resume.dto.WorkingCandidateRequest;
import com.consultancy.resume.dto.WorkingCandidateResponse;
import com.consultancy.resume.entity.WorkingCandidate;
import com.consultancy.resume.entity.Employee;
import com.consultancy.resume.entity.User;
import com.consultancy.resume.repository.WorkingCandidateRepository;
import com.consultancy.resume.repository.EmployeeRepository;
import com.consultancy.resume.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class WorkingCandidateService {

    @Autowired
    private WorkingCandidateRepository workingCandidateRepository;

    @Autowired
    private EmployeeRepository employeeRepository;

    @Autowired
    private UserRepository userRepository;

    public WorkingCandidateResponse createWorkingCandidate(WorkingCandidateRequest request, UserPrincipal currentUser) {
        WorkingCandidate candidate = new WorkingCandidate();
        candidate.setFullName(request.getFullName());
        candidate.setVisaStatus(request.getVisaStatus());
        candidate.setWorkingLocation(request.getWorkingLocation());
        candidate.setJobRole(request.getJobRole());
        candidate.setExperienceYears(request.getExperienceYears());
        candidate.setEmail(request.getEmail());
        candidate.setPhoneNumber(request.getPhoneNumber());
        candidate.setHourlyRate(request.getHourlyRate());
        candidate.setProjectDuration(request.getProjectDuration());
        candidate.setClientName(request.getClientName());
        candidate.setNotes(request.getNotes());

        // Set placed by employee
        Employee placedByEmployee = employeeRepository.findById(request.getPlacedBy())
            .orElseThrow(() -> new RuntimeException("Employee not found"));
        candidate.setPlacedBy(placedByEmployee);

        // Set the user who created this candidate
        User user = userRepository.findById(currentUser.getId())
            .orElseThrow(() -> new RuntimeException("User not found"));
        candidate.setCreatedBy(user);

        WorkingCandidate savedCandidate = workingCandidateRepository.save(candidate);
        return new WorkingCandidateResponse(savedCandidate);
    }

    public Page<WorkingCandidateResponse> getAllWorkingCandidates(Pageable pageable) {
        Page<WorkingCandidate> candidates = workingCandidateRepository.findAll(pageable);
        return candidates.map(WorkingCandidateResponse::new);
    }

    public WorkingCandidateResponse getWorkingCandidateById(Long id) {
        WorkingCandidate candidate = workingCandidateRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Working candidate not found with id: " + id));
        return new WorkingCandidateResponse(candidate);
    }

    public WorkingCandidateResponse updateWorkingCandidate(Long id, WorkingCandidateRequest request) {
        WorkingCandidate candidate = workingCandidateRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Working candidate not found with id: " + id));

        candidate.setFullName(request.getFullName());
        candidate.setVisaStatus(request.getVisaStatus());
        candidate.setWorkingLocation(request.getWorkingLocation());
        candidate.setJobRole(request.getJobRole());
        candidate.setExperienceYears(request.getExperienceYears());
        candidate.setEmail(request.getEmail());
        candidate.setPhoneNumber(request.getPhoneNumber());
        candidate.setHourlyRate(request.getHourlyRate());
        candidate.setProjectDuration(request.getProjectDuration());
        candidate.setClientName(request.getClientName());
        candidate.setNotes(request.getNotes());

        // Update placed by employee
        Employee placedByEmployee = employeeRepository.findById(request.getPlacedBy())
            .orElseThrow(() -> new RuntimeException("Employee not found"));
        candidate.setPlacedBy(placedByEmployee);

        WorkingCandidate updatedCandidate = workingCandidateRepository.save(candidate);
        return new WorkingCandidateResponse(updatedCandidate);
    }

    public void deleteWorkingCandidate(Long id) {
        WorkingCandidate candidate = workingCandidateRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Working candidate not found with id: " + id));
        workingCandidateRepository.delete(candidate);
    }

    public Page<WorkingCandidateResponse> searchWorkingCandidates(String fullName, WorkingCandidate.VisaStatus visaStatus,
                                                                 String jobRole, String clientName, String placedByName,
                                                                 Pageable pageable) {
        Page<WorkingCandidate> candidates = workingCandidateRepository.searchWorkingCandidates(
            fullName, visaStatus, jobRole, clientName, placedByName, pageable);
        return candidates.map(WorkingCandidateResponse::new);
    }

    public Long getTotalWorkingCandidatesCount() {
        return workingCandidateRepository.count();
    }
}