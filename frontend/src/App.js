import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Login from './components/Auth/Login';
import Layout from './components/Layout/Layout';
import Dashboard from './components/Dashboard/Dashboard';
import CandidateList from './components/Candidates/CandidateList';
import CandidateForm from './components/Candidates/CandidateForm';
import VendorList from './components/Vendors/VendorList';
import VendorForm from './components/Vendors/VendorForm';
import Analytics from './components/Analytics/Analytics';
import { isAuthenticated } from './utils/auth';
import './App.css';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  return isAuthenticated() ? children : <Navigate to="/login" />;
};

// Public Route Component (redirect if already authenticated)
const PublicRoute = ({ children }) => {
  return !isAuthenticated() ? children : <Navigate to="/dashboard" />;
};

function App() {
  return (
    <Router>
      <div className="App">
        <Toaster 
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#363636',
              color: '#fff',
            },
          }}
        />
        
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          } />
          
          {/* Protected Routes */}
          <Route path="/" element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }>
            <Route index element={<Navigate to="/dashboard" />} />
            <Route path="dashboard" element={<Dashboard />} />
            
            {/* Candidate Routes */}
            <Route path="bench-profiles" element={<CandidateList filterStatus="BENCH" pageTitle="Bench Profiles" />} />
            <Route path="working-candidates" element={<CandidateList filterStatus="WORKING" pageTitle="Working Candidates" />} />
            <Route path="candidates" element={<CandidateList pageTitle="All Candidates" />} />
            <Route path="candidates/new" element={<CandidateForm />} />
            <Route path="candidates/edit/:id" element={<CandidateForm />} />
            
            {/* Vendor Routes */}
            <Route path="vendors" element={<VendorList />} />
            <Route path="vendors/new" element={<VendorForm />} />
            <Route path="vendors/edit/:id" element={<VendorForm />} />
            
            {/* Analytics */}
            <Route path="analytics" element={<Analytics />} />
          </Route>
          
          {/* Catch all route */}
          <Route path="*" element={<Navigate to="/dashboard" />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;