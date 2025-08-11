package com.consultancy.resume.controller;

import com.consultancy.resume.dto.VendorRequest;
import com.consultancy.resume.dto.VendorResponse;
import com.consultancy.resume.entity.Vendor;
import com.consultancy.resume.service.VendorService;
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
@RequestMapping("/vendors")
public class VendorController {

    @Autowired
    private VendorService vendorService;

    @PostMapping
    public ResponseEntity<VendorResponse> createVendor(
            @Valid @RequestBody VendorRequest request,
            @AuthenticationPrincipal UserPrincipal currentUser) {
        
        VendorResponse vendor = vendorService.createVendor(request, currentUser);
        return ResponseEntity.ok(vendor);
    }

    @GetMapping
    public ResponseEntity<Page<VendorResponse>> getAllVendors(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "companyName") String sortBy,
            @RequestParam(defaultValue = "asc") String sortDir) {
        
        Sort sort = sortDir.equalsIgnoreCase("desc") ? 
            Sort.by(sortBy).descending() : Sort.by(sortBy).ascending();
        
        Pageable pageable = PageRequest.of(page, size, sort);
        Page<VendorResponse> vendors = vendorService.getAllVendors(pageable);
        
        return ResponseEntity.ok(vendors);
    }

    @GetMapping("/{id}")
    public ResponseEntity<VendorResponse> getVendorById(@PathVariable Long id) {
        VendorResponse vendor = vendorService.getVendorById(id);
        return ResponseEntity.ok(vendor);
    }

    @PutMapping("/{id}")
    public ResponseEntity<VendorResponse> updateVendor(
            @PathVariable Long id,
            @Valid @RequestBody VendorRequest request) {
        
        VendorResponse vendor = vendorService.updateVendor(id, request);
        return ResponseEntity.ok(vendor);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteVendor(@PathVariable Long id) {
        vendorService.deleteVendor(id);
        return ResponseEntity.ok().body("{\"message\": \"Vendor deleted successfully!\"}");
    }

    @GetMapping("/search")
    public ResponseEntity<Page<VendorResponse>> searchVendors(
            @RequestParam(required = false) String companyName,
            @RequestParam(required = false) String contactName,
            @RequestParam(required = false) Vendor.VendorStatus status,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        
        Pageable pageable = PageRequest.of(page, size, Sort.by("companyName").ascending());
        Page<VendorResponse> vendors = vendorService.searchVendors(
            companyName, contactName, status, pageable);
        
        return ResponseEntity.ok(vendors);
    }

    @GetMapping("/status/{status}")
    public ResponseEntity<List<VendorResponse>> getVendorsByStatus(
            @PathVariable Vendor.VendorStatus status) {
        List<VendorResponse> vendors = vendorService.getVendorsByStatus(status);
        return ResponseEntity.ok(vendors);
    }
}