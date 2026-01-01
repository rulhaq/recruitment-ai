/**
 * This is a product of Scalovate Systems Solutions.
 * All rights reserved.
 */

import { initializeApp } from 'firebase/app';
import { 
  getAuth, 
  connectAuthEmulator,
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  getIdToken
} from 'firebase/auth';
import { 
  getFirestore, 
  connectFirestoreEmulator,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  collection,
  query,
  where,
  orderBy,
  limit,
  getDocs,
  addDoc,
  serverTimestamp
} from 'firebase/firestore';
import { 
  getStorage, 
  connectStorageEmulator,
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject
} from 'firebase/storage';

// Firebase configuration - loads from environment variables or uses production config
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyBIfLSR-gRrLailk_2YCL6rdURGsRDV24k",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "ai-app-a2c02.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "ai-app-a2c02",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "ai-app-a2c02.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "76373702280",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:76373702280:web:439da1e713e3210d39d13d",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "G-RDGGQR89QN"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

// Connect to emulators only if explicitly enabled via environment variable
// Set VITE_USE_FIREBASE_EMULATOR=true in .env to use emulators
if (import.meta.env.VITE_USE_FIREBASE_EMULATOR === 'true' && location.hostname === 'localhost') {
  try {
    connectAuthEmulator(auth, "http://127.0.0.1:9099", { disableWarnings: true });
    connectFirestoreEmulator(db, '127.0.0.1', 8080);
    console.log('🔧 Using Firebase Emulators');
  } catch (error) {
    console.log('⚠️ Emulators already connected or not available, using production Firebase');
  }
} else {
  console.log('🔥 Connected to production Firebase:', firebaseConfig.projectId);
}

// Configure Google provider
const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
  prompt: 'select_account'
});

// Admin email validation
const isValidAdminEmail = (email) => {
  const adminDomains = ['recruitmentai.com', 'admin.recruitmentai.com'];
  const domain = email.split('@')[1];
  return adminDomains.includes(domain);
};

const isSuperAdminEmail = (email) => {
  return email.toLowerCase() === 'admin@recruitmentai.com';
};

const determineUserRole = (email, isGoogleSignup = false) => {
  if (isSuperAdminEmail(email)) {
    return 'super_admin';
  }
  
  if (isGoogleSignup) {
    return 'client'; // Google users are always clients
  }
  
  if (isValidAdminEmail(email)) {
    return 'recruiter'; // Default for company emails
  }
  
  return 'client'; // Default for non-company emails
};

// Note: Mock data stores removed - using real Firebase now

