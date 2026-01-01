/**
 * This is a product of Scalovate Systems Solutions.
 * All rights reserved.
 */

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { apiService } from '../lib/api';
import { 
  BriefcaseIcon,
  PlusIcon,
  CalendarIcon,
  ClockIcon,
  UserGroupIcon,
  BanknotesIcon,
  CheckCircleIcon,
  PlayIcon,
  PauseIcon,
  StopIcon,
  ExclamationTriangleIcon,
  ChartBarIcon,
  ArrowPathIcon,
  EyeIcon,
  PencilIcon,
  TrashIcon,
  ArrowRightIcon
} from '@heroicons/react/24/outline';
import LoadingSpinner from '../components/LoadingSpinner';

const Engagements = () => {
  const { userProfile } = useAuth();
  const [loading, setLoading] = useState(false);
  const [engagements, setEngagements] = useState([]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [selectedEngagement, setSelectedEngagement] = useState(null);
  const [filter, setFilter] = useState('all');
  const [syncStatus, setSyncStatus] = useState({});

  // Form state for creating engagements
  const [formData, setFormData] = useState({
    title: '',
    clientName: '',
    description: '',
    startDate: '',
    endDate: '',
    budget: '',
    teamMembers: '',
    status: 'planning',
    priority: 'medium'
  });

  useEffect(() => {
    fetchEngagements();
    fetchSyncStatus();
  }, [filter]);

  const fetchEngagements = async () => {
    try {
      setLoading(true);
      const params = filter !== 'all' ? { status: filter } : {};
      const response = await apiService.engagements.getEngagements(params);
      setEngagements(response.data || []);
    } catch (error) {
      console.error('Error fetching engagements:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchSyncStatus = async () => {
    try {
      const response = await apiService.crm.getSyncStatus();
      setSyncStatus(response.data || {});
    } catch (error) {
      console.error('Error fetching sync status:', error);
    }
  };

  const handleCreateEngagement = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const engagementData = {
        ...formData,
        teamMembers: formData.teamMembers.split(',').map(member => member.trim()),
        createdBy: userProfile.uid
      };

      const response = await apiService.engagements.createEngagement(engagementData);
      
      if (response.success) {
        await fetchEngagements();
        setShowCreateForm(false);
        setFormData({
          title: '',
          clientName: '',
          description: '',
          startDate: '',
          endDate: '',
          budget: '',
          teamMembers: '',
          status: 'planning',
          priority: 'medium'
        });
      }
    } catch (error) {
      console.error('Error creating engagement:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (engagementId, status, notes = '') => {
    try {
      await apiService.engagements.updateEngagementStatus(engagementId, status, notes);
      await fetchEngagements();
      if (selectedEngagement?.id === engagementId) {
        const response = await apiService.engagements.getEngagement(engagementId);
        setSelectedEngagement(response.data);
      }
    } catch (error) {
      console.error('Error updating engagement status:', error);
    }
  };

  const handleSyncTocrm = async (engagementId) => {
    try {
      setLoading(true);
      await apiService.crm.syncEngagement(engagementId);
      await fetchSyncStatus();
    } catch (error) {
      console.error('Error syncing to CRM:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSyncAll = async () => {
    try {
      setLoading(true);
      await apiService.crm.syncAll();
      await fetchSyncStatus();
    } catch (error) {
      console.error('Error syncing all to CRM:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'planning':
        return <ClockIcon className="w-4 h-4 text-blue-500" />;
      case 'active':
        return <PlayIcon className="w-4 h-4 text-green-500" />;
      case 'paused':
        return <PauseIcon className="w-4 h-4 text-yellow-500" />;
      case 'completed':
        return <CheckCircleIcon className="w-4 h-4 text-green-600" />;
      case 'cancelled':
        return <StopIcon className="w-4 h-4 text-red-500" />;
      case 'at-risk':
        return <ExclamationTriangleIcon className="w-4 h-4 text-orange-500" />;
      default:
        return <ClockIcon className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'planning':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400';
      case 'active':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      case 'paused':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400';
      case 'completed':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      case 'cancelled':
        return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';
      case 'at-risk':
        return 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high':
        return 'text-red-600';
      case 'medium':
        return 'text-yellow-600';
      case 'low':
        return 'text-green-600';
      default:
        return 'text-gray-600';
    }
  };

  const calculateProgress = (engagement) => {
    if (!engagement.timeline?.length) return 0;
    const completed = engagement.timeline.filter(item => item.status === 'completed').length;
    return Math.round((completed / engagement.timeline.length) * 100);
  };

  const filteredEngagements = engagements.filter(engagement => {
    if (filter === 'all') return true;
    return engagement.status === filter;
  });

  // Engagement detail view
  if (selectedEngagement) {
    const progress = calculateProgress(selectedEngagement);
    
    return (
      <div className="min-h-screen bg-background">
        {/* Header */}
        <header className="border-b border-border bg-card">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => setSelectedEngagement(null)}
                  className="btn btn-ghost btn-sm"
                >
                  ← Back to Engagements
                </button>
                <h1 className="text-2xl font-bold text-foreground">{selectedEngagement.title}</h1>
              </div>
              
              <div className="flex items-center space-x-2">
                <select
                  value={selectedEngagement.status}
                  onChange={(e) => handleUpdateStatus(selectedEngagement.id, e.target.value)}
                  className="px-3 py-1 border border-border rounded-md text-sm"
                >
                  <option value="planning">Planning</option>
                  <option value="active">Active</option>
                  <option value="paused">Paused</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                  <option value="at-risk">At Risk</option>
                </select>
                
                <button
                  onClick={() => handleSyncTocrm(selectedEngagement.id)}
                  disabled={loading}
                  className="btn btn-outline btn-sm"
                >
                  {loading ? <LoadingSpinner size="sm" /> : <ArrowPathIcon className="w-4 h-4" />}
                  Sync to CRM
                </button>
              </div>
            </div>
          </div>
        </header>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Project Info */}
            <div className="lg:col-span-1">
              <div className="card p-6 sticky top-8">
                <h3 className="text-lg font-semibold mb-4">Project Details</h3>
                
                <div className="space-y-4">
                  <div>
                    <span className="text-sm text-muted-foreground">Client</span>
                    <p className="font-medium">{selectedEngagement.clientName}</p>
                  </div>
                  
                  <div>
                    <span className="text-sm text-muted-foreground">Status</span>
                    <div className="flex items-center mt-1">
                      {getStatusIcon(selectedEngagement.status)}
                      <span className={`ml-2 px-2 py-1 text-xs rounded-full ${getStatusColor(selectedEngagement.status)}`}>
                        {selectedEngagement.status}
                      </span>
                    </div>
                  </div>
                  
                  <div>
                    <span className="text-sm text-muted-foreground">Priority</span>
                    <p className={`font-medium ${getPriorityColor(selectedEngagement.priority)}`}>
                      {selectedEngagement.priority?.charAt(0).toUpperCase() + selectedEngagement.priority?.slice(1)}
                    </p>
                  </div>
                  
                  <div>
                    <span className="text-sm text-muted-foreground">Budget</span>
                    <p className="font-medium">{selectedEngagement.budget}</p>
                  </div>
                  
                  <div>
                    <span className="text-sm text-muted-foreground">Duration</span>
                    <p className="font-medium">
                      {new Date(selectedEngagement.startDate).toLocaleDateString()} - {new Date(selectedEngagement.endDate).toLocaleDateString()}
                    </p>
                  </div>
                  
                  <div>
                    <span className="text-sm text-muted-foreground">Progress</span>
                    <div className="mt-2">
                      <div className="flex items-center justify-between text-sm">
                        <span>{progress}% Complete</span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2 mt-1">
                        <div 
                          className="bg-primary rounded-full h-2 transition-all duration-300"
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {selectedEngagement.teamMembers?.length > 0 && (
                  <div className="mt-6">
                    <h4 className="text-sm font-medium mb-3">Team Members</h4>
                    <div className="space-y-2">
                      {selectedEngagement.teamMembers.map((member, index) => (
                        <div key={index} className="flex items-center space-x-2">
                          <div className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center">
                            <span className="text-xs font-medium text-primary">
                              {member.charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <span className="text-sm">{member}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Timeline & Updates */}
            <div className="lg:col-span-2 space-y-6">
              
              {/* Description */}
              <div className="card p-6">
                <h3 className="text-lg font-semibold mb-4">Project Description</h3>
                <p className="text-muted-foreground leading-relaxed">
                  {selectedEngagement.description}
                </p>
              </div>

              {/* Timeline */}
              {selectedEngagement.timeline?.length > 0 && (
                <div className="card p-6">
                  <h3 className="text-lg font-semibold mb-4">Project Timeline</h3>
                  <div className="space-y-4">
                    {selectedEngagement.timeline.map((item, index) => (
                      <div key={index} className="flex items-start space-x-4">
                        <div className="flex-shrink-0 mt-1">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                            item.status === 'completed' 
                              ? 'bg-green-100 text-green-600' 
                              : item.status === 'in-progress'
                              ? 'bg-blue-100 text-blue-600'
                              : 'bg-gray-100 text-gray-600'
                          }`}>
                            {item.status === 'completed' ? (
                              <CheckCircleIcon className="w-4 h-4" />
                            ) : (
                              <span className="text-xs font-medium">{index + 1}</span>
                            )}
                          </div>
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium">{item.title}</h4>
                          <p className="text-sm text-muted-foreground mt-1">{item.description}</p>
                          <div className="flex items-center space-x-4 mt-2 text-xs text-muted-foreground">
                            <span>Due: {new Date(item.dueDate).toLocaleDateString()}</span>
                            <span className={`px-2 py-1 rounded ${
                              item.status === 'completed' ? 'bg-green-100 text-green-800' :
                              item.status === 'in-progress' ? 'bg-blue-100 text-blue-800' :
                              'bg-gray-100 text-gray-800'
                            }`}>
                              {item.status}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Recent Activity */}
              {selectedEngagement.activities?.length > 0 && (
                <div className="card p-6">
                  <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
                  <div className="space-y-3">
                    {selectedEngagement.activities.slice(0, 5).map((activity, index) => (
                      <div key={index} className="flex items-start space-x-3">
                        <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                        <div className="flex-1">
                          <p className="text-sm">{activity.description}</p>
                          <p className="text-xs text-muted-foreground mt-1">
                            {new Date(activity.timestamp).toLocaleString()}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-bold text-foreground">Engagements</h1>
              <span className="text-sm text-muted-foreground">
                ({filteredEngagements.length} projects)
              </span>
            </div>
            
            <div className="flex items-center space-x-2">
              <button
                onClick={handleSyncAll}
                disabled={loading}
                className="btn btn-outline btn-sm"
              >
                {loading ? <LoadingSpinner size="sm" /> : <ArrowPathIcon className="w-4 h-4" />}
                Sync All to CRM
              </button>
              
              <button
                onClick={() => setShowCreateForm(true)}
                className="btn btn-primary"
              >
                <PlusIcon className="w-4 h-4 mr-2" />
                New Engagement
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="card p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <BriefcaseIcon className="w-8 h-8 text-blue-500" />
              </div>
              <div className="ml-4">
                <p className="text-2xl font-semibold">
                  {engagements.filter(e => e.status === 'active').length}
                </p>
                <p className="text-sm text-muted-foreground">Active Projects</p>
              </div>
            </div>
          </div>
          
          <div className="card p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <ChartBarIcon className="w-8 h-8 text-green-500" />
              </div>
              <div className="ml-4">
                <p className="text-2xl font-semibold">
                  {engagements.filter(e => e.status === 'completed').length}
                </p>
                <p className="text-sm text-muted-foreground">Completed</p>
              </div>
            </div>
          </div>
          
          <div className="card p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <ExclamationTriangleIcon className="w-8 h-8 text-orange-500" />
              </div>
              <div className="ml-4">
                <p className="text-2xl font-semibold">
                  {engagements.filter(e => e.status === 'at-risk').length}
                </p>
                <p className="text-sm text-muted-foreground">At Risk</p>
              </div>
            </div>
          </div>
          
          <div className="card p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <BanknotesIcon className="w-8 h-8 text-purple-500" />
              </div>
              <div className="ml-4">
                <p className="text-2xl font-semibold">
                  ${engagements.reduce((sum, e) => sum + (parseFloat(e.budget?.replace(/[^0-9.-]+/g, "")) || 0), 0).toLocaleString()}
                </p>
                <p className="text-sm text-muted-foreground">Total Value</p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="mb-8">
          <div className="flex items-center space-x-4">
            <span className="text-sm font-medium">Filter by status:</span>
            <div className="flex space-x-2">
              {['all', 'planning', 'active', 'paused', 'completed', 'cancelled', 'at-risk'].map((status) => (
                <button
                  key={status}
                  onClick={() => setFilter(status)}
                  className={`px-3 py-1 text-sm rounded-md transition-colors ${
                    filter === status
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted hover:bg-muted/80'
                  }`}
                >
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Create Engagement Modal */}
        {showCreateForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="card p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold">Create New Engagement</h3>
                <button
                  onClick={() => setShowCreateForm(false)}
                  className="btn btn-ghost btn-sm"
                >
                  ×
                </button>
              </div>

              <form onSubmit={handleCreateEngagement} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Project Title</label>
                    <input
                      type="text"
                      value={formData.title}
                      onChange={(e) => setFormData({...formData, title: e.target.value})}
                      className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Client Name</label>
                    <input
                      type="text"
                      value={formData.clientName}
                      onChange={(e) => setFormData({...formData, clientName: e.target.value})}
                      className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Description</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary h-24"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Start Date</label>
                    <input
                      type="date"
                      value={formData.startDate}
                      onChange={(e) => setFormData({...formData, startDate: e.target.value})}
                      className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">End Date</label>
                    <input
                      type="date"
                      value={formData.endDate}
                      onChange={(e) => setFormData({...formData, endDate: e.target.value})}
                      className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Budget</label>
                    <input
                      type="text"
                      value={formData.budget}
                      onChange={(e) => setFormData({...formData, budget: e.target.value})}
                      className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder="$50,000"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Status</label>
                    <select
                      value={formData.status}
                      onChange={(e) => setFormData({...formData, status: e.target.value})}
                      className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                      <option value="planning">Planning</option>
                      <option value="active">Active</option>
                      <option value="paused">Paused</option>
                      <option value="completed">Completed</option>
                      <option value="cancelled">Cancelled</option>
                      <option value="at-risk">At Risk</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Priority</label>
                    <select
                      value={formData.priority}
                      onChange={(e) => setFormData({...formData, priority: e.target.value})}
                      className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Team Members</label>
                  <input
                    type="text"
                    value={formData.teamMembers}
                    onChange={(e) => setFormData({...formData, teamMembers: e.target.value})}
                    className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="John Doe, Jane Smith, Bob Johnson (comma separated)"
                  />
                </div>

                <div className="flex justify-end space-x-4">
                  <button
                    type="button"
                    onClick={() => setShowCreateForm(false)}
                    className="btn btn-outline"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="btn btn-primary"
                  >
                    {loading ? (
                      <>
                        <LoadingSpinner size="sm" className="mr-2" />
                        Creating...
                      </>
                    ) : (
                      <>
                        <PlusIcon className="w-4 h-4 mr-2" />
                        Create Engagement
                      </>
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}

        {/* Engagements Grid */}
        {loading ? (
          <div className="text-center py-12">
            <LoadingSpinner size="lg" />
            <p className="text-muted-foreground mt-4">Loading engagements...</p>
          </div>
        ) : filteredEngagements.length === 0 ? (
          <div className="text-center py-12">
            <BriefcaseIcon className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">No engagements found</h3>
            <p className="text-muted-foreground mb-6">
              Create your first project engagement to start tracking progress.
            </p>
            <button
              onClick={() => setShowCreateForm(true)}
              className="btn btn-primary"
            >
              <PlusIcon className="w-4 h-4 mr-2" />
              Create First Engagement
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEngagements.map((engagement) => {
              const progress = calculateProgress(engagement);
              
              return (
                <motion.div
                  key={engagement.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  whileHover={{ y: -2 }}
                  className="card p-6 cursor-pointer"
                  onClick={() => setSelectedEngagement(engagement)}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg mb-1">{engagement.title}</h3>
                      <p className="text-sm text-muted-foreground">{engagement.clientName}</p>
                    </div>
                    
                    <div className="flex items-center space-x-1">
                      {getStatusIcon(engagement.status)}
                      <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(engagement.status)}`}>
                        {engagement.status}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center text-sm text-muted-foreground">
                      <BanknotesIcon className="w-4 h-4 mr-2" />
                      {engagement.budget}
                    </div>
                    
                    <div className="flex items-center text-sm text-muted-foreground">
                      <CalendarIcon className="w-4 h-4 mr-2" />
                      {new Date(engagement.startDate).toLocaleDateString()} - {new Date(engagement.endDate).toLocaleDateString()}
                    </div>
                    
                    {engagement.teamMembers?.length > 0 && (
                      <div className="flex items-center text-sm text-muted-foreground">
                        <UserGroupIcon className="w-4 h-4 mr-2" />
                        {engagement.teamMembers.length} team members
                      </div>
                    )}
                  </div>

                  <div className="mb-4">
                    <div className="flex items-center justify-between text-sm mb-2">
                      <span>Progress</span>
                      <span>{progress}%</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div 
                        className="bg-primary rounded-full h-2 transition-all duration-300"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className={`text-xs font-medium ${getPriorityColor(engagement.priority)}`}>
                      {engagement.priority?.charAt(0).toUpperCase() + engagement.priority?.slice(1)} Priority
                    </span>
                    
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedEngagement(engagement);
                        }}
                        className="btn btn-ghost btn-sm"
                      >
                        <EyeIcon className="w-4 h-4" />
                      </button>
                      
                      {syncStatus[engagement.id] && (
                        <span className="text-xs text-green-600">
                          ✓ Synced
                        </span>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Engagements; 