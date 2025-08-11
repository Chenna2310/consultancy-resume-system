package com.consultancy.resume.dto;

import com.consultancy.resume.entity.Candidate;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

public class CandidateResponse {
    // EXISTING FIELDS
    private Long id;
    private String fullName;
    private Candidate.VisaStatus visaStatus;
    private String city;
    private String state;
    private String primarySkill;
    private Integer experienceYears;
    private String contactInfo;
    private String notes;
    private String resumeFilename;
    private Candidate.CandidateStatus status;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private String createdByName;

    // NEW ENHANCED FIELDS
    private String assignedConsultantName;
    private Integer totalSubmissions;
    private BigDecimal targetRate;
    private String interviewCompany;
    private String interviewPosition;
    private LocalDate firstInterviewDate;
    private String vendorContactName;
    private String vendorContactEmail;
    private String vendorContactPhone;
    private String clientCompany;
    private String projectName;
    private BigDecimal hourlyRate;
    private LocalDate startDate;
    private LocalDate endDate;
    private String consultantNotes;

    public CandidateResponse(Candidate candidate) {
        // EXISTING MAPPINGS
        this.id = candidate.getId();
        this.fullName = candidate.getFullName();
        this.visaStatus = candidate.getVisaStatus();
        this.city = candidate.getCity();
        this.state = candidate.getState();
        this.primarySkill = candidate.getPrimarySkill();
        this.experienceYears = candidate.getExperienceYears();
        this.contactInfo = candidate.getContactInfo();
        this.notes = candidate.getNotes();
        this.resumeFilename = candidate.getResumeFilename();
        this.status = candidate.getStatus();
        this.createdAt = candidate.getCreatedAt();
        this.updatedAt = candidate.getUpdatedAt();
        this.createdByName = candidate.getCreatedBy() != null ? candidate.getCreatedBy().getFullName() : null;

        // NEW MAPPINGS
        this.assignedConsultantName = candidate.getAssignedConsultantName();
        this.totalSubmissions = candidate.getTotalSubmissions();
        this.targetRate = candidate.getTargetRate();
        this.interviewCompany = candidate.getInterviewCompany();
        this.interviewPosition = candidate.getInterviewPosition();
        this.firstInterviewDate = candidate.getFirstInterviewDate();
        this.vendorContactName = candidate.getVendorContactName();
        this.vendorContactEmail = candidate.getVendorContactEmail();
        this.vendorContactPhone = candidate.getVendorContactPhone();
        this.clientCompany = candidate.getClientCompany();
        this.projectName = candidate.getProjectName();
        this.hourlyRate = candidate.getHourlyRate();
        this.startDate = candidate.getStartDate();
        this.endDate = candidate.getEndDate();
        this.consultantNotes = candidate.getConsultantNotes();
    }

    // ALL GETTERS AND SETTERS
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getFullName() { return fullName; }
    public void setFullName(String fullName) { this.fullName = fullName; }

    public Candidate.VisaStatus getVisaStatus() { return visaStatus; }
    public void setVisaStatus(Candidate.VisaStatus visaStatus) { this.visaStatus = visaStatus; }

    public String getCity() { return city; }
    public void setCity(String city) { this.city = city; }

    public String getState() { return state; }
    public void setState(String state) { this.state = state; }

    public String getLocation() { return city + ", " + state; }

    public String getPrimarySkill() { return primarySkill; }
    public void setPrimarySkill(String primarySkill) { this.primarySkill = primarySkill; }

    public Integer getExperienceYears() { return experienceYears; }
    public void setExperienceYears(Integer experienceYears) { this.experienceYears = experienceYears; }

    public String getContactInfo() { return contactInfo; }
    public void setContactInfo(String contactInfo) { this.contactInfo = contactInfo; }

    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }

    public String getResumeFilename() { return resumeFilename; }
    public void setResumeFilename(String resumeFilename) { this.resumeFilename = resumeFilename; }

    public Candidate.CandidateStatus getStatus() { return status; }
    public void setStatus(Candidate.CandidateStatus status) { this.status = status; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }

    public String getCreatedByName() { return createdByName; }
    public void setCreatedByName(String createdByName) { this.createdByName = createdByName; }

    // NEW GETTERS/SETTERS
    public String getAssignedConsultantName() { return assignedConsultantName; }
    public void setAssignedConsultantName(String assignedConsultantName) { this.assignedConsultantName = assignedConsultantName; }

    public Integer getTotalSubmissions() { return totalSubmissions; }
    public void setTotalSubmissions(Integer totalSubmissions) { this.totalSubmissions = totalSubmissions; }

    public BigDecimal getTargetRate() { return targetRate; }
    public void setTargetRate(BigDecimal targetRate) { this.targetRate = targetRate; }

    public String getInterviewCompany() { return interviewCompany; }
    public void setInterviewCompany(String interviewCompany) { this.interviewCompany = interviewCompany; }

    public String getInterviewPosition() { return interviewPosition; }
    public void setInterviewPosition(String interviewPosition) { this.interviewPosition = interviewPosition; }

    public LocalDate getFirstInterviewDate() { return firstInterviewDate; }
    public void setFirstInterviewDate(LocalDate firstInterviewDate) { this.firstInterviewDate = firstInterviewDate; }

    public String getVendorContactName() { return vendorContactName; }
    public void setVendorContactName(String vendorContactName) { this.vendorContactName = vendorContactName; }

    public String getVendorContactEmail() { return vendorContactEmail; }
    public void setVendorContactEmail(String vendorContactEmail) { this.vendorContactEmail = vendorContactEmail; }

    public String getVendorContactPhone() { return vendorContactPhone; }
    public void setVendorContactPhone(String vendorContactPhone) { this.vendorContactPhone = vendorContactPhone; }

    public String getClientCompany() { return clientCompany; }
    public void setClientCompany(String clientCompany) { this.clientCompany = clientCompany; }

    public String getProjectName() { return projectName; }
    public void setProjectName(String projectName) { this.projectName = projectName; }

    public BigDecimal getHourlyRate() { return hourlyRate; }
    public void setHourlyRate(BigDecimal hourlyRate) { this.hourlyRate = hourlyRate; }

    public LocalDate getStartDate() { return startDate; }
    public void setStartDate(LocalDate startDate) { this.startDate = startDate; }

    public LocalDate getEndDate() { return endDate; }
    public void setEndDate(LocalDate endDate) { this.endDate = endDate; }

    public String getConsultantNotes() { return consultantNotes; }
    public void setConsultantNotes(String consultantNotes) { this.consultantNotes = consultantNotes; }
}