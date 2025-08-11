import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { dashboardAPI } from '../../services/api';
import toast from 'react-hot-toast';

const Dashboard = () => {
  const [stats, setStats] = useState({
    benchProfiles: 0,
    workingCandidates: 0,
    totalCandidates: 0,
    totalVendors: 0,
    monthlyRevenue: 0,
    recentCandidates: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      const response = await dashboardAPI.getStats();
      setStats(response.data);
    } catch (error) {
      toast.error('Failed to load dashboard stats');
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      title: 'Bench Profiles',
      value: stats.benchProfiles,
      color: '#3B82F6',
      bgColor: '#DBEAFE',
      link: '/bench-profiles',
      description: 'Available for placement'
    },
    {
      title: 'Working Candidates',
      value: stats.workingCandidates,
      color: '#10B981',
      bgColor: '#D1FAE5',
      link: '/working-candidates',
      description: 'Currently employed'
    },
    {
      title: 'Total Candidates',
      value: stats.totalCandidates,
      color: '#6B7280',
      bgColor: '#F3F4F6',
      link: '/candidates',
      description: 'Complete database'
    },
  ];

  const getStatusBadgeClass = (status) => {
    const statusMap = {
      'BENCH': 'status-bench',
      'WORKING': 'status-working',
      'INTERVIEW': 'status-interview',
      'PLACED': 'status-placed',
    };
    return `status-badge ${statusMap[status] || 'status-bench'}`;
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '400px' }}>
        <div style={{ fontSize: '1.1rem', color: '#6B7280' }}>Loading dashboard...</div>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#1F2937', marginBottom: '0.5rem' }}>
          Welcome to ConsultancyPro
        </h1>
        <p style={{ color: '#6B7280', fontSize: '1.1rem' }}>
          Your complete candidate management dashboard
        </p>
      </div>

      {/* Main Stats Cards */}
      <div className="dashboard-grid" style={{ marginBottom: '3rem' }}>
        {statCards.map((card, index) => (
          <Link 
            key={index} 
            to={card.link} 
            style={{ textDecoration: 'none', color: 'inherit' }}
          >
            <div 
              className="stat-card"
              style={{ 
                borderLeft: `5px solid ${card.color}`,
                backgroundColor: 'white',
                border: `1px solid ${card.color}30`,
                transition: 'all 0.3s ease',
                cursor: 'pointer'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-4px)';
                e.currentTarget.style.boxShadow = `0 10px 25px -5px ${card.color}40`;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1)';
              }}
            >
              <div className="stat-number" style={{ color: card.color, fontSize: '3rem', marginBottom: '0.5rem' }}>
                {card.value}
              </div>
              <div style={{ fontSize: '1.25rem', fontWeight: '600', color: '#1F2937', marginBottom: '0.25rem' }}>
                {card.title}
              </div>
              <div style={{ fontSize: '0.875rem', color: '#6B7280' }}>
                {card.description}
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Quick Stats Row */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
        gap: '1rem', 
        marginBottom: '2rem' 
      }}>
        <div style={{ 
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', 
          color: 'white', 
          padding: '1.5rem', 
          borderRadius: '12px',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{stats.totalVendors || 0}</div>
          <div style={{ fontSize: '0.875rem', opacity: 0.9 }}>Active Vendors</div>
        </div>
        
        <div style={{ 
          background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)', 
          color: 'white', 
          padding: '1.5rem', 
          borderRadius: '12px',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>
            ${stats.monthlyRevenue ? (stats.monthlyRevenue / 1000).toFixed(0) + 'K' : '0'}
          </div>
          <div style={{ fontSize: '0.875rem', opacity: 0.9 }}>Monthly Revenue</div>
        </div>

        <div style={{ 
          background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)', 
          color: 'white', 
          padding: '1.5rem', 
          borderRadius: '12px',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>
            {stats.benchProfiles > 0 ? Math.round((stats.workingCandidates / stats.benchProfiles) * 100) : 0}%
          </div>
          <div style={{ fontSize: '0.875rem', opacity: 0.9 }}>Placement Rate</div>
        </div>
      </div>

      {/* Recent Candidates */}
      <div className="recent-candidates">
        <div className="section-header">
          <h2 className="section-title">Recent Candidates</h2>
          <Link 
            to="/candidates/new" 
            style={{ 
              color: '#3B82F6', 
              textDecoration: 'none',
              fontWeight: '500',
              fontSize: '0.875rem'
            }}
          >
            + Add New Candidate
          </Link>
        </div>
        
        {stats.recentCandidates && stats.recentCandidates.length > 0 ? (
          <div className="table-container">
            <table className="table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Primary Skill</th>
                  <th>Experience</th>
                  <th>Location</th>
                  <th>Consultant</th>
                  <th>Status</th>
                  <th>Added</th>
                </tr>
              </thead>
              <tbody>
                {stats.recentCandidates.slice(0, 8).map((candidate) => (
                  <tr key={candidate.id}>
                    <td style={{ fontWeight: '600' }}>
                      <Link 
                        to={`/candidates/edit/${candidate.id}`}
                        style={{ color: '#3B82F6', textDecoration: 'none' }}
                      >
                        {candidate.fullName}
                      </Link>
                    </td>
                    <td>{candidate.primarySkill}</td>
                    <td>{candidate.experienceYears} years</td>
                    <td>{candidate.location}</td>
                    <td style={{ color: '#6B7280', fontSize: '0.875rem' }}>
                      {candidate.assignedConsultantName || 'Unassigned'}
                    </td>
                    <td>
                      <span className={getStatusBadgeClass(candidate.status)}>
                        {candidate.status}
                      </span>
                    </td>
                    <td style={{ color: '#6B7280', fontSize: '0.875rem' }}>
                      {new Date(candidate.createdAt).toLocaleDateString()}
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
            <Link 
              to="/candidates/new" 
              style={{ 
                color: '#3B82F6', 
                textDecoration: 'none',
                fontWeight: '500'
              }}
            >
              Add your first candidate to get started
            </Link>
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div style={{ marginTop: '2rem' }}>
        <div style={{ 
          background: 'white', 
          borderRadius: '12px', 
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
          padding: '2rem'
        }}>
          <h3 style={{ marginBottom: '1.5rem', fontSize: '1.25rem', fontWeight: '600' }}>
            Quick Actions
          </h3>
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <Link to="/candidates/new" className="btn-primary" style={{ textDecoration: 'none', width: 'auto' }}>
              ➕ Add New Candidate
            </Link>
            <Link to="/bench-profiles" className="btn-secondary" style={{ textDecoration: 'none' }}>
              👥 View Bench Profiles
            </Link>
            <Link to="/vendors/new" className="btn-secondary" style={{ textDecoration: 'none' }}>
              🏢 Add Vendor
            </Link>
            <Link to="/analytics" className="btn-secondary" style={{ textDecoration: 'none' }}>
              📈 View Analytics
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;