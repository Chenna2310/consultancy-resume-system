package com.consultancy.resume.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.Max;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "candidates")
public class Candidate {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Basic Information (EXISTING)
    @NotBlank
    @Column(name = "full_name")
    private String fullName;

    @Enumerated(EnumType.STRING)
    @Column(name = "visa_status")
    private VisaStatus visaStatus;

    @NotBlank
    private String city;

    @NotBlank
    private String state;

    @NotBlank
    @Column(name = "primary_skill")
    private String primarySkill;

    @NotNull
    @Min(0)
    @Max(50)
    @Column(name = "experience_years")
    private Integer experienceYears;

    @Column(name = "contact_info")
    private String contactInfo;

    @Column(length = 1000)
    private String notes;

    @Column(name = "resume_filename")
    private String resumeFilename;

    @Column(name = "resume_path")
    private String resumePath;

    @Enumerated(EnumType.STRING)
    private CandidateStatus status = CandidateStatus.BENCH;

    @Column(name = "created_at")
    private LocalDateTime createdAt = LocalDateTime.now();

    @Column(name = "updated_at")
    private LocalDateTime updatedAt = LocalDateTime.now();

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "created_by")
    private User createdBy;

    // NEW ENHANCED FIELDS
    @Column(name = "assigned_consultant_name")
    private String assignedConsultantName;

    @Column(name = "total_submissions")
    private Integer totalSubmissions = 0;

    @Column(name = "target_rate")
    private BigDecimal targetRate;

    @Column(name = "interview_company")
    private String interviewCompany;

    @Column(name = "interview_position")
    private String interviewPosition;

    @Column(name = "first_interview_date")
    private LocalDate firstInterviewDate;

    @Column(name = "vendor_contact_name")
    private String vendorContactName;

    @Column(name = "vendor_contact_email")
    private String vendorContactEmail;

    @Column(name = "vendor_contact_phone")
    private String vendorContactPhone;

    @Column(name = "client_company")
    private String clientCompany;

    @Column(name = "project_name")
    private String projectName;

    @Column(name = "hourly_rate")
    private BigDecimal hourlyRate;

    @Column(name = "start_date")
    private LocalDate startDate;

    @Column(name = "end_date")
    private LocalDate endDate;

    @Column(name = "consultant_notes", length = 2000)
    private String consultantNotes;

    // Enums
    public enum VisaStatus {
        H1B("H1B"), OPT("OPT"), GC("Green Card"), CITIZEN("US Citizen"), F1("F1"), L1("L1"), OTHER("Other");
        private final String displayName;
        VisaStatus(String displayName) { this.displayName = displayName; }
        public String getDisplayName() { return displayName; }
    }

    public enum CandidateStatus {
        BENCH("Bench"), INTERVIEW("In Interview"), WORKING("Currently Working"), PLACED("Placed"), INACTIVE("Inactive");
        private final String displayName;
        CandidateStatus(String displayName) { this.displayName = displayName; }
        public String getDisplayName() { return displayName; }
    }

    // Constructors
    public Candidate() {}

    // ALL GETTERS AND SETTERS
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getFullName() { return fullName; }
    public void setFullName(String fullName) { this.fullName = fullName; }

    public VisaStatus getVisaStatus() { return visaStatus; }
    public void setVisaStatus(VisaStatus visaStatus) { this.visaStatus = visaStatus; }

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

    public String getResumeFilename() { return resumeFilename; }
    public void setResumeFilename(String resumeFilename) { this.resumeFilename = resumeFilename; }

    public String getResumePath() { return resumePath; }
    public void setResumePath(String resumePath) { this.resumePath = resumePath; }

    public CandidateStatus getStatus() { return status; }
    public void setStatus(CandidateStatus status) { this.status = status; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }

    public User getCreatedBy() { return createdBy; }
    public void setCreatedBy(User createdBy) { this.createdBy = createdBy; }

    // NEW FIELD GETTERS/SETTERS
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

    // Helper methods
    public String getLocation() { return city + ", " + state; }

    @PreUpdate
    public void preUpdate() {
        this.updatedAt = LocalDateTime.now();
    }
}