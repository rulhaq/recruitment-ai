/**
 * This is a product of Scalovate Systems Solutions.
 * All rights reserved.
 */

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { firestoreService } from '../lib/firebase';
import {
  UsersIcon,
  ChartBarIcon,
  ExclamationTriangleIcon,
  CogIcon,
  ShieldCheckIcon,
  UserGroupIcon,
  ClockIcon,
  BanknotesIcon,
  CheckCircleIcon,
  XCircleIcon,
  EyeIcon,
  PencilIcon,
  TrashIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  ArrowPathIcon,
  DocumentTextIcon,
  BellIcon
} from '@heroicons/react/24/outline';
import LoadingSpinner from '../components/LoadingSpinner';

const AdminDashboard = () => {
  const { userProfile, hasAdminAccess } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({});
  const [recentUsers, setRecentUsers] = useState([]);
  const [systemAlerts, setSystemAlerts] = useState([]);
  const [recentActivity, setRecentActivity] = useState([]);

  // Redirect if not admin
  useEffect(() => {
    if (userProfile && !hasAdminAccess()) {
      navigate('/dashboard');
    }
  }, [userProfile, hasAdminAccess, navigate]);

  useEffect(() => {
    if (hasAdminAccess()) {
      fetchAdminData();
    }
  }, [hasAdminAccess]);

  const fetchAdminData = async () => {
    try {
      setLoading(true);
      
      // Mock data for demo - in real app, these would be API calls
      const mockStats = {
        totalUsers: 1247,
        activeUsers: 892,
        totalJobs: 543,
        activePlacements: 234,
        totalRevenue: 2456789,
        systemHealth: 98.5,
        newUsersToday: 23,
        activeJobsToday: 45
      };

      const mockRecentUsers = [
        {
          id: '1',
          name: 'John Smith',
          email: 'john@company.com',
          role: 'client',
          joinDate: new Date().toISOString(),
          status: 'active'
        },
        {
          id: '2',
          name: 'Sarah Johnson',
          email: 'sarah@agency.com',
          role: 'recruiter',
          joinDate: new Date(Date.now() - 86400000).toISOString(),
          status: 'active'
        },
        {
          id: '3',
          name: 'Mike Wilson',
          email: 'mike@startup.com',
          role: 'client',
          joinDate: new Date(Date.now() - 172800000).toISOString(),
          status: 'pending'
        }
      ];

      const mockAlerts = [
        {
          id: '1',
          type: 'warning',
          message: 'High API usage detected - approaching rate limits',
          timestamp: new Date().toISOString(),
          severity: 'medium'
        },
        {
          id: '2',
          type: 'info',
          message: 'System backup completed successfully',
          timestamp: new Date(Date.now() - 3600000).toISOString(),
          severity: 'low'
        },
        {
          id: '3',
          type: 'error',
          message: 'Failed payment detected for user ID: 12345',
          timestamp: new Date(Date.now() - 7200000).toISOString(),
          severity: 'high'
        }
      ];

      const mockActivity = [
        {
          id: '1',
          user: 'sarah@agency.com',
          action: 'Created new job posting',
          details: 'Senior React Developer - Remote',
          timestamp: new Date().toISOString()
        },
        {
          id: '2',
          user: 'john@company.com',
          action: 'Generated proposal',
          details: 'Staff Augmentation - 3 developers',
          timestamp: new Date(Date.now() - 1800000).toISOString()
        },
        {
          id: '3',
          user: 'mike@startup.com',
          action: 'Uploaded candidate CV',
          details: 'Frontend Developer Profile',
          timestamp: new Date(Date.now() - 3600000).toISOString()
        }
      ];

      setStats(mockStats);
      setRecentUsers(mockRecentUsers);
      setSystemAlerts(mockAlerts);
      setRecentActivity(mockActivity);
    } catch (error) {
      console.error('Error fetching admin data:', error);
    } finally {
      setLoading(false);
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

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'text-green-600 bg-green-100';
      case 'pending': return 'text-yellow-600 bg-yellow-100';
      case 'inactive': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getAlertIcon = (type) => {
    switch (type) {
      case 'error': return <XCircleIcon className="w-5 h-5 text-red-500" />;
      case 'warning': return <ExclamationTriangleIcon className="w-5 h-5 text-yellow-500" />;
      case 'info': return <CheckCircleIcon className="w-5 h-5 text-blue-500" />;
      default: return <BellIcon className="w-5 h-5 text-gray-500" />;
    }
  };

  if (!hasAdminAccess()) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <ShieldCheckIcon className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-foreground mb-2">Access Denied</h1>
          <p className="text-muted-foreground mb-4">You don't have permission to access this area.</p>
          <Link to="/dashboard" className="btn btn-primary">
            Return to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <LoadingSpinner size="lg" />
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
              <ShieldCheckIcon className="w-8 h-8 text-primary" />
              <div>
                <h1 className="text-2xl font-bold text-foreground">Admin Dashboard</h1>
                <p className="text-sm text-muted-foreground">System Management & Overview</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <button
                onClick={fetchAdminData}
                className="btn btn-outline"
              >
                <ArrowPathIcon className="w-4 h-4 mr-2" />
                Refresh
              </button>
              <Link to="/admin/users" className="btn btn-primary">
                Manage Users
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="card p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Users</p>
                <p className="text-2xl font-bold text-foreground">{stats.totalUsers?.toLocaleString()}</p>
                <p className="text-sm text-green-600">+{stats.newUsersToday} today</p>
              </div>
              <UsersIcon className="w-8 h-8 text-blue-500" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="card p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Active Users</p>
                <p className="text-2xl font-bold text-foreground">{stats.activeUsers?.toLocaleString()}</p>
                <p className="text-sm text-muted-foreground">{((stats.activeUsers / stats.totalUsers) * 100).toFixed(1)}% active</p>
              </div>
              <UserGroupIcon className="w-8 h-8 text-green-500" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="card p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Revenue</p>
                <p className="text-2xl font-bold text-foreground">{formatCurrency(stats.totalRevenue)}</p>
                <p className="text-sm text-green-600">+12% this month</p>
              </div>
              <BanknotesIcon className="w-8 h-8 text-emerald-500" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="card p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">System Health</p>
                <p className="text-2xl font-bold text-foreground">{stats.systemHealth}%</p>
                <p className="text-sm text-green-600">All systems operational</p>
              </div>
              <CheckCircleIcon className="w-8 h-8 text-green-500" />
            </div>
          </motion.div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Link
            to="/admin/users"
            className="card p-4 hover:shadow-lg transition-shadow group"
          >
            <div className="flex items-center space-x-3">
              <UsersIcon className="w-6 h-6 text-primary group-hover:scale-110 transition-transform" />
              <span className="font-medium text-foreground">Manage Users</span>
            </div>
          </Link>

          <Link
            to="/admin/system"
            className="card p-4 hover:shadow-lg transition-shadow group"
          >
            <div className="flex items-center space-x-3">
              <CogIcon className="w-6 h-6 text-primary group-hover:scale-110 transition-transform" />
              <span className="font-medium text-foreground">System Settings</span>
            </div>
          </Link>

          <Link
            to="/admin/analytics"
            className="card p-4 hover:shadow-lg transition-shadow group"
          >
            <div className="flex items-center space-x-3">
              <ChartBarIcon className="w-6 h-6 text-primary group-hover:scale-110 transition-transform" />
              <span className="font-medium text-foreground">Advanced Analytics</span>
            </div>
          </Link>

          <Link
            to="/admin/monitoring"
            className="card p-4 hover:shadow-lg transition-shadow group"
          >
            <div className="flex items-center space-x-3">
              <ExclamationTriangleIcon className="w-6 h-6 text-primary group-hover:scale-110 transition-transform" />
              <span className="font-medium text-foreground">System Monitoring</span>
            </div>
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Users */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            className="card p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-foreground">Recent Users</h2>
              <Link to="/admin/users" className="text-primary hover:underline text-sm">
                View All
              </Link>
            </div>

            <div className="space-y-4">
              {recentUsers.map((user) => (
                <div key={user.id} className="flex items-center justify-between p-3 bg-accent rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                      <span className="text-primary font-medium">
                        {user.name.charAt(0)}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium text-foreground">{user.name}</p>
                      <p className="text-sm text-muted-foreground">{user.email}</p>
                      <p className="text-xs text-muted-foreground">
                        {user.role} • Joined {formatDate(user.joinDate)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(user.status)}`}>
                      {user.status}
                    </span>
                    <button className="p-1 hover:bg-accent-foreground/10 rounded">
                      <EyeIcon className="w-4 h-4 text-muted-foreground" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* System Alerts */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            className="card p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-foreground">System Alerts</h2>
              <Link to="/admin/monitoring" className="text-primary hover:underline text-sm">
                View All
              </Link>
            </div>

            <div className="space-y-4">
              {systemAlerts.map((alert) => (
                <div key={alert.id} className="flex items-start space-x-3 p-3 bg-accent rounded-lg">
                  <div className="flex-shrink-0 mt-1">
                    {getAlertIcon(alert.type)}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-foreground">{alert.message}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {formatDate(alert.timestamp)} • Severity: {alert.severity}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Recent Activity */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            className="lg:col-span-2 card p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-foreground">Recent Activity</h2>
              <button className="text-primary hover:underline text-sm">
                View Activity Log
              </button>
            </div>

            <div className="overflow-hidden">
              <div className="space-y-4">
                {recentActivity.map((activity) => (
                  <div key={activity.id} className="flex items-center space-x-4 p-3 bg-accent rounded-lg">
                    <div className="w-2 h-2 bg-primary rounded-full flex-shrink-0"></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-foreground">
                        <span className="text-primary">{activity.user}</span> {activity.action}
                      </p>
                      <p className="text-xs text-muted-foreground">{activity.details}</p>
                    </div>
                    <p className="text-xs text-muted-foreground flex-shrink-0">
                      {formatDate(activity.timestamp)}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard; 