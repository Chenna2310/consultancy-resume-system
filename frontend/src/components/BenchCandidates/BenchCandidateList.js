import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { benchCandidatesAPI } from '../../services/api';
import toast from 'react-hot-toast';
import './Modal.css';

const BenchCandidateList = () => {
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingAll, setDeletingAll] = useState(false);
  const [filters, setFilters] = useState({
    fullName: '',
    visaStatus: '',
    primarySkill: '',
    state: ''
  });
  const [showFilters, setShowFilters] = useState(false);
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

      const response = await benchCandidatesAPI.search(params);
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
      toast.error('Failed to load bench candidates');
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
      primarySkill: '',
      state: ''
    });
    setTimeout(() => fetchCandidates(0), 100);
  };

  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this bench candidate?')) {
      try {
        await benchCandidatesAPI.delete(id);
        toast.success('Bench candidate deleted successfully');
        fetchCandidates(pagination.page);
      } catch (error) {
        toast.error('Failed to delete bench candidate');
      }
    }
  };

  const handleDeleteAll = async () => {
    const confirmMessage = `Are you sure you want to delete ALL ${pagination.totalElements} bench candidates? This action cannot be undone.`;
    
    if (window.confirm(confirmMessage)) {
      const doubleConfirm = window.confirm('This will permanently delete all bench candidates. Are you absolutely sure?');
      
      if (doubleConfirm) {
        setDeletingAll(true);
        try {
          // Get all candidates first
          const allCandidatesResponse = await benchCandidatesAPI.getAll({ size: 1000 });
          const allCandidates = allCandidatesResponse.data.content || allCandidatesResponse.data;
          
          // Delete each candidate
          const deletePromises = allCandidates.map(candidate => 
            benchCandidatesAPI.delete(candidate.id)
          );
          
          await Promise.all(deletePromises);
          
          toast.success(`Successfully deleted all ${allCandidates.length} bench candidates`);
          fetchCandidates(0);
        } catch (error) {
          toast.error('Failed to delete all bench candidates');
          console.error('Error deleting all candidates:', error);
        } finally {
          setDeletingAll(false);
        }
      }
    }
  };

  const handleDownloadResume = async (id, filename) => {
    try {
      const response = await benchCandidatesAPI.downloadResume(id);
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', filename || `resume-${id}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      toast.error('Failed to download resume');
    }
  };

  return (
    <div>
      <div style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: 'bold', color: '#1F2937', marginBottom: '0.5rem' }}>
            Bench Profiles
          </h1>
          <p style={{ color: '#6B7280', marginBottom: '0.25rem' }}>
            Candidates available for placement opportunities
          </p>
          <p style={{ color: '#6B7280', fontSize: '0.875rem' }}>
            {Array.isArray(candidates) ? candidates.length : pagination.totalElements} candidates found
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
          <Link to="/bench-candidates/new" className="btn-primary" style={{ textDecoration: 'none' }}>
            ➕ Add Bench Candidate
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
                <label className="form-label" style={{ marginBottom: '0.25rem', display: 'block' }}>Primary Skill</label>
                <input
                  type="text"
                  name="primarySkill"
                  className="form-input"
                  value={filters.primarySkill}
                  onChange={handleFilterChange}
                  placeholder="e.g. Java, React..."
                  style={{ padding: '0.5rem' }}
                />
              </div>
              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label" style={{ marginBottom: '0.25rem', display: 'block' }}>Visa Status</label>
                <select
                  name="visaStatus"
                  className="form-input"
                  value={filters.visaStatus}
                  onChange={handleFilterChange}
                  style={{ padding: '0.5rem' }}
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
              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label" style={{ marginBottom: '0.25rem', display: 'block' }}>State</label>
                <input
                  type="text"
                  name="state"
                  className="form-input"
                  value={filters.state}
                  onChange={handleFilterChange}
                  placeholder="e.g. CA, NY..."
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

      {/* Candidates Display */}
      <div style={{ 
        background: 'white', 
        borderRadius: '12px', 
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
        overflow: 'hidden'
      }}>
        {loading ? (
          <div style={{ padding: '3rem', textAlign: 'center' }}>
            Loading bench candidates...
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
                      <Link 
                        to={`/bench-candidates/detail/${candidate.id}`}
                        style={{ color: '#1F2937', textDecoration: 'none' }}
                      >
                        {candidate.fullName}
                      </Link>
                    </h3>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.5rem', marginBottom: '1rem' }}>
                      <div><strong>Consultant:</strong> {candidate.assignedConsultantName || 'Unassigned'}</div>
                      <div><strong>Skill:</strong> {candidate.primarySkill}</div>
                      <div><strong>Experience:</strong> {candidate.experienceYears} years</div>
                      <div><strong>Location:</strong> {candidate.city}, {candidate.state}</div>
                      <div><strong>Visa:</strong> {candidate.visaStatus}</div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '0.5rem', flexDirection: 'column', minWidth: '120px' }}>
                    <Link
                      to={`/bench-candidates/detail/${candidate.id}`}
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
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>👥</div>
            <p style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>No bench candidates found</p>
            <Link 
              to="/bench-candidates/new" 
              style={{ 
                color: '#3B82F6', 
                textDecoration: 'none',
                fontWeight: '500'
              }}
            >
              Add your first bench candidate
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

export default BenchCandidateList;