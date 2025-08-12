import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { workingCandidatesAPI, employeesAPI } from '../../services/api';
import toast from 'react-hot-toast';

const WorkingCandidateForm = () => {
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

  const [employees, setEmployees] = useState([]);
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
      const response = await workingCandidatesAPI.getById(id);
      const candidate = response.data;
      setFormData({
        fullName: candidate.fullName || '',
        visaStatus: candidate.visaStatus || 'H1B',
        workingLocation: candidate.workingLocation || '',
        jobRole: candidate.jobRole || '',
        experienceYears: candidate.experienceYears || '',
        email: candidate.email || '',
        phoneNumber: candidate.phoneNumber || '',
        hourlyRate: candidate.hourlyRate || '',
        projectDuration: candidate.projectDuration || '',
        clientName: candidate.clientName || '',
        placedBy: candidate.placedBy || '',
        notes: candidate.notes || '',
      });
    } catch (error) {
      toast.error('Failed to load candidate details');
      navigate('/working-candidates');
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isEdit) {
        await workingCandidatesAPI.update(id, formData);
        toast.success('Working candidate updated successfully!');
      } else {
        await workingCandidatesAPI.create(formData);
        toast.success('Working candidate created successfully!');
      }

      navigate('/working-candidates');
    } catch (error) {
      const message = error.response?.data?.message || 
        `Failed to ${isEdit ? 'update' : 'create'} working candidate`;
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate('/working-candidates');
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
        <h1 style={{ fontSize: '2rem', fontWeight: 'bold', color: '#1F2937', marginBottom: '0.5rem' }}>
          {isEdit ? 'Edit Working Candidate' : 'Add New Working Candidate'}
        </h1>
        <p style={{ color: '#6B7280' }}>
          {isEdit ? 'Update working candidate information' : 'Fill in the candidate details for working profile'}
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
                placeholder="candidate@email.com"
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
                <option value="">Select Employee</option>
                {employees.map(employee => (
                  <option key={employee.id} value={employee.id}>
                    {employee.fullName} - {employee.role}
                  </option>
                ))}
              </select>
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
              placeholder="Additional notes about the working candidate..."
              style={{ resize: 'vertical' }}
            />
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
                : (isEdit ? 'Update Working Candidate' : 'Create Working Candidate')
              }
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default WorkingCandidateForm;