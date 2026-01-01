/**
 * This is a product of Scalovate Systems Solutions.
 * All rights reserved.
 */

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  SparklesIcon,
  CheckIcon,
  XMarkIcon,
  StarIcon,
  ArrowRightIcon,
  QuestionMarkCircleIcon
} from '@heroicons/react/24/outline';

const Pricing = () => {
  const [isAnnual, setIsAnnual] = useState(false);

  const pricingTiers = [
    {
      name: 'Starter',
      description: 'Perfect for small teams getting started',
      monthlyPrice: 99,
      annualPrice: 79,
      popular: false,
      color: 'blue',
      features: {
        included: [
          'Up to 50 candidates',
          'Basic AI matching',
          '5 proposal templates',
          'Email support',
          'Basic analytics',
          'Standard integrations'
        ],
        excluded: [
          'Advanced AI features',
          'Custom branding',
          'Priority support',
          'Advanced analytics',
          'Custom integrations'
        ]
      },
      buttonText: 'Start Free Trial',
      trialDays: 14
    },
    {
      name: 'Professional',
      description: 'Best for growing companies',
      monthlyPrice: 299,
      annualPrice: 239,
      popular: true,
      color: 'indigo',
      features: {
        included: [
          'Up to 500 candidates',
          'Advanced AI matching',
          'Unlimited proposals',
          'Custom branding',
          'Priority support',
          'Advanced analytics',
          'CRM integration',
          'Team collaboration',
          'Custom workflows',
          'API access'
        ],
        excluded: [
          'Dedicated success manager',
          'Custom integrations',
          'SLA guarantee'
        ]
      },
      buttonText: 'Get Started',
      trialDays: 14
    },
    {
      name: 'Enterprise',
      description: 'For large organizations with custom needs',
      monthlyPrice: null,
      annualPrice: null,
      popular: false,
      color: 'purple',
      features: {
        included: [
          'Unlimited candidates',
          'Full AI suite',
          'Unlimited proposals',
          'Custom branding',
          'Dedicated success manager',
          'Advanced analytics',
          'Custom integrations',
          'Priority support',
          'SLA guarantee',
          'Custom training',
          'On-premise deployment',
          'Advanced security features'
        ],
        excluded: []
      },
      buttonText: 'Contact Sales',
      trialDays: null
    }
  ];

  const faqs = [
    {
      question: 'Can I change my plan at any time?',
      answer: 'Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately, and we\'ll prorate your billing accordingly.'
    },
    {
      question: 'Is there a free trial?',
      answer: 'Yes, we offer a 14-day free trial for all plans. No credit card required to start your trial.'
    },
    {
      question: 'What happens if I exceed my candidate limit?',
      answer: 'We\'ll notify you when you approach your limit. You can either upgrade your plan or archive older candidates to make room for new ones.'
    },
    {
      question: 'Do you offer refunds?',
      answer: 'We offer a 30-day money-back guarantee. If you\'re not satisfied with Augmention AI, we\'ll provide a full refund within 30 days of purchase.'
    },
    {
      question: 'Is my data secure?',
      answer: 'Absolutely. We use enterprise-grade security with SOC 2 compliance, end-to-end encryption, and regular security audits to protect your data.'
    },
    {
      question: 'Can I integrate with my existing tools?',
      answer: 'Yes, we offer integrations with popular CRM systems, ATS platforms, and other recruitment tools. Enterprise plans include custom integrations.'
    }
  ];

  const getPrice = (tier) => {
    if (!tier.monthlyPrice) return 'Custom';
    return isAnnual ? tier.annualPrice : tier.monthlyPrice;
  };

  const getSavings = (tier) => {
    if (!tier.monthlyPrice) return 0;
    return Math.round(((tier.monthlyPrice - tier.annualPrice) / tier.monthlyPrice) * 100);
  };

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
              <Link to="/features" className="text-muted-foreground hover:text-foreground transition-colors">
                Features
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
              Simple,{' '}
              <span className="bg-gradient-to-r from-indigo-500 to-purple-600 bg-clip-text text-transparent">
                Transparent
              </span>{' '}
              Pricing
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
              Choose the plan that fits your team size and needs. All plans include our core AI features 
              and 24/7 support to help you succeed.
            </p>

            {/* Billing Toggle */}
            <div className="flex items-center justify-center space-x-4">
              <span className={`text-sm font-medium ${!isAnnual ? 'text-foreground' : 'text-muted-foreground'}`}>
                Monthly
              </span>
              <button
                onClick={() => setIsAnnual(!isAnnual)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  isAnnual ? 'bg-primary' : 'bg-muted'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    isAnnual ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
              <div className="flex items-center space-x-2">
                <span className={`text-sm font-medium ${isAnnual ? 'text-foreground' : 'text-muted-foreground'}`}>
                  Annual
                </span>
                {isAnnual && (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
                    Save up to 20%
                  </span>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {pricingTiers.map((tier, index) => (
              <motion.div
                key={tier.name}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                className={`relative bg-card rounded-2xl shadow-xl overflow-hidden ${
                  tier.popular 
                    ? 'ring-2 ring-primary transform scale-105 z-10' 
                    : 'hover:shadow-2xl transition-shadow'
                }`}
              >
                {tier.popular && (
                  <div className="absolute top-0 left-0 right-0">
                    <div className="bg-primary text-primary-foreground text-center py-2 text-sm font-medium">
                      <StarIcon className="w-4 h-4 inline mr-1" />
                      Most Popular
                    </div>
                  </div>
                )}

                <div className={`p-8 ${tier.popular ? 'pt-16' : ''}`}>
                  {/* Plan Header */}
                  <div className="text-center mb-8">
                    <h3 className="text-2xl font-bold text-foreground mb-2">{tier.name}</h3>
                    <p className="text-muted-foreground mb-6">{tier.description}</p>
                    
                    <div className="mb-6">
                      {tier.monthlyPrice ? (
                        <div>
                          <span className="text-5xl font-bold text-foreground">
                            ${getPrice(tier)}
                          </span>
                          <span className="text-muted-foreground ml-1">
                            /{isAnnual ? 'month' : 'month'}
                          </span>
                          {isAnnual && tier.monthlyPrice && (
                            <div className="text-sm text-green-600 dark:text-green-400 mt-1">
                              Save {getSavings(tier)}% annually
                            </div>
                          )}
                        </div>
                      ) : (
                        <div>
                          <span className="text-5xl font-bold text-foreground">Custom</span>
                          <div className="text-sm text-muted-foreground mt-1">
                            Contact us for pricing
                          </div>
                        </div>
                      )}
                    </div>

                    <Link
                      to={tier.name === 'Enterprise' ? '/contact' : '/signup'}
                      className={`w-full py-3 px-6 rounded-xl font-medium transition-colors inline-block ${
                        tier.popular
                          ? 'bg-primary text-primary-foreground hover:bg-primary/90'
                          : 'bg-accent text-accent-foreground hover:bg-accent/80'
                      }`}
                    >
                      {tier.buttonText}
                      {tier.name !== 'Enterprise' && (
                        <ArrowRightIcon className="w-4 h-4 inline ml-2" />
                      )}
                    </Link>

                    {tier.trialDays && (
                      <p className="text-sm text-muted-foreground mt-3">
                        {tier.trialDays}-day free trial • No credit card required
                      </p>
                    )}
                  </div>

                  {/* Features List */}
                  <div className="space-y-4">
                    <h4 className="font-semibold text-foreground mb-4">What's included:</h4>
                    
                    {tier.features.included.map((feature, featureIndex) => (
                      <div key={featureIndex} className="flex items-start space-x-3">
                        <CheckIcon className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                        <span className="text-muted-foreground text-sm">{feature}</span>
                      </div>
                    ))}

                    {tier.features.excluded.length > 0 && (
                      <div className="pt-4 border-t border-border">
                        <h5 className="text-sm font-medium text-muted-foreground mb-3">Not included:</h5>
                        {tier.features.excluded.map((feature, featureIndex) => (
                          <div key={featureIndex} className="flex items-start space-x-3 mb-2">
                            <XMarkIcon className="w-5 h-5 text-muted-foreground/50 flex-shrink-0 mt-0.5" />
                            <span className="text-muted-foreground/70 text-sm">{feature}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-card">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-xl text-muted-foreground">
              Have questions? We have answers.
            </p>
          </motion.div>

          <div className="space-y-6">
            {faqs.map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-background rounded-xl p-6 shadow-lg"
              >
                <div className="flex items-start space-x-4">
                  <QuestionMarkCircleIcon className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-foreground mb-2">
                      {faq.question}
                    </h3>
                    <p className="text-muted-foreground">
                      {faq.answer}
                    </p>
                  </div>
                </div>
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
              Ready to Transform Your Hiring?
            </h2>
            <p className="text-xl text-muted-foreground mb-8">
              Join thousands of companies using Augmention AI to find the perfect talent faster.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/signup" className="btn btn-primary text-lg px-8 py-4 rounded-xl">
                Start Free Trial
                <ArrowRightIcon className="w-5 h-5 ml-2" />
              </Link>
              <Link to="/features" className="btn btn-outline text-lg px-8 py-4 rounded-xl">
                View Features
              </Link>
            </div>
            <p className="text-sm text-muted-foreground mt-4">
              14-day free trial • No credit card required • Cancel anytime
            </p>
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

export default Pricing; 