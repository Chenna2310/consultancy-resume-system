package com.consultancy.resume.repository;

import com.consultancy.resume.entity.CandidateActivity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface CandidateActivityRepository extends JpaRepository<CandidateActivity, Long> {
    
    // Find activities by candidate ID
    List<CandidateActivity> findByCandidateIdOrderByActivityDateDesc(Long candidateId);
    
    // Find activities by candidate ID with pagination
    Page<CandidateActivity> findByCandidateId(Long candidateId, Pageable pageable);
    
    // Find activities by activity type
    List<CandidateActivity> findByActivityType(CandidateActivity.ActivityType activityType);
    
    // Find activities by date range
    List<CandidateActivity> findByActivityDateBetween(LocalDate startDate, LocalDate endDate);
    
    // Find activities by candidate and date range
    List<CandidateActivity> findByCandidateIdAndActivityDateBetween(
        Long candidateId, LocalDate startDate, LocalDate endDate);
    
    // Find activities by client name
    List<CandidateActivity> findByClientNameContainingIgnoreCase(String clientName);
    
    // Count activities by candidate
    Long countByCandidateId(Long candidateId);
    
    // Count activities by type
    Long countByActivityType(CandidateActivity.ActivityType activityType);
    
    // Get activities by candidate and activity type
    List<CandidateActivity> findByCandidateIdAndActivityType(
        Long candidateId, CandidateActivity.ActivityType activityType);
    
    // Find recent activities
    @Query("SELECT ca FROM CandidateActivity ca ORDER BY ca.createdAt DESC")
    List<CandidateActivity> findRecentActivities(Pageable pageable);
    
    // Search activities with filters
    @Query("SELECT ca FROM CandidateActivity ca WHERE " +
           "(:candidateId IS NULL OR ca.candidateId = :candidateId) AND " +
           "(:activityType IS NULL OR ca.activityType = :activityType) AND " +
           "(:clientName IS NULL OR LOWER(ca.clientName) LIKE LOWER(CONCAT('%', :clientName, '%'))) AND " +
           "(:startDate IS NULL OR ca.activityDate >= :startDate) AND " +
           "(:endDate IS NULL OR ca.activityDate <= :endDate)")
    Page<CandidateActivity> searchActivities(
        @Param("candidateId") Long candidateId,
        @Param("activityType") CandidateActivity.ActivityType activityType,
        @Param("clientName") String clientName,
        @Param("startDate") LocalDate startDate,
        @Param("endDate") LocalDate endDate,
        Pageable pageable
    );
}