package com.consultancy.resume.repository;

import com.consultancy.resume.entity.Vendor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface VendorRepository extends JpaRepository<Vendor, Long> {
    
    // Find by status
    List<Vendor> findByStatus(Vendor.VendorStatus status);
    
    // Search vendors
    @Query("SELECT v FROM Vendor v WHERE " +
           "(:companyName IS NULL OR LOWER(v.companyName) LIKE LOWER(CONCAT('%', :companyName, '%'))) AND " +
           "(:contactName IS NULL OR LOWER(v.primaryContactName) LIKE LOWER(CONCAT('%', :contactName, '%'))) AND " +
           "(:status IS NULL OR v.status = :status)")
    Page<Vendor> searchVendors(
        @Param("companyName") String companyName,
        @Param("contactName") String contactName,
        @Param("status") Vendor.VendorStatus status,
        Pageable pageable
    );
    
    // Find top performing vendors
    @Query("SELECT v FROM Vendor v WHERE v.status = 'ACTIVE' ORDER BY v.successfulPlacements DESC, v.totalSubmissions DESC")
    List<Vendor> findTopPerformingVendors(Pageable pageable);
    
    // Count by status
    Long countByStatus(Vendor.VendorStatus status);
}