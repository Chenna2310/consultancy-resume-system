import React, { useState, useEffect } from 'react';
import { analyticsAPI } from '../../services/api';
import toast from 'react-hot-toast';

const Analytics = () => {
  const [data, setData] = useState({
    overview: {},
    consultantPerformance: {},
    vendorAnalytics: {},
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      
      // Fetch all analytics data
      const [overview, consultants, vendors] = await Promise.all([
        analyticsAPI.getOverview(),
        analyticsAPI.getConsultantPerformance().catch(() => ({ data: {} })),
        analyticsAPI.getVendorAnalytics().catch(() => ({ data: {} })),
      ]);

      setData({
        overview: overview.data,
        consultantPerformance: consultants.data,
        vendorAnalytics: vendors.data,
      });
    } catch (error) {
      toast.error('Failed to load analytics data');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '400px' }}>
        <div style={{ fontSize: '1.1rem', color: '#6B7280' }}>Loading analytics...</div>
      </div>
    );
  }

  const { overview } = data;

  // Calculate metrics
  const placementRate = overview.totalCandidates > 0 
    ? ((overview.workingCandidates || 0) / overview.totalCandidates * 100).toFixed(1)
    : 0;

  const benchUtilization = overview.totalCandidates > 0 
    ? (((overview.workingCandidates || 0)) / (overview.totalCandidates || 0) * 100).toFixed(1)
    : 0;

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#1F2937', marginBottom: '0.5rem' }}>
          Analytics Dashboard
        </h1>
        <p style={{ color: '#6B7280', fontSize: '1.1rem' }}>
          Comprehensive business insights and performance metrics
        </p>
      </div>

      {/* Key Metrics Cards */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
        gap: '1.5rem', 
        marginBottom: '3rem' 
      }}>
        <div style={{ 
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', 
          color: 'white', 
          padding: '2rem', 
          borderRadius: '12px',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '2.5rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>
            {placementRate}%
          </div>
          <div style={{ fontSize: '1.1rem', opacity: 0.9 }}>Placement Rate</div>
          <div style={{ fontSize: '0.875rem', opacity: 0.7, marginTop: '0.25rem' }}>
            {overview.workingCandidates || 0} of {overview.totalCandidates || 0} candidates
          </div>
        </div>

        <div style={{ 
          background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)', 
          color: 'white', 
          padding: '2rem', 
          borderRadius: '12px',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '2.5rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>
            {overview.totalVendors || 0}
          </div>
          <div style={{ fontSize: '1.1rem', opacity: 0.9 }}>Active Vendors</div>
          <div style={{ fontSize: '0.875rem', opacity: 0.7, marginTop: '0.25rem' }}>
            Client relationships
          </div>
        </div>

        <div style={{ 
          background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)', 
          color: 'white', 
          padding: '2rem', 
          borderRadius: '12px',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '2.5rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>
            {overview.totalEmployees || 0}
          </div>
          <div style={{ fontSize: '1.1rem', opacity: 0.9 }}>Team Members</div>
          <div style={{ fontSize: '0.875rem', opacity: 0.7, marginTop: '0.25rem' }}>
            Consultancy staff
          </div>
        </div>

        <div style={{ 
          background: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)', 
          color: 'white', 
          padding: '2rem', 
          borderRadius: '12px',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '2.5rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>
            {benchUtilization}%
          </div>
          <div style={{ fontSize: '1.1rem', opacity: 0.9 }}>Placement Success</div>
          <div style={{ fontSize: '0.875rem', opacity: 0.7, marginTop: '0.25rem' }}>
            Working vs Total candidates
          </div>
        </div>
      </div>

      {/* Detailed Analytics Sections */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '2rem' }}>
        
        {/* Candidate Distribution */}
        <div style={{ 
          background: 'white', 
          borderRadius: '12px', 
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
          padding: '2rem'
        }}>
          <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '1.5rem', color: '#1F2937' }}>
            📊 Candidate Distribution
          </h3>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <div style={{ width: '12px', height: '12px', backgroundColor: '#3B82F6', borderRadius: '50%' }}></div>
                <span>Bench Profiles</span>
              </div>
              <div style={{ fontWeight: '600' }}>{overview.benchProfiles || 0}</div>
            </div>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <div style={{ width: '12px', height: '12px', backgroundColor: '#10B981', borderRadius: '50%' }}></div>
                <span>Working Candidates</span>
              </div>
              <div style={{ fontWeight: '600' }}>{overview.workingCandidates || 0}</div>
            </div>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <div style={{ width: '12px', height: '12px', backgroundColor: '#F59E0B', borderRadius: '50%' }}></div>
                <span>In Interview</span>
              </div>
              <div style={{ fontWeight: '600' }}>{overview.inInterview || 0}</div>
            </div>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <div style={{ width: '12px', height: '12px', backgroundColor: '#8B5CF6', borderRadius: '50%' }}></div>
                <span>Placed</span>
              </div>
              <div style={{ fontWeight: '600' }}>{overview.placed || 0}</div>
            </div>
          </div>

          <div style={{ 
            marginTop: '1.5rem', 
            paddingTop: '1.5rem', 
            borderTop: '1px solid #E5E7EB',
            display: 'flex',
            justifyContent: 'space-between',
            fontWeight: '600'
          }}>
            <span>Total Candidates</span>
            <span>{overview.totalCandidates || 0}</span>
          </div>
        </div>

        {/* Business Insights */}
        <div style={{ 
          background: 'white', 
          borderRadius: '12px', 
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
          padding: '2rem'
        }}>
          <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '1.5rem', color: '#1F2937' }}>
            💡 Business Insights
          </h3>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div style={{ 
              padding: '1rem', 
              backgroundColor: '#F0F9FF', 
              borderRadius: '8px',
              borderLeft: '4px solid #3B82F6'
            }}>
              <div style={{ fontWeight: '600', color: '#1F2937', marginBottom: '0.25rem' }}>
                Placement Performance
              </div>
              <div style={{ fontSize: '0.875rem', color: '#6B7280' }}>
                {placementRate >= 70 ? 'Excellent' : placementRate >= 50 ? 'Good' : 'Needs Improvement'} placement rate at {placementRate}%
              </div>
            </div>

            <div style={{ 
              padding: '1rem', 
              backgroundColor: '#F0FDF4', 
              borderRadius: '8px',
              borderLeft: '4px solid #10B981'
            }}>
              <div style={{ fontWeight: '600', color: '#1F2937', marginBottom: '0.25rem' }}>
                Growth Opportunity
              </div>
              <div style={{ fontSize: '0.875rem', color: '#6B7280' }}>
                {overview.benchProfiles || 0} bench candidates represent potential placement opportunities
              </div>
            </div>

            <div style={{ 
              padding: '1rem', 
              backgroundColor: '#FFFBEB', 
              borderRadius: '8px',
              borderLeft: '4px solid #F59E0B'
            }}>
              <div style={{ fontWeight: '600', color: '#1F2937', marginBottom: '0.25rem' }}>
                Vendor Relationships
              </div>
              <div style={{ fontSize: '0.875rem', color: '#6B7280' }}>
                {overview.totalVendors || 0} active vendor relationships for placement opportunities
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div style={{ 
          background: 'white', 
          borderRadius: '12px', 
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
          padding: '2rem'
        }}>
          <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '1.5rem', color: '#1F2937' }}>
            🚀 Recommended Actions
          </h3>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {(overview.benchProfiles || 0) > 0 && (
              <div style={{ 
                padding: '1rem', 
                backgroundColor: '#EFF6FF', 
                borderRadius: '8px',
                cursor: 'pointer'
              }}>
                <div style={{ fontWeight: '600', color: '#1F2937', marginBottom: '0.25rem' }}>
                  Focus on Bench Placements
                </div>
                <div style={{ fontSize: '0.875rem', color: '#6B7280' }}>
                  {overview.benchProfiles} candidates ready for placement
                </div>
              </div>
            )}

            <div style={{ 
              padding: '1rem', 
              backgroundColor: '#F0FDF4', 
              borderRadius: '8px',
              cursor: 'pointer'
            }}>
              <div style={{ fontWeight: '600', color: '#1F2937', marginBottom: '0.25rem' }}>
                Expand Vendor Network
              </div>
              <div style={{ fontSize: '0.875rem', color: '#6B7280' }}>
                Add more vendors to increase placement opportunities
              </div>
            </div>

            <div style={{ 
              padding: '1rem', 
              backgroundColor: '#FEF2F2', 
              borderRadius: '8px',
              cursor: 'pointer'
            }}>
              <div style={{ fontWeight: '600', color: '#1F2937', marginBottom: '0.25rem' }}>
                Team Performance Review
              </div>
              <div style={{ fontSize: '0.875rem', color: '#6B7280' }}>
                Analyze individual consultant metrics and provide feedback
              </div>
            </div>
          </div>
        </div>

        {/* Team Statistics */}
        <div style={{ 
          background: 'white', 
          borderRadius: '12px', 
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
          padding: '2rem'
        }}>
          <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '1.5rem', color: '#1F2937' }}>
            👥 Team Overview
          </h3>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ color: '#6B7280' }}>Total Employees</span>
              <span style={{ fontWeight: '600', fontSize: '1.1rem' }}>
                {overview.totalEmployees || 0}
              </span>
            </div>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ color: '#6B7280' }}>Active Vendors</span>
              <span style={{ fontWeight: '600', fontSize: '1.1rem' }}>
                {overview.totalVendors || 0}
              </span>
            </div>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ color: '#6B7280' }}>Candidates per Employee</span>
              <span style={{ fontWeight: '600', fontSize: '1.1rem' }}>
                {overview.totalEmployees > 0 ? Math.round((overview.totalCandidates || 0) / overview.totalEmployees) : 0}
              </span>
            </div>

            <div style={{ 
              marginTop: '1rem', 
              paddingTop: '1rem', 
              borderTop: '1px solid #E5E7EB' 
            }}>
              <div style={{ fontSize: '0.875rem', color: '#6B7280' }}>
                Performance metrics based on current team size and candidate portfolio
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;