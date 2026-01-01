/**
 * This is a product of Scalovate Systems Solutions.
 * All rights reserved.
 */

import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { onAuthStateChange, authService, firestoreService, setMockUser } from '../lib/firebase';

const AuthContext = createContext({});

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Prevent infinite loops with useCallback
  const updateUserState = useCallback(async (firebaseUser) => {
    try {
      setError(null);
      console.log('🔄 AuthContext: Auth state change triggered');
      console.log('👤 AuthContext: Firebase user:', firebaseUser);
      
      if (firebaseUser) {
        // User is signed in
        console.log('✅ AuthContext: User signed in, email:', firebaseUser.email);
        setUser(firebaseUser);
        
        // Fetch user profile
        console.log('📋 AuthContext: Fetching profile for UID:', firebaseUser.uid);
        let profile = await firestoreService.getUserProfile(firebaseUser.uid);
        console.log('📄 AuthContext: Profile retrieved:', profile);
        
        // If no profile exists, create a default one
        if (!profile) {
          console.log('⚠️ AuthContext: No profile found, creating default profile...');
          try {
            // Determine role based on email
            const email = firebaseUser.email || '';
            let role = 'client'; // Default role
            
            // Check if it's an admin email
            const adminDomains = ['recruitmentai.com', 'admin.recruitmentai.com'];
            const domain = email.split('@')[1];
            
            if (email.toLowerCase() === 'admin@recruitmentai.com') {
              role = 'super_admin';
            } else if (adminDomains.includes(domain)) {
              role = 'recruiter'; // Default for company emails
            }
            
            // Create default profile
            const defaultProfile = {
              uid: firebaseUser.uid,
              email: email,
              firstName: firebaseUser.displayName?.split(' ')[0] || email.split('@')[0],
              lastName: firebaseUser.displayName?.split(' ').slice(1).join(' ') || '',
              name: firebaseUser.displayName || email.split('@')[0],
              role: role,
              isActive: true,
              createdAt: new Date().toISOString(),
              lastLogin: new Date().toISOString()
            };
            
            // Save to Firestore - updateUserProfile will create if doesn't exist
            await firestoreService.updateUserProfile(firebaseUser.uid, defaultProfile);
            profile = defaultProfile;
            console.log('✅ AuthContext: Default profile created with role:', role);
          } catch (error) {
            console.error('🚨 AuthContext: Error creating default profile:', error);
            // Set a minimal profile so the app doesn't break
            profile = {
              uid: firebaseUser.uid,
              email: firebaseUser.email,
              role: 'client',
              isActive: true
            };
          }
        }
        
        if (profile) {
          setUserProfile(profile);
          console.log('✅ AuthContext: Profile set successfully');
          console.log('🎭 AuthContext: User role:', profile.role);
          console.log('🔐 AuthContext: Admin checks:');
          console.log('  - isAdmin():', profile.role === 'admin');
          console.log('  - isSuperAdmin():', profile.role === 'super_admin');
          console.log('  - hasAdminAccess():', profile.role === 'admin' || profile.role === 'super_admin');
        }
      } else {
        // User is signed out
        console.log('🚪 AuthContext: User signed out, clearing state');
        setUser(null);
        setUserProfile(null);
      }
    } catch (error) {
      console.error('🚨 AuthContext: Error in auth state change:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChange(updateUserState);
    return () => unsubscribe();
  }, [updateUserState]);

  const signUp = async (email, password, userData) => {
    try {
      setLoading(true);
      setError(null);
      
      const user = await authService.signUp(email, password, userData);
      
      // Update auth state
      setMockUser(user);
      
      return user;
    } catch (error) {
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (email, password) => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('🔐 AuthContext: Starting sign in for:', email);
      console.log('🔑 AuthContext: Password provided:', password ? 'Yes' : 'No');
      
      const user = await authService.signIn(email, password);
      console.log('✅ AuthContext: Auth service returned user:', user);
      
      // Update auth state
      console.log('📡 AuthContext: Calling setMockUser to trigger auth state change...');
      setMockUser(user);
      
      console.log('🔍 AuthContext: Sign in complete, waiting for auth state update');
      
      return user;
    } catch (error) {
      console.error('🚨 AuthContext: Sign in error:', error);
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signInWithGoogle = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const user = await authService.signInWithGoogle();
      
      // Update auth state
      setMockUser(user);
      
      return user;
    } catch (error) {
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      console.log('🚪 Signing out user...');
      
      // Clear state immediately
      setUser(null);
      setUserProfile(null);
      setMockUser(null);
      setError(null);
      
      // Call Firebase signOut (fire and forget - don't block)
      authService.signOut().catch(err => {
        console.error('🚨 Auth service signOut error:', err);
      });
      
      console.log('✅ User signed out - state cleared');
      return true;
    } catch (error) {
      console.error('🚨 Sign out error:', error);
      // Still clear state even if signOut fails
      setUser(null);
      setUserProfile(null);
      setMockUser(null);
      setError(null);
      return false;
    }
  };

  const updateProfile = async (updates) => {
    try {
      setError(null);
      
      if (!user) throw new Error('No user signed in');
      
      await firestoreService.updateUserProfile(user.uid, updates);
      
      // Update local profile state
      setUserProfile(prev => ({ ...prev, ...updates }));
    } catch (error) {
      setError(error.message);
      throw error;
    }
  };

  const refreshProfile = async () => {
    try {
      if (!user) return;
      
      const profile = await firestoreService.getUserProfile(user.uid);
      setUserProfile(profile);
      
      return profile;
    } catch (error) {
      console.error('Error refreshing profile:', error);
      setError(error.message);
    }
  };

  const getCurrentUserToken = async () => {
    try {
      return await authService.getCurrentUserToken();
    } catch (error) {
      console.error('Error getting user token:', error);
      return null;
    }
  };

  // Helper functions
  const isAdmin = () => userProfile?.role === 'admin';
  const isSuperAdmin = () => userProfile?.role === 'super_admin';
  const isRecruiter = () => userProfile?.role === 'recruiter';
  const isClient = () => userProfile?.role === 'client';
  const isCandidate = () => userProfile?.role === 'candidate';
  
  // Enhanced admin checking
  const hasAdminAccess = () => isAdmin() || isSuperAdmin();
  const canManageUsers = () => hasAdminAccess();
  const canModifySystem = () => isSuperAdmin();
  const canViewAnalytics = () => hasAdminAccess() || isRecruiter();
  
  // Super Admin Configuration (Hardcoded)
  const SUPER_ADMIN_EMAIL = 'admin@recruitmentai.com';
  
  // Admin email validation
  const isValidAdminEmail = (email) => {
    const adminDomains = ['recruitmentai.com', 'admin.recruitmentai.com'];
    const domain = email.split('@')[1];
    return adminDomains.includes(domain);
  };
  
  // Check if email is the hardcoded super admin
  const isSuperAdminEmail = (email) => {
    return email.toLowerCase() === SUPER_ADMIN_EMAIL.toLowerCase();
  };
  
  // Determine role based on email and signup type
  const determineUserRole = (email, isGoogleSignup = false, requestedRole = null) => {
    // Super admin is hardcoded
    if (isSuperAdminEmail(email)) {
      return 'super_admin';
    }
    
    // For Google signups
    if (isGoogleSignup) {
      // Only clients can use Google signup
      return 'client';
    }
    
    // For manual signups with email/password
    if (isValidAdminEmail(email)) {
      // Company emails can be admin or recruiter
      if (requestedRole === 'admin' || requestedRole === 'recruiter') {
        return requestedRole;
      }
      return 'recruiter'; // Default for company emails
    }
    
    // Non-company emails can only be clients
    return 'client';
  };
  
  // Validate role assignment
  const validateRoleAssignment = (email, role, isGoogleSignup = false) => {
    const errors = [];
    
    // Super admin validation
    if (role === 'super_admin' && !isSuperAdminEmail(email)) {
      errors.push('Super admin role is restricted');
    }
    
    // Admin/Recruiter validation
    if ((role === 'admin' || role === 'recruiter') && !isValidAdminEmail(email)) {
      errors.push('Admin and Recruiter roles require a company email address (@recruitmentai.com)');
    }
    
    // Google signup validation
    if (isGoogleSignup && (role === 'admin' || role === 'recruiter' || role === 'super_admin')) {
      errors.push('Admin roles cannot use Google sign-in. Please use email/password with company email.');
    }
    
    return errors;
  };
  
  const hasRole = (role) => userProfile?.role === role;
  const hasAnyRole = (roles) => roles.includes(userProfile?.role);
  
  // Permission checking
  const hasPermission = (permission) => {
    if (!userProfile) return false;
    
    const rolePermissions = {
      super_admin: ['all'],
      admin: ['user_management', 'system_monitoring', 'analytics', 'billing'],
      recruiter: ['talent_search', 'proposals', 'analytics', 'client_management'],
      client: ['proposals', 'engagements', 'billing'],
      candidate: ['profile_management']
    };
    
    const userPermissions = rolePermissions[userProfile.role] || [];
    return userPermissions.includes('all') || userPermissions.includes(permission);
  };
  
  const isAuthenticated = () => !!user && !!userProfile;
  const isUserActive = () => userProfile?.isActive !== false;
  const isEmailVerified = () => user?.emailVerified || false;

  // Admin utilities
  const getUserDisplayName = () => {
    if (!userProfile) return 'Unknown User';
    return userProfile.name || `${userProfile.firstName} ${userProfile.lastName}`.trim() || userProfile.email;
  };

  const getUserRole = () => userProfile?.role || 'unknown';
  
  const getRoleDisplayName = (role = null) => {
    const targetRole = role || getUserRole();
    const roleNames = {
      super_admin: 'Super Admin',
      admin: 'Admin',
      recruiter: 'Recruiter',
      client: 'Client',
      candidate: 'Candidate'
    };
    return roleNames[targetRole] || 'Unknown';
  };

  const value = {
    // State
    user,
    userProfile,
    loading,
    error,
    
    // Methods
    signUp,
    signIn,
    signInWithGoogle,
    signOut,
    updateProfile,
    refreshProfile,
    getCurrentUserToken,
    
    // Helper functions
    isAdmin,
    isSuperAdmin,
    isRecruiter,
    isClient,
    isCandidate,
    hasAdminAccess,
    canManageUsers,
    canModifySystem,
    canViewAnalytics,
    hasRole,
    hasAnyRole,
    hasPermission,
    isAuthenticated,
    isUserActive,
    isEmailVerified,
    getUserDisplayName,
    getUserRole,
    getRoleDisplayName,
    
    // Role validation functions
    isValidAdminEmail,
    isSuperAdminEmail,
    determineUserRole,
    validateRoleAssignment,
    
    // Clear error
    clearError: () => setError(null)
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}; 