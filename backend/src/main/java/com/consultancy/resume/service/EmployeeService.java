package com.consultancy.resume.service;

import com.consultancy.resume.dto.EmployeeRequest;
import com.consultancy.resume.dto.EmployeeResponse;
import com.consultancy.resume.entity.Employee;
import com.consultancy.resume.entity.User;
import com.consultancy.resume.repository.EmployeeRepository;
import com.consultancy.resume.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class EmployeeService {

    @Autowired
    private EmployeeRepository employeeRepository;

    @Autowired
    private UserRepository userRepository;

    public EmployeeResponse createEmployee(EmployeeRequest request, UserPrincipal currentUser) {
        // Check if email already exists
        if (employeeRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Employee with this email already exists");
        }

        Employee employee = new Employee();
        employee.setFullName(request.getFullName());
        employee.setEmail(request.getEmail());
        employee.setPhoneNumber(request.getPhoneNumber());
        employee.setRole(request.getRole());
        employee.setNotes(request.getNotes());

        // Set the user who created this employee
        User user = userRepository.findById(currentUser.getId())
            .orElseThrow(() -> new RuntimeException("User not found"));
        employee.setCreatedBy(user);

        Employee savedEmployee = employeeRepository.save(employee);
        return new EmployeeResponse(savedEmployee);
    }

    public List<EmployeeResponse> getAllEmployees() {
        List<Employee> employees = employeeRepository.findAllByOrderByFullNameAsc();
        return employees.stream()
                .map(EmployeeResponse::new)
                .collect(Collectors.toList());
    }

    public Page<EmployeeResponse> getAllEmployees(Pageable pageable) {
        Page<Employee> employees = employeeRepository.findAll(pageable);
        return employees.map(EmployeeResponse::new);
    }

    public EmployeeResponse getEmployeeById(Long id) {
        Employee employee = employeeRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Employee not found with id: " + id));
        return new EmployeeResponse(employee);
    }

    public EmployeeResponse updateEmployee(Long id, EmployeeRequest request) {
        Employee employee = employeeRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Employee not found with id: " + id));

        // Check if email already exists for different employee
        if (!employee.getEmail().equals(request.getEmail()) && 
            employeeRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Employee with this email already exists");
        }

        employee.setFullName(request.getFullName());
        employee.setEmail(request.getEmail());
        employee.setPhoneNumber(request.getPhoneNumber());
        employee.setRole(request.getRole());
        employee.setNotes(request.getNotes());

        Employee updatedEmployee = employeeRepository.save(employee);
        return new EmployeeResponse(updatedEmployee);
    }

    public void deleteEmployee(Long id) {
        Employee employee = employeeRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Employee not found with id: " + id));
        employeeRepository.delete(employee);
    }

    public Page<EmployeeResponse> searchEmployees(String fullName, String email, 
                                                 Employee.EmployeeRole role, Pageable pageable) {
        Page<Employee> employees = employeeRepository.searchEmployees(fullName, email, role, pageable);
        return employees.map(EmployeeResponse::new);
    }

    public List<EmployeeResponse> getEmployeesByRole(Employee.EmployeeRole role) {
        List<Employee> employees = employeeRepository.findByRole(role);
        return employees.stream()
                .map(EmployeeResponse::new)
                .collect(Collectors.toList());
    }

    public Long getCountByRole(Employee.EmployeeRole role) {
        return employeeRepository.countByRole(role);
    }

    public Long getTotalEmployeesCount() {
        return employeeRepository.count();
    }
}