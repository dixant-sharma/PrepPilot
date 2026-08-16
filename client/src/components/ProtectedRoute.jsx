import React from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

/**
 * ProtectedRoute — Redirects unauthenticated users to the home page.
 * Wraps around route elements that require a logged-in session.
 */
function ProtectedRoute({ children }) {
  const { userData } = useSelector((state) => state.user);

  if (userData === null) {
    return <Navigate to="/" replace />;
  }

  // While user data is still loading (undefined), show nothing to avoid flash
  if (userData === undefined) {
    return null;
  }

  return children;
}

export default ProtectedRoute;
