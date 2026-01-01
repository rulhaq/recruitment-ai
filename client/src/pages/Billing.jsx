/**
 * This is a product of Scalovate Systems Solutions.
 * All rights reserved.
 */

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { apiService } from '../lib/api';
import {
  CreditCardIcon,
  DocumentTextIcon,
  CalendarIcon,
  BanknotesIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  ClockIcon,
  EyeIcon,
  ArrowDownTrayIcon,
  PlusIcon,
  ChartBarIcon,
  CurrencyDollarIcon,
  MagnifyingGlassIcon,
  FunnelIcon
} from '@heroicons/react/24/outline';
import LoadingSpinner from '../components/LoadingSpinner';

const Billing = () => {
  const { userProfile } = useAuth();
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [invoices, setInvoices] = useState([]);
  const [payments, setPayments] = useState([]);
  const [subscription, setSubscription] = useState(null);
  const [financialOverview, setFinancialOverview] = useState({});
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);

  useEffect(() => {
    fetchBillingData();
  }, []);

  const fetchBillingData = async () => {
    try {
      setLoading(true);
      
      // Mock data for demonstration
      const mockFinancialOverview = {
        totalRevenue: 245000,
        monthlyRevenue: 48000,
        pendingInvoices: 15,
        overdueInvoices: 3,
        totalClients: 28,
        averageInvoiceValue: 8500,
        collectionRate: 94.5,
        growth: {
          revenue: 12.8,
          invoices: 8.3,
          clients: 15.2
        }
      };

      const mockInvoices = [
        {
          id: 'INV-2024-001',
          clientName: 'TechCorp Inc.',
          amount: 15000,
          status: 'paid',
          dueDate: '2024-01-15',
          issueDate: '2024-01-01',
          description: 'Senior React Developer - Jan 2024',
          paymentDate: '2024-01-12',
          items: [
            { description: 'Senior React Developer', quantity: 160, rate: 75, amount: 12000 },
            { description: 'Project Management', quantity: 40, rate: 60, amount: 2400 },
            { description: 'Technical Consultation', quantity: 8, rate: 100, amount: 800 }
          ]
        },
        {
          id: 'INV-2024-002',
          clientName: 'StartupXYZ',
          amount: 8500,
          status: 'pending',
          dueDate: '2024-01-25',
          issueDate: '2024-01-10',
          description: 'Full-Stack Developer - Jan 2024',
          items: [
            { description: 'Full-Stack Developer', quantity: 120, rate: 65, amount: 7800 },
            { description: 'Code Review', quantity: 10, rate: 70, amount: 700 }
          ]
        },
        {
          id: 'INV-2024-003',
          clientName: 'Enterprise Solutions Ltd.',
          amount: 22000,
          status: 'overdue',
          dueDate: '2024-01-20',
          issueDate: '2024-01-05',
          description: 'Development Team - Jan 2024',
          items: [
            { description: 'Senior Developer', quantity: 160, rate: 80, amount: 12800 },
            { description: 'Junior Developer', quantity: 160, rate: 45, amount: 7200 },
            { description: 'DevOps Engineer', quantity: 40, rate: 90, amount: 3600 }
          ]
        }
      ];

      const mockPayments = [
        {
          id: 'PAY-001',
          invoiceId: 'INV-2024-001',
          clientName: 'TechCorp Inc.',
          amount: 15000,
          paymentDate: '2024-01-12',
          method: 'Bank Transfer',
          status: 'completed'
        },
        {
          id: 'PAY-002',
          invoiceId: 'INV-2023-098',
          clientName: 'StartupXYZ',
          amount: 7500,
          paymentDate: '2024-01-08',
          method: 'Credit Card',
          status: 'completed'
        }
      ];

      const mockSubscription = {
        plan: 'Professional',
        status: 'active',
        billingCycle: 'monthly',
        amount: 299,
        nextBilling: '2024-02-01',
        features: [
          'Unlimited candidates',
          'Advanced AI matching',
          'CRM integration',
          'Analytics dashboard',
          'Priority support'
        ]
      };

      setFinancialOverview(mockFinancialOverview);
      setInvoices(mockInvoices);
      setPayments(mockPayments);
      setSubscription(mockSubscription);
    } catch (error) {
      console.error('Error fetching billing data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'paid':
      case 'completed':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400';
      case 'overdue':
        return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'paid':
      case 'completed':
        return <CheckCircleIcon className="w-4 h-4 text-green-500" />;
      case 'pending':
        return <ClockIcon className="w-4 h-4 text-yellow-500" />;
      case 'overdue':
        return <ExclamationTriangleIcon className="w-4 h-4 text-red-500" />;
      default:
        return <ClockIcon className="w-4 h-4 text-gray-500" />;
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const filteredInvoices = invoices.filter(invoice => {
    const matchesFilter = filter === 'all' || invoice.status === filter;
    const matchesSearch = invoice.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         invoice.id.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const handleDownloadInvoice = (invoiceId) => {
    console.log('Downloading invoice:', invoiceId);
    // Implement download functionality
  };

  const handleViewInvoice = (invoice) => {
    setSelectedInvoice(invoice);
    setShowInvoiceModal(true);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <CreditCardIcon className="w-8 h-8 text-primary" />
              <h1 className="text-2xl font-bold text-foreground">Billing & Payments</h1>
            </div>
            
            <div className="flex items-center space-x-4">
              <button className="btn btn-outline">
                <ArrowDownTrayIcon className="w-4 h-4 mr-2" />
                Export
              </button>
              <button className="btn btn-primary">
                <PlusIcon className="w-4 h-4 mr-2" />
                Create Invoice
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tabs */}
        <div className="border-b border-border mb-8">
          <nav className="flex space-x-8">
            {[
              { id: 'overview', label: 'Overview', icon: ChartBarIcon },
              { id: 'invoices', label: 'Invoices', icon: DocumentTextIcon },
              { id: 'payments', label: 'Payments', icon: BanknotesIcon },
              { id: 'subscription', label: 'Subscription', icon: CreditCardIcon }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-primary text-primary'
                    : 'border-transparent text-muted-foreground hover:text-foreground hover:border-muted'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>

        {loading && (
          <div className="flex justify-center py-12">
            <LoadingSpinner size="lg" />
          </div>
        )}

        {!loading && (
          <>
            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <div className="space-y-8">
                {/* KPI Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="card p-6"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">Total Revenue</p>
                        <p className="text-2xl font-bold text-foreground">
                          {formatCurrency(financialOverview.totalRevenue)}
                        </p>
                      </div>
                      <CurrencyDollarIcon className="w-8 h-8 text-green-500" />
                    </div>
                    <div className="flex items-center mt-2 text-sm">
                      <span className="text-green-600">
                        +{financialOverview.growth?.revenue}%
                      </span>
                      <span className="text-muted-foreground ml-1">vs last month</span>
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
                        <p className="text-sm text-muted-foreground">Monthly Revenue</p>
                        <p className="text-2xl font-bold text-foreground">
                          {formatCurrency(financialOverview.monthlyRevenue)}
                        </p>
                      </div>
                      <BanknotesIcon className="w-8 h-8 text-blue-500" />
                    </div>
                    <div className="flex items-center mt-2 text-sm">
                      <span className="text-green-600">
                        +{financialOverview.growth?.revenue}%
                      </span>
                      <span className="text-muted-foreground ml-1">vs last month</span>
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
                        <p className="text-sm text-muted-foreground">Pending Invoices</p>
                        <p className="text-2xl font-bold text-foreground">
                          {financialOverview.pendingInvoices}
                        </p>
                      </div>
                      <DocumentTextIcon className="w-8 h-8 text-yellow-500" />
                    </div>
                    <div className="flex items-center mt-2 text-sm">
                      <span className="text-red-600">
                        {financialOverview.overdueInvoices} overdue
                      </span>
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
                        <p className="text-sm text-muted-foreground">Collection Rate</p>
                        <p className="text-2xl font-bold text-foreground">
                          {financialOverview.collectionRate}%
                        </p>
                      </div>
                      <CheckCircleIcon className="w-8 h-8 text-purple-500" />
                    </div>
                    <div className="flex items-center mt-2 text-sm">
                      <span className="text-muted-foreground">
                        Avg: {formatCurrency(financialOverview.averageInvoiceValue)}
                      </span>
                    </div>
                  </motion.div>
                </div>

                {/* Recent Activity */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div className="card p-6">
                    <h3 className="text-lg font-semibold mb-4">Recent Invoices</h3>
                    <div className="space-y-4">
                      {invoices.slice(0, 5).map((invoice) => (
                        <div key={invoice.id} className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">{invoice.id}</p>
                            <p className="text-sm text-muted-foreground">{invoice.clientName}</p>
                          </div>
                          <div className="text-right">
                            <p className="font-medium">{formatCurrency(invoice.amount)}</p>
                            <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(invoice.status)}`}>
                              {invoice.status}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="card p-6">
                    <h3 className="text-lg font-semibold mb-4">Recent Payments</h3>
                    <div className="space-y-4">
                      {payments.slice(0, 5).map((payment) => (
                        <div key={payment.id} className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">{payment.invoiceId}</p>
                            <p className="text-sm text-muted-foreground">{payment.clientName}</p>
                          </div>
                          <div className="text-right">
                            <p className="font-medium">{formatCurrency(payment.amount)}</p>
                            <p className="text-xs text-muted-foreground">
                              {formatDate(payment.paymentDate)}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Invoices Tab */}
            {activeTab === 'invoices' && (
              <div className="space-y-6">
                {/* Filters */}
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="relative flex-1">
                    <MagnifyingGlassIcon className="absolute left-3 top-3 w-5 h-5 text-muted-foreground" />
                    <input
                      type="text"
                      placeholder="Search invoices..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="input pl-10"
                    />
                  </div>
                  <select
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                    className="input w-auto"
                  >
                    <option value="all">All Invoices</option>
                    <option value="pending">Pending</option>
                    <option value="paid">Paid</option>
                    <option value="overdue">Overdue</option>
                  </select>
                </div>

                {/* Invoices List */}
                <div className="card overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-muted/50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                            Invoice
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                            Client
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                            Amount
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                            Due Date
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                            Status
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border">
                        {filteredInvoices.map((invoice) => (
                          <tr key={invoice.id} className="hover:bg-muted/50">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div>
                                <div className="text-sm font-medium text-foreground">
                                  {invoice.id}
                                </div>
                                <div className="text-sm text-muted-foreground">
                                  {formatDate(invoice.issueDate)}
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-foreground">{invoice.clientName}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm font-medium text-foreground">
                                {formatCurrency(invoice.amount)}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-foreground">
                                {formatDate(invoice.dueDate)}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center space-x-2">
                                {getStatusIcon(invoice.status)}
                                <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(invoice.status)}`}>
                                  {invoice.status}
                                </span>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                              <div className="flex items-center space-x-2">
                                <button
                                  onClick={() => handleViewInvoice(invoice)}
                                  className="text-primary hover:text-primary/80"
                                >
                                  <EyeIcon className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => handleDownloadInvoice(invoice.id)}
                                  className="text-muted-foreground hover:text-foreground"
                                >
                                  <ArrowDownTrayIcon className="w-4 h-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* Payments Tab */}
            {activeTab === 'payments' && (
              <div className="space-y-6">
                <div className="card overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-muted/50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                            Payment ID
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                            Invoice
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                            Client
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                            Amount
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                            Method
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                            Date
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                            Status
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border">
                        {payments.map((payment) => (
                          <tr key={payment.id} className="hover:bg-muted/50">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm font-medium text-foreground">
                                {payment.id}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-foreground">{payment.invoiceId}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-foreground">{payment.clientName}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm font-medium text-foreground">
                                {formatCurrency(payment.amount)}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-foreground">{payment.method}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-foreground">
                                {formatDate(payment.paymentDate)}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(payment.status)}`}>
                                {payment.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* Subscription Tab */}
            {activeTab === 'subscription' && (
              <div className="space-y-6">
                <div className="card p-6">
                  <div className="flex justify-between items-start mb-6">
                    <div>
                      <h3 className="text-lg font-semibold mb-2">Current Plan</h3>
                      <div className="flex items-center space-x-3">
                        <span className="text-2xl font-bold text-primary">
                          {subscription?.plan}
                        </span>
                        <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(subscription?.status)}`}>
                          {subscription?.status}
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-foreground">
                        {formatCurrency(subscription?.amount)}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        /{subscription?.billingCycle}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-medium mb-3">Plan Features</h4>
                      <ul className="space-y-2">
                        {subscription?.features.map((feature, index) => (
                          <li key={index} className="flex items-center space-x-2">
                            <CheckCircleIcon className="w-4 h-4 text-green-500" />
                            <span className="text-sm">{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    <div>
                      <h4 className="font-medium mb-3">Billing Information</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Next billing:</span>
                          <span>{formatDate(subscription?.nextBilling)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Billing cycle:</span>
                          <span className="capitalize">{subscription?.billingCycle}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 pt-6 border-t border-border">
                    <div className="flex space-x-4">
                      <button className="btn btn-outline">
                        Change Plan
                      </button>
                      <button className="btn btn-outline">
                        Update Payment Method
                      </button>
                      <button className="btn btn-outline text-red-600 border-red-300">
                        Cancel Subscription
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Invoice Modal */}
      {showInvoiceModal && selectedInvoice && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-card p-6 rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h3 className="text-lg font-semibold">Invoice Details</h3>
                <p className="text-sm text-muted-foreground">{selectedInvoice.id}</p>
              </div>
              <button
                onClick={() => setShowInvoiceModal(false)}
                className="text-muted-foreground hover:text-foreground"
              >
                ✕
              </button>
            </div>

            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium mb-2">Bill To</h4>
                  <p className="text-sm">{selectedInvoice.clientName}</p>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Invoice Info</h4>
                  <div className="text-sm space-y-1">
                    <p>Issue Date: {formatDate(selectedInvoice.issueDate)}</p>
                    <p>Due Date: {formatDate(selectedInvoice.dueDate)}</p>
                    <p>Status: <span className={`px-2 py-1 text-xs rounded ${getStatusColor(selectedInvoice.status)}`}>
                      {selectedInvoice.status}
                    </span></p>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-medium mb-3">Items</h4>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-2">Description</th>
                        <th className="text-right py-2">Qty</th>
                        <th className="text-right py-2">Rate</th>
                        <th className="text-right py-2">Amount</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedInvoice.items?.map((item, index) => (
                        <tr key={index} className="border-b">
                          <td className="py-2">{item.description}</td>
                          <td className="text-right py-2">{item.quantity}</td>
                          <td className="text-right py-2">{formatCurrency(item.rate)}</td>
                          <td className="text-right py-2">{formatCurrency(item.amount)}</td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot>
                      <tr>
                        <td colSpan="3" className="text-right py-2 font-medium">Total:</td>
                        <td className="text-right py-2 font-bold">
                          {formatCurrency(selectedInvoice.amount)}
                        </td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>

              <div className="flex space-x-4 pt-4">
                <button
                  onClick={() => handleDownloadInvoice(selectedInvoice.id)}
                  className="btn btn-outline flex-1"
                >
                  <ArrowDownTrayIcon className="w-4 h-4 mr-2" />
                  Download PDF
                </button>
                <button
                  onClick={() => setShowInvoiceModal(false)}
                  className="btn btn-primary flex-1"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Billing; 