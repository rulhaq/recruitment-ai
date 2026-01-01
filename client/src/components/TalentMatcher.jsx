/**
 * This is a product of Scalovate Systems Solutions.
 * All rights reserved.
 */

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  SparklesIcon,
  MagnifyingGlassIcon,
  AdjustmentsHorizontalIcon,
  UserIcon,
  BriefcaseIcon,
  StarIcon,
  MapPinIcon,
  CurrencyDollarIcon,
  ClockIcon,
  CheckCircleIcon,
  ArrowRightIcon,
  HeartIcon,
  ChatBubbleLeftRightIcon,
  DocumentTextIcon,
  XMarkIcon,
  InformationCircleIcon,
  ChartBarIcon,
  CpuChipIcon,
  AcademicCapIcon,
  BuildingOfficeIcon
} from '@heroicons/react/24/outline';
import { StarIcon as StarIconSolid, HeartIcon as HeartIconSolid } from '@heroicons/react/24/solid';
import LoadingSpinner from './LoadingSpinner';

const TalentMatcher = ({ onClose }) => {
  const [step, setStep] = useState(1); // 1: Job Selection, 2: AI Matching, 3: Results
  const [loading, setLoading] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);
  const [matchingCriteria, setMatchingCriteria] = useState({
    skillsWeight: 40,
    experienceWeight: 25,
    locationWeight: 15,
    salaryWeight: 10,
    availabilityWeight: 10,
    includePassiveCandidates: false,
    minimumMatchScore: 70,
    maxResults: 10
  });
  const [matches, setMatches] = useState([]);
  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const mockJobs = [
        {
          id: 1,
          title: 'Senior React Developer',
          company: 'TechCorp Solutions',
          location: 'San Francisco, CA',
          type: 'Full-time',
          remote: true,
          salary: { min: 120000, max: 150000 },
          requiredSkills: ['React', 'JavaScript', 'TypeScript', 'Node.js', 'AWS'],
          experienceLevel: 'Senior',
          department: 'Engineering',
          urgency: 'High',
          description: 'Looking for an experienced React developer to join our frontend team.',
          requirements: [
            '5+ years of React experience',
            'Strong JavaScript/TypeScript skills',
            'Experience with modern frontend tools',
            'Knowledge of state management (Redux/Context)',
            'Familiarity with testing frameworks'
          ]
        },
        {
          id: 2,
          title: 'DevOps Engineer',
          company: 'CloudTech Inc',
          location: 'Remote',
          type: 'Full-time',
          remote: true,
          salary: { min: 100000, max: 130000 },
          requiredSkills: ['AWS', 'Docker', 'Kubernetes', 'Terraform', 'CI/CD'],
          experienceLevel: 'Mid-level',
          department: 'Infrastructure',
          urgency: 'High',
          description: 'Join our infrastructure team to build and maintain scalable cloud solutions.',
          requirements: [
            '3+ years of DevOps experience',
            'AWS/Azure cloud platforms',
            'Docker and Kubernetes',
            'Infrastructure as Code (Terraform)',
            'CI/CD pipeline experience'
          ]
        },
        {
          id: 3,
          title: 'Frontend Developer',
          company: 'StartupXYZ',
          location: 'Austin, TX',
          type: 'Full-time',
          remote: false,
          salary: { min: 80000, max: 100000 },
          requiredSkills: ['Vue.js', 'JavaScript', 'HTML', 'CSS', 'Git'],
          experienceLevel: 'Mid-level',
          department: 'Product',
          urgency: 'Medium',
          description: 'Looking for a creative frontend developer to help build our next-generation web platform.',
          requirements: [
            '2+ years of frontend experience',
            'Proficiency in Vue.js or React',
            'HTML5, CSS3, JavaScript',
            'Responsive design experience',
            'Version control with Git'
          ]
        },
        {
          id: 4,
          title: 'UI/UX Designer',
          company: 'Design Studio Pro',
          location: 'Los Angeles, CA',
          type: 'Part-time',
          remote: true,
          salary: { min: 60000, max: 80000 },
          requiredSkills: ['Figma', 'UI Design', 'UX Research', 'Prototyping', 'User Testing'],
          experienceLevel: 'Mid-level',
          department: 'Design',
          urgency: 'Low',
          description: 'Part-time position for a talented UI/UX designer to work on diverse client projects.',
          requirements: [
            '3+ years of UI/UX experience',
            'Proficiency in Figma/Sketch',
            'User research experience',
            'Prototyping skills',
            'Strong portfolio'
          ]
        }
      ];
      
      setJobs(mockJobs);
    } catch (error) {
      console.error('Error fetching jobs:', error);
    }
  };

  const runAIMatching = async () => {
    setLoading(true);
    setStep(2);
    
    try {
      // Simulate AI processing time
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Mock AI matching results
      const mockMatches = [
        {
          id: 1,
          name: 'Sarah Johnson',
          title: 'Senior React Developer',
          location: 'San Francisco, CA',
          experience: '5+ years',
          skills: ['React', 'JavaScript', 'TypeScript', 'Node.js', 'AWS'],
          matchScore: 95,
          availability: 'Immediately',
          expectedSalary: '$120k-$150k',
          remote: true,
          profileImage: null,
          summary: 'Experienced React developer with expertise in modern JavaScript frameworks.',
          favorited: true,
          lastContact: '2024-01-09',
          atsScore: 92,
          matchReasons: [
            'Perfect skill match for React and TypeScript',
            'Salary expectations align with budget',
            'Immediate availability',
            'Located in target location',
            '5+ years of relevant experience'
          ],
          skillMatch: {
            'React': 100,
            'JavaScript': 95,
            'TypeScript': 90,
            'Node.js': 85,
            'AWS': 80
          },
          portfolioUrl: 'https://sarahjohnson.dev',
          linkedinUrl: 'https://linkedin.com/in/sarahjohnson'
        },
        {
          id: 2,
          name: 'Mike Chen',
          title: 'Full Stack Engineer',
          location: 'Remote',
          experience: '4 years',
          skills: ['React', 'JavaScript', 'Python', 'Node.js', 'Docker'],
          matchScore: 88,
          availability: '2 weeks notice',
          expectedSalary: '$100k-$130k',
          remote: true,
          profileImage: null,
          summary: 'Full-stack developer with strong frontend React experience.',
          favorited: false,
          lastContact: '2024-01-07',
          atsScore: 88,
          matchReasons: [
            'Strong React and JavaScript skills',
            'Good salary fit within budget',
            'Remote work preference matches',
            '4 years of solid experience',
            'Full-stack background adds value'
          ],
          skillMatch: {
            'React': 90,
            'JavaScript': 95,
            'TypeScript': 60,
            'Node.js': 90,
            'AWS': 65
          },
          portfolioUrl: 'https://mikechen.dev',
          linkedinUrl: 'https://linkedin.com/in/mikechen'
        },
        {
          id: 3,
          name: 'Alex Rodriguez',
          title: 'Frontend Developer',
          location: 'Austin, TX',
          experience: '3 years',
          skills: ['React', 'JavaScript', 'CSS', 'HTML', 'Redux'],
          matchScore: 82,
          availability: '1 month notice',
          expectedSalary: '$95k-$125k',
          remote: false,
          profileImage: null,
          summary: 'Passionate frontend developer with strong React fundamentals.',
          favorited: true,
          lastContact: '2024-01-05',
          atsScore: 85,
          matchReasons: [
            'Solid React and JavaScript foundation',
            'Salary expectations reasonable',
            'Willing to relocate for right opportunity',
            '3 years of focused frontend experience',
            'Strong CSS and HTML skills'
          ],
          skillMatch: {
            'React': 85,
            'JavaScript': 90,
            'TypeScript': 40,
            'Node.js': 50,
            'AWS': 30
          },
          portfolioUrl: 'https://alexrodriguez.dev',
          linkedinUrl: 'https://linkedin.com/in/alexrodriguez'
        },
        {
          id: 4,
          name: 'Jennifer Liu',
          title: 'React Developer',
          location: 'Seattle, WA',
          experience: '4 years',
          skills: ['React', 'JavaScript', 'TypeScript', 'GraphQL', 'MongoDB'],
          matchScore: 79,
          availability: 'Immediately',
          expectedSalary: '$110k-$140k',
          remote: true,
          profileImage: null,
          summary: 'React specialist with modern development stack experience.',
          favorited: false,
          lastContact: '2024-01-03',
          atsScore: 87,
          matchReasons: [
            'Strong React and TypeScript skills',
            'Modern development stack knowledge',
            'Immediate availability',
            'Remote work experience',
            'Good cultural fit indicators'
          ],
          skillMatch: {
            'React': 95,
            'JavaScript': 85,
            'TypeScript': 85,
            'Node.js': 60,
            'AWS': 45
          },
          portfolioUrl: 'https://jenniferliu.dev',
          linkedinUrl: 'https://linkedin.com/in/jenniferliu'
        },
        {
          id: 5,
          name: 'David Park',
          title: 'Software Engineer',
          location: 'San Francisco, CA',
          experience: '6+ years',
          skills: ['React', 'JavaScript', 'Python', 'AWS', 'Docker'],
          matchScore: 76,
          availability: '3 weeks notice',
          expectedSalary: '$130k-$160k',
          remote: true,
          profileImage: null,
          summary: 'Senior software engineer with full-stack capabilities.',
          favorited: false,
          lastContact: '2024-01-01',
          atsScore: 90,
          matchReasons: [
            'Senior level experience',
            'Strong technical background',
            'Local to San Francisco',
            'AWS cloud experience',
            'Leadership potential'
          ],
          skillMatch: {
            'React': 80,
            'JavaScript': 90,
            'TypeScript': 70,
            'Node.js': 85,
            'AWS': 90
          },
          portfolioUrl: 'https://davidpark.dev',
          linkedinUrl: 'https://linkedin.com/in/davidpark'
        }
      ];
      
      // Filter by minimum match score
      const filteredMatches = mockMatches.filter(match => 
        match.matchScore >= matchingCriteria.minimumMatchScore
      );
      
      // Sort by match score
      filteredMatches.sort((a, b) => b.matchScore - a.matchScore);
      
      // Limit results
      const limitedMatches = filteredMatches.slice(0, matchingCriteria.maxResults);
      
      setMatches(limitedMatches);
      setStep(3);
    } catch (error) {
      console.error('Error running AI matching:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleFavorite = (candidateId) => {
    setMatches(prevMatches =>
      prevMatches.map(match =>
        match.id === candidateId
          ? { ...match, favorited: !match.favorited }
          : match
      )
    );
  };

  const formatSalary = (salary) => {
    return `$${(salary.min / 1000).toFixed(0)}k-$${(salary.max / 1000).toFixed(0)}k`;
  };

  const getMatchScoreColor = (score) => {
    if (score >= 90) return 'text-green-600 bg-green-50';
    if (score >= 80) return 'text-blue-600 bg-blue-50';
    if (score >= 70) return 'text-yellow-600 bg-yellow-50';
    return 'text-red-600 bg-red-50';
  };

  return (
    <div className="w-full">
      {/* Progress Indicator */}
      <div className="flex items-center justify-center mb-8">
        <div className="flex items-center space-x-4">
          <div className={`flex items-center justify-center w-8 h-8 rounded-full ${
            step >= 1 ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
          }`}>
            1
          </div>
          <div className={`w-16 h-0.5 ${step >= 2 ? 'bg-primary' : 'bg-muted'}`}></div>
          <div className={`flex items-center justify-center w-8 h-8 rounded-full ${
            step >= 2 ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
          }`}>
            2
          </div>
          <div className={`w-16 h-0.5 ${step >= 3 ? 'bg-primary' : 'bg-muted'}`}></div>
          <div className={`flex items-center justify-center w-8 h-8 rounded-full ${
            step >= 3 ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
          }`}>
            3
          </div>
        </div>
      </div>

      {/* Step 1: Job Selection */}
      {step === 1 && (
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-6"
        >
          <div className="text-center">
            <h3 className="text-xl font-semibold mb-2">Select Job for AI Matching</h3>
            <p className="text-muted-foreground">
              Choose a job position to find the best matching candidates
            </p>
          </div>

          <div className="grid gap-4 max-h-96 overflow-y-auto">
            {jobs.map((job) => (
              <div
                key={job.id}
                onClick={() => setSelectedJob(job)}
                className={`p-4 rounded-lg border cursor-pointer transition-all ${
                  selectedJob?.id === job.id
                    ? 'border-primary bg-primary/5'
                    : 'border-border hover:border-primary/50'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h4 className="font-semibold text-foreground">{job.title}</h4>
                    <p className="text-primary font-medium">{job.company}</p>
                    <div className="flex items-center space-x-4 mt-2 text-sm text-muted-foreground">
                      <div className="flex items-center">
                        <MapPinIcon className="w-4 h-4 mr-1" />
                        {job.location}
                      </div>
                      <div className="flex items-center">
                        <CurrencyDollarIcon className="w-4 h-4 mr-1" />
                        {formatSalary(job.salary)}
                      </div>
                      <div className="flex items-center">
                        <ClockIcon className="w-4 h-4 mr-1" />
                        {job.type}
                      </div>
                    </div>
                    
                    <div className="flex flex-wrap gap-1 mt-3">
                      {job.requiredSkills.slice(0, 4).map((skill, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-muted text-muted-foreground text-xs rounded"
                        >
                          {skill}
                        </span>
                      ))}
                      {job.requiredSkills.length > 4 && (
                        <span className="px-2 py-1 bg-muted text-muted-foreground text-xs rounded">
                          +{job.requiredSkills.length - 4} more
                        </span>
                      )}
                    </div>
                  </div>
                  
                  {job.urgency === 'High' && (
                    <span className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded-full">
                      Urgent
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Matching Criteria */}
          {selectedJob && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="border border-border rounded-lg p-4"
            >
              <h4 className="font-semibold mb-4">AI Matching Criteria</h4>
              
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Skills Weight: {matchingCriteria.skillsWeight}%
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={matchingCriteria.skillsWeight}
                      onChange={(e) => setMatchingCriteria(prev => ({
                        ...prev,
                        skillsWeight: parseInt(e.target.value)
                      }))}
                      className="w-full"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Experience Weight: {matchingCriteria.experienceWeight}%
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={matchingCriteria.experienceWeight}
                      onChange={(e) => setMatchingCriteria(prev => ({
                        ...prev,
                        experienceWeight: parseInt(e.target.value)
                      }))}
                      className="w-full"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Location: {matchingCriteria.locationWeight}%
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={matchingCriteria.locationWeight}
                      onChange={(e) => setMatchingCriteria(prev => ({
                        ...prev,
                        locationWeight: parseInt(e.target.value)
                      }))}
                      className="w-full"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Salary: {matchingCriteria.salaryWeight}%
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={matchingCriteria.salaryWeight}
                      onChange={(e) => setMatchingCriteria(prev => ({
                        ...prev,
                        salaryWeight: parseInt(e.target.value)
                      }))}
                      className="w-full"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Availability: {matchingCriteria.availabilityWeight}%
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={matchingCriteria.availabilityWeight}
                      onChange={(e) => setMatchingCriteria(prev => ({
                        ...prev,
                        availabilityWeight: parseInt(e.target.value)
                      }))}
                      className="w-full"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Minimum Match Score</label>
                    <select
                      value={matchingCriteria.minimumMatchScore}
                      onChange={(e) => setMatchingCriteria(prev => ({
                        ...prev,
                        minimumMatchScore: parseInt(e.target.value)
                      }))}
                      className="input w-full"
                    >
                      <option value={60}>60% and above</option>
                      <option value={70}>70% and above</option>
                      <option value={80}>80% and above</option>
                      <option value={90}>90% and above</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">Max Results</label>
                    <select
                      value={matchingCriteria.maxResults}
                      onChange={(e) => setMatchingCriteria(prev => ({
                        ...prev,
                        maxResults: parseInt(e.target.value)
                      }))}
                      className="input w-full"
                    >
                      <option value={5}>5 candidates</option>
                      <option value={10}>10 candidates</option>
                      <option value={15}>15 candidates</option>
                      <option value={20}>20 candidates</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={matchingCriteria.includePassiveCandidates}
                      onChange={(e) => setMatchingCriteria(prev => ({
                        ...prev,
                        includePassiveCandidates: e.target.checked
                      }))}
                      className="mr-2"
                    />
                    <span className="text-sm font-medium">Include passive candidates</span>
                  </label>
                </div>
              </div>
            </motion.div>
          )}

          <div className="flex justify-end space-x-3">
            <button onClick={onClose} className="btn btn-outline">
              Cancel
            </button>
            <button
              onClick={runAIMatching}
              disabled={!selectedJob}
              className="btn btn-primary"
            >
              <SparklesIcon className="w-5 h-5" />
              Start AI Matching
            </button>
          </div>
        </motion.div>
      )}

      {/* Step 2: AI Processing */}
      {step === 2 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12"
        >
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <CpuChipIcon className="w-8 h-8 text-primary animate-pulse" />
          </div>
          <h3 className="text-xl font-semibold mb-2">AI is analyzing candidates...</h3>
          <p className="text-muted-foreground mb-6">
            Our AI is evaluating {selectedJob?.title} requirements against candidate profiles
          </p>
          
          <div className="max-w-md mx-auto">
            <div className="space-y-3 text-sm text-muted-foreground">
              <div className="flex items-center justify-center">
                <CheckCircleIcon className="w-4 h-4 text-green-600 mr-2" />
                Analyzing skill matches
              </div>
              <div className="flex items-center justify-center">
                <CheckCircleIcon className="w-4 h-4 text-green-600 mr-2" />
                Evaluating experience levels
              </div>
              <div className="flex items-center justify-center">
                <CheckCircleIcon className="w-4 h-4 text-green-600 mr-2" />
                Checking location preferences
              </div>
              <div className="flex items-center justify-center">
                <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin mr-2"></div>
                Calculating compatibility scores
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Step 3: Results */}
      {step === 3 && (
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-semibold">AI Matching Results</h3>
              <p className="text-muted-foreground">
                Found {matches.length} candidates matching your criteria for {selectedJob?.title}
              </p>
            </div>
            <button
              onClick={() => setStep(1)}
              className="btn btn-outline"
            >
              New Search
            </button>
          </div>

          <div className="space-y-4 max-h-96 overflow-y-auto">
            {matches.map((match) => (
              <motion.div
                key={match.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="border border-border rounded-lg p-6"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                      <span className="text-primary font-semibold text-lg">
                        {match.name.split(' ').map(n => n[0]).join('')}
                      </span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground">{match.name}</h4>
                      <p className="text-muted-foreground">{match.title}</p>
                      <div className="flex items-center space-x-4 mt-1 text-sm text-muted-foreground">
                        <div className="flex items-center">
                          <MapPinIcon className="w-4 h-4 mr-1" />
                          {match.location}
                        </div>
                        <div className="flex items-center">
                          <BriefcaseIcon className="w-4 h-4 mr-1" />
                          {match.experience}
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getMatchScoreColor(match.matchScore)}`}>
                      {match.matchScore}% match
                    </span>
                    <button
                      onClick={() => toggleFavorite(match.id)}
                      className={`p-2 rounded ${match.favorited ? 'text-red-500' : 'text-muted-foreground hover:text-red-500'}`}
                    >
                      {match.favorited ? (
                        <HeartIconSolid className="w-5 h-5" />
                      ) : (
                        <HeartIcon className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Left Column */}
                  <div className="space-y-4">
                    <div>
                      <h5 className="font-medium mb-2">Match Reasons</h5>
                      <ul className="space-y-1 text-sm text-muted-foreground">
                        {match.matchReasons.slice(0, 3).map((reason, index) => (
                          <li key={index} className="flex items-start">
                            <CheckCircleIcon className="w-4 h-4 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                            {reason}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <h5 className="font-medium mb-2">Key Details</h5>
                      <div className="space-y-1 text-sm">
                        <div className="flex items-center justify-between">
                          <span className="text-muted-foreground">Availability:</span>
                          <span className="font-medium">{match.availability}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-muted-foreground">Salary:</span>
                          <span className="font-medium">{match.expectedSalary}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-muted-foreground">ATS Score:</span>
                          <span className="font-medium">{match.atsScore}%</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-muted-foreground">Remote:</span>
                          <span className="font-medium">{match.remote ? 'Yes' : 'No'}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Right Column */}
                  <div className="space-y-4">
                    <div>
                      <h5 className="font-medium mb-2">Skill Match Breakdown</h5>
                      <div className="space-y-2">
                        {Object.entries(match.skillMatch).map(([skill, percentage]) => (
                          <div key={skill} className="flex items-center justify-between">
                            <span className="text-sm">{skill}</span>
                            <div className="flex items-center space-x-2">
                              <div className="w-16 bg-muted rounded-full h-2">
                                <div
                                  className="bg-primary h-2 rounded-full"
                                  style={{ width: `${percentage}%` }}
                                ></div>
                              </div>
                              <span className="text-xs text-muted-foreground w-8">
                                {percentage}%
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h5 className="font-medium mb-2">Summary</h5>
                      <p className="text-sm text-muted-foreground">{match.summary}</p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between mt-6 pt-4 border-t border-border">
                  <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                    <span>Last contact: {match.lastContact}</span>
                    {match.portfolioUrl && (
                      <a
                        href={match.portfolioUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:underline"
                      >
                        View Portfolio
                      </a>
                    )}
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <button className="btn btn-outline btn-sm">
                      <DocumentTextIcon className="w-4 h-4" />
                      View Profile
                    </button>
                    <button className="btn btn-outline btn-sm">
                      <ChatBubbleLeftRightIcon className="w-4 h-4" />
                      Message
                    </button>
                    <button className="btn btn-primary btn-sm">
                      <ArrowRightIcon className="w-4 h-4" />
                      Create Proposal
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {matches.length === 0 && (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                <MagnifyingGlassIcon className="w-8 h-8 text-muted-foreground" />
              </div>
              <h4 className="text-lg font-semibold mb-2">No matches found</h4>
              <p className="text-muted-foreground mb-4">
                Try adjusting your matching criteria or minimum score threshold.
              </p>
              <button
                onClick={() => setStep(1)}
                className="btn btn-primary"
              >
                Adjust Criteria
              </button>
            </div>
          )}
        </motion.div>
      )}
    </div>
  );
};

export default TalentMatcher; 