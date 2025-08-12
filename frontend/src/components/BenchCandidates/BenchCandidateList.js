import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { benchCandidatesAPI } from '../../services/api';
import toast from 'react-hot-toast';

const BenchCandidateList = () => {
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    fullName: '',
    visaStatus: '',
    primarySkill: '',
    state: '',
    assignedConsultantName: '',
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
      state: '',
      assignedConsultantName: '',
    });
    setTimeout(() => fetchCandidates(0), 100);
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
        <Link to="/bench-candidates/new" className="btn-primary" style={{ textDecoration: 'none' }}>
          ➕ Add Bench Candidate
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
            <label className="form-label">Primary Skill</label>
            <input
              type="text"
              name="primarySkill"
              className="form-input"
              value={filters.primarySkill}
              onChange={handleFilterChange}
              placeholder="e.g. Java, React..."
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
            <label className="form-label">State</label>
            <input
              type="text"
              name="state"
              className="form-input"
              value={filters.state}
              onChange={handleFilterChange}
              placeholder="e.g. CA, NY..."
            />
          </div>
          <div className="form-group">
            <label className="form-label">Consultant</label>
            <input
              type="text"
              name="assignedConsultantName"
              className="form-input"
              value={filters.assignedConsultantName}
              onChange={handleFilterChange}
              placeholder="Assigned consultant..."
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