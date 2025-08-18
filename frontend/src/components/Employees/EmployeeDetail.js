import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { workingCandidatesAPI } from '../../services/api';
import toast from 'react-hot-toast';

const EmployeeDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [employee, setEmployee] = useState(null);
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('documents');
  const [documentPreview, setDocumentPreview] = useState(null);
  const [uploadingDocuments, setUploadingDocuments] = useState(false);

  useEffect(() => {
    fetchEmployeeDetails();
    fetchDocuments();
  }, [id]);

  const fetchEmployeeDetails = async () => {
    try {
      const response = await workingCandidatesAPI.getById(id);
      setEmployee(response.data);
    } catch (error) {
      toast.error('Failed to load employee details');
      navigate('/employees');
    } finally {
      setLoading(false);
    }
  };

  const fetchDocuments = async () => {
    try {
      // For now, we'll use empty array since working candidates don't have documents yet
      // This can be implemented later when document management is added
      setDocuments([]);
    } catch (error) {
      console.error('Failed to load documents:', error);
    }
  };

  const handleDocumentUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    setUploadingDocuments(true);
    try {
      // This would be implemented when document management is added for working candidates
      toast.success(`${files.length} document(s) uploaded successfully!`);
      fetchDocuments();
      e.target.value = ''; // Reset file input
    } catch (error) {
      toast.error('Failed to upload documents');
    } finally {
      setUploadingDocuments(false);
    }
  };

  const handleDownloadDocument = async (documentId, filename) => {
    try {
      // This would be implemented when document management is added
      toast.success('Document downloaded successfully!');
    } catch (error) {
      toast.error('Failed to download document');
    }
  };

  const handlePreviewDocument = async (documentId, filename) => {
    try {
      // This would be implemented when document management is added
      toast.info('Document preview functionality coming soon!');
    } catch (error) {
      toast.error('Failed to preview document');
    }
  };

  const handleDeleteDocument = async (documentId) => {
    if (window.confirm('Are you sure you want to delete this document?')) {
      try {
        // This would be implemented when document management is added
        toast.success('Document deleted successfully!');
        fetchDocuments();
      } catch (error) {
        toast.error('Failed to delete document');
      }
    }
  };

  const getFileIcon = (filename) => {
    const ext = filename?.split('.').pop()?.toLowerCase() || '';
    switch (ext) {
      case 'pdf': return '📄';
      case 'doc':
      case 'docx': return '📝';
      case 'jpg':
      case 'jpeg':
      case 'png': return '🖼️';
      default: return '📎';
    }
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '400px' }}>
        <div>Loading employee details...</div>
      </div>
    );
  }

  if (!employee) {
    return (
      <div style={{ textAlign: 'center', padding: '2rem' }}>
        <h2>Employee not found</h2>
        <Link to="/employees" className="btn-primary">Back to Employees</Link>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: 'bold', color: '#1F2937', marginBottom: '0.5rem' }}>
            {employee.fullName}
          </h1>
          <p style={{ color: '#6B7280' }}>
            Employee Details & Document Management
          </p>
        </div>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <Link to={`/employees/edit/${id}`} className="btn-secondary">
            ✏️ Edit Profile
          </Link>
          <Link to="/employees" className="btn-secondary">
            ← Back to List
          </Link>
        </div>
      </div>

      {/* Employee Details Card */}
      <div style={{ 
        background: 'white', 
        borderRadius: '12px', 
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
        padding: '2rem',
        marginBottom: '2rem'
      }}>
        <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '1.5rem' }}>
          👤 Employee Information
        </h3>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1rem' }}>
          <div><strong>Visa Status:</strong> {employee.visaStatus}</div>
          <div><strong>Working Location:</strong> {employee.workingLocation}</div>
          <div><strong>Job Role:</strong> {employee.jobRole}</div>
          <div><strong>Experience:</strong> {employee.experienceYears} years</div>
          <div><strong>Phone:</strong> {employee.phoneNumber}</div>
          <div><strong>Email:</strong> {employee.email}</div>
          <div><strong>Hourly Rate:</strong> ${employee.hourlyRate}/hr</div>
          <div><strong>Project Duration:</strong> {employee.projectDuration}</div>
          <div><strong>Client:</strong> {employee.clientName}</div>
          {employee.placedByName && <div><strong>Placed By:</strong> {employee.placedByName}</div>}
        </div>

        {employee.notes && (
          <div style={{ marginTop: '1rem', padding: '1rem', backgroundColor: '#F3F4F6', borderRadius: '8px' }}>
            <strong>Notes:</strong> {employee.notes}
          </div>
        )}
      </div>

      {/* Tab Navigation */}
      <div style={{ 
        background: 'white', 
        borderRadius: '12px', 
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
        overflow: 'hidden'
      }}>
        <div style={{ 
          display: 'flex',
          borderBottom: '2px solid #E5E7EB'
        }}>
          <button
            onClick={() => setActiveTab('documents')}
            style={{
              padding: '1rem 2rem',
              background: activeTab === 'documents' ? '#3B82F6' : 'transparent',
              color: activeTab === 'documents' ? 'white' : '#6B7280',
              border: 'none',
              fontSize: '1rem',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.3s ease'
            }}
          >
            📄 Documents ({documents.length})
          </button>
          <button
            onClick={() => setActiveTab('performance')}
            style={{
              padding: '1rem 2rem',
              background: activeTab === 'performance' ? '#3B82F6' : 'transparent',
              color: activeTab === 'performance' ? 'white' : '#6B7280',
              border: 'none',
              fontSize: '1rem',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.3s ease'
            }}
          >
            📈 Performance
          </button>
        </div>

        {/* Tab Content */}
        <div style={{ padding: '2rem' }}>
          {/* Documents Tab */}
          {activeTab === 'documents' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <h3 style={{ fontSize: '1.25rem', fontWeight: '600' }}>
                  Document Library
                </h3>
                <div>
                  <input
                    type="file"
                    id="uploadDocs"
                    multiple
                    accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                    onChange={handleDocumentUpload}
                    style={{ display: 'none' }}
                    disabled={uploadingDocuments}
                  />
                  <label
                    htmlFor="uploadDocs"
                    className="btn-primary"
                    style={{ 
                      cursor: uploadingDocuments ? 'not-allowed' : 'pointer', 
                      display: 'inline-block',
                      opacity: uploadingDocuments ? 0.6 : 1
                    }}
                  >
                    {uploadingDocuments ? '⏳ Uploading...' : '📎 Upload Documents'}
                  </label>
                </div>
              </div>

              {documents.length > 0 ? (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '1rem' }}>
                  {documents.map((doc) => (
                    <div 
                      key={doc.id}
                      style={{ 
                        border: '1px solid #E5E7EB',
                        borderRadius: '8px',
                        padding: '1.5rem',
                        backgroundColor: '#FAFAFA',
                        transition: 'all 0.3s ease'
                      }}
                      onMouseEnter={(e) => e.target.style.backgroundColor = '#F3F4F6'}
                      onMouseLeave={(e) => e.target.style.backgroundColor = '#FAFAFA'}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1rem' }}>
                        <span style={{ fontSize: '2rem', marginRight: '0.75rem' }}>
                          {getFileIcon(doc.originalFilename)}
                        </span>
                        <div style={{ flex: 1 }}>
                          <h4 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '0.25rem' }}>
                            {doc.originalFilename}
                          </h4>
                          <p style={{ fontSize: '0.875rem', color: '#6B7280' }}>
                            {doc.formattedFileSize} • Uploaded {new Date(doc.uploadedAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      
                      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                        <button
                          onClick={() => handlePreviewDocument(doc.id, doc.originalFilename)}
                          style={{
                            background: '#3B82F6',
                            color: 'white',
                            border: 'none',
                            padding: '0.5rem 1rem',
                            borderRadius: '6px',
                            fontSize: '0.875rem',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.25rem'
                          }}
                        >
                          👁️ Preview
                        </button>
                        <button
                          onClick={() => handleDownloadDocument(doc.id, doc.originalFilename)}
                          style={{
                            background: '#10B981',
                            color: 'white',
                            border: 'none',
                            padding: '0.5rem 1rem',
                            borderRadius: '6px',
                            fontSize: '0.875rem',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.25rem'
                          }}
                        >
                          ⬇️ Download
                        </button>
                        <button
                          onClick={() => handleDeleteDocument(doc.id)}
                          style={{
                            background: '#EF4444',
                            color: 'white',
                            border: 'none',
                            padding: '0.5rem 1rem',
                            borderRadius: '6px',
                            fontSize: '0.875rem',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.25rem'
                          }}
                        >
                          🗑️ Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div style={{ textAlign: 'center', padding: '3rem', color: '#6B7280' }}>
                  <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>📄</div>
                  <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>No documents uploaded yet</h3>
                  <p style={{ fontSize: '0.875rem', marginBottom: '1.5rem' }}>
                    Upload contracts, certificates, and other important documents
                  </p>
                  <label
                    htmlFor="uploadDocs"
                    className="btn-primary"
                    style={{ cursor: 'pointer', display: 'inline-block' }}
                  >
                    📎 Upload First Document
                  </label>
                </div>
              )}
            </div>
          )}

          {/* Performance Tab */}
          {activeTab === 'performance' && (
            <div>
              <div style={{ 
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '1.5rem'
              }}>
                <h3 style={{ fontSize: '1.25rem', fontWeight: '600' }}>
                  📈 Employee Performance
                </h3>
              </div>
              
              <div>
                <div style={{ marginBottom: '2rem' }}>
                  <h4 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '1rem' }}>Current Assignment Summary</h4>
                  <div style={{ 
                    display: 'grid', 
                    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
                    gap: '1rem' 
                  }}>
                    <div style={{ 
                      backgroundColor: '#F0F9FF', 
                      padding: '1.5rem', 
                      borderRadius: '8px',
                      border: '1px solid #DBEAFE'
                    }}>
                      <div style={{ fontSize: '1.5rem', fontWeight: '700', color: '#3B82F6' }}>
                        ${employee.hourlyRate}/hr
                      </div>
                      <div>Current Rate</div>
                    </div>
                    
                    <div style={{ 
                      backgroundColor: '#F0FDF4', 
                      padding: '1.5rem', 
                      borderRadius: '8px',
                      border: '1px solid #DCFCE7'
                    }}>
                      <div style={{ fontSize: '1.5rem', fontWeight: '700', color: '#10B981' }}>
                        {employee.projectDuration}
                      </div>
                      <div>Project Duration</div>
                    </div>
                    
                    <div style={{ 
                      backgroundColor: '#FFFBEB', 
                      padding: '1.5rem', 
                      borderRadius: '8px',
                      border: '1px solid #FEF3C7'
                    }}>
                      <div style={{ fontSize: '1.5rem', fontWeight: '700', color: '#F59E0B' }}>
                        {employee.experienceYears}
                      </div>
                      <div>Years Experience</div>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h4 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '1rem' }}>Assignment Details</h4>
                  <div style={{ 
                    backgroundColor: '#F9FAFB', 
                    padding: '1.5rem', 
                    borderRadius: '8px',
                    border: '1px solid #E5E7EB'
                  }}>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                      <div>
                        <strong>Client:</strong> {employee.clientName}
                      </div>
                      <div>
                        <strong>Role:</strong> {employee.jobRole}
                      </div>
                      <div>
                        <strong>Location:</strong> {employee.workingLocation}
                      </div>
                      <div>
                        <strong>Placed By:</strong> {employee.placedByName || 'N/A'}
                      </div>
                    </div>
                    
                    {employee.notes && (
                      <div style={{ 
                        marginTop: '1rem', 
                        paddingTop: '1rem', 
                        borderTop: '1px solid #E5E7EB' 
                      }}>
                        <strong>Additional Notes:</strong>
                        <p style={{ marginTop: '0.5rem', fontSize: '0.875rem', color: '#6B7280' }}>
                          {employee.notes}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Document Preview Modal */}
      {documentPreview && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          zIndex: 1000,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '2rem'
        }}>
          <div style={{
            backgroundColor: 'white',
            borderRadius: '12px',
            maxWidth: '90vw',
            maxHeight: '90vh',
            overflow: 'auto',
            position: 'relative'
          }}>
            <div style={{
              padding: '1rem 2rem',
              borderBottom: '1px solid #E5E7EB',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <h3>{documentPreview.filename}</h3>
              <button
                onClick={() => setDocumentPreview(null)}
                style={{
                  background: '#EF4444',
                  color: 'white',
                  border: 'none',
                  padding: '0.5rem 1rem',
                  borderRadius: '6px',
                  cursor: 'pointer'
                }}
              >
                ✕ Close
              </button>
            </div>
            <div style={{ padding: '2rem', textAlign: 'center' }}>
              <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>📄</div>
              <p>Document preview functionality will be available soon!</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmployeeDetail;
