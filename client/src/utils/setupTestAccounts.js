/**
 * This is a product of Scalovate Systems Solutions.
 * All rights reserved.
 */

import { authService, firestoreService } from '../lib/firebase';

// Test accounts configuration
const TEST_ACCOUNTS = [
  {
    email: 'admin@recruitmentai.com',
    password: 'admin123',
    role: 'super_admin',
    userData: {
      firstName: 'Super',
      lastName: 'Admin',
      company: 'RecruitmentAI',
      phone: '+1-555-0001'
    }
  },
  {
    email: 'consultant@recruitmentai.com',
    password: 'consultant123',
    role: 'recruiter',
    userData: {
      firstName: 'Consultant',
      lastName: 'Recruiter',
      company: 'RecruitmentAI',
      phone: '+1-555-0002'
    }
  },
  {
    email: 'client@gmail.com',
    password: 'client123',
    role: 'client',
    userData: {
      firstName: 'Test',
      lastName: 'Client',
      company: 'Client Corp',
      phone: '+1-555-0003'
    }
  },
  {
    email: 'candidate@outlook.com',
    password: 'candidate123',
    role: 'candidate',
    userData: {
      firstName: 'Test',
      lastName: 'Candidate',
      company: 'Freelancer',
      phone: '+1-555-0004'
    }
  }
];

/**
 * Set up test accounts in Firebase
 * This function creates the test accounts if they don't exist
 */
export const setupTestAccounts = async () => {
  const results = [];
  
  console.log('🚀 Setting up test accounts...');
  
  for (const account of TEST_ACCOUNTS) {
    try {
      console.log(`Creating account: ${account.email} (${account.role})`);
      
      // Try to create the account
      const user = await authService.signUp(
        account.email, 
        account.password, 
        {
          ...account.userData,
          role: account.role,
          isTestAccount: true,
          setupDate: new Date().toISOString()
        }
      );
      
      results.push({
        email: account.email,
        role: account.role,
        status: 'created',
        uid: user.uid
      });
      
      console.log(`✅ Account created: ${account.email}`);
      
    } catch (error) {
      if (error.code === 'auth/email-already-in-use') {
        console.log(`⚠️ Account already exists: ${account.email}`);
        results.push({
          email: account.email,
          role: account.role,
          status: 'already_exists',
          error: 'Email already in use'
        });
      } else {
        console.error(`❌ Failed to create ${account.email}:`, error.message);
        results.push({
          email: account.email,
          role: account.role,
          status: 'failed',
          error: error.message
        });
      }
    }
    
    // Add a small delay to avoid rate limiting
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
  
  console.log('📋 Setup Results:', results);
  return results;
};

/**
 * Display test account information
 */
export const getTestAccountsInfo = () => {
  return {
    title: 'Test Accounts for Augmention AI Platform',
    accounts: [
      {
        role: 'Super Admin',
        email: 'admin@recruitmentai.com',
        password: 'admin123',
        access: 'Full system control, user management, system settings',
        color: 'text-red-600'
      },
      {
        role: 'Recruiter/Consultant',
        email: 'consultant@recruitmentai.com',
        password: 'consultant123',
        access: 'AI talent search, candidate management, job postings',
        color: 'text-blue-600'
      },
      {
        role: 'Client',
        email: 'client@gmail.com',
        password: 'client123',
        access: 'Project management, team hiring, proposal reviews',
        color: 'text-green-600'
      },
      {
        role: 'Candidate',
        email: 'candidate@outlook.com',
        password: 'candidate123',
        access: 'Profile management, job applications, skill showcase',
        color: 'text-purple-600'
      }
    ],
    notes: [
      '• Company emails (@recruitmentai.com) get admin/recruiter roles',
      '• Personal emails (gmail, outlook) get client/candidate roles',
      '• Google sign-in only works for clients and candidates',
      '• Admin and recruiters must use email/password login',
      '• Super admin (admin@recruitmentai.com) has full system access'
    ]
  };
};

export default { setupTestAccounts, getTestAccountsInfo }; 