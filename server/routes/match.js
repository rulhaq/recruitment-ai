/**
 * This is a product of Scalovate Systems Solutions.
 * All rights reserved.
 */

import express from 'express';
import admin from 'firebase-admin';
import groqService from '../services/groq.js';

const router = express.Router();
const db = admin.firestore();

// AI-powered talent matching endpoint
router.post('/', async (req, res) => {
  try {
    const { 
      jobTitle,
      jobDescription, 
      requiredSkills, 
      experienceLevel,
      budget,
      duration,
      location,
      workType = 'remote' // remote, onsite, hybrid
    } = req.body;

    if (!jobTitle || !jobDescription) {
      return res.status(400).json({ 
        error: 'Job title and description are required' 
      });
    }

    // Create job record
    const jobData = {
      title: jobTitle,
      description: jobDescription,
      requiredSkills: requiredSkills || [],
      experienceLevel: experienceLevel || 'mid',
      budget,
      duration,
      location,
      workType,
      clientId: req.user.uid,
      status: 'active',
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    };

    const jobRef = await db.collection('jobs').add(jobData);

    // Get all active candidates
    const candidatesSnapshot = await db.collection('candidates')
      .where('status', '==', 'active')
      .limit(50) // Limit for performance
      .get();

    const candidates = [];
    candidatesSnapshot.forEach(doc => {
      candidates.push({ id: doc.id, ...doc.data() });
    });

    if (candidates.length === 0) {
      return res.json({
        jobId: jobRef.id,
        matches: [],
        message: 'No active candidates found in the database'
      });
    }

    // Use AI to rank candidates
    const rankedCandidates = await groqService.matchCandidates(
      `${jobTitle}\n\n${jobDescription}\n\nRequired Skills: ${requiredSkills?.join(', ')}`,
      candidates
    );

    // Generate insights
    const insights = await groqService.generateJobMatchInsights(jobData, rankedCandidates);

    // Store matching results
    const matchingResults = {
      jobId: jobRef.id,
      candidates: rankedCandidates,
      insights,
      createdAt: admin.firestore.FieldValue.serverTimestamp()
    };

    await db.collection('matchingResults').add(matchingResults);

    res.json({
      jobId: jobRef.id,
      matches: rankedCandidates,
      insights,
      totalCandidates: candidates.length,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Error in talent matching:', error);
    res.status(500).json({ 
      error: 'Failed to match candidates',
      details: error.message 
    });
  }
});

// Get matching results for a specific job
router.get('/job/:jobId', async (req, res) => {
  try {
    const { jobId } = req.params;

    // Get job details
    const jobDoc = await db.collection('jobs').doc(jobId).get();
    if (!jobDoc.exists) {
      return res.status(404).json({ error: 'Job not found' });
    }

    // Get matching results
    const matchingSnapshot = await db.collection('matchingResults')
      .where('jobId', '==', jobId)
      .orderBy('createdAt', 'desc')
      .limit(1)
      .get();

    if (matchingSnapshot.empty) {
      return res.status(404).json({ error: 'No matching results found for this job' });
    }

    const matchingResult = matchingSnapshot.docs[0].data();

    res.json({
      job: { id: jobId, ...jobDoc.data() },
      ...matchingResult
    });

  } catch (error) {
    console.error('Error fetching matching results:', error);
    res.status(500).json({ 
      error: 'Failed to fetch matching results',
      details: error.message 
    });
  }
});

// Get all jobs for current user
router.get('/jobs', async (req, res) => {
  try {
    const { page = 1, limit = 10, status } = req.query;
    const userId = req.user.uid;

    let query = db.collection('jobs').where('clientId', '==', userId);
    
    if (status) {
      query = query.where('status', '==', status);
    }

    const snapshot = await query
      .orderBy('createdAt', 'desc')
      .limit(parseInt(limit))
      .offset((parseInt(page) - 1) * parseInt(limit))
      .get();

    const jobs = [];
    snapshot.forEach(doc => {
      jobs.push({ id: doc.id, ...doc.data() });
    });

    res.json({
      jobs,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: snapshot.size
      }
    });

  } catch (error) {
    console.error('Error fetching jobs:', error);
    res.status(500).json({ 
      error: 'Failed to fetch jobs',
      details: error.message 
    });
  }
});

// Update job status
router.put('/job/:jobId/status', async (req, res) => {
  try {
    const { jobId } = req.params;
    const { status } = req.body;
    const userId = req.user.uid;

    const validStatuses = ['active', 'paused', 'filled', 'cancelled'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ 
        error: 'Invalid status. Must be one of: ' + validStatuses.join(', ')
      });
    }

    // Verify job ownership
    const jobDoc = await db.collection('jobs').doc(jobId).get();
    if (!jobDoc.exists) {
      return res.status(404).json({ error: 'Job not found' });
    }

    const jobData = jobDoc.data();
    if (jobData.clientId !== userId) {
      return res.status(403).json({ error: 'Access denied' });
    }

    // Update job status
    await db.collection('jobs').doc(jobId).update({
      status,
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    });

    res.json({ 
      message: 'Job status updated successfully',
      jobId,
      status 
    });

  } catch (error) {
    console.error('Error updating job status:', error);
    res.status(500).json({ 
      error: 'Failed to update job status',
      details: error.message 
    });
  }
});

