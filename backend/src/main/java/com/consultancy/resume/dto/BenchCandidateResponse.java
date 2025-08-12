package com.consultancy.resume.dto;

import com.consultancy.resume.entity.BenchCandidate;
import java.math.BigDecimal;
import java.time.LocalDateTime;

public class BenchCandidateResponse {
    private Long id;
    private String fullName;
    private BenchCandidate.VisaStatus visaStatus;
    private String city;
    private String state;
    private String primarySkill;
    private Integer experienceYears;
    private String phoneNumber;
    private String email;
    private BigDecimal targetRate;
    private Long assignedConsultantId;
    private String assignedConsultantName;
    private String notes;
    private String resumeFilename;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private String createdByName;

    public BenchCandidateResponse(BenchCandidate candidate) {
        this.id = candidate.getId();
        this.fullName = candidate.getFullName();
        this.visaStatus = candidate.getVisaStatus();
        this.city = candidate.getCity();
        this.state = candidate.getState();
        this.primarySkill = candidate.getPrimarySkill();
        this.experienceYears = candidate.getExperienceYears();
        this.phoneNumber = candidate.getPhoneNumber();
        this.email = candidate.getEmail();
        this.targetRate = candidate.getTargetRate();
        this.assignedConsultantId = candidate.getAssignedConsultant() != null ? 
            candidate.getAssignedConsultant().getId() : null;
        this.assignedConsultantName = candidate.getAssignedConsultantName();
        this.notes = candidate.getNotes();
        this.resumeFilename = candidate.getResumeFilename();
        this.createdAt = candidate.getCreatedAt();
        this.updatedAt = candidate.getUpdatedAt();
        this.createdByName = candidate.getCreatedBy() != null ? candidate.getCreatedBy().getFullName() : null;
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getFullName() { return fullName; }
    public void setFullName(String fullName) { this.fullName = fullName; }

    public BenchCandidate.VisaStatus getVisaStatus() { return visaStatus; }
    public void setVisaStatus(BenchCandidate.VisaStatus visaStatus) { this.visaStatus = visaStatus; }

    public String getCity() { return city; }
    public void setCity(String city) { this.city = city; }

    public String getState() { return state; }
    public void setState(String state) { this.state = state; }

    public String getLocation() { return city + ", " + state; }

    public String getPrimarySkill() { return primarySkill; }
    public void setPrimarySkill(String primarySkill) { this.primarySkill = primarySkill; }

    public Integer getExperienceYears() { return experienceYears; }
    public void setExperienceYears(Integer experienceYears) { this.experienceYears = experienceYears; }

    public String getPhoneNumber() { return phoneNumber; }
    public void setPhoneNumber(String phoneNumber) { this.phoneNumber = phoneNumber; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public BigDecimal getTargetRate() { return targetRate; }
    public void setTargetRate(BigDecimal targetRate) { this.targetRate = targetRate; }

    public Long getAssignedConsultantId() { return assignedConsultantId; }
    public void setAssignedConsultantId(Long assignedConsultantId) { this.assignedConsultantId = assignedConsultantId; }

    public String getAssignedConsultantName() { return assignedConsultantName; }
    public void setAssignedConsultantName(String assignedConsultantName) { this.assignedConsultantName = assignedConsultantName; }

    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }

    public String getResumeFilename() { return resumeFilename; }
    public void setResumeFilename(String resumeFilename) { this.resumeFilename = resumeFilename; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }

    public String getCreatedByName() { return createdByName; }
    public void setCreatedByName(String createdByName) { this.createdByName = createdByName; }
}