import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { workingCandidatesAPI } from '../../services/api';
import toast from 'react-hot-toast';
import '../BenchCandidates/Modal.css';

const EmployeeList = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingAll, setDeletingAll] = useState(false);
  const [filters, setFilters] = useState({
    fullName: '',
    clientName: '',
    workingLocation: '',
    jobRole: ''
  });
  const [showFilters, setShowFilters] = useState(false);
  const [pagination, setPagination] = useState({
    page: 0,
    size: 10,
    totalElements: 0,
    totalPages: 0,
  });

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async (page = 0) => {
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

      const response = await workingCandidatesAPI.search(params);
      setEmployees(response.data.content || response.data);
      if (response.data.content) {
        setPagination({
          page: response.data.number,
          size: response.data.size,
          totalElements: response.data.totalElements,
          totalPages: response.data.totalPages,
        });
      }
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
    fetchEmployees(0);
  };

  const handleClearFilters = () => {
    setFilters({
      fullName: '',
      clientName: '',
      workingLocation: '',
      jobRole: ''
    });
    setTimeout(() => fetchEmployees(0), 100);
  };

  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this employee?')) {
      try {
        await workingCandidatesAPI.delete(id);
        toast.success('Employee deleted successfully');
        fetchEmployees(pagination.page);
      } catch (error) {
        toast.error('Failed to delete employee');
      }
    }
  };

  const handleDeleteAll = async () => {
    const confirmMessage = `Are you sure you want to delete ALL ${pagination.totalElements} employees? This action cannot be undone.`;
    
    if (window.confirm(confirmMessage)) {
      const doubleConfirm = window.confirm('This will permanently delete all employees. Are you absolutely sure?');
      
      if (doubleConfirm) {
        setDeletingAll(true);
        try {
          const allEmployeesResponse = await workingCandidatesAPI.getAll({ size: 1000 });
          const allEmployees = allEmployeesResponse.data.content || allEmployeesResponse.data;
          
          const deletePromises = allEmployees.map(employee => 
            workingCandidatesAPI.delete(employee.id)
          );
          
          await Promise.all(deletePromises);
          
          toast.success(`Successfully deleted all ${allEmployees.length} employees`);
          fetchEmployees(0);
        } catch (error) {
          toast.error('Failed to delete all employees');
          console.error('Error deleting all employees:', error);
        } finally {
          setDeletingAll(false);
        }
      }
    }
  };

  return (
    <div>
      <div style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: 'bold', color: '#1F2937', marginBottom: '0.5rem' }}>
            Employees
          </h1>
          <p style={{ color: '#6B7280', marginBottom: '0.25rem' }}>
            Employees currently working on client projects
          </p>
          <p style={{ color: '#6B7280', fontSize: '0.875rem' }}>
            {Array.isArray(employees) ? employees.length : pagination.totalElements} employees found
          </p>
        </div>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <button
            onClick={toggleFilters}
            style={{
              background: '#4F46E5',
              color: 'white',
              border: 'none',
              padding: '0.75rem 1rem',
              borderRadius: '8px',
              fontSize: '0.875rem',
              cursor: 'pointer'
            }}
          >
            🔍 Filter
          </button>
          {pagination.totalElements > 0 && (
            <button
              onClick={handleDeleteAll}
              disabled={deletingAll}
              style={{
                background: '#EF4444',
                color: 'white',
                border: 'none',
                padding: '0.75rem 1rem',
                borderRadius: '8px',
                fontSize: '0.875rem',
                cursor: deletingAll ? 'not-allowed' : 'pointer',
                opacity: deletingAll ? 0.6 : 1,
                textDecoration: 'none'
              }}
            >
              {deletingAll ? '🗑️ Deleting All...' : '🗑️ Delete All'}
            </button>
          )}
          <Link to="/employees/new" className="btn-primary" style={{ textDecoration: 'none' }}>
            ➕ Add Employee
          </Link>
        </div>
      </div>

      {/* Filter Modal */}
      {showFilters && (
        <div className="modal-backdrop" onClick={toggleFilters}>
          <div className="modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: '600px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h3 style={{ fontSize: '1.125rem', fontWeight: '600', margin: 0 }}>
                Search & Filter
              </h3>
              <button 
                onClick={toggleFilters}
                style={{ background: 'transparent', border: 'none', fontSize: '1.25rem', cursor: 'pointer' }}
              >
                ✕
              </button>
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.75rem' }}>
              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label" style={{ marginBottom: '0.25rem', display: 'block' }}>Name</label>
                <input
                  type="text"
                  name="fullName"
                  className="form-input"
                  value={filters.fullName}
                  onChange={handleFilterChange}
                  placeholder="Search by name..."
                  style={{ padding: '0.5rem' }}
                />
              </div>
              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label" style={{ marginBottom: '0.25rem', display: 'block' }}>Client</label>
                <input
                  type="text"
                  name="clientName"
                  className="form-input"
                  value={filters.clientName}
                  onChange={handleFilterChange}
                  placeholder="e.g. Google, Microsoft..."
                  style={{ padding: '0.5rem' }}
                />
              </div>
              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label" style={{ marginBottom: '0.25rem', display: 'block' }}>Location</label>
                <input
                  type="text"
                  name="workingLocation"
                  className="form-input"
                  value={filters.workingLocation}
                  onChange={handleFilterChange}
                  placeholder="e.g. Remote, New York..."
                  style={{ padding: '0.5rem' }}
                />
              </div>
              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label" style={{ marginBottom: '0.25rem', display: 'block' }}>Job Role</label>
                <input
                  type="text"
                  name="jobRole"
                  className="form-input"
                  value={filters.jobRole}
                  onChange={handleFilterChange}
                  placeholder="e.g. Senior Developer..."
                  style={{ padding: '0.5rem' }}
                />
              </div>
            </div>
            
            <div style={{ display: 'flex', gap: '1rem', marginTop: '1.25rem', justifyContent: 'flex-end' }}>
              <button onClick={handleClearFilters} className="btn-secondary" style={{ padding: '0.5rem 1rem' }}>
                Clear
              </button>
              <button 
                onClick={() => {
                  handleSearch();
                  toggleFilters();
                }} 
                className="btn-primary"
                style={{ padding: '0.5rem 1rem' }}
              >
                Apply Filters
              </button>
            </div>
          </div>
        </div>
      )}

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
        ) : employees.length > 0 ? (
          <div style={{ padding: '1.5rem' }}>
            {employees.map((employee) => (
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
                      <Link 
                        to={`/employees/detail/${employee.id}`}
                        style={{ color: '#1F2937', textDecoration: 'none' }}
                      >
                        {employee.fullName}
                      </Link>
                    </h3>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.5rem', marginBottom: '1rem' }}>
                      <div><strong>Client:</strong> {employee.clientName}</div>
                      <div><strong>Job Role:</strong> {employee.jobRole}</div>
                      <div><strong>Rate:</strong> ${employee.hourlyRate}/hr</div>
                      <div><strong>Duration:</strong> {employee.projectDuration}</div>
                      <div><strong>Location:</strong> {employee.workingLocation}</div>
                      <div><strong>Placed By:</strong> {employee.placedByName}</div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '0.5rem', flexDirection: 'column', minWidth: '120px' }}>
                    <Link
                      to={`/employees/detail/${employee.id}`}
                      style={{
                        background: '#10B981',
                        color: 'white',
                        border: 'none',
                        padding: '0.5rem 1rem',
                        borderRadius: '8px',
                        fontSize: '0.875rem',
                        textDecoration: 'none',
                        display: 'inline-block',
                        textAlign: 'center'
                      }}
                    >
                      More Details
                    </Link>
                    <button
                      onClick={() => handleDelete(employee.id)}
                      style={{
                        background: '#EF4444',
                        color: 'white',
                        border: 'none',
                        padding: '0.5rem 1rem',
                        borderRadius: '8px',
                        fontSize: '0.875rem',
                        cursor: 'pointer'
                      }}
                    >
                      🗑️ Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div style={{ padding: '3rem', textAlign: 'center', color: '#6B7280' }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>💼</div>
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
                onClick={() => fetchEmployees(pagination.page - 1)}
                disabled={pagination.page === 0}
                className="btn-secondary"
                style={{ fontSize: '0.875rem', padding: '0.5rem 1rem' }}
              >
                Previous
              </button>
              <button
                onClick={() => fetchEmployees(pagination.page + 1)}
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

export default EmployeeList;