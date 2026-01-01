/**
 * This is a product of Scalovate Systems Solutions.
 * All rights reserved.
 */

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import admin from 'firebase-admin';
import jwt from 'jsonwebtoken';
import multer from 'multer';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// Load environment variables FIRST
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Middleware to verify Firebase token
export const verifyToken = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const decodedToken = await admin.auth().verifyIdToken(token);
    req.user = decodedToken;
    next();
  } catch (error) {
    console.error('Token verification error:', error);
    return res.status(401).json({ error: 'Invalid token' });
  }
};

// Function to fix private key formatting
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

// Main server initialization function
async function startServer() {
  try {
    // Check if .env file exists and has required variables
    if (!process.env.FIREBASE_PROJECT_ID || !process.env.FIREBASE_STORAGE_BUCKET) {
      console.error(`
❌ Missing required environment variables!

Please create a .env file in the server directory with the following variables:
- FIREBASE_PROJECT_ID
- FIREBASE_STORAGE_BUCKET
- FIREBASE_SERVICE_ACCOUNT
- GROQ_API_KEY

Copy env.example to .env and fill in your values:
  cp env.example .env

See the setup instructions in env.example for details.
      `);
      process.exit(1);
    }

    // Initialize Firebase Admin with better error handling
    let serviceAccount;
    try {
      if (!process.env.FIREBASE_SERVICE_ACCOUNT) {
        throw new Error('FIREBASE_SERVICE_ACCOUNT environment variable is required');
      }

      // Handle both file path and JSON string
      let serviceAccountData = process.env.FIREBASE_SERVICE_ACCOUNT;
      
      // If it looks like a file path, try to read it
      if (serviceAccountData.endsWith('.json')) {
        const fs = await import('fs');
        serviceAccountData = fs.readFileSync(serviceAccountData, 'utf8');
      }

      serviceAccount = JSON.parse(serviceAccountData);

      // Validate required fields
      if (!serviceAccount.private_key || !serviceAccount.client_email) {
        throw new Error('Service account JSON is missing required fields (private_key, client_email)');
      }

      // Fix private key formatting
      console.log('🔧 Fixing Firebase private key formatting...');
      serviceAccount.private_key = fixPrivateKey(serviceAccount.private_key);

    } catch (error) {
      console.error(`
❌ Firebase Service Account Configuration Error:
${error.message}

Troubleshooting tips:
1. Make sure your .env file has valid JSON in FIREBASE_SERVICE_ACCOUNT
2. If copying from Firebase Console, copy the ENTIRE JSON content
3. Make sure there are no extra characters or line breaks
4. Try saving the JSON as a file and use the file path instead

Example format:
FIREBASE_SERVICE_ACCOUNT={"type":"service_account","project_id":"...","private_key":"-----BEGIN PRIVATE KEY-----\\n...\\n-----END PRIVATE KEY-----\\n","client_email":"..."}

Or use a file path:
FIREBASE_SERVICE_ACCOUNT=./serviceAccount.json
      `);
      process.exit(1);
    }

    console.log('🔥 Initializing Firebase Admin SDK...');
    console.log(`   Project ID: ${process.env.FIREBASE_PROJECT_ID}`);
    console.log(`   Storage Bucket: ${process.env.FIREBASE_STORAGE_BUCKET}`);
    
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
    });

    const db = admin.firestore();
    const bucket = admin.storage().bucket();

    console.log('✅ Firebase Admin SDK initialized successfully');
    console.log(`   Connected to project: ${process.env.FIREBASE_PROJECT_ID}`);

    // Check Groq API key
    if (!process.env.GROQ_API_KEY || process.env.GROQ_API_KEY === 'your-groq-api-key') {
      console.warn('⚠️  GROQ_API_KEY not properly set - AI features will not work');
      console.warn('   Get your key from: https://console.groq.com/');
    } else {
      console.log('✅ Groq API key configured');
    }

    // Import route modules AFTER Firebase initialization
    console.log('📦 Loading route modules...');
    const { default: matchRoutes } = await import('./routes/match.js');
    const { default: cvRoutes } = await import('./routes/cv.js');
    const { default: proposalRoutes } = await import('./routes/proposals.js');
    const { default: crmRoutes } = await import('./routes/crm.js');
    const { default: engagementRoutes } = await import('./routes/engagements.js');
    const { default: authRoutes } = await import('./routes/auth.js');

    console.log('✅ All route modules loaded successfully');

    // Initialize Express app
    const app = express();
    const PORT = process.env.PORT || 5000;

    // Middleware
    app.use(helmet());
    app.use(cors({
      origin: process.env.CLIENT_URL || 'http://localhost:5173',
      credentials: true,
    }));
    app.use(express.json({ limit: '10mb' }));
    app.use(express.urlencoded({ extended: true }));

    // Configure multer for file uploads
    const storage = multer.memoryStorage();
    const upload = multer({ 
      storage,
      limits: {
        fileSize: 10 * 1024 * 1024, // 10MB limit
      },
      fileFilter: (req, file, cb) => {
        const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
        if (allowedTypes.includes(file.mimetype)) {
          cb(null, true);
        } else {
          cb(new Error('Invalid file type. Only PDF and DOC files are allowed.'));
        }
      }
    });

    // Health check endpoint
    app.get('/health', (req, res) => {
      res.json({ 
        status: 'healthy', 
        timestamp: new Date().toISOString(),
        version: '1.0.0',
        firebase: 'connected',
        groq: process.env.GROQ_API_KEY && process.env.GROQ_API_KEY !== 'your-groq-api-key' ? 'configured' : 'not configured',
        env: process.env.NODE_ENV || 'development'
      });
    });

    // API routes
    app.use('/api/auth', authRoutes);
    app.use('/api/match', verifyToken, matchRoutes);
    app.use('/api/cv', verifyToken, upload.single('cv'), cvRoutes);
    app.use('/api/proposals', verifyToken, proposalRoutes);
    app.use('/api/crm', verifyToken, crmRoutes);
    app.use('/api/engagements', verifyToken, engagementRoutes);

    // Error handling middleware
    app.use((error, req, res, next) => {
      console.error('Error:', error);
      
      if (error instanceof multer.MulterError) {
        if (error.code === 'LIMIT_FILE_SIZE') {
          return res.status(400).json({ error: 'File too large. Maximum size is 10MB.' });
        }
      }
      
      res.status(500).json({ 
        error: 'Internal server error',
        message: process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong'
      });
    });

    // 404 handler
    app.use('*', (req, res) => {
      res.status(404).json({ error: 'Route not found' });
    });

    // Start server
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log(`🔥 Firebase project: ${process.env.FIREBASE_PROJECT_ID}`);
      console.log(`📝 All systems ready!`);
      console.log(`\n🌐 Test the API: http://localhost:${PORT}/health`);
    });

    // Export for testing
    return { app, db, bucket, upload };

  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

// Start the server
startServer(); 