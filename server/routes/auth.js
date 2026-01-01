/**
 * This is a product of Scalovate Systems Solutions.
 * All rights reserved.
 */

import express from 'express';
import admin from 'firebase-admin';

const router = express.Router();
const db = admin.firestore();

// Create user profile after Firebase Auth signup
router.post('/create-profile', async (req, res) => {
  try {
    const { uid, email, name, role = 'recruiter' } = req.body;

    if (!uid || !email || !name) {
      return res.status(400).json({ 
        error: 'Missing required fields: uid, email, name' 
      });
    }

    // Validate role
    const validRoles = ['admin', 'recruiter', 'client'];
    if (!validRoles.includes(role)) {
      return res.status(400).json({ 
        error: 'Invalid role. Must be admin, recruiter, or client' 
      });
    }

    // Create user document in Firestore
    const userRef = db.collection('users').doc(uid);
    const userData = {
      uid,
      email,
      name,
      role,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      isActive: true,
      preferences: {
        darkMode: false,
        notifications: true,
        emailUpdates: true
      }
    };

    await userRef.set(userData);

    // Set custom claims for role-based access
    await admin.auth().setCustomUserClaims(uid, { role });

    res.status(201).json({ 
      message: 'User profile created successfully',
      user: { uid, email, name, role }
    });

  } catch (error) {
    console.error('Error creating user profile:', error);
    res.status(500).json({ 
      error: 'Failed to create user profile',
      details: error.message 
    });
  }
});

// Get user profile
router.get('/profile/:uid', async (req, res) => {
  try {
    const { uid } = req.params;

    const userDoc = await db.collection('users').doc(uid).get();
    
    if (!userDoc.exists) {
      return res.status(404).json({ error: 'User not found' });
    }

    const userData = userDoc.data();
    
    // Remove sensitive data
    delete userData.uid;
    
    res.json({ user: userData });

  } catch (error) {
    console.error('Error fetching user profile:', error);
    res.status(500).json({ 
      error: 'Failed to fetch user profile',
      details: error.message 
    });
  }
});

// Update user profile
router.put('/profile/:uid', async (req, res) => {
  try {
    const { uid } = req.params;
    const { name, preferences } = req.body;

    const updateData = {
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    };

    if (name) updateData.name = name;
    if (preferences) updateData.preferences = preferences;

    await db.collection('users').doc(uid).update(updateData);

    res.json({ 
      message: 'Profile updated successfully',
      data: updateData 
    });

  } catch (error) {
    console.error('Error updating user profile:', error);
    res.status(500).json({ 
      error: 'Failed to update user profile',
      details: error.message 
    });
  }
});

// Get all users (admin only)
router.get('/users', async (req, res) => {
  try {
    const { page = 1, limit = 10, role } = req.query;
    
    let query = db.collection('users');
    
    if (role) {
      query = query.where('role', '==', role);
    }

    const snapshot = await query
      .orderBy('createdAt', 'desc')
      .limit(parseInt(limit))
      .offset((parseInt(page) - 1) * parseInt(limit))
      .get();

    const users = [];
    snapshot.forEach(doc => {
      const userData = doc.data();
      delete userData.uid; // Remove sensitive data
      users.push({ id: doc.id, ...userData });
    });

    // Get total count
    const totalSnapshot = await db.collection('users').get();
    const total = totalSnapshot.size;

    res.json({
      users,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    });

  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ 
      error: 'Failed to fetch users',
      details: error.message 
    });
  }
});

// Verify token and return user data
router.post('/verify', async (req, res) => {
  try {
    const { token } = req.body;

    if (!token) {
      return res.status(400).json({ error: 'Token is required' });
    }

    const decodedToken = await admin.auth().verifyIdToken(token);
    const userDoc = await db.collection('users').doc(decodedToken.uid).get();

    if (!userDoc.exists) {
      return res.status(404).json({ error: 'User profile not found' });
    }

    const userData = userDoc.data();
    delete userData.uid;

    res.json({ 
      valid: true,
      user: {
        uid: decodedToken.uid,
        ...userData
      }
    });

  } catch (error) {
    console.error('Error verifying token:', error);
    res.status(401).json({ 
      valid: false,
      error: 'Invalid token' 
    });
  }
});

export default router; 