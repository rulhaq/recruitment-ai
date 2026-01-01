/**
 * This is a product of Scalovate Systems Solutions.
 * All rights reserved.
 */

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  CogIcon,
  ShieldCheckIcon,
  KeyIcon,
  ServerIcon,
  BellIcon,
  EnvelopeIcon,
  CloudIcon,
  CircleStackIcon,
  LockClosedIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  DocumentTextIcon,
  ChartBarIcon,
  ArrowPathIcon,
  EyeIcon,
  EyeSlashIcon
} from '@heroicons/react/24/outline';
import LoadingSpinner from '../components/LoadingSpinner';

const AdminSystemSettings = () => {
  const { userProfile, hasAdminAccess } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('general');
  const [showApiKey, setShowApiKey] = useState(false);
  
  // Settings state
  const [settings, setSettings] = useState({
    general: {
      siteName: 'Augmention AI',
      siteDescription: 'AI-Driven Staff Augmentation Platform',
      maintenanceMode: false,
      allowRegistration: true,
      requireEmailVerification: true,
      defaultUserRole: 'client',
      sessionTimeout: 30,
      maxLoginAttempts: 5
    },
    security: {
      twoFactorRequired: false,
      passwordMinLength: 8,
      passwordRequireSpecialChars: true,
      passwordRequireNumbers: true,
      passwordRequireUppercase: true,
      sessionSecure: true,
      ipWhitelisting: false,
      allowedIPs: '',
      apiRateLimit: 1000,
      bruteForceProtection: true
    },
    api: {
      groqApiKey: '************************************',
      firebaseConfig: '************************************',
      emailServiceKey: '************************************',
      stripeApiKey: '************************************',
      webhookSecret: '************************************',
      rateLimitPerHour: 1000,
      enableApiLogging: true,
      enableCors: true
    },
    notifications: {
      emailNotifications: true,
      smsNotifications: false,
      pushNotifications: true,
      systemAlerts: true,
      userRegistrationAlert: true,
      paymentFailureAlert: true,
      systemErrorAlert: true,
      dailyReports: true,
      weeklyReports: true
    },
    storage: {
      maxFileSize: 10,
      allowedFileTypes: 'pdf,doc,docx,jpg,jpeg,png',
      cloudProvider: 'firebase',
      enableBackups: true,
      backupFrequency: 'daily',
      retentionPeriod: 30,
      compressionEnabled: true
    },
    analytics: {
      enableTracking: true,
      googleAnalyticsId: '',
      enableHeatmaps: false,
      enableErrorTracking: true,
      dataRetention: 365,
      anonymizeIPs: true,
      cookieConsent: true
    }
  });

  const tabs = [
    { id: 'general', label: 'General', icon: CogIcon },
    { id: 'security', label: 'Security', icon: LockClosedIcon },
    { id: 'api', label: 'API & Keys', icon: KeyIcon },
    { id: 'notifications', label: 'Notifications', icon: BellIcon },
    { id: 'storage', label: 'Storage', icon: CircleStackIcon },
    { id: 'analytics', label: 'Analytics', icon: ChartBarIcon }
  ];

  // Redirect if not admin
  useEffect(() => {
    if (userProfile && !hasAdminAccess()) {
      navigate('/dashboard');
    }
  }, [userProfile, hasAdminAccess, navigate]);

  const handleSettingChange = (category, key, value) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [key]: value
      }
    }));
  };

  const saveSettings = async () => {
    try {
      setSaving(true);
      // In real app, this would be an API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock save success
      console.log('Settings saved:', settings);
    } catch (error) {
      console.error('Error saving settings:', error);
    } finally {
      setSaving(false);
    }
  };

  const testSystemHealth = async () => {
    try {
      setLoading(true);
      // Mock system health check
      await new Promise(resolve => setTimeout(resolve, 2000));
      alert('System health check completed. All services are operational.');
    } catch (error) {
      console.error('Error checking system health:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!hasAdminAccess()) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <ShieldCheckIcon className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-foreground mb-2">Access Denied</h1>
          <p className="text-muted-foreground mb-4">You don't have permission to access this area.</p>
          <Link to="/dashboard" className="btn btn-primary">
            Return to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <Link to="/admin" className="text-muted-foreground hover:text-foreground">
                <ShieldCheckIcon className="w-6 h-6" />
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-foreground">System Settings</h1>
                <p className="text-sm text-muted-foreground">
                  Configure platform settings and security
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <button
                onClick={testSystemHealth}
                disabled={loading}
                className="btn btn-outline"
              >
                {loading ? (
                  <LoadingSpinner size="sm" />
                ) : (
                  <ServerIcon className="w-4 h-4 mr-2" />
                )}
                System Health
              </button>
              <button
                onClick={saveSettings}
                disabled={saving}
                className="btn btn-primary"
              >
                {saving ? (
                  <LoadingSpinner size="sm" />
                ) : (
                  <CheckCircleIcon className="w-4 h-4 mr-2" />
                )}
                Save Changes
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar Navigation */}
          <div className="lg:col-span-1">
            <nav className="space-y-1">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center px-4 py-3 text-left rounded-lg transition-colors ${
                      activeTab === tab.id
                        ? 'bg-primary text-primary-foreground'
                        : 'text-muted-foreground hover:bg-accent hover:text-foreground'
                    }`}
                  >
                    <Icon className="w-5 h-5 mr-3" />
                    {tab.label}
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Settings Content */}
          <div className="lg:col-span-3">
            <div className="card p-6">
              {/* General Settings */}
              {activeTab === 'general' && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-6"
                >
                  <div>
                    <h2 className="text-xl font-bold text-foreground mb-4">General Settings</h2>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                          Site Name
                        </label>
                        <input
                          type="text"
                          value={settings.general.siteName}
                          onChange={(e) => handleSettingChange('general', 'siteName', e.target.value)}
                          className="input w-full"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                          Default User Role
                        </label>
                        <select
                          value={settings.general.defaultUserRole}
                          onChange={(e) => handleSettingChange('general', 'defaultUserRole', e.target.value)}
                          className="input w-full"
                        >
                          <option value="client">Client</option>
                          <option value="recruiter">Recruiter</option>
                          <option value="candidate">Candidate</option>
                        </select>
                      </div>

                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-foreground mb-2">
                          Site Description
                        </label>
                        <textarea
                          value={settings.general.siteDescription}
                          onChange={(e) => handleSettingChange('general', 'siteDescription', e.target.value)}
                          rows={3}
                          className="input w-full"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                          Session Timeout (minutes)
                        </label>
                        <input
                          type="number"
                          value={settings.general.sessionTimeout}
                          onChange={(e) => handleSettingChange('general', 'sessionTimeout', parseInt(e.target.value))}
                          className="input w-full"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                          Max Login Attempts
                        </label>
                        <input
                          type="number"
                          value={settings.general.maxLoginAttempts}
                          onChange={(e) => handleSettingChange('general', 'maxLoginAttempts', parseInt(e.target.value))}
                          className="input w-full"
                        />
                      </div>
                    </div>

                    <div className="mt-6 space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-foreground">Maintenance Mode</p>
                          <p className="text-sm text-muted-foreground">
                            Temporarily disable the site for maintenance
                          </p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={settings.general.maintenanceMode}
                            onChange={(e) => handleSettingChange('general', 'maintenanceMode', e.target.checked)}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                        </label>
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-foreground">Allow Registration</p>
                          <p className="text-sm text-muted-foreground">
                            Allow new users to register accounts
                          </p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={settings.general.allowRegistration}
                            onChange={(e) => handleSettingChange('general', 'allowRegistration', e.target.checked)}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                        </label>
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-foreground">Require Email Verification</p>
                          <p className="text-sm text-muted-foreground">
                            New users must verify their email address
                          </p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={settings.general.requireEmailVerification}
                            onChange={(e) => handleSettingChange('general', 'requireEmailVerification', e.target.checked)}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                        </label>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Security Settings */}
              {activeTab === 'security' && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-6"
                >
                  <div>
                    <h2 className="text-xl font-bold text-foreground mb-4">Security Settings</h2>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                          Password Minimum Length
                        </label>
                        <input
                          type="number"
                          value={settings.security.passwordMinLength}
                          onChange={(e) => handleSettingChange('security', 'passwordMinLength', parseInt(e.target.value))}
                          className="input w-full"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                          API Rate Limit (per hour)
                        </label>
                        <input
                          type="number"
                          value={settings.security.apiRateLimit}
                          onChange={(e) => handleSettingChange('security', 'apiRateLimit', parseInt(e.target.value))}
                          className="input w-full"
                        />
                      </div>

                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-foreground mb-2">
                          Allowed IP Addresses (comma-separated)
                        </label>
                        <textarea
                          value={settings.security.allowedIPs}
                          onChange={(e) => handleSettingChange('security', 'allowedIPs', e.target.value)}
                          placeholder="192.168.1.1, 10.0.0.1"
                          rows={2}
                          className="input w-full"
                        />
                      </div>
                    </div>

                    <div className="mt-6 space-y-4">
                      {[
                        { key: 'twoFactorRequired', label: 'Require Two-Factor Authentication', desc: 'Force all users to enable 2FA' },
                        { key: 'passwordRequireSpecialChars', label: 'Require Special Characters', desc: 'Passwords must contain special characters' },
                        { key: 'passwordRequireNumbers', label: 'Require Numbers', desc: 'Passwords must contain numbers' },
                        { key: 'passwordRequireUppercase', label: 'Require Uppercase', desc: 'Passwords must contain uppercase letters' },
                        { key: 'sessionSecure', label: 'Secure Sessions', desc: 'Use secure session cookies' },
                        { key: 'ipWhitelisting', label: 'IP Whitelisting', desc: 'Only allow access from specified IPs' },
                        { key: 'bruteForceProtection', label: 'Brute Force Protection', desc: 'Block repeated failed login attempts' }
                      ].map((setting) => (
                        <div key={setting.key} className="flex items-center justify-between">
                          <div>
                            <p className="font-medium text-foreground">{setting.label}</p>
                            <p className="text-sm text-muted-foreground">{setting.desc}</p>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              checked={settings.security[setting.key]}
                              onChange={(e) => handleSettingChange('security', setting.key, e.target.checked)}
                              className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}

              {/* API & Keys */}
              {activeTab === 'api' && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-6"
                >
                  <div>
                    <h2 className="text-xl font-bold text-foreground mb-4">API Keys & Configuration</h2>
                    
                    <div className="space-y-6">
                      {[
                        { key: 'groqApiKey', label: 'Groq API Key', desc: 'API key for AI processing' },
                        { key: 'firebaseConfig', label: 'Firebase Configuration', desc: 'Firebase project configuration' },
                        { key: 'emailServiceKey', label: 'Email Service Key', desc: 'API key for email service' },
                        { key: 'stripeApiKey', label: 'Stripe API Key', desc: 'Payment processing API key' },
                        { key: 'webhookSecret', label: 'Webhook Secret', desc: 'Secret for webhook verification' }
                      ].map((apiKey) => (
                        <div key={apiKey.key} className="border border-border rounded-lg p-4">
                          <div className="flex items-center justify-between mb-2">
                            <h3 className="font-medium text-foreground">{apiKey.label}</h3>
                            <button
                              onClick={() => setShowApiKey(!showApiKey)}
                              className="text-muted-foreground hover:text-foreground"
                            >
                              {showApiKey ? (
                                <EyeSlashIcon className="w-4 h-4" />
                              ) : (
                                <EyeIcon className="w-4 h-4" />
                              )}
                            </button>
                          </div>
                          <p className="text-sm text-muted-foreground mb-3">{apiKey.desc}</p>
                          <div className="flex space-x-2">
                            <input
                              type={showApiKey ? "text" : "password"}
                              value={settings.api[apiKey.key]}
                              onChange={(e) => handleSettingChange('api', apiKey.key, e.target.value)}
                              className="input flex-1"
                              placeholder="Enter API key..."
                            />
                            <button className="btn btn-outline">
                              Test
                            </button>
                          </div>
                        </div>
                      ))}

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-foreground mb-2">
                            Rate Limit (per hour)
                          </label>
                          <input
                            type="number"
                            value={settings.api.rateLimitPerHour}
                            onChange={(e) => handleSettingChange('api', 'rateLimitPerHour', parseInt(e.target.value))}
                            className="input w-full"
                          />
                        </div>
                      </div>

                      <div className="space-y-4">
                        {[
                          { key: 'enableApiLogging', label: 'Enable API Logging', desc: 'Log all API requests and responses' },
                          { key: 'enableCors', label: 'Enable CORS', desc: 'Allow cross-origin requests' }
                        ].map((setting) => (
                          <div key={setting.key} className="flex items-center justify-between">
                            <div>
                              <p className="font-medium text-foreground">{setting.label}</p>
                              <p className="text-sm text-muted-foreground">{setting.desc}</p>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                              <input
                                type="checkbox"
                                checked={settings.api[setting.key]}
                                onChange={(e) => handleSettingChange('api', setting.key, e.target.checked)}
                                className="sr-only peer"
                              />
                              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                            </label>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Notifications Tab */}
              {activeTab === 'notifications' && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-6"
                >
                  <div>
                    <h2 className="text-xl font-bold text-foreground mb-4">Notification Settings</h2>
                    
                    <div className="space-y-4">
                      {[
                        { key: 'emailNotifications', label: 'Email Notifications', desc: 'Send email notifications to users' },
                        { key: 'smsNotifications', label: 'SMS Notifications', desc: 'Send SMS notifications (requires SMS service)' },
                        { key: 'pushNotifications', label: 'Push Notifications', desc: 'Send browser push notifications' },
                        { key: 'systemAlerts', label: 'System Alerts', desc: 'Send alerts for system events' },
                        { key: 'userRegistrationAlert', label: 'User Registration Alerts', desc: 'Alert admins of new user registrations' },
                        { key: 'paymentFailureAlert', label: 'Payment Failure Alerts', desc: 'Alert admins of payment failures' },
                        { key: 'systemErrorAlert', label: 'System Error Alerts', desc: 'Alert admins of system errors' },
                        { key: 'dailyReports', label: 'Daily Reports', desc: 'Send daily activity reports' },
                        { key: 'weeklyReports', label: 'Weekly Reports', desc: 'Send weekly summary reports' }
                      ].map((setting) => (
                        <div key={setting.key} className="flex items-center justify-between p-4 border border-border rounded-lg">
                          <div>
                            <p className="font-medium text-foreground">{setting.label}</p>
                            <p className="text-sm text-muted-foreground">{setting.desc}</p>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              checked={settings.notifications[setting.key]}
                              onChange={(e) => handleSettingChange('notifications', setting.key, e.target.checked)}
                              className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Storage Tab */}
              {activeTab === 'storage' && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-6"
                >
                  <div>
                    <h2 className="text-xl font-bold text-foreground mb-4">Storage Settings</h2>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                          Max File Size (MB)
                        </label>
                        <input
                          type="number"
                          value={settings.storage.maxFileSize}
                          onChange={(e) => handleSettingChange('storage', 'maxFileSize', parseInt(e.target.value))}
                          className="input w-full"
                          min="1"
                          max="100"
                        />
                        <p className="text-xs text-muted-foreground mt-1">
                          Maximum file size allowed for uploads
                        </p>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                          Cloud Provider
                        </label>
                        <select
                          value={settings.storage.cloudProvider}
                          onChange={(e) => handleSettingChange('storage', 'cloudProvider', e.target.value)}
                          className="input w-full"
                        >
                          <option value="firebase">Firebase Storage</option>
                          <option value="aws">AWS S3</option>
                          <option value="azure">Azure Blob</option>
                          <option value="gcp">Google Cloud Storage</option>
                        </select>
                      </div>

                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-foreground mb-2">
                          Allowed File Types (comma-separated)
                        </label>
                        <input
                          type="text"
                          value={settings.storage.allowedFileTypes}
                          onChange={(e) => handleSettingChange('storage', 'allowedFileTypes', e.target.value)}
                          className="input w-full"
                          placeholder="pdf,doc,docx,jpg,jpeg,png"
                        />
                        <p className="text-xs text-muted-foreground mt-1">
                          File extensions allowed for upload (e.g., pdf, doc, jpg)
                        </p>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                          Backup Frequency
                        </label>
                        <select
                          value={settings.storage.backupFrequency}
                          onChange={(e) => handleSettingChange('storage', 'backupFrequency', e.target.value)}
                          className="input w-full"
                        >
                          <option value="hourly">Hourly</option>
                          <option value="daily">Daily</option>
                          <option value="weekly">Weekly</option>
                          <option value="monthly">Monthly</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                          Retention Period (days)
                        </label>
                        <input
                          type="number"
                          value={settings.storage.retentionPeriod}
                          onChange={(e) => handleSettingChange('storage', 'retentionPeriod', parseInt(e.target.value))}
                          className="input w-full"
                          min="1"
                          max="365"
                        />
                        <p className="text-xs text-muted-foreground mt-1">
                          How long to keep backups before deletion
                        </p>
                      </div>
                    </div>

                    <div className="space-y-4">
                      {[
                        { key: 'enableBackups', label: 'Enable Automatic Backups', desc: 'Automatically backup files on schedule' },
                        { key: 'compressionEnabled', label: 'Enable Compression', desc: 'Compress files before storage to save space' }
                      ].map((setting) => (
                        <div key={setting.key} className="flex items-center justify-between p-4 border border-border rounded-lg">
                          <div>
                            <p className="font-medium text-foreground">{setting.label}</p>
                            <p className="text-sm text-muted-foreground">{setting.desc}</p>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              checked={settings.storage[setting.key]}
                              onChange={(e) => handleSettingChange('storage', setting.key, e.target.checked)}
                              className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                          </label>
                        </div>
                      ))}
                    </div>

                    {/* Storage Usage Info */}
                    <div className="mt-6 card p-6 bg-accent/50">
                      <h3 className="font-semibold text-foreground mb-4">Storage Usage</h3>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <div className="flex justify-between text-sm mb-2">
                            <span className="text-muted-foreground">Total Storage</span>
                            <span className="font-medium text-foreground">2.4 GB / 10 GB</span>
                          </div>
                          <div className="w-full bg-accent rounded-full h-2">
                            <div className="bg-blue-500 h-2 rounded-full" style={{ width: '24%' }}></div>
                          </div>
                        </div>
                        <div>
                          <div className="flex justify-between text-sm mb-2">
                            <span className="text-muted-foreground">Files</span>
                            <span className="font-medium text-foreground">1,234</span>
                          </div>
                        </div>
                        <div>
                          <div className="flex justify-between text-sm mb-2">
                            <span className="text-muted-foreground">Backups</span>
                            <span className="font-medium text-foreground">45</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Analytics Tab */}
              {activeTab === 'analytics' && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-6"
                >
                  <div>
                    <h2 className="text-xl font-bold text-foreground mb-4">Analytics Settings</h2>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-foreground mb-2">
                          Google Analytics ID
                        </label>
                        <input
                          type="text"
                          value={settings.analytics.googleAnalyticsId}
                          onChange={(e) => handleSettingChange('analytics', 'googleAnalyticsId', e.target.value)}
                          className="input w-full"
                          placeholder="G-XXXXXXXXXX"
                        />
                        <p className="text-xs text-muted-foreground mt-1">
                          Your Google Analytics tracking ID (e.g., G-XXXXXXXXXX)
                        </p>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                          Data Retention (days)
                        </label>
                        <input
                          type="number"
                          value={settings.analytics.dataRetention}
                          onChange={(e) => handleSettingChange('analytics', 'dataRetention', parseInt(e.target.value))}
                          className="input w-full"
                          min="30"
                          max="3650"
                        />
                        <p className="text-xs text-muted-foreground mt-1">
                          How long to keep analytics data
                        </p>
                      </div>
                    </div>

                    <div className="space-y-4">
                      {[
                        { key: 'enableTracking', label: 'Enable Analytics Tracking', desc: 'Track user behavior and site usage' },
                        { key: 'enableHeatmaps', label: 'Enable Heatmaps', desc: 'Track user clicks and mouse movements' },
                        { key: 'enableErrorTracking', label: 'Enable Error Tracking', desc: 'Track JavaScript errors and exceptions' },
                        { key: 'anonymizeIPs', label: 'Anonymize IP Addresses', desc: 'Protect user privacy by anonymizing IPs' },
                        { key: 'cookieConsent', label: 'Require Cookie Consent', desc: 'Show cookie consent banner to users' }
                      ].map((setting) => (
                        <div key={setting.key} className="flex items-center justify-between p-4 border border-border rounded-lg">
                          <div>
                            <p className="font-medium text-foreground">{setting.label}</p>
                            <p className="text-sm text-muted-foreground">{setting.desc}</p>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              checked={settings.analytics[setting.key]}
                              onChange={(e) => handleSettingChange('analytics', setting.key, e.target.checked)}
                              className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                          </label>
                        </div>
                      ))}
                    </div>

                    {/* Analytics Summary */}
                    <div className="mt-6 card p-6 bg-accent/50">
                      <h3 className="font-semibold text-foreground mb-4">Analytics Summary</h3>
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div>
                          <div className="text-2xl font-bold text-foreground">12,456</div>
                          <div className="text-sm text-muted-foreground">Total Visitors</div>
                        </div>
                        <div>
                          <div className="text-2xl font-bold text-foreground">8,234</div>
                          <div className="text-sm text-muted-foreground">Unique Visitors</div>
                        </div>
                        <div>
                          <div className="text-2xl font-bold text-foreground">2.4m</div>
                          <div className="text-sm text-muted-foreground">Avg. Session</div>
                        </div>
                        <div>
                          <div className="text-2xl font-bold text-foreground">68%</div>
                          <div className="text-sm text-muted-foreground">Bounce Rate</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminSystemSettings; 