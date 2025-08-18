package com.consultancy.resume.dto;

import com.consultancy.resume.entity.CandidateDocument;
import java.time.LocalDateTime;

public class CandidateDocumentResponse {
    private Long id;
    private String filename;
    private String originalFilename;
    private Long fileSize;
    private String formattedFileSize;
    private String contentType;
    private CandidateDocument.DocumentType documentType;
    private LocalDateTime uploadedAt;
    private String uploadedByName;
    private String fileExtension;
    private boolean isPdf;
    private boolean isImage;
    private boolean isWord;

    public CandidateDocumentResponse(CandidateDocument document) {
        this.id = document.getId();
        this.filename = document.getFilename();
        this.originalFilename = document.getOriginalFilename();
        this.fileSize = document.getFileSize();
        this.formattedFileSize = document.getFormattedFileSize();
        this.contentType = document.getContentType();
        this.documentType = document.getDocumentType();
        this.uploadedAt = document.getUploadedAt();
        this.uploadedByName = document.getUploadedBy() != null ? document.getUploadedBy().getFullName() : null;
        this.fileExtension = document.getFileExtension();
        this.isPdf = document.isPdf();
        this.isImage = document.isImage();
        this.isWord = document.isWord();
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getFilename() { return filename; }
    public void setFilename(String filename) { this.filename = filename; }

    public String getOriginalFilename() { return originalFilename; }
    public void setOriginalFilename(String originalFilename) { this.originalFilename = originalFilename; }

    public Long getFileSize() { return fileSize; }
    public void setFileSize(Long fileSize) { this.fileSize = fileSize; }

    public String getFormattedFileSize() { return formattedFileSize; }
    public void setFormattedFileSize(String formattedFileSize) { this.formattedFileSize = formattedFileSize; }

    public String getContentType() { return contentType; }
    public void setContentType(String contentType) { this.contentType = contentType; }

    public CandidateDocument.DocumentType getDocumentType() { return documentType; }
    public void setDocumentType(CandidateDocument.DocumentType documentType) { this.documentType = documentType; }

    public LocalDateTime getUploadedAt() { return uploadedAt; }
    public void setUploadedAt(LocalDateTime uploadedAt) { this.uploadedAt = uploadedAt; }

    public String getUploadedByName() { return uploadedByName; }
    public void setUploadedByName(String uploadedByName) { this.uploadedByName = uploadedByName; }

    public String getFileExtension() { return fileExtension; }
    public void setFileExtension(String fileExtension) { this.fileExtension = fileExtension; }

    public boolean isPdf() { return isPdf; }
    public void setPdf(boolean pdf) { isPdf = pdf; }

    public boolean isImage() { return isImage; }
    public void setImage(boolean image) { isImage = image; }

    public boolean isWord() { return isWord; }
    public void setWord(boolean word) { isWord = word; }

    // Helper method to get display icon
    public String getFileIcon() {
        if (isPdf) return "📄";
        if (isWord) return "📝";
        if (isImage) return "🖼️";
        return "📎";
    }
}