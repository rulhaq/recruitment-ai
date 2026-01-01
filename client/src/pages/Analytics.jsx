/**
 * This is a product of Scalovate Systems Solutions.
 * All rights reserved.
 */

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { apiService } from '../lib/api';
import {
  ChartBarIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  UsersIcon,
  BriefcaseIcon,
  DocumentTextIcon,
  CurrencyDollarIcon,
  ClockIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  CalendarIcon,
  FunnelIcon,
  ArrowPathIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  EyeIcon
} from '@heroicons/react/24/outline';
import LoadingSpinner from '../components/LoadingSpinner';

const Analytics = () => {
  const { userProfile } = useAuth();
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState('30'); // days
  const [analytics, setAnalytics] = useState({
    overview: {
      totalCandidates: 0,
      activePlacements: 0,
      totalRevenue: 0,
      successRate: 0
    },
    trends: [],
    topPerformers: [],
    recentActivity: []
  });
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    fetchAnalytics();
  }, [dateRange]);

  const fetchAnalytics = async () => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockData = {
        overview: {
          totalCandidates: 156,
          candidateGrowth: 12,
          activeCandidates: 89,
          placedCandidates: 23,
          
          totalJobs: 45,
          jobGrowth: 8,
          activeJobs: 23,
          closedJobs: 15,
          
          totalProposals: 34,
          proposalGrowth: 15,
          approvedProposals: 18,
          pendingProposals: 8,
          
          totalRevenue: 485000,
          revenueGrowth: 22,
          avgDealSize: 32000,
          conversionRate: 68
        },
        
        candidateMetrics: {
          sourceBreakdown: [
            { source: 'Referrals', count: 45, percentage: 29 },
            { source: 'LinkedIn', count: 38, percentage: 24 },
            { source: 'Job Boards', count: 35, percentage: 22 },
            { source: 'Company Website', count: 25, percentage: 16 },
            { source: 'Direct Applications', count: 13, percentage: 8 }
          ],
          
          skillsInDemand: [
            { skill: 'React', count: 32, trend: 'up' },
            { skill: 'Python', count: 28, trend: 'up' },
            { skill: 'AWS', count: 25, trend: 'stable' },
            { skill: 'Node.js', count: 22, trend: 'up' },
            { skill: 'TypeScript', count: 20, trend: 'up' },
            { skill: 'Docker', count: 18, trend: 'stable' },
            { skill: 'Kubernetes', count: 15, trend: 'down' }
          ],
          
          placementsByRole: [
            { role: 'Frontend Developer', placements: 8, avgTime: 18 },
            { role: 'Backend Developer', placements: 6, avgTime: 22 },
            { role: 'Full Stack Engineer', placements: 5, avgTime: 20 },
            { role: 'DevOps Engineer', placements: 3, avgTime: 25 },
            { role: 'UI/UX Designer', placements: 1, avgTime: 15 }
          ]
        },
        
        clientMetrics: {
          topClients: [
            { name: 'TechCorp Solutions', placements: 8, revenue: 120000, satisfaction: 4.8 },
            { name: 'CloudTech Inc', placements: 6, revenue: 95000, satisfaction: 4.6 },
            { name: 'StartupXYZ', placements: 4, revenue: 65000, satisfaction: 4.9 },
            { name: 'Innovation Labs', placements: 3, revenue: 85000, satisfaction: 4.7 },
            { name: 'Design Studio Pro', placements: 2, revenue: 45000, satisfaction: 4.5 }
          ],
          
          industryBreakdown: [
            { industry: 'Technology', percentage: 45, revenue: 218000 },
            { industry: 'Finance', percentage: 25, revenue: 122000 },
            { industry: 'Healthcare', percentage: 15, revenue: 75000 },
            { industry: 'E-commerce', percentage: 10, revenue: 48000 },
            { industry: 'Education', percentage: 5, revenue: 22000 }
          ]
        },
        
        timeToHire: {
          average: 18,
          byRole: [
            { role: 'Frontend Developer', days: 15 },
            { role: 'Backend Developer', days: 20 },
            { role: 'Full Stack Engineer', days: 18 },
            { role: 'DevOps Engineer', days: 22 },
            { role: 'UI/UX Designer', days: 12 }
          ],
          trend: 'improving'
        },
        
        revenueData: {
          monthly: [
            { month: 'Jan', revenue: 45000, placements: 3 },
            { month: 'Feb', revenue: 62000, placements: 4 },
            { month: 'Mar', revenue: 58000, placements: 4 },
            { month: 'Apr', revenue: 71000, placements: 5 },
            { month: 'May', revenue: 69000, placements: 4 },
            { month: 'Jun', revenue: 83000, placements: 6 },
            { month: 'Jul', revenue: 97000, placements: 7 }
          ],
          
          forecast: [
            { month: 'Aug', projected: 105000 },
            { month: 'Sep', projected: 112000 },
            { month: 'Oct', projected: 98000 }
          ]
        },
        
        performanceMetrics: {
          responseTime: {
            avgResponseHours: 4.2,
            improvement: -15
          },
          
          clientSatisfaction: {
            averageRating: 4.7,
            totalReviews: 28,
            breakdown: [
              { stars: 5, count: 18 },
              { stars: 4, count: 8 },
              { stars: 3, count: 2 },
              { stars: 2, count: 0 },
              { stars: 1, count: 0 }
            ]
          },
          
          candidateRetention: {
            sixMonthRetention: 92,
            twelveMonthRetention: 85,
            trend: 'stable'
          }
        }
      };
      
      setAnalytics(mockData);
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      notation: 'compact',
      maximumFractionDigits: 0
    }).format(amount);
  };

  const formatPercentage = (value) => {
    return `${value > 0 ? '+' : ''}${value.toFixed(1)}%`;
  };

  const getGrowthColor = (growth) => {
    return growth > 0 ? 'text-green-600' : growth < 0 ? 'text-red-600' : 'text-gray-600';
  };

  const getGrowthIcon = (growth) => {
    return growth > 0 ? (
      <ArrowTrendingUpIcon className="w-4 h-4 text-green-600" />
    ) : growth < 0 ? (
      <ArrowTrendingDownIcon className="w-4 h-4 text-red-600" />
    ) : null;
  };

  const getChangeIcon = (value) => {
    if (value > 0) return <ArrowTrendingUpIcon className="w-4 h-4 text-green-600" />;
    if (value < 0) return <ArrowTrendingDownIcon className="w-4 h-4 text-red-600" />;
    return <span className="w-4 h-4 text-gray-400">—</span>;
  };

  const getChangeColor = (value) => {
    if (value > 0) return 'text-green-600';
    if (value < 0) return 'text-red-600';
    return 'text-gray-500';
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!analytics) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-foreground mb-2">Unable to load analytics</h2>
          <p className="text-muted-foreground mb-4">Please try again later.</p>
          <button onClick={fetchAnalytics} className="btn btn-primary">
            <ArrowPathIcon className="w-5 h-5" />
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Analytics Dashboard</h1>
              <p className="text-muted-foreground">
                Track your recruitment performance and business insights
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <select
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
                className="input"
              >
                <option value="7">Last 7 days</option>
                <option value="30">Last 30 days</option>
                <option value="90">Last 3 months</option>
                <option value="365">Last year</option>
              </select>
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`btn ${showFilters ? 'btn-primary' : 'btn-outline'}`}
              >
                <FunnelIcon className="w-5 h-5" />
                Filters
              </button>
              <button onClick={fetchAnalytics} className="btn btn-outline">
                <ArrowPathIcon className="w-5 h-5" />
                Refresh
              </button>
            </div>
          </div>
        </div>

        {/* Key Metrics Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="card p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <UsersIcon className="w-6 h-6 text-blue-600" />
                </div>
                <div className="ml-3">
                  <p className="text-sm text-muted-foreground">Total Candidates</p>
                  <p className="text-2xl font-bold text-foreground">{analytics.overview.totalCandidates}</p>
                </div>
              </div>
              <div className="flex items-center">
                {getChangeIcon(analytics.overview.candidateGrowth)}
                <span className={`text-sm ml-1 ${getChangeColor(analytics.overview.candidateGrowth)}`}>
                  {analytics.overview.candidateGrowth > 0 ? '+' : ''}{analytics.overview.candidateGrowth}%
                </span>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div>
                <span className="text-muted-foreground">Active:</span>
                <span className="font-medium ml-1">{analytics.overview.activeCandidates}</span>
              </div>
              <div>
                <span className="text-muted-foreground">Placed:</span>
                <span className="font-medium ml-1">{analytics.overview.placedCandidates}</span>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="card p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <BriefcaseIcon className="w-6 h-6 text-green-600" />
                </div>
                <div className="ml-3">
                  <p className="text-sm text-muted-foreground">Total Jobs</p>
                  <p className="text-2xl font-bold text-foreground">{analytics.overview.totalJobs}</p>
                </div>
              </div>
              <div className="flex items-center">
                {getChangeIcon(analytics.overview.jobGrowth)}
                <span className={`text-sm ml-1 ${getChangeColor(analytics.overview.jobGrowth)}`}>
                  {analytics.overview.jobGrowth > 0 ? '+' : ''}{analytics.overview.jobGrowth}%
                </span>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div>
                <span className="text-muted-foreground">Active:</span>
                <span className="font-medium ml-1">{analytics.overview.activeJobs}</span>
              </div>
              <div>
                <span className="text-muted-foreground">Closed:</span>
                <span className="font-medium ml-1">{analytics.overview.closedJobs}</span>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="card p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                  <DocumentTextIcon className="w-6 h-6 text-purple-600" />
                </div>
                <div className="ml-3">
                  <p className="text-sm text-muted-foreground">Proposals</p>
                  <p className="text-2xl font-bold text-foreground">{analytics.overview.totalProposals}</p>
                </div>
              </div>
              <div className="flex items-center">
                {getChangeIcon(analytics.overview.proposalGrowth)}
                <span className={`text-sm ml-1 ${getChangeColor(analytics.overview.proposalGrowth)}`}>
                  {analytics.overview.proposalGrowth > 0 ? '+' : ''}{analytics.overview.proposalGrowth}%
                </span>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div>
                <span className="text-muted-foreground">Approved:</span>
                <span className="font-medium ml-1">{analytics.overview.approvedProposals}</span>
              </div>
              <div>
                <span className="text-muted-foreground">Pending:</span>
                <span className="font-medium ml-1">{analytics.overview.pendingProposals}</span>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="card p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                  <CurrencyDollarIcon className="w-6 h-6 text-orange-600" />
                </div>
                <div className="ml-3">
                  <p className="text-sm text-muted-foreground">Total Revenue</p>
                  <p className="text-2xl font-bold text-foreground">{formatCurrency(analytics.overview.totalRevenue)}</p>
                </div>
              </div>
              <div className="flex items-center">
                {getChangeIcon(analytics.overview.revenueGrowth)}
                <span className={`text-sm ml-1 ${getChangeColor(analytics.overview.revenueGrowth)}`}>
                  {analytics.overview.revenueGrowth > 0 ? '+' : ''}{analytics.overview.revenueGrowth}%
                </span>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div>
                <span className="text-muted-foreground">Avg Deal:</span>
                <span className="font-medium ml-1">{formatCurrency(analytics.overview.avgDealSize)}</span>
              </div>
              <div>
                <span className="text-muted-foreground">Conv Rate:</span>
                <span className="font-medium ml-1">{analytics.overview.conversionRate}%</span>
              </div>
            </div>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Revenue Chart */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="card p-6"
          >
            <h3 className="text-lg font-semibold mb-4">Revenue Trend</h3>
            <div className="space-y-3">
              {analytics.revenueData.monthly.slice(-6).map((item, index) => (
                <div key={item.month} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 bg-primary rounded-full"></div>
                    <span className="text-sm font-medium">{item.month}</span>
                  </div>
                  <div className="flex items-center space-x-4">
                    <span className="text-sm text-muted-foreground">{item.placements} placements</span>
                    <span className="font-semibold">{formatCurrency(item.revenue)}</span>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-6 pt-4 border-t border-border">
              <h4 className="text-sm font-medium mb-3 text-muted-foreground">Forecast</h4>
              <div className="space-y-2">
                {analytics.revenueData.forecast.map((item) => (
                  <div key={item.month} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-3 h-3 bg-muted border-2 border-primary rounded-full"></div>
                      <span className="text-sm font-medium text-muted-foreground">{item.month}</span>
                    </div>
                    <span className="font-semibold text-muted-foreground">{formatCurrency(item.projected)}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Top Clients */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="card p-6"
          >
            <h3 className="text-lg font-semibold mb-4">Top Clients</h3>
            <div className="space-y-4">
              {analytics.clientMetrics.topClients.map((client, index) => (
                <div key={client.name} className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                      <span className="text-primary font-medium text-sm">
                        {index + 1}
                      </span>
                    </div>
                    <div>
                      <h4 className="font-medium text-foreground">{client.name}</h4>
                      <p className="text-sm text-muted-foreground">
                        {client.placements} placements • {client.satisfaction}★
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-foreground">{formatCurrency(client.revenue)}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* Skills in Demand */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="card p-6"
          >
            <h3 className="text-lg font-semibold mb-4">Skills in Demand</h3>
            <div className="space-y-3">
              {analytics.candidateMetrics.skillsInDemand.map((skill) => (
                <div key={skill.skill} className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="font-medium">{skill.skill}</span>
                    {skill.trend === 'up' && <ArrowUpIcon className="w-4 h-4 text-green-600" />}
                    {skill.trend === 'down' && <ArrowDownIcon className="w-4 h-4 text-red-600" />}
                  </div>
                  <span className="text-sm text-muted-foreground">{skill.count} requests</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Time to Hire */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="card p-6"
          >
            <h3 className="text-lg font-semibold mb-4">Time to Hire</h3>
            <div className="text-center mb-4">
              <div className="text-3xl font-bold text-primary">{analytics.timeToHire.average}</div>
              <div className="text-sm text-muted-foreground">days average</div>
              <div className="text-xs text-green-600 mt-1">
                {analytics.timeToHire.trend === 'improving' ? '↓ Improving' : '→ Stable'}
              </div>
            </div>
            
            <div className="space-y-2">
              {analytics.timeToHire.byRole.map((role) => (
                <div key={role.role} className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">{role.role}</span>
                  <span className="font-medium">{role.days} days</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Performance Metrics */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="card p-6"
          >
            <h3 className="text-lg font-semibold mb-4">Performance</h3>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Avg Response Time</p>
                  <p className="font-semibold">{analytics.performanceMetrics.responseTime.avgResponseHours} hours</p>
                </div>
                <div className="flex items-center">
                  <ArrowTrendingDownIcon className="w-4 h-4 text-green-600" />
                  <span className="text-sm text-green-600 ml-1">
                    {Math.abs(analytics.performanceMetrics.responseTime.improvement)}% faster
                  </span>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Client Satisfaction</p>
                  <p className="font-semibold">{analytics.performanceMetrics.clientSatisfaction.averageRating}/5.0</p>
                </div>
                <div className="text-sm text-muted-foreground">
                  {analytics.performanceMetrics.clientSatisfaction.totalReviews} reviews
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">6-Month Retention</p>
                  <p className="font-semibold">{analytics.performanceMetrics.candidateRetention.sixMonthRetention}%</p>
                </div>
                <div className="text-sm text-muted-foreground">
                  12M: {analytics.performanceMetrics.candidateRetention.twelveMonthRetention}%
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Candidate Sources */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="card p-6"
          >
            <h3 className="text-lg font-semibold mb-4">Candidate Sources</h3>
            <div className="space-y-4">
              {analytics.candidateMetrics.sourceBreakdown.map((source) => (
                <div key={source.source} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{source.source}</span>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-muted-foreground">{source.count}</span>
                      <span className="text-sm font-medium">{source.percentage}%</span>
                    </div>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div
                      className="bg-primary h-2 rounded-full transition-all duration-300"
                      style={{ width: `${source.percentage}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Industry Breakdown */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="card p-6"
          >
            <h3 className="text-lg font-semibold mb-4">Revenue by Industry</h3>
            <div className="space-y-4">
              {analytics.clientMetrics.industryBreakdown.map((industry) => (
                <div key={industry.industry} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{industry.industry}</span>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-muted-foreground">{formatCurrency(industry.revenue)}</span>
                      <span className="text-sm font-medium">{industry.percentage}%</span>
                    </div>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div
                      className="bg-primary h-2 rounded-full transition-all duration-300"
                      style={{ width: `${industry.percentage}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Analytics; 