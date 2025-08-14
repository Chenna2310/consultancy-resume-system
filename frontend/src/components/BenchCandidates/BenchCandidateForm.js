import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { benchCandidatesAPI, employeesAPI } from '../../services/api';
import toast from 'react-hot-toast';

const BenchCandidateForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = Boolean(id);

  const [formData, setFormData] = useState({
    fullName: '',
    visaStatus: 'H1B',
    city: '',
    state: '',
    primarySkill: '',
    experienceYears: '',
    phoneNumber: '',
    email: '',
    targetRate: '',
    assignedConsultantId: '',
    notes: '',
  });

  const [employees, setEmployees] = useState([]);
  const [documents, setDocuments] = useState([]); // Multiple documents
  const [currentDocuments, setCurrentDocuments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingCandidate, setLoadingCandidate] = useState(isEdit);

  useEffect(() => {
    fetchEmployees();
    if (isEdit) {
      fetchCandidate();
    }
  }, [id, isEdit]);

  const fetchEmployees = async () => {
    try {
      const response = await employeesAPI.getAll();
      setEmployees(response.data);
    } catch (error) {
      toast.error('Failed to load employees');
    }
  };

  const fetchCandidate = async () => {
    try {
      const response = await benchCandidatesAPI.getById(id);
      const candidate = response.data;
      setFormData({
        fullName: candidate.fullName || '',
        visaStatus: candidate.visaStatus || 'H1B',
        city: candidate.city || '',
        state: candidate.state || '',
        primarySkill: candidate.primarySkill || '',
        experienceYears: candidate.experienceYears || '',
        phoneNumber: candidate.phoneNumber || '',
        email: candidate.email || '',
        targetRate: candidate.targetRate || '',
        assignedConsultantId: candidate.assignedConsultantId || '',
        notes: candidate.notes || '',
      });
      // Set current documents if any
      if (candidate.documents) {
        setCurrentDocuments(candidate.documents);
      }
    } catch (error) {
      toast.error('Failed to load candidate details');
      navigate('/bench-candidates');
    } finally {
      setLoadingCandidate(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    
    if (files.length === 0) return;

    // Validate file types
    const allowedTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'image/jpeg',
      'image/png',
      'image/jpg'
    ];
    
    const invalidFiles = files.filter(file => !allowedTypes.includes(file.type));
    if (invalidFiles.length > 0) {
      toast.error('Please select only PDF, Word documents, or image files');
      e.target.value = '';
      return;
    }

    // Validate total file size (max 50MB total)
    const totalSize = files.reduce((sum, file) => sum + file.size, 0);
    if (totalSize > 50 * 1024 * 1024) {
      toast.error('Total file size must be less than 50MB');
      e.target.value = '';
      return;
    }

    setDocuments(files);
  };

  const removeDocument = (index) => {
    const newDocuments = documents.filter((_, i) => i !== index);
    setDocuments(newDocuments);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const submitData = new FormData();
      
      // Append form fields
      Object.keys(formData).forEach(key => {
        if (formData[key] !== '') {
          submitData.append(key, formData[key]);
        }
      });

      // Append document files
      documents.forEach((file, index) => {
        submitData.append(`documents`, file);
      });

      let response;
      if (isEdit) {
        response = await benchCandidatesAPI.update(id, submitData);
        toast.success('Bench candidate updated successfully!');
      } else {
        response = await benchCandidatesAPI.create(submitData);
        toast.success('Bench candidate created successfully!');
      }

      navigate('/bench-candidates');
    } catch (error) {
      const message = error.response?.data?.message || 
        `Failed to ${isEdit ? 'update' : 'create'} bench candidate`;
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate('/bench-candidates');
  };

  if (loadingCandidate) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '400px' }}>
        <div>Loading candidate details...</div>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '2rem' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 'bold', color: '#1F2937', marginBottom: '0.5rem' }}>
          {isEdit ? 'Edit Bench Candidate' : 'Add New Bench Candidate'}
        </h1>
        <p style={{ color: '#6B7280' }}>
          {isEdit ? 'Update bench candidate information' : 'Fill in the candidate details for bench profile'}
        </p>
      </div>

      <div style={{ 
        background: 'white', 
        borderRadius: '12px', 
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
        padding: '2rem'
      }}>
        <form onSubmit={handleSubmit}>
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
            gap: '1.5rem', 
            marginBottom: '2rem' 
          }}>
            {/* Full Name */}
            <div className="form-group">
              <label htmlFor="fullName" className="form-label">
                Candidate Name *
              </label>
              <input
                type="text"
                id="fullName"
                name="fullName"
                className="form-input"
                value={formData.fullName}
                onChange={handleChange}
                required
                placeholder="Enter candidate full name"
              />
            </div>

            {/* Visa Status */}
            <div className="form-group">
              <label htmlFor="visaStatus" className="form-label">
                Visa Status *
              </label>
              <select
                id="visaStatus"
                name="visaStatus"
                className="form-input"
                value={formData.visaStatus}
                onChange={handleChange}
                required
              >
                <option value="H1B">H1B</option>
                <option value="OPT">OPT</option>
                <option value="GC">Green Card</option>
                <option value="CITIZEN">US Citizen</option>
                <option value="F1">F1</option>
                <option value="L1">L1</option>
                <option value="OTHER">Other</option>
              </select>
            </div>

            {/* City */}
            <div className="form-group">
              <label htmlFor="city" className="form-label">
                City *
              </label>
              <input
                type="text"
                id="city"
                name="city"
                className="form-input"
                value={formData.city}
                onChange={handleChange}
                required
                placeholder="e.g. New York"
              />
            </div>

            {/* State */}
            <div className="form-group">
              <label htmlFor="state" className="form-label">
                State *
              </label>
              <input
                type="text"
                id="state"
                name="state"
                className="form-input"
                value={formData.state}
                onChange={handleChange}
                required
                placeholder="e.g. NY"
              />
            </div>

            {/* Primary Skill */}
            <div className="form-group">
              <label htmlFor="primarySkill" className="form-label">
                Primary Skill *
              </label>
              <input
                type="text"
                id="primarySkill"
                name="primarySkill"
                className="form-input"
                value={formData.primarySkill}
                onChange={handleChange}
                required
                placeholder="e.g. Java Developer, React, Data Engineer"
              />
            </div>

            {/* Experience Years */}
            <div className="form-group">
              <label htmlFor="experienceYears" className="form-label">
                Experience (Years) *
              </label>
              <input
                type="number"
                id="experienceYears"
                name="experienceYears"
                className="form-input"
                value={formData.experienceYears}
                onChange={handleChange}
                required
                min="0"
                max="50"
                placeholder="e.g. 5"
              />
            </div>

            {/* Phone Number */}
            <div className="form-group">
              <label htmlFor="phoneNumber" className="form-label">
                Phone Number *
              </label>
              <input
                type="tel"
                id="phoneNumber"
                name="phoneNumber"
                className="form-input"
                value={formData.phoneNumber}
                onChange={handleChange}
                required
                placeholder="(555) 123-4567"
              />
            </div>

            {/* Email */}
            <div className="form-group">
              <label htmlFor="email" className="form-label">
                Email *
              </label>
              <input
                type="email"
                id="email"
                name="email"
                className="form-input"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="candidate@email.com"
              />
            </div>

            {/* Target Rate */}
            <div className="form-group">
              <label htmlFor="targetRate" className="form-label">
                Target Rate ($/hr)
              </label>
              <input
                type="number"
                id="targetRate"
                name="targetRate"
                className="form-input"
                value={formData.targetRate}
                onChange={handleChange}
                min="0"
                step="0.01"
                placeholder="e.g. 75"
              />
            </div>

            {/* Assigned Consultant */}
            <div className="form-group">
              <label htmlFor="assignedConsultantId" className="form-label">
                Assigned Consultant
              </label>
              <select
                id="assignedConsultantId"
                name="assignedConsultantId"
                className="form-input"
                value={formData.assignedConsultantId}
                onChange={handleChange}
              >
                <option value="">Select Consultant (Optional)</option>
                {employees.map(employee => (
                  <option key={employee.id} value={employee.id}>
                    {employee.fullName} - {employee.role}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Notes */}
          <div className="form-group" style={{ marginBottom: '2rem' }}>
            <label htmlFor="notes" className="form-label">
              Notes
            </label>
            <textarea
              id="notes"
              name="notes"
              className="form-input"
              value={formData.notes}
              onChange={handleChange}
              rows="3"
              placeholder="Additional notes about the candidate..."
              style={{ resize: 'vertical' }}
            />
          </div>

          {/* Documents Upload */}
          <div className="form-group" style={{ marginBottom: '2rem' }}>
            <label htmlFor="documents" className="form-label">
              Upload Documents *
            </label>
            
            {/* Current documents display */}
            {currentDocuments.length > 0 && (
              <div style={{ 
                marginBottom: '1rem', 
                padding: '1rem', 
                backgroundColor: '#f3f4f6', 
                borderRadius: '8px'
              }}>
                <h4 style={{ marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: '600' }}>
                  Current Documents:
                </h4>
                {currentDocuments.map((doc, index) => (
                  <div key={index} style={{ fontSize: '0.875rem', color: '#6B7280' }}>
                    📄 {doc.filename}
                  </div>
                ))}
              </div>
            )}

            <input
              type="file"
              id="documents"
              name="documents"
              className="form-input"
              onChange={handleFileChange}
              accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
              multiple
              required={!isEdit && currentDocuments.length === 0}
            />
            
            <div style={{ fontSize: '0.875rem', color: '#6b7280', marginTop: '0.5rem' }}>
              Accepted formats: PDF, DOC, DOCX, JPG, PNG (Max total size: 50MB)
            </div>

            {/* Selected documents preview */}
            {documents.length > 0 && (
              <div style={{ marginTop: '1rem' }}>
                <h4 style={{ marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: '600' }}>
                  Selected Documents ({documents.length}):
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {documents.map((file, index) => (
                    <div 
                      key={index}
                      style={{ 
                        display: 'flex', 
                        justifyContent: 'space-between', 
                        alignItems: 'center',
                        padding: '0.5rem',
                        backgroundColor: '#F3F4F6',
                        borderRadius: '4px',
                        fontSize: '0.875rem'
                      }}
                    >
                      <span>📄 {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)</span>
                      <button
                        type="button"
                        onClick={() => removeDocument(index)}
                        style={{
                          background: '#EF4444',
                          color: 'white',
                          border: 'none',
                          padding: '0.25rem 0.5rem',
                          borderRadius: '4px',
                          fontSize: '0.75rem',
                          cursor: 'pointer'
                        }}
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Form Actions */}
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
            <button
              type="button"
              onClick={handleCancel}
              className="btn-secondary"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-primary"
              disabled={loading}
            >
              {loading 
                ? (isEdit ? 'Updating...' : 'Creating...') 
                : (isEdit ? 'Update Bench Candidate' : 'Create Bench Candidate')
              }
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BenchCandidateForm;