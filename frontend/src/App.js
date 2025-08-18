import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Login from './components/Auth/Login';
import Layout from './components/Layout/Layout';
import Dashboard from './components/Dashboard/Dashboard';
import BenchCandidateList from './components/BenchCandidates/BenchCandidateList';
import BenchCandidateForm from './components/BenchCandidates/BenchCandidateForm';
import BenchCandidateDetail from './components/BenchCandidates/BenchCandidateDetail';
import EmployeeList from './components/Employees/EmployeeList';
import EmployeeForm from './components/Employees/EmployeeForm';
import EmployeeDetail from './components/Employees/EmployeeDetail';
import VendorList from './components/Vendors/VendorList';
import VendorForm from './components/Vendors/VendorForm';
import ConsultantList from './components/Consultants/ConsultantList';
import ConsultantForm from './components/Consultants/ConsultantForm';
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
            
            {/* Bench Candidate Routes */}
            <Route path="bench-candidates" element={<BenchCandidateList />} />
            <Route path="bench-candidates/new" element={<BenchCandidateForm />} />
            <Route path="bench-candidates/edit/:id" element={<BenchCandidateForm />} />
            <Route path="bench-candidates/detail/:id" element={<BenchCandidateDetail />} />
            
            {/* Employee Routes (renamed from Working Candidates) */}
            <Route path="employees" element={<EmployeeList />} />
            <Route path="employees/new" element={<EmployeeForm />} />
            <Route path="employees/edit/:id" element={<EmployeeForm />} />
            <Route path="employees/detail/:id" element={<EmployeeDetail />} />
            
            {/* Vendor Routes */}
            <Route path="vendors" element={<VendorList />} />
            <Route path="vendors/new" element={<VendorForm />} />
            <Route path="vendors/edit/:id" element={<VendorForm />} />
            
            {/* Consultant Routes (renamed from original Employees) */}
            <Route path="consultants" element={<ConsultantList />} />
            <Route path="consultants/new" element={<ConsultantForm />} />
            <Route path="consultants/edit/:id" element={<ConsultantForm />} />
            
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