import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { vendorsAPI } from '../../services/api';
import toast from 'react-hot-toast';

const VendorList = () => {
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    companyName: '',
    contactName: '',
    status: '',
  });
  const [pagination, setPagination] = useState({
    page: 0,
    size: 10,
    totalElements: 0,
    totalPages: 0,
  });

  useEffect(() => {
    fetchVendors();
  }, []);

  const fetchVendors = async (page = 0) => {
    try {
      setLoading(true);
      const params = {
        page,
        size: pagination.size,
        ...filters,
      };

      // Remove empty filters
      Object.keys(params).forEach(key => {
        if (params[key] === '' || params[key] === null) {
          delete params[key];
        }
      });

      const response = await vendorsAPI.search(params);
      setVendors(response.data.content);
      setPagination({
        page: response.data.number,
        size: response.data.size,
        totalElements: response.data.totalElements,
        totalPages: response.data.totalPages,
      });
    } catch (error) {
      toast.error('Failed to load vendors');
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value,
    });
  };

  const handleSearch = () => {
    fetchVendors(0);
  };

  const handleClearFilters = () => {
    setFilters({
      companyName: '',
      contactName: '',
      status: '',
    });
    setTimeout(() => fetchVendors(0), 100);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this vendor?')) {
      try {
        await vendorsAPI.delete(id);
        toast.success('Vendor deleted successfully');
        fetchVendors(pagination.page);
      } catch (error) {
        toast.error('Failed to delete vendor');
      }
    }
  };

  const getStatusBadgeClass = (status) => {
    const statusMap = {
      'ACTIVE': 'status-working',
      'INACTIVE': 'status-bench',
      'PREFERRED': 'status-placed',
    };
    return `status-badge ${statusMap[status] || 'status-bench'}`;
  };

  return (
    <div>
      <div style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: 'bold', color: '#1F2937', marginBottom: '0.5rem' }}>
            Vendor Management
          </h1>
          <p style={{ color: '#6B7280', marginBottom: '0.25rem' }}>
            Manage your client and vendor relationships
          </p>
          <p style={{ color: '#6B7280', fontSize: '0.875rem' }}>
            {pagination.totalElements} vendors found
          </p>
        </div>
        <Link to="/vendors/new" className="btn-primary" style={{ textDecoration: 'none' }}>
          ➕ Add Vendor
        </Link>
      </div>

      {/* Filters */}
      <div style={{ 
        background: 'white', 
        borderRadius: '12px', 
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
        padding: '1.5rem',
        marginBottom: '2rem'
      }}>
        <h3 style={{ marginBottom: '1rem', fontSize: '1.125rem', fontWeight: '600' }}>
          Search & Filter
        </h3>
        <div className="form-grid">
          <div className="form-group">
            <label className="form-label">Company Name</label>
            <input
              type="text"
              name="companyName"
              className="form-input"
              value={filters.companyName}
              onChange={handleFilterChange}
              placeholder="Search by company name..."
            />
          </div>
          <div className="form-group">
            <label className="form-label">Contact Name</label>
            <input
              type="text"
              name="contactName"
              className="form-input"
              value={filters.contactName}
              onChange={handleFilterChange}
              placeholder="Search by contact name..."
            />
          </div>
          <div className="form-group">
            <label className="form-label">Status</label>
            <select
              name="status"
              className="form-input"
              value={filters.status}
              onChange={handleFilterChange}
            >
              <option value="">All Status</option>
              <option value="ACTIVE">Active</option>
              <option value="INACTIVE">Inactive</option>
              <option value="PREFERRED">Preferred</option>
            </select>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
          <button onClick={handleSearch} className="btn-primary">
            🔍 Search
          </button>
          <button onClick={handleClearFilters} className="btn-secondary">
            Clear Filters
          </button>
        </div>
      </div>

      {/* Vendors Display */}
      <div style={{ 
        background: 'white', 
        borderRadius: '12px', 
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
        overflow: 'hidden'
      }}>
        {loading ? (
          <div style={{ padding: '3rem', textAlign: 'center' }}>
            Loading vendors...
          </div>
        ) : vendors.length > 0 ? (
          <div style={{ padding: '1.5rem' }}>
            {vendors.map((vendor) => (
              <div 
                key={vendor.id}
                style={{ 
                  background: 'white', 
                  borderRadius: '12px', 
                  boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                  padding: '1.5rem',
                  marginBottom: '1rem',
                  border: '1px solid #E5E7EB'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div style={{ flex: 1 }}>
                    <h3 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#1F2937', marginBottom: '0.5rem' }}>
                      🏢 {vendor.companyName}
                    </h3>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '0.5rem', marginBottom: '1rem' }}>
                      <div><strong>Contact:</strong> {vendor.primaryContactName}</div>
                      <div><strong>Email:</strong> {vendor.primaryContactEmail}</div>
                      <div><strong>Phone:</strong> {vendor.primaryContactPhone || 'N/A'}</div>
                      <div><strong>Location:</strong> {vendor.city && vendor.state ? `${vendor.city}, ${vendor.state}` : 'N/A'}</div>
                      <div><strong>Submissions:</strong> {vendor.totalSubmissions || 0}</div>
                      <div><strong>Placements:</strong> {vendor.successfulPlacements || 0}</div>
                    </div>
                    
                    {vendor.preferredSkills && (
                      <div style={{ marginBottom: '0.5rem' }}>
                        <strong>Preferred Skills:</strong> {vendor.preferredSkills}
                      </div>
                    )}
                    
                    {vendor.rateRangeDisplay && vendor.rateRangeDisplay !== "Not specified" && (
                      <div style={{ marginBottom: '0.5rem' }}>
                        <strong>Rate Range:</strong> {vendor.rateRangeDisplay}
                      </div>
                    )}
                    
                    {vendor.notes && (
                      <div style={{ fontSize: '0.875rem', color: '#6B7280', fontStyle: 'italic' }}>
                        Notes: {vendor.notes}
                      </div>
                    )}
                  </div>
                  
                  <div style={{ display: 'flex', gap: '0.5rem', flexDirection: 'column', minWidth: '120px' }}>
                    <span className={getStatusBadgeClass(vendor.status)} style={{ textAlign: 'center' }}>
                      {vendor.status}
                    </span>
                    
                    {vendor.totalSubmissions > 0 && (
                      <div style={{ 
                        background: '#F3F4F6', 
                        padding: '0.25rem 0.5rem', 
                        borderRadius: '4px', 
                        textAlign: 'center',
                        fontSize: '0.75rem'
                      }}>
                        {vendor.successRate ? vendor.successRate.toFixed(1) : 0}% Success
                      </div>
                    )}
                    
                    <div style={{ display: 'flex', gap: '0.25rem', flexWrap: 'wrap' }}>
                      <Link
                        to={`/vendors/edit/${vendor.id}`}
                        style={{
                          background: '#3B82F6',
                          color: 'white',
                          border: 'none',
                          padding: '0.25rem 0.5rem',
                          borderRadius: '4px',
                          fontSize: '0.75rem',
                          textDecoration: 'none',
                          display: 'inline-block'
                        }}
                      >
                        ✏️ Edit
                      </Link>
                      <button
                        onClick={() => handleDelete(vendor.id)}
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
                        🗑️ Delete
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div style={{ padding: '3rem', textAlign: 'center', color: '#6B7280' }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🏢</div>
            <p style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>No vendors found</p>
            <Link 
              to="/vendors/new" 
              style={{ 
                color: '#3B82F6', 
                textDecoration: 'none',
                fontWeight: '500'
              }}
            >
              Add your first vendor
            </Link>
          </div>
        )}

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div style={{ 
            padding: '1rem 2rem', 
            borderTop: '1px solid #E5E7EB',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <div style={{ color: '#6B7280', fontSize: '0.875rem' }}>
              Showing {pagination.page * pagination.size + 1} to {Math.min((pagination.page + 1) * pagination.size, pagination.totalElements)} of {pagination.totalElements} results
            </div>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button
                onClick={() => fetchVendors(pagination.page - 1)}
                disabled={pagination.page === 0}
                className="btn-secondary"
                style={{ fontSize: '0.875rem', padding: '0.5rem 1rem' }}
              >
                Previous
              </button>
              <button
                onClick={() => fetchVendors(pagination.page + 1)}
                disabled={pagination.page >= pagination.totalPages - 1}
                className="btn-secondary"
                style={{ fontSize: '0.875rem', padding: '0.5rem 1rem' }}
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default VendorList;