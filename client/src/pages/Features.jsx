/**
 * This is a product of Scalovate Systems Solutions.
 * All rights reserved.
 */

import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  SparklesIcon,
  RocketLaunchIcon,
  LinkIcon,
  ChartBarIcon,
  UserGroupIcon,
  DocumentTextIcon,
  ClockIcon,
  CheckCircleIcon,
  CogIcon,
  ShieldCheckIcon,
  BoltIcon,
  ArrowRightIcon
} from '@heroicons/react/24/outline';

const Features = () => {
  const mainFeatures = [
    {
      icon: SparklesIcon,
      title: 'AI Talent Matching',
      description: 'Our advanced AI algorithms analyze job requirements and candidate profiles to provide precision matching with confidence scores.',
      color: 'text-blue-500',
      bgColor: 'bg-blue-50 dark:bg-blue-950/20',
      workflow: [
        'Upload job requirements and specifications',
        'AI analyzes skills, experience, and cultural fit',
        'Candidates ranked by compatibility score',
        'Review top matches with detailed explanations'
      ]
    },
    {
      icon: RocketLaunchIcon,
      title: 'Smart Proposals',
      description: 'Generate professional, tailored proposals in minutes using AI-powered content creation and customizable templates.',
      color: 'text-indigo-500',
      bgColor: 'bg-indigo-50 dark:bg-indigo-950/20',
      workflow: [
        'Select candidate and role details',
        'AI generates personalized proposal content',
        'Customize with your branding and terms',
        'Send directly to clients with tracking'
      ]
    },
    {
      icon: LinkIcon,
      title: 'CRM Integration',
      description: 'Seamlessly connect with your existing CRM systems for unified pipeline management and data synchronization.',
      color: 'text-purple-500',
      bgColor: 'bg-purple-50 dark:bg-purple-950/20',
      workflow: [
        'Connect to Odoo, Salesforce, or HubSpot',
        'Automatic data synchronization',
        'Unified contact and opportunity management',
        'Real-time pipeline updates'
      ]
    },
    {
      icon: ChartBarIcon,
      title: 'Real-time Analytics',
      description: 'Track performance metrics, placement success rates, and revenue analytics with comprehensive dashboards.',
      color: 'text-emerald-500',
      bgColor: 'bg-emerald-50 dark:bg-emerald-950/20',
      workflow: [
        'Automated data collection and processing',
        'Customizable dashboard creation',
        'Performance trend analysis',
        'Exportable reports and insights'
      ]
    }
  ];

  const additionalFeatures = [
    {
      icon: UserGroupIcon,
      title: 'Team Collaboration',
      description: 'Work together with role-based permissions and real-time updates.'
    },
    {
      icon: DocumentTextIcon,
      title: 'Document Management',
      description: 'Centralized storage for CVs, contracts, and project documents.'
    },
    {
      icon: ClockIcon,
      title: 'Time Tracking',
      description: 'Monitor project timelines and resource allocation efficiently.'
    },
    {
      icon: CheckCircleIcon,
      title: 'Quality Assurance',
      description: 'Built-in validation and quality checks for all processes.'
    },
    {
      icon: CogIcon,
      title: 'Custom Workflows',
      description: 'Adapt the platform to your unique business processes.'
    },
    {
      icon: ShieldCheckIcon,
      title: 'Enterprise Security',
      description: 'Bank-level security with SOC 2 compliance and encryption.'
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-background/80 backdrop-blur-lg border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link to="/" className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
                <SparklesIcon className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-foreground">Augmention AI</span>
            </Link>
            
            <div className="flex items-center space-x-4">
              <Link to="/" className="text-muted-foreground hover:text-foreground transition-colors">
                Home
              </Link>
              <Link to="/pricing" className="text-muted-foreground hover:text-foreground transition-colors">
                Pricing
              </Link>
              <Link to="/login" className="btn btn-outline">
                Login
              </Link>
              <Link to="/signup" className="btn btn-primary">
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-24 pb-16 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 via-white to-slate-50 dark:from-slate-900 dark:via-slate-800 dark:to-indigo-900"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6">
              Powerful Features for{' '}
              <span className="bg-gradient-to-r from-indigo-500 to-purple-600 bg-clip-text text-transparent">
                Modern Recruitment
              </span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Discover how our AI-driven platform transforms every aspect of your talent acquisition process, 
              from candidate discovery to successful placements.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Main Features */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-24">
            {mainFeatures.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.2 }}
                viewport={{ once: true }}
                className={`grid grid-cols-1 lg:grid-cols-2 gap-12 items-center ${
                  index % 2 === 1 ? 'lg:flex-row-reverse' : ''
                }`}
              >
                <div className={index % 2 === 1 ? 'lg:order-2' : ''}>
                  <div className={`w-16 h-16 rounded-2xl ${feature.bgColor} flex items-center justify-center mb-6`}>
                    <feature.icon className={`w-8 h-8 ${feature.color}`} />
                  </div>
                  
                  <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                    {feature.title}
                  </h2>
                  
                  <p className="text-xl text-muted-foreground mb-8">
                    {feature.description}
                  </p>

                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-foreground mb-4">How it works:</h3>
                    {feature.workflow.map((step, stepIndex) => (
                      <div key={stepIndex} className="flex items-start space-x-3">
                        <div className={`w-6 h-6 rounded-full ${feature.color.replace('text-', 'bg-')} text-white flex items-center justify-center text-sm font-bold flex-shrink-0 mt-0.5`}>
                          {stepIndex + 1}
                        </div>
                        <p className="text-muted-foreground">{step}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className={`relative ${index % 2 === 1 ? 'lg:order-1' : ''}`}>
                  <div className={`relative w-full h-96 ${feature.bgColor} rounded-3xl shadow-2xl overflow-hidden`}>
                    <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent"></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center">
                        <feature.icon className={`w-24 h-24 mx-auto mb-4 ${feature.color} opacity-80`} />
                        <h3 className={`text-2xl font-bold mb-2 ${feature.color}`}>
                          {feature.title}
                        </h3>
                        <div className="flex items-center justify-center space-x-2">
                          <BoltIcon className={`w-5 h-5 ${feature.color}`} />
                          <span className={`text-sm font-medium ${feature.color}`}>
                            AI-Powered
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Additional Features Grid */}
      <section className="py-20 bg-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Everything You Need
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Beyond our core AI features, Augmention AI provides a complete toolkit for modern recruitment teams.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {additionalFeatures.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-background p-6 rounded-2xl shadow-lg hover:shadow-xl transition-shadow group"
              >
                <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-2">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-indigo-50 via-white to-slate-50 dark:from-slate-900 dark:via-slate-800 dark:to-indigo-900">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Ready to Experience These Features?
            </h2>
            <p className="text-xl text-muted-foreground mb-8">
              Start your free trial today and see how Augmention AI can transform your recruitment process.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/signup" className="btn btn-primary text-lg px-8 py-4 rounded-xl">
                Start Free Trial
                <ArrowRightIcon className="w-5 h-5 ml-2" />
              </Link>
              <Link to="/pricing" className="btn btn-outline text-lg px-8 py-4 rounded-xl">
                View Pricing
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <SparklesIcon className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold">Augmention AI</span>
              </div>
              <p className="text-slate-300 mb-6 max-w-md">
                AI-driven staff augmentation platform that helps companies discover, 
                qualify, and engage top talent at scale.
              </p>
              <div className="text-sm text-slate-400">
                © 2026 RecruitmentAI. A Scalovate Systems Solutions Product
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-slate-300">
                <li><Link to="/features" className="hover:text-white transition-colors">Features</Link></li>
                <li><Link to="/pricing" className="hover:text-white transition-colors">Pricing</Link></li>
                <li><a href="#" className="hover:text-white transition-colors">API</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Integrations</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-slate-300">
                <li><Link to="/about" className="hover:text-white transition-colors">About</Link></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Privacy</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Terms</a></li>
              </ul>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Features; 