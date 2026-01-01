/**
 * This is a product of Scalovate Systems Solutions.
 * All rights reserved.
 */

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  ChartBarIcon,
  ShieldCheckIcon,
  ServerIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  ClockIcon,
  CpuChipIcon,
  CloudIcon,
  CircleStackIcon,
  WifiIcon,
  BellIcon,
  DocumentTextIcon,
  ArrowPathIcon,
  EyeIcon,
  FunnelIcon,
  MagnifyingGlassIcon,
  XCircleIcon,
  InformationCircleIcon
} from '@heroicons/react/24/outline';
import LoadingSpinner from '../components/LoadingSpinner';

const AdminMonitoring = () => {
  const { userProfile, hasAdminAccess } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [searchTerm, setSearchTerm] = useState('');
  const [logLevel, setLogLevel] = useState('all');
  
  // System metrics state
  const [systemMetrics, setSystemMetrics] = useState({
    cpu: { usage: 45, trend: 'stable' },
    memory: { usage: 67, trend: 'increasing' },
    disk: { usage: 23, trend: 'stable' },
    network: { in: 1200, out: 800, trend: 'stable' },
    database: { connections: 45, queries: 1240, trend: 'stable' },
    api: { requests: 2450, errors: 12, response_time: 145, trend: 'stable' }
  });

  const [systemAlerts, setSystemAlerts] = useState([]);
  const [systemLogs, setSystemLogs] = useState([]);
  const [performanceData, setPerformanceData] = useState([]);

  const tabs = [
    { id: 'overview', label: 'Overview', icon: ChartBarIcon },
    { id: 'performance', label: 'Performance', icon: CpuChipIcon },
    { id: 'alerts', label: 'Alerts', icon: ExclamationTriangleIcon },
    { id: 'logs', label: 'System Logs', icon: DocumentTextIcon },
    { id: 'services', label: 'Services', icon: ServerIcon }
  ];

  // Redirect if not admin
  useEffect(() => {
    if (userProfile && !hasAdminAccess()) {
      navigate('/dashboard');
    }
  }, [userProfile, hasAdminAccess, navigate]);

  useEffect(() => {
    if (hasAdminAccess()) {
      fetchMonitoringData();
    }
  }, [hasAdminAccess]);

  const fetchMonitoringData = async () => {
    try {
      setLoading(true);
      
      // Mock monitoring data
      const mockAlerts = [
        {
          id: '1',
          type: 'error',
          severity: 'high',
          title: 'Database Connection Failed',
          message: 'Primary database connection failed. Failover activated.',
          timestamp: new Date().toISOString(),
          status: 'active',
          source: 'database'
        },
        {
          id: '2',
          type: 'warning',
          severity: 'medium',
          title: 'High Memory Usage',
          message: 'Memory usage is above 80% threshold.',
          timestamp: new Date(Date.now() - 300000).toISOString(),
          status: 'acknowledged',
          source: 'system'
        },
        {
          id: '3',
          type: 'info',
          severity: 'low',
          title: 'Backup Completed',
          message: 'Daily backup completed successfully.',
          timestamp: new Date(Date.now() - 3600000).toISOString(),
          status: 'resolved',
          source: 'backup'
        },
        {
          id: '4',
          type: 'warning',
          severity: 'medium',
          title: 'API Rate Limit Approaching',
          message: 'API rate limit is at 85% of threshold.',
          timestamp: new Date(Date.now() - 900000).toISOString(),
          status: 'active',
          source: 'api'
        }
      ];

      const mockLogs = [
        {
          id: '1',
          level: 'error',
          message: 'Database connection timeout after 30 seconds',
          timestamp: new Date().toISOString(),
          source: 'database',
          details: 'Connection string: postgresql://***:***@localhost:5432/cartafella'
        },
        {
          id: '2',
          level: 'info',
          message: 'User authentication successful',
          timestamp: new Date(Date.now() - 120000).toISOString(),
          source: 'auth',
          details: 'User ID: user_12345, IP: 192.168.1.100'
        },
        {
          id: '3',
          level: 'warning',
          message: 'API request rate exceeded 80% of limit',
          timestamp: new Date(Date.now() - 180000).toISOString(),
          source: 'api',
          details: 'Endpoint: /api/search, User: user_67890'
        },
        {
          id: '4',
          level: 'debug',
          message: 'Cache hit for user profile request',
          timestamp: new Date(Date.now() - 240000).toISOString(),
          source: 'cache',
          details: 'Key: user_profile_12345, TTL: 300s'
        },
        {
          id: '5',
          level: 'info',
          message: 'Backup process initiated',
          timestamp: new Date(Date.now() - 3600000).toISOString(),
          source: 'backup',
          details: 'Target: S3 bucket, Size: 2.4GB'
        }
      ];

      const mockPerformanceData = Array.from({ length: 24 }, (_, i) => ({
        time: new Date(Date.now() - (23 - i) * 3600000).toISOString(),
        cpu: Math.random() * 100,
        memory: Math.random() * 100,
        requests: Math.floor(Math.random() * 1000) + 500,
        response_time: Math.floor(Math.random() * 200) + 50
      }));

      setSystemAlerts(mockAlerts);
      setSystemLogs(mockLogs);
      setPerformanceData(mockPerformanceData);
    } catch (error) {
      console.error('Error fetching monitoring data:', error);
    } finally {
      setLoading(false);
    }
  };

  const refreshData = async () => {
    setRefreshing(true);
    await fetchMonitoringData();
    setRefreshing(false);
  };

  const acknowledgeAlert = (alertId) => {
    setSystemAlerts(prev => prev.map(alert => 
      alert.id === alertId ? { ...alert, status: 'acknowledged' } : alert
    ));
  };

  const resolveAlert = (alertId) => {
    setSystemAlerts(prev => prev.map(alert => 
      alert.id === alertId ? { ...alert, status: 'resolved' } : alert
    ));
  };

  const getAlertIcon = (type) => {
    switch (type) {
      case 'error': return <XCircleIcon className="w-5 h-5 text-red-500" />;
      case 'warning': return <ExclamationTriangleIcon className="w-5 h-5 text-yellow-500" />;
      case 'info': return <InformationCircleIcon className="w-5 h-5 text-blue-500" />;
      default: return <BellIcon className="w-5 h-5 text-gray-500" />;
    }
  };

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'high': return 'text-red-600 bg-red-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'low': return 'text-blue-600 bg-blue-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getLogLevelColor = (level) => {
    switch (level) {
      case 'error': return 'text-red-600 bg-red-100';
      case 'warning': return 'text-yellow-600 bg-yellow-100';
      case 'info': return 'text-blue-600 bg-blue-100';
      case 'debug': return 'text-gray-600 bg-gray-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  const filteredLogs = systemLogs.filter(log => {
    const matchesSearch = log.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         log.source.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesLevel = logLevel === 'all' || log.level === logLevel;
    return matchesSearch && matchesLevel;
  });

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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <LoadingSpinner size="lg" />
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
                <h1 className="text-2xl font-bold text-foreground">System Monitoring</h1>
                <p className="text-sm text-muted-foreground">
                  Real-time system health and performance
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-sm">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-muted-foreground">Live</span>
              </div>
              <button
                onClick={refreshData}
                disabled={refreshing}
                className="btn btn-outline"
              >
                {refreshing ? (
                  <LoadingSpinner size="sm" />
                ) : (
                  <ArrowPathIcon className="w-4 h-4 mr-2" />
                )}
                Refresh
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* System Health Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6 mb-8">
          <div className="card p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-2">
                <CpuChipIcon className="w-5 h-5 text-blue-500" />
                <span className="text-sm font-medium text-foreground">CPU</span>
              </div>
              <CheckCircleIcon className="w-4 h-4 text-green-500" />
            </div>
            <div className="text-2xl font-bold text-foreground mb-1">{systemMetrics.cpu.usage}%</div>
            <div className="w-full bg-accent rounded-full h-2">
              <div 
                className="bg-blue-500 h-2 rounded-full" 
                style={{ width: `${systemMetrics.cpu.usage}%` }}
              ></div>
            </div>
          </div>

          <div className="card p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-2">
                <CircleStackIcon className="w-5 h-5 text-purple-500" />
                <span className="text-sm font-medium text-foreground">Memory</span>
              </div>
              <ExclamationTriangleIcon className="w-4 h-4 text-yellow-500" />
            </div>
            <div className="text-2xl font-bold text-foreground mb-1">{systemMetrics.memory.usage}%</div>
            <div className="w-full bg-accent rounded-full h-2">
              <div 
                className="bg-purple-500 h-2 rounded-full" 
                style={{ width: `${systemMetrics.memory.usage}%` }}
              ></div>
            </div>
          </div>

          <div className="card p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-2">
                <ServerIcon className="w-5 h-5 text-green-500" />
                <span className="text-sm font-medium text-foreground">Disk</span>
              </div>
              <CheckCircleIcon className="w-4 h-4 text-green-500" />
            </div>
            <div className="text-2xl font-bold text-foreground mb-1">{systemMetrics.disk.usage}%</div>
            <div className="w-full bg-accent rounded-full h-2">
              <div 
                className="bg-green-500 h-2 rounded-full" 
                style={{ width: `${systemMetrics.disk.usage}%` }}
              ></div>
            </div>
          </div>

          <div className="card p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-2">
                <WifiIcon className="w-5 h-5 text-cyan-500" />
                <span className="text-sm font-medium text-foreground">Network</span>
              </div>
              <CheckCircleIcon className="w-4 h-4 text-green-500" />
            </div>
            <div className="text-lg font-bold text-foreground mb-1">
              ↓{systemMetrics.network.in} MB/s
            </div>
            <div className="text-sm text-muted-foreground">
              ↑{systemMetrics.network.out} MB/s
            </div>
          </div>

          <div className="card p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-2">
                <CircleStackIcon className="w-5 h-5 text-orange-500" />
                <span className="text-sm font-medium text-foreground">Database</span>
              </div>
              <CheckCircleIcon className="w-4 h-4 text-green-500" />
            </div>
            <div className="text-2xl font-bold text-foreground mb-1">{systemMetrics.database.connections}</div>
            <div className="text-xs text-muted-foreground">connections</div>
          </div>

          <div className="card p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-2">
                <CloudIcon className="w-5 h-5 text-indigo-500" />
                <span className="text-sm font-medium text-foreground">API</span>
              </div>
              <CheckCircleIcon className="w-4 h-4 text-green-500" />
            </div>
            <div className="text-2xl font-bold text-foreground mb-1">{systemMetrics.api.response_time}ms</div>
            <div className="text-xs text-muted-foreground">avg response</div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="border-b border-border mb-8">
          <nav className="flex space-x-8">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab.id
                      ? 'border-primary text-primary'
                      : 'border-transparent text-muted-foreground hover:text-foreground hover:border-accent'
                  }`}
                >
                  <Icon className="w-5 h-5 mr-2" />
                  {tab.label}
                  {tab.id === 'alerts' && systemAlerts.filter(a => a.status === 'active').length > 0 && (
                    <span className="ml-2 bg-red-500 text-white text-xs rounded-full px-2 py-1">
                      {systemAlerts.filter(a => a.status === 'active').length}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="min-h-96">
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <div>
                <h2 className="text-xl font-bold text-foreground mb-4">System Overview</h2>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                  <div className="card p-6">
                    <h3 className="text-lg font-semibold text-foreground mb-4">System Health</h3>
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between text-sm mb-2">
                          <span className="text-muted-foreground">Overall Health</span>
                          <span className="font-medium text-green-600">98.5%</span>
                        </div>
                        <div className="w-full bg-accent rounded-full h-2">
                          <div className="bg-green-500 h-2 rounded-full" style={{ width: '98.5%' }}></div>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-muted-foreground">Uptime</span>
                          <div className="font-semibold text-foreground">99.9%</div>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Response Time</span>
                          <div className="font-semibold text-foreground">{systemMetrics.api.response_time}ms</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="card p-6">
                    <h3 className="text-lg font-semibold text-foreground mb-4">Active Alerts</h3>
                    <div className="space-y-3">
                      {systemAlerts.filter(a => a.status === 'active').slice(0, 3).map((alert) => (
                        <div key={alert.id} className="flex items-center space-x-3 p-3 bg-accent/50 rounded">
                          {getAlertIcon(alert.type)}
                          <div className="flex-1">
                            <div className="font-medium text-sm text-foreground">{alert.title}</div>
                            <div className="text-xs text-muted-foreground">{alert.message}</div>
                          </div>
                        </div>
                      ))}
                      {systemAlerts.filter(a => a.status === 'active').length === 0 && (
                        <div className="text-center py-8 text-muted-foreground">
                          <CheckCircleIcon className="w-12 h-12 mx-auto mb-2 text-green-500" />
                          <p>No active alerts</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="card p-6">
                  <h3 className="text-lg font-semibold text-foreground mb-4">Recent Activity</h3>
                  <div className="space-y-2">
                    {systemLogs.slice(0, 5).map((log) => (
                      <div key={log.id} className="flex items-center space-x-3 p-3 hover:bg-accent/50 rounded">
                        <span className={`px-2 py-1 rounded text-xs font-medium ${getLogLevelColor(log.level)}`}>
                          {log.level.toUpperCase()}
                        </span>
                        <div className="flex-1 text-sm text-foreground">{log.message}</div>
                        <div className="text-xs text-muted-foreground">{formatTime(log.timestamp)}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Performance Tab */}
          {activeTab === 'performance' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <div>
                <h2 className="text-xl font-bold text-foreground mb-4">Performance Metrics</h2>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                  <div className="card p-6">
                    <h3 className="text-lg font-semibold text-foreground mb-4">CPU Usage (24h)</h3>
                    <div className="space-y-2">
                      {performanceData.slice(-12).map((data, index) => (
                        <div key={index} className="flex items-center space-x-2">
                          <div className="w-16 text-xs text-muted-foreground">
                            {new Date(data.time).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                          </div>
                          <div className="flex-1 bg-accent rounded-full h-4">
                            <div 
                              className="bg-blue-500 h-4 rounded-full" 
                              style={{ width: `${data.cpu}%` }}
                            ></div>
                          </div>
                          <div className="w-12 text-xs text-foreground text-right">{Math.round(data.cpu)}%</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="card p-6">
                    <h3 className="text-lg font-semibold text-foreground mb-4">Memory Usage (24h)</h3>
                    <div className="space-y-2">
                      {performanceData.slice(-12).map((data, index) => (
                        <div key={index} className="flex items-center space-x-2">
                          <div className="w-16 text-xs text-muted-foreground">
                            {new Date(data.time).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                          </div>
                          <div className="flex-1 bg-accent rounded-full h-4">
                            <div 
                              className="bg-purple-500 h-4 rounded-full" 
                              style={{ width: `${data.memory}%` }}
                            ></div>
                          </div>
                          <div className="w-12 text-xs text-foreground text-right">{Math.round(data.memory)}%</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="card p-6">
                    <h3 className="text-lg font-semibold text-foreground mb-4">API Requests (24h)</h3>
                    <div className="space-y-2">
                      {performanceData.slice(-12).map((data, index) => (
                        <div key={index} className="flex items-center space-x-2">
                          <div className="w-16 text-xs text-muted-foreground">
                            {new Date(data.time).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                          </div>
                          <div className="flex-1 bg-accent rounded-full h-4">
                            <div 
                              className="bg-indigo-500 h-4 rounded-full" 
                              style={{ width: `${(data.requests / 1500) * 100}%` }}
                            ></div>
                          </div>
                          <div className="w-16 text-xs text-foreground text-right">{data.requests}</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="card p-6">
                    <h3 className="text-lg font-semibold text-foreground mb-4">Response Time (24h)</h3>
                    <div className="space-y-2">
                      {performanceData.slice(-12).map((data, index) => (
                        <div key={index} className="flex items-center space-x-2">
                          <div className="w-16 text-xs text-muted-foreground">
                            {new Date(data.time).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                          </div>
                          <div className="flex-1 bg-accent rounded-full h-4">
                            <div 
                              className="bg-cyan-500 h-4 rounded-full" 
                              style={{ width: `${(data.response_time / 250) * 100}%` }}
                            ></div>
                          </div>
                          <div className="w-16 text-xs text-foreground text-right">{data.response_time}ms</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Services Tab */}
          {activeTab === 'services' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <div>
                <h2 className="text-xl font-bold text-foreground mb-4">Service Status</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div className="card p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <ServerIcon className="w-8 h-8 text-green-500" />
                        <div>
                          <h3 className="font-semibold text-foreground">API Server</h3>
                          <p className="text-sm text-muted-foreground">Express.js Backend</p>
                        </div>
                      </div>
                      <CheckCircleIcon className="w-6 h-6 text-green-500" />
                    </div>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Status</span>
                        <span className="font-medium text-green-600">Running</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Uptime</span>
                        <span className="font-medium text-foreground">99.9%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Response Time</span>
                        <span className="font-medium text-foreground">145ms</span>
                      </div>
                    </div>
                  </div>

                  <div className="card p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <CircleStackIcon className="w-8 h-8 text-green-500" />
                        <div>
                          <h3 className="font-semibold text-foreground">Firestore Database</h3>
                          <p className="text-sm text-muted-foreground">NoSQL Database</p>
                        </div>
                      </div>
                      <CheckCircleIcon className="w-6 h-6 text-green-500" />
                    </div>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Status</span>
                        <span className="font-medium text-green-600">Connected</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Connections</span>
                        <span className="font-medium text-foreground">{systemMetrics.database.connections}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Queries/min</span>
                        <span className="font-medium text-foreground">{systemMetrics.database.queries}</span>
                      </div>
                    </div>
                  </div>

                  <div className="card p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <CloudIcon className="w-8 h-8 text-green-500" />
                        <div>
                          <h3 className="font-semibold text-foreground">Firebase Storage</h3>
                          <p className="text-sm text-muted-foreground">File Storage</p>
                        </div>
                      </div>
                      <CheckCircleIcon className="w-6 h-6 text-green-500" />
                    </div>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Status</span>
                        <span className="font-medium text-green-600">Active</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Storage Used</span>
                        <span className="font-medium text-foreground">2.4 GB</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Files</span>
                        <span className="font-medium text-foreground">1,234</span>
                      </div>
                    </div>
                  </div>

                  <div className="card p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <CpuChipIcon className="w-8 h-8 text-green-500" />
                        <div>
                          <h3 className="font-semibold text-foreground">Groq AI Service</h3>
                          <p className="text-sm text-muted-foreground">AI Processing</p>
                        </div>
                      </div>
                      <CheckCircleIcon className="w-6 h-6 text-green-500" />
                    </div>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Status</span>
                        <span className="font-medium text-green-600">Operational</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Requests/min</span>
                        <span className="font-medium text-foreground">45</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Avg Latency</span>
                        <span className="font-medium text-foreground">1.2s</span>
                      </div>
                    </div>
                  </div>

                  <div className="card p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <WifiIcon className="w-8 h-8 text-green-500" />
                        <div>
                          <h3 className="font-semibold text-foreground">Authentication</h3>
                          <p className="text-sm text-muted-foreground">Firebase Auth</p>
                        </div>
                      </div>
                      <CheckCircleIcon className="w-6 h-6 text-green-500" />
                    </div>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Status</span>
                        <span className="font-medium text-green-600">Active</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Active Sessions</span>
                        <span className="font-medium text-foreground">892</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Logins (24h)</span>
                        <span className="font-medium text-foreground">1,234</span>
                      </div>
                    </div>
                  </div>

                  <div className="card p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <DocumentTextIcon className="w-8 h-8 text-green-500" />
                        <div>
                          <h3 className="font-semibold text-foreground">Logging Service</h3>
                          <p className="text-sm text-muted-foreground">System Logs</p>
                        </div>
                      </div>
                      <CheckCircleIcon className="w-6 h-6 text-green-500" />
                    </div>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Status</span>
                        <span className="font-medium text-green-600">Running</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Logs/min</span>
                        <span className="font-medium text-foreground">245</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Storage</span>
                        <span className="font-medium text-foreground">12.5 GB</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Alerts Tab */}
          {activeTab === 'alerts' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4"
            >
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-foreground">System Alerts</h2>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-muted-foreground">
                    {systemAlerts.filter(a => a.status === 'active').length} active alerts
                  </span>
                </div>
              </div>

              <div className="space-y-3">
                {systemAlerts.map((alert) => (
                  <motion.div
                    key={alert.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className={`card p-4 ${
                      alert.status === 'active' ? 'border-l-4 border-l-red-500' :
                      alert.status === 'acknowledged' ? 'border-l-4 border-l-yellow-500' :
                      'border-l-4 border-l-green-500'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-3">
                        {getAlertIcon(alert.type)}
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-1">
                            <h3 className="font-medium text-foreground">{alert.title}</h3>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getSeverityColor(alert.severity)}`}>
                              {alert.severity}
                            </span>
                          </div>
                          <p className="text-sm text-muted-foreground mb-2">{alert.message}</p>
                          <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                            <span>{formatTime(alert.timestamp)}</span>
                            <span>Source: {alert.source}</span>
                            <span>Status: {alert.status}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        {alert.status === 'active' && (
                          <>
                            <button
                              onClick={() => acknowledgeAlert(alert.id)}
                              className="btn btn-sm btn-outline"
                            >
                              Acknowledge
                            </button>
                            <button
                              onClick={() => resolveAlert(alert.id)}
                              className="btn btn-sm btn-primary"
                            >
                              Resolve
                            </button>
                          </>
                        )}
                        <button className="p-1 hover:bg-accent rounded">
                          <EyeIcon className="w-4 h-4 text-muted-foreground" />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Logs Tab */}
          {activeTab === 'logs' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4"
            >
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-foreground">System Logs</h2>
                
                <div className="flex items-center space-x-4">
                  <div className="relative">
                    <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <input
                      type="text"
                      placeholder="Search logs..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="input pl-10 w-64"
                    />
                  </div>
                  
                  <select
                    value={logLevel}
                    onChange={(e) => setLogLevel(e.target.value)}
                    className="input"
                  >
                    <option value="all">All Levels</option>
                    <option value="error">Error</option>
                    <option value="warning">Warning</option>
                    <option value="info">Info</option>
                    <option value="debug">Debug</option>
                  </select>
                </div>
              </div>

              <div className="card overflow-hidden">
                <div className="max-h-96 overflow-y-auto">
                  <div className="space-y-1">
                    {filteredLogs.map((log) => (
                      <div
                        key={log.id}
                        className="flex items-start space-x-3 p-3 hover:bg-accent/50 border-b border-border last:border-b-0"
                      >
                        <span className={`px-2 py-1 rounded text-xs font-medium ${getLogLevelColor(log.level)}`}>
                          {log.level.toUpperCase()}
                        </span>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-foreground truncate">{log.message}</p>
                          <p className="text-xs text-muted-foreground mt-1">{log.details}</p>
                        </div>
                        <div className="text-xs text-muted-foreground flex-shrink-0 space-y-1">
                          <div>{formatTime(log.timestamp)}</div>
                          <div className="text-right">{log.source}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {filteredLogs.length === 0 && (
                  <div className="p-12 text-center">
                    <DocumentTextIcon className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-foreground mb-2">No logs found</h3>
                    <p className="text-muted-foreground">
                      Try adjusting your search or filter criteria.
                    </p>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminMonitoring; 