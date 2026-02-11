// src/components/auth/ProtectedRoute.tsx
import { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

export const ProtectedRoute = ({ children }: { children: ReactNode }) => {
  const { user, loading, hasProfile } = useAuth();
  const location = useLocation();

  if (loading) return <div style={{ padding: '2rem' }}>Verifying Patient Session...</div>;
  if (!user) return <Navigate to="/" replace />;

  // FIX: Changed "s" to "/items"
  if (hasProfile && location.pathname === '/onboarding') {
    return <Navigate to="/items" replace />;
  }

  // Ensure this also matches the plural path
  if (hasProfile === false && location.pathname === '/items') {
    return <Navigate to="/onboarding" replace />;
  }

  return <>{children}</>;
};