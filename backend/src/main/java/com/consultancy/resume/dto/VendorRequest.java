package com.consultancy.resume.dto;

import com.consultancy.resume.entity.Vendor;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Email;
import java.math.BigDecimal;

public class VendorRequest {
    @NotBlank
    private String companyName;

    @NotBlank
    private String primaryContactName;

    @Email
    private String primaryContactEmail;

    private String primaryContactPhone;
    private String address;
    private String city;
    private String state;
    private String preferredSkills;
    private BigDecimal rateRangeMin;
    private BigDecimal rateRangeMax;
    private String notes;
    private Vendor.VendorStatus status;

    // Getters and Setters
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

    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }

    public Vendor.VendorStatus getStatus() { return status; }
    public void setStatus(Vendor.VendorStatus status) { this.status = status; }
}