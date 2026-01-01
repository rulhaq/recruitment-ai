/**
 * This is a product of Scalovate Systems Solutions.
 * All rights reserved.
 */

import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  UserGroupIcon,
  ShieldCheckIcon,
  BriefcaseIcon,
  UserIcon,
  AcademicCapIcon,
  EyeIcon,
  EyeSlashIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  PlayIcon
} from '@heroicons/react/24/outline';
import { setupTestAccounts, getTestAccountsInfo } from '../utils/setupTestAccounts';
import LoadingSpinner from './LoadingSpinner';

const TestAccountSetup = ({ isOpen, onClose }) => {
  const [isSettingUp, setIsSettingUp] = useState(false);
  const [setupResults, setSetupResults] = useState(null);
  const [showPasswords, setShowPasswords] = useState(false);

  const testAccountsInfo = getTestAccountsInfo();

  const handleSetupAccounts = async () => {
    setIsSettingUp(true);
    try {
      const results = await setupTestAccounts();
      setSetupResults(results);
    } catch (error) {
      console.error('Setup failed:', error);
      setSetupResults([{ status: 'failed', error: error.message }]);
    } finally {
      setIsSettingUp(false);
    }
  };

  const getRoleIcon = (role) => {
    switch (role.toLowerCase()) {
      case 'super admin':
        return <ShieldCheckIcon className="w-5 h-5" />;
      case 'recruiter/consultant':
        return <BriefcaseIcon className="w-5 h-5" />;
      case 'client':
        return <UserGroupIcon className="w-5 h-5" />;
      case 'candidate':
        return <AcademicCapIcon className="w-5 h-5" />;
      default:
        return <UserIcon className="w-5 h-5" />;
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'created':
        return <CheckCircleIcon className="w-5 h-5 text-green-500" />;
      case 'already_exists':
        return <ExclamationTriangleIcon className="w-5 h-5 text-yellow-500" />;
      case 'failed':
        return <ExclamationTriangleIcon className="w-5 h-5 text-red-500" />;
      default:
        return null;
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-card rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto"
      >
        {/* Header */}
        <div className="sticky top-0 bg-card border-b border-border p-6 rounded-t-lg">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-foreground">Test Account Setup</h2>
              <p className="text-muted-foreground mt-1">Initialize test accounts for Cartafella platform</p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-accent rounded-lg transition-colors"
            >
              <span className="sr-only">Close</span>
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <div className="p-6">
          {/* Test Accounts Table */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-foreground">Available Test Accounts</h3>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setShowPasswords(!showPasswords)}
                  className="btn btn-outline btn-sm flex items-center space-x-2"
                >
                  {showPasswords ? <EyeSlashIcon className="w-4 h-4" /> : <EyeIcon className="w-4 h-4" />}
                  <span>{showPasswords ? 'Hide' : 'Show'} Passwords</span>
                </button>
                <button
                  onClick={handleSetupAccounts}
                  disabled={isSettingUp}
                  className="btn btn-primary btn-sm flex items-center space-x-2"
                >
                  {isSettingUp ? (
                    <LoadingSpinner size="sm" />
                  ) : (
                    <PlayIcon className="w-4 h-4" />
                  )}
                  <span>{isSettingUp ? 'Setting Up...' : 'Setup Accounts'}</span>
                </button>
              </div>
            </div>

            <div className="card overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-accent">
                    <tr>
                      <th className="px-4 py-3 text-left text-sm font-medium text-foreground">Role</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-foreground">Email</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-foreground">Password</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-foreground">Access Level</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {testAccountsInfo.accounts.map((account, index) => (
                      <tr key={index} className="hover:bg-accent/50">
                        <td className="px-4 py-3">
                          <div className={`flex items-center space-x-2 ${account.color}`}>
                            {getRoleIcon(account.role)}
                            <span className="font-medium">{account.role}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <code className="bg-accent px-2 py-1 rounded text-sm">{account.email}</code>
                        </td>
                        <td className="px-4 py-3">
                          <code className="bg-accent px-2 py-1 rounded text-sm">
                            {showPasswords ? account.password : '••••••••'}
                          </code>
                        </td>
                        <td className="px-4 py-3">
                          <span className="text-sm text-muted-foreground">{account.access}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Setup Results */}
          {setupResults && (
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-foreground mb-4">Setup Results</h3>
              <div className="card">
                <div className="p-4">
                  <div className="space-y-3">
                    {setupResults.map((result, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-accent rounded-lg">
                        <div className="flex items-center space-x-3">
                          {getStatusIcon(result.status)}
                          <div>
                            <p className="font-medium text-foreground">{result.email}</p>
                            <p className="text-sm text-muted-foreground">
                              {result.role} • {result.status.replace('_', ' ')}
                            </p>
                          </div>
                        </div>
                        {result.error && (
                          <span className="text-sm text-red-600">{result.error}</span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Important Notes */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-foreground mb-4">Important Notes</h3>
            <div className="card">
              <div className="p-4">
                <ul className="space-y-2">
                  {testAccountsInfo.notes.map((note, index) => (
                    <li key={index} className="flex items-start space-x-2">
                      <span className="text-primary mt-1">•</span>
                      <span className="text-muted-foreground">{note}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Domain Configuration */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-foreground mb-4">Domain Configuration</h3>
            <div className="card">
              <div className="p-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium text-foreground mb-2">Company Domains (Admin/Recruiter)</h4>
                    <ul className="space-y-1">
                      <li><code className="bg-accent px-2 py-1 rounded text-sm">@recruitmentai.com</code></li>
                      <li><code className="bg-accent px-2 py-1 rounded text-sm">@admin.recruitmentai.com</code></li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-medium text-foreground mb-2">Personal Domains (Client/Candidate)</h4>
                    <ul className="space-y-1">
                      <li><code className="bg-accent px-2 py-1 rounded text-sm">@gmail.com</code></li>
                      <li><code className="bg-accent px-2 py-1 rounded text-sm">@outlook.com</code></li>
                      <li><code className="bg-accent px-2 py-1 rounded text-sm">Any other domain</code></li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-3">
            <button
              onClick={onClose}
              className="btn btn-outline"
            >
              Close
            </button>
            {!setupResults && (
              <button
                onClick={handleSetupAccounts}
                disabled={isSettingUp}
                className="btn btn-primary flex items-center space-x-2"
              >
                {isSettingUp ? (
                  <LoadingSpinner size="sm" />
                ) : (
                  <PlayIcon className="w-4 h-4" />
                )}
                <span>{isSettingUp ? 'Setting Up Accounts...' : 'Setup All Accounts'}</span>
              </button>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default TestAccountSetup; 