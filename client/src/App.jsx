/**
 * This is a product of Scalovate Systems Solutions.
 * All rights reserved.
 */

import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { onAuthStateChange } from './lib/firebase';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';

// Import pages
import LandingPage from './pages/LandingPage';
import Features from './pages/Features';
import Pricing from './pages/Pricing';
import About from './pages/About';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import Dashboard from './pages/Dashboard';
import TalentSearch from './pages/TalentSearch';
import CandidateProfile from './pages/CandidateProfile';
import MyProfile from './pages/MyProfile';
import JobOpportunities from './pages/JobOpportunities';
import Applications from './pages/Applications';
import Proposals from './pages/Proposals';
import Engagements from './pages/Engagements';
import Settings from './pages/Settings';
import Analytics from './pages/Analytics';
import ClientManagement from './pages/ClientManagement';
import TeamManagement from './pages/TeamManagement';
import Billing from './pages/Billing';

// Import admin pages
import AdminDashboard from './pages/AdminDashboard';
import AdminUserManagement from './pages/AdminUserManagement';
import AdminSystemSettings from './pages/AdminSystemSettings';
import AdminMonitoring from './pages/AdminMonitoring';

// Import components
import LoadingSpinner from './components/LoadingSpinner';
import ProtectedRoute from './components/ProtectedRoute';
import AdminRoute from './components/AdminRoute';
import Layout from './components/Layout';

function App() {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChange((firebaseUser) => {
      // Update local state based on Firebase auth state
      setUser(firebaseUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <ThemeProvider>
      <AuthProvider>
        <Router 
          future={{
            v7_startTransition: true,
            v7_relativeSplatPath: true
          }}
        >
          <div className="min-h-screen bg-background text-foreground">
            <Routes>
              {/* Public routes - no sidebar */}
              <Route 
                path="/" 
                element={user ? <Navigate to="/dashboard" replace /> : <LandingPage />} 
              />
              <Route 
                path="/features" 
                element={<Features />} 
              />
              <Route 
                path="/pricing" 
                element={<Pricing />} 
              />
              <Route 
                path="/about" 
                element={<About />} 
              />
              <Route 
                path="/login" 
                element={user ? <Navigate to="/dashboard" replace /> : <LoginPage />} 
              />
              <Route 
                path="/signup" 
                element={user ? <Navigate to="/dashboard" replace /> : <SignupPage />} 
              />

              {/* Protected routes - with sidebar */}
              <Route 
                path="/dashboard" 
                element={
                  <ProtectedRoute>
                    <Layout>
                      <Dashboard />
                    </Layout>
                  </ProtectedRoute>
                } 
              />
              
            {/* Candidate-specific routes */}
            <Route 
              path="/profile/:candidateId" 
              element={
                <ProtectedRoute>
                  <Layout>
                    <CandidateProfile />
                  </Layout>
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/my-profile" 
              element={
                <ProtectedRoute>
                  <Layout>
                    <MyProfile />
                  </Layout>
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/job-opportunities" 
              element={
                <ProtectedRoute>
                  <Layout>
                    <JobOpportunities />
                  </Layout>
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/applications" 
              element={
                <ProtectedRoute>
                  <Layout>
                    <Applications />
                  </Layout>
                </ProtectedRoute>
              } 
            />

            {/* Shared routes (all authenticated users) */}
            <Route 
              path="/talent-search" 
              element={
                <ProtectedRoute>
                  <Layout>
                    <TalentSearch />
                  </Layout>
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/proposals" 
              element={
                <ProtectedRoute>
                  <Layout>
                    <Proposals />
                  </Layout>
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/engagements" 
              element={
                <ProtectedRoute>
                  <Layout>
                    <Engagements />
                  </Layout>
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/projects" 
              element={
                <ProtectedRoute>
                  <Layout>
                    <Engagements />
                  </Layout>
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/candidates" 
              element={
                <ProtectedRoute>
                  <Layout>
                    <TalentSearch />
                  </Layout>
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/analytics" 
              element={
                <ProtectedRoute>
                  <Layout>
                    <Analytics />
                  </Layout>
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/clients" 
              element={
                <ProtectedRoute>
                  <Layout>
                    <ClientManagement />
                  </Layout>
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/billing" 
              element={
                <ProtectedRoute>
                  <Layout>
                    <Billing />
                  </Layout>
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/settings" 
              element={
                <ProtectedRoute>
                  <Layout>
                    <Settings />
                  </Layout>
                </ProtectedRoute>
              } 
            />

            {/* Admin routes */}
            <Route 
              path="/admin" 
              element={
                <AdminRoute>
                  <Layout>
                    <AdminDashboard />
                  </Layout>
                </AdminRoute>
              } 
            />
            <Route 
              path="/admin/users" 
              element={
                <AdminRoute>
                  <Layout>
                    <AdminUserManagement />
                  </Layout>
                </AdminRoute>
              } 
            />
            <Route 
              path="/team" 
              element={
                <AdminRoute>
                  <Layout>
                    <TeamManagement />
                  </Layout>
                </AdminRoute>
              } 
            />
            <Route 
              path="/admin/system" 
              element={
                <AdminRoute>
                  <Layout>
                    <AdminSystemSettings />
                  </Layout>
                </AdminRoute>
              } 
            />
            <Route 
              path="/admin/monitoring" 
              element={
                <AdminRoute>
                  <Layout>
                    <AdminMonitoring />
                  </Layout>
                </AdminRoute>
              } 
            />
            <Route 
              path="/admin/analytics" 
              element={
                <AdminRoute>
                  <Layout>
                    <Analytics />
                  </Layout>
                </AdminRoute>
              } 
            />

            {/* Catch all route */}
            <Route 
              path="*" 
              element={<Navigate to={user ? "/dashboard" : "/"} replace />} 
            />
          </Routes>
          </div>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
