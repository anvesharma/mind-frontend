import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Analytics } from '@vercel/analytics/react';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Assessment from './pages/Assessment';
import Results from './pages/Results';
import PersonalResults from './pages/PersonalResults';
import PersonalResultsPreview from './pages/PersonalResultsPreview';
import GetRated from './pages/GetRated';
import FriendRating from './pages/FriendRating';
import PeerResults from './pages/PeerResults';
import PaymentSuccess from './pages/PaymentSuccess';
import Reports from './pages/Reports';
import GuestEntry from './pages/GuestEntry';

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
        <Route path="/w" element={<GuestEntry />} />
        <Route path="/discover" element={<Login mode="personal" />} />
        <Route path="/assessment" element={<ProtectedRoute><Assessment /></ProtectedRoute>} />
        <Route path="/results/:rateeId" element={<ProtectedRoute><Results /></ProtectedRoute>} />
        <Route path="/peer-results/:rateeId" element={<PeerResults />} />
        <Route path="/personal-results/:rateeId" element={<ProtectedRoute><PersonalResults /></ProtectedRoute>} />
        <Route path="/results-preview" element={<ProtectedRoute><PersonalResultsPreview /></ProtectedRoute>} />
        <Route path="/get-rated" element={<ProtectedRoute><GetRated /></ProtectedRoute>} />
        <Route path="/rate/:token" element={<FriendRating />} />
        <Route path="/payment-success" element={<ProtectedRoute><PaymentSuccess /></ProtectedRoute>} />
        <Route path="/reports" element={<ProtectedRoute><Reports /></ProtectedRoute>} />
      </Routes>
      <Analytics />
    </BrowserRouter>
  );
}

export default App;
