package com.consultancy.resume.controller;

import com.consultancy.resume.service.CandidateService;
import com.consultancy.resume.service.EmployeeService;
import com.consultancy.resume.service.VendorService;
import com.consultancy.resume.service.BenchCandidateService;
import com.consultancy.resume.service.WorkingCandidateService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
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
    private BenchCandidateService benchCandidateService;

    @Autowired
    private WorkingCandidateService workingCandidateService;

    @GetMapping("/stats")
    public ResponseEntity<Map<String, Object>> getDashboardStats() {
        Map<String, Object> stats = new HashMap<>();
        
        // Get counts from new dedicated tables
        Long benchCandidatesCount = benchCandidateService.getTotalBenchCandidatesCount();
        Long workingCandidatesCount = workingCandidateService.getTotalWorkingCandidatesCount();
        
        // Use new table counts as primary source
        stats.put("benchProfiles", benchCandidatesCount != null ? benchCandidatesCount : 0);
        stats.put("workingCandidates", workingCandidatesCount != null ? workingCandidatesCount : 0);
        stats.put("inInterview", 0L); // Can be added later
        stats.put("placed", 0L); // Can be added later
        stats.put("totalCandidates", (benchCandidatesCount != null ? benchCandidatesCount : 0) + 
                                   (workingCandidatesCount != null ? workingCandidatesCount : 0));
        
        // Get employee and vendor counts
        stats.put("totalEmployees", employeeService.getTotalEmployeesCount());
        stats.put("totalVendors", vendorService.getTotalVendorsCount());
        
        return ResponseEntity.ok(stats);
    }
}