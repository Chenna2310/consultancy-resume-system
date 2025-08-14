import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';

const Sidebar = () => {
  const location = useLocation();

  const navItems = [{ path: '/dashboard', label: 'Dashboard', icon: '📊' },
    { path: '/bench-candidates', label: 'Bench Profiles', icon: '👥' },
    { path: '/working-candidates', label: 'Working Candidates', icon: '💼' },
    { path: '/employees', label: 'Consultancy Employees', icon: '👤' },
    { path: '/vendors', label: 'Vendor Management', icon: '🏢' },
    { path: '/analytics', label: 'Analytics', icon: '📈' },
  ];

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <h2 className="sidebar-title">ConsultancyPro</h2>
        <p style={{ color: '#9CA3AF', fontSize: '0.875rem', marginTop: '0.5rem' }}>
          Professional Resume Management
        </p>
      </div>
      
      <nav className="sidebar-nav">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => 
              `nav-item ${isActive || location.pathname === item.path ? 'active' : ''}`
            }
            style={{ textDecoration: 'none' }}
          >
            <span style={{ marginRight: '0.75rem', fontSize: '1.1rem' }}>{item.icon}</span>
            {item.label}
          </NavLink>
        ))}
      </nav>

      <div style={{ 
        padding: '1.5rem', 
        marginTop: 'auto', 
        borderTop: '1px solid #374151',
        fontSize: '0.875rem',
        color: '#9CA3AF'
      }}>
        <p>© 2024 ConsultancyPro</p>
        <p>Enterprise Edition</p>
      </div>
    </aside>
  );
};

export default Sidebar;