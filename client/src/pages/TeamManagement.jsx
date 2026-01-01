/**
 * This is a product of Scalovate Systems Solutions.
 * All rights reserved.
 */

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { apiService } from '../lib/api';
import {
  UserGroupIcon,
  PlusIcon,
  MagnifyingGlassIcon,
  EyeIcon,
  PencilIcon,
  TrashIcon,
  UserIcon,
  EnvelopeIcon,
  PhoneIcon,
  CalendarIcon,
  ShieldCheckIcon,
  ClockIcon,
  TrophyIcon,
  StarIcon,
  BanknotesIcon,
  CogIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';
import LoadingSpinner from '../components/LoadingSpinner';

const TeamManagement = () => {
  const { userProfile } = useAuth();
  const [loading, setLoading] = useState(false);
  const [teamMembers, setTeamMembers] = useState([]);
  const [filteredMembers, setFilteredMembers] = useState([]);
  const [selectedMember, setSelectedMember] = useState(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');
  const [sortBy, setSortBy] = useState('name');

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    role: 'recruiter',
    department: '',
    salary: '',
    startDate: '',
    skills: '',
    permissions: []
  });

  const roles = [
    { value: 'admin', label: 'Administrator', color: 'bg-red-100 text-red-800' },
    { value: 'manager', label: 'Manager', color: 'bg-purple-100 text-purple-800' },
    { value: 'recruiter', label: 'Recruiter', color: 'bg-blue-100 text-blue-800' },
    { value: 'account-manager', label: 'Account Manager', color: 'bg-green-100 text-green-800' },
    { value: 'analyst', label: 'Analyst', color: 'bg-yellow-100 text-yellow-800' }
  ];

  const permissions = [
    'view_candidates',
    'manage_candidates',
    'view_clients',
    'manage_clients',
    'view_proposals',
    'manage_proposals',
    'view_analytics',
    'manage_team',
    'manage_billing'
  ];

  useEffect(() => {
    fetchTeamMembers();
  }, []);

  useEffect(() => {
    filterAndSortMembers();
  }, [teamMembers, searchTerm, filter, sortBy]);

  const fetchTeamMembers = async () => {
    try {
      setLoading(true);
      // Mock data for demonstration
      const mockMembers = [
        {
          id: '1',
          firstName: 'Sarah',
          lastName: 'Johnson',
          email: 'sarah.johnson@cartafella.com',
          phone: '+1 (555) 123-4567',
          role: 'manager',
          department: 'Talent Acquisition',
          salary: 85000,
          startDate: '2023-01-15',
          skills: ['Leadership', 'Strategic Planning', 'Team Management'],
          permissions: ['view_candidates', 'manage_candidates', 'view_clients', 'manage_team'],
          status: 'active',
          performance: {
            placementsThisMonth: 12,
            revenueGenerated: 48000,
            clientSatisfaction: 4.8,
            teamRating: 4.9
          },
          avatar: 'https://ui-avatars.com/api/?name=Sarah+Johnson&background=random'
        },
        {
          id: '2',
          firstName: 'Michael',
          lastName: 'Chen',
          email: 'michael.chen@cartafella.com',
          phone: '+1 (555) 987-6543',
          role: 'recruiter',
          department: 'Technical Recruitment',
          salary: 65000,
          startDate: '2023-03-10',
          skills: ['Technical Screening', 'Sourcing', 'Interview Coordination'],
          permissions: ['view_candidates', 'manage_candidates', 'view_clients'],
          status: 'active',
          performance: {
            placementsThisMonth: 8,
            revenueGenerated: 32000,
            clientSatisfaction: 4.6,
            teamRating: 4.7
          },
          avatar: 'https://ui-avatars.com/api/?name=Michael+Chen&background=random'
        },
        {
          id: '3',
          firstName: 'Emily',
          lastName: 'Davis',
          email: 'emily.davis@cartafella.com',
          phone: '+1 (555) 456-7890',
          role: 'account-manager',
          department: 'Client Relations',
          salary: 70000,
          startDate: '2023-05-20',
          skills: ['Client Management', 'Sales', 'Relationship Building'],
          permissions: ['view_clients', 'manage_clients', 'view_proposals', 'manage_proposals'],
          status: 'active',
          performance: {
            placementsThisMonth: 6,
            revenueGenerated: 24000,
            clientSatisfaction: 4.9,
            teamRating: 4.8
          },
          avatar: 'https://ui-avatars.com/api/?name=Emily+Davis&background=random'
        }
      ];
      
      setTeamMembers(mockMembers);
    } catch (error) {
      console.error('Error fetching team members:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterAndSortMembers = () => {
    let filtered = teamMembers.filter(member => {
      const fullName = `${member.firstName} ${member.lastName}`.toLowerCase();
      const matchesSearch = fullName.includes(searchTerm.toLowerCase()) ||
                           member.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           member.department.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesFilter = filter === 'all' || 
                           (filter === 'active' && member.status === 'active') ||
                           (filter === member.role);
      
      return matchesSearch && matchesFilter;
    });

    // Sort members
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return `${a.firstName} ${a.lastName}`.localeCompare(`${b.firstName} ${b.lastName}`);
        case 'role':
          return a.role.localeCompare(b.role);
        case 'department':
          return a.department.localeCompare(b.department);
        case 'startDate':
          return new Date(a.startDate) - new Date(b.startDate);
        case 'performance':
          return b.performance.placementsThisMonth - a.performance.placementsThisMonth;
        default:
          return 0;
      }
    });

    setFilteredMembers(filtered);
  };

  const handleCreateMember = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Mock API call
      const newMember = {
        id: Date.now().toString(),
        ...formData,
        skills: formData.skills.split(',').map(skill => skill.trim()),
        status: 'active',
        performance: {
          placementsThisMonth: 0,
          revenueGenerated: 0,
          clientSatisfaction: 0,
          teamRating: 0
        },
        avatar: `https://ui-avatars.com/api/?name=${formData.firstName}+${formData.lastName}&background=random`
      };

      setTeamMembers(prev => [...prev, newMember]);
      setShowCreateForm(false);
      resetForm();
    } catch (error) {
      console.error('Error creating team member:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateMember = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Mock API call
      setTeamMembers(prev => prev.map(member => 
        member.id === selectedMember.id 
          ? { 
              ...member, 
              ...formData,
              skills: formData.skills.split(',').map(skill => skill.trim())
            }
          : member
      ));
      setShowEditForm(false);
      setSelectedMember(null);
      resetForm();
    } catch (error) {
      console.error('Error updating team member:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteMember = async (memberId) => {
    if (!confirm('Are you sure you want to remove this team member?')) return;

    try {
      setLoading(true);
      setTeamMembers(prev => prev.filter(member => member.id !== memberId));
    } catch (error) {
      console.error('Error deleting team member:', error);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      role: 'recruiter',
      department: '',
      salary: '',
      startDate: '',
      skills: '',
      permissions: []
    });
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === 'checkbox' && name === 'permissions') {
      setFormData(prev => ({
        ...prev,
        permissions: checked 
          ? [...prev.permissions, value]
          : prev.permissions.filter(p => p !== value)
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const getRoleColor = (role) => {
    const roleObj = roles.find(r => r.value === role);
    return roleObj ? roleObj.color : 'bg-gray-100 text-gray-800';
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
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <UserGroupIcon className="w-8 h-8 text-primary" />
              <h1 className="text-2xl font-bold text-foreground">Team Management</h1>
              <span className="text-sm text-muted-foreground">
                ({filteredMembers.length} members)
              </span>
            </div>
            
            <button
              onClick={() => setShowCreateForm(true)}
              className="btn btn-primary"
            >
              <PlusIcon className="w-4 h-4 mr-2" />
              Add Team Member
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters and Search */}
        <div className="mb-8 flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <MagnifyingGlassIcon className="absolute left-3 top-3 w-5 h-5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search team members..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input pl-10"
            />
          </div>
          
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="input w-auto"
          >
            <option value="all">All Members</option>
            <option value="active">Active</option>
            <option value="admin">Administrators</option>
            <option value="manager">Managers</option>
            <option value="recruiter">Recruiters</option>
            <option value="account-manager">Account Managers</option>
          </select>
          
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="input w-auto"
          >
            <option value="name">Sort by Name</option>
            <option value="role">Sort by Role</option>
            <option value="department">Sort by Department</option>
            <option value="startDate">Sort by Start Date</option>
            <option value="performance">Sort by Performance</option>
          </select>
        </div>

        {loading && (
          <div className="flex justify-center py-12">
            <LoadingSpinner size="lg" />
          </div>
        )}

        {!loading && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Team Members List */}
            <div className="lg:col-span-2">
              <div className="grid gap-6">
                {filteredMembers.map((member) => (
                  <motion.div
                    key={member.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="card p-6 hover:shadow-lg transition-shadow cursor-pointer"
                    onClick={() => setSelectedMember(member)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-4">
                        <img
                          src={member.avatar}
                          alt={`${member.firstName} ${member.lastName}`}
                          className="w-12 h-12 rounded-full"
                        />
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <h3 className="text-lg font-semibold text-foreground">
                              {member.firstName} {member.lastName}
                            </h3>
                            <span className={`px-2 py-1 text-xs rounded-full ${getRoleColor(member.role)}`}>
                              {roles.find(r => r.value === member.role)?.label}
                            </span>
                          </div>
                          
                          <div className="grid grid-cols-2 gap-4 text-sm text-muted-foreground">
                            <div>
                              <p>Department: {member.department}</p>
                              <p>Email: {member.email}</p>
                              <p>Start Date: {new Date(member.startDate).toLocaleDateString()}</p>
                            </div>
                            <div>
                              <p>Placements: {member.performance.placementsThisMonth}</p>
                              <p>Revenue: {formatCurrency(member.performance.revenueGenerated)}</p>
                              <p>Rating: {member.performance.clientSatisfaction}⭐</p>
                            </div>
                          </div>
                          
                          <div className="mt-3">
                            <div className="flex flex-wrap gap-1">
                              {member.skills.slice(0, 3).map((skill, index) => (
                                <span key={index} className="px-2 py-1 bg-muted text-xs rounded">
                                  {skill}
                                </span>
                              ))}
                              {member.skills.length > 3 && (
                                <span className="px-2 py-1 bg-muted text-xs rounded">
                                  +{member.skills.length - 3} more
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedMember(member);
                            setFormData({
                              ...member,
                              skills: member.skills.join(', ')
                            });
                            setShowEditForm(true);
                          }}
                          className="p-2 text-muted-foreground hover:text-foreground"
                        >
                          <PencilIcon className="w-4 h-4" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteMember(member.id);
                          }}
                          className="p-2 text-muted-foreground hover:text-red-600"
                        >
                          <TrashIcon className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Member Details */}
            <div className="lg:col-span-1">
              {selectedMember ? (
                <div className="card p-6 sticky top-8">
                  <div className="text-center mb-6">
                    <img
                      src={selectedMember.avatar}
                      alt={`${selectedMember.firstName} ${selectedMember.lastName}`}
                      className="w-20 h-20 rounded-full mx-auto mb-4"
                    />
                    <h3 className="text-lg font-semibold">
                      {selectedMember.firstName} {selectedMember.lastName}
                    </h3>
                    <p className="text-sm text-muted-foreground">{selectedMember.department}</p>
                    <span className={`inline-block px-2 py-1 text-xs rounded-full mt-2 ${getRoleColor(selectedMember.role)}`}>
                      {roles.find(r => r.value === selectedMember.role)?.label}
                    </span>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium mb-2">Contact Information</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center space-x-2">
                          <EnvelopeIcon className="w-4 h-4 text-muted-foreground" />
                          <span>{selectedMember.email}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <PhoneIcon className="w-4 h-4 text-muted-foreground" />
                          <span>{selectedMember.phone}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <CalendarIcon className="w-4 h-4 text-muted-foreground" />
                          <span>Started {new Date(selectedMember.startDate).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="font-medium mb-2">Performance This Month</h4>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="text-muted-foreground">Placements</p>
                          <p className="font-medium">{selectedMember.performance.placementsThisMonth}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Revenue</p>
                          <p className="font-medium">{formatCurrency(selectedMember.performance.revenueGenerated)}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Client Rating</p>
                          <p className="font-medium">{selectedMember.performance.clientSatisfaction}⭐</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Team Rating</p>
                          <p className="font-medium">{selectedMember.performance.teamRating}⭐</p>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="font-medium mb-2">Skills</h4>
                      <div className="flex flex-wrap gap-1">
                        {selectedMember.skills.map((skill, index) => (
                          <span key={index} className="px-2 py-1 bg-muted text-xs rounded">
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="font-medium mb-2">Permissions</h4>
                      <div className="space-y-1 text-xs">
                        {selectedMember.permissions.map((permission, index) => (
                          <div key={index} className="flex items-center space-x-2">
                            <ShieldCheckIcon className="w-3 h-3 text-green-500" />
                            <span>{permission.replace('_', ' ')}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="card p-6 text-center">
                  <UserGroupIcon className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">
                    Select a team member to view details
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Create Member Modal */}
      {showCreateForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-card p-6 rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-semibold mb-4">Add New Team Member</h3>
            
            <form onSubmit={handleCreateMember} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <input
                  type="text"
                  name="firstName"
                  placeholder="First Name"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  className="input"
                  required
                />
                <input
                  type="text"
                  name="lastName"
                  placeholder="Last Name"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  className="input"
                  required
                />
              </div>
              
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleInputChange}
                className="input"
                required
              />
              
              <input
                type="tel"
                name="phone"
                placeholder="Phone"
                value={formData.phone}
                onChange={handleInputChange}
                className="input"
              />
              
              <div className="grid grid-cols-2 gap-4">
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleInputChange}
                  className="input"
                  required
                >
                  {roles.map(role => (
                    <option key={role.value} value={role.value}>
                      {role.label}
                    </option>
                  ))}
                </select>
                
                <input
                  type="text"
                  name="department"
                  placeholder="Department"
                  value={formData.department}
                  onChange={handleInputChange}
                  className="input"
                  required
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <input
                  type="number"
                  name="salary"
                  placeholder="Annual Salary"
                  value={formData.salary}
                  onChange={handleInputChange}
                  className="input"
                />
                
                <input
                  type="date"
                  name="startDate"
                  placeholder="Start Date"
                  value={formData.startDate}
                  onChange={handleInputChange}
                  className="input"
                  required
                />
              </div>
              
              <textarea
                name="skills"
                placeholder="Skills (comma separated)"
                value={formData.skills}
                onChange={handleInputChange}
                className="input"
                rows="2"
              />
              
              <div>
                <label className="block text-sm font-medium mb-2">Permissions</label>
                <div className="grid grid-cols-2 gap-2">
                  {permissions.map(permission => (
                    <label key={permission} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        name="permissions"
                        value={permission}
                        checked={formData.permissions.includes(permission)}
                        onChange={handleInputChange}
                      />
                      <span className="text-sm">{permission.replace('_', ' ')}</span>
                    </label>
                  ))}
                </div>
              </div>
              
              <div className="flex space-x-4 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowCreateForm(false);
                    resetForm();
                  }}
                  className="btn btn-outline flex-1"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="btn btn-primary flex-1"
                >
                  {loading ? <LoadingSpinner size="sm" /> : 'Add Member'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Member Modal */}
      {showEditForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-card p-6 rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-semibold mb-4">Edit Team Member</h3>
            
            <form onSubmit={handleUpdateMember} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <input
                  type="text"
                  name="firstName"
                  placeholder="First Name"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  className="input"
                  required
                />
                <input
                  type="text"
                  name="lastName"
                  placeholder="Last Name"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  className="input"
                  required
                />
              </div>
              
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleInputChange}
                className="input"
                required
              />
              
              <input
                type="tel"
                name="phone"
                placeholder="Phone"
                value={formData.phone}
                onChange={handleInputChange}
                className="input"
              />
              
              <div className="grid grid-cols-2 gap-4">
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleInputChange}
                  className="input"
                  required
                >
                  {roles.map(role => (
                    <option key={role.value} value={role.value}>
                      {role.label}
                    </option>
                  ))}
                </select>
                
                <input
                  type="text"
                  name="department"
                  placeholder="Department"
                  value={formData.department}
                  onChange={handleInputChange}
                  className="input"
                  required
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <input
                  type="number"
                  name="salary"
                  placeholder="Annual Salary"
                  value={formData.salary}
                  onChange={handleInputChange}
                  className="input"
                />
                
                <input
                  type="date"
                  name="startDate"
                  placeholder="Start Date"
                  value={formData.startDate}
                  onChange={handleInputChange}
                  className="input"
                  required
                />
              </div>
              
              <textarea
                name="skills"
                placeholder="Skills (comma separated)"
                value={formData.skills}
                onChange={handleInputChange}
                className="input"
                rows="2"
              />
              
              <div>
                <label className="block text-sm font-medium mb-2">Permissions</label>
                <div className="grid grid-cols-2 gap-2">
                  {permissions.map(permission => (
                    <label key={permission} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        name="permissions"
                        value={permission}
                        checked={formData.permissions.includes(permission)}
                        onChange={handleInputChange}
                      />
                      <span className="text-sm">{permission.replace('_', ' ')}</span>
                    </label>
                  ))}
                </div>
              </div>
              
              <div className="flex space-x-4 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowEditForm(false);
                    setSelectedMember(null);
                    resetForm();
                  }}
                  className="btn btn-outline flex-1"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="btn btn-primary flex-1"
                >
                  {loading ? <LoadingSpinner size="sm" /> : 'Update Member'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default TeamManagement; 