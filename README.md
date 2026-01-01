# RecruitmentAI

**AI-Powered Staff Augmentation Platform**

A comprehensive AI-powered recruitment platform that enables companies to discover, qualify, and engage talent using artificial intelligence. Built and owned by Scalovate Systems Solutions.

---

## 🚀 Features

### Core AI Capabilities
- **AI Talent Matching**: 95% accuracy in candidate-job matching using Groq AI
- **Smart Proposal Generation**: AI-powered professional proposal creation
- **CV Analysis & Optimization**: Automated CV processing with ATS compatibility scoring
- **AI Chat Assistant**: 24/7 role-specific AI assistance

### Platform Features
- **CRM Integration**: Seamless sync with Odoo, Salesforce, and HubSpot
- **Real-time Analytics**: Comprehensive dashboards and insights
- **Role-Based Access**: 5 distinct user roles with tailored experiences
- **Document Management**: Secure file storage and management
- **Team Collaboration**: Real-time updates and shared workspaces
- **Time Tracking**: Project timeline and resource monitoring

### Technology Stack
- **Frontend**: React 19, Vite, Tailwind CSS, Framer Motion
- **Backend**: Node.js, Express, Firebase Admin SDK
- **AI**: Groq AI (Mixtral-8x7b-32768)
- **Database**: Firebase Firestore
- **Storage**: Firebase Storage
- **Authentication**: Firebase Auth

---

## 📋 User Roles

1. **Super Admin**: Full system control and configuration
2. **Admin**: Platform management and user oversight
3. **Recruiter**: AI-powered talent acquisition
4. **Client**: Project management and team oversight
5. **Candidate**: Profile management and job applications

---

## 🛠️ Setup Instructions

### Prerequisites
- Node.js 18+ and npm
- Firebase project
- Groq API key (for AI features)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/rulhaq/recruitment-ai.git
   cd recruitment-ai
   ```

2. **Install dependencies**
   ```bash
   # Install root dependencies
   npm install
   
   # Install client dependencies
   cd client
   npm install
   
   # Install server dependencies
   cd ../server
   npm install
   ```

3. **Configure environment variables**
   
   Copy `environment.example` to `.env` in root directory
   
   Copy relevant sections to:
   - `client/.env`
   - `server/.env`
   
   Fill in your actual values:
   - Firebase configuration (from Firebase Console)
   - Groq API key (from https://console.groq.com/)
   - Other service credentials

4. **Start development servers**
   ```bash
   # From root directory
   npm run dev
   ```
   
   Or start separately:
   ```bash
   # Terminal 1 - Client
   cd client
   npm run dev
   
   # Terminal 2 - Server
   cd server
   npm start
   ```

5. **Access the application**
   - Client: http://localhost:5173
   - Server API: http://localhost:5000

---

## 📚 Documentation

- **[USER_GUIDE.md](./USER_GUIDE.md)**: Comprehensive user guide with all features
- **[LICENSE](./LICENSE)**: MIT License with Scalovate Systems Solutions terms
- **[features.html](./features.html)**: Standalone features page for marketing

---

## 🔐 Security

- All environment variables and credentials are excluded via `.gitignore`
- Firebase credentials must be configured locally
- Never commit `.env` files or credentials
- Use secure practices for API keys

---

## 📝 License

This project is licensed under the MIT License with additional terms from Scalovate Systems Solutions.

**Key License Terms**:
- Educational and business use allowed
- Attribution to Scalovate Systems Solutions required
- No resale without permission
- For development and fine-tuning, contact: support@scalovate.com

See [LICENSE](./LICENSE) for full details.

---

## 🏢 Product Ownership

**Built and Owned by**: Scalovate Systems Solutions

**Contact**: support@scalovate.com

**For Development & Fine-tuning**: support@scalovate.com

---

## 🤝 Contributing

For development, customization, or fine-tuning inquiries, please contact:
- **Email**: support@scalovate.com

All development work must be coordinated through Scalovate Systems Solutions.

---

## 📞 Support

- **Email**: support@scalovate.com
- **Documentation**: See [USER_GUIDE.md](./USER_GUIDE.md)
- **Features**: See [features.html](./features.html)

---

## ⚠️ Important Notes

- **Credentials**: Never commit Firebase credentials, API keys, or `.env` files
- **Environment Setup**: Always use `.env.example` as a template
- **Firebase Setup**: Ensure Authentication and Firestore are properly configured
- **AI Features**: Groq API key required for AI-powered features

---

**© 2026 RecruitmentAI. A Scalovate Systems Solutions Product**
