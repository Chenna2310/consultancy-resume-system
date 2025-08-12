package com.consultancy.resume.dto;

import com.consultancy.resume.entity.BenchCandidate;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Email;
import java.math.BigDecimal;

public class BenchCandidateRequest {
    @NotBlank
    private String fullName;

    @NotNull
    private BenchCandidate.VisaStatus visaStatus;

    @NotBlank
    private String city;

    @NotBlank
    private String state;

    @NotBlank
    private String primarySkill;

    @NotNull
    @Min(0)
    @Max(50)
    private Integer experienceYears;

    private String phoneNumber;

    @Email
    private String email;

    private BigDecimal targetRate;

    private Long assignedConsultantId;

    private String notes;

    // Constructors
    public BenchCandidateRequest() {}

    // Getters and Setters
    public String getFullName() {
        return fullName;
    }

    public void setFullName(String fullName) {
        this.fullName = fullName;
    }

    public BenchCandidate.VisaStatus getVisaStatus() {
        return visaStatus;
    }

    public void setVisaStatus(BenchCandidate.VisaStatus visaStatus) {
        this.visaStatus = visaStatus;
    }

    public String getCity() {
        return city;
    }

    public void setCity(String city) {
        this.city = city;
    }

    public String getState() {
        return state;
    }

    public void setState(String state) {
        this.state = state;
    }

    public String getPrimarySkill() {
        return primarySkill;
    }

    public void setPrimarySkill(String primarySkill) {
        this.primarySkill = primarySkill;
    }

    public Integer getExperienceYears() {
        return experienceYears;
    }

    public void setExperienceYears(Integer experienceYears) {
        this.experienceYears = experienceYears;
    }

    public String getPhoneNumber() {
        return phoneNumber;
    }

    public void setPhoneNumber(String phoneNumber) {
        this.phoneNumber = phoneNumber;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public BigDecimal getTargetRate() {
        return targetRate;
    }

    public void setTargetRate(BigDecimal targetRate) {
        this.targetRate = targetRate;
    }

    public Long getAssignedConsultantId() {
        return assignedConsultantId;
    }

    public void setAssignedConsultantId(Long assignedConsultantId) {
        this.assignedConsultantId = assignedConsultantId;
    }

    public String getNotes() {
        return notes;
    }

    public void setNotes(String notes) {
        this.notes = notes;
    }
}