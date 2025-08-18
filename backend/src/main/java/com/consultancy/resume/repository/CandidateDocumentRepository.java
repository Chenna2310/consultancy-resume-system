package com.consultancy.resume.repository;

import com.consultancy.resume.entity.CandidateDocument;
import com.consultancy.resume.entity.BenchCandidate;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CandidateDocumentRepository extends JpaRepository<CandidateDocument, Long> {
    
    // Find documents by bench candidate
    List<CandidateDocument> findByBenchCandidateIdOrderByUploadedAtDesc(Long benchCandidateId);
    
    // Find document by candidate and document id
    Optional<CandidateDocument> findByIdAndBenchCandidateId(Long documentId, Long benchCandidateId);
    
    // Find documents by document type
    List<CandidateDocument> findByBenchCandidateIdAndDocumentType(Long benchCandidateId, CandidateDocument.DocumentType documentType);
    
    // Count documents for a candidate
    Long countByBenchCandidateId(Long benchCandidateId);
    
    // Find documents by filename
    List<CandidateDocument> findByBenchCandidateIdAndOriginalFilenameContainingIgnoreCase(Long benchCandidateId, String filename);
    
    // Custom query to get total file size for a candidate
    @Query("SELECT COALESCE(SUM(cd.fileSize), 0) FROM CandidateDocument cd WHERE cd.benchCandidate.id = :candidateId")
    Long getTotalFileSizeByBenchCandidateId(@Param("candidateId") Long candidateId);
    
    // Delete documents by candidate
    void deleteByBenchCandidateId(Long benchCandidateId);
    
    // Check if document exists
    boolean existsByIdAndBenchCandidateId(Long documentId, Long benchCandidateId);
}