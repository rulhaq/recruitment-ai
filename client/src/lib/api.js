/**
 * This is a product of Scalovate Systems Solutions.
 * All rights reserved.
 */

import axios from 'axios';
import { authService } from './firebase';

// Create axios instance
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  async (config) => {
    const token = await authService.getCurrentUserToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Only log out on actual authentication errors, not network/server errors
    if (error.response?.status === 401 && error.response?.data?.message?.includes('token')) {
      // Token expired or invalid
      console.log('Authentication token invalid, signing out...');
      authService.signOut();
      window.location.href = '/login';
    } else if (error.code === 'ECONNREFUSED' || error.code === 'ERR_NETWORK') {
      // Server not available - don't log out user
      console.log('Server not available:', error.message);
    }
    return Promise.reject(error);
  }
);

// API service functions
export const apiService = {
  // Auth endpoints
  auth: {
    async createProfile(userData) {
      const response = await api.post('/api/auth/create-profile', userData);
      return response.data;
    },

    async getProfile(uid) {
      const response = await api.get(`/api/auth/profile/${uid}`);
      return response.data;
    },

    async updateProfile(uid, updates) {
      const response = await api.put(`/api/auth/profile/${uid}`, updates);
      return response.data;
    },

    async verifyToken(token) {
      const response = await api.post('/api/auth/verify', { token });
      return response.data;
    }
  },

  // Job matching endpoints
  match: {
    async findCandidates(jobData) {
      const response = await api.post('/api/match', jobData);
      return response.data;
    },

    async getMatchingResults(jobId) {
      const response = await api.get(`/api/match/job/${jobId}`);
      return response.data;
    },

    async getUserJobs(params = {}) {
      const response = await api.get('/api/match/jobs', { params });
      return response.data;
    },

    async updateJobStatus(jobId, status) {
      const response = await api.put(`/api/match/job/${jobId}/status`, { status });
      return response.data;
    },

    async rematchCandidates(jobId) {
      const response = await api.post(`/api/match/job/${jobId}/rematch`);
      return response.data;
    },

    async getStats() {
      const response = await api.get('/api/match/stats');
      return response.data;
    }
  },

  // CV management endpoints
  cv: {
    async uploadCV(formData) {
      const response = await api.post('/api/cv/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    },

    async summarizeCV(candidateId) {
      const response = await api.post(`/api/cv/summarize/${candidateId}`);
      return response.data;
    },

    async getCandidates(params = {}) {
      const response = await api.get('/api/cv/candidates', { params });
      return response.data;
    },

    async getCandidate(candidateId) {
      const response = await api.get(`/api/cv/candidate/${candidateId}`);
      return response.data;
    },

    async updateCandidate(candidateId, updates) {
      const response = await api.put(`/api/cv/candidate/${candidateId}`, updates);
      return response.data;
    },

    async deleteCandidate(candidateId) {
      const response = await api.delete(`/api/cv/candidate/${candidateId}`);
      return response.data;
    },

    async searchCandidates(searchData) {
      const response = await api.post('/api/cv/search', searchData);
      return response.data;
    }
  },

  // Proposal endpoints
  proposals: {
    async generateProposal(proposalData) {
      const response = await api.post('/api/proposals/generate', proposalData);
      return response.data;
    },

    async getProposals(params = {}) {
      const response = await api.get('/api/proposals', { params });
      return response.data;
    },

    async getProposal(proposalId) {
      const response = await api.get(`/api/proposals/${proposalId}`);
      return response.data;
    },

    async updateProposalStatus(proposalId, status, notes) {
      const response = await api.put(`/api/proposals/${proposalId}/status`, {
        status,
        notes
      });
      return response.data;
    },

    async deleteProposal(proposalId) {
      const response = await api.delete(`/api/proposals/${proposalId}`);
      return response.data;
    },

    async regenerateProposal(proposalId, updates) {
      const response = await api.post(`/api/proposals/${proposalId}/regenerate`, {
        updates
      });
      return response.data;
    }
  },

  // Engagement endpoints
  engagements: {
    async createEngagement(engagementData) {
      const response = await api.post('/api/engagements', engagementData);
      return response.data;
    },

    async getEngagements(params = {}) {
      const response = await api.get('/api/engagements', { params });
      return response.data;
    },

    async getEngagement(engagementId) {
      const response = await api.get(`/api/engagements/${engagementId}`);
      return response.data;
    },

    async updateEngagement(engagementId, updates) {
      const response = await api.put(`/api/engagements/${engagementId}`, updates);
      return response.data;
    },

    async updateEngagementStatus(engagementId, status, notes) {
      const response = await api.put(`/api/engagements/${engagementId}/status`, {
        status,
        notes
      });
      return response.data;
    },

    async deleteEngagement(engagementId) {
      const response = await api.delete(`/api/engagements/${engagementId}`);
      return response.data;
    },

    async getStats() {
      const response = await api.get('/api/engagements/stats/overview');
      return response.data;
    },

    async addTimelineEntry(engagementId, entry) {
      const response = await api.post(`/api/engagements/${engagementId}/timeline`, entry);
      return response.data;
    }
  },

  // CRM integration endpoints
  crm: {
    async syncEngagement(engagementId) {
      const response = await api.post('/api/crm/sync-engagement', { engagementId });
      return response.data;
    },

    async syncAll() {
      const response = await api.post('/api/crm/sync-all');
      return response.data;
    },

    async updateOpportunityStatus(opportunityId, status, probability, notes) {
      const response = await api.put(`/api/crm/opportunity/${opportunityId}/status`, {
        status,
        probability,
        notes
      });
      return response.data;
    },

    async getSyncStatus() {
      const response = await api.get('/api/crm/sync-status');
      return response.data;
    },

    async testConnection() {
      const response = await api.get('/api/crm/test-connection');
      return response.data;
    }
  }
};

// Utility functions
export const apiUtils = {
  // Handle API errors consistently
  handleError(error) {
    if (error.response) {
      // Server responded with error status
      const message = error.response.data?.error || error.response.data?.message || 'An error occurred';
      return {
        message,
        status: error.response.status,
        details: error.response.data
      };
    } else if (error.request) {
      // Request made but no response
      return {
        message: 'Network error. Please check your connection.',
        status: 0,
        details: error.request
      };
    } else {
      // Something else happened
      return {
        message: error.message || 'An unexpected error occurred',
        status: -1,
        details: error
      };
    }
  },

  // Format API response
  formatResponse(data, message = 'Success') {
    return {
      success: true,
      message,
      data
    };
  },

  // Upload file with progress
  async uploadWithProgress(endpoint, formData, onProgress) {
    const response = await api.post(endpoint, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress: (progressEvent) => {
        const percentCompleted = Math.round(
          (progressEvent.loaded * 100) / progressEvent.total
        );
        onProgress?.(percentCompleted);
      }
    });
    return response.data;
  }
};

export default api; 