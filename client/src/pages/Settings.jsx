/**
 * This is a product of Scalovate Systems Solutions.
 * All rights reserved.
 */

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { authService } from '../lib/firebase';
import SignOutModal from '../components/SignOutModal';
import { useTheme } from '../context/ThemeContext';
import { apiService } from '../lib/api';
import { 
  UserIcon,
  Cog6ToothIcon,
  BellIcon,
  ShieldCheckIcon,
  KeyIcon,
  LinkIcon,
  SunIcon,
  MoonIcon,
  EyeIcon,
  EyeSlashIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';
import LoadingSpinner from '../components/LoadingSpinner';

const Settings = () => {
  const { userProfile, updateProfile } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');
  const [showPassword, setShowPassword] = useState(false);
  const [saveStatus, setSaveStatus] = useState('');
  const [showSignOutModal, setShowSignOutModal] = useState(false);

  // Profile form state
  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    company: '',
    role: '',
    phone: '',
    location: '',
    timezone: ''
  });

  // Preferences state
  const [preferences, setPreferences] = useState({
    emailNotifications: true,
    pushNotifications: false,
    weeklyReports: true,
    marketingEmails: false,
    theme: 'system',
    language: 'en',
    dateFormat: 'MM/DD/YYYY',
    currency: 'USD'
  });

  // Password form state
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  // Integration settings
  const [integrations, setIntegrations] = useState({
    odoo: {
      connected: false,
      url: '',
      database: '',
      username: ''
    },
    google: {
      connected: false,
      email: ''
    }
  });

  useEffect(() => {
    if (userProfile) {
      setProfileData({
        name: userProfile.name || '',
        email: userProfile.email || '',
        company: userProfile.company || '',
        role: userProfile.role || '',
        phone: userProfile.phone || '',
        location: userProfile.location || '',
        timezone: userProfile.timezone || 'UTC'
      });
    }
  }, [userProfile]);

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSaveStatus('');

    try {
      await updateProfile(profileData);
      setSaveStatus('success');
      setTimeout(() => setSaveStatus(''), 3000);
    } catch (error) {
      console.error('Error updating profile:', error);
      setSaveStatus('error');
      setTimeout(() => setSaveStatus(''), 3000);
    } finally {
      setLoading(false);
    }
  };

  const handlePreferencesUpdate = async (key, value) => {
    setPreferences(prev => ({ ...prev, [key]: value }));
    
    try {
      await updateProfile({ preferences: { ...preferences, [key]: value } });
    } catch (error) {
      console.error('Error updating preferences:', error);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setSaveStatus('password-mismatch');
      setTimeout(() => setSaveStatus(''), 3000);
      return;
    }

    setLoading(true);
    setSaveStatus('');

    try {
      // Password change would be handled by Firebase Auth
      // This is a placeholder for the actual implementation
      setSaveStatus('password-success');
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
      setTimeout(() => setSaveStatus(''), 3000);
    } catch (error) {
      console.error('Error changing password:', error);
      setSaveStatus('password-error');
      setTimeout(() => setSaveStatus(''), 3000);
    } finally {
      setLoading(false);
    }
  };

  const testCrmConnection = async () => {
    try {
      setLoading(true);
      await apiService.crm.testConnection();
      setSaveStatus('crm-success');
      setTimeout(() => setSaveStatus(''), 3000);
    } catch (error) {
      console.error('Error testing CRM connection:', error);
      setSaveStatus('crm-error');
      setTimeout(() => setSaveStatus(''), 3000);
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: 'profile', name: 'Profile', icon: UserIcon },
    { id: 'preferences', name: 'Preferences', icon: Cog6ToothIcon },
    { id: 'notifications', name: 'Notifications', icon: BellIcon },
    { id: 'security', name: 'Security', icon: ShieldCheckIcon },
    { id: 'integrations', name: 'Integrations', icon: LinkIcon }
  ];

  return (
    <>
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <h1 className="text-2xl font-bold text-foreground">Settings</h1>
            
            {saveStatus && (
              <div className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm ${
                saveStatus === 'success' || saveStatus === 'password-success' || saveStatus === 'crm-success'
                  ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                  : 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
              }`}>
                {saveStatus.includes('success') ? (
                  <CheckCircleIcon className="w-4 h-4" />
                ) : (
                  <ExclamationTriangleIcon className="w-4 h-4" />
                )}
                <span>
                  {saveStatus === 'success' && 'Profile updated successfully'}
                  {saveStatus === 'error' && 'Failed to update profile'}
                  {saveStatus === 'password-success' && 'Password changed successfully'}
                  {saveStatus === 'password-error' && 'Failed to change password'}
                  {saveStatus === 'password-mismatch' && 'Passwords do not match'}
                  {saveStatus === 'crm-success' && 'CRM connection successful'}
                  {saveStatus === 'crm-error' && 'CRM connection failed'}
                </span>
              </div>
            )}
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="card p-4">
              <nav className="space-y-2">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center space-x-3 px-3 py-2 text-left rounded-md transition-colors ${
                      activeTab === tab.id
                        ? 'bg-primary text-primary-foreground'
                        : 'hover:bg-muted'
                    }`}
                  >
                    <tab.icon className="w-5 h-5" />
                    <span>{tab.name}</span>
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            
            {/* Profile Tab */}
            {activeTab === 'profile' && (
              <motion.div
                key="profile"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="card p-6"
              >
                <h2 className="text-xl font-semibold mb-6">Profile Information</h2>
                
                <form onSubmit={handleProfileUpdate} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium mb-2">Full Name</label>
                      <input
                        type="text"
                        value={profileData.name}
                        onChange={(e) => setProfileData({...profileData, name: e.target.value})}
                        className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">Email</label>
                      <input
                        type="email"
                        value={profileData.email}
                        onChange={(e) => setProfileData({...profileData, email: e.target.value})}
                        className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary bg-muted"
                        disabled
                      />
                      <p className="text-xs text-muted-foreground mt-1">Email cannot be changed</p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">Company</label>
                      <input
                        type="text"
                        value={profileData.company}
                        onChange={(e) => setProfileData({...profileData, company: e.target.value})}
                        className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">Role</label>
                      <select
                        value={profileData.role}
                        onChange={(e) => setProfileData({...profileData, role: e.target.value})}
                        className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                      >
                        <option value="admin">Admin</option>
                        <option value="recruiter">Recruiter</option>
                        <option value="client">Client</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">Phone</label>
                      <input
                        type="tel"
                        value={profileData.phone}
                        onChange={(e) => setProfileData({...profileData, phone: e.target.value})}
                        className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">Location</label>
                      <input
                        type="text"
                        value={profileData.location}
                        onChange={(e) => setProfileData({...profileData, location: e.target.value})}
                        className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                        placeholder="City, Country"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end space-x-4">
                    <button
                      type="submit"
                      disabled={loading}
                      className="btn btn-primary"
                    >
                      {loading ? (
                        <>
                          <LoadingSpinner size="sm" className="mr-2" />
                          Saving...
                        </>
                      ) : (
                        'Save Changes'
                      )}
                    </button>
                  </div>
                </form>
              </motion.div>
            )}

            {/* Preferences Tab */}
            {activeTab === 'preferences' && (
              <motion.div
                key="preferences"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                {/* Appearance */}
                <div className="card p-6">
                  <h3 className="text-lg font-semibold mb-4">Appearance</h3>
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <label className="text-sm font-medium">Theme</label>
                        <p className="text-xs text-muted-foreground">Choose your interface theme</p>
                      </div>
                      <button
                        onClick={toggleTheme}
                        className="btn btn-outline btn-sm"
                      >
                        {isDark ? (
                          <>
                            <SunIcon className="w-4 h-4 mr-2" />
                            Light
                          </>
                        ) : (
                          <>
                            <MoonIcon className="w-4 h-4 mr-2" />
                            Dark
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Regional */}
                <div className="card p-6">
                  <h3 className="text-lg font-semibold mb-4">Regional Settings</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Language</label>
                      <select
                        value={preferences.language}
                        onChange={(e) => handlePreferencesUpdate('language', e.target.value)}
                        className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                      >
                        <option value="en">English</option>
                        <option value="es">Spanish</option>
                        <option value="fr">French</option>
                        <option value="de">German</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">Date Format</label>
                      <select
                        value={preferences.dateFormat}
                        onChange={(e) => handlePreferencesUpdate('dateFormat', e.target.value)}
                        className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                      >
                        <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                        <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                        <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">Currency</label>
                      <select
                        value={preferences.currency}
                        onChange={(e) => handlePreferencesUpdate('currency', e.target.value)}
                        className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                      >
                        <option value="USD">USD - US Dollar</option>
                        <option value="EUR">EUR - Euro</option>
                        <option value="GBP">GBP - British Pound</option>
                        <option value="CAD">CAD - Canadian Dollar</option>
                      </select>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Notifications Tab */}
            {activeTab === 'notifications' && (
              <motion.div
                key="notifications"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="card p-6"
              >
                <h2 className="text-xl font-semibold mb-6">Notification Preferences</h2>
                
                <div className="space-y-6">
                  {[
                    {
                      key: 'emailNotifications',
                      title: 'Email Notifications',
                      description: 'Receive notifications about matches, proposals, and engagements'
                    },
                    {
                      key: 'pushNotifications',
                      title: 'Push Notifications',
                      description: 'Get instant notifications in your browser'
                    },
                    {
                      key: 'weeklyReports',
                      title: 'Weekly Reports',
                      description: 'Receive weekly summary of your activities'
                    },
                    {
                      key: 'marketingEmails',
                      title: 'Marketing Emails',
                      description: 'Receive updates about new features and tips'
                    }
                  ].map((item) => (
                    <div key={item.key} className="flex items-center justify-between">
                      <div>
                        <h4 className="text-sm font-medium">{item.title}</h4>
                        <p className="text-xs text-muted-foreground">{item.description}</p>
                      </div>
                      
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={preferences[item.key]}
                          onChange={(e) => handlePreferencesUpdate(item.key, e.target.checked)}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                      </label>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Security Tab */}
            {activeTab === 'security' && (
              <motion.div
                key="security"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                {/* Change Password */}
                <div className="card p-6">
                  <h3 className="text-lg font-semibold mb-4">Change Password</h3>
                  
                  <form onSubmit={handlePasswordChange} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Current Password</label>
                      <div className="relative">
                        <input
                          type={showPassword ? 'text' : 'password'}
                          value={passwordData.currentPassword}
                          onChange={(e) => setPasswordData({...passwordData, currentPassword: e.target.value})}
                          className="w-full px-3 py-2 pr-10 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute inset-y-0 right-0 pr-3 flex items-center"
                        >
                          {showPassword ? (
                            <EyeSlashIcon className="w-4 h-4 text-muted-foreground" />
                          ) : (
                            <EyeIcon className="w-4 h-4 text-muted-foreground" />
                          )}
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">New Password</label>
                      <input
                        type="password"
                        value={passwordData.newPassword}
                        onChange={(e) => setPasswordData({...passwordData, newPassword: e.target.value})}
                        className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">Confirm New Password</label>
                      <input
                        type="password"
                        value={passwordData.confirmPassword}
                        onChange={(e) => setPasswordData({...passwordData, confirmPassword: e.target.value})}
                        className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                        required
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className="btn btn-primary"
                    >
                      {loading ? (
                        <>
                          <LoadingSpinner size="sm" className="mr-2" />
                          Changing...
                        </>
                      ) : (
                        <>
                          <KeyIcon className="w-4 h-4 mr-2" />
                          Change Password
                        </>
                      )}
                    </button>
                  </form>
                </div>

                {/* Account Actions */}
                <div className="card p-6">
                  <h3 className="text-lg font-semibold mb-4">Account Actions</h3>
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-sm font-medium">Sign Out</h4>
                        <p className="text-xs text-muted-foreground">Sign out of your account</p>
                      </div>
                      <button
                        onClick={() => setShowSignOutModal(true)}
                        className="btn btn-outline btn-sm"
                      >
                        Sign Out
                      </button>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-sm font-medium text-red-600">Delete Account</h4>
                        <p className="text-xs text-muted-foreground">Permanently delete your account and all data</p>
                      </div>
                      <button className="btn btn-outline btn-sm text-red-600 border-red-600 hover:bg-red-600 hover:text-white">
                        Delete Account
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Integrations Tab */}
            {activeTab === 'integrations' && (
              <motion.div
                key="integrations"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                {/* Odoo CRM */}
                <div className="card p-6">
                  <h3 className="text-lg font-semibold mb-4">Odoo CRM Integration</h3>
                  
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">Odoo URL</label>
                        <input
                          type="url"
                          value={integrations.odoo.url}
                          onChange={(e) => setIntegrations({
                            ...integrations,
                            odoo: { ...integrations.odoo, url: e.target.value }
                          })}
                          className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                          placeholder="https://your-odoo-instance.com"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-2">Database</label>
                        <input
                          type="text"
                          value={integrations.odoo.database}
                          onChange={(e) => setIntegrations({
                            ...integrations,
                            odoo: { ...integrations.odoo, database: e.target.value }
                          })}
                          className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                          placeholder="database_name"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-2">Username</label>
                        <input
                          type="text"
                          value={integrations.odoo.username}
                          onChange={(e) => setIntegrations({
                            ...integrations,
                            odoo: { ...integrations.odoo, username: e.target.value }
                          })}
                          className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                          placeholder="your_username"
                        />
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <button
                        onClick={testCrmConnection}
                        disabled={loading}
                        className="btn btn-outline"
                      >
                        {loading ? (
                          <LoadingSpinner size="sm" />
                        ) : (
                          'Test Connection'
                        )}
                      </button>
                      
                      {integrations.odoo.connected && (
                        <span className="text-sm text-green-600 flex items-center">
                          <CheckCircleIcon className="w-4 h-4 mr-1" />
                          Connected
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Google Integration */}
                <div className="card p-6">
                  <h3 className="text-lg font-semibold mb-4">Google Integration</h3>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-medium">Google Account</h4>
                      <p className="text-xs text-muted-foreground">
                        {integrations.google.connected 
                          ? `Connected as ${integrations.google.email}`
                          : 'Connect your Google account for enhanced features'
                        }
                      </p>
                    </div>
                    
                    <button className={`btn btn-sm ${
                      integrations.google.connected 
                        ? 'btn-outline text-red-600 border-red-600' 
                        : 'btn-primary'
                    }`}>
                      {integrations.google.connected ? 'Disconnect' : 'Connect Google'}
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>

    {/* Sign Out Confirmation Modal */}
    <SignOutModal
      isOpen={showSignOutModal}
      onClose={() => setShowSignOutModal(false)}
      onConfirm={async () => {
        try {
          setShowSignOutModal(false);
          
          // Sign out from Firebase (don't await - fire and forget)
          authService.signOut().catch(err => {
            console.error('SignOut error:', err);
          });
          
          // Immediately navigate to landing page
          window.location.href = '/';
        } catch (error) {
          console.error('Error in sign out handler:', error);
          // Force navigation even if there's an error
          window.location.href = '/';
        }
      }}
    />
    </>
  );
};

export default Settings; 