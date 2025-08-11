package com.consultancy.resume.dto;

import com.consultancy.resume.entity.Candidate;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.Max;
import java.math.BigDecimal;
import java.time.LocalDate;

public class CandidateRequest {
    // EXISTING FIELDS
    @NotBlank
    private String fullName;

    @NotNull
    private Candidate.VisaStatus visaStatus;

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

    private String contactInfo;
    private String notes;
    private Candidate.CandidateStatus status;

    // NEW ENHANCED FIELDS
    private String assignedConsultantName;
    private Integer totalSubmissions;
    private BigDecimal targetRate;
    
    // Interview fields
    private String interviewCompany;
    private String interviewPosition;
    private LocalDate firstInterviewDate;
    private String vendorContactName;
    private String vendorContactEmail;
    private String vendorContactPhone;
    
    // Working fields
    private String clientCompany;
    private String projectName;
    private BigDecimal hourlyRate;
    private LocalDate startDate;
    private LocalDate endDate;
    
    private String consultantNotes;

    // GETTERS AND SETTERS
    public String getFullName() { return fullName; }
    public void setFullName(String fullName) { this.fullName = fullName; }

    public Candidate.VisaStatus getVisaStatus() { return visaStatus; }
    public void setVisaStatus(Candidate.VisaStatus visaStatus) { this.visaStatus = visaStatus; }

    public String getCity() { return city; }
    public void setCity(String city) { this.city = city; }

    public String getState() { return state; }
    public void setState(String state) { this.state = state; }

    public String getPrimarySkill() { return primarySkill; }
    public void setPrimarySkill(String primarySkill) { this.primarySkill = primarySkill; }

    public Integer getExperienceYears() { return experienceYears; }
    public void setExperienceYears(Integer experienceYears) { this.experienceYears = experienceYears; }

    public String getContactInfo() { return contactInfo; }
    public void setContactInfo(String contactInfo) { this.contactInfo = contactInfo; }

    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }

    public Candidate.CandidateStatus getStatus() { return status; }
    public void setStatus(Candidate.CandidateStatus status) { this.status = status; }

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