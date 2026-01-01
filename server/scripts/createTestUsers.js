/**
 * This is a product of Scalovate Systems Solutions.
 * All rights reserved.
 * 
 * Script to create test users in Firebase Auth
 * Run with: node server/scripts/createTestUsers.js
 */

import admin from 'firebase-admin';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// Load environment variables
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
process.chdir(join(__dirname, '..'));
dotenv.config();

// Test accounts to create
const TEST_ACCOUNTS = [
  {
    email: 'admin@recruitmentai.com',
    password: 'admin123',
    displayName: 'Super Admin',
    role: 'super_admin',
    userData: {
      firstName: 'Super',
      lastName: 'Admin',
      company: 'RecruitmentAI',
      phone: '+1-555-0001',
      role: 'super_admin',
      isActive: true,
      isTestAccount: true
    }
  },
  {
    email: 'consultant@recruitmentai.com',
    password: 'consultant123',
    displayName: 'Consultant Recruiter',
    role: 'recruiter',
    userData: {
      firstName: 'Consultant',
      lastName: 'Recruiter',
      company: 'RecruitmentAI',
      phone: '+1-555-0002',
      role: 'recruiter',
      isActive: true,
      isTestAccount: true
    }
  },
  {
    email: 'client@gmail.com',
    password: 'client123',
    displayName: 'Test Client',
    role: 'client',
    userData: {
      firstName: 'Test',
      lastName: 'Client',
      company: 'Client Corp',
      phone: '+1-555-0003',
      role: 'client',
      isActive: true,
      isTestAccount: true
    }
  },
  {
    email: 'candidate@outlook.com',
    password: 'candidate123',
    displayName: 'Test Candidate',
    role: 'candidate',
    userData: {
      firstName: 'Test',
      lastName: 'Candidate',
      company: 'Freelancer',
      phone: '+1-555-0004',
      role: 'candidate',
      isActive: true,
      isTestAccount: true
    }
  }
];

