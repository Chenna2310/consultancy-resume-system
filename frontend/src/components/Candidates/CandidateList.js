import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { candidatesAPI } from '../../services/api';
import toast from 'react-hot-toast';

const CandidateList = ({ filterStatus, pageTitle }) => {
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    fullName: '',
    visaStatus: '',
    primarySkill: '',
    state: '',
    status: filterStatus || '', // Auto-set status filter based on page
    assignedConsultantName: '',
  });
  const [pagination, setPagination] = useState({
    page: 0,
    size: 10,
    totalElements: 0,
    totalPages: 0,
  });

  const [searchParams] = useSearchParams();

  useEffect(() => {
    fetchCandidates();
  }, [filterStatus]);

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

      const response = await candidatesAPI.search(params);
      setCandidates(response.data.content);
      setPagination({
        page: response.data.number,
        size: response.data.size,
        totalElements: response.data.totalElements,
        totalPages: response.data.totalPages,
      });
    } catch (error) {
      toast.error('Failed to load candidates');
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
      status: filterStatus || '', // Keep the page-specific status filter
      assignedConsultantName: '',
    });
    setTimeout(() => fetchCandidates(0), 100);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this candidate?')) {
      try {
        await candidatesAPI.delete(id);
        toast.success('Candidate deleted successfully');
        fetchCandidates(pagination.page);
      } catch (error) {
        toast.error('Failed to delete candidate');
      }
    }
  };

  const handleDownloadResume = async (id, filename) => {
    try {
      const response = await candidatesAPI.downloadResume(id);
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

  const getStatusBadgeClass = (candidateStatus) => {
    const statusMap = {
      'BENCH': 'status-bench',
      'WORKING': 'status-working',
      'INTERVIEW': 'status-interview',
      'PLACED': 'status-placed',
    };
    return `status-badge ${statusMap[candidateStatus] || 'status-bench'}`;
  };

  const getPageTitle = () => {
    return pageTitle || 'All Candidates';
  };

  const getPageDescription = () => {
    if (filterStatus === 'BENCH') {
      return 'Candidates available for placement opportunities';
    } else if (filterStatus === 'WORKING') {
      return 'Candidates currently working on client projects';
    } else {
      return 'Complete candidate database with all statuses';
    }
  };

  // Enhanced candidate card for specific status pages
  const renderEnhancedCard = (candidate) => {
    if (filterStatus === 'BENCH') {
      return (
        <div style={{ 
          background: 'white', 
          borderRadius: '12px', 
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          padding: '1.5rem',
          marginBottom: '1rem',
          border: '1px solid #E5E7EB'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div style={{ flex: 1 }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#1F2937', marginBottom: '0.5rem' }}>
                {candidate.fullName}
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.5rem', marginBottom: '1rem' }}>
                <div><strong>Skill:</strong> {candidate.primarySkill}</div>
                <div><strong>Experience:</strong> {candidate.experienceYears} years</div>
                <div><strong>Location:</strong> {candidate.location}</div>
                <div><strong>Visa:</strong> {candidate.visaStatus}</div>
                <div><strong>Consultant:</strong> {candidate.assignedConsultantName || 'Unassigned'}</div>
                <div><strong>Submissions:</strong> {candidate.totalSubmissions || 0}</div>
              </div>
              {candidate.targetRate && (
                <div style={{ marginBottom: '0.5rem' }}>
                  <strong>Target Rate:</strong> ${candidate.targetRate}/hr
                </div>
              )}
              {candidate.consultantNotes && (
                <div style={{ fontSize: '0.875rem', color: '#6B7280', fontStyle: 'italic' }}>
                  Notes: {candidate.consultantNotes}
                </div>
              )}
            </div>
            <div style={{ display: 'flex', gap: '0.5rem', flexDirection: 'column', minWidth: '120px' }}>
              <span className={getStatusBadgeClass(candidate.status)} style={{ textAlign: 'center' }}>
                {candidate.status}
              </span>
              <div style={{ display: 'flex', gap: '0.25rem', flexWrap: 'wrap' }}>
                {candidate.resumeFilename && (
                  <button
                    onClick={() => handleDownloadResume(candidate.id, candidate.resumeFilename)}
                    style={{
                      background: '#10B981',
                      color: 'white',
                      border: 'none',
                      padding: '0.25rem 0.5rem',
                      borderRadius: '4px',
                      fontSize: '0.75rem',
                      cursor: 'pointer'
                    }}
                  >
                    📄 Resume
                  </button>
                )}
                <Link
                  to={`/candidates/edit/${candidate.id}`}
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
              </div>
            </div>
          </div>
        </div>
      );
    } else if (filterStatus === 'WORKING') {
      return (
        <div style={{ 
          background: 'white', 
          borderRadius: '12px', 
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          padding: '1.5rem',
          marginBottom: '1rem',
          border: '1px solid #E5E7EB'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div style={{ flex: 1 }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#1F2937', marginBottom: '0.5rem' }}>
                {candidate.fullName}
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.5rem', marginBottom: '1rem' }}>
                <div><strong>Client:</strong> {candidate.clientCompany || 'Not specified'}</div>
                <div><strong>Project:</strong> {candidate.projectName || 'Not specified'}</div>
                <div><strong>Rate:</strong> ${candidate.hourlyRate || 'N/A'}/hr</div>
                <div><strong>Start Date:</strong> {candidate.startDate ? new Date(candidate.startDate).toLocaleDateString() : 'N/A'}</div>
                <div><strong>End Date:</strong> {candidate.endDate ? new Date(candidate.endDate).toLocaleDateString() : 'Ongoing'}</div>
                <div><strong>Skill:</strong> {candidate.primarySkill}</div>
              </div>
              {candidate.consultantNotes && (
                <div style={{ fontSize: '0.875rem', color: '#6B7280', fontStyle: 'italic' }}>
                  Notes: {candidate.consultantNotes}
                </div>
              )}
            </div>
            <div style={{ display: 'flex', gap: '0.5rem', flexDirection: 'column', minWidth: '120px' }}>
              <span className={getStatusBadgeClass(candidate.status)} style={{ textAlign: 'center' }}>
                {candidate.status}
              </span>
              <div style={{ display: 'flex', gap: '0.25rem', flexWrap: 'wrap' }}>
                <Link
                  to={`/candidates/edit/${candidate.id}`}
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
              </div>
            </div>
          </div>
        </div>
      );
    }
    
    // Default table row for "All Candidates"
    return null;
  };

  return (
    <div>
      <div style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: 'bold', color: '#1F2937', marginBottom: '0.5rem' }}>
            {getPageTitle()}
          </h1>
          <p style={{ color: '#6B7280', marginBottom: '0.25rem' }}>
            {getPageDescription()}
          </p>
          <p style={{ color: '#6B7280', fontSize: '0.875rem' }}>
            {pagination.totalElements} candidates found
          </p>
        </div>
        <Link to="/candidates/new" className="btn-primary" style={{ textDecoration: 'none' }}>
          ➕ Add Candidate
        </Link>
      </div>

      {/* Filters - Only show relevant filters */}
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
          {!filterStatus && (
            <div className="form-group">
              <label className="form-label">Status</label>
              <select
                name="status"
                className="form-input"
                value={filters.status}
                onChange={handleFilterChange}
              >
                <option value="">All Status</option>
                <option value="BENCH">Bench</option>
                <option value="WORKING">Working</option>
                <option value="INTERVIEW">In Interview</option>
                <option value="PLACED">Placed</option>
              </select>
            </div>
          )}
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
            Loading candidates...
          </div>
        ) : candidates.length > 0 ? (
          <>
            {/* Enhanced Cards for Bench/Working */}
            {(filterStatus === 'BENCH' || filterStatus === 'WORKING') ? (
              <div style={{ padding: '1.5rem' }}>
                {candidates.map((candidate) => renderEnhancedCard(candidate))}
              </div>
            ) : (
              /* Table View for All Candidates */
              <div className="table-container">
                <table className="table">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Primary Skill</th>
                      <th>Experience</th>
                      <th>Location</th>
                      <th>Visa Status</th>
                      <th>Status</th>
                      <th>Consultant</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {candidates.map((candidate) => (
                      <tr key={candidate.id}>
                        <td style={{ fontWeight: '600' }}>{candidate.fullName}</td>
                        <td>{candidate.primarySkill}</td>
                        <td>{candidate.experienceYears} years</td>
                        <td>{candidate.location}</td>
                        <td>
                          <span style={{ 
                            padding: '0.25rem 0.5rem', 
                            backgroundColor: '#F3F4F6', 
                            borderRadius: '4px',
                            fontSize: '0.875rem'
                          }}>
                            {candidate.visaStatus}
                          </span>
                        </td>
                        <td>
                          <span className={getStatusBadgeClass(candidate.status)}>
                            {candidate.status}
                          </span>
                        </td>
                        <td style={{ fontSize: '0.875rem', color: '#6B7280' }}>
                          {candidate.assignedConsultantName || 'Unassigned'}
                        </td>
                        <td>
                          <div style={{ display: 'flex', gap: '0.5rem' }}>
                            {candidate.resumeFilename && (
                              <button
                                onClick={() => handleDownloadResume(candidate.id, candidate.resumeFilename)}
                                style={{
                                  background: '#10B981',
                                  color: 'white',
                                  border: 'none',
                                  padding: '0.25rem 0.5rem',
                                  borderRadius: '4px',
                                  fontSize: '0.75rem',
                                  cursor: 'pointer'
                                }}
                              >
                                📄
                              </button>
                            )}
                            <Link
                              to={`/candidates/edit/${candidate.id}`}
                              style={{
                                background: '#3B82F6',
                                color: 'white',
                                border: 'none',
                                padding: '0.25rem 0.5rem',
                                borderRadius: '4px',
                                fontSize: '0.75rem',
                                textDecoration: 'none'
                              }}
                            >
                              ✏️
                            </Link>
                            <button
                              onClick={() => handleDelete(candidate.id)}
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
                              🗑️
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </>
        ) : (
          <div style={{ padding: '3rem', textAlign: 'center', color: '#6B7280' }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>
              {filterStatus === 'BENCH' ? '👥' : filterStatus === 'WORKING' ? '💼' : '📋'}
            </div>
            <p style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>
              No {filterStatus ? filterStatus.toLowerCase() : ''} candidates found
            </p>
            <Link 
              to="/candidates/new" 
              style={{ 
                color: '#3B82F6', 
                textDecoration: 'none',
                fontWeight: '500'
              }}
            >
              Add your first candidate
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

export default CandidateList;