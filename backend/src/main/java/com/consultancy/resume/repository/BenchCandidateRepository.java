package com.consultancy.resume.repository;

import com.consultancy.resume.entity.BenchCandidate;
import com.consultancy.resume.entity.Employee;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BenchCandidateRepository extends JpaRepository<BenchCandidate, Long> {
    
    // Find by assigned consultant
    List<BenchCandidate> findByAssignedConsultant(Employee consultant);
    
    // Find by visa status
    List<BenchCandidate> findByVisaStatus(BenchCandidate.VisaStatus visaStatus);
    
    // Find by primary skill (case insensitive)
    List<BenchCandidate> findByPrimarySkillContainingIgnoreCase(String skill);
    
    // Find by location
    List<BenchCandidate> findByCityIgnoreCaseAndStateIgnoreCase(String city, String state);
    
    // Find by state
    List<BenchCandidate> findByStateIgnoreCase(String state);
    
    // Search bench candidates with multiple filters
    @Query("SELECT bc FROM BenchCandidate bc LEFT JOIN bc.assignedConsultant ac WHERE " +
           "(:fullName IS NULL OR LOWER(bc.fullName) LIKE LOWER(CONCAT('%', :fullName, '%'))) AND " +
           "(:visaStatus IS NULL OR bc.visaStatus = :visaStatus) AND " +
           "(:primarySkill IS NULL OR LOWER(bc.primarySkill) LIKE LOWER(CONCAT('%', :primarySkill, '%'))) AND " +
           "(:state IS NULL OR LOWER(bc.state) LIKE LOWER(CONCAT('%', :state, '%'))) AND " +
           "(:assignedConsultantName IS NULL OR LOWER(ac.fullName) LIKE LOWER(CONCAT('%', :assignedConsultantName, '%')))")
    Page<BenchCandidate> searchBenchCandidates(
        @Param("fullName") String fullName,
        @Param("visaStatus") BenchCandidate.VisaStatus visaStatus,
        @Param("primarySkill") String primarySkill,
        @Param("state") String state,
        @Param("assignedConsultantName") String assignedConsultantName,
        Pageable pageable
    );
    
    // Find recent bench candidates
    @Query("SELECT bc FROM BenchCandidate bc ORDER BY bc.createdAt DESC")
    List<BenchCandidate> findRecentBenchCandidates(Pageable pageable);
    
    // Get candidates by experience range
    List<BenchCandidate> findByExperienceYearsBetween(Integer minExp, Integer maxExp);
    
    // Count total bench candidates
    Long countBy();
}