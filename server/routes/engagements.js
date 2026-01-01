/**
 * This is a product of Scalovate Systems Solutions.
 * All rights reserved.
 */

import express from 'express';
import admin from 'firebase-admin';

const router = express.Router();
const db = admin.firestore();

// Create new engagement
router.post('/', async (req, res) => {
  try {
    const {
      jobId,
      candidateId,
      clientName,
      clientEmail,
      clientPhone,
      projectTitle,
      startDate,
      endDate,
      duration,
      budget,
      hourlyRate,
      workType,
      status = 'pending',
      requirements,
      notes
    } = req.body;

    if (!jobId || !candidateId || !clientName || !projectTitle) {
      return res.status(400).json({ 
        error: 'Missing required fields: jobId, candidateId, clientName, projectTitle' 
      });
    }

    // Verify job and candidate exist
    const jobDoc = await db.collection('jobs').doc(jobId).get();
    const candidateDoc = await db.collection('candidates').doc(candidateId).get();

    if (!jobDoc.exists) {
      return res.status(404).json({ error: 'Job not found' });
    }
    if (!candidateDoc.exists) {
      return res.status(404).json({ error: 'Candidate not found' });
    }

    const engagementData = {
      jobId,
      candidateId,
      clientName,
      clientEmail,
      clientPhone,
      projectTitle,
      startDate: startDate ? new Date(startDate) : null,
      endDate: endDate ? new Date(endDate) : null,
      duration,
      budget: budget ? parseFloat(budget) : null,
      hourlyRate: hourlyRate ? parseFloat(hourlyRate) : null,
      workType: workType || 'remote',
      status,
      requirements,
      notes,
      crmSynced: false,
      createdBy: req.user.uid,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      // Derived fields
      jobTitle: jobDoc.data().title,
      candidateName: candidateDoc.data().name,
      candidateEmail: candidateDoc.data().email
    };

    const engagementRef = await db.collection('engagements').add(engagementData);

    res.status(201).json({
      message: 'Engagement created successfully',
      engagementId: engagementRef.id,
      engagement: {
        id: engagementRef.id,
        ...engagementData
      }
    });

  } catch (error) {
    console.error('Error creating engagement:', error);
    res.status(500).json({ 
      error: 'Failed to create engagement',
      details: error.message 
    });
  }
});

// Get all engagements
router.get('/', async (req, res) => {
  try {
    const { page = 1, limit = 10, status, clientName } = req.query;
    const userId = req.user.uid;
    const userRole = req.user.role;

    let query = db.collection('engagements');

    // Role-based filtering
    if (userRole !== 'admin') {
      query = query.where('createdBy', '==', userId);
    }

    if (status) {
      query = query.where('status', '==', status);
    }

    // Note: Firestore doesn't support text search on clientName directly
    // In production, consider using Algolia or implement server-side filtering

    const snapshot = await query
      .orderBy('createdAt', 'desc')
      .limit(parseInt(limit))
      .offset((parseInt(page) - 1) * parseInt(limit))
      .get();

    const engagements = [];
    snapshot.forEach(doc => {
      const data = doc.data();
      engagements.push({
        id: doc.id,
        ...data,
        // Convert Firestore timestamps to ISO strings
        createdAt: data.createdAt?.toDate?.()?.toISOString(),
        updatedAt: data.updatedAt?.toDate?.()?.toISOString(),
        startDate: data.startDate?.toDate?.()?.toISOString(),
        endDate: data.endDate?.toDate?.()?.toISOString(),
        crmSyncedAt: data.crmSyncedAt?.toDate?.()?.toISOString()
      });
    });

    // Filter by client name if provided (server-side filtering)
    let filteredEngagements = engagements;
    if (clientName) {
      filteredEngagements = engagements.filter(engagement =>
        engagement.clientName?.toLowerCase().includes(clientName.toLowerCase())
      );
    }

    res.json({
      engagements: filteredEngagements,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: filteredEngagements.length
      }
    });

  } catch (error) {
    console.error('Error fetching engagements:', error);
    res.status(500).json({ 
      error: 'Failed to fetch engagements',
      details: error.message 
    });
  }
});

