import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { employeesAPI } from '../../services/api';
import toast from 'react-hot-toast';

const ConsultantForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = Boolean(id);

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phoneNumber: '',
    role: 'US_IT_RECRUITER',
    notes: '',
  });

  const [loading, setLoading] = useState(false);
  const [loadingConsultant, setLoadingConsultant] = useState(isEdit);

  useEffect(() => {
    if (isEdit) {
      fetchConsultant();
    }
  }, [id, isEdit]);

  const fetchConsultant = async () => {
    try {
      const response = await employeesAPI.getById(id);
      const consultant = response.data;
      setFormData({
        fullName: consultant.fullName || '',
        email: consultant.email || '',
        phoneNumber: consultant.phoneNumber || '',
        role: consultant.role || 'US_IT_RECRUITER',
        notes: consultant.notes || '',
      });
    } catch (error) {
      toast.error('Failed to load consultant details');
      navigate('/consultants');
    } finally {
      setLoadingConsultant(false);
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
        await employeesAPI.update(id, formData);
        toast.success('Consultant updated successfully!');
      } else {
        await employeesAPI.create(formData);
        toast.success('Consultant created successfully!');
      }

      navigate('/consultants');
    } catch (error) {
      const message = error.response?.data?.message || 
        `Failed to ${isEdit ? 'update' : 'create'} consultant`;
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate('/consultants');
  };

  if (loadingConsultant) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '400px' }}>
        <div>Loading consultant details...</div>
      </div>
    );
  }

  return (
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 'bold', color: '#1F2937', marginBottom: '0.5rem' }}>
          {isEdit ? 'Edit Consultant' : 'Add New Consultant'}
        </h1>
        <p style={{ color: '#6B7280' }}>
          {isEdit ? 'Update consultant information' : 'Fill in the consultant details'}
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
                placeholder="consultant@company.com"
              />
            </div>

            {/* Phone Number */}
            <div className="form-group">
              <label htmlFor="phoneNumber" className="form-label">
                Phone Number
              </label>
              <input
                type="tel"
                id="phoneNumber"
                name="phoneNumber"
                className="form-input"
                value={formData.phoneNumber}
                onChange={handleChange}
                placeholder="(555) 123-4567"
              />
            </div>

            {/* Role */}
            <div className="form-group">
              <label htmlFor="role" className="form-label">
                Role *
              </label>
              <select
                id="role"
                name="role"
                className="form-input"
                value={formData.role}
                onChange={handleChange}
                required
              >
                <option value="US_IT_RECRUITER">US IT Recruiter</option>
                <option value="ACCOUNT_MANAGER">Account Manager</option>
                <option value="MARKETING">Marketing</option>
                <option value="ADMIN">Admin</option>
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
              placeholder="Additional notes about the consultant..."
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
                : (isEdit ? 'Update Consultant' : 'Create Consultant')
              }
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ConsultantForm;