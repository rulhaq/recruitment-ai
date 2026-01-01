/**
 * This is a product of Scalovate Systems Solutions.
 * All rights reserved.
 */

import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import {
  UserCircleIcon,
  DocumentTextIcon,
  BriefcaseIcon,
  ChatBubbleLeftRightIcon,
  ChartBarIcon,
  SparklesIcon,
  ClockIcon,
  CheckCircleIcon,
  ExclamationCircleIcon,
  EyeIcon,
  ArrowUpRightIcon,
  DocumentArrowUpIcon,
  CalendarIcon,
  BellIcon,
  TrophyIcon
} from '@heroicons/react/24/outline';
import LoadingSpinner from '../components/LoadingSpinner';

const CandidateDashboard = () => {
  const { user, userProfile } = useAuth();
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState({
    profileCompleteness: 0,
    applications: [],
    opportunities: [],
    recentActivity: [],
    cvStatus: null,
    upcomingEvents: []
  });

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      // Simulate API calls
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock dashboard data
      const mockData = {
        profileCompleteness: 75,
        applications: [
          {
            id: 1,
            title: 'Senior React Developer',
            company: 'TechFlow Inc',
            status: 'under_review',
            appliedDate: '2024-01-10',
            lastUpdate: '2024-01-12'
          },
          {
            id: 2,
            title: 'Full Stack Engineer',
            company: 'StartupXYZ',
            status: 'interview_scheduled',
            appliedDate: '2024-01-08',
            interviewDate: '2024-01-15T14:00:00Z'
          },
          {
            id: 3,
            title: 'Frontend Developer',
            company: 'DesignCorp',
            status: 'no_response',
            appliedDate: '2024-01-05',
            canNudge: true
          }
        ],
        opportunities: [
          {
            id: 1,
            title: 'Backend Developer',
            company: 'CloudTech Solutions',
            recruiterName: 'Sarah Johnson',
            unreadMessages: 2,
            dateContacted: '2024-01-09'
          },
          {
            id: 2,
            title: 'DevOps Engineer',
            company: 'DataFlow Inc',
            recruiterName: 'Mike Chen',
            unreadMessages: 0,
            dateContacted: '2024-01-07'
          }
        ],
        recentActivity: [
          {
            id: 1,
            type: 'opportunity',
            message: 'New opportunity: Backend Developer at CloudTech Solutions',
            timestamp: '2024-01-09T10:30:00Z'
          },
          {
            id: 2,
            type: 'application_update',
            message: 'Application status updated for Full Stack Engineer at StartupXYZ',
            timestamp: '2024-01-08T15:45:00Z'
          },
          {
            id: 3,
            type: 'cv_analysis',
            message: 'CV analysis completed - 85% ATS compatibility score',
            timestamp: '2024-01-07T09:20:00Z'
          }
        ],
        cvStatus: {
          uploaded: true,
          atsScore: 85,
          lastUpdated: '2024-01-07',
          needsUpdate: false
        },
        upcomingEvents: [
          {
            id: 1,
            type: 'interview',
            title: 'Technical Interview - StartupXYZ',
            date: '2024-01-15T14:00:00Z',
            duration: '1 hour'
          },
          {
            id: 2,
            type: 'deadline',
            title: 'Offer Response Deadline - MegaCorp',
            date: '2024-01-20T17:00:00Z'
          }
        ]
      };
      
      setDashboardData(mockData);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'under_review': return 'text-blue-600 bg-blue-50';
      case 'interview_scheduled': return 'text-purple-600 bg-purple-50';
      case 'offer_received': return 'text-green-600 bg-green-50';
      case 'rejected': return 'text-red-600 bg-red-50';
      case 'no_response': return 'text-yellow-600 bg-yellow-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getProfileCompletionTasks = () => {
    const tasks = [];
    if (!userProfile?.summary) tasks.push('Add professional summary');
    if (!userProfile?.experience) tasks.push('Add work experience');
    if (!userProfile?.skills) tasks.push('Add skills');
    if (!userProfile?.education) tasks.push('Add education');
    if (!dashboardData.cvStatus?.uploaded) tasks.push('Upload CV');
    return tasks;
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  const stats = [
    {
      name: 'Active Applications',
      value: dashboardData.applications.filter(app => 
        ['under_review', 'interview_scheduled', 'offer_received'].includes(app.status)
      ).length,
      icon: DocumentTextIcon,
      color: 'text-blue-600',
      change: '+2 this week'
    },
    {
      name: 'New Opportunities',
      value: dashboardData.opportunities.length,
      icon: BriefcaseIcon,
      color: 'text-green-600',
      change: '+1 this week'
    },
    {
      name: 'Profile Strength',
      value: `${dashboardData.profileCompleteness}%`,
      icon: UserCircleIcon,
      color: 'text-purple-600',
      change: '+5% this month'
    },
    {
      name: 'ATS Score',
      value: dashboardData.cvStatus?.atsScore ? `${dashboardData.cvStatus.atsScore}%` : 'N/A',
      icon: SparklesIcon,
      color: 'text-orange-600',
      change: dashboardData.cvStatus?.atsScore >= 80 ? 'Excellent' : 'Good'
    }
  ];

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">
            Welcome back, {userProfile?.firstName || 'Candidate'}!
          </h1>
          <p className="text-muted-foreground">
            Here's your job search progress and latest updates
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="card p-6"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">{stat.name}</p>
                    <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                    <p className="text-xs text-muted-foreground mt-1">{stat.change}</p>
                  </div>
                  <Icon className={`w-8 h-8 ${stat.color}`} />
                </div>
              </motion.div>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-8">
            {/* Quick Actions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="card p-6"
            >
              <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Link
                  to="/my-profile"
                  className="flex flex-col items-center p-4 rounded-lg hover:bg-accent transition-colors group"
                >
                  <UserCircleIcon className="w-8 h-8 text-primary group-hover:scale-110 transition-transform" />
                  <span className="text-sm font-medium mt-2">Edit Profile</span>
                </Link>
                <Link
                  to="/my-profile"
                  className="flex flex-col items-center p-4 rounded-lg hover:bg-accent transition-colors group"
                >
                  <DocumentArrowUpIcon className="w-8 h-8 text-green-600 group-hover:scale-110 transition-transform" />
                  <span className="text-sm font-medium mt-2">Upload CV</span>
                </Link>
                <Link
                  to="/job-opportunities"
                  className="flex flex-col items-center p-4 rounded-lg hover:bg-accent transition-colors group"
                >
                  <BriefcaseIcon className="w-8 h-8 text-blue-600 group-hover:scale-110 transition-transform" />
                  <span className="text-sm font-medium mt-2">Opportunities</span>
                </Link>
                <Link
                  to="/applications"
                  className="flex flex-col items-center p-4 rounded-lg hover:bg-accent transition-colors group"
                >
                  <ChartBarIcon className="w-8 h-8 text-purple-600 group-hover:scale-110 transition-transform" />
                  <span className="text-sm font-medium mt-2">Applications</span>
                </Link>
              </div>
            </motion.div>

            {/* Recent Applications */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="card p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold">Recent Applications</h2>
                <Link to="/applications" className="text-primary hover:underline text-sm">
                  View all
                </Link>
              </div>
              
              <div className="space-y-4">
                {dashboardData.applications.slice(0, 3).map((app) => (
                  <div key={app.id} className="flex items-center justify-between p-4 rounded-lg border border-border">
                    <div className="flex-1">
                      <h3 className="font-medium text-foreground">{app.title}</h3>
                      <p className="text-sm text-muted-foreground">{app.company}</p>
                      <p className="text-xs text-muted-foreground">
                        Applied {formatDate(app.appliedDate)}
                      </p>
                    </div>
                    <div className="flex items-center space-x-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(app.status)}`}>
                        {app.status.replace('_', ' ')}
                      </span>
                      {app.canNudge && (
                        <button className="btn btn-outline btn-sm">
                          <BellIcon className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Job Opportunities */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="card p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold">New Opportunities</h2>
                <Link to="/job-opportunities" className="text-primary hover:underline text-sm">
                  View all
                </Link>
              </div>
              
              <div className="space-y-4">
                {dashboardData.opportunities.map((opp) => (
                  <div key={opp.id} className="flex items-center justify-between p-4 rounded-lg border border-border">
                    <div className="flex-1">
                      <h3 className="font-medium text-foreground">{opp.title}</h3>
                      <p className="text-sm text-muted-foreground">{opp.company}</p>
                      <p className="text-xs text-muted-foreground">
                        From {opp.recruiterName} • {formatDate(opp.dateContacted)}
                      </p>
                    </div>
                    <div className="flex items-center space-x-3">
                      {opp.unreadMessages > 0 && (
                        <span className="bg-red-500 text-white text-xs rounded-full px-2 py-1">
                          {opp.unreadMessages} new
                        </span>
                      )}
                      <Link to="/job-opportunities" className="btn btn-primary btn-sm">
                        <ChatBubbleLeftRightIcon className="w-4 h-4 mr-1" />
                        Chat
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Right Column */}
          <div className="space-y-8">
            {/* Profile Completion */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="card p-6"
            >
              <h2 className="text-lg font-semibold mb-4">Profile Completion</h2>
              
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-muted-foreground">Progress</span>
                  <span className="text-sm font-medium">{dashboardData.profileCompleteness}%</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div 
                    className="bg-primary h-2 rounded-full transition-all duration-300"
                    style={{ width: `${dashboardData.profileCompleteness}%` }}
                  ></div>
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="text-sm font-medium">Complete your profile:</h3>
                {getProfileCompletionTasks().slice(0, 3).map((task, index) => (
                  <Link
                    key={index}
                    to="/my-profile"
                    className="flex items-center text-sm text-muted-foreground hover:text-foreground"
                  >
                    <ArrowUpRightIcon className="w-4 h-4 mr-2" />
                    {task}
                  </Link>
                ))}
              </div>
            </motion.div>

            {/* CV Status */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="card p-6"
            >
              <h2 className="text-lg font-semibold mb-4">CV Status</h2>
              
              {dashboardData.cvStatus?.uploaded ? (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">ATS Score</span>
                    <span className="text-lg font-bold text-primary">
                      {dashboardData.cvStatus.atsScore}%
                    </span>
                  </div>
                  
                  <div className="flex items-center text-sm text-muted-foreground">
                    <CheckCircleIcon className="w-4 h-4 mr-2 text-green-600" />
                    Last updated {formatDate(dashboardData.cvStatus.lastUpdated)}
                  </div>
                  
                  <Link
                    to="/my-profile"
                    className="btn btn-outline btn-sm w-full"
                  >
                    <SparklesIcon className="w-4 h-4 mr-2" />
                    Optimize CV
                  </Link>
                </div>
              ) : (
                <div className="text-center py-4">
                  <DocumentArrowUpIcon className="w-8 h-8 mx-auto text-muted-foreground mb-2" />
                  <p className="text-sm text-muted-foreground mb-3">No CV uploaded yet</p>
                  <Link
                    to="/my-profile"
                    className="btn btn-primary btn-sm"
                  >
                    Upload CV
                  </Link>
                </div>
              )}
            </motion.div>

            {/* Upcoming Events */}
            {dashboardData.upcomingEvents.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="card p-6"
              >
                <h2 className="text-lg font-semibold mb-4">Upcoming Events</h2>
                
                <div className="space-y-3">
                  {dashboardData.upcomingEvents.map((event) => (
                    <div key={event.id} className="flex items-start space-x-3 p-3 rounded-lg bg-muted/30">
                      <CalendarIcon className="w-5 h-5 text-primary mt-0.5" />
                      <div className="flex-1">
                        <h3 className="text-sm font-medium">{event.title}</h3>
                        <p className="text-xs text-muted-foreground">
                          {formatDate(event.date)}
                        </p>
                        {event.duration && (
                          <p className="text-xs text-muted-foreground">
                            Duration: {event.duration}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Recent Activity */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="card p-6"
            >
              <h2 className="text-lg font-semibold mb-4">Recent Activity</h2>
              
              <div className="space-y-3">
                {dashboardData.recentActivity.slice(0, 4).map((activity) => (
                  <div key={activity.id} className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                    <div className="flex-1">
                      <p className="text-sm text-foreground">{activity.message}</p>
                      <p className="text-xs text-muted-foreground">
                        {formatDate(activity.timestamp)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CandidateDashboard; 