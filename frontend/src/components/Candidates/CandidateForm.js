// components/Candidates/CandidateForm.js
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { candidatesAPI } from '../../services/api';
import toast from 'react-hot-toast';

const CandidateForm = () => {
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
    contactInfo: '',
    notes: '',
    status: 'BENCH',
  });

  const [resume, setResume] = useState(null);
  const [currentResumeFilename, setCurrentResumeFilename] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingCandidate, setLoadingCandidate] = useState(isEdit);

  useEffect(() => {
    if (isEdit) {
      fetchCandidate();
    }
  }, [id, isEdit]);

  const fetchCandidate = async () => {
    try {
      const response = await candidatesAPI.getById(id);
      const candidate = response.data;
      setFormData({
        fullName: candidate.fullName || '',
        visaStatus: candidate.visaStatus || 'H1B',
        city: candidate.city || '',
        state: candidate.state || '',
        primarySkill: candidate.primarySkill || '',
        experienceYears: candidate.experienceYears || '',
        contactInfo: candidate.contactInfo || '',
        notes: candidate.notes || '',
        status: candidate.status || 'BENCH',
      });
      setCurrentResumeFilename(candidate.resumeFilename || '');
    } catch (error) {
      toast.error('Failed to load candidate details');
      navigate('/candidates');
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
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      const allowedTypes = [
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
      ];
      
      if (!allowedTypes.includes(file.type)) {
        toast.error('Please select a PDF or Word document');
        e.target.value = '';
        return;
      }

      // Validate file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        toast.error('File size must be less than 10MB');
        e.target.value = '';
        return;
      }

      setResume(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const submitData = new FormData();
      
      // Append form fields
      Object.keys(formData).forEach(key => {
        submitData.append(key, formData[key]);
      });

      // Append resume file if selected
      if (resume) {
        submitData.append('resume', resume);
      }

      let response;
      if (isEdit) {
        response = await candidatesAPI.update(id, submitData);
        toast.success('Candidate updated successfully!');
      } else {
        response = await candidatesAPI.create(submitData);
        toast.success('Candidate created successfully!');
      }

      navigate('/candidates');
    } catch (error) {
      const message = error.response?.data?.message || 
        `Failed to ${isEdit ? 'update' : 'create'} candidate`;
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate('/candidates');
  };

  if (loadingCandidate) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '400px' }}>
        <div>Loading candidate details...</div>
      </div>
    );
  }

  return (
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 'bold', color: '#1f2937', marginBottom: '0.5rem' }}>
          {isEdit ? 'Edit Candidate' : 'Add New Candidate'}
        </h1>
        <p style={{ color: '#6b7280' }}>
          {isEdit ? 'Update candidate information' : 'Fill in the candidate details and upload their resume'}
        </p>
      </div>

      <div className="form-container">
        <form onSubmit={handleSubmit}>
          <div className="form-grid">
            {/* Full Name */}
            <div className="form-group">
              <label htmlFor="fullName" className="form-label">
                Full Name *
              </label>
              <input
                type="text"
                id="fullName"
                name="fullName"
                className="form-input"
                value={formData.fullName}
                onChange={handleChange}
                required
                placeholder="Enter full name"
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

            {/* Status */}
            <div className="form-group">
              <label htmlFor="status" className="form-label">
                Status
              </label>
              <select
                id="status"
                name="status"
                className="form-input"
                value={formData.status}
                onChange={handleChange}
              >
                <option value="BENCH">Bench</option>
                <option value="WORKING">Currently Working</option>
                <option value="INTERVIEW">In Interview Process</option>
                <option value="PLACED">Placed</option>
                <option value="INACTIVE">Inactive</option>
              </select>
            </div>

            {/* Contact Info */}
            <div className="form-group">
              <label htmlFor="contactInfo" className="form-label">
                Contact Information
              </label>
              <input
                type="text"
                id="contactInfo"
                name="contactInfo"
                className="form-input"
                value={formData.contactInfo}
                onChange={handleChange}
                placeholder="email@example.com | (555) 123-4567"
              />
            </div>
          </div>

          {/* Notes */}
          <div className="form-group">
            <label htmlFor="notes" className="form-label">
              Notes
            </label>
            <textarea
              id="notes"
              name="notes"
              className="form-input"
              value={formData.notes}
              onChange={handleChange}
              rows="4"
              placeholder="Additional notes about the candidate..."
              style={{ resize: 'vertical' }}
            />
          </div>

          {/* Resume Upload */}
          <div className="form-group">
            <label htmlFor="resume" className="form-label">
              Resume {!isEdit && '*'}
            </label>
            {currentResumeFilename && (
              <div style={{ 
                marginBottom: '0.5rem', 
                padding: '0.5rem', 
                backgroundColor: '#f3f4f6', 
                borderRadius: '4px',
                fontSize: '0.875rem'
              }}>
                Current file: <strong>{currentResumeFilename}</strong>
              </div>
            )}
            <input
              type="file"
              id="resume"
              name="resume"
              className="form-input"
              onChange={handleFileChange}
              accept=".pdf,.doc,.docx"
              required={!isEdit && !currentResumeFilename}
            />
            <div style={{ fontSize: '0.875rem', color: '#6b7280', marginTop: '0.25rem' }}>
              Accepted formats: PDF, DOC, DOCX (Max size: 10MB)
            </div>
          </div>

          {/* Form Actions */}
          <div className="form-actions">
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
                : (isEdit ? 'Update Candidate' : 'Create Candidate')
              }
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CandidateForm;