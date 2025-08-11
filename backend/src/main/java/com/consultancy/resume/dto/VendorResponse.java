package com.consultancy.resume.dto;

import com.consultancy.resume.entity.Vendor;
import java.math.BigDecimal;
import java.time.LocalDateTime;

public class VendorResponse {
    private Long id;
    private String companyName;
    private String primaryContactName;
    private String primaryContactEmail;
    private String primaryContactPhone;
    private String address;
    private String city;
    private String state;
    private String preferredSkills;
    private BigDecimal rateRangeMin;
    private BigDecimal rateRangeMax;
    private Integer totalSubmissions;
    private Integer successfulPlacements;
    private String notes;
    private Vendor.VendorStatus status;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private String createdByName;

    public VendorResponse(Vendor vendor) {
        this.id = vendor.getId();
        this.companyName = vendor.getCompanyName();
        this.primaryContactName = vendor.getPrimaryContactName();
        this.primaryContactEmail = vendor.getPrimaryContactEmail();
        this.primaryContactPhone = vendor.getPrimaryContactPhone();
        this.address = vendor.getAddress();
        this.city = vendor.getCity();
        this.state = vendor.getState();
        this.preferredSkills = vendor.getPreferredSkills();
        this.rateRangeMin = vendor.getRateRangeMin();
        this.rateRangeMax = vendor.getRateRangeMax();
        this.totalSubmissions = vendor.getTotalSubmissions();
        this.successfulPlacements = vendor.getSuccessfulPlacements();
        this.notes = vendor.getNotes();
        this.status = vendor.getStatus();
        this.createdAt = vendor.getCreatedAt();
        this.updatedAt = vendor.getUpdatedAt();
        this.createdByName = vendor.getCreatedBy() != null ? vendor.getCreatedBy().getFullName() : null;
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getCompanyName() { return companyName; }
    public void setCompanyName(String companyName) { this.companyName = companyName; }

    public String getPrimaryContactName() { return primaryContactName; }
    public void setPrimaryContactName(String primaryContactName) { this.primaryContactName = primaryContactName; }

    public String getPrimaryContactEmail() { return primaryContactEmail; }
    public void setPrimaryContactEmail(String primaryContactEmail) { this.primaryContactEmail = primaryContactEmail; }

    public String getPrimaryContactPhone() { return primaryContactPhone; }
    public void setPrimaryContactPhone(String primaryContactPhone) { this.primaryContactPhone = primaryContactPhone; }

    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }

    public String getCity() { return city; }
    public void setCity(String city) { this.city = city; }

    public String getState() { return state; }
    public void setState(String state) { this.state = state; }

    public String getPreferredSkills() { return preferredSkills; }
    public void setPreferredSkills(String preferredSkills) { this.preferredSkills = preferredSkills; }

    public BigDecimal getRateRangeMin() { return rateRangeMin; }
    public void setRateRangeMin(BigDecimal rateRangeMin) { this.rateRangeMin = rateRangeMin; }

    public BigDecimal getRateRangeMax() { return rateRangeMax; }
    public void setRateRangeMax(BigDecimal rateRangeMax) { this.rateRangeMax = rateRangeMax; }

    public Integer getTotalSubmissions() { return totalSubmissions; }
    public void setTotalSubmissions(Integer totalSubmissions) { this.totalSubmissions = totalSubmissions; }

    public Integer getSuccessfulPlacements() { return successfulPlacements; }
    public void setSuccessfulPlacements(Integer successfulPlacements) { this.successfulPlacements = successfulPlacements; }

    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }

    public Vendor.VendorStatus getStatus() { return status; }
    public void setStatus(Vendor.VendorStatus status) { this.status = status; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }

    public String getCreatedByName() { return createdByName; }
    public void setCreatedByName(String createdByName) { this.createdByName = createdByName; }

    // Helper methods
    public String getFullAddress() {
        StringBuilder addr = new StringBuilder();
        if (address != null) addr.append(address);
        if (city != null) {
            if (addr.length() > 0) addr.append(", ");
            addr.append(city);
        }
        if (state != null) {
            if (addr.length() > 0) addr.append(", ");
            addr.append(state);
        }
        return addr.toString();
    }

    public String getRateRangeDisplay() {
        if (rateRangeMin != null && rateRangeMax != null) {
            return "$" + rateRangeMin + " - $" + rateRangeMax + "/hr";
        } else if (rateRangeMin != null) {
            return "$" + rateRangeMin + "+/hr";
        } else if (rateRangeMax != null) {
            return "Up to $" + rateRangeMax + "/hr";
        }
        return "Not specified";
    }

    public Double getSuccessRate() {
        if (totalSubmissions == null || totalSubmissions == 0) return 0.0;
        return (successfulPlacements != null ? successfulPlacements : 0) * 100.0 / totalSubmissions;
    }
}