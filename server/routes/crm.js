/**
 * This is a product of Scalovate Systems Solutions.
 * All rights reserved.
 */

import express from 'express';
import admin from 'firebase-admin';
import xmlrpc from 'node-xmlrpc';

const router = express.Router();
const db = admin.firestore();

// Odoo CRM configuration
const odooConfig = {
  url: process.env.ODOO_URL || 'http://localhost:8069',
  database: process.env.ODOO_DATABASE || 'odoo',
  username: process.env.ODOO_USERNAME,
  password: process.env.ODOO_PASSWORD,
};

class OdooService {
  constructor() {
    this.uid = null;
    this.authenticated = false;
  }

  async authenticate() {
    if (this.authenticated) return this.uid;

    return new Promise((resolve, reject) => {
      const client = xmlrpc.createClient({
        host: new URL(odooConfig.url).hostname,
        port: new URL(odooConfig.url).port || 80,
        path: '/xmlrpc/2/common'
      });

      client.methodCall('authenticate', [
        odooConfig.database,
        odooConfig.username,
        odooConfig.password,
        {}
      ], (error, uid) => {
        if (error) {
          reject(new Error(`Odoo authentication failed: ${error.message}`));
        } else if (!uid) {
          reject(new Error('Invalid Odoo credentials'));
        } else {
          this.uid = uid;
          this.authenticated = true;
          resolve(uid);
        }
      });
    });
  }

  async executeMethod(model, method, args = [], kwargs = {}) {
    await this.authenticate();

    return new Promise((resolve, reject) => {
      const client = xmlrpc.createClient({
        host: new URL(odooConfig.url).hostname,
        port: new URL(odooConfig.url).port || 80,
        path: '/xmlrpc/2/object'
      });

      client.methodCall('execute_kw', [
        odooConfig.database,
        this.uid,
        odooConfig.password,
        model,
        method,
        args,
        kwargs
      ], (error, result) => {
        if (error) {
          reject(new Error(`Odoo method call failed: ${error.message}`));
        } else {
          resolve(result);
        }
      });
    });
  }

  async createLead(leadData) {
    const odooLeadData = {
      name: leadData.name,
      partner_name: leadData.clientName,
      email_from: leadData.email,
      phone: leadData.phone || '',
      description: leadData.description,
      tag_ids: leadData.tags || [],
      user_id: 1, // Assign to admin by default
      stage_id: 1, // New lead stage
    };

    return await this.executeMethod('crm.lead', 'create', [odooLeadData]);
  }

  async createContact(contactData) {
    const odooContactData = {
      name: contactData.name,
      email: contactData.email,
      phone: contactData.phone || '',
      is_company: contactData.isCompany || false,
      customer_rank: 1,
      supplier_rank: 0,
    };

    return await this.executeMethod('res.partner', 'create', [odooContactData]);
  }

  async createOpportunity(opportunityData) {
    const odooOpportunityData = {
      name: opportunityData.name,
      partner_id: opportunityData.partnerId,
      expected_revenue: parseFloat(opportunityData.budget) || 0,
      probability: opportunityData.probability || 50,
      description: opportunityData.description,
      date_deadline: opportunityData.deadline,
      user_id: 1,
      stage_id: 1,
    };

    return await this.executeMethod('crm.lead', 'create', [odooOpportunityData]);
  }

  async updateRecord(model, recordId, updateData) {
    return await this.executeMethod(model, 'write', [[recordId], updateData]);
  }

  async searchRecords(model, domain = [], fields = []) {
    const ids = await this.executeMethod(model, 'search', [domain]);
    if (ids.length === 0) return [];
    
    return await this.executeMethod(model, 'read', [ids, fields]);
  }
}

const odooService = new OdooService();

// Sync engagement to CRM as opportunity
router.post('/sync-engagement', async (req, res) => {
  try {
    const { engagementId } = req.body;

    if (!engagementId) {
      return res.status(400).json({ error: 'Engagement ID is required' });
    }

    // Get engagement data
    const engagementDoc = await db.collection('engagements').doc(engagementId).get();
    if (!engagementDoc.exists) {
      return res.status(404).json({ error: 'Engagement not found' });
    }

    const engagementData = engagementDoc.data();

    // Get related job and candidate data
    const jobDoc = await db.collection('jobs').doc(engagementData.jobId).get();
    const candidateDoc = await db.collection('candidates').doc(engagementData.candidateId).get();

    if (!jobDoc.exists || !candidateDoc.exists) {
      return res.status(404).json({ error: 'Related job or candidate not found' });
    }

    const jobData = jobDoc.data();
    const candidateData = candidateDoc.data();

    // Create or find contact in Odoo
    let contactId;
    const existingContacts = await odooService.searchRecords(
      'res.partner',
      [['email', '=', engagementData.clientEmail || 'unknown@example.com']],
      ['id', 'name', 'email']
    );

    if (existingContacts.length > 0) {
      contactId = existingContacts[0].id;
    } else {
      contactId = await odooService.createContact({
        name: engagementData.clientName || 'Unknown Client',
        email: engagementData.clientEmail || 'unknown@example.com',
        phone: engagementData.clientPhone || '',
        isCompany: true
      });
    }

    // Create opportunity in Odoo
    const opportunityData = {
      name: `Staff Aug: ${jobData.title} - ${candidateData.name}`,
      partnerId: contactId,
      budget: engagementData.budget || jobData.budget || '0',
      probability: engagementData.status === 'active' ? 75 : 25,
      description: `
Job: ${jobData.title}
Candidate: ${candidateData.name}
Skills: ${candidateData.skills?.join(', ') || 'Not specified'}
Duration: ${engagementData.duration || 'TBD'}
Requirements: ${jobData.description}
      `.trim(),
      deadline: engagementData.endDate
    };

    const opportunityId = await odooService.createOpportunity(opportunityData);

    // Update engagement with CRM reference
    await db.collection('engagements').doc(engagementId).update({
      crmSynced: true,
      crmOpportunityId: opportunityId,
      crmContactId: contactId,
      crmSyncedAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    });

    res.json({
      message: 'Engagement synced to CRM successfully',
      engagementId,
      crmOpportunityId: opportunityId,
      crmContactId: contactId
    });

  } catch (error) {
    console.error('Error syncing engagement to CRM:', error);
    res.status(500).json({ 
      error: 'Failed to sync engagement to CRM',
      details: error.message 
    });
  }
});

