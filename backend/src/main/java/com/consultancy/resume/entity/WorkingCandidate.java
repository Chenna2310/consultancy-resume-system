package com.consultancy.resume.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.Max;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "working_candidates")
public class WorkingCandidate {
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
    @Column(name = "working_location")
    private String workingLocation;

    @NotBlank
    @Column(name = "job_role")
    private String jobRole;

    @NotNull
    @Min(0)
    @Max(50)
    @Column(name = "experience_years")
    private Integer experienceYears;

    @NotBlank
    @Column(name = "email")
    private String email;

    @NotBlank
    @Column(name = "phone_number")
    private String phoneNumber;

    @NotNull
    @Column(name = "hourly_rate")
    private BigDecimal hourlyRate;

    @NotBlank
    @Column(name = "project_duration")
    private String projectDuration;

    @NotBlank
    @Column(name = "client_name")
    private String clientName;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "placed_by")
    private Employee placedBy;

    @Column(length = 1000)
    private String notes;

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
    public WorkingCandidate() {}

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getFullName() { return fullName; }
    public void setFullName(String fullName) { this.fullName = fullName; }

    public VisaStatus getVisaStatus() { return visaStatus; }
    public void setVisaStatus(VisaStatus visaStatus) { this.visaStatus = visaStatus; }

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

    public Employee getPlacedBy() { return placedBy; }
    public void setPlacedBy(Employee placedBy) { this.placedBy = placedBy; }

    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }

    public User getCreatedBy() { return createdBy; }
    public void setCreatedBy(User createdBy) { this.createdBy = createdBy; }

    // Helper methods
    public String getPlacedByName() {
        return placedBy != null ? placedBy.getFullName() : null;
    }

    @PreUpdate
    public void preUpdate() {
        this.updatedAt = LocalDateTime.now();
    }
}