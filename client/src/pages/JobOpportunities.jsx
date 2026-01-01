/**
 * This is a product of Scalovate Systems Solutions.
 * All rights reserved.
 */

import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  PlusIcon,
  BriefcaseIcon,
  UsersIcon,
  EyeIcon,
  PencilIcon,
  TrashIcon,
  SparklesIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  MapPinIcon,
  CurrencyDollarIcon,
  CalendarIcon,
  BuildingOfficeIcon,
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon,
  ExclamationTriangleIcon,
  ChartBarIcon,
  DocumentTextIcon,
  ShareIcon,
  HeartIcon,
  ArrowUpIcon,
  ArrowDownIcon
} from '@heroicons/react/24/outline';
import { HeartIcon as HeartIconSolid } from '@heroicons/react/24/solid';
import LoadingSpinner from '../components/LoadingSpinner';

const JobOpportunities = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [jobs, setJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedView, setSelectedView] = useState('grid');
  const [sortBy, setSortBy] = useState('datePosted');
  const [sortOrder, setSortOrder] = useState('desc');
  const [filters, setFilters] = useState({
    status: '',
    location: '',
    salaryRange: '',
    type: '',
    remote: false,
    urgent: false
  });

  useEffect(() => {
    fetchJobs();
  }, []);

  useEffect(() => {
    filterAndSortJobs();
  }, [jobs, searchTerm, filters, sortBy, sortOrder]);

  const fetchJobs = async () => {
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockJobs = [
        {
          id: 1,
          title: 'Senior React Developer',
          company: 'TechCorp Solutions',
          location: 'San Francisco, CA',
          type: 'Full-time',
          remote: true,
          salary: {
            min: 120000,
            max: 150000,
            currency: 'USD'
          },
          status: 'active',
          urgent: false,
          description: 'We are looking for an experienced React developer to join our frontend team and build scalable web applications.',
          requirements: [
            '5+ years of React experience',
            'Strong JavaScript/TypeScript skills',
            'Experience with modern frontend tools',
            'Knowledge of state management (Redux/Context)',
            'Familiarity with testing frameworks'
          ],
          benefits: [
            'Competitive salary',
            'Health insurance',
            'Remote work options',
            'Professional development budget',
            '401k matching'
          ],
          postedDate: '2024-01-10',
          deadline: '2024-02-10',
          applications: 25,
          views: 145,
          favorited: true,
          clientId: 1,
          clientName: 'TechCorp Solutions',
          recruiterId: 1,
          recruiterName: 'John Recruiter',
          tags: ['React', 'JavaScript', 'Frontend', 'Senior'],
          department: 'Engineering',
          experienceLevel: 'Senior',
          educationLevel: 'Bachelor\'s',
          skills: ['React', 'JavaScript', 'TypeScript', 'Redux', 'Testing']
        },
        {
          id: 2,
          title: 'DevOps Engineer',
          company: 'CloudTech Inc',
          location: 'Remote',
          type: 'Full-time',
          remote: true,
          salary: {
            min: 100000,
            max: 130000,
            currency: 'USD'
          },
          status: 'active',
          urgent: true,
          description: 'Join our infrastructure team to build and maintain scalable cloud solutions using modern DevOps practices.',
          requirements: [
            '3+ years of DevOps experience',
            'AWS/Azure cloud platforms',
            'Docker and Kubernetes',
            'Infrastructure as Code (Terraform)',
            'CI/CD pipeline experience'
          ],
          benefits: [
            'Competitive salary',
            'Fully remote',
            'Learning budget',
            'Conference attendance',
            'Flexible schedule'
          ],
          postedDate: '2024-01-08',
          deadline: '2024-01-25',
          applications: 18,
          views: 98,
          favorited: false,
          clientId: 2,
          clientName: 'CloudTech Inc',
          recruiterId: 1,
          recruiterName: 'John Recruiter',
          tags: ['DevOps', 'AWS', 'Docker', 'Kubernetes'],
          department: 'Infrastructure',
          experienceLevel: 'Mid-level',
          educationLevel: 'Bachelor\'s',
          skills: ['AWS', 'Docker', 'Kubernetes', 'Terraform', 'CI/CD']
        },
        {
          id: 3,
          title: 'Frontend Developer',
          company: 'StartupXYZ',
          location: 'Austin, TX',
          type: 'Full-time',
          remote: false,
          salary: {
            min: 80000,
            max: 100000,
            currency: 'USD'
          },
          status: 'paused',
          urgent: false,
          description: 'Looking for a creative frontend developer to help build our next-generation web platform.',
          requirements: [
            '2+ years of frontend experience',
            'Proficiency in Vue.js or React',
            'HTML5, CSS3, JavaScript',
            'Responsive design experience',
            'Version control with Git'
          ],
          benefits: [
            'Startup equity',
            'Health insurance',
            'Flexible PTO',
            'Modern office',
            'Team outings'
          ],
          postedDate: '2024-01-05',
          deadline: '2024-02-05',
          applications: 12,
          views: 67,
          favorited: true,
          clientId: 3,
          clientName: 'StartupXYZ',
          recruiterId: 1,
          recruiterName: 'John Recruiter',
          tags: ['Frontend', 'Vue.js', 'JavaScript', 'CSS'],
          department: 'Product',
          experienceLevel: 'Mid-level',
          educationLevel: 'Bachelor\'s',
          skills: ['Vue.js', 'JavaScript', 'HTML', 'CSS', 'Git']
        },
        {
          id: 4,
          title: 'Full Stack Engineer',
          company: 'Innovation Labs',
          location: 'New York, NY',
          type: 'Contract',
          remote: true,
          salary: {
            min: 90,
            max: 120,
            currency: 'USD'
          },
          status: 'closed',
          urgent: false,
          description: 'Contract position for an experienced full-stack engineer to work on cutting-edge AI applications.',
          requirements: [
            '4+ years full-stack experience',
            'Python/Django backend',
            'React frontend',
            'Database design (PostgreSQL)',
            'API development experience'
          ],
          benefits: [
            'High hourly rate',
            'Flexible schedule',
            'Remote work',
            'Cutting-edge projects',
            'Extension opportunities'
          ],
          postedDate: '2024-01-03',
          deadline: '2024-01-20',
          applications: 35,
          views: 234,
          favorited: false,
          clientId: 4,
          clientName: 'Innovation Labs',
          recruiterId: 1,
          recruiterName: 'John Recruiter',
          tags: ['Full Stack', 'Python', 'React', 'AI'],
          department: 'Engineering',
          experienceLevel: 'Senior',
          educationLevel: 'Bachelor\'s',
          skills: ['Python', 'Django', 'React', 'PostgreSQL', 'API']
        },
        {
          id: 5,
          title: 'UI/UX Designer',
          company: 'Design Studio Pro',
          location: 'Los Angeles, CA',
          type: 'Part-time',
          remote: true,
          salary: {
            min: 60000,
            max: 80000,
            currency: 'USD'
          },
          status: 'active',
          urgent: false,
          description: 'Part-time position for a talented UI/UX designer to work on diverse client projects.',
          requirements: [
            '3+ years of UI/UX experience',
            'Proficiency in Figma/Sketch',
            'User research experience',
            'Prototyping skills',
            'Strong portfolio'
          ],
          benefits: [
            'Flexible hours',
            'Remote work',
            'Creative freedom',
            'Diverse projects',
            'Portfolio building'
          ],
          postedDate: '2024-01-07',
          deadline: '2024-02-15',
          applications: 8,
          views: 45,
          favorited: true,
          clientId: 5,
          clientName: 'Design Studio Pro',
          recruiterId: 1,
          recruiterName: 'John Recruiter',
          tags: ['UI/UX', 'Design', 'Figma', 'Research'],
          department: 'Design',
          experienceLevel: 'Mid-level',
          educationLevel: 'Bachelor\'s',
          skills: ['Figma', 'UI Design', 'UX Research', 'Prototyping', 'User Testing']
        }
      ];
      
      setJobs(mockJobs);
    } catch (error) {
      console.error('Error fetching jobs:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterAndSortJobs = () => {
    let filtered = jobs.filter(job => {
      const matchesSearch = searchTerm === '' || 
        job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));

      const matchesStatus = filters.status === '' || job.status === filters.status;
      const matchesLocation = filters.location === '' || 
        job.location.toLowerCase().includes(filters.location.toLowerCase());
      const matchesType = filters.type === '' || job.type === filters.type;
      const matchesRemote = !filters.remote || job.remote;
      const matchesUrgent = !filters.urgent || job.urgent;

      return matchesSearch && matchesStatus && matchesLocation && 
             matchesType && matchesRemote && matchesUrgent;
    });

    // Sort jobs
    filtered.sort((a, b) => {
      let comparison = 0;
      
      switch (sortBy) {
        case 'title':
          comparison = a.title.localeCompare(b.title);
          break;
        case 'company':
          comparison = a.company.localeCompare(b.company);
          break;
        case 'datePosted':
          comparison = new Date(a.postedDate) - new Date(b.postedDate);
          break;
        case 'applications':
          comparison = a.applications - b.applications;
          break;
        case 'salary':
          comparison = a.salary.min - b.salary.min;
          break;
        case 'deadline':
          comparison = new Date(a.deadline) - new Date(b.deadline);
          break;
        default:
          comparison = 0;
      }
      
      return sortOrder === 'desc' ? -comparison : comparison;
    });

    setFilteredJobs(filtered);
  };

  const toggleFavorite = (jobId) => {
    setJobs(prevJobs =>
      prevJobs.map(job =>
        job.id === jobId
          ? { ...job, favorited: !job.favorited }
          : job
      )
    );
  };

  const toggleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('desc');
    }
  };

  const clearFilters = () => {
    setFilters({
      status: '',
      location: '',
      salaryRange: '',
      type: '',
      remote: false,
      urgent: false
    });
    setSearchTerm('');
  };

  const formatSalary = (salary, type) => {
    if (type === 'Contract') {
      return `$${salary.min}-$${salary.max}/hr`;
    }
    return `$${(salary.min / 1000).toFixed(0)}k-$${(salary.max / 1000).toFixed(0)}k`;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'paused':
        return 'bg-yellow-100 text-yellow-800';
      case 'closed':
        return 'bg-red-100 text-red-800';
      case 'draft':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'active':
        return <CheckCircleIcon className="w-4 h-4" />;
      case 'paused':
        return <ClockIcon className="w-4 h-4" />;
      case 'closed':
        return <XCircleIcon className="w-4 h-4" />;
      default:
        return <ExclamationTriangleIcon className="w-4 h-4" />;
    }
  };

  const getDaysUntilDeadline = (deadline) => {
    const today = new Date();
    const deadlineDate = new Date(deadline);
    const diffTime = deadlineDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
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
              <h1 className="text-3xl font-bold text-foreground">Job Opportunities</h1>
              <p className="text-muted-foreground">
                Manage and track {jobs.length} job postings
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <Link to="/jobs/analytics" className="btn btn-outline">
                <ChartBarIcon className="w-5 h-5" />
                Analytics
              </Link>
              <Link to="/jobs/create" className="btn btn-primary">
                <PlusIcon className="w-5 h-5" />
                Post New Job
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
                <p className="text-sm text-muted-foreground">Active Jobs</p>
                <p className="text-2xl font-bold text-green-600">
                  {jobs.filter(job => job.status === 'active').length}
                </p>
              </div>
              <CheckCircleIcon className="w-8 h-8 text-green-600" />
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
                <p className="text-sm text-muted-foreground">Total Applications</p>
                <p className="text-2xl font-bold text-blue-600">
                  {jobs.reduce((sum, job) => sum + job.applications, 0)}
                </p>
              </div>
              <UsersIcon className="w-8 h-8 text-blue-600" />
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
                <p className="text-sm text-muted-foreground">Urgent Jobs</p>
                <p className="text-2xl font-bold text-orange-600">
                  {jobs.filter(job => job.urgent).length}
                </p>
              </div>
              <ExclamationTriangleIcon className="w-8 h-8 text-orange-600" />
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
                <p className="text-sm text-muted-foreground">Avg. Applications</p>
                <p className="text-2xl font-bold text-purple-600">
                  {Math.round(jobs.reduce((sum, job) => sum + job.applications, 0) / jobs.length)}
                </p>
              </div>
              <ChartBarIcon className="w-8 h-8 text-purple-600" />
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
                  placeholder="Search jobs by title, company, location, or tags..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="input pl-10 w-full"
                />
              </div>
            </div>

            {/* Controls */}
            <div className="flex items-center space-x-3">
              <select
                value={`${sortBy}-${sortOrder}`}
                onChange={(e) => {
                  const [field, order] = e.target.value.split('-');
                  setSortBy(field);
                  setSortOrder(order);
                }}
                className="input"
              >
                <option value="datePosted-desc">Newest First</option>
                <option value="datePosted-asc">Oldest First</option>
                <option value="applications-desc">Most Applications</option>
                <option value="applications-asc">Least Applications</option>
                <option value="deadline-asc">Deadline Soon</option>
                <option value="salary-desc">Highest Salary</option>
                <option value="title-asc">Title A-Z</option>
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
                    <option value="active">Active</option>
                    <option value="paused">Paused</option>
                    <option value="closed">Closed</option>
                    <option value="draft">Draft</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Location</label>
                  <input
                    type="text"
                    placeholder="e.g., San Francisco, Remote"
                    value={filters.location}
                    onChange={(e) => setFilters(prev => ({ ...prev, location: e.target.value }))}
                    className="input w-full"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Job Type</label>
                  <select
                    value={filters.type}
                    onChange={(e) => setFilters(prev => ({ ...prev, type: e.target.value }))}
                    className="input w-full"
                  >
                    <option value="">All Types</option>
                    <option value="Full-time">Full-time</option>
                    <option value="Part-time">Part-time</option>
                    <option value="Contract">Contract</option>
                    <option value="Freelance">Freelance</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Salary Range</label>
                  <select
                    value={filters.salaryRange}
                    onChange={(e) => setFilters(prev => ({ ...prev, salaryRange: e.target.value }))}
                    className="input w-full"
                  >
                    <option value="">Any Salary</option>
                    <option value="0-50k">$0 - $50k</option>
                    <option value="50k-100k">$50k - $100k</option>
                    <option value="100k-150k">$100k - $150k</option>
                    <option value="150k+">$150k+</option>
                  </select>
                </div>
              </div>

              <div className="mt-4 flex items-center space-x-6">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={filters.remote}
                    onChange={(e) => setFilters(prev => ({ ...prev, remote: e.target.checked }))}
                    className="mr-2"
                  />
                  <span className="text-sm font-medium">Remote available</span>
                </label>

                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={filters.urgent}
                    onChange={(e) => setFilters(prev => ({ ...prev, urgent: e.target.checked }))}
                    className="mr-2"
                  />
                  <span className="text-sm font-medium">Urgent only</span>
                </label>
              </div>

              <div className="flex justify-end mt-4">
                <button onClick={clearFilters} className="btn btn-outline">
                  Clear All Filters
                </button>
              </div>
            </motion.div>
          )}
        </motion.div>

        {/* Results Summary */}
        <div className="mb-6">
          <p className="text-muted-foreground">
            Showing {filteredJobs.length} of {jobs.length} jobs
            {searchTerm && ` for "${searchTerm}"`}
          </p>
        </div>

        {/* Jobs Grid/List */}
        {selectedView === 'grid' ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredJobs.map((job) => {
              const daysUntilDeadline = getDaysUntilDeadline(job.deadline);
              
              return (
                <motion.div
                  key={job.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  whileHover={{ y: -5 }}
                  className="card p-6 relative"
                >
                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(job.status)}`}>
                          {getStatusIcon(job.status)}
                          <span className="ml-1">{job.status}</span>
                        </span>
                        {job.urgent && (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                            <ExclamationTriangleIcon className="w-3 h-3 mr-1" />
                            Urgent
                          </span>
                        )}
                        {job.remote && (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            Remote
                          </span>
                        )}
                      </div>
                      
                      <h3 className="font-semibold text-foreground text-lg mb-1">{job.title}</h3>
                      <p className="text-primary font-medium">{job.company}</p>
                    </div>
                    
                    <button
                      onClick={() => toggleFavorite(job.id)}
                      className="text-muted-foreground hover:text-red-500 transition-colors"
                    >
                      {job.favorited ? (
                        <HeartIconSolid className="w-5 h-5 text-red-500" />
                      ) : (
                        <HeartIcon className="w-5 h-5" />
                      )}
                    </button>
                  </div>

                  {/* Details */}
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center text-sm text-muted-foreground">
                      <MapPinIcon className="w-4 h-4 mr-2" />
                      {job.location}
                    </div>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <CurrencyDollarIcon className="w-4 h-4 mr-2" />
                      {formatSalary(job.salary, job.type)}
                    </div>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <ClockIcon className="w-4 h-4 mr-2" />
                      {job.type}
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="text-center p-3 bg-muted/30 rounded-lg">
                      <div className="text-lg font-bold text-foreground">{job.applications}</div>
                      <div className="text-xs text-muted-foreground">Applications</div>
                    </div>
                    <div className="text-center p-3 bg-muted/30 rounded-lg">
                      <div className="text-lg font-bold text-foreground">{job.views}</div>
                      <div className="text-xs text-muted-foreground">Views</div>
                    </div>
                  </div>

                  {/* Deadline */}
                  <div className="mb-4">
                    <div className={`text-sm ${daysUntilDeadline <= 7 ? 'text-red-600' : 'text-muted-foreground'}`}>
                      <CalendarIcon className="w-4 h-4 inline mr-1" />
                      {daysUntilDeadline > 0 
                        ? `${daysUntilDeadline} days left` 
                        : daysUntilDeadline === 0 
                          ? 'Ends today'
                          : 'Expired'
                      }
                    </div>
                  </div>

                  {/* Tags */}
                  <div className="mb-4">
                    <div className="flex flex-wrap gap-1">
                      {job.tags.slice(0, 3).map((tag, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-primary/10 text-primary text-xs rounded"
                        >
                          {tag}
                        </span>
                      ))}
                      {job.tags.length > 3 && (
                        <span className="px-2 py-1 bg-muted text-muted-foreground text-xs rounded">
                          +{job.tags.length - 3}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="grid grid-cols-2 gap-2">
                    <Link
                      to={`/jobs/${job.id}`}
                      className="btn btn-outline btn-sm"
                    >
                      <EyeIcon className="w-4 h-4" />
                      View
                    </Link>
                    <Link
                      to={`/jobs/${job.id}/match`}
                      className="btn btn-primary btn-sm"
                    >
                      <SparklesIcon className="w-4 h-4" />
                      AI Match
                    </Link>
                  </div>

                  {/* Footer */}
                  <div className="mt-4 pt-4 border-t border-border text-xs text-muted-foreground">
                    Posted {formatDate(job.postedDate)}
                  </div>
                </motion.div>
              );
            })}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredJobs.map((job) => {
              const daysUntilDeadline = getDaysUntilDeadline(job.deadline);
              
              return (
                <motion.div
                  key={job.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="card p-6"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-6 flex-1">
                      {/* Main Info */}
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <h3 className="font-semibold text-foreground text-lg">{job.title}</h3>
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(job.status)}`}>
                            {getStatusIcon(job.status)}
                            <span className="ml-1">{job.status}</span>
                          </span>
                          {job.urgent && (
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                              <ExclamationTriangleIcon className="w-3 h-3 mr-1" />
                              Urgent
                            </span>
                          )}
                        </div>
                        
                        <p className="text-primary font-medium mb-1">{job.company}</p>
                        
                        <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                          <div className="flex items-center">
                            <MapPinIcon className="w-4 h-4 mr-1" />
                            {job.location}
                          </div>
                          <div className="flex items-center">
                            <CurrencyDollarIcon className="w-4 h-4 mr-1" />
                            {formatSalary(job.salary, job.type)}
                          </div>
                          <div className="flex items-center">
                            <ClockIcon className="w-4 h-4 mr-1" />
                            {job.type}
                          </div>
                          {job.remote && (
                            <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                              Remote
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Stats */}
                      <div className="hidden md:flex items-center space-x-6 text-center">
                        <div>
                          <div className="text-lg font-bold text-foreground">{job.applications}</div>
                          <div className="text-xs text-muted-foreground">Applications</div>
                        </div>
                        <div>
                          <div className="text-lg font-bold text-foreground">{job.views}</div>
                          <div className="text-xs text-muted-foreground">Views</div>
                        </div>
                        <div>
                          <div className={`text-sm font-medium ${daysUntilDeadline <= 7 ? 'text-red-600' : 'text-muted-foreground'}`}>
                            {daysUntilDeadline > 0 
                              ? `${daysUntilDeadline} days` 
                              : daysUntilDeadline === 0 
                                ? 'Today'
                                : 'Expired'
                            }
                          </div>
                          <div className="text-xs text-muted-foreground">Until deadline</div>
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center space-x-3">
                      <button
                        onClick={() => toggleFavorite(job.id)}
                        className={`p-2 rounded ${job.favorited ? 'text-red-500' : 'text-muted-foreground hover:text-red-500'}`}
                      >
                        {job.favorited ? (
                          <HeartIconSolid className="w-4 h-4" />
                        ) : (
                          <HeartIcon className="w-4 h-4" />
                        )}
                      </button>
                      
                      <Link
                        to={`/jobs/${job.id}/edit`}
                        className="btn btn-outline btn-sm"
                      >
                        <PencilIcon className="w-4 h-4" />
                      </Link>
                      
                      <Link
                        to={`/jobs/${job.id}`}
                        className="btn btn-outline btn-sm"
                      >
                        <EyeIcon className="w-4 h-4" />
                      </Link>
                      
                      <Link
                        to={`/jobs/${job.id}/match`}
                        className="btn btn-primary btn-sm"
                      >
                        <SparklesIcon className="w-4 h-4" />
                        AI Match
                      </Link>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}

        {/* Empty State */}
        {filteredJobs.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
              <BriefcaseIcon className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">
              No jobs found
            </h3>
            <p className="text-muted-foreground mb-4">
              Try adjusting your search criteria or filters to find more jobs.
            </p>
            <div className="flex justify-center space-x-3">
              <button onClick={clearFilters} className="btn btn-outline">
                Clear Filters
              </button>
              <Link to="/jobs/create" className="btn btn-primary">
                Post New Job
              </Link>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default JobOpportunities; 