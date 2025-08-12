package com.consultancy.resume.controller;

import com.consultancy.resume.dto.CandidateActivityRequest;
import com.consultancy.resume.dto.CandidateActivityResponse;
import com.consultancy.resume.entity.CandidateActivity;
import com.consultancy.resume.service.CandidateActivityService;
import com.consultancy.resume.service.UserPrincipal;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/candidate-activities")
public class CandidateActivityController {

    @Autowired
    private CandidateActivityService activityService;

    @PostMapping
    public ResponseEntity<CandidateActivityResponse> createActivity(
            @Valid @RequestBody CandidateActivityRequest request,
            @AuthenticationPrincipal UserPrincipal currentUser) {
        
        CandidateActivityResponse activity = activityService.createActivity(request, currentUser);
        return ResponseEntity.ok(activity);
    }

    @GetMapping("/candidate/{candidateId}")
    public ResponseEntity<List<CandidateActivityResponse>> getActivitiesByCandidateId(
            @PathVariable Long candidateId) {
        List<CandidateActivityResponse> activities = activityService.getActivitiesByCandidateId(candidateId);
        return ResponseEntity.ok(activities);
    }

    @GetMapping("/candidate/{candidateId}/paginated")
    public ResponseEntity<Page<CandidateActivityResponse>> getActivitiesByCandidateIdPaginated(
            @PathVariable Long candidateId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        
        Pageable pageable = PageRequest.of(page, size, Sort.by("activityDate").descending());
        Page<CandidateActivityResponse> activities = activityService.getActivitiesByCandidateId(candidateId, pageable);
        return ResponseEntity.ok(activities);
    }

    @GetMapping("/{id}")
    public ResponseEntity<CandidateActivityResponse> getActivityById(@PathVariable Long id) {
        CandidateActivityResponse activity = activityService.getActivityById(id);
        return ResponseEntity.ok(activity);
    }

    @PutMapping("/{id}")
    public ResponseEntity<CandidateActivityResponse> updateActivity(
            @PathVariable Long id,
            @Valid @RequestBody CandidateActivityRequest request) {
        
        CandidateActivityResponse activity = activityService.updateActivity(id, request);
        return ResponseEntity.ok(activity);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteActivity(@PathVariable Long id) {
        activityService.deleteActivity(id);
        return ResponseEntity.ok().body("{\"message\": \"Activity deleted successfully!\"}");
    }

    @GetMapping("/search")
    public ResponseEntity<Page<CandidateActivityResponse>> searchActivities(
            @RequestParam(required = false) Long candidateId,
            @RequestParam(required = false) CandidateActivity.ActivityType activityType,
            @RequestParam(required = false) String clientName,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        
        Pageable pageable = PageRequest.of(page, size, Sort.by("activityDate").descending());
        Page<CandidateActivityResponse> activities = activityService.searchActivities(
            candidateId, activityType, clientName, startDate, endDate, pageable);
        
        return ResponseEntity.ok(activities);
    }

    @GetMapping("/type/{activityType}")
    public ResponseEntity<List<CandidateActivityResponse>> getActivitiesByType(
            @PathVariable CandidateActivity.ActivityType activityType) {
        List<CandidateActivityResponse> activities = activityService.getActivitiesByType(activityType);
        return ResponseEntity.ok(activities);
    }

    @GetMapping("/date-range")
    public ResponseEntity<List<CandidateActivityResponse>> getActivitiesByDateRange(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        List<CandidateActivityResponse> activities = activityService.getActivitiesByDateRange(startDate, endDate);
        return ResponseEntity.ok(activities);
    }

    @GetMapping("/recent")
    public ResponseEntity<List<CandidateActivityResponse>> getRecentActivities(
            @RequestParam(defaultValue = "10") int limit) {
        Pageable pageable = PageRequest.of(0, limit);
        List<CandidateActivityResponse> activities = activityService.getRecentActivities(pageable);
        return ResponseEntity.ok(activities);
    }

    @GetMapping("/count/candidate/{candidateId}")
    public ResponseEntity<Long> getActivityCountByCandidate(@PathVariable Long candidateId) {
        Long count = activityService.getActivityCountByCandidate(candidateId);
        return ResponseEntity.ok(count);
    }

    @GetMapping("/count/type/{activityType}")
    public ResponseEntity<Long> getActivityCountByType(@PathVariable CandidateActivity.ActivityType activityType) {
        Long count = activityService.getActivityCountByType(activityType);
        return ResponseEntity.ok(count);
    }
}