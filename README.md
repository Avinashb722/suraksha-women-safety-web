# 🛡️ Suraksha - Women's Safety Web Application

![Suraksha Banner](https://img.shields.io/badge/Suraksha-Women's%20Safety-purple?style=for-the-badge&logo=shield&logoColor=white)

## 🌟 Overview

**Suraksha** is a comprehensive women's safety web application designed to enhance security and provide immediate assistance in distress situations. Built with the MERN stack, it combines cutting-edge technology with community support to empower women to live fearlessly.

## ✨ Key Features

### 🚨 Emergency & Safety Features
- **Distress Signal** - One-click emergency alert system
- **Real-time Location Sharing** - GPS tracking with live location updates
- **Emergency Contacts** - Instant notification to trusted contacts
- **Shake Alert** - Motion-based emergency activation
- **Fake Call** - Disguised emergency call feature
- **Panic Button** - Always accessible emergency button

### 🤖 Smart Technology
- **AI Safety Assistant** - Intelligent chatbot for safety guidance
- **Smart Detection** - AI-powered threat detection
- **Weather Safety** - Weather-based safety recommendations
- **Safe Route Planning** - Optimized route suggestions

### 👥 Community & Support
- **Live Chat** - Real-time communication with support
- **Admin Chat** - Direct communication with administrators
- **Community Support** - Connect with nearby helpers
- **Incident Reporting** - Comprehensive incident documentation
- **Feedback System** - User feedback and suggestions

### 📍 Location & Tracking
- **Track Me** - Real-time location tracking
- **Police Map** - Nearby police station locations
- **Safety Zones** - Location-based safety reminders
- **Location Reminder** - Automated location alerts

### 📱 User Experience
- **Night Mode** - Dark theme for better visibility
- **Safety Tips** - Educational safety content
- **Safety Quiz** - Interactive safety knowledge testing
- **Helpline Numbers** - Quick access to emergency contacts
- **Profile Management** - User account management

## 🛠️ Technology Stack

### Frontend
- **React.js** - User interface framework
- **Bootstrap** - Responsive design framework
- **CSS3** - Custom styling and animations
- **JavaScript (ES6+)** - Modern JavaScript features

### Backend
- **Node.js** - Server-side runtime
- **Express.js** - Web application framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling

### Cloud & Storage
- **AWS S3** - Media file storage
- **Email Services** - Automated email notifications
- **SMS Integration** - Text message alerts
- **WhatsApp API** - Instant messaging notifications

## 🚀 Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- MongoDB
- AWS S3 Account
- Git

### Quick Start

1. **Clone the Repository**
   ```bash
   git clone https://github.com/Slacky300/WomenSafetyHackathonApp.git
   cd WomenSafetyHackathonApp
   ```

2. **Install Dependencies**
   ```bash
   # Install server dependencies
   cd server
   npm install
   
   # Install client dependencies
   cd ../client
   npm install
   ```

3. **Environment Configuration**
   
   Create `.env` file in the `server` directory:
   ```env
   # Database
   MONGODB_URI=mongodb://localhost:27017/suraksha
   
   # JWT
   JWT_SECRET=your_jwt_secret_key
   
   # AWS S3
   AWS_ACCESS_KEY_ID=your_aws_access_key
   AWS_SECRET_ACCESS_KEY=your_aws_secret_key
   AWS_BUCKET_NAME=your_s3_bucket_name
   AWS_REGION=your_aws_region
   
   # Email Configuration
   EMAIL_USER=your_email@gmail.com
   EMAIL_PASS=your_email_password
   
   # SMS Configuration
   SMS_API_KEY=your_sms_api_key
   
   # Server Configuration
   PORT=5000
   NODE_ENV=development
   ```

   Create `.env` file in the `client` directory:
   ```env
   REACT_APP_API_URL=http://localhost:5000
   REACT_APP_GOOGLE_MAPS_API_KEY=your_google_maps_api_key
   ```

4. **Start the Application**
   
   **Option 1: Using the batch file (Windows)**
   ```bash
   # Run from root directory
   start.bat
   ```
   
   **Option 2: Manual start**
   ```bash
   # Terminal 1 - Start server
   cd server
   npm start
   
   # Terminal 2 - Start client
   cd client
   npm start
   ```

5. **Access the Application**
   - Frontend: `http://localhost:3000`
   - Backend API: `http://localhost:5000`

## 📁 Project Structure

```
WomenSafetyHackathonApp/
├── client/                     # React frontend
│   ├── public/                 # Public assets
│   ├── src/
│   │   ├── Components/         # Reusable components
│   │   ├── pages/             # Page components
│   │   ├── styles/            # CSS files
│   │   ├── context/           # React context
│   │   ├── utils/             # Utility functions
│   │   └── App.js             # Main app component
│   └── package.json
├── server/                     # Node.js backend
│   ├── controllers/           # Route controllers
│   ├── models/               # Database models
│   ├── routes/               # API routes
│   ├── middlewares/          # Custom middlewares
│   ├── utils/                # Utility functions
│   ├── uploads/              # File uploads
│   └── server.js             # Server entry point
├── start.bat                 # Windows startup script
└── README.md
```

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile

### Emergency
- `POST /api/emergency/alert` - Send emergency alert
- `GET /api/emergency/contacts` - Get emergency contacts
- `POST /api/emergency/location` - Update location

### Incidents
- `POST /api/incidents/report` - Report incident
- `GET /api/incidents/` - Get incidents
- `PUT /api/incidents/:id` - Update incident

### Chat & Communication
- `POST /api/chat/message` - Send message
- `GET /api/chat/history` - Get chat history

## 🔒 Security Features

- **JWT Authentication** - Secure user authentication
- **Data Encryption** - Sensitive data protection
- **Input Validation** - Prevent malicious inputs
- **Rate Limiting** - API abuse prevention
- **CORS Protection** - Cross-origin request security
- **Privacy First** - User data protection

## 📱 Mobile Responsiveness

- Fully responsive design
- Touch-friendly interface
- Mobile-optimized features
- Progressive Web App (PWA) ready

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Team

- **Frontend Development** - React.js, UI/UX Design
- **Backend Development** - Node.js, API Development
- **Database Design** - MongoDB, Data Modeling
- **Cloud Integration** - AWS S3, Email Services

## 🆘 Support

For support and queries:
- 📧 Email: support@suraksha.com
- 📱 Emergency Helpline: 112
- 🌐 Website: [suraksha.com](https://suraksha.com)

## 🙏 Acknowledgments

- Thanks to all contributors and supporters
- Special thanks to women's safety organizations
- Inspired by the need for safer communities

---

**Made with ❤️ for Women's Safety**

![GitHub stars](https://img.shields.io/github/stars/Slacky300/WomenSafetyHackathonApp?style=social)
![GitHub forks](https://img.shields.io/github/forks/Slacky300/WomenSafetyHackathonApp?style=social)
![GitHub issues](https://img.shields.io/github/issues/Slacky300/WomenSafetyHackathonApp)
![GitHub license](https://img.shields.io/github/license/Slacky300/WomenSafetyHackathonApp)