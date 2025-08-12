package com.consultancy.resume.dto;

import com.consultancy.resume.entity.CandidateActivity;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

public class CandidateActivityResponse {
    private Long id;
    private Long candidateId;
    private CandidateActivity.ActivityType activityType;
    private String clientName;
    private String contactPerson;
    private String contactPhone;
    private String contactEmail;
    private BigDecimal submittedRate;
    private String notes;
    private LocalDate activityDate;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private String createdByName;

    public CandidateActivityResponse(CandidateActivity activity) {
        this.id = activity.getId();
        this.candidateId = activity.getCandidateId();
        this.activityType = activity.getActivityType();
        this.clientName = activity.getClientName();
        this.contactPerson = activity.getContactPerson();
        this.contactPhone = activity.getContactPhone();
        this.contactEmail = activity.getContactEmail();
        this.submittedRate = activity.getSubmittedRate();
        this.notes = activity.getNotes();
        this.activityDate = activity.getActivityDate();
        this.createdAt = activity.getCreatedAt();
        this.updatedAt = activity.getUpdatedAt();
        this.createdByName = activity.getCreatedBy() != null ? activity.getCreatedBy().getFullName() : null;
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getCandidateId() {
        return candidateId;
    }

    public void setCandidateId(Long candidateId) {
        this.candidateId = candidateId;
    }

    public CandidateActivity.ActivityType getActivityType() {
        return activityType;
    }

    public void setActivityType(CandidateActivity.ActivityType activityType) {
        this.activityType = activityType;
    }

    public String getClientName() {
        return clientName;
    }

    public void setClientName(String clientName) {
        this.clientName = clientName;
    }

    public String getContactPerson() {
        return contactPerson;
    }

    public void setContactPerson(String contactPerson) {
        this.contactPerson = contactPerson;
    }

    public String getContactPhone() {
        return contactPhone;
    }

    public void setContactPhone(String contactPhone) {
        this.contactPhone = contactPhone;
    }

    public String getContactEmail() {
        return contactEmail;
    }

    public void setContactEmail(String contactEmail) {
        this.contactEmail = contactEmail;
    }

    public BigDecimal getSubmittedRate() {
        return submittedRate;
    }

    public void setSubmittedRate(BigDecimal submittedRate) {
        this.submittedRate = submittedRate;
    }

    public String getNotes() {
        return notes;
    }

    public void setNotes(String notes) {
        this.notes = notes;
    }

    public LocalDate getActivityDate() {
        return activityDate;
    }

    public void setActivityDate(LocalDate activityDate) {
        this.activityDate = activityDate;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }

    public String getCreatedByName() {
        return createdByName;
    }

    public void setCreatedByName(String createdByName) {
        this.createdByName = createdByName;
    }

    // Helper methods
    public String getActivityTypeDisplayName() {
        return activityType != null ? activityType.getDisplayName() : null;
    }
}