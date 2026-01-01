/**
 * This is a product of Scalovate Systems Solutions.
 * All rights reserved.
 */

import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { apiService } from '../lib/api';
import { 
  MagnifyingGlassIcon,
  FunnelIcon,
  SparklesIcon,
  HeartIcon,
  EyeIcon,
  MapPinIcon,
  BriefcaseIcon,
  AcademicCapIcon,
  StarIcon,
  UserPlusIcon,
  DocumentArrowUpIcon,
  ChatBubbleLeftRightIcon,
  AdjustmentsHorizontalIcon,
  XMarkIcon,
  CheckIcon,
  ClockIcon,
  CurrencyDollarIcon
} from '@heroicons/react/24/outline';
import { StarIcon as StarIconSolid, HeartIcon as HeartIconSolid } from '@heroicons/react/24/solid';
import LoadingSpinner from '../components/LoadingSpinner';
import TalentMatcher from '../components/TalentMatcher';

const TalentSearch = () => {
  const { userProfile } = useAuth();
  const [loading, setLoading] = useState(true);
  const [candidates, setCandidates] = useState([]);
  const [filteredCandidates, setFilteredCandidates] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [showMatcher, setShowMatcher] = useState(false);
  const [selectedView, setSelectedView] = useState('grid'); // grid or list
  const [sortBy, setSortBy] = useState('atsScore');
  const [filters, setFilters] = useState({
    location: '',
    experience: '',
    skills: [],
    availability: '',
    salaryRange: '',
    status: '',
    education: '',
    remote: false
  });

  useEffect(() => {
    fetchCandidates();
  }, []);

  useEffect(() => {
    filterAndSortCandidates();
  }, [candidates, searchTerm, filters, sortBy]);

  const fetchCandidates = async () => {
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockCandidates = [
        {
          id: 1,
          name: 'Sarah Johnson',
          title: 'Senior React Developer',
          email: 'sarah.johnson@email.com',
          location: 'San Francisco, CA',
          experience: '5+ years',
          skills: ['React', 'JavaScript', 'TypeScript', 'Node.js', 'AWS'],
          atsScore: 92,
          status: 'available',
          favorited: true,
          addedDate: '2024-01-10',
          lastContact: '2024-01-09',
          expectedSalary: '$120k-$150k',
          availability: 'Immediately',
          education: 'Bachelor\'s in Computer Science',
          remote: true,
          profileImage: null,
          summary: 'Experienced React developer with expertise in modern JavaScript frameworks.',
          certifications: ['AWS Certified', 'React Professional'],
          portfolioUrl: 'https://sarahjohnson.dev',
          linkedinUrl: 'https://linkedin.com/in/sarahjohnson'
        },
        {
          id: 2,
          name: 'Mike Chen',
          title: 'Full Stack Engineer',
          email: 'mike.chen@email.com',
          location: 'Remote',
          experience: '4 years',
          skills: ['Python', 'Django', 'React', 'PostgreSQL', 'Docker'],
          atsScore: 88,
          status: 'interviewing',
          favorited: false,
          addedDate: '2024-01-09',
          lastContact: '2024-01-07',
          expectedSalary: '$100k-$130k',
          availability: '2 weeks notice',
          education: 'Master\'s in Software Engineering',
          remote: true,
          profileImage: null,
          summary: 'Full-stack developer with strong backend experience in Python.',
          certifications: ['Python Institute Certified'],
          portfolioUrl: 'https://mikechen.dev',
          linkedinUrl: 'https://linkedin.com/in/mikechen'
        },
        {
          id: 3,
          name: 'Emily Davis',
          title: 'Frontend Developer',
          email: 'emily.davis@email.com',
          location: 'Austin, TX',
          experience: '3 years',
          skills: ['Vue.js', 'CSS', 'JavaScript', 'Figma', 'Sass'],
          atsScore: 85,
          status: 'placed',
          favorited: true,
          addedDate: '2024-01-08',
          lastContact: '2024-01-05',
          expectedSalary: '$80k-$100k',
          availability: 'Not actively looking',
          education: 'Bachelor\'s in Design',
          remote: false,
          profileImage: null,
          summary: 'Creative frontend developer with strong design background.',
          certifications: ['Adobe Certified Expert'],
          portfolioUrl: 'https://emilydavis.design',
          linkedinUrl: 'https://linkedin.com/in/emilydavis'
        },
        {
          id: 4,
          name: 'Alex Rodriguez',
          title: 'DevOps Engineer',
          email: 'alex.rodriguez@email.com',
          location: 'New York, NY',
          experience: '6+ years',
          skills: ['AWS', 'Kubernetes', 'Docker', 'Terraform', 'Python'],
          atsScore: 94,
          status: 'available',
          favorited: false,
          addedDate: '2024-01-07',
          lastContact: '2024-01-06',
          expectedSalary: '$130k-$160k',
          availability: 'Immediately',
          education: 'Bachelor\'s in Computer Science',
          remote: true,
          profileImage: null,
          summary: 'DevOps expert with extensive cloud infrastructure experience.',
          certifications: ['AWS Solutions Architect', 'Kubernetes Administrator'],
          portfolioUrl: 'https://alexrodriguez.tech',
          linkedinUrl: 'https://linkedin.com/in/alexrodriguez'
        },
        {
          id: 5,
          name: 'Lisa Wang',
          title: 'UI/UX Designer',
          email: 'lisa.wang@email.com',
          location: 'Seattle, WA',
          experience: '4 years',
          skills: ['Figma', 'Sketch', 'Adobe Creative Suite', 'Prototyping', 'User Research'],
          atsScore: 90,
          status: 'available',
          favorited: true,
          addedDate: '2024-01-06',
          lastContact: '2024-01-04',
          expectedSalary: '$90k-$120k',
          availability: '1 month notice',
          education: 'Master\'s in Human-Computer Interaction',
          remote: false,
          profileImage: null,
          summary: 'User-centered designer with strong research and prototyping skills.',
          certifications: ['Google UX Design Certificate'],
          portfolioUrl: 'https://lisawang.design',
          linkedinUrl: 'https://linkedin.com/in/lisawang'
        },
        {
          id: 6,
          name: 'James Wilson',
          title: 'Backend Developer',
          email: 'james.wilson@email.com',
          location: 'Chicago, IL',
          experience: '7+ years',
          skills: ['Java', 'Spring Boot', 'Microservices', 'MySQL', 'Redis'],
          atsScore: 87,
          status: 'interviewing',
          favorited: false,
          addedDate: '2024-01-05',
          lastContact: '2024-01-03',
          expectedSalary: '$110k-$140k',
          availability: '3 weeks notice',
          education: 'Bachelor\'s in Computer Science',
          remote: true,
          profileImage: null,
          summary: 'Senior backend developer specializing in Java and microservices architecture.',
          certifications: ['Oracle Java Certified', 'Spring Professional'],
          portfolioUrl: 'https://jameswilson.dev',
          linkedinUrl: 'https://linkedin.com/in/jameswilson'
        }
      ];
      
      setCandidates(mockCandidates);
    } catch (error) {
      console.error('Error fetching candidates:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterAndSortCandidates = () => {
    let filtered = candidates.filter(candidate => {
      const matchesSearch = searchTerm === '' || 
        candidate.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        candidate.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        candidate.skills.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase())) ||
        candidate.location.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesLocation = filters.location === '' || 
        candidate.location.toLowerCase().includes(filters.location.toLowerCase());

      const matchesExperience = filters.experience === '' || 
        candidate.experience.includes(filters.experience);

      const matchesSkills = filters.skills.length === 0 ||
        filters.skills.some(skill => 
          candidate.skills.some(candidateSkill => 
            candidateSkill.toLowerCase().includes(skill.toLowerCase())
          )
        );

      const matchesStatus = filters.status === '' || candidate.status === filters.status;

      const matchesAvailability = filters.availability === '' || 
        candidate.availability.toLowerCase().includes(filters.availability.toLowerCase());

      const matchesRemote = !filters.remote || candidate.remote;

      return matchesSearch && matchesLocation && matchesExperience && 
             matchesSkills && matchesStatus && matchesAvailability && matchesRemote;
    });

    // Sort candidates
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'atsScore':
          return b.atsScore - a.atsScore;
        case 'name':
          return a.name.localeCompare(b.name);
        case 'experience':
          return b.experience.localeCompare(a.experience);
        case 'addedDate':
          return new Date(b.addedDate) - new Date(a.addedDate);
        default:
          return 0;
      }
    });

    setFilteredCandidates(filtered);
  };

  const toggleFavorite = (candidateId) => {
    setCandidates(prevCandidates =>
      prevCandidates.map(candidate =>
        candidate.id === candidateId
          ? { ...candidate, favorited: !candidate.favorited }
          : candidate
      )
    );
  };

  const clearFilters = () => {
    setFilters({
      location: '',
      experience: '',
      skills: [],
      availability: '',
      salaryRange: '',
      status: '',
      education: '',
      remote: false
    });
    setSearchTerm('');
  };

  const addSkillFilter = (skill) => {
    if (skill && !filters.skills.includes(skill)) {
      setFilters(prev => ({
        ...prev,
        skills: [...prev.skills, skill]
      }));
    }
  };

  const removeSkillFilter = (skillToRemove) => {
    setFilters(prev => ({
      ...prev,
      skills: prev.skills.filter(skill => skill !== skillToRemove)
    }));
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'available':
        return 'bg-green-100 text-green-800';
      case 'interviewing':
        return 'bg-yellow-100 text-yellow-800';
      case 'placed':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
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
              <h1 className="text-3xl font-bold text-foreground">Talent Search</h1>
              <p className="text-muted-foreground">
                Browse and search through {candidates.length} candidates
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setShowMatcher(true)}
                className="btn btn-primary"
              >
                <SparklesIcon className="w-5 h-5" />
                AI Talent Matcher
              </button>
              <Link to="/candidates/add" className="btn btn-outline">
                <UserPlusIcon className="w-5 h-5" />
                Add Candidate
              </Link>
            </div>
          </div>
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
                  placeholder="Search candidates by name, title, skills, or location..."
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
                <option value="atsScore">Sort by ATS Score</option>
                <option value="name">Sort by Name</option>
                <option value="experience">Sort by Experience</option>
                <option value="addedDate">Sort by Date Added</option>
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
                  <label className="block text-sm font-medium mb-2">Experience</label>
                  <select
                    value={filters.experience}
                    onChange={(e) => setFilters(prev => ({ ...prev, experience: e.target.value }))}
                    className="input w-full"
                  >
                    <option value="">Any Experience</option>
                    <option value="1">1+ years</option>
                    <option value="2">2+ years</option>
                    <option value="3">3+ years</option>
                    <option value="4">4+ years</option>
                    <option value="5">5+ years</option>
                    <option value="7">7+ years</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Status</label>
                  <select
                    value={filters.status}
                    onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
                    className="input w-full"
                  >
                    <option value="">Any Status</option>
                    <option value="available">Available</option>
                    <option value="interviewing">Interviewing</option>
                    <option value="placed">Placed</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Availability</label>
                  <select
                    value={filters.availability}
                    onChange={(e) => setFilters(prev => ({ ...prev, availability: e.target.value }))}
                    className="input w-full"
                  >
                    <option value="">Any Availability</option>
                    <option value="Immediately">Immediately</option>
                    <option value="2 weeks">2 weeks notice</option>
                    <option value="1 month">1 month notice</option>
                    <option value="Not actively">Not actively looking</option>
                  </select>
                </div>
              </div>

              {/* Skills Filter */}
              <div className="mt-4">
                <label className="block text-sm font-medium mb-2">Skills</label>
                <div className="flex flex-wrap gap-2 mb-3">
                  {filters.skills.map((skill, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-primary/10 text-primary"
                    >
                      {skill}
                      <button
                        onClick={() => removeSkillFilter(skill)}
                        className="ml-2 text-primary hover:text-primary/70"
                      >
                        <XMarkIcon className="w-4 h-4" />
                      </button>
                    </span>
                  ))}
                </div>
                <div className="flex flex-wrap gap-2">
                  {['React', 'JavaScript', 'Python', 'Node.js', 'TypeScript', 'AWS', 'Docker', 'Vue.js', 'Angular', 'Java'].map((skill) => (
                    <button
                      key={skill}
                      onClick={() => addSkillFilter(skill)}
                      disabled={filters.skills.includes(skill)}
                      className={`px-3 py-1 rounded-full text-sm transition-colors ${
                        filters.skills.includes(skill)
                          ? 'bg-primary/20 text-primary cursor-not-allowed'
                          : 'bg-muted hover:bg-muted/80 text-muted-foreground hover:text-foreground'
                      }`}
                    >
                      {skill}
                    </button>
                  ))}
                </div>
              </div>

              {/* Remote Work Filter */}
              <div className="mt-4">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={filters.remote}
                    onChange={(e) => setFilters(prev => ({ ...prev, remote: e.target.checked }))}
                    className="mr-2"
                  />
                  <span className="text-sm font-medium">Remote work available</span>
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
            Showing {filteredCandidates.length} of {candidates.length} candidates
            {searchTerm && ` for "${searchTerm}"`}
          </p>
        </div>

        {/* Candidates Grid/List */}
        {selectedView === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCandidates.map((candidate) => (
              <motion.div
                key={candidate.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ y: -5 }}
                className="card p-6 relative"
              >
                {/* Favorite Button */}
                <button
                  onClick={() => toggleFavorite(candidate.id)}
                  className="absolute top-4 right-4 text-muted-foreground hover:text-red-500 transition-colors"
                >
                  {candidate.favorited ? (
                    <HeartIconSolid className="w-5 h-5 text-red-500" />
                  ) : (
                    <HeartIcon className="w-5 h-5" />
                  )}
                </button>

                {/* Profile Info */}
                <div className="flex items-center space-x-4 mb-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                    <span className="text-primary font-semibold text-lg">
                      {candidate.name.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-foreground">{candidate.name}</h3>
                    <p className="text-sm text-muted-foreground">{candidate.title}</p>
                  </div>
                </div>

                {/* ATS Score */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    <span className="text-2xl font-bold text-primary">{candidate.atsScore}%</span>
                    <span className="text-sm text-muted-foreground ml-1">ATS Score</span>
                  </div>
                  <div className="flex items-center">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <StarIconSolid
                        key={star}
                        className={`w-4 h-4 ${
                          star <= Math.floor(candidate.atsScore / 20)
                            ? 'text-yellow-400'
                            : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                </div>

                {/* Details */}
                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-sm text-muted-foreground">
                    <MapPinIcon className="w-4 h-4 mr-2" />
                    {candidate.location}
                  </div>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <BriefcaseIcon className="w-4 h-4 mr-2" />
                    {candidate.experience}
                  </div>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <CurrencyDollarIcon className="w-4 h-4 mr-2" />
                    {candidate.expectedSalary}
                  </div>
                </div>

                {/* Status */}
                <div className="mb-4">
                  <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(candidate.status)}`}>
                    {candidate.status}
                  </span>
                </div>

                {/* Skills */}
                <div className="mb-4">
                  <div className="flex flex-wrap gap-1">
                    {candidate.skills.slice(0, 3).map((skill, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-muted text-muted-foreground text-xs rounded"
                      >
                        {skill}
                      </span>
                    ))}
                    {candidate.skills.length > 3 && (
                      <span className="px-2 py-1 bg-muted text-muted-foreground text-xs rounded">
                        +{candidate.skills.length - 3} more
                      </span>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex space-x-2">
                  <Link
                    to={`/candidates/${candidate.id}`}
                    className="btn btn-outline btn-sm flex-1"
                  >
                    <EyeIcon className="w-4 h-4" />
                    View
                  </Link>
                  <button className="btn btn-primary btn-sm flex-1">
                    <ChatBubbleLeftRightIcon className="w-4 h-4" />
                    Chat
                  </button>
                </div>

                {/* Last Contact */}
                <div className="mt-3 text-xs text-muted-foreground text-center">
                  Last contact: {formatDate(candidate.lastContact)}
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredCandidates.map((candidate) => (
              <motion.div
                key={candidate.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="card p-6"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-6 flex-1">
                    {/* Profile */}
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                        <span className="text-primary font-semibold text-lg">
                          {candidate.name.split(' ').map(n => n[0]).join('')}
                        </span>
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground">{candidate.name}</h3>
                        <p className="text-sm text-muted-foreground">{candidate.title}</p>
                      </div>
                    </div>

                    {/* Details */}
                    <div className="hidden md:flex items-center space-x-6 text-sm text-muted-foreground">
                      <div className="flex items-center">
                        <MapPinIcon className="w-4 h-4 mr-1" />
                        {candidate.location}
                      </div>
                      <div className="flex items-center">
                        <BriefcaseIcon className="w-4 h-4 mr-1" />
                        {candidate.experience}
                      </div>
                      <div className="flex items-center">
                        <CurrencyDollarIcon className="w-4 h-4 mr-1" />
                        {candidate.expectedSalary}
                      </div>
                    </div>

                    {/* Skills */}
                    <div className="hidden lg:flex flex-wrap gap-1">
                      {candidate.skills.slice(0, 4).map((skill, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-muted text-muted-foreground text-xs rounded"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Right Side */}
                  <div className="flex items-center space-x-4">
                    {/* ATS Score */}
                    <div className="text-center">
                      <div className="text-xl font-bold text-primary">{candidate.atsScore}%</div>
                      <div className="text-xs text-muted-foreground">ATS Score</div>
                    </div>

                    {/* Status */}
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(candidate.status)}`}>
                      {candidate.status}
                    </span>

                    {/* Actions */}
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => toggleFavorite(candidate.id)}
                        className={`p-2 rounded ${candidate.favorited ? 'text-red-500' : 'text-muted-foreground hover:text-red-500'}`}
                      >
                        {candidate.favorited ? (
                          <HeartIconSolid className="w-4 h-4" />
                        ) : (
                          <HeartIcon className="w-4 h-4" />
                        )}
                      </button>
                      <Link
                        to={`/candidates/${candidate.id}`}
                        className="btn btn-outline btn-sm"
                      >
                        <EyeIcon className="w-4 h-4" />
                      </Link>
                      <button className="btn btn-primary btn-sm">
                        <ChatBubbleLeftRightIcon className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {filteredCandidates.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
              <MagnifyingGlassIcon className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">
              No candidates found
            </h3>
            <p className="text-muted-foreground mb-4">
              Try adjusting your search criteria or filters to find more candidates.
            </p>
            <button onClick={clearFilters} className="btn btn-primary">
              Clear Filters
            </button>
          </motion.div>
        )}
      </div>

      {/* AI Talent Matcher Modal */}
      {showMatcher && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-background rounded-lg shadow-xl w-full max-w-4xl m-4 max-h-[90vh] overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b">
              <h3 className="text-xl font-semibold">AI Talent Matcher</h3>
              <button
                onClick={() => setShowMatcher(false)}
                className="text-muted-foreground hover:text-foreground"
              >
                <XMarkIcon className="w-6 h-6" />
              </button>
            </div>
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-80px)]">
              <TalentMatcher onClose={() => setShowMatcher(false)} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TalentSearch; 