async function createTestUsers() {
  try {
    // Initialize Firebase Admin
    if (!process.env.FIREBASE_SERVICE_ACCOUNT) {
      throw new Error('FIREBASE_SERVICE_ACCOUNT not found in .env file');
    }

    let serviceAccount;
    try {
      let serviceAccountData = process.env.FIREBASE_SERVICE_ACCOUNT;
      
      // If it looks like a file path, try to read it
      if (serviceAccountData.endsWith('.json')) {
        const fs = await import('fs');
        const path = await import('path');
        const serviceAccountPath = path.isAbsolute(serviceAccountData) 
          ? serviceAccountData 
          : path.join(process.cwd(), serviceAccountData);
        serviceAccountData = fs.readFileSync(serviceAccountPath, 'utf8');
      }
      
      serviceAccount = JSON.parse(serviceAccountData);

      // Validate required fields
      if (!serviceAccount.private_key || !serviceAccount.client_email) {
        throw new Error('Service account JSON is missing required fields (private_key, client_email)');
      }
    } catch (error) {
      console.error('❌ Failed to parse FIREBASE_SERVICE_ACCOUNT:', error.message);
      console.error('\nTroubleshooting:');
      console.error('1. Make sure your .env file has valid JSON in FIREBASE_SERVICE_ACCOUNT');
      console.error('2. If copying from Firebase Console, copy the ENTIRE JSON content');
      console.error('3. Make sure there are no extra characters or line breaks');
      console.error('4. Try saving the JSON as a file and use the file path instead');
      console.error('\nExample format:');
      console.error('FIREBASE_SERVICE_ACCOUNT={"type":"service_account","project_id":"...","private_key":"-----BEGIN PRIVATE KEY-----\\n...\\n-----END PRIVATE KEY-----\\n","client_email":"..."}');
      console.error('\nOr use a file path:');
      console.error('FIREBASE_SERVICE_ACCOUNT=./serviceAccount.json');
      throw error;
    }

    // Fix private key formatting (EXACT copy from server/index.js)
    function fixPrivateKey(privateKey) {
      if (!privateKey) return privateKey;
      
      // Remove any existing newlines and extra spaces
      let fixed = privateKey.replace(/\\n/g, '\n').replace(/\s+/g, ' ').trim();
      
      // Ensure proper PEM format
      if (!fixed.startsWith('-----BEGIN PRIVATE KEY-----')) {
        return privateKey; // Return original if it doesn't look like a PEM key
      }
      
      // Split into lines and rejoin with proper formatting
      const lines = fixed.split('\n');
      const formattedLines = [];
      
      for (let line of lines) {
        line = line.trim();
        if (line === '-----BEGIN PRIVATE KEY-----' || line === '-----END PRIVATE KEY-----') {
          formattedLines.push(line);
        } else if (line.length > 0) {
          // Split long lines into 64-character chunks (standard PEM format)
          for (let i = 0; i < line.length; i += 64) {
            formattedLines.push(line.substring(i, i + 64));
          }
        }
      }
      
      return formattedLines.join('\n');
    }

    // Fix private key formatting
    if (serviceAccount.private_key) {
      console.log('🔧 Fixing Firebase private key formatting...');
      try {
        serviceAccount.private_key = fixPrivateKey(serviceAccount.private_key);
      } catch (error) {
        console.warn('⚠️ Could not fix private key format, using original:', error.message);
      }
    }

    // Try to initialize Firebase Admin
    try {
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
      });
    } catch (initError) {
      if (initError.message.includes('PEM') || initError.message.includes('private key')) {
        console.error('\n❌ Private key format error. The service account private key may be incorrectly formatted.');
        console.error('\n💡 Solution: Try using a service account JSON file instead:');
        console.error('   1. Download the service account JSON from Firebase Console');
        console.error('   2. Save it as server/serviceAccount.json');
        console.error('   3. In server/.env, set: FIREBASE_SERVICE_ACCOUNT=./serviceAccount.json');
        throw new Error('Invalid private key format. See instructions above.');
      }
      throw initError;
    }

    console.log('🔥 Firebase Admin initialized');
    console.log(`📦 Project: ${process.env.FIREBASE_PROJECT_ID}`);
    console.log('🚀 Creating test users...\n');

    const db = admin.firestore();
    const results = [];

    for (const account of TEST_ACCOUNTS) {
      try {
        // Check if user already exists
        let user;
        try {
          user = await admin.auth().getUserByEmail(account.email);
          console.log(`⚠️  User already exists: ${account.email} (UID: ${user.uid})`);
          
          // Update password
          await admin.auth().updateUser(user.uid, {
            password: account.password,
            displayName: account.displayName
          });
          console.log(`   ✅ Password updated`);
          
          // Update Firestore profile
          await db.collection('users').doc(user.uid).set({
            ...account.userData,
            email: account.email,
            updatedAt: admin.firestore.FieldValue.serverTimestamp()
          }, { merge: true });
          console.log(`   ✅ Firestore profile updated`);
          
          results.push({
            email: account.email,
            role: account.role,
            status: 'updated',
            uid: user.uid
          });
        } catch (error) {
          if (error.code === 'auth/user-not-found') {
            // Create new user
            user = await admin.auth().createUser({
              email: account.email,
              password: account.password,
              displayName: account.displayName,
              emailVerified: true
            });
            console.log(`✅ Created user: ${account.email} (UID: ${user.uid})`);
            
            // Create Firestore profile
            await db.collection('users').doc(user.uid).set({
              uid: user.uid,
              email: account.email,
              ...account.userData,
              createdAt: admin.firestore.FieldValue.serverTimestamp(),
              lastLogin: admin.firestore.FieldValue.serverTimestamp()
            });
            console.log(`   ✅ Firestore profile created`);
            
            results.push({
              email: account.email,
              role: account.role,
              status: 'created',
              uid: user.uid
            });
          } else {
            throw error;
          }
        }
      } catch (error) {
        console.error(`❌ Failed to create/update ${account.email}:`, error.message);
        results.push({
          email: account.email,
          role: account.role,
          status: 'failed',
          error: error.message
        });
      }
      
      // Small delay to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 500));
    }

    console.log('\n📋 Summary:');
    console.log('='.repeat(50));
    results.forEach(result => {
      const icon = result.status === 'created' ? '✅' : result.status === 'updated' ? '🔄' : '❌';
      console.log(`${icon} ${result.email} (${result.role}) - ${result.status}`);
      if (result.uid) {
        console.log(`   UID: ${result.uid}`);
      }
      if (result.error) {
        console.log(`   Error: ${result.error}`);
      }
    });
    console.log('='.repeat(50));
    
    console.log('\n✅ Test users setup complete!');
    console.log('\nYou can now login with:');
    console.log('  • Super Admin: admin@recruitmentai.com / admin123');
    console.log('  • Recruiter: consultant@recruitmentai.com / consultant123');
    console.log('  • Client: client@gmail.com / client123');
    console.log('  • Candidate: candidate@outlook.com / candidate123');

    process.exit(0);
  } catch (error) {
    console.error('\n❌ Error:', error.message);
    console.error('\nMake sure:');
    console.error('  1. server/.env file exists with FIREBASE_SERVICE_ACCOUNT');
    console.error('  2. Firebase project is: ai-app-a2c02');
    console.error('  3. Service account has proper permissions');
    process.exit(1);
  }
}

createTestUsers();

