import React, { Suspense, lazy, useEffect } from 'react';
import { Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import Auth from './pages/Auth';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { setUserData } from './redux/userSlice';
import ProtectedRoute from './components/ProtectedRoute';

// Lazy-loaded pages (reduces initial bundle by ~300KB gzipped)
const Dashboard = lazy(() => import('./pages/Dashboard'));
const CareerCoach = lazy(() => import('./pages/CareerCoach'));
const InterviewPage = lazy(() => import('./pages/InterviewPage'));
const InterviewHistory = lazy(() => import('./pages/InterviewHistory'));
const Pricing = lazy(() => import('./pages/Pricing'));
const InterviewReport = lazy(() => import('./pages/InterviewReport'));

export const ServerUrl = import.meta.env.VITE_SERVER_URL || 'http://localhost:8000';

// Shared loading fallback for lazy-loaded routes
const PageLoader = () => (
  <div className="min-h-screen bg-[#0B0F17] flex items-center justify-center">
    <div className="text-center space-y-4">
      <div className="w-10 h-10 border-4 border-emerald-500/30 border-t-emerald-500 rounded-full animate-spin mx-auto" />
      <p className="text-gray-400 text-sm animate-pulse">Loading PrepPilot AI...</p>
    </div>
  </div>
);

function App() {
  const dispatch = useDispatch();
  useEffect(() => {
    const getUser = async () => {
      try {
        const result = await axios.get(`${ServerUrl}/api/user/current-user`, { withCredentials: true });
        dispatch(setUserData(result.data));
      } catch (error) {
        console.log(error);
        dispatch(setUserData(null));
      }
    };
    getUser();
  }, [dispatch]);

  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/career-coach" element={<ProtectedRoute><CareerCoach /></ProtectedRoute>} />
        <Route path="/interview" element={<ProtectedRoute><InterviewPage /></ProtectedRoute>} />
        <Route path="/history" element={<ProtectedRoute><InterviewHistory /></ProtectedRoute>} />
        <Route path="/pricing" element={<Pricing />} />
        <Route path="/report/:id" element={<ProtectedRoute><InterviewReport /></ProtectedRoute>} />
        <Route path="*" element={<Home />} />
      </Routes>
    </Suspense>
  );
}

export default App;
