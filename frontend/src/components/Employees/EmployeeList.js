import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { employeesAPI } from '../../services/api';
import toast from 'react-hot-toast';

const EmployeeList = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    fullName: '',
    role: '',
    email: '',
  });

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      setLoading(true);
      const response = await employeesAPI.getAll();
      setEmployees(response.data);
    } catch (error) {
      toast.error('Failed to load employees');
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
    fetchEmployees();
  };

  const handleClearFilters = () => {
    setFilters({
      fullName: '',
      role: '',
      email: '',
    });
    setTimeout(() => fetchEmployees(), 100);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this employee?')) {
      try {
        await employeesAPI.delete(id);
        toast.success('Employee deleted successfully');
        fetchEmployees();
      } catch (error) {
        toast.error('Failed to delete employee');
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

  const filteredEmployees = employees.filter(employee => {
    return (!filters.fullName || employee.fullName.toLowerCase().includes(filters.fullName.toLowerCase())) &&
           (!filters.role || employee.role === filters.role) &&
           (!filters.email || employee.email.toLowerCase().includes(filters.email.toLowerCase()));
  });

  return (
    <div>
      <div style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: 'bold', color: '#1F2937', marginBottom: '0.5rem' }}>
            Consultancy Employees
          </h1>
          <p style={{ color: '#6B7280', marginBottom: '0.25rem' }}>
            Manage your consultancy team members
          </p>
          <p style={{ color: '#6B7280', fontSize: '0.875rem' }}>
            {filteredEmployees.length} employees found
          </p>
        </div>
        <Link to="/employees/new" className="btn-primary" style={{ textDecoration: 'none' }}>
          ➕ Add Employee
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

      {/* Employees Display */}
      <div style={{ 
        background: 'white', 
        borderRadius: '12px', 
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
        overflow: 'hidden'
      }}>
        {loading ? (
          <div style={{ padding: '3rem', textAlign: 'center' }}>
            Loading employees...
          </div>
        ) : filteredEmployees.length > 0 ? (
          <div style={{ padding: '1.5rem' }}>
            {filteredEmployees.map((employee) => (
              <div 
                key={employee.id}
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
                      👤 {employee.fullName}
                    </h3>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '0.5rem', marginBottom: '1rem' }}>
                      <div><strong>Email:</strong> {employee.email}</div>
                      <div><strong>Phone:</strong> {employee.phoneNumber || 'N/A'}</div>
                      <div><strong>Role:</strong> {getRoleDisplayName(employee.role)}</div>
                      <div><strong>Joined:</strong> {new Date(employee.createdAt).toLocaleDateString()}</div>
                    </div>
                    
                    {employee.notes && (
                      <div style={{ fontSize: '0.875rem', color: '#6B7280', fontStyle: 'italic' }}>
                        Notes: {employee.notes}
                      </div>
                    )}
                  </div>
                  
                  <div style={{ display: 'flex', gap: '0.5rem', flexDirection: 'column', minWidth: '120px' }}>
                    <span className={getRoleBadgeClass(employee.role)} style={{ textAlign: 'center' }}>
                      {getRoleDisplayName(employee.role)}
                    </span>
                    
                    <div style={{ display: 'flex', gap: '0.25rem', flexWrap: 'wrap' }}>
                      <Link
                        to={`/employees/edit/${employee.id}`}
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
                        onClick={() => handleDelete(employee.id)}
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
            <p style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>No employees found</p>
            <Link 
              to="/employees/new" 
              style={{ 
                color: '#3B82F6', 
                textDecoration: 'none',
                fontWeight: '500'
              }}
            >
              Add your first employee
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default EmployeeList;