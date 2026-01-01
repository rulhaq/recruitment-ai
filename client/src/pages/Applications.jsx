/**
 * This is a product of Scalovate Systems Solutions.
 * All rights reserved.
 */

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import {
  DocumentTextIcon,
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon,
  ExclamationCircleIcon,
  EyeIcon,
  BellIcon,
  CalendarIcon,
  BuildingOfficeIcon,
  MapPinIcon,
  CurrencyDollarIcon,
  UserGroupIcon,
  ArrowPathIcon
} from '@heroicons/react/24/outline';
import LoadingSpinner from '../components/LoadingSpinner';

const Applications = () => {
  const { user, userProfile } = useAuth();
  const [loading, setLoading] = useState(false);
  const [applications, setApplications] = useState([]);
  const [filter, setFilter] = useState('all');
  const [nudgeLoading, setNudgeLoading] = useState({});

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockApplications = [
        {
          id: 1,
          title: 'Senior React Developer',
          company: 'TechFlow Inc',
          location: 'San Francisco, CA',
          salary: '$130,000 - $160,000',
          appliedDate: '2024-01-10',
          status: 'under_review',
          recruiterName: 'Alice Johnson',
          recruiterEmail: 'alice@cartafella.com',
          lastUpdate: '2024-01-12',
          description: 'We are looking for a Senior React Developer to join our frontend team...',
          nextStep: 'Technical interview scheduled',
          canNudge: false,
          nudgeCount: 0,
          estimatedResponse: '2-3 business days'
        },
        {
          id: 2,
          title: 'Full Stack Engineer',
          company: 'StartupXYZ',
          location: 'Remote',
          salary: '$100,000 - $120,000',
          appliedDate: '2024-01-08',
          status: 'interview_scheduled',
          recruiterName: 'Bob Chen',
          recruiterEmail: 'bob@cartafella.com',
          lastUpdate: '2024-01-11',
          description: 'Join our innovative team as a Full Stack Engineer...',
          nextStep: 'Technical interview on Jan 15, 2024 at 2:00 PM',
          canNudge: false,
          nudgeCount: 0,
          interviewDate: '2024-01-15T14:00:00Z'
        },
        {
          id: 3,
          title: 'Frontend Developer',
          company: 'DesignCorp',
          location: 'Austin, TX',
          salary: '$90,000 - $110,000',
          appliedDate: '2024-01-05',
          status: 'no_response',
          recruiterName: 'Carol Davis',
          recruiterEmail: 'carol@cartafella.com',
          lastUpdate: '2024-01-05',
          description: 'Looking for a creative Frontend Developer...',
          nextStep: 'Waiting for initial response',
          canNudge: true,
          nudgeCount: 1,
          lastNudge: '2024-01-08'
        },
        {
          id: 4,
          title: 'DevOps Engineer',
          company: 'CloudTech Solutions',
          location: 'Seattle, WA',
          salary: '$120,000 - $140,000',
          appliedDate: '2024-01-03',
          status: 'rejected',
          recruiterName: 'David Wilson',
          recruiterEmail: 'david@cartafella.com',
          lastUpdate: '2024-01-07',
          description: 'DevOps Engineer role for scaling our infrastructure...',
          nextStep: 'Application not successful',
          canNudge: false,
          nudgeCount: 0,
          rejectionReason: 'Position filled with internal candidate'
        },
        {
          id: 5,
          title: 'Software Engineer',
          company: 'MegaCorp Inc',
          location: 'New York, NY',
          salary: '$110,000 - $130,000',
          appliedDate: '2024-01-01',
          status: 'offer_received',
          recruiterName: 'Emma Thompson',
          recruiterEmail: 'emma@cartafella.com',
          lastUpdate: '2024-01-09',
          description: 'Software Engineer position in our core platform team...',
          nextStep: 'Offer expires on Jan 20, 2024',
          canNudge: false,
          nudgeCount: 0,
          offerExpiry: '2024-01-20'
        },
        {
          id: 6,
          title: 'Backend Developer',
          company: 'DataFlow Systems',
          location: 'Denver, CO',
          salary: '$95,000 - $115,000',
          appliedDate: '2023-12-28',
          status: 'closed',
          recruiterName: 'Frank Miller',
          recruiterEmail: 'frank@cartafella.com',
          lastUpdate: '2024-01-06',
          description: 'Backend Developer for our data processing platform...',
          nextStep: 'Position has been closed',
          canNudge: false,
          nudgeCount: 0,
          closureReason: 'Position filled'
        }
      ];
      
      setApplications(mockApplications);
    } catch (error) {
      console.error('Error fetching applications:', error);
    } finally {
      setLoading(false);
    }
  };

  const sendNudge = async (applicationId) => {
    setNudgeLoading(prev => ({ ...prev, [applicationId]: true }));
    
    try {
      // Simulate sending nudge
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setApplications(prev => prev.map(app => 
        app.id === applicationId 
          ? { 
              ...app, 
              nudgeCount: app.nudgeCount + 1,
              lastNudge: new Date().toISOString(),
              canNudge: false // Disable nudging for a while
            }
          : app
      ));
      
      alert('Nudge sent successfully! The recruiter will be notified.');
    } catch (error) {
      console.error('Error sending nudge:', error);
      alert('Failed to send nudge');
    } finally {
      setNudgeLoading(prev => ({ ...prev, [applicationId]: false }));
    }
  };

  const getStatusInfo = (status) => {
    switch (status) {
      case 'under_review':
        return {
          label: 'Under Review',
          color: 'text-blue-600 bg-blue-50',
          icon: ClockIcon
        };
      case 'interview_scheduled':
        return {
          label: 'Interview Scheduled',
          color: 'text-purple-600 bg-purple-50',
          icon: CalendarIcon
        };
      case 'offer_received':
        return {
          label: 'Offer Received',
          color: 'text-green-600 bg-green-50',
          icon: CheckCircleIcon
        };
      case 'rejected':
        return {
          label: 'Not Selected',
          color: 'text-red-600 bg-red-50',
          icon: XCircleIcon
        };
      case 'no_response':
        return {
          label: 'No Response',
          color: 'text-yellow-600 bg-yellow-50',
          icon: ExclamationCircleIcon
        };
      case 'closed':
        return {
          label: 'Position Closed',
          color: 'text-gray-600 bg-gray-50',
          icon: XCircleIcon
        };
      default:
        return {
          label: 'Unknown',
          color: 'text-gray-600 bg-gray-50',
          icon: ClockIcon
        };
    }
  };

  const filteredApplications = applications.filter(app => {
    if (filter === 'all') return true;
    if (filter === 'active') return ['under_review', 'interview_scheduled', 'offer_received'].includes(app.status);
    if (filter === 'closed') return ['rejected', 'closed'].includes(app.status);
    if (filter === 'no_response') return app.status === 'no_response';
    return true;
  });

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getDaysSince = (dateString) => {
    const days = Math.floor((new Date() - new Date(dateString)) / (1000 * 60 * 60 * 24));
    return days;
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">My Applications</h1>
          <p className="text-muted-foreground">
            Track your job applications and their current status
          </p>
        </div>

        {/* Filters */}
        <div className="mb-6">
          <div className="flex space-x-2">
            {[
              { key: 'all', label: 'All Applications' },
              { key: 'active', label: 'Active' },
              { key: 'no_response', label: 'No Response' },
              { key: 'closed', label: 'Closed' }
            ].map((filterOption) => (
              <button
                key={filterOption.key}
                onClick={() => setFilter(filterOption.key)}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  filter === filterOption.key
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                }`}
              >
                {filterOption.label}
              </button>
            ))}
          </div>
        </div>

        {/* Applications Grid */}
        <div className="space-y-4">
          {filteredApplications.map((application) => {
            const statusInfo = getStatusInfo(application.status);
            const StatusIcon = statusInfo.icon;
            const daysSinceApplied = getDaysSince(application.appliedDate);
            const daysSinceUpdate = getDaysSince(application.lastUpdate);
            
            return (
              <motion.div
                key={application.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="card p-6 hover:shadow-lg transition-shadow"
              >
                <div className="flex flex-col lg:flex-row lg:items-center justify-between">
                  {/* Main Content */}
                  <div className="flex-1 mb-4 lg:mb-0">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-xl font-semibold text-foreground mb-2">
                          {application.title}
                        </h3>
                        <div className="space-y-1">
                          <div className="flex items-center text-muted-foreground text-sm">
                            <BuildingOfficeIcon className="w-4 h-4 mr-2" />
                            {application.company}
                          </div>
                          <div className="flex items-center text-muted-foreground text-sm">
                            <MapPinIcon className="w-4 h-4 mr-2" />
                            {application.location}
                          </div>
                          <div className="flex items-center text-muted-foreground text-sm">
                            <CurrencyDollarIcon className="w-4 h-4 mr-2" />
                            {application.salary}
                          </div>
                          <div className="flex items-center text-muted-foreground text-sm">
                            <UserGroupIcon className="w-4 h-4 mr-2" />
                            Recruiter: {application.recruiterName}
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex flex-col items-end space-y-2">
                        <span className={`px-3 py-1 rounded-full text-sm font-medium flex items-center ${statusInfo.color}`}>
                          <StatusIcon className="w-4 h-4 mr-1" />
                          {statusInfo.label}
                        </span>
                        {application.nudgeCount > 0 && (
                          <span className="text-xs text-muted-foreground">
                            {application.nudgeCount} nudge{application.nudgeCount > 1 ? 's' : ''} sent
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Status Details */}
                    <div className="bg-muted/30 p-3 rounded-md mb-4">
                      <div className="text-sm">
                        <strong>Next Step:</strong> {application.nextStep}
                      </div>
                      {application.estimatedResponse && (
                        <div className="text-sm text-muted-foreground mt-1">
                          Estimated response time: {application.estimatedResponse}
                        </div>
                      )}
                      {application.interviewDate && (
                        <div className="text-sm text-green-600 mt-1">
                          Interview: {formatDate(application.interviewDate)}
                        </div>
                      )}
                      {application.offerExpiry && (
                        <div className="text-sm text-orange-600 mt-1">
                          Offer expires: {formatDate(application.offerExpiry)}
                        </div>
                      )}
                    </div>

                    {/* Timeline */}
                    <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                      <span>Applied {daysSinceApplied} days ago</span>
                      <span>•</span>
                      <span>Last update {daysSinceUpdate} days ago</span>
                      {application.lastNudge && (
                        <>
                          <span>•</span>
                          <span>Last nudge {getDaysSince(application.lastNudge)} days ago</span>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col space-y-2 lg:ml-6">
                    <button className="btn btn-outline btn-sm">
                      <EyeIcon className="w-4 h-4 mr-2" />
                      View Details
                    </button>
                    
                    {application.canNudge && (
                      <button
                        onClick={() => sendNudge(application.id)}
                        disabled={nudgeLoading[application.id]}
                        className="btn btn-primary btn-sm"
                      >
                        {nudgeLoading[application.id] ? (
                          <LoadingSpinner size="sm" />
                        ) : (
                          <>
                            <BellIcon className="w-4 h-4 mr-2" />
                            Send Nudge
                          </>
                        )}
                      </button>
                    )}
                    
                    {application.status === 'no_response' && !application.canNudge && (
                      <div className="text-xs text-muted-foreground text-center">
                        Nudge sent recently
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Empty State */}
        {filteredApplications.length === 0 && !loading && (
          <div className="text-center py-12">
            <DocumentTextIcon className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium text-foreground mb-2">
              {filter === 'all' ? 'No applications yet' : `No ${filter} applications`}
            </h3>
            <p className="text-muted-foreground">
              {filter === 'all' 
                ? 'Start applying to jobs to see them tracked here.'
                : `No applications match the ${filter} filter.`}
            </p>
          </div>
        )}

        {/* Refresh Button */}
        <div className="mt-8 text-center">
          <button
            onClick={fetchApplications}
            disabled={loading}
            className="btn btn-outline"
          >
            {loading ? (
              <LoadingSpinner size="sm" />
            ) : (
              <>
                <ArrowPathIcon className="w-4 h-4 mr-2" />
                Refresh Applications
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Applications; 