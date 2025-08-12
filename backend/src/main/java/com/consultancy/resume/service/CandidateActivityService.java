package com.consultancy.resume.service;

import com.consultancy.resume.dto.CandidateActivityRequest;
import com.consultancy.resume.dto.CandidateActivityResponse;
import com.consultancy.resume.entity.CandidateActivity;
import com.consultancy.resume.entity.User;
import com.consultancy.resume.repository.CandidateActivityRepository;
import com.consultancy.resume.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class CandidateActivityService {

    @Autowired
    private CandidateActivityRepository activityRepository;

    @Autowired
    private UserRepository userRepository;

    public CandidateActivityResponse createActivity(CandidateActivityRequest request, UserPrincipal currentUser) {
        CandidateActivity activity = new CandidateActivity();
        activity.setCandidateId(request.getCandidateId());
        activity.setActivityType(request.getActivityType());
        activity.setClientName(request.getClientName());
        activity.setContactPerson(request.getContactPerson());
        activity.setContactPhone(request.getContactPhone());
        activity.setContactEmail(request.getContactEmail());
        activity.setSubmittedRate(request.getSubmittedRate());
        activity.setNotes(request.getNotes());
        activity.setActivityDate(request.getActivityDate());

        // Set the user who created this activity
        User user = userRepository.findById(currentUser.getId())
            .orElseThrow(() -> new RuntimeException("User not found"));
        activity.setCreatedBy(user);

        CandidateActivity savedActivity = activityRepository.save(activity);
        return new CandidateActivityResponse(savedActivity);
    }

    public List<CandidateActivityResponse> getActivitiesByCandidateId(Long candidateId) {
        List<CandidateActivity> activities = activityRepository.findByCandidateIdOrderByActivityDateDesc(candidateId);
        return activities.stream()
                .map(CandidateActivityResponse::new)
                .collect(Collectors.toList());
    }

    public Page<CandidateActivityResponse> getActivitiesByCandidateId(Long candidateId, Pageable pageable) {
        Page<CandidateActivity> activities = activityRepository.findByCandidateId(candidateId, pageable);
        return activities.map(CandidateActivityResponse::new);
    }

    public CandidateActivityResponse getActivityById(Long id) {
        CandidateActivity activity = activityRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Activity not found with id: " + id));
        return new CandidateActivityResponse(activity);
    }

    public CandidateActivityResponse updateActivity(Long id, CandidateActivityRequest request) {
        CandidateActivity activity = activityRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Activity not found with id: " + id));

        activity.setActivityType(request.getActivityType());
        activity.setClientName(request.getClientName());
        activity.setContactPerson(request.getContactPerson());
        activity.setContactPhone(request.getContactPhone());
        activity.setContactEmail(request.getContactEmail());
        activity.setSubmittedRate(request.getSubmittedRate());
        activity.setNotes(request.getNotes());
        activity.setActivityDate(request.getActivityDate());

        CandidateActivity updatedActivity = activityRepository.save(activity);
        return new CandidateActivityResponse(updatedActivity);
    }

    public void deleteActivity(Long id) {
        CandidateActivity activity = activityRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Activity not found with id: " + id));
        activityRepository.delete(activity);
    }

    public Page<CandidateActivityResponse> searchActivities(Long candidateId, CandidateActivity.ActivityType activityType,
                                                           String clientName, LocalDate startDate, LocalDate endDate,
                                                           Pageable pageable) {
        Page<CandidateActivity> activities = activityRepository.searchActivities(
            candidateId, activityType, clientName, startDate, endDate, pageable);
        return activities.map(CandidateActivityResponse::new);
    }

    public List<CandidateActivityResponse> getActivitiesByType(CandidateActivity.ActivityType activityType) {
        List<CandidateActivity> activities = activityRepository.findByActivityType(activityType);
        return activities.stream()
                .map(CandidateActivityResponse::new)
                .collect(Collectors.toList());
    }

    public List<CandidateActivityResponse> getActivitiesByDateRange(LocalDate startDate, LocalDate endDate) {
        List<CandidateActivity> activities = activityRepository.findByActivityDateBetween(startDate, endDate);
        return activities.stream()
                .map(CandidateActivityResponse::new)
                .collect(Collectors.toList());
    }

    public Long getActivityCountByCandidate(Long candidateId) {
        return activityRepository.countByCandidateId(candidateId);
    }

    public Long getActivityCountByType(CandidateActivity.ActivityType activityType) {
        return activityRepository.countByActivityType(activityType);
    }

    public List<CandidateActivityResponse> getRecentActivities(Pageable pageable) {
        List<CandidateActivity> activities = activityRepository.findRecentActivities(pageable);
        return activities.stream()
                .map(CandidateActivityResponse::new)
                .collect(Collectors.toList());
    }
}