// Get single engagement
router.get('/:engagementId', async (req, res) => {
  try {
    const { engagementId } = req.params;

    const engagementDoc = await db.collection('engagements').doc(engagementId).get();
    
    if (!engagementDoc.exists) {
      return res.status(404).json({ error: 'Engagement not found' });
    }

    const engagementData = engagementDoc.data();

    // Get related job and candidate details
    const jobDoc = await db.collection('jobs').doc(engagementData.jobId).get();
    const candidateDoc = await db.collection('candidates').doc(engagementData.candidateId).get();

    const engagement = {
      id: engagementId,
      ...engagementData,
      // Convert timestamps
      createdAt: engagementData.createdAt?.toDate?.()?.toISOString(),
      updatedAt: engagementData.updatedAt?.toDate?.()?.toISOString(),
      startDate: engagementData.startDate?.toDate?.()?.toISOString(),
      endDate: engagementData.endDate?.toDate?.()?.toISOString(),
      crmSyncedAt: engagementData.crmSyncedAt?.toDate?.()?.toISOString(),
      // Add related data
      job: jobDoc.exists ? { id: engagementData.jobId, ...jobDoc.data() } : null,
      candidate: candidateDoc.exists ? { id: engagementData.candidateId, ...candidateDoc.data() } : null
    };

    res.json(engagement);

  } catch (error) {
    console.error('Error fetching engagement:', error);
    res.status(500).json({ 
      error: 'Failed to fetch engagement',
      details: error.message 
    });
  }
});

// Update engagement
router.put('/:engagementId', async (req, res) => {
  try {
    const { engagementId } = req.params;
    const {
      clientName,
      clientEmail,
      clientPhone,
      projectTitle,
      startDate,
      endDate,
      duration,
      budget,
      hourlyRate,
      workType,
      requirements,
      notes
    } = req.body;

    const updateData = {
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    };

    if (clientName) updateData.clientName = clientName;
    if (clientEmail) updateData.clientEmail = clientEmail;
    if (clientPhone) updateData.clientPhone = clientPhone;
    if (projectTitle) updateData.projectTitle = projectTitle;
    if (startDate) updateData.startDate = new Date(startDate);
    if (endDate) updateData.endDate = new Date(endDate);
    if (duration) updateData.duration = duration;
    if (budget) updateData.budget = parseFloat(budget);
    if (hourlyRate) updateData.hourlyRate = parseFloat(hourlyRate);
    if (workType) updateData.workType = workType;
    if (requirements) updateData.requirements = requirements;
    if (notes) updateData.notes = notes;

    await db.collection('engagements').doc(engagementId).update(updateData);

    res.json({
      message: 'Engagement updated successfully',
      engagementId,
      updates: updateData
    });

  } catch (error) {
    console.error('Error updating engagement:', error);
    res.status(500).json({ 
      error: 'Failed to update engagement',
      details: error.message 
    });
  }
});

