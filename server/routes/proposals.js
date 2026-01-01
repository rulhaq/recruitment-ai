/**
 * This is a product of Scalovate Systems Solutions.
 * All rights reserved.
 */

import express from 'express';
import admin from 'firebase-admin';
import groqService from '../services/groq.js';
import { PDFDocument, rgb } from 'pdf-lib';
import { v4 as uuidv4 } from 'uuid';

const router = express.Router();
const db = admin.firestore();
const bucket = admin.storage().bucket();

// Generate proposal
router.post('/generate', async (req, res) => {
  try {
    const {
      jobId,
      candidateId,
      clientName,
      projectTitle,
      duration,
      budget,
      startDate,
      requirements,
      additionalNotes
    } = req.body;

    if (!jobId || !candidateId || !clientName || !projectTitle) {
      return res.status(400).json({ 
        error: 'Missing required fields: jobId, candidateId, clientName, projectTitle' 
      });
    }

    // Get job details
    const jobDoc = await db.collection('jobs').doc(jobId).get();
    if (!jobDoc.exists) {
      return res.status(404).json({ error: 'Job not found' });
    }

    // Get candidate details
    const candidateDoc = await db.collection('candidates').doc(candidateId).get();
    if (!candidateDoc.exists) {
      return res.status(404).json({ error: 'Candidate not found' });
    }

    const jobData = jobDoc.data();
    const candidateData = candidateDoc.data();

    // Prepare data for AI proposal generation
    const engagementData = {
      clientName,
      projectTitle,
      candidateName: candidateData.name,
      candidateSkills: candidateData.skills?.join(', ') || 'Not specified',
      duration: duration || 'To be determined',
      budget: budget || 'To be discussed',
      requirements: requirements || jobData.description,
      startDate: startDate || 'ASAP',
      jobDescription: jobData.description,
      experienceLevel: jobData.experienceLevel || 'Mid-level',
      workType: jobData.workType || 'Remote'
    };

    // Generate proposal content using AI
    const proposalContent = await groqService.generateProposal(engagementData);

    // Create PDF document
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage([595, 842]); // A4 size

    const fontSize = 12;
    const titleFontSize = 18;
    const headingFontSize = 14;

    // Add title
    page.drawText('Staff Augmentation Proposal', {
      x: 50,
      y: 800,
      size: titleFontSize,
      color: rgb(0, 0, 0)
    });

    // Add content (simplified - in production, use proper PDF formatting)
    const lines = proposalContent.split('\n');
    let yPosition = 760;

    for (const line of lines.slice(0, 40)) { // Limit lines to fit page
      if (yPosition < 50) break;
      
      page.drawText(line.substring(0, 80), { // Limit line length
        x: 50,
        y: yPosition,
        size: fontSize,
        color: rgb(0, 0, 0)
      });
      yPosition -= 20;
    }

    // Save PDF
    const pdfBytes = await pdfDoc.save();
    const proposalId = uuidv4();
    const fileName = `proposals/${proposalId}_proposal.pdf`;

    // Upload PDF to Firebase Storage
    const file = bucket.file(fileName);
    await file.save(pdfBytes, {
      metadata: {
        contentType: 'application/pdf',
      },
    });

    await file.makePublic();
    const proposalUrl = `https://storage.googleapis.com/${bucket.name}/${fileName}`;

    // Create proposal record
    const proposalData = {
      id: proposalId,
      jobId,
      candidateId,
      clientName,
      projectTitle,
      candidateName: candidateData.name,
      duration,
      budget,
      startDate,
      content: proposalContent,
      pdfUrl: proposalUrl,
      status: 'draft',
      createdBy: req.user.uid,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    };

    const proposalRef = await db.collection('proposals').doc(proposalId);
    await proposalRef.set(proposalData);

    res.status(201).json({
      message: 'Proposal generated successfully',
      proposal: {
        id: proposalId,
        pdfUrl: proposalUrl,
        ...proposalData
      }
    });

  } catch (error) {
    console.error('Error generating proposal:', error);
    res.status(500).json({ 
      error: 'Failed to generate proposal',
      details: error.message 
    });
  }
});

// Get all proposals
router.get('/', async (req, res) => {
  try {
    const { page = 1, limit = 10, status, clientName } = req.query;
    const userId = req.user.uid;

    let query = db.collection('proposals');

    // Filter by user's proposals (created by user or for user's jobs)
    // In production, implement proper access control
    
    if (status) {
      query = query.where('status', '==', status);
    }

    const snapshot = await query
      .orderBy('createdAt', 'desc')
      .limit(parseInt(limit))
      .offset((parseInt(page) - 1) * parseInt(limit))
      .get();

    const proposals = [];
    snapshot.forEach(doc => {
      proposals.push({ id: doc.id, ...doc.data() });
    });

    res.json({
      proposals,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: snapshot.size
      }
    });

  } catch (error) {
    console.error('Error fetching proposals:', error);
    res.status(500).json({ 
      error: 'Failed to fetch proposals',
      details: error.message 
    });
  }
});

// Get single proposal
router.get('/:proposalId', async (req, res) => {
  try {
    const { proposalId } = req.params;

    const proposalDoc = await db.collection('proposals').doc(proposalId).get();
    
    if (!proposalDoc.exists) {
      return res.status(404).json({ error: 'Proposal not found' });
    }

    const proposalData = proposalDoc.data();

    res.json({
      id: proposalId,
      ...proposalData
    });

  } catch (error) {
    console.error('Error fetching proposal:', error);
    res.status(500).json({ 
      error: 'Failed to fetch proposal',
      details: error.message 
    });
  }
});