// Sync all unsynced engagements
router.post('/sync-all', async (req, res) => {
  try {
    // Get all unsynced engagements
    const unsyncedSnapshot = await db.collection('engagements')
      .where('crmSynced', '==', false)
      .limit(20) // Process in batches
      .get();

    const results = [];
    const errors = [];

    for (const doc of unsyncedSnapshot.docs) {
      try {
        const engagementId = doc.id;
        const engagementData = doc.data();

        // Get related data
        const jobDoc = await db.collection('jobs').doc(engagementData.jobId).get();
        const candidateDoc = await db.collection('candidates').doc(engagementData.candidateId).get();

        if (!jobDoc.exists || !candidateDoc.exists) {
          errors.push({ engagementId, error: 'Related job or candidate not found' });
          continue;
        }

        const jobData = jobDoc.data();
        const candidateData = candidateDoc.data();

        // Create contact and opportunity
        let contactId;
        const existingContacts = await odooService.searchRecords(
          'res.partner',
          [['email', '=', engagementData.clientEmail || 'unknown@example.com']],
          ['id']
        );

        if (existingContacts.length > 0) {
          contactId = existingContacts[0].id;
        } else {
          contactId = await odooService.createContact({
            name: engagementData.clientName || 'Unknown Client',
            email: engagementData.clientEmail || 'unknown@example.com',
            isCompany: true
          });
        }

        const opportunityId = await odooService.createOpportunity({
          name: `Staff Aug: ${jobData.title} - ${candidateData.name}`,
          partnerId: contactId,
          budget: engagementData.budget || '0',
          probability: 50,
          description: `Job: ${jobData.title}\nCandidate: ${candidateData.name}`
        });

        // Update engagement
        await db.collection('engagements').doc(engagementId).update({
          crmSynced: true,
          crmOpportunityId: opportunityId,
          crmContactId: contactId,
          crmSyncedAt: admin.firestore.FieldValue.serverTimestamp()
        });

        results.push({ engagementId, opportunityId, contactId });

      } catch (error) {
        errors.push({ engagementId: doc.id, error: error.message });
      }
    }

    res.json({
      message: 'Batch sync completed',
      synced: results.length,
      errors: errors.length,
      results,
      errors
    });

  } catch (error) {
    console.error('Error in batch CRM sync:', error);
    res.status(500).json({ 
      error: 'Failed to sync engagements to CRM',
      details: error.message 
    });
  }
});

// Update CRM opportunity status
router.put('/opportunity/:opportunityId/status', async (req, res) => {
  try {
    const { opportunityId } = req.params;
    const { status, probability, notes } = req.body;

    const updateData = {};

    if (status === 'won') {
      updateData.stage_id = 4; // Won stage (adjust based on your Odoo setup)
      updateData.probability = 100;
    } else if (status === 'lost') {
      updateData.stage_id = 5; // Lost stage
      updateData.probability = 0;
    } else if (probability !== undefined) {
      updateData.probability = probability;
    }

    if (notes) {
      updateData.description = notes;
    }

    await odooService.updateRecord('crm.lead', parseInt(opportunityId), updateData);

    res.json({
      message: 'CRM opportunity updated successfully',
      opportunityId,
      updates: updateData
    });

  } catch (error) {
    console.error('Error updating CRM opportunity:', error);
    res.status(500).json({ 
      error: 'Failed to update CRM opportunity',
      details: error.message 
    });
  }
});

// Get CRM sync status
router.get('/sync-status', async (req, res) => {
  try {
    // Get sync statistics
    const totalEngagements = await db.collection('engagements').get();
    const syncedEngagements = await db.collection('engagements')
      .where('crmSynced', '==', true)
      .get();

    const stats = {
      total: totalEngagements.size,
      synced: syncedEngagements.size,
      unsynced: totalEngagements.size - syncedEngagements.size,
      syncRate: totalEngagements.size > 0 ? 
        (syncedEngagements.size / totalEngagements.size * 100).toFixed(2) : 0
    };

    // Test CRM connection
    let crmStatus = 'disconnected';
    try {
      await odooService.authenticate();
      crmStatus = 'connected';
    } catch (error) {
      crmStatus = 'error';
    }

    res.json({
      syncStats: stats,
      crmStatus,
      lastSync: new Date().toISOString()
    });

  } catch (error) {
    console.error('Error getting sync status:', error);
    res.status(500).json({ 
      error: 'Failed to get sync status',
      details: error.message 
    });
  }
});

// Test CRM connection
router.get('/test-connection', async (req, res) => {
  try {
    const uid = await odooService.authenticate();
    
    // Try to fetch a simple record to test the connection
    const testRecords = await odooService.searchRecords(
      'res.partner',
      [['is_company', '=', true]],
      ['name']
    );

    res.json({
      status: 'connected',
      message: 'CRM connection successful',
      uid,
      testRecordsCount: testRecords.length
    });

  } catch (error) {
    console.error('CRM connection test failed:', error);
    res.status(500).json({
      status: 'failed',
      error: 'CRM connection failed',
      details: error.message
    });
  }
});

export default router; 