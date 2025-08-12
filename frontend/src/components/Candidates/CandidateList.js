import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { candidatesAPI, benchCandidatesAPI, workingCandidatesAPI } from '../../services/api';
import toast from 'react-hot-toast';

const CandidateList = ({ pageTitle = "All Candidates" }) => {
  const [allCandidates, setAllCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    fullName: '',
    visaStatus: '',
    primarySkill: '',
    state: '',
  });

  useEffect(() => {
    fetchAllCandidates();
  }, []);

  const fetchAllCandidates = async () => {
    try {
      setLoading(true);
      
      // Fetch from all three sources
      const [originalCandidates, benchCandidates, workingCandidates] = await Promise.all([
        candidatesAPI.getAll().catch(() => ({ data: [] })),
        benchCandidatesAPI.getAll().catch(() => ({ data: { content: [] } })),
        workingCandidatesAPI.getAll().catch(() => ({ data: { content: [] } }))
      ]);

      // Combine all candidates with source indicators
      const combined = [];

      // Add original candidates
      if (originalCandidates.data && Array.isArray(originalCandidates.data)) {
        originalCandidates.data.forEach(candidate => {
          combined.push({
            ...candidate,
            source: 'original',
            type: candidate.status || 'UNKNOWN'
          });
        });
      }

      // Add bench candidates
      const benchData = benchCandidates.data.content || benchCandidates.data || [];
      if (Array.isArray(benchData)) {
        benchData.forEach(candidate => {
          combined.push({
            ...candidate,
            source: 'bench',
            type: 'BENCH',
            status: 'BENCH'
          });
        });
      }

      // Add working candidates
      const workingData = workingCandidates.data.content || workingCandidates.data || [];
      if (Array.isArray(workingData)) {
        workingData.forEach(candidate => {
          combined.push({
            ...candidate,
            source: 'working',
            type: 'WORKING',
            status: 'WORKING',
            primarySkill: candidate.jobRole || candidate.primarySkill,
            location: candidate.workingLocation || `${candidate.city}, ${candidate.state}`
          });
        });
      }

      setAllCandidates(combined);
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

  const getFilteredCandidates = () => {
    return allCandidates.filter(candidate => {
      return (!filters.fullName || candidate.fullName?.toLowerCase().includes(filters.fullName.toLowerCase())) &&
             (!filters.visaStatus || candidate.visaStatus === filters.visaStatus) &&
             (!filters.primarySkill || candidate.primarySkill?.toLowerCase().includes(filters.primarySkill.toLowerCase())) &&
             (!filters.state || candidate.state?.toLowerCase().includes(filters.state.toLowerCase()));
    });
  };

  const handleClearFilters = () => {
    setFilters({
      fullName: '',
      visaStatus: '',
      primarySkill: '',
      state: '',
    });
  };

  const getStatusBadgeClass = (status) => {
    const statusMap = {
      'BENCH': 'status-bench',
      'WORKING': 'status-working',
      'INTERVIEW': 'status-interview',
      'PLACED': 'status-placed',
    };
    return `status-badge ${statusMap[status] || 'status-bench'}`;
  };

  const getEditLink = (candidate) => {
    if (candidate.source === 'bench') {
      return `/bench-candidates/edit/${candidate.id}`;
    } else if (candidate.source === 'working') {
      return `/working-candidates/edit/${candidate.id}`;
    } else {
      return `/candidates/edit/${candidate.id}`;
    }
  };

  const filteredCandidates = getFilteredCandidates();

  return (
    <div>
      <div style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: 'bold', color: '#1F2937', marginBottom: '0.5rem' }}>
            {pageTitle}
          </h1>
          <p style={{ color: '#6B7280', marginBottom: '0.25rem' }}>
            Complete candidate database with all statuses
          </p>
          <p style={{ color: '#6B7280', fontSize: '0.875rem' }}>
            {filteredCandidates.length} candidates found
          </p>
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
        </div>
        <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
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
            Loading all candidates...
          </div>
        ) : filteredCandidates.length > 0 ? (
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
                  <th>Source</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredCandidates.map((candidate, index) => (
                  <tr key={`${candidate.source}-${candidate.id}-${index}`}>
                    <td style={{ fontWeight: '600' }}>{candidate.fullName}</td>
                    <td>{candidate.primarySkill || candidate.jobRole}</td>
                    <td>{candidate.experienceYears} years</td>
                    <td>{candidate.location || `${candidate.city}, ${candidate.state}` || candidate.workingLocation}</td>
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
                      <span className={getStatusBadgeClass(candidate.status || candidate.type)}>
                        {candidate.status || candidate.type}
                      </span>
                    </td>
                    <td>
                      <span style={{ 
                        padding: '0.25rem 0.5rem', 
                        backgroundColor: candidate.source === 'bench' ? '#DBEAFE' : candidate.source === 'working' ? '#D1FAE5' : '#F3F4F6', 
                        color: candidate.source === 'bench' ? '#1E40AF' : candidate.source === 'working' ? '#065F46' : '#374151',
                        borderRadius: '4px',
                        fontSize: '0.75rem',
                        fontWeight: '500'
                      }}>
                        {candidate.source === 'bench' ? 'Bench' : candidate.source === 'working' ? 'Working' : 'Original'}
                      </span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <Link
                          to={getEditLink(candidate)}
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
                          ✏️ Edit
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div style={{ padding: '3rem', textAlign: 'center', color: '#6B7280' }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📋</div>
            <p style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>No candidates found</p>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginTop: '1rem' }}>
              <Link 
                to="/bench-candidates/new" 
                className="btn-primary"
                style={{ textDecoration: 'none' }}
              >
                Add Bench Candidate
              </Link>
              <Link 
                to="/working-candidates/new" 
                className="btn-secondary"
                style={{ textDecoration: 'none' }}
              >
                Add Working Candidate
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CandidateList;