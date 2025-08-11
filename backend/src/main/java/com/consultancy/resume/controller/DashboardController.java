package com.consultancy.resume.controller;

import com.consultancy.resume.dto.CandidateResponse;
import com.consultancy.resume.entity.Candidate;
import com.consultancy.resume.service.CandidateService;
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

    @GetMapping("/stats")
    public ResponseEntity<Map<String, Object>> getDashboardStats() {
        Map<String, Object> stats = new HashMap<>();
        
        // Get counts by status
        Long benchCount = candidateService.getCountByStatus(Candidate.CandidateStatus.BENCH);
        Long workingCount = candidateService.getCountByStatus(Candidate.CandidateStatus.WORKING);
        Long interviewCount = candidateService.getCountByStatus(Candidate.CandidateStatus.INTERVIEW);
        Long placedCount = candidateService.getCountByStatus(Candidate.CandidateStatus.PLACED);
        
        stats.put("benchProfiles", benchCount);
        stats.put("workingCandidates", workingCount);
        stats.put("inInterview", interviewCount);
        stats.put("placed", placedCount);
        stats.put("totalCandidates", benchCount + workingCount + interviewCount + placedCount);
        
        // Get recent candidates
        List<CandidateResponse> recentCandidates = candidateService.getRecentCandidates(
            PageRequest.of(0, 5));
        stats.put("recentCandidates", recentCandidates);
        
        return ResponseEntity.ok(stats);
    }
}