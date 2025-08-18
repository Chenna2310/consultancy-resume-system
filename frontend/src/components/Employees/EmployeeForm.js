import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { workingCandidatesAPI, employeesAPI } from '../../services/api';
import toast from 'react-hot-toast';

const EmployeeForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = Boolean(id);

  const [formData, setFormData] = useState({
    fullName: '',
    visaStatus: 'H1B',
    workingLocation: '',
    jobRole: '',
    experienceYears: '',
    email: '',
    phoneNumber: '',
    hourlyRate: '',
    projectDuration: '',
    clientName: '',
    placedBy: '',
    notes: '',
  });

  const [consultants, setConsultants] = useState([]);
  const [documents, setDocuments] = useState([]); // Multiple documents
  const [currentDocuments, setCurrentDocuments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingEmployee, setLoadingEmployee] = useState(isEdit);

  useEffect(() => {
    fetchConsultants();
    if (isEdit) {
      fetchEmployee();
      fetchCurrentDocuments();
    }
  }, [id, isEdit]);

  const fetchConsultants = async () => {
    try {
      const response = await employeesAPI.getAll();
      setConsultants(response.data);
    } catch (error) {
      toast.error('Failed to load consultants');
    }
  };

  const fetchEmployee = async () => {
    try {
      const response = await workingCandidatesAPI.getById(id);
      const employee = response.data;
      setFormData({
        fullName: employee.fullName || '',
        visaStatus: employee.visaStatus || 'H1B',
        workingLocation: employee.workingLocation || '',
        jobRole: employee.jobRole || '',
        experienceYears: employee.experienceYears || '',
        email: employee.email || '',
        phoneNumber: employee.phoneNumber || '',
        hourlyRate: employee.hourlyRate || '',
        projectDuration: employee.projectDuration || '',
        clientName: employee.clientName || '',
        placedBy: employee.placedById || '',
        notes: employee.notes || '',
      });
    } catch (error) {
      toast.error('Failed to load employee details');
      navigate('/employees');
    } finally {
      setLoadingEmployee(false);
    }
  };

  const fetchCurrentDocuments = async () => {
    try {
      // For now, we'll use empty array since working candidates don't have documents yet
      // This can be implemented later if needed
      setCurrentDocuments([]);
    } catch (error) {
      console.error('Failed to load current documents:', error);
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
      if (isEdit) {
        await workingCandidatesAPI.update(id, formData);
        toast.success('Employee updated successfully!');
      } else {
        await workingCandidatesAPI.create(formData);
        toast.success('Employee created successfully!');
      }

      navigate('/employees');
    } catch (error) {
      const message = error.response?.data?.message || 
        `Failed to ${isEdit ? 'update' : 'create'} employee`;
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate('/employees');
  };

  const getFileIcon = (filename) => {
    const ext = filename.split('.').pop().toLowerCase();
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

  if (loadingEmployee) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '400px' }}>
        <div>Loading employee details...</div>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '2rem' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 'bold', color: '#1F2937', marginBottom: '0.5rem' }}>
          {isEdit ? 'Edit Employee' : 'Add New Employee'}
        </h1>
        <p style={{ color: '#6B7280' }}>
          {isEdit ? 'Update employee information' : 'Fill in the employee details for working profile'}
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
                Employee Name *
              </label>
              <input
                type="text"
                id="fullName"
                name="fullName"
                className="form-input"
                value={formData.fullName}
                onChange={handleChange}
                required
                placeholder="Enter employee full name"
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

            {/* Working Location */}
            <div className="form-group">
              <label htmlFor="workingLocation" className="form-label">
                Working Location *
              </label>
              <input
                type="text"
                id="workingLocation"
                name="workingLocation"
                className="form-input"
                value={formData.workingLocation}
                onChange={handleChange}
                required
                placeholder="e.g. Remote, New York, NY"
              />
            </div>

            {/* Job Role */}
            <div className="form-group">
              <label htmlFor="jobRole" className="form-label">
                Job Role *
              </label>
              <input
                type="text"
                id="jobRole"
                name="jobRole"
                className="form-input"
                value={formData.jobRole}
                onChange={handleChange}
                required
                placeholder="e.g. Senior Java Developer, Data Scientist"
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
                placeholder="employee@email.com"
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

            {/* Hourly Rate */}
            <div className="form-group">
              <label htmlFor="hourlyRate" className="form-label">
                Hourly Rate ($/hr) *
              </label>
              <input
                type="number"
                id="hourlyRate"
                name="hourlyRate"
                className="form-input"
                value={formData.hourlyRate}
                onChange={handleChange}
                required
                min="0"
                step="0.01"
                placeholder="e.g. 85"
              />
            </div>

            {/* Project Duration */}
            <div className="form-group">
              <label htmlFor="projectDuration" className="form-label">
                Project Duration *
              </label>
              <input
                type="text"
                id="projectDuration"
                name="projectDuration"
                className="form-input"
                value={formData.projectDuration}
                onChange={handleChange}
                required
                placeholder="e.g. 6 months, 1 year, Long term"
              />
            </div>

            {/* Client Name */}
            <div className="form-group">
              <label htmlFor="clientName" className="form-label">
                Client Name *
              </label>
              <input
                type="text"
                id="clientName"
                name="clientName"
                className="form-input"
                value={formData.clientName}
                onChange={handleChange}
                required
                placeholder="e.g. Google, Microsoft, Amazon"
              />
            </div>

            {/* Placed By */}
            <div className="form-group">
              <label htmlFor="placedBy" className="form-label">
                Placed By *
              </label>
              <select
                id="placedBy"
                name="placedBy"
                className="form-input"
                value={formData.placedBy}
                onChange={handleChange}
                required
              >
                <option value="">Select Consultant</option>
                {consultants.map(consultant => (
                  <option key={consultant.id} value={consultant.id}>
                    {consultant.fullName} - {consultant.role}
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
              placeholder="Additional notes about the employee..."
              style={{ resize: 'vertical' }}
            />
          </div>

          {/* Documents Upload */}
          <div className="form-group" style={{ marginBottom: '2rem' }}>
            <label htmlFor="documents" className="form-label">
              {isEdit ? 'Upload Additional Documents' : 'Upload Documents'}
            </label>
            
            <input
              type="file"
              id="documents"
              name="documents"
              className="form-input"
              onChange={handleFileChange}
              accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
              multiple
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
                      <span>
                        {getFileIcon(file.name)} {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)
                      </span>
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
                : (isEdit ? 'Update Employee' : 'Create Employee')
              }
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EmployeeForm;