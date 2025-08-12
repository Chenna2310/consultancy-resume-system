package com.consultancy.resume.dto;

import com.consultancy.resume.entity.Employee;
import java.time.LocalDateTime;

public class EmployeeResponse {
    private Long id;
    private String fullName;
    private String email;
    private String phoneNumber;
    private Employee.EmployeeRole role;
    private String notes;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private String createdByName;

    public EmployeeResponse(Employee employee) {
        this.id = employee.getId();
        this.fullName = employee.getFullName();
        this.email = employee.getEmail();
        this.phoneNumber = employee.getPhoneNumber();
        this.role = employee.getRole();
        this.notes = employee.getNotes();
        this.createdAt = employee.getCreatedAt();
        this.updatedAt = employee.getUpdatedAt();
        this.createdByName = employee.getCreatedBy() != null ? employee.getCreatedBy().getFullName() : null;
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getFullName() {
        return fullName;
    }

    public void setFullName(String fullName) {
        this.fullName = fullName;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPhoneNumber() {
        return phoneNumber;
    }

    public void setPhoneNumber(String phoneNumber) {
        this.phoneNumber = phoneNumber;
    }

    public Employee.EmployeeRole getRole() {
        return role;
    }

    public void setRole(Employee.EmployeeRole role) {
        this.role = role;
    }

    public String getNotes() {
        return notes;
    }

    public void setNotes(String notes) {
        this.notes = notes;
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

    public String getCreatedByName() {
        return createdByName;
    }

    public void setCreatedByName(String createdByName) {
        this.createdByName = createdByName;
    }

    // Helper methods
    public String getRoleDisplayName() {
        return role != null ? role.getDisplayName() : null;
    }
}