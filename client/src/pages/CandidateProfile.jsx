/**
 * This is a product of Scalovate Systems Solutions.
 * All rights reserved.
 */

import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { apiService } from '../lib/api';
import { 
  DocumentArrowUpIcon,
  MagnifyingGlassIcon,
  UserIcon,
  StarIcon,
  MapPinIcon,
  CalendarIcon,
  BriefcaseIcon,
  PencilIcon,
  TrashIcon,
  EyeIcon,
  ArrowLeftIcon,
  FunnelIcon,
  CloudArrowUpIcon,
  UserCircleIcon,
  DocumentTextIcon,
  SparklesIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  ArrowDownTrayIcon,
  HeartIcon,
  ChatBubbleLeftRightIcon,
  LinkIcon,
  PhoneIcon,
  EnvelopeIcon,
  GlobeAltIcon,
  XMarkIcon,
  ShareIcon,
  ClockIcon
} from '@heroicons/react/24/outline';
import { StarIcon as StarIconSolid } from '@heroicons/react/24/solid';
import LoadingSpinner from '../components/LoadingSpinner';
import { useDropzone } from 'react-dropzone';
import AIChat from '../components/AIChat';

const CandidateProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { userProfile, updateProfile } = useAuth();
  
  const [loading, setLoading] = useState(true);
  const [candidate, setCandidate] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [showAIChat, setShowAIChat] = useState(false);
  const [uploadingCV, setUploadingCV] = useState(false);
  const [assessmentResults, setAssessmentResults] = useState(null);
  const [linkedInResults, setLinkedInResults] = useState([]);
  const [showLinkedInSearch, setShowLinkedInSearch] = useState(false);

  const [candidates, setCandidates] = useState([]);
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [showUpload, setShowUpload] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    experienceLevel: '',
    skills: '',
    location: ''
  });

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 12;

  const [activeTab, setActiveTab] = useState('profile');
  const [cvFile, setCvFile] = useState(null);
  const [cvText, setCvText] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [aiAnalysis, setAiAnalysis] = useState(null);
  const [optimizedCv, setOptimizedCv] = useState('');
  const [profileData, setProfileData] = useState({
    firstName: userProfile?.firstName || '',
    lastName: userProfile?.lastName || '',
    email: userProfile?.email || '',
    phone: userProfile?.phone || '',
    location: userProfile?.location || '',
    title: userProfile?.title || '',
    summary: userProfile?.summary || '',
    experience: userProfile?.experience || '',
    education: userProfile?.education || '',
    skills: userProfile?.skills || '',
    certifications: userProfile?.certifications || ''
  });
  
  const fileInputRef = useRef(null);

  useEffect(() => {
    fetchCandidateProfile();
  }, [id]);

  useEffect(() => {
    fetchCandidates();
  }, [currentPage, searchTerm, filters]);

  const fetchCandidates = async () => {
    try {
      setLoading(true);
      const params = {
        page: currentPage,
        limit: itemsPerPage,
        search: searchTerm,
        ...filters
      };
      
      const response = await apiService.cv.getCandidates(params);
      setCandidates(response.data?.candidates || []);
      setTotalPages(Math.ceil((response.data?.total || 0) / itemsPerPage));
    } catch (error) {
      console.error('Error fetching candidates:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCandidateProfile = async () => {
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockCandidate = {
        id: parseInt(id) || 1,
        name: 'Sarah Johnson',
        title: 'Senior React Developer',
        email: 'sarah.johnson@email.com',
        phone: '+1 (555) 123-4567',
        location: 'San Francisco, CA',
        website: 'https://sarahjohnson.dev',
        linkedin: 'https://linkedin.com/in/sarahjohnson',
        github: 'https://github.com/sarahjohnson',
        status: 'available',
        favorited: true,
        addedDate: '2024-01-10',
        lastContact: '2024-01-09',
        atsScore: 92,
        experience: '5+ years',
        expectedSalary: '$120k-$150k',
        availability: 'Immediately',
        workAuth: 'US Citizen',
        summary: 'Experienced React developer with a passion for creating intuitive user interfaces and scalable applications. Proven track record of leading development teams and delivering high-quality software solutions.',
        skills: [
          { name: 'React', level: 95, years: 5 },
          { name: 'JavaScript', level: 90, years: 6 },
          { name: 'TypeScript', level: 85, years: 3 },
          { name: 'Node.js', level: 80, years: 4 },
          { name: 'Python', level: 75, years: 2 },
          { name: 'AWS', level: 70, years: 3 },
          { name: 'Docker', level: 65, years: 2 }
        ],
        experience_history: [
          {
            id: 1,
            title: 'Senior Frontend Developer',
            company: 'TechCorp Solutions',
            location: 'San Francisco, CA',
            startDate: '2022-01',
            endDate: null,
            current: true,
            description: 'Lead a team of 4 developers building React applications for enterprise clients. Implemented new architecture patterns that improved performance by 40%.'
          },
          {
            id: 2,
            title: 'React Developer',
            company: 'StartupXYZ',
            location: 'Remote',
            startDate: '2020-03',
            endDate: '2021-12',
            current: false,
            description: 'Developed and maintained multiple React applications. Built reusable component library used across 5 different products.'
          }
        ],
        education: [
          {
            id: 1,
            degree: 'Bachelor of Science in Computer Science',
            school: 'University of California, Berkeley',
            location: 'Berkeley, CA',
            startDate: '2016',
            endDate: '2020',
            gpa: '3.8'
          }
        ],
        certifications: [
          {
            id: 1,
            name: 'AWS Certified Developer',
            issuer: 'Amazon Web Services',
            issueDate: '2023-06',
            expiryDate: '2026-06'
          },
          {
            id: 2,
            name: 'React Professional Certification',
            issuer: 'Meta',
            issueDate: '2022-12',
            expiryDate: null
          }
        ],
        documents: [
          {
            id: 1,
            name: 'Resume_Sarah_Johnson_2024.pdf',
            type: 'resume',
            uploadDate: '2024-01-10',
            size: '245 KB'
          },
          {
            id: 2,
            name: 'Portfolio_Projects.pdf',
            type: 'portfolio',
            uploadDate: '2024-01-10',
            size: '1.2 MB'
          }
        ],
        notes: [
          {
            id: 1,
            content: 'Excellent technical skills. Very interested in remote opportunities.',
            author: 'John Recruiter',
            date: '2024-01-10T15:30:00Z'
          },
          {
            id: 2,
            content: 'Client feedback: Great communication skills during technical interview.',
            author: 'Jane Manager',
            date: '2024-01-08T11:20:00Z'
          }
        ],
        matchedJobs: [
          {
            id: 1,
            title: 'Senior React Developer',
            company: 'TechCorp Solutions',
            matchScore: 95,
            location: 'San Francisco, CA',
            salary: '$120k-$150k'
          },
          {
            id: 2,
            title: 'Frontend Team Lead',
            company: 'Innovation Labs',
            matchScore: 88,
            location: 'Remote',
            salary: '$130k-$160k'
          }
        ]
      };
      
      setCandidate(mockCandidate);
    } catch (error) {
      console.error('Error fetching candidate profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCVUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setUploadingCV(true);
    try {
      // Simulate AI CV processing
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Mock AI extracted data
      const extractedData = {
        skills: ['React', 'Vue.js', 'Angular', 'JavaScript', 'TypeScript'],
        experience: '6 years',
        education: 'Master of Computer Science',
        summary: 'AI-extracted: Highly skilled frontend developer with expertise in modern JavaScript frameworks...'
      };
      
      // Update candidate profile with extracted data
      setCandidate(prev => ({
        ...prev,
        ...extractedData,
        documents: [
          ...prev.documents,
          {
            id: prev.documents.length + 1,
            name: file.name,
            type: 'resume',
            uploadDate: new Date().toISOString().split('T')[0],
            size: `${(file.size / 1024).toFixed(0)} KB`
          }
        ]
      }));
      
      alert('CV uploaded and processed successfully! Profile updated with AI-extracted information.');
    } catch (error) {
      console.error('Error uploading CV:', error);
      alert('Error uploading CV. Please try again.');
    } finally {
      setUploadingCV(false);
    }
  };

  const handleLinkedInSearch = async () => {
    setShowLinkedInSearch(true);
    try {
      // Simulate LinkedIn search
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const mockResults = [
        {
          id: 1,
          name: 'Sarah Johnson',
          title: 'Senior React Developer at TechCorp',
          location: 'San Francisco, CA',
          profileUrl: 'https://linkedin.com/in/sarahjohnson',
          mutual: 15,
          match: 95
        },
        {
          id: 2,
          name: 'Sarah J. Johnson',
          title: 'Frontend Developer at StartupXYZ',
          location: 'California, USA',
          profileUrl: 'https://linkedin.com/in/sarahjjohnson',
          mutual: 8,
          match: 78
        }
      ];
      
      setLinkedInResults(mockResults);
    } catch (error) {
      console.error('Error searching LinkedIn:', error);
    }
  };

  const handleAssessment = async () => {
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const mockAssessment = {
        overallScore: 88,
        technicalSkills: 92,
        communication: 85,
        problemSolving: 90,
        teamwork: 86,
        recommendations: [
          'Strong technical background in React and modern JavaScript',
          'Excellent problem-solving abilities',
          'Could benefit from more backend experience',
          'Great fit for senior frontend roles'
        ]
      };
      
      setAssessmentResults(mockAssessment);
    } catch (error) {
      console.error('Error running assessment:', error);
    }
  };

  const toggleFavorite = () => {
    setCandidate(prev => ({
      ...prev,
      favorited: !prev.favorited
    }));
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getSkillLevel = (level) => {
    if (level >= 90) return { label: 'Expert', color: 'text-green-600' };
    if (level >= 80) return { label: 'Advanced', color: 'text-blue-600' };
    if (level >= 70) return { label: 'Intermediate', color: 'text-yellow-600' };
    return { label: 'Beginner', color: 'text-gray-600' };
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!candidate) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-foreground mb-2">Candidate Not Found</h2>
          <p className="text-muted-foreground mb-4">The candidate profile you're looking for doesn't exist.</p>
          <button onClick={() => navigate('/candidates')} className="btn btn-primary">
            Back to Candidates
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate('/candidates')}
                className="btn btn-outline"
              >
                ← Back
              </button>
              <div>
                <h1 className="text-3xl font-bold text-foreground">{candidate.name}</h1>
                <p className="text-muted-foreground">{candidate.title}</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={toggleFavorite}
                className={`btn ${candidate.favorited ? 'btn-primary' : 'btn-outline'}`}
              >
                <HeartIcon className={`w-5 h-5 ${candidate.favorited ? 'fill-current' : ''}`} />
              </button>
              <button
                onClick={() => setShowAIChat(true)}
                className="btn btn-outline"
              >
                <ChatBubbleLeftRightIcon className="w-5 h-5" />
                Chat
              </button>
              <button className="btn btn-outline">
                <ShareIcon className="w-5 h-5" />
                Share
              </button>
              <button
                onClick={() => setIsEditing(!isEditing)}
                className="btn btn-primary"
              >
                <PencilIcon className="w-5 h-5" />
                {isEditing ? 'Save' : 'Edit'}
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Main Profile */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Info Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="card p-6"
            >
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                    <span className="text-primary font-bold text-xl">
                      {candidate.name.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-foreground">{candidate.name}</h2>
                    <p className="text-lg text-muted-foreground">{candidate.title}</p>
                    <div className="flex items-center space-x-4 mt-2">
                      <span className="flex items-center text-sm text-muted-foreground">
                        <MapPinIcon className="w-4 h-4 mr-1" />
                        {candidate.location}
                      </span>
                      <span className="flex items-center text-sm text-muted-foreground">
                        <BriefcaseIcon className="w-4 h-4 mr-1" />
                        {candidate.experience}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex items-center justify-end mb-2">
                    <span className="text-2xl font-bold text-green-600">{candidate.atsScore}%</span>
                    <span className="text-sm text-muted-foreground ml-1">ATS Score</span>
                  </div>
                  <div className="flex items-center text-sm">
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
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="p-3 bg-muted/30 rounded-lg">
                  <p className="text-sm text-muted-foreground">Status</p>
                  <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                    candidate.status === 'available' ? 'bg-green-100 text-green-800' :
                    candidate.status === 'interviewing' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-blue-100 text-blue-800'
                  }`}>
                    {candidate.status}
                  </span>
                </div>
                <div className="p-3 bg-muted/30 rounded-lg">
                  <p className="text-sm text-muted-foreground">Salary Expectation</p>
                  <p className="font-medium">{candidate.expectedSalary}</p>
                </div>
                <div className="p-3 bg-muted/30 rounded-lg">
                  <p className="text-sm text-muted-foreground">Availability</p>
                  <p className="font-medium">{candidate.availability}</p>
                </div>
              </div>

              <div className="border-t pt-4">
                <h3 className="font-semibold mb-2">Contact Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center space-x-2">
                    <EnvelopeIcon className="w-4 h-4 text-muted-foreground" />
                    <a href={`mailto:${candidate.email}`} className="text-primary hover:underline">
                      {candidate.email}
                    </a>
                  </div>
                  <div className="flex items-center space-x-2">
                    <PhoneIcon className="w-4 h-4 text-muted-foreground" />
                    <a href={`tel:${candidate.phone}`} className="text-primary hover:underline">
                      {candidate.phone}
                    </a>
                  </div>
                  <div className="flex items-center space-x-2">
                    <LinkIcon className="w-4 h-4 text-muted-foreground" />
                    <a href={candidate.linkedin} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                      LinkedIn Profile
                    </a>
                  </div>
                  <div className="flex items-center space-x-2">
                    <GlobeAltIcon className="w-4 h-4 text-muted-foreground" />
                    <a href={candidate.website} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                      Portfolio
                    </a>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Summary */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="card p-6"
            >
              <h3 className="text-lg font-semibold mb-4">Professional Summary</h3>
              <p className="text-muted-foreground leading-relaxed">{candidate.summary}</p>
            </motion.div>

            {/* Skills */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="card p-6"
            >
              <h3 className="text-lg font-semibold mb-4">Skills & Expertise</h3>
              <div className="space-y-4">
                {candidate.skills.map((skill, index) => {
                  const skillLevel = getSkillLevel(skill.level);
                  return (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-medium">{skill.name}</span>
                          <div className="flex items-center space-x-2">
                            <span className={`text-sm ${skillLevel.color}`}>
                              {skillLevel.label}
                            </span>
                            <span className="text-sm text-muted-foreground">
                              {skill.years} yrs
                            </span>
                          </div>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-primary h-2 rounded-full transition-all duration-300"
                            style={{ width: `${skill.level}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </motion.div>

            {/* Experience */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="card p-6"
            >
              <h3 className="text-lg font-semibold mb-4">Work Experience</h3>
              <div className="space-y-6">
                {candidate.experience_history.map((exp) => (
                  <div key={exp.id} className="border-l-2 border-primary/20 pl-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="font-semibold text-foreground">{exp.title}</h4>
                        <p className="text-primary font-medium">{exp.company}</p>
                        <p className="text-sm text-muted-foreground">{exp.location}</p>
                        <p className="text-sm text-muted-foreground">
                          {exp.startDate} - {exp.current ? 'Present' : exp.endDate}
                        </p>
                      </div>
                      {exp.current && (
                        <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                          Current
                        </span>
                      )}
                    </div>
                    <p className="text-muted-foreground mt-2 leading-relaxed">
                      {exp.description}
                    </p>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Education */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="card p-6"
            >
              <h3 className="text-lg font-semibold mb-4">Education</h3>
              <div className="space-y-4">
                {candidate.education.map((edu) => (
                  <div key={edu.id} className="flex items-start justify-between">
                    <div>
                      <h4 className="font-semibold text-foreground">{edu.degree}</h4>
                      <p className="text-primary font-medium">{edu.school}</p>
                      <p className="text-sm text-muted-foreground">{edu.location}</p>
                      <p className="text-sm text-muted-foreground">
                        {edu.startDate} - {edu.endDate}
                      </p>
                    </div>
                    {edu.gpa && (
                      <div className="text-right">
                        <p className="text-sm text-muted-foreground">GPA</p>
                        <p className="font-semibold">{edu.gpa}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Right Column - Actions & Info */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="card p-6"
            >
              <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <label className="btn btn-outline w-full cursor-pointer">
                  <DocumentArrowUpIcon className="w-5 h-5" />
                  {uploadingCV ? 'Processing CV...' : 'Upload New CV'}
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx"
                    onChange={handleCVUpload}
                    className="hidden"
                    disabled={uploadingCV}
                  />
                </label>
                
                <button
                  onClick={handleAssessment}
                  className="btn btn-outline w-full"
                >
                  <SparklesIcon className="w-5 h-5" />
                  AI Assessment
                </button>
                
                <button
                  onClick={handleLinkedInSearch}
                  className="btn btn-outline w-full"
                >
                  <LinkIcon className="w-5 h-5" />
                  LinkedIn Lookup
                </button>
                
                <Link to={`/candidates/${candidate.id}/match`} className="btn btn-primary w-full">
                  <BriefcaseIcon className="w-5 h-5" />
                  Find Matching Jobs
                </Link>
              </div>
            </motion.div>

            {/* Assessment Results */}
            {assessmentResults && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="card p-6"
              >
                <h3 className="text-lg font-semibold mb-4">AI Assessment Results</h3>
                <div className="space-y-4">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-primary mb-2">
                      {assessmentResults.overallScore}%
                    </div>
                    <p className="text-muted-foreground">Overall Score</p>
                  </div>
                  
                  <div className="space-y-2">
                    {Object.entries(assessmentResults).filter(([key]) => key !== 'overallScore' && key !== 'recommendations').map(([key, value]) => (
                      <div key={key} className="flex items-center justify-between">
                        <span className="text-sm capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                        <span className="font-medium">{value}%</span>
                      </div>
                    ))}
                  </div>
                  
                  <div className="border-t pt-4">
                    <h4 className="font-medium mb-2">Recommendations</h4>
                    <ul className="space-y-1 text-sm text-muted-foreground">
                      {assessmentResults.recommendations.map((rec, index) => (
                        <li key={index} className="flex items-start">
                          <span className="text-primary mr-2">•</span>
                          {rec}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </motion.div>
            )}

            {/* LinkedIn Search Results */}
            {showLinkedInSearch && linkedInResults.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="card p-6"
              >
                <h3 className="text-lg font-semibold mb-4">LinkedIn Search Results</h3>
                <div className="space-y-3">
                  {linkedInResults.map((result) => (
                    <div key={result.id} className="p-3 border border-border rounded-lg">
                      <h4 className="font-medium">{result.name}</h4>
                      <p className="text-sm text-muted-foreground">{result.title}</p>
                      <p className="text-sm text-muted-foreground">{result.location}</p>
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-xs text-muted-foreground">
                          {result.mutual} mutual connections
                        </span>
                        <div className="flex items-center space-x-2">
                          <span className="text-xs font-medium text-primary">
                            {result.match}% match
                          </span>
                          <a
                            href={result.profileUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn btn-outline btn-sm"
                          >
                            View
                          </a>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Documents */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="card p-6"
            >
              <h3 className="text-lg font-semibold mb-4">Documents</h3>
              <div className="space-y-3">
                {candidate.documents.map((doc) => (
                  <div key={doc.id} className="flex items-center justify-between p-3 border border-border rounded-lg">
                    <div>
                      <h4 className="font-medium text-sm">{doc.name}</h4>
                      <p className="text-xs text-muted-foreground">
                        {doc.type} • {doc.size} • {formatDate(doc.uploadDate)}
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button className="btn btn-outline btn-sm">
                        <EyeIcon className="w-4 h-4" />
                      </button>
                      <button className="btn btn-outline btn-sm">
                        <ArrowDownTrayIcon className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Matched Jobs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="card p-6"
            >
              <h3 className="text-lg font-semibold mb-4">Matched Jobs</h3>
              <div className="space-y-3">
                {candidate.matchedJobs.map((job) => (
                  <div key={job.id} className="p-3 border border-border rounded-lg">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h4 className="font-medium text-sm">{job.title}</h4>
                        <p className="text-xs text-muted-foreground">{job.company}</p>
                      </div>
                      <span className="text-xs font-medium text-green-600">
                        {job.matchScore}% match
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground mb-2">
                      {job.location} • {job.salary}
                    </p>
                    <button className="btn btn-primary btn-sm w-full">
                      Submit Application
                    </button>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Recent Notes */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="card p-6"
            >
              <h3 className="text-lg font-semibold mb-4">Recent Notes</h3>
              <div className="space-y-3">
                {candidate.notes.map((note) => (
                  <div key={note.id} className="p-3 bg-muted/30 rounded-lg">
                    <p className="text-sm text-foreground mb-2">{note.content}</p>
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>{note.author}</span>
                      <span>{formatDate(note.date)}</span>
                    </div>
                  </div>
                ))}
              </div>
              <button className="btn btn-outline btn-sm w-full mt-3">
                Add Note
              </button>
            </motion.div>
          </div>
        </div>
      </div>

      {/* AI Chat Modal */}
      {showAIChat && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-background rounded-lg shadow-xl w-full max-w-2xl m-4 max-h-[80vh] overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b">
              <h3 className="text-lg font-semibold">Chat with {candidate.name}</h3>
              <button
                onClick={() => setShowAIChat(false)}
                className="text-muted-foreground hover:text-foreground"
              >
                <XMarkIcon className="w-6 h-6" />
              </button>
            </div>
            <div className="h-96">
              <AIChat 
                context={`candidate profile for ${candidate.name}`}
                initialMessage={`Hi! I'm interested in discussing opportunities with ${candidate.name}. They seem like a great fit for our React developer position.`}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CandidateProfile; 