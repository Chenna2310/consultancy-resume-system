package com.consultancy.resume.dto;

import com.consultancy.resume.entity.CandidateActivity;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;
import java.time.LocalDate;

public class CandidateActivityRequest {
    @NotNull
    private Long candidateId;

    @NotNull
    private CandidateActivity.ActivityType activityType;

    @NotBlank
    private String clientName;

    private String contactPerson;

    private String contactPhone;

    private String contactEmail;

    private BigDecimal submittedRate;

    private String notes;

    @NotNull
    private LocalDate activityDate;

    // Constructors
    public CandidateActivityRequest() {}

    // Getters and Setters
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
}