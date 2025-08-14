import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { workingCandidatesAPI } from '../../services/api';
import toast from 'react-hot-toast';

const WorkingCandidateList = () => {
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingAll, setDeletingAll] = useState(false);
  const [filters, setFilters] = useState({
    fullName: '',
    visaStatus: '',
    jobRole: '',
    clientName: '',
    placedByName: '',
  });
  const [pagination, setPagination] = useState({
    page: 0,
    size: 10,
    totalElements: 0,
    totalPages: 0,
  });

  useEffect(() => {
    fetchCandidates();
  }, []);

  const fetchCandidates = async (page = 0) => {
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
      setCandidates(response.data.content || response.data);
      if (response.data.content) {
        setPagination({
          page: response.data.number,
          size: response.data.size,
          totalElements: response.data.totalElements,
          totalPages: response.data.totalPages,
        });
      }
    } catch (error) {
      toast.error('Failed to load working candidates');
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
    fetchCandidates(0);
  };

  const handleClearFilters = () => {
    setFilters({
      fullName: '',
      visaStatus: '',
      jobRole: '',
      clientName: '',
      placedByName: '',
    });
    setTimeout(() => fetchCandidates(0), 100);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this working candidate?')) {
      try {
        await workingCandidatesAPI.delete(id);
        toast.success('Working candidate deleted successfully');
        fetchCandidates(pagination.page);
      } catch (error) {
        toast.error('Failed to delete working candidate');
      }
    }
  };

  const handleDeleteAll = async () => {
    const confirmMessage = `Are you sure you want to delete ALL ${pagination.totalElements} working candidates? This action cannot be undone.`;
    
    if (window.confirm(confirmMessage)) {
      const doubleConfirm = window.confirm('This will permanently delete all working candidates. Are you absolutely sure?');
      
      if (doubleConfirm) {
        setDeletingAll(true);
        try {
          // Get all candidates first
          const allCandidatesResponse = await workingCandidatesAPI.getAll({ size: 1000 });
          const allCandidates = allCandidatesResponse.data.content || allCandidatesResponse.data;
          
          // Delete each candidate
          const deletePromises = allCandidates.map(candidate => 
            workingCandidatesAPI.delete(candidate.id)
          );
          
          await Promise.all(deletePromises);
          
          toast.success(`Successfully deleted all ${allCandidates.length} working candidates`);
          fetchCandidates(0);
        } catch (error) {
          toast.error('Failed to delete all working candidates');
          console.error('Error deleting all candidates:', error);
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
            Working Candidates
          </h1>
          <p style={{ color: '#6B7280', marginBottom: '0.25rem' }}>
            Candidates currently working on client projects
          </p>
          <p style={{ color: '#6B7280', fontSize: '0.875rem' }}>
            {Array.isArray(candidates) ? candidates.length : pagination.totalElements} candidates found
          </p>
        </div>
        <div style={{ display: 'flex', gap: '1rem' }}>
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
          <Link to="/working-candidates/new" className="btn-primary" style={{ textDecoration: 'none' }}>
            ➕ Add Working Candidate
          </Link>
        </div>
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
            <label className="form-label">Job Role</label>
            <input
              type="text"
              name="jobRole"
              className="form-input"
              value={filters.jobRole}
              onChange={handleFilterChange}
              placeholder="e.g. Senior Developer..."
            />
          </div>
          <div className="form-group">
            <label className="form-label">Client Name</label>
            <input
              type="text"
              name="clientName"
              className="form-input"
              value={filters.clientName}
              onChange={handleFilterChange}
              placeholder="e.g. Google, Microsoft..."
            />
          </div>
          <div className="form-group">
            <label className="form-label">Visa Status</label>
            <select
              name="visaStatus"
              className="form-input"
              value={filters.visaStatus}
              onChange={handleFilterChange}
            >
              <option value="">All Visa Status</option>
              <option value="H1B">H1B</option>
              <option value="OPT">OPT</option>
              <option value="GC">Green Card</option>
              <option value="CITIZEN">US Citizen</option>
              <option value="F1">F1</option>
              <option value="L1">L1</option>
              <option value="OTHER">Other</option>
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Placed By</label>
            <input
              type="text"
              name="placedByName"
              className="form-input"
              value={filters.placedByName}
              onChange={handleFilterChange}
              placeholder="Employee who placed..."
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

      {/* Candidates Display */}
      <div style={{ 
        background: 'white', 
        borderRadius: '12px', 
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
        overflow: 'hidden'
      }}>
        {loading ? (
          <div style={{ padding: '3rem', textAlign: 'center' }}>
            Loading working candidates...
          </div>
        ) : candidates.length > 0 ? (
          <div style={{ padding: '1.5rem' }}>
            {candidates.map((candidate) => (
              <div 
                key={candidate.id}
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
                      {candidate.fullName}
                    </h3>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.5rem', marginBottom: '1rem' }}>
                      <div><strong>Client:</strong> {candidate.clientName}</div>
                      <div><strong>Job Role:</strong> {candidate.jobRole}</div>
                      <div><strong>Rate:</strong> ${candidate.hourlyRate}/hr</div>
                      <div><strong>Duration:</strong> {candidate.projectDuration}</div>
                      <div><strong>Location:</strong> {candidate.workingLocation}</div>
                      <div><strong>Placed By:</strong> {candidate.placedByName}</div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '0.5rem', flexDirection: 'column', minWidth: '120px' }}>
                    <Link
                      to={`/working-candidates/edit/${candidate.id}`}
                      style={{
                        background: '#3B82F6',
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
                      Edit Details
                    </Link>
                    <button
                      onClick={() => handleDelete(candidate.id)}
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
            <p style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>No working candidates found</p>
            <Link 
              to="/working-candidates/new" 
              style={{ 
                color: '#3B82F6', 
                textDecoration: 'none',
                fontWeight: '500'
              }}
            >
              Add your first working candidate
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
                onClick={() => fetchCandidates(pagination.page - 1)}
                disabled={pagination.page === 0}
                className="btn-secondary"
                style={{ fontSize: '0.875rem', padding: '0.5rem 1rem' }}
              >
                Previous
              </button>
              <button
                onClick={() => fetchCandidates(pagination.page + 1)}
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

export default WorkingCandidateList;