// Auth service with mock implementation for development
export const authService = {
  async signUp(email, password, userData = {}) {
    try {
      // Use real Firebase sign-up
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Determine role based on email
      const role = determineUserRole(email, false);
      
      // Create user profile in Firestore
      const userProfile = {
        uid: user.uid,
        email: user.email,
        role: role,
        ...userData,
        isActive: true
      };
      
      // Save to Firestore
      await setDoc(doc(db, 'users', user.uid), {
        ...userProfile,
        createdAt: serverTimestamp(),
        lastLogin: serverTimestamp()
      });
      
      console.log('✅ User created:', { email, role, uid: user.uid });
      return user;
    } catch (error) {
      console.error('SignUp error:', error);
      if (error.code === 'auth/email-already-in-use') {
        throw new Error('This email is already registered');
      } else if (error.code === 'auth/invalid-email') {
        throw new Error('Invalid email address');
      } else if (error.code === 'auth/weak-password') {
        throw new Error('Password is too weak');
      }
      throw new Error('Failed to create account. Please try again.');
    }
  },

  async signIn(email, password) {
    try {
      console.log('🔐 Attempting sign in:', { email });
      
      // Use real Firebase sign-in
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      // Update last login in Firestore
      try {
        await updateDoc(doc(db, 'users', user.uid), {
          lastLogin: serverTimestamp()
        });
      } catch (updateError) {
        // Profile might not exist yet, that's okay
        console.log('⚠️ Could not update last login (profile may not exist):', updateError);
      }
      
      console.log('✅ User signed in:', user.email);
      return user;
    } catch (error) {
      console.error('🚨 SignIn error:', error);
      
      if (error.code === 'auth/user-not-found') {
        throw new Error('No account found with this email address. Please sign up first or use the test account setup.');
      } else if (error.code === 'auth/wrong-password') {
        throw new Error('Incorrect password');
      } else if (error.code === 'auth/invalid-credential') {
        throw new Error('Invalid email or password. If this is a test account, please use the "Setup Test Accounts" button first.');
      } else if (error.code === 'auth/invalid-email') {
        throw new Error('Invalid email address');
      } else if (error.code === 'auth/user-disabled') {
        throw new Error('This account has been disabled');
      } else if (error.code === 'auth/too-many-requests') {
        throw new Error('Too many failed attempts. Please try again later.');
      }
      throw new Error(`Login failed: ${error.message || 'Please try again.'}`);
    }
  },

  async signInWithGoogle() {
    try {
      // Use real Firebase Google sign-in
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      
      // Check if user profile exists in Firestore
      let userProfile = await firestoreService.getUserProfile(user.uid);
      
      // If no profile exists, create one
      if (!userProfile) {
        userProfile = {
          uid: user.uid,
          email: user.email,
          name: user.displayName,
          photoURL: user.photoURL,
          role: 'client', // Google users are always clients
          signupMethod: 'google',
          createdAt: new Date().toISOString(),
          lastLogin: new Date().toISOString(),
          isActive: true
        };
        
        // Save to Firestore
        await setDoc(doc(db, 'users', user.uid), {
          ...userProfile,
          createdAt: serverTimestamp(),
          lastLogin: serverTimestamp()
        });
      } else {
        // Update last login
        await updateDoc(doc(db, 'users', user.uid), {
          lastLogin: serverTimestamp()
        });
      }
      
      console.log('✅ Google user signed in:', user.email);
      return user;
    } catch (error) {
      console.error('Google SignIn error:', error);
      if (error.code === 'auth/popup-closed-by-user') {
        throw new Error('Sign-in popup was closed');
      } else if (error.code === 'auth/operation-not-allowed') {
        throw new Error('Google sign-in is not enabled. Please enable it in Firebase Console.');
      }
      throw new Error('Google sign-in failed. Please try again.');
    }
  },

  async signOut() {
    try {
      // Use real Firebase sign-out
      await firebaseSignOut(auth);
      console.log('✅ User signed out');
    } catch (error) {
      console.error('SignOut error:', error);
      throw error;
    }
  },

  async getCurrentUserToken() {
    try {
      // Get real Firebase auth token
      const user = auth.currentUser;
      if (!user) {
        return null;
      }
      const token = await getIdToken(user);
      return token;
    } catch (error) {
      console.error('Get token error:', error);
      return null;
    }
  }
};

