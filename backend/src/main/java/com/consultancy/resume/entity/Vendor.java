package com.consultancy.resume.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Email;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "vendors")
public class Vendor {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    @Column(name = "company_name")
    private String companyName;

    @NotBlank
    @Column(name = "primary_contact_name")
    private String primaryContactName;

    @Email
    @Column(name = "primary_contact_email")
    private String primaryContactEmail;

    @Column(name = "primary_contact_phone")
    private String primaryContactPhone;

    @Column(name = "address")
    private String address;

    @Column(name = "city")
    private String city;

    @Column(name = "state")
    private String state;

    @Column(name = "zip_code")
    private String zipCode;

    @Column(name = "country")
    private String country;

    @Column(name = "preferred_skills", length = 1000)
    private String preferredSkills;

    @Column(name = "rate_range_min")
    private BigDecimal rateRangeMin;

    @Column(name = "rate_range_max")
    private BigDecimal rateRangeMax;

    @Column(name = "total_submissions")
    private Integer totalSubmissions = 0;

    @Column(name = "successful_placements")
    private Integer successfulPlacements = 0;

    @Column(name = "notes", length = 2000)
    private String notes;

    @Enumerated(EnumType.STRING)
    @Column(name = "status")
    private VendorStatus status = VendorStatus.ACTIVE;

    @Column(name = "created_at")
    private LocalDateTime createdAt = LocalDateTime.now();

