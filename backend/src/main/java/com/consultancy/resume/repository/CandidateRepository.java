package com.consultancy.resume.repository;

import com.consultancy.resume.entity.Candidate;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CandidateRepository extends JpaRepository<Candidate, Long> {
    
    // Find by status
    List<Candidate> findByStatus(Candidate.CandidateStatus status);
    
    // Find by visa status
    List<Candidate> findByVisaStatus(Candidate.VisaStatus visaStatus);
    
    // Find by primary skill (case insensitive)
    List<Candidate> findByPrimarySkillContainingIgnoreCase(String skill);
    
    // Find by location
    List<Candidate> findByCityIgnoreCaseAndStateIgnoreCase(String city, String state);
    
    // Find by state
    List<Candidate> findByStateIgnoreCase(String state);
    
    // Search candidates with multiple filters
    @Query("SELECT c FROM Candidate c WHERE " +
           "(:fullName IS NULL OR LOWER(c.fullName) LIKE LOWER(CONCAT('%', :fullName, '%'))) AND " +
           "(:visaStatus IS NULL OR c.visaStatus = :visaStatus) AND " +
           "(:primarySkill IS NULL OR LOWER(c.primarySkill) LIKE LOWER(CONCAT('%', :primarySkill, '%'))) AND " +
           "(:state IS NULL OR LOWER(c.state) LIKE LOWER(CONCAT('%', :state, '%'))) AND " +
           "(:status IS NULL OR c.status = :status)")
    Page<Candidate> searchCandidates(
        @Param("fullName") String fullName,
        @Param("visaStatus") Candidate.VisaStatus visaStatus,
        @Param("primarySkill") String primarySkill,
        @Param("state") String state,
        @Param("status") Candidate.CandidateStatus status,
        Pageable pageable
    );
    
    // Count by status
    Long countByStatus(Candidate.CandidateStatus status);
    
    // Find recent candidates
    @Query("SELECT c FROM Candidate c ORDER BY c.createdAt DESC")
    List<Candidate> findRecentCandidates(Pageable pageable);
    
    // Get candidates by experience range
    List<Candidate> findByExperienceYearsBetween(Integer minExp, Integer maxExp);
}