// Update engagement status
router.put('/:engagementId/status', async (req, res) => {
  try {
    const { engagementId } = req.params;
    const { status, notes } = req.body;

    const validStatuses = [
      'pending',
      'active',
      'on_hold',
      'completed',
      'cancelled',
      'terminated'
    ];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({ 
        error: 'Invalid status. Must be one of: ' + validStatuses.join(', ')
      });
    }

    const updateData = {
      status,
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    };

    if (notes) updateData.statusNotes = notes;

    // Add status-specific timestamps
    if (status === 'active') {
      updateData.activatedAt = admin.firestore.FieldValue.serverTimestamp();
    } else if (status === 'completed') {
      updateData.completedAt = admin.firestore.FieldValue.serverTimestamp();
    } else if (status === 'cancelled') {
      updateData.cancelledAt = admin.firestore.FieldValue.serverTimestamp();
    }

    await db.collection('engagements').doc(engagementId).update(updateData);

    res.json({
      message: 'Engagement status updated successfully',
      engagementId,
      status,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Error updating engagement status:', error);
    res.status(500).json({ 
      error: 'Failed to update engagement status',
      details: error.message 
    });
  }
});

// Delete engagement
router.delete('/:engagementId', async (req, res) => {
  try {
    const { engagementId } = req.params;
    const userId = req.user.uid;
    const userRole = req.user.role;

    // Check if engagement exists and user has permission
    const engagementDoc = await db.collection('engagements').doc(engagementId).get();
    
    if (!engagementDoc.exists) {
      return res.status(404).json({ error: 'Engagement not found' });
    }

    const engagementData = engagementDoc.data();

    // Only admin or creator can delete
    if (userRole !== 'admin' && engagementData.createdBy !== userId) {
      return res.status(403).json({ error: 'Access denied' });
    }

    // Soft delete by updating status
    await db.collection('engagements').doc(engagementId).update({
      status: 'deleted',
      deletedAt: admin.firestore.FieldValue.serverTimestamp(),
      deletedBy: userId,
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    });

    res.json({
      message: 'Engagement deleted successfully',
      engagementId
    });

  } catch (error) {
    console.error('Error deleting engagement:', error);
    res.status(500).json({ 
      error: 'Failed to delete engagement',
      details: error.message 
    });
  }
});

// Get engagement statistics
router.get('/stats/overview', async (req, res) => {
  try {
    const userId = req.user.uid;
    const userRole = req.user.role;

    let query = db.collection('engagements');
    
    // Role-based filtering
    if (userRole !== 'admin') {
      query = query.where('createdBy', '==', userId);
    }

    const engagementsSnapshot = await query.get();

    const stats = {
      total: 0,
      pending: 0,
      active: 0,
      completed: 0,
      cancelled: 0,
      totalRevenue: 0,
      averageDuration: 0,
      crmSynced: 0
    };

    let totalDurationDays = 0;
    let engagementsWithDuration = 0;

    engagementsSnapshot.forEach(doc => {
      const data = doc.data();
      
      if (data.status !== 'deleted') {
        stats.total++;
        
        switch (data.status) {
          case 'pending':
            stats.pending++;
            break;
          case 'active':
            stats.active++;
            break;
          case 'completed':
            stats.completed++;
            break;
          case 'cancelled':
            stats.cancelled++;
            break;
        }

        if (data.budget) {
          stats.totalRevenue += data.budget;
        }

        if (data.crmSynced) {
          stats.crmSynced++;
        }

        // Calculate duration if start and end dates are available
        if (data.startDate && data.endDate) {
          const duration = (data.endDate.toDate() - data.startDate.toDate()) / (1000 * 60 * 60 * 24);
          totalDurationDays += duration;
          engagementsWithDuration++;
        }
      }
    });

    if (engagementsWithDuration > 0) {
      stats.averageDuration = Math.round(totalDurationDays / engagementsWithDuration);
    }

    res.json(stats);

  } catch (error) {
    console.error('Error fetching engagement statistics:', error);
    res.status(500).json({ 
      error: 'Failed to fetch engagement statistics',
      details: error.message 
    });
  }
});

// Add timeline entry to engagement
router.post('/:engagementId/timeline', async (req, res) => {
  try {
    const { engagementId } = req.params;
    const { type, title, description, date } = req.body;

    if (!type || !title) {
      return res.status(400).json({ 
        error: 'Type and title are required' 
      });
    }

    const timelineEntry = {
      id: admin.firestore.FieldValue.serverTimestamp(),
      type, // 'milestone', 'note', 'status_change', 'meeting', etc.
      title,
      description,
      date: date ? new Date(date) : admin.firestore.FieldValue.serverTimestamp(),
      createdBy: req.user.uid,
      createdAt: admin.firestore.FieldValue.serverTimestamp()
    };

    // Add to engagement's timeline array
    await db.collection('engagements').doc(engagementId).update({
      timeline: admin.firestore.FieldValue.arrayUnion(timelineEntry),
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    });

    res.json({
      message: 'Timeline entry added successfully',
      engagementId,
      entry: timelineEntry
    });

  } catch (error) {
    console.error('Error adding timeline entry:', error);
    res.status(500).json({ 
      error: 'Failed to add timeline entry',
      details: error.message 
    });
  }
});

export default router; 