    @Column(name = "updated_at")
    private LocalDateTime updatedAt = LocalDateTime.now();

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "created_by")
    private User createdBy;

    // Enum for Vendor Status
    public enum VendorStatus {
        ACTIVE("Active"),
        INACTIVE("Inactive"),
        PREFERRED("Preferred"),
        SUSPENDED("Suspended");

        private final String displayName;

        VendorStatus(String displayName) {
            this.displayName = displayName;
        }

        public String getDisplayName() {
            return displayName;
        }
    }

    // Constructors
    public Vendor() {}

    public Vendor(String companyName, String primaryContactName, String primaryContactEmail) {
        this.companyName = companyName;
        this.primaryContactName = primaryContactName;
        this.primaryContactEmail = primaryContactEmail;
        this.status = VendorStatus.ACTIVE;
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getCompanyName() {
        return companyName;
    }

    public void setCompanyName(String companyName) {
        this.companyName = companyName;
    }

    public String getPrimaryContactName() {
        return primaryContactName;
    }

    public void setPrimaryContactName(String primaryContactName) {
        this.primaryContactName = primaryContactName;
    }

    public String getPrimaryContactEmail() {
        return primaryContactEmail;
    }

    public void setPrimaryContactEmail(String primaryContactEmail) {
        this.primaryContactEmail = primaryContactEmail;
    }

    public String getPrimaryContactPhone() {
        return primaryContactPhone;
    }

    public void setPrimaryContactPhone(String primaryContactPhone) {
        this.primaryContactPhone = primaryContactPhone;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
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

    public String getZipCode() {
        return zipCode;
    }

    public void setZipCode(String zipCode) {
        this.zipCode = zipCode;
    }

    public String getCountry() {
        return country;
    }

    public void setCountry(String country) {
        this.country = country;
    }

    public String getPreferredSkills() {
        return preferredSkills;
    }

    public void setPreferredSkills(String preferredSkills) {
        this.preferredSkills = preferredSkills;
    }

    public BigDecimal getRateRangeMin() {
        return rateRangeMin;
    }

    public void setRateRangeMin(BigDecimal rateRangeMin) {
        this.rateRangeMin = rateRangeMin;
    }

    public BigDecimal getRateRangeMax() {
        return rateRangeMax;
    }

    public void setRateRangeMax(BigDecimal rateRangeMax) {
        this.rateRangeMax = rateRangeMax;
    }

    public Integer getTotalSubmissions() {
        return totalSubmissions;
    }

    public void setTotalSubmissions(Integer totalSubmissions) {
        this.totalSubmissions = totalSubmissions;
    }

    public Integer getSuccessfulPlacements() {
        return successfulPlacements;
    }

    public void setSuccessfulPlacements(Integer successfulPlacements) {
        this.successfulPlacements = successfulPlacements;
    }

    public String getNotes() {
        return notes;
    }

    public void setNotes(String notes) {
        this.notes = notes;
    }

    public VendorStatus getStatus() {
        return status;
    }

    public void setStatus(VendorStatus status) {
        this.status = status;
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

    public User getCreatedBy() {
        return createdBy;
    }

    public void setCreatedBy(User createdBy) {
        this.createdBy = createdBy;
    }

    // Helper methods
    public String getFullAddress() {
        StringBuilder addr = new StringBuilder();
        if (address != null && !address.trim().isEmpty()) {
            addr.append(address);
        }
        if (city != null && !city.trim().isEmpty()) {
            if (addr.length() > 0) addr.append(", ");
            addr.append(city);
        }
        if (state != null && !state.trim().isEmpty()) {
            if (addr.length() > 0) addr.append(", ");
            addr.append(state);
        }
        if (zipCode != null && !zipCode.trim().isEmpty()) {
            if (addr.length() > 0) addr.append(" ");
            addr.append(zipCode);
        }
        if (country != null && !country.trim().isEmpty()) {
            if (addr.length() > 0) addr.append(", ");
            addr.append(country);
        }
        return addr.toString();
    }

    public boolean isActive() {
        return VendorStatus.ACTIVE.equals(this.status);
    }

    public boolean isPreferred() {
        return VendorStatus.PREFERRED.equals(this.status);
    }

    public double getSuccessRate() {
        if (totalSubmissions == null || totalSubmissions == 0) {
            return 0.0;
        }
        if (successfulPlacements == null) {
            return 0.0;
        }
        return (successfulPlacements.doubleValue() / totalSubmissions.doubleValue()) * 100.0;
    }

    public String getRateRange() {
        if (rateRangeMin != null && rateRangeMax != null) {
            return "$" + rateRangeMin + " - $" + rateRangeMax;
        } else if (rateRangeMin != null) {
            return "$" + rateRangeMin + "+";
        } else if (rateRangeMax != null) {
            return "Up to $" + rateRangeMax;
        }
        return "Not specified";
    }

    public void incrementSubmissions() {
        if (this.totalSubmissions == null) {
            this.totalSubmissions = 0;
        }
        this.totalSubmissions++;
        this.updatedAt = LocalDateTime.now();
    }

    public void incrementPlacements() {
        if (this.successfulPlacements == null) {
            this.successfulPlacements = 0;
        }
        this.successfulPlacements++;
        this.updatedAt = LocalDateTime.now();
    }

    // Lifecycle methods
    @PrePersist
    protected void onCreate() {
        if (status == null) {
            status = VendorStatus.ACTIVE;
        }
        if (createdAt == null) {
            createdAt = LocalDateTime.now();
        }
        if (updatedAt == null) {
            updatedAt = LocalDateTime.now();
        }
        if (totalSubmissions == null) {
            totalSubmissions = 0;
        }
        if (successfulPlacements == null) {
            successfulPlacements = 0;
        }
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }

    @Override
    public String toString() {
        return "Vendor{" +
                "id=" + id +
                ", companyName='" + companyName + '\'' +
                ", primaryContactName='" + primaryContactName + '\'' +
                ", primaryContactEmail='" + primaryContactEmail + '\'' +
                ", status=" + status +
                ", totalSubmissions=" + totalSubmissions +
                ", successfulPlacements=" + successfulPlacements +
                '}';
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Vendor vendor = (Vendor) o;
        return id != null && id.equals(vendor.id);
    }

    @Override
    public int hashCode() {
        return getClass().hashCode();
    }
}