# GraphR - The Future of Educational Technology

**#CalculatingTheFuture**

What if smartphones weren't a distraction but a solution for classrooms, students, and administrators? GraphR is the world's first intuitive, all-in-one calculator app designed to make phones educational tools rather than distractions in the classroom.

## The Vision

Phone bans endanger student safety and harm learning. GraphR is the solution. By transforming smartphones from educational liabilities into trusted classroom tools, GraphR empowers educators to monitor student progress in real-time while maintaining academic integrity and student safety.

## What is GraphR?

GraphR is a comprehensive mobile and web application built for students, teachers, and administrators that combines:

- **Multi-mode Calculator**: Basic, scientific, and graphing capabilities in a single intuitive interface
- **Secure Exam Proctoring**: Patent-based app-switch detection enables fair testing without compromising student safety
- **Real-time Classroom Management**: Teachers monitor assessments and provide instant feedback
- **Learning Analytics**: Comprehensive tracking of student performance and learning patterns
- **Admin Dashboard**: District-level insights and compliance monitoring

## Key Features

### For Students

- **Multi-Mode Calculator**: Seamlessly switch between basic, scientific, and graphing modes
- **Secure Exam Participation**: Take proctored exams on personal devices with built-in anti-cheating measures
- **Real-time Feedback**: Receive immediate grades and detailed performance analytics
- **Learning Insights**: Track your progress over time with visual analytics
- **Classroom Integration**: Access course materials and join classroom communities
- **Profile Management**: Maintain secure academic profiles

### For Teachers

- **Exam Creation & Management**: Build assessments with flexible question types
- **Real-time Proctoring**: Monitor student devices during exams with violation detection
- **Instant Grading**: Automatic and manual grading capabilities with instant results
- **Performance Analytics**: Generate detailed reports on individual and class-wide performance
- **Classroom Management**: Create virtual classrooms, manage rosters, and track attendance
- **Grade Book**: Maintain comprehensive gradebooks with customizable grading schemes

### For Administrators

- **District Dashboard**: Monitor school-wide adoption, compliance, and learning outcomes
- **Policy Management**: Set district-level policies for exam security and data privacy
- **User Management**: Manage teacher and student accounts across schools
- **Analytics & Reporting**: Generate compliance reports for district leadership
- **Configuration**: Customize app behavior per district requirements

## The Patent-Based Proctoring System

GraphR implements a proprietary, non-invasive proctoring system:

- **App-Switch Detection**: Detects when students switch applications during exams in real-time
- **Real-time Alerts**: Notifies teachers instantly of potential cheating attempts
- **Violation Logging**: Records all suspicious activity with precise timestamps and context
- **Emergency Safety**: Always allows emergency calls—student safety is the top priority
- **No Device Lockdown**: Never restricts access to emergency features or core device functionality
- **Privacy-Preserving**: Does not monitor device content, media, or private information

This balanced approach protects academic integrity while respecting student privacy and safety.

## Getting Started

### Prerequisites

- **Node.js** 16+ and npm 8+
- **Expo CLI** (`npm install -g expo-cli`)
- **Git** for version control
- **Firebase CLI** (`npm install -g firebase-tools`) for backend deployment
- **iOS or Android device/emulator** for testing
- **Firebase account** with an active project
- **Apple Developer Program** membership (for iOS App Store submission)
- **Google Play Developer** account (for Android app submission)

### Quick Start - Development

```bash
# 1. Clone the repository
git clone https://github.com/pawankjajoo/GraphR-App.git
cd GraphR-App

# 2. Install dependencies
npm install

# 3. Configure Firebase
# Edit services/firebase.js with your Firebase project credentials
# Ensure your Firebase project has Authentication, Firestore, and Storage enabled

# 4. Start the Expo development server
npm start

# 5. Run on your platform
# For iOS
i  # or npm run ios

# For Android
a  # or npm run android

# For Web
w  # or npm run web
```

### Development with Expo Go

The easiest way to get started is using Expo Go:

1. Download Expo Go on your iOS/Android device
2. Run `npm start` in the project directory
3. Scan the QR code with your phone's camera or Expo Go app

## Cross-Platform Compilation

This React Native/Expo app compiles to both iOS and Android through EAS (Expo Application Services). There are no separate native implementations. The single codebase builds for both platforms.

```bash
# Build for iOS
eas build --platform ios --profile production

# Build for Android
eas build --platform android --profile production
```

## Project Structure

