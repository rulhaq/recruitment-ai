/**
 * This is a product of Scalovate Systems Solutions.
 * All rights reserved.
 */

import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from '../components/LoadingSpinner';
import AdminDashboard from './AdminDashboard';
import RecruiterDashboard from './RecruiterDashboard';
import ClientDashboard from './ClientDashboard';
import CandidateDashboard from './CandidateDashboard';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  UserGroupIcon, 
  DocumentTextIcon, 
  BriefcaseIcon, 
  Cog6ToothIcon,
  ChartBarIcon,
  BuildingOfficeIcon,
  CreditCardIcon,
  UsersIcon,
  ShieldCheckIcon,
  ServerIcon,
  ExclamationTriangleIcon,
  ClockIcon
} from '@heroicons/react/24/outline';

const Dashboard = () => {
  const { user, userProfile, loading, isAdmin, isSuperAdmin, isRecruiter, isClient, isCandidate } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Only redirect if we're sure the user is not authenticated
    if (!loading && !user) {
      navigate('/login');
    }
  }, [user, loading, navigate]);

  // Show loading while authentication state is being determined
  if (loading) {
    return <LoadingSpinner />;
  }

  // If no user after loading is complete, don't render anything (redirect will happen)
  if (!user) {
    return null;
  }

  // Wait for user profile to load before routing
  if (!userProfile) {
    return <LoadingSpinner />;
  }

  // Route to role-specific dashboard based on user role
  const userRole = userProfile.role;

  // Admin and Super Admin see admin dashboard
  if (userRole === 'admin' || userRole === 'super_admin') {
    return <AdminDashboard />;
  }

  // Recruiters see recruiter dashboard (talent search and management)
  if (userRole === 'recruiter') {
    return <RecruiterDashboard />;
  }

  // Clients see client dashboard (project management)
  if (userRole === 'client') {
    return <ClientDashboard />;
  }

  // Candidates see candidate dashboard (profile, applications, opportunities)
  if (userRole === 'candidate') {
    return <CandidateDashboard />;
  }

  // Default fallback (should not happen with proper role assignment)
  console.warn('Unknown user role:', userRole);
  return <CandidateDashboard />;
};

export default Dashboard; 