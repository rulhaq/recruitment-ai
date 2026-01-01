/**
 * This is a product of Scalovate Systems Solutions.
 * All rights reserved.
 */

import express from 'express';
import admin from 'firebase-admin';
import groqService from '../services/groq.js';
import { v4 as uuidv4 } from 'uuid';

const router = express.Router();
const db = admin.firestore();
const bucket = admin.storage().bucket();

// Upload and process CV
router.post('/upload', async (req, res) => {
  try {
    const file = req.file;
    const { candidateName, candidateEmail, skills = [] } = req.body;

    if (!file) {
      return res.status(400).json({ error: 'CV file is required' });
    }

    if (!candidateName || !candidateEmail) {
      return res.status(400).json({ 
        error: 'Candidate name and email are required' 
      });
    }

    // Generate unique filename
    const fileId = uuidv4();
    const fileName = `cvs/${fileId}_${file.originalname}`;

    // Upload file to Firebase Storage
    const fileUpload = bucket.file(fileName);
    const stream = fileUpload.createWriteStream({
      metadata: {
        contentType: file.mimetype,
      },
    });

    stream.on('error', (error) => {
      console.error('Upload error:', error);
      res.status(500).json({ error: 'Failed to upload file' });
    });

    stream.on('finish', async () => {
      try {
        // Make file publicly accessible
        await fileUpload.makePublic();
        const publicUrl = `https://storage.googleapis.com/${bucket.name}/${fileName}`;

        // Extract text from uploaded file (simplified - in production you'd use proper PDF/DOC parsing)
        let extractedText = '';
        if (file.mimetype === 'application/pdf') {
          // In production, use pdf-parse or similar library
          extractedText = `CV content for ${candidateName}. Skills: ${skills.join(', ')}`;
        } else {
          extractedText = file.buffer.toString('utf-8');
        }

        // Summarize CV using AI
        const summary = await groqService.summarizeCV(extractedText);

        // Create candidate record
        const candidateData = {
          name: candidateName,
          email: candidateEmail,
          skills: Array.isArray(skills) ? skills : skills.split(',').map(s => s.trim()),
          resumeUrl: publicUrl,
          resumeFileName: file.originalname,
          summary: typeof summary === 'object' ? summary : { summary },
          rawText: extractedText,
          status: 'active',
          uploadedBy: req.user.uid,
          createdAt: admin.firestore.FieldValue.serverTimestamp(),
          updatedAt: admin.firestore.FieldValue.serverTimestamp()
        };

        const candidateRef = await db.collection('candidates').add(candidateData);

        res.status(201).json({
          message: 'CV uploaded and processed successfully',
          candidateId: candidateRef.id,
          candidate: {
            id: candidateRef.id,
            name: candidateName,
            email: candidateEmail,
            resumeUrl: publicUrl,
            summary: candidateData.summary
          }
        });

      } catch (processingError) {
        console.error('CV processing error:', processingError);
        res.status(500).json({ 
          error: 'Failed to process CV',
          details: processingError.message 
        });
      }
    });

    stream.end(file.buffer);

  } catch (error) {
    console.error('Error uploading CV:', error);
    res.status(500).json({ 
      error: 'Failed to upload CV',
      details: error.message 
    });
  }
});

// Summarize existing CV
router.post('/summarize/:candidateId', async (req, res) => {
  try {
    const { candidateId } = req.params;

    // Get candidate data
    const candidateDoc = await db.collection('candidates').doc(candidateId).get();
    
    if (!candidateDoc.exists) {
      return res.status(404).json({ error: 'Candidate not found' });
    }

    const candidateData = candidateDoc.data();

    if (!candidateData.rawText) {
      return res.status(400).json({ 
        error: 'No CV text available for summarization' 
      });
    }

    // Re-summarize with AI
    const summary = await groqService.summarizeCV(candidateData.rawText);

    // Update candidate record
    await db.collection('candidates').doc(candidateId).update({
      summary: typeof summary === 'object' ? summary : { summary },
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    });

    res.json({
      message: 'CV summarized successfully',
      candidateId,
      summary
    });

  } catch (error) {
    console.error('Error summarizing CV:', error);
    res.status(500).json({ 
      error: 'Failed to summarize CV',
      details: error.message 
    });
  }
});

