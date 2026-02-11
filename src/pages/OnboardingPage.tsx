// src/pages/OnboardingPage.tsx
import React, { useState } from 'react';
import { db } from '../firebase';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';

export const OnboardingPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  // Demographic state based on your procurement goals
  const [formData, setFormData] = useState({
    fullName: '',
    dateOfBirth: '',
    address: '',
    zipCode: '',
  });

// src/pages/OnboardingPage.tsx
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  if (!user || loading) return; // Prevent double clicks

  setLoading(true);
setLoading(true);
  try {
    await setDoc(doc(db, "patients", user.uid), {
      ...formData,
      uid: user.uid,
      email: user.email,
      createdAt: serverTimestamp(),
      profileComplete: true
    });

    // Option A: Force a small delay to let the Auth listener catch up
    setTimeout(() => {
      navigate('/items');
    }, 500);
    
  } catch (error) {
    console.error("Error saving record:", error);
    setLoading(false);
  }
};

  return (
    <div className="onboarding-container" style={{ maxWidth: '400px', margin: 'auto', padding: '2rem' }}>
      <h2>Secure Patient Onboarding</h2>
      <p>Please provide your demographics to authorize procurement.</p>
      
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <input 
          type="text" 
          placeholder="Full Legal Name" 
          required 
          onChange={(e) => setFormData({...formData, fullName: e.target.value})}
        />
        <input 
          type="date" 
          placeholder="Date of Birth" 
          required 
          onChange={(e) => setFormData({...formData, dateOfBirth: e.target.value})}
        />
        <input 
          type="text" 
          placeholder="Mailing Address" 
          required 
          onChange={(e) => setFormData({...formData, address: e.target.value})}
        />
        <button type="submit" disabled={loading}>
          {loading ? 'Processing...' : 'Complete Registration'}
        </button>
      </form>
    </div>
  );
};