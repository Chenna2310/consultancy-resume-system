package com.consultancy.resume.controller;

import com.consultancy.resume.dto.EmployeeRequest;
import com.consultancy.resume.dto.EmployeeResponse;
import com.consultancy.resume.entity.Employee;
import com.consultancy.resume.service.EmployeeService;
import com.consultancy.resume.service.UserPrincipal;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/employees")
public class EmployeeController {

    @Autowired
    private EmployeeService employeeService;

    @PostMapping
    public ResponseEntity<EmployeeResponse> createEmployee(
            @Valid @RequestBody EmployeeRequest request,
            @AuthenticationPrincipal UserPrincipal currentUser) {
        
        EmployeeResponse employee = employeeService.createEmployee(request, currentUser);
        return ResponseEntity.ok(employee);
    }

    @GetMapping
    public ResponseEntity<List<EmployeeResponse>> getAllEmployees() {
        List<EmployeeResponse> employees = employeeService.getAllEmployees();
        return ResponseEntity.ok(employees);
    }

    @GetMapping("/paginated")
    public ResponseEntity<Page<EmployeeResponse>> getAllEmployeesPaginated(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "fullName") String sortBy,
            @RequestParam(defaultValue = "asc") String sortDir) {
        
        Sort sort = sortDir.equalsIgnoreCase("desc") ? 
            Sort.by(sortBy).descending() : Sort.by(sortBy).ascending();
        
        Pageable pageable = PageRequest.of(page, size, sort);
        Page<EmployeeResponse> employees = employeeService.getAllEmployees(pageable);
        
        return ResponseEntity.ok(employees);
    }

    @GetMapping("/{id}")
    public ResponseEntity<EmployeeResponse> getEmployeeById(@PathVariable Long id) {
        EmployeeResponse employee = employeeService.getEmployeeById(id);
        return ResponseEntity.ok(employee);
    }

    @PutMapping("/{id}")
    public ResponseEntity<EmployeeResponse> updateEmployee(
            @PathVariable Long id,
            @Valid @RequestBody EmployeeRequest request) {
        
        EmployeeResponse employee = employeeService.updateEmployee(id, request);
        return ResponseEntity.ok(employee);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteEmployee(@PathVariable Long id) {
        employeeService.deleteEmployee(id);
        return ResponseEntity.ok().body("{\"message\": \"Employee deleted successfully!\"}");
    }

    @GetMapping("/search")
    public ResponseEntity<Page<EmployeeResponse>> searchEmployees(
            @RequestParam(required = false) String fullName,
            @RequestParam(required = false) String email,
            @RequestParam(required = false) Employee.EmployeeRole role,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        
        Pageable pageable = PageRequest.of(page, size, Sort.by("fullName").ascending());
        Page<EmployeeResponse> employees = employeeService.searchEmployees(fullName, email, role, pageable);
        
        return ResponseEntity.ok(employees);
    }

    @GetMapping("/role/{role}")
    public ResponseEntity<List<EmployeeResponse>> getEmployeesByRole(
            @PathVariable Employee.EmployeeRole role) {
        List<EmployeeResponse> employees = employeeService.getEmployeesByRole(role);
        return ResponseEntity.ok(employees);
    }
}