// Get all candidates
router.get('/candidates', async (req, res) => {
  try {
    const { page = 1, limit = 10, status, skills } = req.query;

    let query = db.collection('candidates');

    if (status) {
      query = query.where('status', '==', status);
    }

    // Note: Firestore doesn't support array-contains-any with OR queries efficiently
    // For production, consider using Algolia or Elasticsearch for complex searches
    if (skills) {
      const skillsArray = skills.split(',').map(s => s.trim());
      query = query.where('skills', 'array-contains-any', skillsArray);
    }

    const snapshot = await query
      .orderBy('createdAt', 'desc')
      .limit(parseInt(limit))
      .offset((parseInt(page) - 1) * parseInt(limit))
      .get();

    const candidates = [];
    snapshot.forEach(doc => {
      const data = doc.data();
      candidates.push({
        id: doc.id,
        name: data.name,
        email: data.email,
        skills: data.skills,
        resumeUrl: data.resumeUrl,
        summary: data.summary,
        status: data.status,
        createdAt: data.createdAt
      });
    });

    // Get total count
    const totalSnapshot = await db.collection('candidates').get();
    const total = totalSnapshot.size;

    res.json({
      candidates,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    });

  } catch (error) {
    console.error('Error fetching candidates:', error);
    res.status(500).json({ 
      error: 'Failed to fetch candidates',
      details: error.message 
    });
  }
});

// Get single candidate
router.get('/candidate/:candidateId', async (req, res) => {
  try {
    const { candidateId } = req.params;

    const candidateDoc = await db.collection('candidates').doc(candidateId).get();
    
    if (!candidateDoc.exists) {
      return res.status(404).json({ error: 'Candidate not found' });
    }

    const candidateData = candidateDoc.data();

    res.json({
      id: candidateId,
      ...candidateData
    });

  } catch (error) {
    console.error('Error fetching candidate:', error);
    res.status(500).json({ 
      error: 'Failed to fetch candidate',
      details: error.message 
    });
  }
});

// Update candidate
router.put('/candidate/:candidateId', async (req, res) => {
  try {
    const { candidateId } = req.params;
    const { name, email, skills, status } = req.body;

    const updateData = {
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    };

    if (name) updateData.name = name;
    if (email) updateData.email = email;
    if (skills) updateData.skills = Array.isArray(skills) ? skills : skills.split(',').map(s => s.trim());
    if (status) updateData.status = status;

    await db.collection('candidates').doc(candidateId).update(updateData);

    res.json({
      message: 'Candidate updated successfully',
      candidateId,
      updates: updateData
    });

  } catch (error) {
    console.error('Error updating candidate:', error);
    res.status(500).json({ 
      error: 'Failed to update candidate',
      details: error.message 
    });
  }
});

// Delete candidate
router.delete('/candidate/:candidateId', async (req, res) => {
  try {
    const { candidateId } = req.params;

    // Get candidate data first to delete associated files
    const candidateDoc = await db.collection('candidates').doc(candidateId).get();
    
    if (!candidateDoc.exists) {
      return res.status(404).json({ error: 'Candidate not found' });
    }

    const candidateData = candidateDoc.data();

    // Delete CV file from storage if exists
    if (candidateData.resumeUrl) {
      try {
        const fileName = candidateData.resumeUrl.split('/').pop();
        await bucket.file(`cvs/${fileName}`).delete();
      } catch (fileError) {
        console.warn('Failed to delete CV file:', fileError);
      }
    }

    // Delete candidate record
    await db.collection('candidates').doc(candidateId).delete();

    res.json({
      message: 'Candidate deleted successfully',
      candidateId
    });

  } catch (error) {
    console.error('Error deleting candidate:', error);
    res.status(500).json({ 
      error: 'Failed to delete candidate',
      details: error.message 
    });
  }
});

// Search candidates by skills or experience
router.post('/search', async (req, res) => {
  try {
    const { query, skills, experience, location } = req.body;

    if (!query && !skills) {
      return res.status(400).json({ 
        error: 'Search query or skills are required' 
      });
    }

    // Get all candidates (in production, implement proper text search)
    const candidatesSnapshot = await db.collection('candidates')
      .where('status', '==', 'active')
      .limit(50)
      .get();

    let candidates = [];
    candidatesSnapshot.forEach(doc => {
      candidates.push({ id: doc.id, ...doc.data() });
    });

    // Filter candidates based on search criteria
    if (skills && skills.length > 0) {
      candidates = candidates.filter(candidate => {
        return skills.some(skill => 
          candidate.skills?.some(candidateSkill => 
            candidateSkill.toLowerCase().includes(skill.toLowerCase())
          )
        );
      });
    }

    // Use AI to rank search results if query provided
    if (query && candidates.length > 0) {
      const rankedCandidates = await groqService.matchCandidates(query, candidates);
      candidates = rankedCandidates;
    }

    res.json({
      candidates,
      total: candidates.length,
      searchCriteria: { query, skills, experience, location }
    });

  } catch (error) {
    console.error('Error searching candidates:', error);
    res.status(500).json({ 
      error: 'Failed to search candidates',
      details: error.message 
    });
  }
});

export default router; 