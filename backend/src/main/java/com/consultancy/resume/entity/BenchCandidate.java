package com.consultancy.resume.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.Max;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "bench_candidates")
public class BenchCandidate {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

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

    @Column(name = "phone_number")
    private String phoneNumber;

    @Column(name = "email")
    private String email;

    @Column(name = "target_rate")
    private BigDecimal targetRate;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "assigned_consultant_id")
    private Employee assignedConsultant;

    @Column(length = 1000)
    private String notes;

    @Column(name = "resume_filename")
    private String resumeFilename;

    @Column(name = "resume_path")
    private String resumePath;

    @Column(name = "created_at")
    private LocalDateTime createdAt = LocalDateTime.now();

    @Column(name = "updated_at")
    private LocalDateTime updatedAt = LocalDateTime.now();

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "created_by")
    private User createdBy;

    public enum VisaStatus {
        H1B("H1B"), OPT("OPT"), GC("Green Card"), CITIZEN("US Citizen"), F1("F1"), L1("L1"), OTHER("Other");
        private final String displayName;
        VisaStatus(String displayName) { this.displayName = displayName; }
        public String getDisplayName() { return displayName; }
    }

    // Constructors
    public BenchCandidate() {}

    // Getters and Setters
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

    public String getPhoneNumber() { return phoneNumber; }
    public void setPhoneNumber(String phoneNumber) { this.phoneNumber = phoneNumber; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public BigDecimal getTargetRate() { return targetRate; }
    public void setTargetRate(BigDecimal targetRate) { this.targetRate = targetRate; }

    public Employee getAssignedConsultant() { return assignedConsultant; }
    public void setAssignedConsultant(Employee assignedConsultant) { this.assignedConsultant = assignedConsultant; }

    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }

    public String getResumeFilename() { return resumeFilename; }
    public void setResumeFilename(String resumeFilename) { this.resumeFilename = resumeFilename; }

    public String getResumePath() { return resumePath; }
    public void setResumePath(String resumePath) { this.resumePath = resumePath; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }

    public User getCreatedBy() { return createdBy; }
    public void setCreatedBy(User createdBy) { this.createdBy = createdBy; }

    // Helper methods
    public String getLocation() { return city + ", " + state; }

    public String getAssignedConsultantName() {
        return assignedConsultant != null ? assignedConsultant.getFullName() : null;
    }

    @PreUpdate
    public void preUpdate() {
        this.updatedAt = LocalDateTime.now();
    }
}