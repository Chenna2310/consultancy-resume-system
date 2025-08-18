import React from 'react';
import { getUser, logout } from '../../utils/auth';

const Header = () => {
  const user = getUser();

  const handleLogout = () => {
    logout();
  };

  return (
    <header className="header">
      <div className="header-title">
        Jupiter IT Solutions - Professional Dashboard
      </div>
      <div className="header-actions">
        <div className="user-info">
          <span>Welcome, {user?.firstName} {user?.lastName}</span>
        </div>
        <button 
          onClick={handleLogout}
          className="btn-logout"
        >
          Logout
        </button>
      </div>
    </header>
  );
};

export default Header;