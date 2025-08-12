package com.consultancy.resume.controller;

import com.consultancy.resume.dto.CandidateResponse;
import com.consultancy.resume.entity.Candidate;
import com.consultancy.resume.service.CandidateService;
import com.consultancy.resume.service.EmployeeService;
import com.consultancy.resume.service.VendorService;
import com.consultancy.resume.repository.BenchCandidateRepository;
import com.consultancy.resume.repository.WorkingCandidateRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/dashboard")
public class DashboardController {

    @Autowired
    private CandidateService candidateService;

    @Autowired
    private EmployeeService employeeService;

    @Autowired
    private VendorService vendorService;

    @Autowired
    private BenchCandidateRepository benchCandidateRepository;

    @Autowired
    private WorkingCandidateRepository workingCandidateRepository;

    @GetMapping("/stats")
    public ResponseEntity<Map<String, Object>> getDashboardStats() {
        Map<String, Object> stats = new HashMap<>();
        
        // Get counts by status from original candidates table
        Long benchCount = candidateService.getCountByStatus(Candidate.CandidateStatus.BENCH);
        Long workingCount = candidateService.getCountByStatus(Candidate.CandidateStatus.WORKING);
        Long interviewCount = candidateService.getCountByStatus(Candidate.CandidateStatus.INTERVIEW);
        Long placedCount = candidateService.getCountByStatus(Candidate.CandidateStatus.PLACED);
        
        // Get counts from new tables
        Long benchCandidatesCount = benchCandidateRepository.countBy();
        Long workingCandidatesCount = workingCandidateRepository.countBy();
        
        // Use the higher counts (prioritize new tables if they have data)
        Long finalBenchCount = Math.max(benchCount != null ? benchCount : 0, benchCandidatesCount != null ? benchCandidatesCount : 0);
        Long finalWorkingCount = Math.max(workingCount != null ? workingCount : 0, workingCandidatesCount != null ? workingCandidatesCount : 0);
        
        stats.put("benchProfiles", finalBenchCount);
        stats.put("workingCandidates", finalWorkingCount);
        stats.put("inInterview", interviewCount != null ? interviewCount : 0);
        stats.put("placed", placedCount != null ? placedCount : 0);
        stats.put("totalCandidates", finalBenchCount + finalWorkingCount + (interviewCount != null ? interviewCount : 0) + (placedCount != null ? placedCount : 0));
        
        // Get employee and vendor counts
        stats.put("totalEmployees", employeeService.getTotalEmployeesCount());
        stats.put("totalVendors", vendorService.getTotalVendorsCount());
        
        // Get recent candidates
        List<CandidateResponse> recentCandidates = candidateService.getRecentCandidates(
            PageRequest.of(0, 5));
        stats.put("recentCandidates", recentCandidates);
        
        return ResponseEntity.ok(stats);
    }
}