/**
 * This is a product of Scalovate Systems Solutions.
 * All rights reserved.
 */

import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { apiService } from '../lib/api';
import { 
  DocumentTextIcon,
  SparklesIcon,
  PlusIcon,
  EyeIcon,
  PencilIcon,
  TrashIcon,
  ArrowDownTrayIcon,
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon,
  ExclamationTriangleIcon,
  CalendarIcon,
  BanknotesIcon,
  UserGroupIcon,
  PaperAirplaneIcon,
  ChatBubbleLeftRightIcon,
  XMarkIcon,
  InformationCircleIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  BriefcaseIcon
} from '@heroicons/react/24/outline';
import LoadingSpinner from '../components/LoadingSpinner';
import AIChat from '../components/AIChat';

const Proposals = () => {
  const { userProfile } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [proposals, setProposals] = useState([]);
  const [filteredProposals, setFilteredProposals] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedView, setSelectedView] = useState('grid');
  const [sortBy, setSortBy] = useState('dateCreated');
  const [showAIGenerator, setShowAIGenerator] = useState(false);
  const [generatingProposal, setGeneratingProposal] = useState(false);
  const [filters, setFilters] = useState({
    status: '',
    client: '',
    candidateName: '',
    valueRange: '',
    dateRange: ''
  });
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [selectedProposal, setSelectedProposal] = useState(null);

  // Form state for creating proposals
  const [formData, setFormData] = useState({
    clientName: '',
    projectTitle: '',
    projectDescription: '',
    requiredSkills: '',
    teamSize: '',
    duration: '',
    budget: '',
    startDate: '',
    deliverables: '',
    urgency: 'medium'
  });

  useEffect(() => {
    fetchProposals();
  }, []);

  useEffect(() => {
    filterAndSortProposals();
  }, [proposals, searchTerm, filters, sortBy]);

  const fetchProposals = async () => {
    try {
      setLoading(true);
      const params = filters.status !== '' ? { status: filters.status } : {};
      
      try {
        const response = await apiService.proposals.getProposals(params);
        setProposals(response.data || response.proposals || []);
      } catch (apiError) {
        console.log('API not available, using mock data:', apiError.message);
        
        // Provide mock resource requests data when API is not available
        const mockProposals = [
          {
            id: '1',
            projectTitle: 'Full Stack Development Team for Digital Banking Platform',
            clientName: 'Premier Bank Corp',
            industry: 'Financial Services',
            status: 'pending',
            budget: 240000, // Monthly budget allocated
            duration: '24 months contract',
            requiredSkills: 'React, TypeScript, Node.js, AWS, Banking APIs, PCI Compliance',
            createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
            urgency: 'high',
            teamSize: '12 developers',
            requestType: 'Team Augmentation',
            deliverables: ['Core banking system development', 'Mobile app integration', 'Compliance testing'],
            clientInApp: true,
            description: 'Enterprise client seeks complete development team for digital transformation of core banking platform. Requires security clearance and fintech experience.',
            candidateCount: 12,
            requestedRoles: [
              { role: 'Tech Lead', count: 1, rate: '$85-95/hour', experience: '8+ years' },
              { role: 'Senior Full Stack Developer', count: 6, rate: '$75-85/hour', experience: '5+ years' },
              { role: 'DevOps Engineer', count: 2, rate: '$80-90/hour', experience: '5+ years' },
              { role: 'Solution Architect', count: 1, rate: '$100-120/hour', experience: '10+ years' },
              { role: 'QA Engineer', count: 2, rate: '$60-70/hour', experience: '4+ years' }
            ],
            assignedRecruiter: 'Sarah Mitchell',
            recruiterSpecialization: 'Financial Services & Banking',
            avgRate: '$75/hour',
            totalHours: '3,840 hours/month',
            attachments: ['job_descriptions.pdf', 'tech_requirements.pdf', 'compliance_docs.pdf'],
            readByClient: true,
            responseReceived: false,
            clientFeedback: null,
            proposalType: 'resource_request',
            requestStatus: 'assigned_to_recruiter'
          },
          {
            id: '2',
            projectTitle: 'AI/ML Engineering Team for Predictive Healthcare Analytics',
            clientName: 'MedTech Innovations',
            industry: 'Healthcare',
            status: 'under_review',
            budget: 180000, // Monthly budget allocated
            duration: '18 months contract',
            requiredSkills: 'Python, TensorFlow, Healthcare Data, HIPAA, ML Ops, Clinical Analytics',
            createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
            urgency: 'medium',
            teamSize: '8 specialists',
            requestType: 'Specialized Team',
            deliverables: ['Predictive analytics platform', 'Clinical decision support', 'HIPAA compliance'],
            clientInApp: true,
            description: 'Healthcare technology company requires AI/ML team with healthcare domain expertise for patient outcome prediction system.',
            candidateCount: 8,
            requestedRoles: [
              { role: 'ML Architect', count: 1, rate: '$120-140/hour', experience: '10+ years' },
              { role: 'Senior ML Engineer', count: 4, rate: '$95-115/hour', experience: '6+ years' },
              { role: 'Data Engineer', count: 2, rate: '$85-95/hour', experience: '5+ years' },
              { role: 'Healthcare Data Analyst', count: 1, rate: '$70-80/hour', experience: '4+ years' }
            ],
            assignedRecruiter: 'Dr. Michael Chen',
            recruiterSpecialization: 'Healthcare Technology',
            avgRate: '$98/hour',
            totalHours: '1,280 hours/month',
            attachments: ['healthcare_requirements.pdf', 'hipaa_compliance.pdf'],
            readByClient: true,
            responseReceived: true,
            clientFeedback: 'Excellent proposal. Need to review compliance documentation.',
            proposalType: 'resource_request',
            requestStatus: 'proposal_submitted'
          },
          {
            id: '3',
            projectTitle: 'Cloud Infrastructure Team for Retail Transformation',
            clientName: 'Global Retail Solutions',
            industry: 'Retail & E-commerce',
            status: 'approved',
            budget: 320000, // Monthly budget allocated
            duration: '30 months contract',
            requiredSkills: 'AWS, Azure, Kubernetes, Microservices, E-commerce Platforms, PCI DSS',
            createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
            urgency: 'high',
            teamSize: '15 engineers',
            requestType: 'Department Augmentation',
            deliverables: ['Cloud migration', 'Microservices architecture', 'Scalable e-commerce platform'],
            clientInApp: true,
            description: 'Large retail corporation seeks cloud infrastructure team for complete digital transformation and omnichannel platform development.',
            candidateCount: 15,
            requestedRoles: [
              { role: 'Cloud Architect', count: 2, rate: '$130-150/hour', experience: '12+ years' },
              { role: 'DevOps Lead', count: 2, rate: '$100-120/hour', experience: '8+ years' },
              { role: 'Senior DevOps Engineer', count: 6, rate: '$85-100/hour', experience: '5+ years' },
              { role: 'Site Reliability Engineer', count: 3, rate: '$90-110/hour', experience: '6+ years' },
              { role: 'Security Engineer', count: 2, rate: '$95-115/hour', experience: '7+ years' }
            ],
            assignedRecruiter: 'Jennifer Park',
            recruiterSpecialization: 'Retail Technology & E-commerce',
            avgRate: '$102/hour',
            totalHours: '2,400 hours/month',
            attachments: ['retail_tech_stack.pdf', 'migration_plan.pdf', 'security_requirements.pdf'],
            readByClient: true,
            responseReceived: true,
            clientFeedback: 'Approved! Moving to project phase. Excellent team composition.',
            proposalType: 'resource_request',
            requestStatus: 'moved_to_project'
          },
          {
            id: '4',
            projectTitle: 'Digital Operations Team for Oil & Gas Automation',
            clientName: 'PetroTech Energy',
            industry: 'Oil & Gas',
            status: 'draft',
            budget: 450000, // Monthly budget allocated
            duration: '36 months contract',
            requiredSkills: 'Industrial IoT, SCADA, Python, Edge Computing, Safety Systems, OT Security',
            createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
            urgency: 'medium',
            teamSize: '20 specialists',
            requestType: 'Complete Department',
            deliverables: ['Digital transformation', 'Automation systems', 'Predictive maintenance'],
            clientInApp: false,
            description: 'Energy corporation requires specialized team for digital operations transformation including IoT implementation and automation systems.',
            candidateCount: 20,
            requestedRoles: [
              { role: 'Industrial Automation Lead', count: 2, rate: '$140-160/hour', experience: '15+ years' },
              { role: 'IoT Architect', count: 2, rate: '$120-140/hour', experience: '10+ years' },
              { role: 'Industrial Software Engineer', count: 8, rate: '$90-110/hour', experience: '6+ years' },
              { role: 'OT Security Specialist', count: 3, rate: '$110-130/hour', experience: '8+ years' },
              { role: 'Data Engineer', count: 3, rate: '$85-100/hour', experience: '5+ years' },
              { role: 'Safety Systems Engineer', count: 2, rate: '$95-115/hour', experience: '7+ years' }
            ],
            assignedRecruiter: 'Robert Martinez',
            recruiterSpecialization: 'Oil & Gas Technology',
            avgRate: '$115/hour',
            totalHours: '3,200 hours/month',
            attachments: ['industrial_requirements.pdf', 'safety_standards.pdf', 'automation_scope.pdf'],
            readByClient: false,
            responseReceived: false,
            clientFeedback: null,
            proposalType: 'resource_request',
            requestStatus: 'request_posted'
          },
          {
            id: '5',
            projectTitle: 'Mobile Development Team for Healthcare Patient Portal',
            clientName: 'HealthCare United',
            industry: 'Healthcare',
            status: 'rejected',
            budget: 160000, // Monthly budget allocated
            duration: '24 months contract',
            requiredSkills: 'React Native, iOS, Android, HIPAA, HL7 FHIR, Healthcare APIs',
            createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
            urgency: 'low',
            teamSize: '10 developers',
            requestType: 'Mobile Team',
            deliverables: ['Patient mobile app', 'Provider portal', 'Integration with EHR systems'],
            clientInApp: true,
            description: 'Healthcare provider seeks mobile development team with healthcare compliance expertise for patient engagement platform.',
            candidateCount: 10,
            requestedRoles: [
              { role: 'Mobile Architect', count: 1, rate: '$105-125/hour', experience: '10+ years' },
              { role: 'Senior iOS Developer', count: 3, rate: '$85-100/hour', experience: '6+ years' },
              { role: 'Senior Android Developer', count: 3, rate: '$85-100/hour', experience: '6+ years' },
              { role: 'Backend Developer', count: 2, rate: '$80-95/hour', experience: '5+ years' },
              { role: 'QA Engineer', count: 1, rate: '$65-75/hour', experience: '4+ years' }
            ],
            assignedRecruiter: 'Dr. Lisa Wong',
            recruiterSpecialization: 'Healthcare Technology',
            avgRate: '$88/hour',
            totalHours: '1,600 hours/month',
            attachments: ['mobile_requirements.pdf', 'hipaa_compliance.pdf', 'ehr_integration.pdf'],
            readByClient: true,
            responseReceived: true,
            clientFeedback: 'Team composition doesn\'t meet our healthcare compliance requirements. Need more specialized experience.',
            proposalType: 'resource_request',
            requestStatus: 'proposal_rejected'
          },
          {
            id: '6',
            projectTitle: 'Data Analytics Team for Manufacturing Optimization',
            clientName: 'Advanced Manufacturing Corp',
            industry: 'Manufacturing',
            status: 'pending',
            budget: 220000, // Monthly budget allocated
            duration: '18 months contract',
            requiredSkills: 'Python, R, Manufacturing Analytics, IoT, Predictive Maintenance, Six Sigma',
            createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
            urgency: 'high',
            teamSize: '12 analysts',
            requestType: 'Analytics Team',
            deliverables: ['Production optimization', 'Predictive maintenance', 'Quality control systems'],
            clientInApp: true,
            description: 'Manufacturing company seeks data analytics team with industrial experience for operational excellence and predictive maintenance implementation.',
            candidateCount: 12,
            requestedRoles: [
              { role: 'Analytics Director', count: 1, rate: '$130-150/hour', experience: '12+ years' },
              { role: 'Senior Data Scientist', count: 4, rate: '$100-120/hour', experience: '7+ years' },
              { role: 'Manufacturing Analyst', count: 4, rate: '$80-95/hour', experience: '5+ years' },
              { role: 'IoT Data Engineer', count: 2, rate: '$90-105/hour', experience: '6+ years' },
              { role: 'Quality Engineer', count: 1, rate: '$75-90/hour', experience: '5+ years' }
            ],
            assignedRecruiter: 'David Kumar',
            recruiterSpecialization: 'Manufacturing & Industrial Technology',
            avgRate: '$98/hour',
            totalHours: '1,920 hours/month',
            attachments: ['manufacturing_scope.pdf', 'analytics_requirements.pdf'],
            readByClient: false,
            responseReceived: false,
            clientFeedback: null,
            proposalType: 'resource_request',
            requestStatus: 'proposal_in_progress'
          }
        ];
        
        setProposals(mockProposals);
      }
    } catch (error) {
      console.error('Error in fetchProposals:', error);
      // Even if there's an error, don't leave proposals empty
      setProposals([]);
    } finally {
      setLoading(false);
    }
  };

  const filterAndSortProposals = () => {
    let filtered = proposals.filter(proposal => {
      const matchesSearch = searchTerm === '' || 
        proposal.projectTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
        proposal.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        proposal.requiredSkills.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus = filters.status === '' || proposal.status === filters.status;
      const matchesClient = filters.client === '' || 
        proposal.clientName.toLowerCase().includes(filters.client.toLowerCase());
      const matchesCandidate = filters.candidateName === '' || 
        proposal.requiredSkills.toLowerCase().includes(filters.candidateName.toLowerCase());

      return matchesSearch && matchesStatus && matchesClient && matchesCandidate;
    });

    // Sort proposals
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'dateCreated':
          return new Date(b.createdAt) - new Date(a.createdAt);
        case 'value':
          return b.budget - a.budget;
        case 'clientName':
          return a.clientName.localeCompare(b.clientName);
        case 'candidateName':
          return a.requiredSkills.localeCompare(b.requiredSkills);
        case 'status':
          return a.status.localeCompare(b.status);
        default:
          return 0;
      }
    });

    setFilteredProposals(filtered);
  };

  const handleCreateProposal = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const proposalData = {
        ...formData,
        requiredSkills: formData.requiredSkills.split(',').map(skill => skill.trim()),
        deliverables: formData.deliverables.split('\n').filter(d => d.trim()),
        createdBy: userProfile.uid
      };

      const response = await apiService.proposals.generateProposal(proposalData);
      
      if (response.success) {
        await fetchProposals();
        setShowCreateForm(false);
        setFormData({
          clientName: '',
          projectTitle: '',
          projectDescription: '',
          requiredSkills: '',
          teamSize: '',
          duration: '',
          budget: '',
          startDate: '',
          deliverables: '',
          urgency: 'medium'
        });
      }
    } catch (error) {
      console.error('Error creating proposal:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (proposalId, status, notes = '') => {
    try {
      await apiService.proposals.updateProposalStatus(proposalId, status, notes);
      await fetchProposals();
      if (selectedProposal?.id === proposalId) {
        const response = await apiService.proposals.getProposal(proposalId);
        setSelectedProposal(response.data);
      }
    } catch (error) {
      console.error('Error updating proposal status:', error);
    }
  };

  const handleDeleteProposal = async (proposalId) => {
    if (!confirm('Are you sure you want to delete this proposal?')) return;

    try {
      await apiService.proposals.deleteProposal(proposalId);
      await fetchProposals();
      if (selectedProposal?.id === proposalId) {
        setSelectedProposal(null);
      }
    } catch (error) {
      console.error('Error deleting proposal:', error);
    }
  };

  const handleRegenerateProposal = async (proposalId) => {
    try {
      setLoading(true);
      await apiService.proposals.regenerateProposal(proposalId);
      await fetchProposals();
      if (selectedProposal?.id === proposalId) {
        const response = await apiService.proposals.getProposal(proposalId);
        setSelectedProposal(response.data);
      }
    } catch (error) {
      console.error('Error regenerating proposal:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'draft':
        return <ClockIcon className="w-4 h-4 text-yellow-500" />;
      case 'sent':
        return <ClockIcon className="w-4 h-4 text-blue-500" />;
      case 'approved':
        return <CheckCircleIcon className="w-4 h-4 text-green-500" />;
      case 'rejected':
        return <XCircleIcon className="w-4 h-4 text-red-500" />;
      case 'revision':
        return <ExclamationTriangleIcon className="w-4 h-4 text-orange-500" />;
      default:
        return <ClockIcon className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'draft':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400';
      case 'sent':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400';
      case 'approved':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      case 'rejected':
        return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';
      case 'revision':
        return 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Not sent';
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Resource Requests</h1>
              <p className="text-muted-foreground">
                Respond to {proposals.length} client resource requests with qualified candidates
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setShowAIGenerator(true)}
                className="btn btn-outline"
              >
                <SparklesIcon className="w-5 h-5" />
                AI Proposal Generator
              </button>
              <Link to="/resource-requests/browse" className="btn btn-primary">
                <PlusIcon className="w-5 h-5" />
                Browse New Requests
              </Link>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="card p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Candidates</p>
                <p className="text-2xl font-bold text-foreground">{proposals.length}</p>
              </div>
              <DocumentTextIcon className="w-8 h-8 text-blue-600" />
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
                <p className="text-sm text-muted-foreground">Awaiting Review</p>
                <p className="text-2xl font-bold text-yellow-600">
                  {proposals.filter(p => p.status === 'pending' || p.status === 'under_review').length}
                </p>
              </div>
              <ClockIcon className="w-8 h-8 text-yellow-600" />
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
                <p className="text-sm text-muted-foreground">Approved</p>
                <p className="text-2xl font-bold text-green-600">
                  {proposals.filter(p => p.status === 'approved').length}
                </p>
              </div>
              <CheckCircleIcon className="w-8 h-8 text-green-600" />
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
                <p className="text-sm text-muted-foreground">Total Monthly Value</p>
                <p className="text-2xl font-bold text-purple-600">
                  ${proposals.reduce((sum, p) => sum + p.budget, 0).toLocaleString()}
                </p>
              </div>
              <BanknotesIcon className="w-8 h-8 text-purple-600" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="card p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Professionals</p>
                <p className="text-2xl font-bold text-foreground">
                  {proposals.reduce((sum, p) => sum + (p.candidateCount || 1), 0)}
                </p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Search and Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card p-6 mb-8"
        >
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search resource requests by industry, client, skills, or recruiter..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="input pl-10 w-full"
                />
              </div>
            </div>

            {/* Controls */}
            <div className="flex items-center space-x-3">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="input"
              >
                <option value="dateCreated">Sort by Date Created</option>
                <option value="value">Sort by Value</option>
                <option value="clientName">Sort by Client</option>
                <option value="candidateName">Sort by Skills</option>
                <option value="status">Sort by Status</option>
              </select>

              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`btn ${showFilters ? 'btn-primary' : 'btn-outline'}`}
              >
                <FunnelIcon className="w-5 h-5" />
                Filters
              </button>

              <div className="flex border border-border rounded-lg">
                <button
                  onClick={() => setSelectedView('grid')}
                  className={`px-3 py-2 ${selectedView === 'grid' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground'}`}
                >
                  Grid
                </button>
                <button
                  onClick={() => setSelectedView('list')}
                  className={`px-3 py-2 ${selectedView === 'list' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground'}`}
                >
                  List
                </button>
              </div>
            </div>
          </div>

          {/* Advanced Filters */}
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-6 pt-6 border-t border-border"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Status</label>
                  <select
                    value={filters.status}
                    onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
                    className="input w-full"
                  >
                    <option value="">All Statuses</option>
                    <option value="draft">Draft</option>
                    <option value="pending">Pending</option>
                    <option value="approved">Approved</option>
                    <option value="rejected">Rejected</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Client</label>
                  <input
                    type="text"
                    placeholder="Client name"
                    value={filters.client}
                    onChange={(e) => setFilters(prev => ({ ...prev, client: e.target.value }))}
                    className="input w-full"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Skills</label>
                  <input
                    type="text"
                    placeholder="Skills"
                    value={filters.candidateName}
                    onChange={(e) => setFilters(prev => ({ ...prev, candidateName: e.target.value }))}
                    className="input w-full"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Value Range</label>
                  <select
                    value={filters.valueRange}
                    onChange={(e) => setFilters(prev => ({ ...prev, valueRange: e.target.value }))}
                    className="input w-full"
                  >
                    <option value="">Any Value</option>
                    <option value="0-25k">$0 - $25k</option>
                    <option value="25k-50k">$25k - $50k</option>
                    <option value="50k+">$50k+</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end mt-4">
                <button onClick={() => setFilters({
                  status: '',
                  client: '',
                  candidateName: '',
                  valueRange: '',
                  dateRange: ''
                })} className="btn btn-outline">
                  Clear All Filters
                </button>
              </div>
            </motion.div>
          )}
        </motion.div>

        {/* Results Summary */}
        <div className="mb-6">
          <p className="text-muted-foreground">
            Showing {filteredProposals.length} of {proposals.length} proposals
            {searchTerm && ` for "${searchTerm}"`}
          </p>
        </div>

        {/* Proposals Grid/List */}
        {selectedView === 'grid' ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredProposals.map((proposal) => (
              <motion.div
                key={proposal.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ y: -5 }}
                className="card p-6"
              >
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(proposal.status)}`}>
                        {getStatusIcon(proposal.status)}
                        <span className="ml-1">{proposal.status}</span>
                      </span>
                      {proposal.candidateCount > 10 && (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                          Large Team
                        </span>
                      )}
                      {proposal.candidateCount > 1 && proposal.candidateCount <= 10 && (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          Team Request
                        </span>
                      )}
                      {proposal.urgency === 'high' && (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                          Urgent
                        </span>
                      )}
                      {proposal.clientInApp && (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          Client Active
                        </span>
                      )}
                    </div>
                    
                    <h3 className="font-semibold text-foreground text-sm mb-1">{proposal.projectTitle}</h3>
                    <p className="text-primary font-medium text-sm">{proposal.clientName}</p>
                  </div>
                </div>

                {/* Details */}
                <div className="space-y-2 mb-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Industry:</span>
                    <span className="font-medium text-foreground">{proposal.industry}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Request Type:</span>
                    <span className="text-foreground text-xs">{proposal.requestType}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Team Size:</span>
                    <span className="font-medium text-blue-600">{proposal.candidateCount} professionals</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Budget:</span>
                    <span className="font-medium text-green-600">${(proposal.budget/1000).toFixed(0)}K/month</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Assigned Recruiter:</span>
                    <span className="text-foreground font-medium">{proposal.assignedRecruiter}</span>
                  </div>
                  <div className="flex items-center text-sm text-muted-foreground mt-2">
                    <CalendarIcon className="w-4 h-4 mr-2" />
                    Posted {formatDate(proposal.createdAt)}
                  </div>
                  {proposal.clientFeedback && (
                    <div className="mt-2 p-2 bg-blue-50 rounded-lg">
                      <p className="text-xs text-blue-800 font-medium">Client Feedback:</p>
                      <p className="text-xs text-blue-700">{proposal.clientFeedback}</p>
                    </div>
                  )}
                </div>

                {/* Status Indicators */}
                <div className="flex items-center space-x-2 mb-4 text-xs">
                  {proposal.readByClient && (
                    <span className="flex items-center text-green-600">
                      <CheckCircleIcon className="w-3 h-3 mr-1" />
                      Read
                    </span>
                  )}
                  {proposal.responseReceived && (
                    <span className="flex items-center text-blue-600">
                      <ChatBubbleLeftRightIcon className="w-3 h-3 mr-1" />
                      Response
                    </span>
                  )}
                  {proposal.attachments.length > 0 && (
                    <span className="flex items-center text-purple-600">
                      <DocumentTextIcon className="w-3 h-3 mr-1" />
                      {proposal.attachments.length} files
                    </span>
                  )}
                </div>

                {/* Actions */}
                <div className="grid grid-cols-2 gap-2">
                  <Link
                    to={`/resource-requests/${proposal.id}`}
                    className="btn btn-outline btn-sm"
                  >
                    <EyeIcon className="w-4 h-4" />
                    View Request
                  </Link>
                  
                  {proposal.requestStatus === 'request_posted' || proposal.requestStatus === 'assigned_to_recruiter' ? (
                    <button
                      onClick={() => handleUpdateStatus(proposal.id, 'proposal_in_progress')}
                      className="btn btn-primary btn-sm"
                    >
                      <PaperAirplaneIcon className="w-4 h-4" />
                      Submit Proposal
                    </button>
                  ) : proposal.requestStatus === 'moved_to_project' ? (
                    <Link
                      to={`/projects/${proposal.id}`}
                      className="btn btn-success btn-sm"
                    >
                      <BriefcaseIcon className="w-4 h-4" />
                      View Project
                    </Link>
                  ) : (
                    <button
                      onClick={() => handleRegenerateProposal(proposal.id)}
                      className="btn btn-primary btn-sm"
                    >
                      <SparklesIcon className="w-4 h-4" />
                      Update Proposal
                    </button>
                  )}
                </div>

                {/* Client Communication */}
                {proposal.clientInApp && proposal.requestStatus !== 'request_posted' && (
                  <div className="mt-3 pt-3 border-t border-border">
                    <button className="btn btn-outline btn-sm w-full">
                      <ChatBubbleLeftRightIcon className="w-4 h-4" />
                      Chat with Client
                    </button>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredProposals.map((proposal) => (
              <motion.div
                key={proposal.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="card p-6"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-6 flex-1">
                    {/* Main Info */}
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <h3 className="font-semibold text-foreground">{proposal.projectTitle}</h3>
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(proposal.status)}`}>
                          {getStatusIcon(proposal.status)}
                          <span className="ml-1">{proposal.status}</span>
                        </span>
                        {proposal.candidateCount > 10 && (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                            Large Team
                          </span>
                        )}
                        {proposal.candidateCount > 1 && proposal.candidateCount <= 10 && (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            Team Request
                          </span>
                        )}
                        {proposal.urgency === 'high' && (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                            Urgent
                          </span>
                        )}
                        {proposal.clientInApp && (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            Client Active
                          </span>
                        )}
                      </div>
                      
                      <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                        <div className="flex items-center">
                          <UserGroupIcon className="w-4 h-4 mr-1" />
                          <span className="font-medium text-foreground">{proposal.candidateCount} people</span>
                        </div>
                        <div className="flex items-center">
                          <ClockIcon className="w-4 h-4 mr-1" />
                          <span className="text-foreground">{proposal.duration}</span>
                        </div>
                        <div className="flex items-center">
                          <BanknotesIcon className="w-4 h-4 mr-1" />
                          <span className="font-medium text-green-600">{proposal.avgRate} avg</span>
                        </div>
                        <div className="flex items-center">
                          <span className="mr-1">ATS:</span>
                          <span className={`font-medium ${proposal.atsScore >= 90 ? 'text-green-600' : proposal.atsScore >= 80 ? 'text-yellow-600' : 'text-red-600'}`}>
                            {proposal.atsScore}%
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Status Indicators */}
                    <div className="hidden md:flex items-center space-x-4 text-xs">
                      {proposal.readByClient && (
                        <span className="flex items-center text-green-600">
                          <CheckCircleIcon className="w-4 h-4 mr-1" />
                          Read by client
                        </span>
                      )}
                      {proposal.responseReceived && (
                        <span className="flex items-center text-blue-600">
                          <ChatBubbleLeftRightIcon className="w-4 h-4 mr-1" />
                          Response received
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center space-x-3">
                    <Link
                      to={`/proposals/${proposal.id}/edit`}
                      className="btn btn-outline btn-sm"
                    >
                      <PencilIcon className="w-4 h-4" />
                    </Link>
                    
                    <Link
                      to={`/proposals/${proposal.id}`}
                      className="btn btn-outline btn-sm"
                    >
                      <EyeIcon className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Proposals;