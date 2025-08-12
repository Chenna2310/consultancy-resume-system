package com.consultancy.resume.dto;

import com.consultancy.resume.entity.WorkingCandidate;
import java.math.BigDecimal;
import java.time.LocalDateTime;

public class WorkingCandidateResponse {
    private Long id;
    private String fullName;
    private WorkingCandidate.VisaStatus visaStatus;
    private String workingLocation;
    private String jobRole;
    private Integer experienceYears;
    private String email;
    private String phoneNumber;
    private BigDecimal hourlyRate;
    private String projectDuration;
    private String clientName;
    private Long placedById;
    private String placedByName;
    private String notes;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private String createdByName;

    public WorkingCandidateResponse(WorkingCandidate candidate) {
        this.id = candidate.getId();
        this.fullName = candidate.getFullName();
        this.visaStatus = candidate.getVisaStatus();
        this.workingLocation = candidate.getWorkingLocation();
        this.jobRole = candidate.getJobRole();
        this.experienceYears = candidate.getExperienceYears();
        this.email = candidate.getEmail();
        this.phoneNumber = candidate.getPhoneNumber();
        this.hourlyRate = candidate.getHourlyRate();
        this.projectDuration = candidate.getProjectDuration();
        this.clientName = candidate.getClientName();
        this.placedById = candidate.getPlacedBy() != null ? candidate.getPlacedBy().getId() : null;
        this.placedByName = candidate.getPlacedByName();
        this.notes = candidate.getNotes();
        this.createdAt = candidate.getCreatedAt();
        this.updatedAt = candidate.getUpdatedAt();
        this.createdByName = candidate.getCreatedBy() != null ? candidate.getCreatedBy().getFullName() : null;
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getFullName() { return fullName; }
    public void setFullName(String fullName) { this.fullName = fullName; }

    public WorkingCandidate.VisaStatus getVisaStatus() { return visaStatus; }
    public void setVisaStatus(WorkingCandidate.VisaStatus visaStatus) { this.visaStatus = visaStatus; }

    public String getWorkingLocation() { return workingLocation; }
    public void setWorkingLocation(String workingLocation) { this.workingLocation = workingLocation; }

    public String getJobRole() { return jobRole; }
    public void setJobRole(String jobRole) { this.jobRole = jobRole; }

    public Integer getExperienceYears() { return experienceYears; }
    public void setExperienceYears(Integer experienceYears) { this.experienceYears = experienceYears; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPhoneNumber() { return phoneNumber; }
    public void setPhoneNumber(String phoneNumber) { this.phoneNumber = phoneNumber; }

    public BigDecimal getHourlyRate() { return hourlyRate; }
    public void setHourlyRate(BigDecimal hourlyRate) { this.hourlyRate = hourlyRate; }

    public String getProjectDuration() { return projectDuration; }
    public void setProjectDuration(String projectDuration) { this.projectDuration = projectDuration; }

    public String getClientName() { return clientName; }
    public void setClientName(String clientName) { this.clientName = clientName; }

    public Long getPlacedById() { return placedById; }
    public void setPlacedById(Long placedById) { this.placedById = placedById; }

    public String getPlacedByName() { return placedByName; }
    public void setPlacedByName(String placedByName) { this.placedByName = placedByName; }

    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }

    public String getCreatedByName() { return createdByName; }
    public void setCreatedByName(String createdByName) { this.createdByName = createdByName; }
}