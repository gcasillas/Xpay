// src/pages/LandingPage.tsx
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export const LandingPage = () => {
  const { login, user, loading, hasProfile } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user && hasProfile !== null) {
      navigate(hasProfile ? '/items' : '/onboarding');
    }
  }, [user, hasProfile, navigate]);

  if (loading) return <div style={{ padding: '2rem' }}>Syncing Patient Data...</div>;

  return (
    <div className="landing-container" style={{ padding: '2rem', textAlign: 'center' }}>
      <h1>Xpay</h1>
      <p>Secure Healthcare Procurement</p>
      <button onClick={login}>Sign in with Google</button>
    </div>
  );
};