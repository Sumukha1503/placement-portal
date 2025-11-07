import React from 'react';
import { Routes, Route } from 'react-router-dom';
import CompanyList from '../components/company/CompanyList';
import CompanyDetails from '../components/company/CompanyDetails';
import ProtectedRoute from '../components/common/ProtectedRoute';

const CompanyPages = () => {
  return (
    <Routes>
      <Route 
        path="/" 
        element={
          <ProtectedRoute>
            <CompanyList />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/:id" 
        element={
          <ProtectedRoute>
            <CompanyDetails />
          </ProtectedRoute>
        } 
      />
    </Routes>
  );
};

export default CompanyPages;