package com.consultancy.resume.repository;

import com.consultancy.resume.entity.WorkingCandidate;
import com.consultancy.resume.entity.Employee;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface WorkingCandidateRepository extends JpaRepository<WorkingCandidate, Long> {
    
    // Find by placed by employee
    List<WorkingCandidate> findByPlacedBy(Employee placedBy);
    
    // Find by client name
    List<WorkingCandidate> findByClientNameContainingIgnoreCase(String clientName);
    
    // Find by visa status
    List<WorkingCandidate> findByVisaStatus(WorkingCandidate.VisaStatus visaStatus);
    
    // Find by job role (case insensitive)
    List<WorkingCandidate> findByJobRoleContainingIgnoreCase(String jobRole);
    
    // Search working candidates with multiple filters
    @Query("SELECT wc FROM WorkingCandidate wc LEFT JOIN wc.placedBy pb WHERE " +
           "(:fullName IS NULL OR LOWER(wc.fullName) LIKE LOWER(CONCAT('%', :fullName, '%'))) AND " +
           "(:visaStatus IS NULL OR wc.visaStatus = :visaStatus) AND " +
           "(:jobRole IS NULL OR LOWER(wc.jobRole) LIKE LOWER(CONCAT('%', :jobRole, '%'))) AND " +
           "(:clientName IS NULL OR LOWER(wc.clientName) LIKE LOWER(CONCAT('%', :clientName, '%'))) AND " +
           "(:placedByName IS NULL OR LOWER(pb.fullName) LIKE LOWER(CONCAT('%', :placedByName, '%')))")
    Page<WorkingCandidate> searchWorkingCandidates(
        @Param("fullName") String fullName,
        @Param("visaStatus") WorkingCandidate.VisaStatus visaStatus,
        @Param("jobRole") String jobRole,
        @Param("clientName") String clientName,
        @Param("placedByName") String placedByName,
        Pageable pageable
    );
    
    // Find recent working candidates
    @Query("SELECT wc FROM WorkingCandidate wc ORDER BY wc.createdAt DESC")
    List<WorkingCandidate> findRecentWorkingCandidates(Pageable pageable);
    
    // Count total working candidates
    Long countBy();
    
    // Find by experience range
    List<WorkingCandidate> findByExperienceYearsBetween(Integer minExp, Integer maxExp);
}