package com.consultancy.resume.dto;

import com.consultancy.resume.entity.WorkingCandidate;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Email;
import java.math.BigDecimal;

public class WorkingCandidateRequest {
    @NotBlank
    private String fullName;

    @NotNull
    private WorkingCandidate.VisaStatus visaStatus;

    @NotBlank
    private String workingLocation;

    @NotBlank
    private String jobRole;

    @NotNull
    @Min(0)
    @Max(50)
    private Integer experienceYears;

    @Email
    @NotBlank
    private String email;

    @NotBlank
    private String phoneNumber;

    @NotNull
    private BigDecimal hourlyRate;

    @NotBlank
    private String projectDuration;

    @NotBlank
    private String clientName;

    @NotNull
    private Long placedBy;

    private String notes;

    // Constructors
    public WorkingCandidateRequest() {}

    // Getters and Setters
    public String getFullName() {
        return fullName;
    }

    public void setFullName(String fullName) {
        this.fullName = fullName;
    }

    public WorkingCandidate.VisaStatus getVisaStatus() {
        return visaStatus;
    }

    public void setVisaStatus(WorkingCandidate.VisaStatus visaStatus) {
        this.visaStatus = visaStatus;
    }

    public String getWorkingLocation() {
        return workingLocation;
    }

    public void setWorkingLocation(String workingLocation) {
        this.workingLocation = workingLocation;
    }

    public String getJobRole() {
        return jobRole;
    }

    public void setJobRole(String jobRole) {
        this.jobRole = jobRole;
    }

    public Integer getExperienceYears() {
        return experienceYears;
    }

    public void setExperienceYears(Integer experienceYears) {
        this.experienceYears = experienceYears;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPhoneNumber() {
        return phoneNumber;
    }

    public void setPhoneNumber(String phoneNumber) {
        this.phoneNumber = phoneNumber;
    }

    public BigDecimal getHourlyRate() {
        return hourlyRate;
    }

    public void setHourlyRate(BigDecimal hourlyRate) {
        this.hourlyRate = hourlyRate;
    }

    public String getProjectDuration() {
        return projectDuration;
    }

    public void setProjectDuration(String projectDuration) {
        this.projectDuration = projectDuration;
    }

    public String getClientName() {
        return clientName;
    }

    public void setClientName(String clientName) {
        this.clientName = clientName;
    }

    public Long getPlacedBy() {
        return placedBy;
    }

    public void setPlacedBy(Long placedBy) {
        this.placedBy = placedBy;
    }

    public String getNotes() {
        return notes;
    }

    public void setNotes(String notes) {
        this.notes = notes;
    }
}