/**
 * This is a product of Scalovate Systems Solutions.
 * All rights reserved.
 */

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { firestoreService } from '../lib/firebase';
import {
  UsersIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  PlusIcon,
  PencilIcon,
  TrashIcon,
  EyeIcon,
  UserCircleIcon,
  ShieldCheckIcon,
  ChevronDownIcon,
  CheckIcon,
  XMarkIcon,
  ArrowPathIcon,
  ExclamationTriangleIcon,
  ClockIcon,
  ChartBarIcon,
  BriefcaseIcon,
  DocumentTextIcon,
  UserIcon,
  ChatBubbleLeftRightIcon,
  CurrencyDollarIcon
} from '@heroicons/react/24/outline';
import LoadingSpinner from '../components/LoadingSpinner';

const AdminUserManagement = () => {
  const { userProfile, hasAdminAccess } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [sortBy, setSortBy] = useState('joinDate');
  const [sortOrder, setSortOrder] = useState('desc');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [showBulkActions, setShowBulkActions] = useState(false);
  const [showUserModal, setShowUserModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);

  // Mock activity data - in real app, this would come from backend
  const mockActivities = [
    {
      id: 1,
      userId: 'user_001',
      userName: 'Sarah Johnson',
      userRole: 'recruiter',
      action: 'Created job posting',
      details: 'Senior React Developer position for TechCorp Inc.',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
      ipAddress: '192.168.1.100',
      userAgent: 'Chrome 120.0'
    },
    {
      id: 2,
      userId: 'user_002',
      userName: 'Michael Chen',
      userRole: 'client',
      action: 'Reviewed proposal',
      details: 'Approved proposal #PRO-2024-001 for $85,000',
      timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
      ipAddress: '10.0.0.55',
      userAgent: 'Safari 17.1'
    },
    {
      id: 3,
      userId: 'user_003',
      userName: 'Emily Rodriguez',
      userRole: 'candidate',
      action: 'Updated profile',
      details: 'Added 2 new skills: React Native, GraphQL',
      timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000),
      ipAddress: '172.16.0.1',
      userAgent: 'Firefox 121.0'
    },
    {
      id: 4,
      userId: 'user_001',
      userName: 'Sarah Johnson',
      userRole: 'recruiter',
      action: 'Contacted candidate',
      details: 'Sent interview invitation to John Doe',
      timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000),
      ipAddress: '192.168.1.100',
      userAgent: 'Chrome 120.0'
    },
    {
      id: 5,
      userId: 'user_004',
      userName: 'David Kim',
      userRole: 'recruiter',
      action: 'AI search performed',
      details: 'Searched for "Senior Python Developer" with AI matching',
      timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000),
      ipAddress: '203.0.113.10',
      userAgent: 'Edge 120.0'
    },
    {
      id: 6,
      userId: 'user_002',
      userName: 'Michael Chen',
      userRole: 'client',
      action: 'Payment processed',
      details: 'Paid invoice #INV-2024-045 - $12,500',
      timestamp: new Date(Date.now() - 18 * 60 * 60 * 1000),
      ipAddress: '10.0.0.55',
      userAgent: 'Safari 17.1'
    }
  ];

  const [activityFilters, setActivityFilters] = useState({
    role: 'all',
    action: 'all',
    timeRange: '24h'
  });

  const [filteredActivities, setFilteredActivities] = useState(mockActivities);

  // Role options
  const roles = [
    { value: 'all', label: 'All Roles' },
    { value: 'super_admin', label: 'Super Admin' },
    { value: 'admin', label: 'Admin' },
    { value: 'recruiter', label: 'Recruiter' },
    { value: 'client', label: 'Client' },
    { value: 'candidate', label: 'Candidate' }
  ];

  const statuses = [
    { value: 'all', label: 'All Statuses' },
    { value: 'active', label: 'Active' },
    { value: 'pending', label: 'Pending' },
    { value: 'suspended', label: 'Suspended' },
    { value: 'inactive', label: 'Inactive' }
  ];

  // Redirect if not admin
  useEffect(() => {
    if (userProfile && !hasAdminAccess()) {
      navigate('/dashboard');
    }
  }, [userProfile, hasAdminAccess, navigate]);

  useEffect(() => {
    if (hasAdminAccess()) {
      fetchUsers();
    }
  }, [hasAdminAccess]);

  useEffect(() => {
    filterAndSortUsers();
  }, [users, searchTerm, selectedRole, selectedStatus, sortBy, sortOrder]);

  useEffect(() => {
    // Filter activities based on current filters
    let filtered = mockActivities;
    
    if (activityFilters.role !== 'all') {
      filtered = filtered.filter(activity => activity.userRole === activityFilters.role);
    }
    
    if (activityFilters.action !== 'all') {
      filtered = filtered.filter(activity => 
        activity.action.toLowerCase().includes(activityFilters.action.toLowerCase())
      );
    }
    
    // Time range filtering
    const now = new Date();
    if (activityFilters.timeRange !== 'all') {
      const timeRanges = {
        '1h': 1 * 60 * 60 * 1000,
        '24h': 24 * 60 * 60 * 1000,
        '7d': 7 * 24 * 60 * 60 * 1000,
        '30d': 30 * 24 * 60 * 60 * 1000
      };
      
      const cutoff = new Date(now.getTime() - timeRanges[activityFilters.timeRange]);
      filtered = filtered.filter(activity => activity.timestamp >= cutoff);
    }
    
    setFilteredActivities(filtered);
  }, [activityFilters]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      
      // Mock user data - in real app, this would be an API call
      const mockUsers = [
        {
          id: '1',
          name: 'John Smith',
          email: 'john@company.com',
          role: 'client',
          status: 'active',
          joinDate: new Date().toISOString(),
          lastLogin: new Date(Date.now() - 3600000).toISOString(),
          totalJobs: 15,
          avatar: null,
          company: 'TechCorp Inc.',
          verified: true
        },
        {
          id: '2',
          name: 'Sarah Johnson',
          email: 'sarah@agency.com',
          role: 'recruiter',
          status: 'active',
          joinDate: new Date(Date.now() - 86400000).toISOString(),
          lastLogin: new Date(Date.now() - 1800000).toISOString(),
          totalJobs: 42,
          avatar: null,
          company: 'Talent Solutions',
          verified: true
        },
        {
          id: '3',
          name: 'Mike Wilson',
          email: 'mike@startup.com',
          role: 'client',
          status: 'pending',
          joinDate: new Date(Date.now() - 172800000).toISOString(),
          lastLogin: null,
          totalJobs: 0,
          avatar: null,
          company: 'StartupCo',
          verified: false
        },
        {
          id: '4',
          name: 'Emily Davis',
          email: 'emily@example.com',
          role: 'admin',
          status: 'active',
          joinDate: new Date(Date.now() - 2592000000).toISOString(),
          lastLogin: new Date(Date.now() - 7200000).toISOString(),
          totalJobs: 0,
          avatar: null,
          company: 'Cartafella',
          verified: true
        },
        {
          id: '5',
          name: 'Alex Thompson',
          email: 'alex@freelance.com',
          role: 'candidate',
          status: 'active',
          joinDate: new Date(Date.now() - 604800000).toISOString(),
          lastLogin: new Date(Date.now() - 14400000).toISOString(),
          totalJobs: 8,
          avatar: null,
          company: 'Freelancer',
          verified: true
        }
      ];

      setUsers(mockUsers);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterAndSortUsers = () => {
    let filtered = users;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(user =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.company.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Role filter
    if (selectedRole !== 'all') {
      filtered = filtered.filter(user => user.role === selectedRole);
    }

    // Status filter
    if (selectedStatus !== 'all') {
      filtered = filtered.filter(user => user.status === selectedStatus);
    }

    // Sort
    filtered.sort((a, b) => {
      let aValue = a[sortBy];
      let bValue = b[sortBy];

      if (sortBy === 'joinDate' || sortBy === 'lastLogin') {
        aValue = new Date(aValue || 0);
        bValue = new Date(bValue || 0);
      }

      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    setFilteredUsers(filtered);
  };

  const handleSelectUser = (userId) => {
    setSelectedUsers(prev => {
      const newSelected = prev.includes(userId)
        ? prev.filter(id => id !== userId)
        : [...prev, userId];
      setShowBulkActions(newSelected.length > 0);
      return newSelected;
    });
  };

  const handleSelectAll = () => {
    if (selectedUsers.length === filteredUsers.length) {
      setSelectedUsers([]);
      setShowBulkActions(false);
    } else {
      setSelectedUsers(filteredUsers.map(user => user.id));
      setShowBulkActions(true);
    }
  };

  const handleEditUser = (user) => {
    setEditingUser(user);
    setShowUserModal(true);
  };

  const handleDeleteUser = (user) => {
    setUserToDelete(user);
    setShowDeleteConfirm(true);
  };

  const confirmDeleteUser = async () => {
    try {
      // In real app, this would be an API call
      setUsers(prev => prev.filter(user => user.id !== userToDelete.id));
      setShowDeleteConfirm(false);
      setUserToDelete(null);
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  const handleBulkAction = async (action) => {
    try {
      // In real app, these would be API calls
      switch (action) {
        case 'activate':
          setUsers(prev => prev.map(user => 
            selectedUsers.includes(user.id) ? { ...user, status: 'active' } : user
          ));
          break;
        case 'suspend':
          setUsers(prev => prev.map(user => 
            selectedUsers.includes(user.id) ? { ...user, status: 'suspended' } : user
          ));
          break;
        case 'delete':
          setUsers(prev => prev.filter(user => !selectedUsers.includes(user.id)));
          break;
      }
      setSelectedUsers([]);
      setShowBulkActions(false);
    } catch (error) {
      console.error('Error performing bulk action:', error);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Never';
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'text-green-600 bg-green-100';
      case 'pending': return 'text-yellow-600 bg-yellow-100';
      case 'suspended': return 'text-red-600 bg-red-100';
      case 'inactive': return 'text-gray-600 bg-gray-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getRoleColor = (role) => {
    switch (role) {
      case 'super_admin': return 'text-purple-600 bg-purple-100';
      case 'admin': return 'text-blue-600 bg-blue-100';
      case 'recruiter': return 'text-emerald-600 bg-emerald-100';
      case 'client': return 'text-orange-600 bg-orange-100';
      case 'candidate': return 'text-cyan-600 bg-cyan-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getActionIcon = (action) => {
    if (action.includes('job') || action.includes('posting')) {
      return <BriefcaseIcon className="w-4 h-4 text-blue-500" />;
    }
    if (action.includes('proposal') || action.includes('review')) {
      return <DocumentTextIcon className="w-4 h-4 text-green-500" />;
    }
    if (action.includes('profile') || action.includes('updated')) {
      return <UserIcon className="w-4 h-4 text-purple-500" />;
    }
    if (action.includes('contact') || action.includes('message')) {
      return <ChatBubbleLeftRightIcon className="w-4 h-4 text-orange-500" />;
    }
    if (action.includes('payment') || action.includes('invoice')) {
      return <CurrencyDollarIcon className="w-4 h-4 text-emerald-500" />;
    }
    if (action.includes('AI') || action.includes('search')) {
      return <MagnifyingGlassIcon className="w-4 h-4 text-indigo-500" />;
    }
    return <ClockIcon className="w-4 h-4 text-gray-500" />;
  };

  const formatTimeAgo = (timestamp) => {
    const now = new Date();
    const diff = now - timestamp;
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
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
              <Link to="/admin" className="text-muted-foreground hover:text-foreground">
                <ShieldCheckIcon className="w-6 h-6" />
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-foreground">User Management</h1>
                <p className="text-sm text-muted-foreground">
                  Manage user accounts, roles, and permissions
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <button
                onClick={fetchUsers}
                className="btn btn-outline"
              >
                <ArrowPathIcon className="w-4 h-4 mr-2" />
                Refresh
              </button>
              <button
                onClick={() => {
                  setEditingUser(null);
                  setShowUserModal(true);
                }}
                className="btn btn-primary"
              >
                <PlusIcon className="w-4 h-4 mr-2" />
                Add User
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="card p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Users</p>
                <p className="text-2xl font-bold text-foreground">{users.length}</p>
              </div>
              <UsersIcon className="w-8 h-8 text-blue-500" />
            </div>
          </div>
          
          <div className="card p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Active Users</p>
                <p className="text-2xl font-bold text-foreground">
                  {users.filter(u => u.status === 'active').length}
                </p>
              </div>
              <CheckIcon className="w-8 h-8 text-green-500" />
            </div>
          </div>
          
          <div className="card p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Pending Users</p>
                <p className="text-2xl font-bold text-foreground">
                  {users.filter(u => u.status === 'pending').length}
                </p>
              </div>
              <ClockIcon className="w-8 h-8 text-yellow-500" />
            </div>
          </div>
          
          <div className="card p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Admins</p>
                <p className="text-2xl font-bold text-foreground">
                  {users.filter(u => u.role === 'admin' || u.role === 'super_admin').length}
                </p>
              </div>
              <ShieldCheckIcon className="w-8 h-8 text-purple-500" />
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="card p-6 mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex items-center space-x-4 flex-1">
              <div className="relative flex-1 max-w-md">
                <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search users..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="input pl-10 w-full"
                />
              </div>
              
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="btn btn-outline"
              >
                <FunnelIcon className="w-4 h-4 mr-2" />
                Filters
                <ChevronDownIcon className={`w-4 h-4 ml-2 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
              </button>
            </div>

            <div className="flex items-center space-x-2">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="input"
              >
                <option value="joinDate">Join Date</option>
                <option value="lastLogin">Last Login</option>
                <option value="name">Name</option>
                <option value="email">Email</option>
                <option value="role">Role</option>
                <option value="status">Status</option>
              </select>
              
              <button
                onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                className="btn btn-outline px-3"
              >
                {sortOrder === 'asc' ? '↑' : '↓'}
              </button>
            </div>
          </div>

          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-4 pt-4 border-t border-border"
              >
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1">
                      Role
                    </label>
                    <select
                      value={selectedRole}
                      onChange={(e) => setSelectedRole(e.target.value)}
                      className="input w-full"
                    >
                      {roles.map((role) => (
                        <option key={role.value} value={role.value}>
                          {role.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1">
                      Status
                    </label>
                    <select
                      value={selectedStatus}
                      onChange={(e) => setSelectedStatus(e.target.value)}
                      className="input w-full"
                    >
                      {statuses.map((status) => (
                        <option key={status.value} value={status.value}>
                          {status.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <div className="flex items-end">
                    <button
                      onClick={() => {
                        setSelectedRole('all');
                        setSelectedStatus('all');
                        setSearchTerm('');
                      }}
                      className="btn btn-outline w-full"
                    >
                      Clear Filters
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Bulk Actions */}
        <AnimatePresence>
          {showBulkActions && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="card p-4 mb-6 bg-primary/5 border-primary/20"
            >
              <div className="flex items-center justify-between">
                <p className="font-medium text-foreground">
                  {selectedUsers.length} user{selectedUsers.length > 1 ? 's' : ''} selected
                </p>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleBulkAction('activate')}
                    className="btn btn-sm btn-outline"
                  >
                    Activate
                  </button>
                  <button
                    onClick={() => handleBulkAction('suspend')}
                    className="btn btn-sm btn-outline"
                  >
                    Suspend
                  </button>
                  <button
                    onClick={() => handleBulkAction('delete')}
                    className="btn btn-sm btn-destructive"
                  >
                    Delete
                  </button>
                  <button
                    onClick={() => {
                      setSelectedUsers([]);
                      setShowBulkActions(false);
                    }}
                    className="btn btn-sm btn-ghost"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Users Table */}
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-accent">
                <tr>
                  <th className="p-4 text-left">
                    <input
                      type="checkbox"
                      checked={selectedUsers.length === filteredUsers.length && filteredUsers.length > 0}
                      onChange={handleSelectAll}
                      className="rounded border-border"
                    />
                  </th>
                  <th className="p-4 text-left font-medium text-foreground">User</th>
                  <th className="p-4 text-left font-medium text-foreground">Role</th>
                  <th className="p-4 text-left font-medium text-foreground">Status</th>
                  <th className="p-4 text-left font-medium text-foreground">Join Date</th>
                  <th className="p-4 text-left font-medium text-foreground">Last Login</th>
                  <th className="p-4 text-left font-medium text-foreground">Jobs</th>
                  <th className="p-4 text-left font-medium text-foreground">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user) => (
                  <motion.tr
                    key={user.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="border-b border-border hover:bg-accent/50"
                  >
                    <td className="p-4">
                      <input
                        type="checkbox"
                        checked={selectedUsers.includes(user.id)}
                        onChange={() => handleSelectUser(user.id)}
                        className="rounded border-border"
                      />
                    </td>
                    <td className="p-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                          {user.avatar ? (
                            <img
                              src={user.avatar}
                              alt={user.name}
                              className="w-10 h-10 rounded-full object-cover"
                            />
                          ) : (
                            <span className="text-primary font-medium">
                              {user.name.charAt(0)}
                            </span>
                          )}
                        </div>
                        <div>
                          <p className="font-medium text-foreground">{user.name}</p>
                          <p className="text-sm text-muted-foreground">{user.email}</p>
                          <p className="text-xs text-muted-foreground">{user.company}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRoleColor(user.role)}`}>
                        {user.role.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="p-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(user.status)}`}>
                        {user.status}
                      </span>
                    </td>
                    <td className="p-4 text-sm text-muted-foreground">
                      {formatDate(user.joinDate)}
                    </td>
                    <td className="p-4 text-sm text-muted-foreground">
                      {formatDate(user.lastLogin)}
                    </td>
                    <td className="p-4 text-sm text-foreground">
                      {user.totalJobs}
                    </td>
                    <td className="p-4">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleEditUser(user)}
                          className="p-2 hover:bg-accent rounded-lg transition-colors"
                          title="Edit User"
                        >
                          <PencilIcon className="w-4 h-4 text-muted-foreground" />
                        </button>
                        <button
                          className="p-2 hover:bg-accent rounded-lg transition-colors"
                          title="View Details"
                        >
                          <EyeIcon className="w-4 h-4 text-muted-foreground" />
                        </button>
                        <button
                          onClick={() => handleDeleteUser(user)}
                          className="p-2 hover:bg-accent rounded-lg transition-colors"
                          title="Delete User"
                        >
                          <TrashIcon className="w-4 h-4 text-red-500" />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredUsers.length === 0 && (
            <div className="p-12 text-center">
              <UsersIcon className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium text-foreground mb-2">No users found</h3>
              <p className="text-muted-foreground">
                Try adjusting your search or filter criteria.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {showDeleteConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-card rounded-lg p-6 max-w-md w-full"
            >
              <div className="flex items-center space-x-3 mb-4">
                <ExclamationTriangleIcon className="w-6 h-6 text-red-500" />
                <h3 className="text-lg font-bold text-foreground">Delete User</h3>
              </div>
              
              <p className="text-muted-foreground mb-6">
                Are you sure you want to delete <strong>{userToDelete?.name}</strong>? 
                This action cannot be undone.
              </p>
              
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="btn btn-outline"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDeleteUser}
                  className="btn btn-destructive"
                >
                  Delete User
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminUserManagement; 