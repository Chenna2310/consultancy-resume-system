package com.consultancy.resume.service;

import com.consultancy.resume.dto.VendorRequest;
import com.consultancy.resume.dto.VendorResponse;
import com.consultancy.resume.entity.Vendor;
import com.consultancy.resume.entity.User;
import com.consultancy.resume.repository.VendorRepository;
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
public class VendorService {

    @Autowired
    private VendorRepository vendorRepository;

    @Autowired
    private UserRepository userRepository;

    public VendorResponse createVendor(VendorRequest request, UserPrincipal currentUser) {
        Vendor vendor = new Vendor();
        vendor.setCompanyName(request.getCompanyName());
        vendor.setPrimaryContactName(request.getPrimaryContactName());
        vendor.setPrimaryContactEmail(request.getPrimaryContactEmail());
        vendor.setPrimaryContactPhone(request.getPrimaryContactPhone());
        vendor.setAddress(request.getAddress());
        vendor.setCity(request.getCity());
        vendor.setState(request.getState());
        vendor.setPreferredSkills(request.getPreferredSkills());
        vendor.setRateRangeMin(request.getRateRangeMin());
        vendor.setRateRangeMax(request.getRateRangeMax());
        vendor.setNotes(request.getNotes());
        
        if (request.getStatus() != null) {
            vendor.setStatus(request.getStatus());
        }

        // Set the user who created this vendor
        User user = userRepository.findById(currentUser.getId())
            .orElseThrow(() -> new RuntimeException("User not found"));
        vendor.setCreatedBy(user);

        Vendor savedVendor = vendorRepository.save(vendor);
        return new VendorResponse(savedVendor);
    }

    public Page<VendorResponse> getAllVendors(Pageable pageable) {
        Page<Vendor> vendors = vendorRepository.findAll(pageable);
        return vendors.map(VendorResponse::new);
    }

    public VendorResponse getVendorById(Long id) {
        Vendor vendor = vendorRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Vendor not found with id: " + id));
        return new VendorResponse(vendor);
    }

    public VendorResponse updateVendor(Long id, VendorRequest request) {
        Vendor vendor = vendorRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Vendor not found with id: " + id));

        vendor.setCompanyName(request.getCompanyName());
        vendor.setPrimaryContactName(request.getPrimaryContactName());
        vendor.setPrimaryContactEmail(request.getPrimaryContactEmail());
        vendor.setPrimaryContactPhone(request.getPrimaryContactPhone());
        vendor.setAddress(request.getAddress());
        vendor.setCity(request.getCity());
        vendor.setState(request.getState());
        vendor.setPreferredSkills(request.getPreferredSkills());
        vendor.setRateRangeMin(request.getRateRangeMin());
        vendor.setRateRangeMax(request.getRateRangeMax());
        vendor.setNotes(request.getNotes());
        
        if (request.getStatus() != null) {
            vendor.setStatus(request.getStatus());
        }

        Vendor updatedVendor = vendorRepository.save(vendor);
        return new VendorResponse(updatedVendor);
    }

    public void deleteVendor(Long id) {
        Vendor vendor = vendorRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Vendor not found with id: " + id));
        vendorRepository.delete(vendor);
    }

    public Page<VendorResponse> searchVendors(String companyName, String contactName, 
                                            Vendor.VendorStatus status, Pageable pageable) {
        Page<Vendor> vendors = vendorRepository.searchVendors(companyName, contactName, status, pageable);
        return vendors.map(VendorResponse::new);
    }

    public List<VendorResponse> getVendorsByStatus(Vendor.VendorStatus status) {
        List<Vendor> vendors = vendorRepository.findByStatus(status);
        return vendors.stream()
                .map(VendorResponse::new)
                .collect(Collectors.toList());
    }
}