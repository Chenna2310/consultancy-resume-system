import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { employeesAPI } from '../../services/api';
import toast from 'react-hot-toast';

const ConsultantList = () => {
  const [consultants, setConsultants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    fullName: '',
    role: '',
    email: '',
  });

  useEffect(() => {
    fetchConsultants();
  }, []);

  const fetchConsultants = async () => {
    try {
      setLoading(true);
      const response = await employeesAPI.getAll();
      setConsultants(response.data);
    } catch (error) {
      toast.error('Failed to load consultants');
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
    fetchConsultants();
  };

  const handleClearFilters = () => {
    setFilters({
      fullName: '',
      role: '',
      email: '',
    });
    setTimeout(() => fetchConsultants(), 100);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this consultant?')) {
      try {
        await employeesAPI.delete(id);
        toast.success('Consultant deleted successfully');
        fetchConsultants();
      } catch (error) {
        toast.error('Failed to delete consultant');
      }
    }
  };

  const getRoleBadgeClass = (role) => {
    const roleMap = {
      'US_IT_RECRUITER': 'status-working',
      'ACCOUNT_MANAGER': 'status-placed',
      'MARKETING': 'status-interview',
      'ADMIN': 'status-bench',
    };
    return `status-badge ${roleMap[role] || 'status-bench'}`;
  };

  const getRoleDisplayName = (role) => {
    const roleMap = {
      'US_IT_RECRUITER': 'US IT Recruiter',
      'ACCOUNT_MANAGER': 'Account Manager',
      'MARKETING': 'Marketing',
      'ADMIN': 'Admin',
    };
    return roleMap[role] || role;
  };

  const filteredConsultants = consultants.filter(consultant => {
    return (!filters.fullName || consultant.fullName.toLowerCase().includes(filters.fullName.toLowerCase())) &&
           (!filters.role || consultant.role === filters.role) &&
           (!filters.email || consultant.email.toLowerCase().includes(filters.email.toLowerCase()));
  });

  return (
    <div>
      <div style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: 'bold', color: '#1F2937', marginBottom: '0.5rem' }}>
            Consultancy Team
          </h1>
          <p style={{ color: '#6B7280', marginBottom: '0.25rem' }}>
            Manage your consultancy team members
          </p>
          <p style={{ color: '#6B7280', fontSize: '0.875rem' }}>
            {filteredConsultants.length} consultants found
          </p>
        </div>
        <Link to="/consultants/new" className="btn-primary" style={{ textDecoration: 'none' }}>
          ➕ Add Consultant
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
            <label className="form-label">Name</label>
            <input
              type="text"
              name="fullName"
              className="form-input"
              value={filters.fullName}
              onChange={handleFilterChange}
              placeholder="Search by name..."
            />
          </div>
          <div className="form-group">
            <label className="form-label">Role</label>
            <select
              name="role"
              className="form-input"
              value={filters.role}
              onChange={handleFilterChange}
            >
              <option value="">All Roles</option>
              <option value="US_IT_RECRUITER">US IT Recruiter</option>
              <option value="ACCOUNT_MANAGER">Account Manager</option>
              <option value="MARKETING">Marketing</option>
              <option value="ADMIN">Admin</option>
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Email</label>
            <input
              type="text"
              name="email"
              className="form-input"
              value={filters.email}
              onChange={handleFilterChange}
              placeholder="Search by email..."
            />
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

      {/* Consultants Display */}
      <div style={{ 
        background: 'white', 
        borderRadius: '12px', 
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
        overflow: 'hidden'
      }}>
        {loading ? (
          <div style={{ padding: '3rem', textAlign: 'center' }}>
            Loading consultants...
          </div>
        ) : filteredConsultants.length > 0 ? (
          <div style={{ padding: '1.5rem' }}>
            {filteredConsultants.map((consultant) => (
              <div 
                key={consultant.id}
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
                      👤 {consultant.fullName}
                    </h3>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '0.5rem', marginBottom: '1rem' }}>
                      <div><strong>Email:</strong> {consultant.email}</div>
                      <div><strong>Phone:</strong> {consultant.phoneNumber || 'N/A'}</div>
                      <div><strong>Role:</strong> {getRoleDisplayName(consultant.role)}</div>
                      <div><strong>Joined:</strong> {new Date(consultant.createdAt).toLocaleDateString()}</div>
                    </div>
                    
                    {consultant.notes && (
                      <div style={{ fontSize: '0.875rem', color: '#6B7280', fontStyle: 'italic' }}>
                        Notes: {consultant.notes}
                      </div>
                    )}
                  </div>
                  
                  <div style={{ display: 'flex', gap: '0.5rem', flexDirection: 'column', minWidth: '120px' }}>
                    <span className={getRoleBadgeClass(consultant.role)} style={{ textAlign: 'center' }}>
                      {getRoleDisplayName(consultant.role)}
                    </span>
                    
                    <div style={{ display: 'flex', gap: '0.25rem', flexWrap: 'wrap' }}>
                      <Link
                        to={`/consultants/edit/${consultant.id}`}
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
                        onClick={() => handleDelete(consultant.id)}
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
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>👥</div>
            <p style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>No consultants found</p>
            <Link 
              to="/consultants/new" 
              style={{ 
                color: '#3B82F6', 
                textDecoration: 'none',
                fontWeight: '500'
              }}
            >
              Add your first consultant
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default ConsultantList;