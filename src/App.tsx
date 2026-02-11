import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { LandingPage } from './pages/LandingPage';
import { ItemPage } from './pages/ItemPage';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { OnboardingPage } from './pages/OnboardingPage';
import { SuccessPage } from './pages/SuccessPage';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          {/* Public Route - The Front Door */}
          <Route path="/" element={<LandingPage />} />

          {/* This is the "Portal" page. 
              Must be plural '/items' to match your redirects and fix the black screen. 
          */}
          <Route 
            path="/items" 
            element={
              <ProtectedRoute>
                <ItemPage />
              </ProtectedRoute>
            } 
          />

          <Route 
            path="/onboarding" 
            element={
              <ProtectedRoute>
                <OnboardingPage />
              </ProtectedRoute>
            } 
          />

          {/* Success Route - Handles the Xaman redirect via return_url */}
          <Route 
            path="/success" 
            element={
              <ProtectedRoute>
                <SuccessPage />
              </ProtectedRoute>
            } 
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;