import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { vendorsAPI } from '../../services/api';
import toast from 'react-hot-toast';

const VendorForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = Boolean(id);

  const [formData, setFormData] = useState({
    companyName: '',
    primaryContactName: '',
    primaryContactEmail: '',
    primaryContactPhone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: '',
    preferredSkills: '',
    rateRangeMin: '',
    rateRangeMax: '',
    totalSubmissions: 0,
    successfulPlacements: 0,
    notes: '',
    status: 'ACTIVE',
  });

  const [loading, setLoading] = useState(false);
  const [loadingVendor, setLoadingVendor] = useState(isEdit);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (isEdit) {
      fetchVendor();
    }
  }, [id, isEdit]);

  const fetchVendor = async () => {
    try {
      const response = await vendorsAPI.getById(id);
      const vendor = response.data;
      setFormData({
        companyName: vendor.companyName || '',
        primaryContactName: vendor.primaryContactName || '',
        primaryContactEmail: vendor.primaryContactEmail || '',
        primaryContactPhone: vendor.primaryContactPhone || '',
        address: vendor.address || '',
        city: vendor.city || '',
        state: vendor.state || '',
        zipCode: vendor.zipCode || '',
        country: vendor.country || '',
        preferredSkills: vendor.preferredSkills || '',
        rateRangeMin: vendor.rateRangeMin || '',
        rateRangeMax: vendor.rateRangeMax || '',
        totalSubmissions: vendor.totalSubmissions || 0,
        successfulPlacements: vendor.successfulPlacements || 0,
        notes: vendor.notes || '',
        status: vendor.status || 'ACTIVE',
      });
    } catch (error) {
      toast.error('Failed to load vendor details');
      navigate('/vendors');
    } finally {
      setLoadingVendor(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: '',
      });
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.companyName.trim()) {
      newErrors.companyName = 'Company name is required';
    }

    if (!formData.primaryContactName.trim()) {
      newErrors.primaryContactName = 'Primary contact name is required';
    }

    if (!formData.primaryContactEmail.trim()) {
      newErrors.primaryContactEmail = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.primaryContactEmail)) {
      newErrors.primaryContactEmail = 'Email format is invalid';
    }

    if (formData.rateRangeMin && isNaN(formData.rateRangeMin)) {
      newErrors.rateRangeMin = 'Minimum rate must be a number';
    }

    if (formData.rateRangeMax && isNaN(formData.rateRangeMax)) {
      newErrors.rateRangeMax = 'Maximum rate must be a number';
    }

    if (formData.rateRangeMin && formData.rateRangeMax && 
        parseFloat(formData.rateRangeMin) > parseFloat(formData.rateRangeMax)) {
      newErrors.rateRangeMax = 'Maximum rate must be greater than minimum rate';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error('Please fix the form errors');
      return;
    }

    setLoading(true);

    try {
      const submitData = { ...formData };
      
      // Convert rate fields to numbers
      if (submitData.rateRangeMin) {
        submitData.rateRangeMin = parseFloat(submitData.rateRangeMin);
      }
      if (submitData.rateRangeMax) {
        submitData.rateRangeMax = parseFloat(submitData.rateRangeMax);
      }

      // Convert submission fields to numbers
      submitData.totalSubmissions = parseInt(submitData.totalSubmissions) || 0;
      submitData.successfulPlacements = parseInt(submitData.successfulPlacements) || 0;

      if (isEdit) {
        await vendorsAPI.update(id, submitData);
        toast.success('Vendor updated successfully!');
      } else {
        await vendorsAPI.create(submitData);
        toast.success('Vendor created successfully!');
      }

      navigate('/vendors');
    } catch (error) {
      const message = error.response?.data?.message || 
        `Failed to ${isEdit ? 'update' : 'create'} vendor`;
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate('/vendors');
  };

  if (loadingVendor) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '400px' }}>
        <div>Loading vendor details...</div>
      </div>
    );
  }

  return (
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 'bold', color: '#1F2937', marginBottom: '0.5rem' }}>
          {isEdit ? 'Edit Vendor' : 'Add New Vendor'}
        </h1>
        <p style={{ color: '#6B7280' }}>
          {isEdit ? 'Update vendor information' : 'Fill in the vendor details and contact information'}
        </p>
      </div>

      <div className="form-container">
        <form onSubmit={handleSubmit}>
          {/* Company Information */}
          <div style={{ marginBottom: '2rem' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#1F2937', marginBottom: '1rem' }}>
              Company Information
            </h3>
            <div className="form-grid">
              <div className="form-group">
                <label htmlFor="companyName" className="form-label">
                  Company Name *
                </label>
                <input
                  type="text"
                  id="companyName"
                  name="companyName"
                  className="form-input"
                  value={formData.companyName}
                  onChange={handleChange}
                  required
                  placeholder="Enter company name"
                />
                {errors.companyName && (
                  <div style={{ color: '#DC2626', fontSize: '0.875rem', marginTop: '0.25rem' }}>
                    {errors.companyName}
                  </div>
                )}
              </div>

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
                  <option value="ACTIVE">Active</option>
                  <option value="INACTIVE">Inactive</option>
                  <option value="PREFERRED">Preferred</option>
                  <option value="SUSPENDED">Suspended</option>
                </select>
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div style={{ marginBottom: '2rem' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#1F2937', marginBottom: '1rem' }}>
              Primary Contact
            </h3>
            <div className="form-grid">
              <div className="form-group">
                <label htmlFor="primaryContactName" className="form-label">
                  Contact Name *
                </label>
                <input
                  type="text"
                  id="primaryContactName"
                  name="primaryContactName"
                  className="form-input"
                  value={formData.primaryContactName}
                  onChange={handleChange}
                  required
                  placeholder="Enter contact name"
                />
                {errors.primaryContactName && (
                  <div style={{ color: '#DC2626', fontSize: '0.875rem', marginTop: '0.25rem' }}>
                    {errors.primaryContactName}
                  </div>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="primaryContactEmail" className="form-label">
                  Email *
                </label>
                <input
                  type="email"
                  id="primaryContactEmail"
                  name="primaryContactEmail"
                  className="form-input"
                  value={formData.primaryContactEmail}
                  onChange={handleChange}
                  required
                  placeholder="contact@company.com"
                />
                {errors.primaryContactEmail && (
                  <div style={{ color: '#DC2626', fontSize: '0.875rem', marginTop: '0.25rem' }}>
                    {errors.primaryContactEmail}
                  </div>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="primaryContactPhone" className="form-label">
                  Phone
                </label>
                <input
                  type="tel"
                  id="primaryContactPhone"
                  name="primaryContactPhone"
                  className="form-input"
                  value={formData.primaryContactPhone}
                  onChange={handleChange}
                  placeholder="(555) 123-4567"
                />
              </div>
            </div>
          </div>

          {/* Address Information */}
          <div style={{ marginBottom: '2rem' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#1F2937', marginBottom: '1rem' }}>
              Address
            </h3>
            <div className="form-grid">
              <div className="form-group">
                <label htmlFor="address" className="form-label">
                  Street Address
                </label>
                <input
                  type="text"
                  id="address"
                  name="address"
                  className="form-input"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="123 Business St"
                />
              </div>

              <div className="form-group">
                <label htmlFor="city" className="form-label">
                  City
                </label>
                <input
                  type="text"
                  id="city"
                  name="city"
                  className="form-input"
                  value={formData.city}
                  onChange={handleChange}
                  placeholder="e.g. Dallas"
                />
              </div>

              <div className="form-group">
                <label htmlFor="state" className="form-label">
                  State
                </label>
                <input
                  type="text"
                  id="state"
                  name="state"
                  className="form-input"
                  value={formData.state}
                  onChange={handleChange}
                  placeholder="e.g. TX"
                />
              </div>

              <div className="form-group">
                <label htmlFor="zipCode" className="form-label">
                  Zip Code
                </label>
                <input
                  type="text"
                  id="zipCode"
                  name="zipCode"
                  className="form-input"
                  value={formData.zipCode}
                  onChange={handleChange}
                  placeholder="e.g. 75201"
                />
              </div>

              <div className="form-group">
                <label htmlFor="country" className="form-label">
                  Country
                </label>
                <input
                  type="text"
                  id="country"
                  name="country"
                  className="form-input"
                  value={formData.country}
                  onChange={handleChange}
                  placeholder="e.g. United States"
                />
              </div>
            </div>
          </div>

          {/* Business Preferences */}
          <div style={{ marginBottom: '2rem' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#1F2937', marginBottom: '1rem' }}>
              Business Preferences
            </h3>
            
            <div className="form-group">
              <label htmlFor="preferredSkills" className="form-label">
                Preferred Skills
              </label>
              <input
                type="text"
                id="preferredSkills"
                name="preferredSkills"
                className="form-input"
                value={formData.preferredSkills}
                onChange={handleChange}
                placeholder="e.g. Java, React, AWS, Python, Data Science"
              />
              <div style={{ fontSize: '0.875rem', color: '#6B7280', marginTop: '0.25rem' }}>
                Comma-separated list of skills this vendor typically looks for
              </div>
            </div>

            <div className="form-grid">
              <div className="form-group">
                <label htmlFor="rateRangeMin" className="form-label">
                  Minimum Rate ($/hr)
                </label>
                <input
                  type="number"
                  id="rateRangeMin"
                  name="rateRangeMin"
                  className="form-input"
                  value={formData.rateRangeMin}
                  onChange={handleChange}
                  min="0"
                  step="0.01"
                  placeholder="e.g. 70"
                />
                {errors.rateRangeMin && (
                  <div style={{ color: '#DC2626', fontSize: '0.875rem', marginTop: '0.25rem' }}>
                    {errors.rateRangeMin}
                  </div>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="rateRangeMax" className="form-label">
                  Maximum Rate ($/hr)
                </label>
                <input
                  type="number"
                  id="rateRangeMax"
                  name="rateRangeMax"
                  className="form-input"
                  value={formData.rateRangeMax}
                  onChange={handleChange}
                  min="0"
                  step="0.01"
                  placeholder="e.g. 120"
                />
                {errors.rateRangeMax && (
                  <div style={{ color: '#DC2626', fontSize: '0.875rem', marginTop: '0.25rem' }}>
                    {errors.rateRangeMax}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Performance Tracking */}
          <div style={{ marginBottom: '2rem' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#1F2937', marginBottom: '1rem' }}>
              Performance Tracking
            </h3>
            <div className="form-grid">
              <div className="form-group">
                <label htmlFor="totalSubmissions" className="form-label">
                  Total Submissions
                </label>
                <input
                  type="number"
                  id="totalSubmissions"
                  name="totalSubmissions"
                  className="form-input"
                  value={formData.totalSubmissions}
                  onChange={handleChange}
                  min="0"
                  placeholder="0"
                />
                <div style={{ fontSize: '0.875rem', color: '#6B7280', marginTop: '0.25rem' }}>
                  Total number of candidate submissions from this vendor
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="successfulPlacements" className="form-label">
                  Successful Placements
                </label>
                <input
                  type="number"
                  id="successfulPlacements"
                  name="successfulPlacements"
                  className="form-input"
                  value={formData.successfulPlacements}
                  onChange={handleChange}
                  min="0"
                  placeholder="0"
                />
                <div style={{ fontSize: '0.875rem', color: '#6B7280', marginTop: '0.25rem' }}>
                  Number of successful placements from this vendor
                </div>
              </div>
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
              placeholder="Additional notes about this vendor, their requirements, preferences, or communication history..."
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
                : (isEdit ? 'Update Vendor' : 'Create Vendor')
              }
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default VendorForm;