```
GraphR-App/
├── App.js                          # Main application entry point
├── app.json                        # Expo configuration and metadata
├── eas.json                        # Expo Application Services build config
├── package.json                    # Project dependencies and scripts
├── GraphR_Demo.html               # Interactive web-based calculator demo
│
├── constants/
│   └── graphr.js                  # App-wide constants, colors, and utilities
│
├── screens/                        # React Native screen components
│   ├── AuthScreen.js              # Login/registration interface
│   ├── AnalyticsScreen.js         # Student performance dashboards
│   ├── CalculatorScreen.js        # Basic and scientific calculator modes
│   ├── ClassroomScreen.js         # Classroom management interface
│   ├── ExamListScreen.js          # Available exams listing
│   ├── ExamModeScreen.js          # Proctored exam interface
│   ├── GradeBookScreen.js         # Teacher grade management
│   ├── GraphingScreen.js          # Graphing calculator functionality
│   ├── ProfileScreen.js           # User profile management
│   └── SettingsScreen.js          # App configuration and preferences
│
├── services/                       # Business logic and API integrations
│   ├── auth.js                    # Firebase authentication service
│   ├── firebase.js                # Firebase initialization and config
│   ├── firestoreService.js        # Database CRUD operations
│   ├── notifications.js           # Push notification handling
│   ├── examMonitor.js             # Proctoring and violation detection
│   ├── iap.js                     # In-app purchases
│   └── analyticsService.js        # Learning analytics tracking
│
├── web/                            # Web platform implementation
│   ├── index.html                 # Web entry point
│   ├── js/
│   │   ├── app.js                 # Web app main logic
│   │   ├── auth.js                # Web authentication
│   │   ├── calculator.js          # Web calculator
│   │   ├── classroom.js           # Web classroom interface
│   │   ├── exam.js                # Web exam interface
│   │   ├── graphing.js            # Web graphing
│   │   └── proctoring.js          # Web proctoring integration
│   └── styles/
│       ├── main.css               # Global styles
│       ├── calculator.css         # Calculator-specific styles
│       ├── classroom.css          # Classroom interface styles
│       └── exam.css               # Exam interface styles
│
├── archive/                        # Historical reference materials
│   ├── *.pdf                      # Patent and trademark documents
│   ├── 2016-web-archive/          # Original graphrapp.com website (2016)
│   └── 2016-2021-github-archive/  # Pitch decks, proposals, and guides
│
├── firestore.rules                # Firestore security rules
├── storage.rules                  # Firebase Storage security rules
├── README.md                      # Main project documentation (this file)
├── MOBILE_README.md               # Mobile-specific development guide
├── PROJECT_SUMMARY.md             # Comprehensive project overview
├── TECHNICAL_SUMMARY.md           # Technical architecture details
└── SUBMIT_GUIDE.md                # App Store submission instructions
```

### Key Directories Explained

- **screens/**: Contains all React Native screen components. Each screen represents a major feature or user interface.
- **services/**: Encapsulates all external service integrations and business logic, keeping screens clean.
- **web/**: Standalone web implementation allowing browser access without Expo.
- **archive/**: Historical materials including original website and early pitch decks for reference.
- **constants/**: Centralized configuration values, colors, and helper functions.

## Technology Stack

### Frontend
- **React Native**: Cross-platform mobile framework
- **Expo**: Simplified React Native development and deployment
- **React Hooks**: Modern state management approach
- **React Navigation**: Stack, tab, and drawer navigation

### Backend & Services
- **Firebase Authentication**: User signup, login, and profile management
- **Firestore**: Real-time NoSQL database for classrooms, exams, and analytics
- **Firebase Storage**: Secure file and media storage
- **Firebase Cloud Functions**: Serverless backend logic (optional)
- **Firebase Security Rules**: Fine-grained access control

### Cross-Platform
- **EAS (Expo Application Services)**: Managed build and deployment service
- **Expo Notifications**: Push notification delivery
- **React Native IAP**: In-app purchases for premium features (iOS/Android)

### Web Platform
- **HTML5 Canvas**: Graphing and visualization
- **Vanilla JavaScript**: Lightweight web implementation
- **Firebase REST API**: Backend communication

### Development Tools
- **Node.js/npm**: Dependency management and build tools
- **Firebase CLI**: Deploy rules and manage Firestore
- **Git**: Version control

## Configuration & Setup

### Step 1: Firebase Project Setup

```bash
# Create a new Firebase project at https://console.firebase.google.com
# Enable these services:
# 1. Authentication (Email/Password, Google Sign-in)
# 2. Firestore Database (Create in production mode)
# 3. Storage (Create bucket for media)
# 4. Cloud Functions (optional, for advanced features)
```

### Step 2: Update Firebase Credentials

Edit `services/firebase.js` with your Firebase project credentials:

```javascript
export const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};
```

### Step 3: Deploy Security Rules

```bash
# Install Firebase CLI
npm install -g firebase-tools

# Login to Firebase
firebase login

# Deploy Firestore and Storage rules
firebase deploy --only firestore:rules,storage
```

## Build & Deployment

### Development Build

```bash
eas build --platform ios --profile development
eas build --platform android --profile development
```

### Production Build

```bash
# Build for iOS production
eas build --platform ios --profile production

# Build for Android production
eas build --platform android --profile production
```

### App Store & Play Store Submission

For comprehensive submission instructions to Apple App Store and Google Play Store, see **SUBMIT_GUIDE.md** which includes:
- App metadata and screenshots
- Privacy policy and terms of service
- COPPA compliance verification
- Payment setup and in-app purchase configuration

## COPPA Compliance

GraphR is designed for educational use with minors. All implementations comply with the Children's Online Privacy Protection Act (COPPA):

- No collection of personal information without parental consent
- No advertising or behavioral tracking
- School district control over data
- Transparent privacy practices

## Support

For issues, feature requests, or questions:
- Email: support@graphr.app
- Website: graphr.app

## License

This project is proprietary software by GraphR App.

## Archive & Historical Materials

This repository includes historical reference materials in the `archive/` directory:

- **2016-web-archive/**: Original graphrapp.com website (2016) with landing pages and marketing materials
- **2016-2021-github-archive/**: Pitch decks, business proposals, and strategic documents from the company's early years
- **Patent & Trademark PDFs**: Legal documentation for GraphR's proprietary technology

These materials are preserved for historical reference and provide insight into the project's evolution.

## About

**GraphR** - Calculating the Future of Education

- **Tagline**: #CalculatingTheFuture
- **Mission**: Phone bans endanger student safety and harm learning. GraphR is the solution.
- **Status**: Actively developed and maintained
- **Organization**: GraphR App
- **Founder/Lead**: Pawan K Jajoo

---

Built with passion for education. Every line of code serves students and educators.

**Repository**: https://github.com/pawankjajoo/GraphR-App
**Website**: graphr.app
**Email**: support@graphr.app
