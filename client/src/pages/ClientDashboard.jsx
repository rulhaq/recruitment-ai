/**
 * This is a product of Scalovate Systems Solutions.
 * All rights reserved.
 */

import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import {
  BriefcaseIcon,
  DocumentTextIcon,
  UsersIcon,
  CurrencyDollarIcon,
  ChartBarIcon,
  ClockIcon,
  CheckCircleIcon,
  ExclamationCircleIcon,
  PlusIcon,
  EyeIcon,
  ChatBubbleBottomCenterTextIcon,
  CalendarDaysIcon,
  TrophyIcon
} from '@heroicons/react/24/outline';
import AIChat from '../components/AIChat';

const ClientDashboard = () => {
  const { userProfile, getUserDisplayName } = useAuth();
  const [showAIChat, setShowAIChat] = useState(false);
  const [activeProjects, setActiveProjects] = useState([]);
  const [recentProposals, setRecentProposals] = useState([]);
  const [teamMetrics, setTeamMetrics] = useState({});

  useEffect(() => {
    fetchClientData();
  }, []);

  const fetchClientData = async () => {
    // Mock data for client-specific metrics
    const mockProjects = [
      {
        id: 1,
        title: 'E-commerce Platform Redesign',
        status: 'in_progress',
        team: 4,
        progress: 67,
        budget: 85000,
        spent: 52000,
        deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
      },
      {
        id: 2,
        title: 'Mobile App Development',
        status: 'planning',
        team: 3,
        progress: 15,
        budget: 120000,
        spent: 18000,
        deadline: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000)
      },
      {
        id: 3,
        title: 'Data Analytics Dashboard',
        status: 'completed',
        team: 2,
        progress: 100,
        budget: 45000,
        spent: 43500,
        deadline: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
      }
    ];

    const mockProposals = [
      {
        id: 1,
        title: 'AI Chatbot Implementation',
        vendor: 'TechSolutions Inc.',
        amount: 75000,
        submitted: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        status: 'pending',
        rating: 4.8
      },
      {
        id: 2,
        title: 'DevOps Infrastructure Setup',
        vendor: 'CloudExperts Ltd.',
        amount: 55000,
        submitted: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
        status: 'under_review',
        rating: 4.6
      }
    ];

    const mockMetrics = {
      totalProjects: 12,
      activeProjects: 3,
      totalSpent: 450000,
      avgProjectSuccess: 94,
      teamSatisfaction: 4.7,
      onTimeDelivery: 89
    };

    setActiveProjects(mockProjects);
    setRecentProposals(mockProposals);
    setTeamMetrics(mockMetrics);
  };

  const quickActions = [
    {
      name: 'Create Project Brief',
      href: '/projects/create',
      icon: PlusIcon,
      description: 'Start a new project with AI assistance',
      color: 'text-blue-600',
      bgColor: 'bg-blue-100'
    },
    {
      name: 'Review Proposals',
      href: '/proposals',
      icon: DocumentTextIcon,
      description: 'Evaluate vendor proposals',
      color: 'text-green-600',
      bgColor: 'bg-green-100'
    },
    {
      name: 'Manage Teams',
      href: '/team',
      icon: UsersIcon,
      description: 'Monitor team performance',
      color: 'text-purple-600',
      bgColor: 'bg-purple-100'
    },
    {
      name: 'Budget Analytics',
      href: '/analytics',
      icon: ChartBarIcon,
      description: 'Track spending and ROI',
      color: 'text-orange-600',
      bgColor: 'bg-orange-100'
    }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-600';
      case 'in_progress': return 'bg-blue-100 text-blue-600';
      case 'planning': return 'bg-yellow-100 text-yellow-600';
      case 'on_hold': return 'bg-red-100 text-red-600';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  const getProposalStatusColor = (status) => {
    switch (status) {
      case 'approved': return 'bg-green-100 text-green-600';
      case 'under_review': return 'bg-blue-100 text-blue-600';
      case 'pending': return 'bg-yellow-100 text-yellow-600';
      case 'rejected': return 'bg-red-100 text-red-600';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-foreground mb-2">
                Welcome back, {getUserDisplayName()}!
              </h1>
              <p className="text-lg text-muted-foreground">
                Let's manage your projects and scale your team
              </p>
            </div>
            
            <button
              onClick={() => setShowAIChat(true)}
              className="btn btn-primary flex items-center space-x-2"
            >
              <ChatBubbleBottomCenterTextIcon className="w-5 h-5" />
              <span>AI Assistant</span>
            </button>
          </div>
        </motion.div>

        {/* Key Metrics */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8"
        >
          <div className="card p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-foreground">{teamMetrics.activeProjects}</p>
                <p className="text-sm text-muted-foreground">Active Projects</p>
              </div>
              <BriefcaseIcon className="w-8 h-8 text-blue-500" />
            </div>
            <div className="mt-2 flex items-center text-sm text-green-600">
              <TrophyIcon className="w-4 h-4 mr-1" />
              {teamMetrics.avgProjectSuccess}% success rate
            </div>
          </div>
          
          <div className="card p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-foreground">{formatCurrency(teamMetrics.totalSpent)}</p>
                <p className="text-sm text-muted-foreground">Total Investment</p>
              </div>
              <CurrencyDollarIcon className="w-8 h-8 text-green-500" />
            </div>
            <div className="mt-2 flex items-center text-sm text-blue-600">
              <ChartBarIcon className="w-4 h-4 mr-1" />
              ROI: 340%
            </div>
          </div>
          
          <div className="card p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-foreground">{teamMetrics.teamSatisfaction}</p>
                <p className="text-sm text-muted-foreground">Team Rating</p>
              </div>
              <UsersIcon className="w-8 h-8 text-purple-500" />
            </div>
            <div className="mt-2 flex items-center text-sm text-purple-600">
              <CheckCircleIcon className="w-4 h-4 mr-1" />
              Above average
            </div>
          </div>
          
          <div className="card p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-foreground">{teamMetrics.onTimeDelivery}%</p>
                <p className="text-sm text-muted-foreground">On-Time Delivery</p>
              </div>
              <ClockIcon className="w-8 h-8 text-orange-500" />
            </div>
            <div className="mt-2 flex items-center text-sm text-green-600">
              <CalendarDaysIcon className="w-4 h-4 mr-1" />
              Excellent
            </div>
          </div>
        </motion.div>

        {/* Quick Actions */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <h2 className="text-2xl font-bold text-foreground mb-6">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {quickActions.map((action, index) => (
              <motion.div
                key={action.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + index * 0.1 }}
              >
                <Link
                  to={action.href}
                  className="card p-6 hover:shadow-lg transition-all group hover:scale-105"
                >
                  <div className="flex items-center space-x-4">
                    <div className={`p-3 rounded-lg ${action.bgColor}`}>
                      <action.icon className={`w-6 h-6 ${action.color}`} />
                    </div>
                    <div>
                      <h3 className="font-medium text-foreground group-hover:text-primary mb-1">
                        {action.name}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {action.description}
                      </p>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Active Projects */}
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="lg:col-span-2"
          >
            <div className="card p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-foreground">Active Projects</h3>
                <Link to="/projects" className="text-primary hover:underline text-sm">
                  View All
                </Link>
              </div>
              <div className="space-y-4">
                {activeProjects.filter(p => p.status !== 'completed').map((project) => (
                  <div key={project.id} className="border border-border rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-medium text-foreground">{project.title}</h4>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(project.status)}`}>
                        {project.status.replace('_', ' ')}
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 mb-3">
                      <div>
                        <p className="text-xs text-muted-foreground">Progress</p>
                        <div className="flex items-center space-x-2">
                          <div className="flex-1 bg-accent rounded-full h-2">
                            <div 
                              className="bg-blue-500 h-2 rounded-full" 
                              style={{ width: `${project.progress}%` }}
                            ></div>
                          </div>
                          <span className="text-xs font-medium">{project.progress}%</span>
                        </div>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Budget</p>
                        <p className="text-sm font-medium">
                          {formatCurrency(project.spent)} / {formatCurrency(project.budget)}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center space-x-4">
                        <span className="text-muted-foreground flex items-center">
                          <UsersIcon className="w-4 h-4 mr-1" />
                          {project.team} members
                        </span>
                        <span className="text-muted-foreground flex items-center">
                          <ClockIcon className="w-4 h-4 mr-1" />
                          {Math.ceil((project.deadline - new Date()) / (1000 * 60 * 60 * 24))} days left
                        </span>
                      </div>
                      <Link to={`/projects/${project.id}`} className="text-primary hover:underline flex items-center">
                        <EyeIcon className="w-4 h-4 mr-1" />
                        View
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Recent Proposals & Notifications */}
          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="space-y-6"
          >
            {/* Recent Proposals */}
            <div className="card p-6">
              <h3 className="text-lg font-bold text-foreground mb-4">Recent Proposals</h3>
              <div className="space-y-3">
                {recentProposals.map((proposal) => (
                  <div key={proposal.id} className="border border-border rounded-lg p-3">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-foreground text-sm">{proposal.title}</h4>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getProposalStatusColor(proposal.status)}`}>
                        {proposal.status.replace('_', ' ')}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground mb-2">{proposal.vendor}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-foreground">
                        {formatCurrency(proposal.amount)}
                      </span>
                      <div className="flex items-center space-x-2">
                        <span className="text-xs text-yellow-600">★ {proposal.rating}</span>
                        <Link to={`/proposals/${proposal.id}`} className="text-xs text-primary hover:underline">
                          Review
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Stats */}
            <div className="card p-6">
              <h3 className="text-lg font-bold text-foreground mb-4">This Month</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Projects Completed</span>
                  <span className="font-medium text-foreground">2</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Total Investment</span>
                  <span className="font-medium text-foreground">{formatCurrency(125000)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Team Efficiency</span>
                  <span className="font-medium text-green-600">+12%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Cost Savings</span>
                  <span className="font-medium text-green-600">{formatCurrency(23000)}</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* AI Chat Modal */}
      {showAIChat && (
        <AIChat 
          isOpen={showAIChat} 
          onClose={() => setShowAIChat(false)}
          userType="client"
        />
      )}
    </div>
  );
};

export default ClientDashboard; 