// Re-run matching for existing job
router.post('/job/:jobId/rematch', async (req, res) => {
  try {
    const { jobId } = req.params;
    const userId = req.user.uid;

    // Verify job ownership
    const jobDoc = await db.collection('jobs').doc(jobId).get();
    if (!jobDoc.exists) {
      return res.status(404).json({ error: 'Job not found' });
    }

    const jobData = jobDoc.data();
    if (jobData.clientId !== userId) {
      return res.status(403).json({ error: 'Access denied' });
    }

    // Get fresh candidate pool
    const candidatesSnapshot = await db.collection('candidates')
      .where('status', '==', 'active')
      .limit(50)
      .get();

    const candidates = [];
    candidatesSnapshot.forEach(doc => {
      candidates.push({ id: doc.id, ...doc.data() });
    });

    if (candidates.length === 0) {
      return res.json({
        jobId,
        matches: [],
        message: 'No active candidates found'
      });
    }

    // Re-run AI matching
    const rankedCandidates = await groqService.matchCandidates(
      `${jobData.title}\n\n${jobData.description}\n\nRequired Skills: ${jobData.requiredSkills?.join(', ')}`,
      candidates
    );

    // Generate fresh insights
    const insights = await groqService.generateJobMatchInsights(jobData, rankedCandidates);

    // Store new matching results
    const matchingResults = {
      jobId,
      candidates: rankedCandidates,
      insights,
      isRematch: true,
      createdAt: admin.firestore.FieldValue.serverTimestamp()
    };

    await db.collection('matchingResults').add(matchingResults);

    res.json({
      jobId,
      matches: rankedCandidates,
      insights,
      totalCandidates: candidates.length,
      timestamp: new Date().toISOString(),
      message: 'Matching completed successfully'
    });

  } catch (error) {
    console.error('Error in re-matching:', error);
    res.status(500).json({ 
      error: 'Failed to re-match candidates',
      details: error.message 
    });
  }
});

// Get job statistics
router.get('/stats', async (req, res) => {
  try {
    const userId = req.user.uid;

    // Get user's job statistics
    const jobsSnapshot = await db.collection('jobs')
      .where('clientId', '==', userId)
      .get();

    const stats = {
      totalJobs: 0,
      activeJobs: 0,
      filledJobs: 0,
      pausedJobs: 0,
      cancelledJobs: 0,
      totalMatches: 0
    };

    let totalMatches = 0;

    for (const doc of jobsSnapshot.docs) {
      const jobData = doc.data();
      stats.totalJobs++;

      switch (jobData.status) {
        case 'active':
          stats.activeJobs++;
          break;
        case 'filled':
          stats.filledJobs++;
          break;
        case 'paused':
          stats.pausedJobs++;
          break;
        case 'cancelled':
          stats.cancelledJobs++;
          break;
      }

      // Count matches for this job
      const matchesSnapshot = await db.collection('matchingResults')
        .where('jobId', '==', doc.id)
        .limit(1)
        .get();

      if (!matchesSnapshot.empty) {
        const matchData = matchesSnapshot.docs[0].data();
        totalMatches += matchData.candidates?.length || 0;
      }
    }

    stats.totalMatches = totalMatches;

    res.json(stats);

  } catch (error) {
    console.error('Error fetching job statistics:', error);
    res.status(500).json({ 
      error: 'Failed to fetch statistics',
      details: error.message 
    });
  }
});

export default router; 