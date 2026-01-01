/**
 * This is a product of Scalovate Systems Solutions.
 * All rights reserved.
 */

import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import {
  UsersIcon,
  BriefcaseIcon,
  DocumentTextIcon,
  ChatBubbleLeftRightIcon,
  ChartBarIcon,
  SparklesIcon,
  EyeIcon,
  PlusIcon,
  HeartIcon,
  ClockIcon,
  CheckCircleIcon,
  TrophyIcon,
  CurrencyDollarIcon,
  BuildingOfficeIcon,
  CalendarIcon,
  UserGroupIcon,
  ArrowTrendingUpIcon,
  ArrowRightIcon
} from '@heroicons/react/24/outline';
import LoadingSpinner from '../components/LoadingSpinner';

const RecruiterDashboard = () => {
  const { user, userProfile } = useAuth();
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState({
    stats: {},
    recentCandidates: [],
    activeJobs: [],
    recentProposals: [],
    clientInteractions: [],
    interviews: [],
    recentActivity: []
  });

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockData = {
        stats: {
          totalCandidates: 156,
          activeCandidates: 89,
          totalJobs: 23,
          activeJobs: 12,
          totalProposals: 34,
          pendingProposals: 8,
          clientInteractions: 45,
          successfulPlacements: 12,
          averageTimeToHire: 18,
          placementRate: 75
        },
        recentCandidates: [
          {
            id: 1,
            name: 'Sarah Johnson',
            title: 'Senior React Developer',
            experience: '5+ years',
            skills: ['React', 'Node.js', 'TypeScript'],
            atsScore: 92,
            addedDate: '2024-01-10',
            status: 'available',
            location: 'San Francisco, CA',
            favorited: true
          },
          {
            id: 2,
            name: 'Mike Chen',
            title: 'Full Stack Engineer',
            experience: '4 years',
            skills: ['Python', 'Django', 'React'],
            atsScore: 88,
            addedDate: '2024-01-09',
            status: 'interviewing',
            location: 'Remote',
            favorited: false
          },
          {
            id: 3,
            name: 'Emily Davis',
            title: 'Frontend Developer',
            experience: '3 years',
            skills: ['Vue.js', 'CSS', 'JavaScript'],
            atsScore: 85,
            addedDate: '2024-01-08',
            status: 'placed',
            location: 'Austin, TX',
            favorited: true
          }
        ],
        activeJobs: [
          {
            id: 1,
            title: 'Senior React Developer',
            company: 'TechCorp Solutions',
            applications: 15,
            status: 'active',
            postedDate: '2024-01-08',
            salary: '$120k-$150k',
            location: 'San Francisco, CA',
            type: 'Full-time'
          },
          {
            id: 2,
            title: 'DevOps Engineer',
            company: 'CloudTech Inc',
            applications: 8,
            status: 'active',
            postedDate: '2024-01-06',
            salary: '$100k-$130k',
            location: 'Remote',
            type: 'Full-time'
          }
        ],
        recentProposals: [
          {
            id: 1,
            clientName: 'TechCorp Solutions',
            candidateName: 'Sarah Johnson',
            position: 'Senior React Developer',
            status: 'pending',
            sentDate: '2024-01-10',
            value: '$45,000'
          },
          {
            id: 2,
            clientName: 'StartupXYZ',
            candidateName: 'Mike Chen',
            position: 'Full Stack Engineer',
            status: 'approved',
            sentDate: '2024-01-08',
            value: '$38,000'
          }
        ],
        interviews: [
          {
            id: 1,
            candidateName: 'Sarah Johnson',
            clientName: 'TechCorp Solutions',
            position: 'Senior React Developer',
            round: 'Technical Interview',
            date: '2024-01-15T14:00:00Z',
            status: 'scheduled'
          },
          {
            id: 2,
            candidateName: 'Mike Chen',
            clientName: 'CloudTech Inc',
            position: 'DevOps Engineer',
            round: 'Final Interview',
            date: '2024-01-12T10:00:00Z',
            status: 'completed'
          }
        ],
        recentActivity: [
          {
            id: 1,
            type: 'candidate_added',
            message: 'New candidate Sarah Johnson added to database',
            timestamp: '2024-01-10T15:30:00Z'
          },
          {
            id: 2,
            type: 'proposal_sent',
            message: 'Proposal sent to TechCorp Solutions for Sarah Johnson',
            timestamp: '2024-01-10T14:20:00Z'
          },
          {
            id: 3,
            type: 'interview_scheduled',
            message: 'Technical interview scheduled for Sarah Johnson',
            timestamp: '2024-01-10T11:45:00Z'
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

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': case 'available': case 'scheduled':
        return 'text-green-600 bg-green-50';
      case 'pending': case 'interviewing':
        return 'text-yellow-600 bg-yellow-50';
      case 'approved': case 'placed': case 'completed':
        return 'text-blue-600 bg-blue-50';
      case 'rejected': case 'cancelled':
        return 'text-red-600 bg-red-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  const stats = [
    {
      name: 'Total Candidates',
      value: dashboardData.stats.totalCandidates,
      change: '+12 this month',
      icon: UsersIcon,
      color: 'text-blue-600'
    },
    {
      name: 'Active Jobs',
      value: dashboardData.stats.activeJobs,
      change: '+3 this week',
      icon: BriefcaseIcon,
      color: 'text-green-600'
    },
    {
      name: 'Pending Proposals',
      value: dashboardData.stats.pendingProposals,
      change: '+5 this week',
      icon: DocumentTextIcon,
      color: 'text-purple-600'
    },
    {
      name: 'Placement Rate',
      value: `${dashboardData.stats.placementRate}%`,
      change: '+5% vs last month',
      icon: TrophyIcon,
      color: 'text-orange-600'
    }
  ];

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">
            Recruiter Dashboard
          </h1>
          <p className="text-muted-foreground">
            Welcome back, {userProfile?.firstName || 'Recruiter'}! Here's your recruitment overview.
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

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card p-6 mb-8"
        >
          <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            <Link
              to="/candidates/add"
              className="flex flex-col items-center p-4 rounded-lg hover:bg-accent transition-colors group"
            >
              <PlusIcon className="w-8 h-8 text-primary group-hover:scale-110 transition-transform" />
              <span className="text-sm font-medium mt-2">Add Candidate</span>
            </Link>
            <Link
              to="/jobs/add"
              className="flex flex-col items-center p-4 rounded-lg hover:bg-accent transition-colors group"
            >
              <BriefcaseIcon className="w-8 h-8 text-green-600 group-hover:scale-110 transition-transform" />
              <span className="text-sm font-medium mt-2">Post Job</span>
            </Link>
            <Link
              to="/proposals/create"
              className="flex flex-col items-center p-4 rounded-lg hover:bg-accent transition-colors group"
            >
              <DocumentTextIcon className="w-8 h-8 text-purple-600 group-hover:scale-110 transition-transform" />
              <span className="text-sm font-medium mt-2">Create Proposal</span>
            </Link>
            <Link
              to="/candidates"
              className="flex flex-col items-center p-4 rounded-lg hover:bg-accent transition-colors group"
            >
              <UsersIcon className="w-8 h-8 text-blue-600 group-hover:scale-110 transition-transform" />
              <span className="text-sm font-medium mt-2">Browse Candidates</span>
            </Link>
            <Link
              to="/talent-search"
              className="flex flex-col items-center p-4 rounded-lg hover:bg-accent transition-colors group"
            >
              <SparklesIcon className="w-8 h-8 text-orange-600 group-hover:scale-110 transition-transform" />
              <span className="text-sm font-medium mt-2">AI Search</span>
            </Link>
            <Link
              to="/analytics"
              className="flex flex-col items-center p-4 rounded-lg hover:bg-accent transition-colors group"
            >
              <ChartBarIcon className="w-8 h-8 text-indigo-600 group-hover:scale-110 transition-transform" />
              <span className="text-sm font-medium mt-2">Analytics</span>
            </Link>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-8">
            {/* Recent Candidates */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="card p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold">Recent Candidates</h2>
                <Link to="/candidates" className="text-primary hover:underline text-sm">
                  View all
                </Link>
              </div>
              
              <div className="space-y-4">
                {dashboardData.recentCandidates.map((candidate) => (
                  <div key={candidate.id} className="flex items-center justify-between p-4 rounded-lg border border-border">
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                        <span className="text-primary font-medium text-sm">
                          {candidate.name.split(' ').map(n => n[0]).join('')}
                        </span>
                      </div>
                      <div>
                        <h3 className="font-medium text-foreground">{candidate.name}</h3>
                        <p className="text-sm text-muted-foreground">{candidate.title}</p>
                        <div className="flex items-center space-x-2 mt-1">
                          <span className="text-xs text-muted-foreground">{candidate.experience}</span>
                          <span className="text-xs text-muted-foreground">•</span>
                          <span className="text-xs text-muted-foreground">ATS: {candidate.atsScore}%</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(candidate.status)}`}>
                        {candidate.status}
                      </span>
                      <button className={`p-1 rounded ${candidate.favorited ? 'text-red-500' : 'text-gray-400 hover:text-red-500'}`}>
                        <HeartIcon className={`w-4 h-4 ${candidate.favorited ? 'fill-current' : ''}`} />
                      </button>
                      <Link to={`/candidates/${candidate.id}`} className="btn btn-outline btn-sm">
                        <EyeIcon className="w-4 h-4" />
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Active Jobs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="card p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold">Active Jobs</h2>
                <Link to="/jobs" className="text-primary hover:underline text-sm">
                  View all
                </Link>
              </div>
              
              <div className="space-y-4">
                {dashboardData.activeJobs.map((job) => (
                  <div key={job.id} className="p-4 rounded-lg border border-border">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-medium text-foreground">{job.title}</h3>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(job.status)}`}>
                        {job.applications} applications
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">{job.company}</p>
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>{job.salary} • {job.location}</span>
                      <span>Posted {formatDate(job.postedDate)}</span>
                    </div>
                    <div className="mt-3 flex space-x-2">
                      <Link to={`/jobs/${job.id}`} className="btn btn-outline btn-sm">
                        View Applications
                      </Link>
                      <Link to={`/jobs/${job.id}/match`} className="btn btn-primary btn-sm">
                        AI Match
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Right Column */}
          <div className="space-y-8">
            {/* Interview Schedule */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="card p-6"
            >
              <h2 className="text-lg font-semibold mb-4">Upcoming Interviews</h2>
              
              <div className="space-y-3">
                {dashboardData.interviews.slice(0, 3).map((interview) => (
                  <div key={interview.id} className="p-3 rounded-lg bg-muted/30">
                    <h3 className="text-sm font-medium">{interview.candidateName}</h3>
                    <p className="text-xs text-muted-foreground">{interview.position}</p>
                    <p className="text-xs text-muted-foreground">{interview.round}</p>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-xs text-muted-foreground">
                        {formatDate(interview.date)}
                      </span>
                      <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(interview.status)}`}>
                        {interview.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
              
              <Link to="/interviews" className="btn btn-outline btn-sm w-full mt-4">
                View All Interviews
              </Link>
            </motion.div>

            {/* Recent Proposals */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="card p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold">Recent Proposals</h2>
                <Link to="/proposals" className="text-primary hover:underline text-sm">
                  View all
                </Link>
              </div>
              
              <div className="space-y-3">
                {dashboardData.recentProposals.map((proposal) => (
                  <div key={proposal.id} className="p-3 rounded-lg border border-border">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="text-sm font-medium">{proposal.candidateName}</h3>
                      <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(proposal.status)}`}>
                        {proposal.status}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground">{proposal.position}</p>
                    <p className="text-xs text-muted-foreground">{proposal.clientName}</p>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-xs font-medium text-green-600">{proposal.value}</span>
                      <span className="text-xs text-muted-foreground">
                        {formatDate(proposal.sentDate)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Recent Activity */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="card p-6"
            >
              <h2 className="text-lg font-semibold mb-4">Recent Activity</h2>
              
              <div className="space-y-3">
                {dashboardData.recentActivity.slice(0, 5).map((activity) => (
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

export default RecruiterDashboard; 