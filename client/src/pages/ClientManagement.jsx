/**
 * This is a product of Scalovate Systems Solutions.
 * All rights reserved.
 */

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { apiService } from '../lib/api';
import {
  BuildingOfficeIcon,
  PlusIcon,
  MagnifyingGlassIcon,
  EyeIcon,
  PencilIcon,
  TrashIcon,
  PhoneIcon,
  EnvelopeIcon,
  CalendarIcon,
  BanknotesIcon,
  UserGroupIcon,
  StarIcon,
  ClockIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  FunnelIcon
} from '@heroicons/react/24/outline';
import LoadingSpinner from '../components/LoadingSpinner';

const ClientManagement = () => {
  const { userProfile } = useAuth();
  const [loading, setLoading] = useState(false);
  const [clients, setClients] = useState([]);
  const [filteredClients, setFilteredClients] = useState([]);
  const [selectedClient, setSelectedClient] = useState(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');
  const [sortBy, setSortBy] = useState('name');

  const [formData, setFormData] = useState({
    name: '',
    industry: '',
    size: '',
    contactPerson: '',
    email: '',
    phone: '',
    address: '',
    website: '',
    description: '',
    priority: 'medium'
  });

  useEffect(() => {
    fetchClients();
  }, []);

  useEffect(() => {
    filterAndSortClients();
  }, [clients, searchTerm, filter, sortBy]);

  const fetchClients = async () => {
    try {
      setLoading(true);
      // Mock data for demonstration
      const mockClients = [
        {
          id: '1',
          name: 'TechCorp Inc.',
          industry: 'Technology',
          size: 'Large (500+)',
          contactPerson: 'John Smith',
          email: 'john@techcorp.com',
          phone: '+1 (555) 123-4567',
          address: '123 Tech Street, San Francisco, CA',
          website: 'https://techcorp.com',
          description: 'Leading technology company focused on AI and machine learning solutions.',
          priority: 'high',
          status: 'active',
          totalProjects: 8,
          activeProjects: 3,
          totalRevenue: 450000,
          lastContact: '2024-01-15',
          rating: 4.8,
          createdAt: '2023-06-01'
        },
        {
          id: '2',
          name: 'StartupXYZ',
          industry: 'Fintech',
          size: 'Small (1-50)',
          contactPerson: 'Sarah Johnson',
          email: 'sarah@startupxyz.com',
          phone: '+1 (555) 987-6543',
          address: '456 Startup Ave, Austin, TX',
          website: 'https://startupxyz.com',
          description: 'Innovative fintech startup revolutionizing digital payments.',
          priority: 'medium',
          status: 'active',
          totalProjects: 3,
          activeProjects: 1,
          totalRevenue: 125000,
          lastContact: '2024-01-10',
          rating: 4.6,
          createdAt: '2023-09-15'
        },
        {
          id: '3',
          name: 'Enterprise Solutions Ltd.',
          industry: 'Consulting',
          size: 'Large (500+)',
          contactPerson: 'Michael Chen',
          email: 'michael@enterprise.com',
          phone: '+1 (555) 456-7890',
          address: '789 Business Blvd, New York, NY',
          website: 'https://enterprise.com',
          description: 'Global consulting firm specializing in digital transformation.',
          priority: 'high',
          status: 'active',
          totalProjects: 12,
          activeProjects: 5,
          totalRevenue: 680000,
          lastContact: '2024-01-12',
          rating: 4.9,
          createdAt: '2023-03-20'
        }
      ];
      
      setClients(mockClients);
    } catch (error) {
      console.error('Error fetching clients:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterAndSortClients = () => {
    let filtered = clients.filter(client => {
      const matchesSearch = client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           client.industry.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           client.contactPerson.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesFilter = filter === 'all' || 
                           (filter === 'active' && client.status === 'active') ||
                           (filter === 'high-priority' && client.priority === 'high') ||
                           (filter === 'large' && client.size.includes('Large'));
      
      return matchesSearch && matchesFilter;
    });

    // Sort clients
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'revenue':
          return b.totalRevenue - a.totalRevenue;
        case 'projects':
          return b.totalProjects - a.totalProjects;
        case 'rating':
          return b.rating - a.rating;
        case 'lastContact':
          return new Date(b.lastContact) - new Date(a.lastContact);
        default:
          return 0;
      }
    });

    setFilteredClients(filtered);
  };

  const handleCreateClient = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Mock API call
      const newClient = {
        id: Date.now().toString(),
        ...formData,
        status: 'active',
        totalProjects: 0,
        activeProjects: 0,
        totalRevenue: 0,
        rating: 0,
        createdAt: new Date().toISOString()
      };

      setClients(prev => [...prev, newClient]);
      setShowCreateForm(false);
      resetForm();
    } catch (error) {
      console.error('Error creating client:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateClient = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Mock API call
      setClients(prev => prev.map(client => 
        client.id === selectedClient.id 
          ? { ...client, ...formData }
          : client
      ));
      setShowEditForm(false);
      setSelectedClient(null);
      resetForm();
    } catch (error) {
      console.error('Error updating client:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClient = async (clientId) => {
    if (!confirm('Are you sure you want to delete this client?')) return;

    try {
      setLoading(true);
      setClients(prev => prev.filter(client => client.id !== clientId));
    } catch (error) {
      console.error('Error deleting client:', error);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      industry: '',
      size: '',
      contactPerson: '',
      email: '',
      phone: '',
      address: '',
      website: '',
      description: '',
      priority: 'medium'
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400';
      case 'low':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
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
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <BuildingOfficeIcon className="w-8 h-8 text-primary" />
              <h1 className="text-2xl font-bold text-foreground">Client Management</h1>
              <span className="text-sm text-muted-foreground">
                ({filteredClients.length} clients)
              </span>
            </div>
            
            <button
              onClick={() => setShowCreateForm(true)}
              className="btn btn-primary"
            >
              <PlusIcon className="w-4 h-4 mr-2" />
              Add Client
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
              placeholder="Search clients..."
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
            <option value="all">All Clients</option>
            <option value="active">Active</option>
            <option value="high-priority">High Priority</option>
            <option value="large">Large Clients</option>
          </select>
          
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="input w-auto"
          >
            <option value="name">Sort by Name</option>
            <option value="revenue">Sort by Revenue</option>
            <option value="projects">Sort by Projects</option>
            <option value="rating">Sort by Rating</option>
            <option value="lastContact">Sort by Last Contact</option>
          </select>
        </div>

        {loading && (
          <div className="flex justify-center py-12">
            <LoadingSpinner size="lg" />
          </div>
        )}

        {!loading && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Client List */}
            <div className="lg:col-span-2">
              <div className="space-y-4">
                {filteredClients.map((client) => (
                  <motion.div
                    key={client.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="card p-6 hover:shadow-lg transition-shadow cursor-pointer"
                    onClick={() => setSelectedClient(client)}
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="text-lg font-semibold text-foreground">
                            {client.name}
                          </h3>
                          <span className={`px-2 py-1 text-xs rounded-full ${getPriorityColor(client.priority)}`}>
                            {client.priority}
                          </span>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4 text-sm text-muted-foreground">
                          <div>
                            <p>Industry: {client.industry}</p>
                            <p>Size: {client.size}</p>
                            <p>Contact: {client.contactPerson}</p>
                          </div>
                          <div>
                            <p>Projects: {client.totalProjects} ({client.activeProjects} active)</p>
                            <p>Revenue: {formatCurrency(client.totalRevenue)}</p>
                            <p>Rating: {client.rating}⭐</p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedClient(client);
                            setFormData(client);
                            setShowEditForm(true);
                          }}
                          className="p-2 text-muted-foreground hover:text-foreground"
                        >
                          <PencilIcon className="w-4 h-4" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteClient(client.id);
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

            {/* Client Details */}
            <div className="lg:col-span-1">
              {selectedClient ? (
                <div className="card p-6 sticky top-8">
                  <h3 className="text-lg font-semibold mb-4">Client Details</h3>
                  
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium text-foreground">{selectedClient.name}</h4>
                      <p className="text-sm text-muted-foreground">{selectedClient.industry}</p>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <UserGroupIcon className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm">{selectedClient.contactPerson}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <EnvelopeIcon className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm">{selectedClient.email}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <PhoneIcon className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm">{selectedClient.phone}</span>
                      </div>
                    </div>
                    
                    <div>
                      <h5 className="font-medium mb-2">Description</h5>
                      <p className="text-sm text-muted-foreground">
                        {selectedClient.description}
                      </p>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                      <div>
                        <p className="text-xs text-muted-foreground">Total Projects</p>
                        <p className="font-medium">{selectedClient.totalProjects}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Active Projects</p>
                        <p className="font-medium">{selectedClient.activeProjects}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Total Revenue</p>
                        <p className="font-medium">{formatCurrency(selectedClient.totalRevenue)}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Rating</p>
                        <p className="font-medium">{selectedClient.rating}⭐</p>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="card p-6 text-center">
                  <BuildingOfficeIcon className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">
                    Select a client to view details
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Create Client Modal */}
      {showCreateForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-card p-6 rounded-lg w-full max-w-md max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-semibold mb-4">Add New Client</h3>
            
            <form onSubmit={handleCreateClient} className="space-y-4">
              <input
                type="text"
                name="name"
                placeholder="Company Name"
                value={formData.name}
                onChange={handleInputChange}
                className="input"
                required
              />
              
              <input
                type="text"
                name="industry"
                placeholder="Industry"
                value={formData.industry}
                onChange={handleInputChange}
                className="input"
                required
              />
              
              <select
                name="size"
                value={formData.size}
                onChange={handleInputChange}
                className="input"
                required
              >
                <option value="">Select Company Size</option>
                <option value="Small (1-50)">Small (1-50)</option>
                <option value="Medium (51-500)">Medium (51-500)</option>
                <option value="Large (500+)">Large (500+)</option>
              </select>
              
              <input
                type="text"
                name="contactPerson"
                placeholder="Contact Person"
                value={formData.contactPerson}
                onChange={handleInputChange}
                className="input"
                required
              />
              
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
              
              <textarea
                name="description"
                placeholder="Description"
                value={formData.description}
                onChange={handleInputChange}
                className="input"
                rows="3"
              />
              
              <select
                name="priority"
                value={formData.priority}
                onChange={handleInputChange}
                className="input"
              >
                <option value="low">Low Priority</option>
                <option value="medium">Medium Priority</option>
                <option value="high">High Priority</option>
              </select>
              
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
                  {loading ? <LoadingSpinner size="sm" /> : 'Add Client'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Client Modal */}
      {showEditForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-card p-6 rounded-lg w-full max-w-md max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-semibold mb-4">Edit Client</h3>
            
            <form onSubmit={handleUpdateClient} className="space-y-4">
              <input
                type="text"
                name="name"
                placeholder="Company Name"
                value={formData.name}
                onChange={handleInputChange}
                className="input"
                required
              />
              
              <input
                type="text"
                name="industry"
                placeholder="Industry"
                value={formData.industry}
                onChange={handleInputChange}
                className="input"
                required
              />
              
              <select
                name="size"
                value={formData.size}
                onChange={handleInputChange}
                className="input"
                required
              >
                <option value="">Select Company Size</option>
                <option value="Small (1-50)">Small (1-50)</option>
                <option value="Medium (51-500)">Medium (51-500)</option>
                <option value="Large (500+)">Large (500+)</option>
              </select>
              
              <input
                type="text"
                name="contactPerson"
                placeholder="Contact Person"
                value={formData.contactPerson}
                onChange={handleInputChange}
                className="input"
                required
              />
              
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
              
              <textarea
                name="description"
                placeholder="Description"
                value={formData.description}
                onChange={handleInputChange}
                className="input"
                rows="3"
              />
              
              <select
                name="priority"
                value={formData.priority}
                onChange={handleInputChange}
                className="input"
              >
                <option value="low">Low Priority</option>
                <option value="medium">Medium Priority</option>
                <option value="high">High Priority</option>
              </select>
              
              <div className="flex space-x-4 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowEditForm(false);
                    setSelectedClient(null);
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
                  {loading ? <LoadingSpinner size="sm" /> : 'Update Client'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ClientManagement; 