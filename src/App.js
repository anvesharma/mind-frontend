import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Assessment from './pages/Assessment';
import Results from './pages/Results';
import PersonalResults from './pages/PersonalResults';
import PersonalResultsPreview from './pages/PersonalResultsPreview';
import Reports from './pages/Reports';

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  return token ? children : <Navigate to="/login" replace />;
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/discover" element={<Login mode="personal" />} />
        <Route path="/assessment" element={<ProtectedRoute><Assessment /></ProtectedRoute>} />
        <Route path="/results/:rateeId" element={<ProtectedRoute><Results /></ProtectedRoute>} />
        <Route path="/results-preview" element={<ProtectedRoute><PersonalResultsPreview /></ProtectedRoute>} />
        <Route path="/personal-results/:rateeId" element={<ProtectedRoute><PersonalResults /></ProtectedRoute>} />
        <Route path="/reports" element={<ProtectedRoute><Reports /></ProtectedRoute>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
