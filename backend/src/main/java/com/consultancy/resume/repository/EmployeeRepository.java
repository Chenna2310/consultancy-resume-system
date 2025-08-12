package com.consultancy.resume.repository;

import com.consultancy.resume.entity.Employee;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface EmployeeRepository extends JpaRepository<Employee, Long> {
    
    // Find by email
    Optional<Employee> findByEmail(String email);
    
    // Check if email exists
    boolean existsByEmail(String email);
    
    // Find by role
    List<Employee> findByRole(Employee.EmployeeRole role);
    
    // Search employees
    @Query("SELECT e FROM Employee e WHERE " +
           "(:fullName IS NULL OR LOWER(e.fullName) LIKE LOWER(CONCAT('%', :fullName, '%'))) AND " +
           "(:email IS NULL OR LOWER(e.email) LIKE LOWER(CONCAT('%', :email, '%'))) AND " +
           "(:role IS NULL OR e.role = :role)")
    Page<Employee> searchEmployees(
        @Param("fullName") String fullName,
        @Param("email") String email,
        @Param("role") Employee.EmployeeRole role,
        Pageable pageable
    );
    
    // Count by role
    Long countByRole(Employee.EmployeeRole role);
    
    // Find all ordered by full name
    List<Employee> findAllByOrderByFullNameAsc();
}