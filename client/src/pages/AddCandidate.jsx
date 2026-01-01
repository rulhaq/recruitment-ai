/**
 * This is a product of Scalovate Systems Solutions.
 * All rights reserved.
 */

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  UserPlusIcon,
  DocumentArrowUpIcon,
  SparklesIcon,
  UserIcon,
  EnvelopeIcon,
  PhoneIcon,
  MapPinIcon,
  BriefcaseIcon,
  AcademicCapIcon,
  GlobeAltIcon,
  PlusIcon,
  XMarkIcon,
  CheckIcon,
  ExclamationTriangleIcon,
  ArrowLeftIcon,
  CpuChipIcon
} from '@heroicons/react/24/outline';
import LoadingSpinner from '../components/LoadingSpinner';

const AddCandidate = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1); // 1: Basic Info, 2: CV Upload, 3: Skills & Experience, 4: Finalize
  const [loading, setLoading] = useState(false);
  const [uploadingCV, setUploadingCV] = useState(false);
  const [candidateData, setCandidateData] = useState({
    // Basic Info
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    location: '',
    currentTitle: '',
    expectedSalary: '',
    availability: '',
    workAuth: '',
    remote: false,
    
    // Professional Info
    summary: '',
    experience: '',
    education: '',
    skills: [],
    certifications: [],
    
    // Links
    linkedin: '',
    github: '',
    portfolio: '',
    
    // Documents
    resume: null,
    portfolio_doc: null,
    
    // AI Extracted Data
    aiExtracted: null
  });

  const [skillInput, setSkillInput] = useState('');
  const [certificationInput, setCertificationInput] = useState('');
  const [errors, setErrors] = useState({});

  const handleInputChange = (field, value) => {
    setCandidateData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const addSkill = () => {
    if (skillInput.trim() && !candidateData.skills.includes(skillInput.trim())) {
      setCandidateData(prev => ({
        ...prev,
        skills: [...prev.skills, skillInput.trim()]
      }));
      setSkillInput('');
    }
  };

  const removeSkill = (skillToRemove) => {
    setCandidateData(prev => ({
      ...prev,
      skills: prev.skills.filter(skill => skill !== skillToRemove)
    }));
  };

  const addCertification = () => {
    if (certificationInput.trim() && !candidateData.certifications.includes(certificationInput.trim())) {
      setCandidateData(prev => ({
        ...prev,
        certifications: [...prev.certifications, certificationInput.trim()]
      }));
      setCertificationInput('');
    }
  };

  const removeCertification = (certToRemove) => {
    setCandidateData(prev => ({
      ...prev,
      certifications: prev.certifications.filter(cert => cert !== certToRemove)
    }));
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
        skills: ['React', 'JavaScript', 'TypeScript', 'Node.js', 'Python', 'AWS'],
        experience: '5+ years',
        education: 'Bachelor of Science in Computer Science',
        summary: 'Experienced software developer with expertise in modern web technologies and cloud platforms. Proven track record of building scalable applications and leading development teams.',
        currentTitle: 'Senior Frontend Developer',
        certifications: ['AWS Certified Developer', 'React Professional Certification']
      };
      
      // Update candidate data with extracted information
      setCandidateData(prev => ({
        ...prev,
        resume: file,
        skills: [...new Set([...prev.skills, ...extractedData.skills])],
        experience: extractedData.experience,
        education: extractedData.education,
        summary: extractedData.summary,
        currentTitle: prev.currentTitle || extractedData.currentTitle,
        certifications: [...new Set([...prev.certifications, ...extractedData.certifications])],
        aiExtracted: extractedData
      }));
      
      alert('CV uploaded and processed successfully! Profile populated with AI-extracted information.');
    } catch (error) {
      console.error('Error uploading CV:', error);
      alert('Error uploading CV. Please try again.');
    } finally {
      setUploadingCV(false);
    }
  };

  const validateStep = (stepNumber) => {
    const newErrors = {};

    if (stepNumber === 1) {
      if (!candidateData.firstName) newErrors.firstName = 'First name is required';
      if (!candidateData.lastName) newErrors.lastName = 'Last name is required';
      if (!candidateData.email) newErrors.email = 'Email is required';
      if (candidateData.email && !/\S+@\S+\.\S+/.test(candidateData.email)) {
        newErrors.email = 'Please enter a valid email address';
      }
      if (!candidateData.phone) newErrors.phone = 'Phone number is required';
      if (!candidateData.location) newErrors.location = 'Location is required';
    }

    if (stepNumber === 3) {
      if (!candidateData.currentTitle) newErrors.currentTitle = 'Current title is required';
      if (!candidateData.experience) newErrors.experience = 'Experience level is required';
      if (candidateData.skills.length === 0) newErrors.skills = 'At least one skill is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const nextStep = () => {
    if (validateStep(step)) {
      setStep(prev => Math.min(prev + 1, 4));
    }
  };

  const prevStep = () => {
    setStep(prev => Math.max(prev - 1, 1));
  };

  const saveDraft = async () => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      alert('Draft saved successfully!');
    } catch (error) {
      console.error('Error saving draft:', error);
      alert('Error saving draft. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const submitCandidate = async () => {
    if (!validateStep(3)) return;

    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Mock API call to save candidate
      console.log('Saving candidate:', candidateData);
      
      alert('Candidate added successfully!');
      navigate('/candidates');
    } catch (error) {
      console.error('Error saving candidate:', error);
      alert('Error saving candidate. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-4 mb-4">
            <button
              onClick={() => navigate('/candidates')}
              className="btn btn-outline"
            >
              <ArrowLeftIcon className="w-5 h-5" />
              Back
            </button>
            <div>
              <h1 className="text-3xl font-bold text-foreground">Add New Candidate</h1>
              <p className="text-muted-foreground">
                Create a comprehensive candidate profile with AI assistance
              </p>
            </div>
          </div>

          {/* Progress Indicator */}
          <div className="flex items-center justify-center">
            <div className="flex items-center space-x-4">
              {[1, 2, 3, 4].map((stepNumber) => (
                <div key={stepNumber} className="flex items-center">
                  <div className={`flex items-center justify-center w-8 h-8 rounded-full ${
                    step >= stepNumber ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
                  }`}>
                    {step > stepNumber ? <CheckIcon className="w-4 h-4" /> : stepNumber}
                  </div>
                  {stepNumber < 4 && (
                    <div className={`w-16 h-0.5 ${step > stepNumber ? 'bg-primary' : 'bg-muted'}`}></div>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-center mt-2">
            <div className="flex space-x-8 text-sm text-muted-foreground">
              <span className={step === 1 ? 'text-primary font-medium' : ''}>Basic Info</span>
              <span className={step === 2 ? 'text-primary font-medium' : ''}>CV Upload</span>
              <span className={step === 3 ? 'text-primary font-medium' : ''}>Skills & Experience</span>
              <span className={step === 4 ? 'text-primary font-medium' : ''}>Review & Save</span>
            </div>
          </div>
        </div>

        <div className="card p-8">
          {/* Step 1: Basic Information */}
          {step === 1 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-6"
            >
              <div className="text-center mb-6">
                <UserIcon className="w-12 h-12 text-primary mx-auto mb-2" />
                <h2 className="text-xl font-semibold">Basic Information</h2>
                <p className="text-muted-foreground">Enter the candidate's basic details</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium mb-2">First Name *</label>
                  <input
                    type="text"
                    value={candidateData.firstName}
                    onChange={(e) => handleInputChange('firstName', e.target.value)}
                    className={`input w-full ${errors.firstName ? 'border-red-500' : ''}`}
                    placeholder="Enter first name"
                  />
                  {errors.firstName && (
                    <p className="text-red-500 text-xs mt-1">{errors.firstName}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Last Name *</label>
                  <input
                    type="text"
                    value={candidateData.lastName}
                    onChange={(e) => handleInputChange('lastName', e.target.value)}
                    className={`input w-full ${errors.lastName ? 'border-red-500' : ''}`}
                    placeholder="Enter last name"
                  />
                  {errors.lastName && (
                    <p className="text-red-500 text-xs mt-1">{errors.lastName}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Email *</label>
                  <input
                    type="email"
                    value={candidateData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className={`input w-full ${errors.email ? 'border-red-500' : ''}`}
                    placeholder="Enter email address"
                  />
                  {errors.email && (
                    <p className="text-red-500 text-xs mt-1">{errors.email}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Phone *</label>
                  <input
                    type="tel"
                    value={candidateData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    className={`input w-full ${errors.phone ? 'border-red-500' : ''}`}
                    placeholder="Enter phone number"
                  />
                  {errors.phone && (
                    <p className="text-red-500 text-xs mt-1">{errors.phone}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Location *</label>
                  <input
                    type="text"
                    value={candidateData.location}
                    onChange={(e) => handleInputChange('location', e.target.value)}
                    className={`input w-full ${errors.location ? 'border-red-500' : ''}`}
                    placeholder="City, State/Country"
                  />
                  {errors.location && (
                    <p className="text-red-500 text-xs mt-1">{errors.location}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Expected Salary</label>
                  <input
                    type="text"
                    value={candidateData.expectedSalary}
                    onChange={(e) => handleInputChange('expectedSalary', e.target.value)}
                    className="input w-full"
                    placeholder="e.g., $80k-$120k"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Availability</label>
                  <select
                    value={candidateData.availability}
                    onChange={(e) => handleInputChange('availability', e.target.value)}
                    className="input w-full"
                  >
                    <option value="">Select availability</option>
                    <option value="Immediately">Immediately</option>
                    <option value="2 weeks notice">2 weeks notice</option>
                    <option value="1 month notice">1 month notice</option>
                    <option value="2-3 months">2-3 months</option>
                    <option value="Not actively looking">Not actively looking</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Work Authorization</label>
                  <select
                    value={candidateData.workAuth}
                    onChange={(e) => handleInputChange('workAuth', e.target.value)}
                    className="input w-full"
                  >
                    <option value="">Select work authorization</option>
                    <option value="US Citizen">US Citizen</option>
                    <option value="Green Card">Green Card</option>
                    <option value="H1B">H1B</option>
                    <option value="EAD">EAD</option>
                    <option value="F1 OPT">F1 OPT</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={candidateData.remote}
                    onChange={(e) => handleInputChange('remote', e.target.checked)}
                    className="mr-2"
                  />
                  <span className="text-sm font-medium">Open to remote work</span>
                </label>
              </div>
            </motion.div>
          )}

          {/* Step 2: CV Upload */}
          {step === 2 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-6"
            >
              <div className="text-center mb-6">
                <DocumentArrowUpIcon className="w-12 h-12 text-primary mx-auto mb-2" />
                <h2 className="text-xl font-semibold">CV Upload & AI Processing</h2>
                <p className="text-muted-foreground">Upload the candidate's CV for AI analysis and data extraction</p>
              </div>

              <div className="space-y-6">
                {/* CV Upload */}
                <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
                  <label className="cursor-pointer">
                    <DocumentArrowUpIcon className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <div className="text-lg font-medium mb-2">
                      {uploadingCV ? 'Processing CV...' : 'Upload Resume/CV'}
                    </div>
                    <div className="text-muted-foreground mb-4">
                      Drag and drop or click to select PDF, DOC, or DOCX file
                    </div>
                    <input
                      type="file"
                      accept=".pdf,.doc,.docx"
                      onChange={handleCVUpload}
                      className="hidden"
                      disabled={uploadingCV}
                    />
                    <div className="btn btn-primary">
                      {uploadingCV ? (
                        <>
                          <CpuChipIcon className="w-5 h-5 animate-pulse" />
                          Processing with AI...
                        </>
                      ) : (
                        <>
                          <DocumentArrowUpIcon className="w-5 h-5" />
                          Choose File
                        </>
                      )}
                    </div>
                  </label>
                </div>

                {candidateData.resume && (
                  <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <CheckIcon className="w-5 h-5 text-green-600" />
                      <span className="font-medium text-green-800">CV Uploaded Successfully</span>
                    </div>
                    <p className="text-green-700 text-sm mt-1">
                      File: {candidateData.resume.name} ({(candidateData.resume.size / 1024).toFixed(0)} KB)
                    </p>
                  </div>
                )}

                {candidateData.aiExtracted && (
                  <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <div className="flex items-center space-x-2 mb-3">
                      <SparklesIcon className="w-5 h-5 text-blue-600" />
                      <span className="font-medium text-blue-800">AI Extracted Information</span>
                    </div>
                    <div className="text-sm text-blue-700 space-y-2">
                      <p><strong>Skills:</strong> {candidateData.aiExtracted.skills.join(', ')}</p>
                      <p><strong>Experience:</strong> {candidateData.aiExtracted.experience}</p>
                      <p><strong>Education:</strong> {candidateData.aiExtracted.education}</p>
                      <p><strong>Current Title:</strong> {candidateData.aiExtracted.currentTitle}</p>
                    </div>
                  </div>
                )}

                {/* Optional Portfolio Upload */}
                <div>
                  <h3 className="text-lg font-medium mb-4">Additional Documents (Optional)</h3>
                  <div className="border border-border rounded-lg p-6 text-center">
                    <label className="cursor-pointer">
                      <div className="text-muted-foreground mb-4">Upload portfolio, cover letter, or other documents</div>
                      <input
                        type="file"
                        accept=".pdf,.doc,.docx"
                        onChange={(e) => handleInputChange('portfolio_doc', e.target.files[0])}
                        className="hidden"
                      />
                      <div className="btn btn-outline">
                        <PlusIcon className="w-5 h-5" />
                        Add Document
                      </div>
                    </label>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Step 3: Skills & Experience */}
          {step === 3 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-6"
            >
              <div className="text-center mb-6">
                <BriefcaseIcon className="w-12 h-12 text-primary mx-auto mb-2" />
                <h2 className="text-xl font-semibold">Skills & Experience</h2>
                <p className="text-muted-foreground">Complete the candidate's professional profile</p>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium mb-2">Current Title *</label>
                  <input
                    type="text"
                    value={candidateData.currentTitle}
                    onChange={(e) => handleInputChange('currentTitle', e.target.value)}
                    className={`input w-full ${errors.currentTitle ? 'border-red-500' : ''}`}
                    placeholder="e.g., Senior React Developer"
                  />
                  {errors.currentTitle && (
                    <p className="text-red-500 text-xs mt-1">{errors.currentTitle}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Experience Level *</label>
                  <select
                    value={candidateData.experience}
                    onChange={(e) => handleInputChange('experience', e.target.value)}
                    className={`input w-full ${errors.experience ? 'border-red-500' : ''}`}
                  >
                    <option value="">Select experience level</option>
                    <option value="Entry level (0-2 years)">Entry level (0-2 years)</option>
                    <option value="Mid-level (2-5 years)">Mid-level (2-5 years)</option>
                    <option value="Senior (5-10 years)">Senior (5-10 years)</option>
                    <option value="Lead/Principal (10+ years)">Lead/Principal (10+ years)</option>
                  </select>
                  {errors.experience && (
                    <p className="text-red-500 text-xs mt-1">{errors.experience}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Professional Summary</label>
                  <textarea
                    value={candidateData.summary}
                    onChange={(e) => handleInputChange('summary', e.target.value)}
                    className="input w-full h-24 resize-none"
                    placeholder="Brief summary of the candidate's background and expertise..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Education</label>
                  <input
                    type="text"
                    value={candidateData.education}
                    onChange={(e) => handleInputChange('education', e.target.value)}
                    className="input w-full"
                    placeholder="e.g., Bachelor of Science in Computer Science"
                  />
                </div>

                {/* Skills */}
                <div>
                  <label className="block text-sm font-medium mb-2">Skills *</label>
                  <div className="flex space-x-2 mb-3">
                    <input
                      type="text"
                      value={skillInput}
                      onChange={(e) => setSkillInput(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && addSkill()}
                      className="input flex-1"
                      placeholder="Add a skill and press Enter"
                    />
                    <button
                      type="button"
                      onClick={addSkill}
                      className="btn btn-outline"
                    >
                      <PlusIcon className="w-5 h-5" />
                    </button>
                  </div>
                  
                  <div className="flex flex-wrap gap-2">
                    {candidateData.skills.map((skill, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-primary/10 text-primary"
                      >
                        {skill}
                        <button
                          onClick={() => removeSkill(skill)}
                          className="ml-2 text-primary hover:text-primary/70"
                        >
                          <XMarkIcon className="w-4 h-4" />
                        </button>
                      </span>
                    ))}
                  </div>
                  {errors.skills && (
                    <p className="text-red-500 text-xs mt-1">{errors.skills}</p>
                  )}
                </div>

                {/* Certifications */}
                <div>
                  <label className="block text-sm font-medium mb-2">Certifications</label>
                  <div className="flex space-x-2 mb-3">
                    <input
                      type="text"
                      value={certificationInput}
                      onChange={(e) => setCertificationInput(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && addCertification()}
                      className="input flex-1"
                      placeholder="Add a certification and press Enter"
                    />
                    <button
                      type="button"
                      onClick={addCertification}
                      className="btn btn-outline"
                    >
                      <PlusIcon className="w-5 h-5" />
                    </button>
                  </div>
                  
                  <div className="flex flex-wrap gap-2">
                    {candidateData.certifications.map((cert, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-green-100 text-green-800"
                      >
                        {cert}
                        <button
                          onClick={() => removeCertification(cert)}
                          className="ml-2 text-green-800 hover:text-green-600"
                        >
                          <XMarkIcon className="w-4 h-4" />
                        </button>
                      </span>
                    ))}
                  </div>
                </div>

                {/* Links */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">LinkedIn URL</label>
                    <input
                      type="url"
                      value={candidateData.linkedin}
                      onChange={(e) => handleInputChange('linkedin', e.target.value)}
                      className="input w-full"
                      placeholder="https://linkedin.com/in/..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">GitHub URL</label>
                    <input
                      type="url"
                      value={candidateData.github}
                      onChange={(e) => handleInputChange('github', e.target.value)}
                      className="input w-full"
                      placeholder="https://github.com/..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Portfolio URL</label>
                    <input
                      type="url"
                      value={candidateData.portfolio}
                      onChange={(e) => handleInputChange('portfolio', e.target.value)}
                      className="input w-full"
                      placeholder="https://portfolio.com"
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Step 4: Review & Save */}
          {step === 4 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-6"
            >
              <div className="text-center mb-6">
                <CheckIcon className="w-12 h-12 text-green-600 mx-auto mb-2" />
                <h2 className="text-xl font-semibold">Review & Save</h2>
                <p className="text-muted-foreground">Review the candidate information before saving</p>
              </div>

              <div className="space-y-6">
                {/* Basic Info Summary */}
                <div className="p-4 border border-border rounded-lg">
                  <h3 className="font-semibold mb-3">Basic Information</h3>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">Name:</span>
                      <span className="ml-2 font-medium">{candidateData.firstName} {candidateData.lastName}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Email:</span>
                      <span className="ml-2 font-medium">{candidateData.email}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Phone:</span>
                      <span className="ml-2 font-medium">{candidateData.phone}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Location:</span>
                      <span className="ml-2 font-medium">{candidateData.location}</span>
                    </div>
                  </div>
                </div>

                {/* Professional Info Summary */}
                <div className="p-4 border border-border rounded-lg">
                  <h3 className="font-semibold mb-3">Professional Information</h3>
                  <div className="space-y-2 text-sm">
                    <div>
                      <span className="text-muted-foreground">Current Title:</span>
                      <span className="ml-2 font-medium">{candidateData.currentTitle}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Experience:</span>
                      <span className="ml-2 font-medium">{candidateData.experience}</span>
                    </div>
                    {candidateData.summary && (
                      <div>
                        <span className="text-muted-foreground">Summary:</span>
                        <p className="mt-1 text-foreground">{candidateData.summary}</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Skills & Certifications */}
                {(candidateData.skills.length > 0 || candidateData.certifications.length > 0) && (
                  <div className="p-4 border border-border rounded-lg">
                    <h3 className="font-semibold mb-3">Skills & Certifications</h3>
                    {candidateData.skills.length > 0 && (
                      <div className="mb-3">
                        <span className="text-muted-foreground text-sm">Skills:</span>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {candidateData.skills.map((skill, index) => (
                            <span
                              key={index}
                              className="px-2 py-1 bg-primary/10 text-primary text-xs rounded"
                            >
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                    {candidateData.certifications.length > 0 && (
                      <div>
                        <span className="text-muted-foreground text-sm">Certifications:</span>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {candidateData.certifications.map((cert, index) => (
                            <span
                              key={index}
                              className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded"
                            >
                              {cert}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Documents */}
                {candidateData.resume && (
                  <div className="p-4 border border-border rounded-lg">
                    <h3 className="font-semibold mb-3">Uploaded Documents</h3>
                    <div className="flex items-center space-x-2 text-sm">
                      <DocumentArrowUpIcon className="w-4 h-4 text-muted-foreground" />
                      <span>{candidateData.resume.name}</span>
                      <span className="text-muted-foreground">({(candidateData.resume.size / 1024).toFixed(0)} KB)</span>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {/* Action Buttons */}
          <div className="flex justify-between pt-6 border-t border-border">
            <div>
              {step > 1 && (
                <button
                  onClick={prevStep}
                  className="btn btn-outline"
                >
                  Previous
                </button>
              )}
            </div>

            <div className="flex space-x-3">
              <button
                onClick={saveDraft}
                disabled={loading}
                className="btn btn-outline"
              >
                Save Draft
              </button>
              
              {step < 4 ? (
                <button
                  onClick={nextStep}
                  className="btn btn-primary"
                >
                  Next
                </button>
              ) : (
                <button
                  onClick={submitCandidate}
                  disabled={loading}
                  className="btn btn-primary"
                >
                  {loading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                      Saving...
                    </>
                  ) : (
                    <>
                      <UserPlusIcon className="w-5 h-5" />
                      Add Candidate
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddCandidate; 