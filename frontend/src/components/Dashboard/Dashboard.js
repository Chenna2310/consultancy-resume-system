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
    totalEmployees: 0,
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
      link: '/bench-candidates',
      description: 'Available for placement'
    },
    {
      title: 'Employees',
      value: stats.workingCandidates,
      color: '#10B981',
      bgColor: '#D1FAE5',
      link: '/employees',
      description: 'Currently employed'
    }
  ];

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
          Welcome to Jupiter IT Solutions LLC
        </h1>
        <p style={{ color: '#6B7280', fontSize: '1.1rem' }}>
          Professional IT Consulting & Talent Management Platform
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
          <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{stats.totalEmployees || 0}</div>
          <div style={{ fontSize: '0.875rem', opacity: 0.9 }}>Team Members</div>
        </div>

        <div style={{ 
          background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)', 
          color: 'white', 
          padding: '1.5rem', 
          borderRadius: '12px',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>
            {stats.benchProfiles > 0 ? Math.round((stats.workingCandidates / (stats.benchProfiles + stats.workingCandidates)) * 100) : 0}%
          </div>
          <div style={{ fontSize: '0.875rem', opacity: 0.9 }}>Placement Rate</div>
        </div>
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
            <Link to="/bench-candidates/new" className="btn-primary" style={{ textDecoration: 'none', width: 'auto' }}>
              ➕ Add Bench Candidate
            </Link>
            <Link to="/employees/new" className="btn-secondary" style={{ textDecoration: 'none' }}>
              💼 Add Employee
            </Link>
            <Link to="/consultants/new" className="btn-secondary" style={{ textDecoration: 'none' }}>
              👤 Add Consultant
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