// Firestore service - uses real Firestore
export const firestoreService = {
  async getUserProfile(uid) {
    try {
      // Use real Firestore
      const userDoc = await getDoc(doc(db, 'users', uid));
      if (userDoc.exists()) {
        const profile = { id: userDoc.id, ...userDoc.data() };
        console.log('📋 Profile retrieved from Firestore:', profile.email);
        return profile;
      }
      console.log('⚠️ No profile found in Firestore for UID:', uid);
      return null;
    } catch (error) {
      console.error('Get user profile error:', error);
      return null;
    }
  },

  async updateUserProfile(uid, updates) {
    try {
      // Use real Firestore
      const userRef = doc(db, 'users', uid);
      
      // Check if document exists first
      const userDoc = await getDoc(userRef);
      if (userDoc.exists()) {
        // Update existing document
        await updateDoc(userRef, {
          ...updates,
          updatedAt: serverTimestamp()
        });
        console.log('📝 Profile updated in Firestore:', uid);
      } else {
        // Create new document if it doesn't exist
        await setDoc(userRef, {
          ...updates,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
          lastLogin: serverTimestamp()
        });
        console.log('📝 Created new profile in Firestore:', uid);
      }
    } catch (error) {
      console.error('Update user profile error:', error);
      throw error;
    }
  },

  async getAllUsers() {
    try {
      // Use real Firestore
      const usersSnapshot = await getDocs(collection(db, 'users'));
      const users = usersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      console.log('👥 Users retrieved from Firestore:', users.length);
      return users;
    } catch (error) {
      console.error('Get all users error:', error);
      return [];
    }
  },

  // Jobs
  async getJobs(userId, filters = {}) {
    let q = query(
      collection(db, 'jobs'),
      where('clientId', '==', userId),
      orderBy('createdAt', 'desc')
    );

    if (filters.status) {
      q = query(q, where('status', '==', filters.status));
    }

    if (filters.limit) {
      q = query(q, limit(filters.limit));
    }

    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  },

  async getJob(jobId) {
    const jobDoc = await getDoc(doc(db, 'jobs', jobId));
    return jobDoc.exists() ? { id: jobDoc.id, ...jobDoc.data() } : null;
  },

  // Candidates
  async getCandidates(filters = {}) {
    let q = query(
      collection(db, 'candidates'),
      orderBy('createdAt', 'desc')
    );

    if (filters.status) {
      q = query(q, where('status', '==', filters.status));
    }

    if (filters.limit) {
      q = query(q, limit(filters.limit));
    }

    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  },

  async getCandidate(candidateId) {
    const candidateDoc = await getDoc(doc(db, 'candidates', candidateId));
    return candidateDoc.exists() ? { id: candidateDoc.id, ...candidateDoc.data() } : null;
  },

  // Engagements
  async getEngagements(userId, filters = {}) {
    let q = query(
      collection(db, 'engagements'),
      where('clientId', '==', userId),
      orderBy('createdAt', 'desc')
    );

    if (filters.status) {
      q = query(q, where('status', '==', filters.status));
    }

    if (filters.limit) {
      q = query(q, limit(filters.limit));
    }

    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  },

  async getEngagement(engagementId) {
    const engagementDoc = await getDoc(doc(db, 'engagements', engagementId));
    return engagementDoc.exists() ? { id: engagementDoc.id, ...engagementDoc.data() } : null;
  },

  // Proposals
  async getProposals(filters = {}) {
    let q = query(
      collection(db, 'proposals'),
      orderBy('createdAt', 'desc')
    );

    if (filters.status) {
      q = query(q, where('status', '==', filters.status));
    }

    if (filters.limit) {
      q = query(q, limit(filters.limit));
    }

    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  }
};

// Storage functions
export const storageService = {
  async uploadFile(file, path) {
    const storageRef = ref(storage, path);
    const snapshot = await uploadBytes(storageRef, file);
    return await getDownloadURL(snapshot.ref);
  },

  async deleteFile(path) {
    const storageRef = ref(storage, path);
    await deleteObject(storageRef);
  }
};

// Real Firebase auth state change listener
export const onAuthStateChange = (callback) => {
  // Use real Firebase auth state listener
  return onAuthStateChanged(auth, (user) => {
    callback(user);
  });
};

// Helper for backward compatibility (no longer needed with real Firebase)
export const setMockUser = (user) => {
  // This is a no-op now since we use real Firebase
  // Kept for backward compatibility
  console.log('⚠️ setMockUser is deprecated - using real Firebase auth');
};

// Note: Test account initialization removed - using real Firebase authentication
// Users will be created in Firestore when they sign up through Firebase Auth

// Legacy exports for backward compatibility
export const signUp = authService.signUp;
export const signIn = authService.signIn;
export const signInWithGoogle = authService.signInWithGoogle;
export const signOut = authService.signOut;

export { auth, db };
export default app; 