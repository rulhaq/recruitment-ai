# RecruitmentAI User Guide

**Version 1.0** | **A Product of Scalovate Systems Solutions**

---

## Table of Contents

1. [Introduction](#introduction)
2. [Getting Started](#getting-started)
3. [User Roles](#user-roles)
4. [Core Features](#core-features)
5. [Role-Specific Guides](#role-specific-guides)
6. [AI Features](#ai-features)
7. [Settings & Configuration](#settings--configuration)
8. [Troubleshooting](#troubleshooting)
9. [Support](#support)

---

## Introduction

RecruitmentAI is an AI-powered staff augmentation platform designed to transform talent acquisition processes. The platform leverages advanced artificial intelligence to match candidates with job opportunities, generate professional proposals, and streamline the entire recruitment workflow.

### Key Benefits

- **95% Match Accuracy**: AI-powered candidate matching with precision scoring
- **Time Savings**: Reduce time-to-hire by up to 70%
- **Automated Workflows**: Streamline proposal generation and candidate management
- **Real-time Analytics**: Make data-driven decisions with comprehensive insights
- **CRM Integration**: Seamlessly sync with Odoo, Salesforce, and HubSpot

---

## Getting Started

### Account Creation

1. **Visit the Sign Up Page**: Navigate to `/signup` on the platform
2. **Choose Sign-Up Method**:
   - **Email/Password**: For Admin, Recruiter, and company users
   - **Google Sign-In**: Available for Clients and Candidates
3. **Complete Registration**: Fill in required information and verify your email

### Role Assignment

- **Super Admin**: Hardcoded email `admin@recruitmentai.com`
- **Admin/Recruiter**: Must use company email (`@recruitmentai.com` or `@admin.recruitmentai.com`)
- **Client/Candidate**: Any email domain accepted

### First Login

1. Enter your credentials
2. Complete profile setup if prompted
3. Review your dashboard based on your role
4. Explore available features in the sidebar navigation

---

## User Roles

### 👑 Super Admin

**Access Level**: Full system control

**Key Capabilities**:
- System configuration and settings
- User role management and assignment
- System monitoring and health checks
- Security controls and audit logs
- Platform-wide analytics
- User management (create, edit, delete)

**Email Requirement**: `admin@recruitmentai.com` (hardcoded)

### 👔 Admin

**Access Level**: Platform management

**Key Capabilities**:
- User management and oversight
- Team management
- System settings (limited)
- Performance monitoring
- Analytics and reporting
- Billing management

**Email Requirement**: Company email (`@recruitmentai.com` or `@admin.recruitmentai.com`)

### 🎯 Recruiter

**Access Level**: Talent acquisition operations

**Key Capabilities**:
- AI-powered talent search
- Candidate management and screening
- Job posting and requirement management
- Proposal generation
- Client management
- Performance analytics
- Engagement tracking

**Email Requirement**: Company email (`@recruitmentai.com` or `@admin.recruitmentai.com`)

### 🏢 Client

**Access Level**: Project and team oversight

**Key Capabilities**:
- Project management
- Team hiring oversight
- Proposal review and approval
- Budget tracking
- ROI analysis
- Engagement management
- Billing and invoicing

**Email Requirement**: Any email domain

### 👤 Candidate

**Access Level**: Profile and application management

**Key Capabilities**:
- Profile management
- CV upload and optimization
- Job opportunity browsing
- Application tracking
- ATS compatibility analysis
- Application status monitoring

**Email Requirement**: Any email domain

---

## Core Features

### 1. AI Talent Matching

**Available to**: Recruiters

**How It Works**:
1. Navigate to **Talent Search** from the sidebar
2. Enter job requirements and specifications
3. AI analyzes skills, experience, and cultural fit
4. Review candidates ranked by compatibility score
5. View detailed match explanations for each candidate

**Features**:
- 95% match accuracy
- Skills gap analysis
- Experience level assessment
- Cultural fit prediction
- Detailed match explanations

### 2. Smart Proposal Generation

**Available to**: Recruiters

**How It Works**:
1. Go to **Proposals** section
2. Select candidate and role details
3. AI generates personalized proposal content
4. Customize with your branding and terms
5. Send directly to clients with tracking

**Features**:
- AI-powered content generation
- Customizable templates
- Branding integration
- Client-specific customization
- Delivery tracking

### 3. CRM Integration

**Available to**: Recruiters, Admins

**Supported CRMs**:
- Odoo
- Salesforce
- HubSpot

**Setup**:
1. Navigate to **Settings** → **Integrations**
2. Select your CRM system
3. Enter connection credentials
4. Enable automatic synchronization

**Features**:
- Automatic data synchronization
- Unified contact management
- Real-time pipeline updates
- Opportunity tracking
- Bidirectional data flow

### 4. Real-time Analytics

**Available to**: All roles (with varying access levels)

**Dashboard Features**:
- Performance metrics
- Placement success rates
- Revenue analytics
- Candidate pipeline status
- Time-to-hire metrics
- Conversion rates

**How to Access**:
- Navigate to **Analytics** from the sidebar
- View role-specific dashboards
- Export reports as needed
- Set up custom date ranges

### 5. Document Management

**Available to**: All roles

**Features**:
- Centralized CV storage
- Contract management
- Secure file handling
- Version control
- Easy access from anywhere
- Firebase Storage integration

### 6. Team Collaboration

**Available to**: All roles

**Features**:
- Role-based permissions
- Real-time updates
- Shared workspaces
- Activity feeds
- Team notifications
- Comment and collaboration tools

### 7. Time Tracking

**Available to**: Recruiters, Clients

**Features**:
- Project timeline monitoring
- Resource allocation tracking
- Billable hours tracking
- Productivity analytics
- Time-based reporting

### 8. Quality Assurance

**Available to**: All roles

**Features**:
- Built-in validation checks
- Process consistency
- Quality scoring
- Automated quality reports
- Compliance tracking

---

## Role-Specific Guides

### Super Admin Guide

#### System Configuration
1. Navigate to **Admin** → **System Settings**
2. Configure:
   - Storage settings
   - Analytics preferences
   - Security policies
   - Email notifications
   - Integration settings

#### User Management
1. Go to **Admin** → **User Management**
2. Actions available:
   - Create new users
   - Assign roles
   - Edit user profiles
   - Deactivate/activate users
   - Reset passwords
   - View user activity

#### System Monitoring
1. Access **Admin** → **System Monitoring**
2. Monitor:
   - System health
   - Performance metrics
   - Service status
   - Error logs
   - Usage statistics

### Admin Guide

#### User Oversight
1. Navigate to **Admin** → **User Management**
2. View and manage:
   - All platform users
   - User roles and permissions
   - Activity logs
   - Performance metrics

#### Team Management
1. Go to **Team Management**
2. Manage:
   - Team structure
   - Role assignments
   - Team performance
   - Collaboration settings

#### Analytics & Reporting
1. Access **Analytics** dashboard
2. Generate reports on:
   - User activity
   - Platform usage
   - Performance metrics
   - Revenue analytics

### Recruiter Guide

#### AI Talent Search
1. Navigate to **Talent Search**
2. Enter search criteria:
   - Job title
   - Required skills
   - Experience level
   - Location preferences
   - Salary range
3. Review AI-ranked candidates
4. View detailed match scores
5. Shortlist candidates

#### Candidate Management
1. Access **Candidates** section
2. Manage candidate profiles:
   - View full profiles
   - Add notes
   - Update status
   - Schedule interviews
   - Track communications

#### Proposal Creation
1. Go to **Proposals**
2. Create new proposal:
   - Select candidate
   - Choose job role
   - AI generates content
   - Customize as needed
   - Send to client

#### Client Management
1. Navigate to **Clients**
2. Manage client relationships:
   - View client profiles
   - Track engagements
   - Monitor proposals
   - Manage contracts

### Client Guide

#### Project Management
1. Access **Projects** or **Engagements**
2. View:
   - Active projects
   - Team members
   - Project timelines
   - Budget status
   - Deliverables

#### Proposal Review
1. Go to **Proposals**
2. Review received proposals:
   - Candidate details
   - Proposed terms
   - Pricing information
   - Timeline estimates
3. Approve or request changes

#### Budget Tracking
1. Navigate to **Billing**
2. Monitor:
   - Project costs
   - Budget allocation
   - Invoices
   - Payment status
   - ROI analysis

### Candidate Guide

#### Profile Management
1. Go to **My Profile**
2. Update:
   - Personal information
   - Skills and experience
   - Education background
   - Certifications
   - Portfolio links

#### CV Optimization
1. Upload your CV
2. Get AI-powered analysis:
   - ATS compatibility score
   - Keyword optimization suggestions
   - Missing skills identification
   - Industry-specific recommendations

#### Job Opportunities
1. Navigate to **Job Opportunities**
2. Browse available positions
3. Filter by:
   - Job type
   - Location
   - Salary range
   - Required skills
4. Apply to positions

#### Application Tracking
1. Go to **Applications**
2. View:
   - Application status
   - Interview schedules
   - Feedback and updates
   - Next steps

---

## AI Features

### AI Talent Matching

**Technology**: Groq AI (Mixtral-8x7b-32768)

**How It Works**:
- Analyzes job requirements using natural language processing
- Matches candidate profiles based on skills, experience, and fit
- Provides confidence scores and detailed explanations
- Learns from successful placements

**Best Practices**:
- Provide detailed job descriptions
- Include specific skill requirements
- Specify experience level needed
- Review match explanations for insights

### AI Proposal Generation

**Features**:
- Context-aware content generation
- Client-specific customization
- Professional formatting
- Branding integration
- Multiple template options

**Usage Tips**:
- Provide clear candidate and role information
- Review generated content before sending
- Customize templates to match your brand
- Save successful proposals as templates

### AI Chat Assistant

**Available to**: All roles

**Capabilities**:
- 24/7 availability
- Role-specific assistance
- Context-aware responses
- Feature explanations
- Troubleshooting help

**How to Use**:
- Click the chat icon in the sidebar
- Ask questions about features
- Get help with workflows
- Request explanations

### CV Analysis & Optimization

**Features**:
- ATS compatibility scoring
- Keyword optimization
- Skills gap identification
- Industry recommendations
- Format suggestions

---

## Settings & Configuration

### Profile Settings

**Access**: Click your profile → **Settings**

**Available Options**:
- Personal information
- Profile picture
- Contact details
- Notification preferences
- Theme (Light/Dark mode)
- Language preferences

### Account Settings

**Security**:
- Change password
- Two-factor authentication (if enabled)
- Session management
- Email verification

**Preferences**:
- Email notifications
- Dashboard layout
- Default views
- Export formats

### Integration Settings

**Available Integrations**:
- CRM systems (Odoo, Salesforce, HubSpot)
- Email services
- Calendar sync
- Document storage

**Setup Process**:
1. Navigate to **Settings** → **Integrations**
2. Select integration type
3. Enter credentials
4. Test connection
5. Enable synchronization

---

## Troubleshooting

### Login Issues

**Problem**: Cannot log in
- Verify email and password
- Check if account is active
- Ensure email is verified
- Try password reset

**Problem**: "Access Denied" message
- Verify your role assignment
- Contact admin for role updates
- Check email domain requirements

### Feature Access Issues

**Problem**: Cannot see certain features
- Verify your role has access
- Check permissions with admin
- Refresh browser cache
- Clear browser cookies

### AI Matching Issues

**Problem**: Low match scores
- Provide more detailed job requirements
- Ensure candidate profiles are complete
- Review match explanations
- Adjust search criteria

### Proposal Generation Issues

**Problem**: Generated content not suitable
- Provide more context
- Customize templates
- Review and edit generated content
- Save successful proposals as templates

### General Issues

**Problem**: Slow performance
- Check internet connection
- Clear browser cache
- Try different browser
- Contact support if persistent

**Problem**: Data not syncing
- Check integration settings
- Verify connection status
- Review sync logs
- Reconnect integration if needed

---

## Support

### Getting Help

**Email Support**: support@scalovate.com

**For Development & Fine-tuning**: Contact support@scalovate.com

**Response Time**: Typically within 24-48 hours

### Resources

- **Features Page**: `/features` - Comprehensive feature overview
- **About Page**: `/about` - Platform information
- **Documentation**: This user guide

### Reporting Issues

When reporting issues, please include:
- Your role and email
- Description of the issue
- Steps to reproduce
- Screenshots if applicable
- Browser and device information

---

## Quick Reference

### Keyboard Shortcuts

- **Ctrl/Cmd + K**: Quick search
- **Ctrl/Cmd + /** : Show keyboard shortcuts
- **Esc**: Close modals/dialogs

### Common Actions

**For Recruiters**:
- Talent Search → Find candidates
- Proposals → Create proposals
- Analytics → View performance

**For Clients**:
- Projects → Manage engagements
- Proposals → Review proposals
- Billing → Track costs

**For Candidates**:
- My Profile → Update information
- Job Opportunities → Browse jobs
- Applications → Track status

---

## Appendix

### Browser Compatibility

**Supported Browsers**:
- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

### Mobile Access

- Responsive design for tablets
- Mobile-optimized views
- Touch-friendly interface

### Data Privacy

- All data encrypted in transit and at rest
- SOC 2 compliant
- GDPR considerations
- Regular security audits

---

**© 2026 RecruitmentAI. A Scalovate Systems Solutions Product**

**For Development & Fine-tuning**: support@scalovate.com

---

*Last Updated: 2026*

