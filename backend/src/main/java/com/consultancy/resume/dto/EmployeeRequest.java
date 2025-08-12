package com.consultancy.resume.dto;

import com.consultancy.resume.entity.Employee;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotNull;

public class EmployeeRequest {
    @NotBlank
    private String fullName;

    @Email
    @NotBlank
    private String email;

    private String phoneNumber;

    @NotNull
    private Employee.EmployeeRole role;

    private String notes;

    // Constructors
    public EmployeeRequest() {}

    public EmployeeRequest(String fullName, String email, Employee.EmployeeRole role) {
        this.fullName = fullName;
        this.email = email;
        this.role = role;
    }

    // Getters and Setters
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
}