// Update proposal status
router.put('/:proposalId/status', async (req, res) => {
  try {
    const { proposalId } = req.params;
    const { status, notes } = req.body;

    const validStatuses = ['draft', 'sent', 'approved', 'rejected', 'expired'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ 
        error: 'Invalid status. Must be one of: ' + validStatuses.join(', ')
      });
    }

    const updateData = {
      status,
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    };

    if (notes) updateData.notes = notes;
    if (status === 'sent') updateData.sentAt = admin.firestore.FieldValue.serverTimestamp();
    if (status === 'approved') updateData.approvedAt = admin.firestore.FieldValue.serverTimestamp();

    await db.collection('proposals').doc(proposalId).update(updateData);

    res.json({
      message: 'Proposal status updated successfully',
      proposalId,
      status
    });

  } catch (error) {
    console.error('Error updating proposal status:', error);
    res.status(500).json({ 
      error: 'Failed to update proposal status',
      details: error.message 
    });
  }
});

// Delete proposal
router.delete('/:proposalId', async (req, res) => {
  try {
    const { proposalId } = req.params;

    // Get proposal data to delete associated files
    const proposalDoc = await db.collection('proposals').doc(proposalId).get();
    
    if (!proposalDoc.exists) {
      return res.status(404).json({ error: 'Proposal not found' });
    }

    const proposalData = proposalDoc.data();

    // Delete PDF file from storage
    if (proposalData.pdfUrl) {
      try {
        const fileName = `proposals/${proposalId}_proposal.pdf`;
        await bucket.file(fileName).delete();
      } catch (fileError) {
        console.warn('Failed to delete proposal PDF:', fileError);
      }
    }

    // Delete proposal record
    await db.collection('proposals').doc(proposalId).delete();

    res.json({
      message: 'Proposal deleted successfully',
      proposalId
    });

  } catch (error) {
    console.error('Error deleting proposal:', error);
    res.status(500).json({ 
      error: 'Failed to delete proposal',
      details: error.message 
    });
  }
});

// Regenerate proposal with updated content
router.post('/:proposalId/regenerate', async (req, res) => {
  try {
    const { proposalId } = req.params;
    const { updates } = req.body; // Optional updates to proposal data

    // Get existing proposal
    const proposalDoc = await db.collection('proposals').doc(proposalId).get();
    
    if (!proposalDoc.exists) {
      return res.status(404).json({ error: 'Proposal not found' });
    }

    const existingData = proposalDoc.data();

    // Get job and candidate data
    const jobDoc = await db.collection('jobs').doc(existingData.jobId).get();
    const candidateDoc = await db.collection('candidates').doc(existingData.candidateId).get();

    if (!jobDoc.exists || !candidateDoc.exists) {
      return res.status(404).json({ error: 'Job or candidate not found' });
    }

    const jobData = jobDoc.data();
    const candidateData = candidateDoc.data();

    // Merge existing data with updates
    const engagementData = {
      clientName: updates?.clientName || existingData.clientName,
      projectTitle: updates?.projectTitle || existingData.projectTitle,
      candidateName: candidateData.name,
      candidateSkills: candidateData.skills?.join(', ') || 'Not specified',
      duration: updates?.duration || existingData.duration,
      budget: updates?.budget || existingData.budget,
      requirements: updates?.requirements || jobData.description,
      startDate: updates?.startDate || existingData.startDate,
      jobDescription: jobData.description,
      experienceLevel: jobData.experienceLevel || 'Mid-level',
      workType: jobData.workType || 'Remote'
    };

    // Generate new proposal content
    const proposalContent = await groqService.generateProposal(engagementData);

    // Create new PDF
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage([595, 842]);

    const fontSize = 12;
    const titleFontSize = 18;

    page.drawText('Staff Augmentation Proposal (Updated)', {
      x: 50,
      y: 800,
      size: titleFontSize,
      color: rgb(0, 0, 0)
    });

    const lines = proposalContent.split('\n');
    let yPosition = 760;

    for (const line of lines.slice(0, 40)) {
      if (yPosition < 50) break;
      
      page.drawText(line.substring(0, 80), {
        x: 50,
        y: yPosition,
        size: fontSize,
        color: rgb(0, 0, 0)
      });
      yPosition -= 20;
    }

    const pdfBytes = await pdfDoc.save();
    const fileName = `proposals/${proposalId}_proposal.pdf`;

    // Replace existing PDF
    const file = bucket.file(fileName);
    await file.save(pdfBytes, {
      metadata: {
        contentType: 'application/pdf',
      },
    });

    // Update proposal record
    const updateData = {
      ...updates,
      content: proposalContent,
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      regeneratedAt: admin.firestore.FieldValue.serverTimestamp()
    };

    await db.collection('proposals').doc(proposalId).update(updateData);

    res.json({
      message: 'Proposal regenerated successfully',
      proposalId,
      content: proposalContent
    });

  } catch (error) {
    console.error('Error regenerating proposal:', error);
    res.status(500).json({ 
      error: 'Failed to regenerate proposal',
      details: error.message 
    });
  }
});

export default router; 