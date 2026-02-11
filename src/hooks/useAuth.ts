// src/hooks/useAuth.ts
import { useState, useEffect } from 'react';
import { auth, db, googleProvider } from '../firebase';
import { signInWithPopup, signOut } from 'firebase/auth';
import { useAuthState } from 'react-firebase-hooks/auth';
import { doc, onSnapshot } from 'firebase/firestore'; // Switched getDoc for onSnapshot

export const useAuth = () => {
  const [user, loading] = useAuthState(auth);
  const [hasProfile, setHasProfile] = useState<boolean | null>(null);
  const [checkingProfile, setCheckingProfile] = useState(false);

  useEffect(() => {
    // If there's no user, reset profile state and do nothing
    if (!user) {
      setHasProfile(null);
      setCheckingProfile(false);
      return;
    }

    setCheckingProfile(true);

    // Create a "live" listener to the patient document
    const docRef = doc(db, "patients", user.uid);
    
    const unsubscribe = onSnapshot(
      docRef, 
      (docSnap) => {
        console.log("Firestore sync: Profile exists?", docSnap.exists());
        setHasProfile(docSnap.exists());
        setCheckingProfile(false);
      },
      (error) => {
        console.error("Firestore sync error:", error);
        setHasProfile(false);
        setCheckingProfile(false);
      }
    );

    // This is crucial: it stops the listener when the component unmounts 
    // or when the user changes/logs out
    return () => unsubscribe();
  }, [user]);

  return {
    user,
    loading: loading || checkingProfile,
    hasProfile,
    login: () => signInWithPopup(auth, googleProvider),
    logout: () => signOut(auth),
  };
};