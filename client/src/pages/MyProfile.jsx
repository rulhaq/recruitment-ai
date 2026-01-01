/**
 * This is a product of Scalovate Systems Solutions.
 * All rights reserved.
 */

import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import {
  UserCircleIcon,
  DocumentArrowUpIcon,
  DocumentTextIcon,
  SparklesIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  ArrowDownTrayIcon,
  EyeIcon,
  PencilIcon,
  MapPinIcon,
  PhoneIcon,
  EnvelopeIcon,
  BriefcaseIcon,
  AcademicCapIcon
} from '@heroicons/react/24/outline';
import LoadingSpinner from '../components/LoadingSpinner';

const MyProfile = () => {
  const { user, userProfile, updateProfile } = useAuth();
  const [loading, setLoading] = useState(false);
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

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await updateProfile(profileData);
      alert('Profile updated successfully!');
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handleCvUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setCvFile(file);
      // Simulate CV text extraction
      const reader = new FileReader();
      reader.onload = (e) => {
        setCvText(e.target.result);
      };
      reader.readAsText(file);
    }
  };

  const analyzeCV = async () => {
    if (!cvText) {
      alert('Please upload your CV first');
      return;
    }

    setLoading(true);
    try {
      // Simulate AI analysis
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const analysis = {
        atsScore: 85,
        strengths: [
          'Clear contact information',
          'Well-structured work experience',
          'Relevant technical skills listed',
          'Educational background clearly stated'
        ],
        improvements: [
          'Add more industry-specific keywords',
          'Include quantifiable achievements',
          'Optimize section headers for ATS parsing',
          'Add professional certifications section'
        ],
        keywords: ['JavaScript', 'React', 'Node.js', 'AWS', 'Agile', 'Team Leadership'],
        missingKeywords: ['TypeScript', 'Docker', 'Kubernetes', 'CI/CD', 'Microservices']
      };
      
      setAiAnalysis(analysis);
    } catch (error) {
      console.error('Error analyzing CV:', error);
      alert('Failed to analyze CV');
    } finally {
      setLoading(false);
    }
  };

  const optimizeForJob = async () => {
    if (!cvText || !jobDescription) {
      alert('Please upload your CV and enter job description');
      return;
    }

    setLoading(true);
    try {
      // Simulate AI optimization
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      const optimized = `${profileData.firstName} ${profileData.lastName}
Email: ${profileData.email} | Phone: ${profileData.phone} | Location: ${profileData.location}

PROFESSIONAL SUMMARY
${profileData.summary || 'Experienced software developer with expertise in modern web technologies and agile methodologies.'}

TECHNICAL SKILLS
• Programming Languages: JavaScript, TypeScript, Python, Java
• Frontend: React, Vue.js, Angular, HTML5, CSS3
• Backend: Node.js, Express.js, RESTful APIs, Microservices
• Cloud & DevOps: AWS, Docker, Kubernetes, CI/CD pipelines
• Databases: MongoDB, PostgreSQL, Redis
• Tools: Git, Jira, Confluence, Agile/Scrum

PROFESSIONAL EXPERIENCE
${profileData.experience || 'Senior Software Developer | Tech Company | 2020-Present\n• Led development of scalable web applications serving 100K+ users\n• Implemented microservices architecture reducing system latency by 40%\n• Mentored junior developers and conducted code reviews'}

EDUCATION
${profileData.education || 'Bachelor of Science in Computer Science | University Name | 2018'}

CERTIFICATIONS
${profileData.certifications || '• AWS Certified Solutions Architect\n• Scrum Master Certification'}`;

      setOptimizedCv(optimized);
    } catch (error) {
      console.error('Error optimizing CV:', error);
      alert('Failed to optimize CV');
    } finally {
      setLoading(false);
    }
  };

  const downloadOptimizedCV = () => {
    if (!optimizedCv) return;
    
    const blob = new Blob([optimizedCv], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${profileData.firstName}_${profileData.lastName}_Optimized_CV.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const tabs = [
    { id: 'profile', name: 'Personal Info', icon: UserCircleIcon },
    { id: 'cv', name: 'CV Manager', icon: DocumentTextIcon },
    { id: 'ai-tools', name: 'AI Tools', icon: SparklesIcon }
  ];

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">My Profile</h1>
          <p className="text-muted-foreground">Manage your profile and optimize your CV with AI</p>
        </div>

        {/* Tabs */}
        <div className="border-b border-border mb-8">
          <nav className="-mb-px flex space-x-8">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center px-1 py-4 border-b-2 font-medium text-sm ${
                    activeTab === tab.id
                      ? 'border-primary text-primary'
                      : 'border-transparent text-muted-foreground hover:text-foreground hover:border-border'
                  }`}
                >
                  <Icon className="w-5 h-5 mr-2" />
                  {tab.name}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Profile Tab */}
        {activeTab === 'profile' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="card p-6"
          >
            <h2 className="text-2xl font-semibold mb-6">Personal Information</h2>
            
            <form onSubmit={handleProfileUpdate} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium mb-2">First Name</label>
                  <input
                    type="text"
                    value={profileData.firstName}
                    onChange={(e) => setProfileData({...profileData, firstName: e.target.value})}
                    className="input"
                    placeholder="Enter your first name"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Last Name</label>
                  <input
                    type="text"
                    value={profileData.lastName}
                    onChange={(e) => setProfileData({...profileData, lastName: e.target.value})}
                    className="input"
                    placeholder="Enter your last name"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Email</label>
                  <div className="relative">
                    <EnvelopeIcon className="absolute left-3 top-3 w-5 h-5 text-muted-foreground" />
                    <input
                      type="email"
                      value={profileData.email}
                      onChange={(e) => setProfileData({...profileData, email: e.target.value})}
                      className="input pl-10"
                      placeholder="your.email@example.com"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Phone</label>
                  <div className="relative">
                    <PhoneIcon className="absolute left-3 top-3 w-5 h-5 text-muted-foreground" />
                    <input
                      type="tel"
                      value={profileData.phone}
                      onChange={(e) => setProfileData({...profileData, phone: e.target.value})}
                      className="input pl-10"
                      placeholder="+1 (555) 123-4567"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Location</label>
                  <div className="relative">
                    <MapPinIcon className="absolute left-3 top-3 w-5 h-5 text-muted-foreground" />
                    <input
                      type="text"
                      value={profileData.location}
                      onChange={(e) => setProfileData({...profileData, location: e.target.value})}
                      className="input pl-10"
                      placeholder="City, State/Country"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Professional Title</label>
                  <div className="relative">
                    <BriefcaseIcon className="absolute left-3 top-3 w-5 h-5 text-muted-foreground" />
                    <input
                      type="text"
                      value={profileData.title}
                      onChange={(e) => setProfileData({...profileData, title: e.target.value})}
                      className="input pl-10"
                      placeholder="e.g., Senior Software Developer"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Professional Summary</label>
                <textarea
                  value={profileData.summary}
                  onChange={(e) => setProfileData({...profileData, summary: e.target.value})}
                  className="input min-h-24"
                  rows={4}
                  placeholder="Brief overview of your professional background and key strengths..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Experience</label>
                <textarea
                  value={profileData.experience}
                  onChange={(e) => setProfileData({...profileData, experience: e.target.value})}
                  className="input min-h-32"
                  rows={6}
                  placeholder="List your work experience, including job titles, companies, dates, and key achievements..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Education</label>
                <textarea
                  value={profileData.education}
                  onChange={(e) => setProfileData({...profileData, education: e.target.value})}
                  className="input min-h-24"
                  rows={4}
                  placeholder="Your educational background including degrees, institutions, and graduation dates..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Skills</label>
                <textarea
                  value={profileData.skills}
                  onChange={(e) => setProfileData({...profileData, skills: e.target.value})}
                  className="input min-h-24"
                  rows={4}
                  placeholder="List your technical and professional skills, separated by commas..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Certifications</label>
                <textarea
                  value={profileData.certifications}
                  onChange={(e) => setProfileData({...profileData, certifications: e.target.value})}
                  className="input min-h-20"
                  rows={3}
                  placeholder="List your professional certifications..."
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn btn-primary"
              >
                {loading ? <LoadingSpinner size="sm" /> : 'Update Profile'}
              </button>
            </form>
          </motion.div>
        )}

        {/* CV Manager Tab */}
        {activeTab === 'cv' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            {/* CV Upload */}
            <div className="card p-6">
              <h2 className="text-2xl font-semibold mb-4">CV Upload & Management</h2>
              
              <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
                <DocumentArrowUpIcon className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">Upload Your CV</h3>
                <p className="text-muted-foreground mb-4">
                  Support for PDF, DOC, DOCX, and TXT files
                </p>
                
                <input
                  ref={fileInputRef}
                  type="file"
                  onChange={handleCvUpload}
                  accept=".pdf,.doc,.docx,.txt"
                  className="hidden"
                />
                
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="btn btn-primary"
                >
                  Choose File
                </button>
                
                {cvFile && (
                  <div className="mt-4 text-sm text-foreground">
                    Selected: {cvFile.name}
                  </div>
                )}
              </div>
            </div>

            {/* CV Preview */}
            {cvText && (
              <div className="card p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">CV Preview</h3>
                  <div className="flex space-x-2">
                    <button className="btn btn-outline btn-sm">
                      <EyeIcon className="w-4 h-4 mr-2" />
                      View Full
                    </button>
                    <button className="btn btn-outline btn-sm">
                      <PencilIcon className="w-4 h-4 mr-2" />
                      Edit
                    </button>
                  </div>
                </div>
                
                <div className="bg-muted/30 p-4 rounded-md max-h-64 overflow-y-auto">
                  <pre className="text-sm whitespace-pre-wrap">{cvText.slice(0, 500)}...</pre>
                </div>
              </div>
            )}
          </motion.div>
        )}

        {/* AI Tools Tab */}
        {activeTab === 'ai-tools' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            {/* ATS Analysis */}
            <div className="card p-6">
              <h2 className="text-2xl font-semibold mb-4">ATS Readiness Analysis</h2>
              
              <button
                onClick={analyzeCV}
                disabled={loading || !cvText}
                className="btn btn-primary mb-6"
              >
                {loading ? <LoadingSpinner size="sm" /> : (
                  <>
                    <SparklesIcon className="w-4 h-4 mr-2" />
                    Analyze My CV
                  </>
                )}
              </button>

              {aiAnalysis && (
                <div className="space-y-4">
                  <div className="flex items-center space-x-4">
                    <div className="text-3xl font-bold text-primary">{aiAnalysis.atsScore}%</div>
                    <div>
                      <div className="font-semibold">ATS Compatibility Score</div>
                      <div className="text-sm text-muted-foreground">
                        {aiAnalysis.atsScore >= 80 ? 'Excellent' : aiAnalysis.atsScore >= 60 ? 'Good' : 'Needs Improvement'}
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold text-green-600 mb-2 flex items-center">
                        <CheckCircleIcon className="w-5 h-5 mr-2" />
                        Strengths
                      </h4>
                      <ul className="space-y-1 text-sm">
                        {aiAnalysis.strengths.map((strength, index) => (
                          <li key={index} className="flex items-start">
                            <span className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2 mr-2 flex-shrink-0"></span>
                            {strength}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <h4 className="font-semibold text-orange-600 mb-2 flex items-center">
                        <ExclamationTriangleIcon className="w-5 h-5 mr-2" />
                        Areas for Improvement
                      </h4>
                      <ul className="space-y-1 text-sm">
                        {aiAnalysis.improvements.map((improvement, index) => (
                          <li key={index} className="flex items-start">
                            <span className="w-1.5 h-1.5 bg-orange-500 rounded-full mt-2 mr-2 flex-shrink-0"></span>
                            {improvement}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Job-Specific Optimization */}
            <div className="card p-6">
              <h2 className="text-2xl font-semibold mb-4">Job-Specific CV Optimization</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Job Description</label>
                  <textarea
                    value={jobDescription}
                    onChange={(e) => setJobDescription(e.target.value)}
                    className="input min-h-32"
                    rows={6}
                    placeholder="Paste the job description here to get AI recommendations for optimizing your CV..."
                  />
                </div>

                <button
                  onClick={optimizeForJob}
                  disabled={loading || !cvText || !jobDescription}
                  className="btn btn-primary"
                >
                  {loading ? <LoadingSpinner size="sm" /> : (
                    <>
                      <SparklesIcon className="w-4 h-4 mr-2" />
                      Optimize CV for This Job
                    </>
                  )}
                </button>

                {optimizedCv && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold">Optimized CV</h3>
                      <button
                        onClick={downloadOptimizedCV}
                        className="btn btn-outline btn-sm"
                      >
                        <ArrowDownTrayIcon className="w-4 h-4 mr-2" />
                        Download TXT
                      </button>
                    </div>
                    
                    <div className="bg-muted/30 p-4 rounded-md max-h-96 overflow-y-auto">
                      <pre className="text-sm whitespace-pre-wrap">{optimizedCv}</pre>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default MyProfile; 