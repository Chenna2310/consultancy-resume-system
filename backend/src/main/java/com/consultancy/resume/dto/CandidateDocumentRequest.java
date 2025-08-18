package com.consultancy.resume.dto;

import com.consultancy.resume.entity.CandidateDocument;

public class CandidateDocumentRequest {
    private CandidateDocument.DocumentType documentType;
    private String description;

    // Constructors
    public CandidateDocumentRequest() {}

    public CandidateDocumentRequest(CandidateDocument.DocumentType documentType, String description) {
        this.documentType = documentType;
        this.description = description;
    }

    // Getters and Setters
    public CandidateDocument.DocumentType getDocumentType() { 
        return documentType; 
    }
    
    public void setDocumentType(CandidateDocument.DocumentType documentType) { 
        this.documentType = documentType; 
    }

    public String getDescription() { 
        return description; 
    }
    
    public void setDescription(String description) { 
        this.description = description; 
    }
}