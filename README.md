# GraphR

**#CalculatingTheFuture**

What if smartphones weren't a distraction but a solution for classrooms, students and administrators? GraphR is an intuitive, all-in-one calculator app designed to make phones educational tools rather than distractions in the classroom.

## What is GraphR?

GraphR is a React Native mobile app and web application built for students, teachers, and administrators. It combines:

- **Multi-mode Calculator**: Basic, scientific, and graphing capabilities
- **Secure Exam Proctoring**: Patent-based app-switch detection for fair testing without compromising student safety
- **Real-time Classroom Management**: Teachers monitor assessments and provide instant feedback
- **Learning Analytics**: Student performance tracking and analysis
- **In-app Purchases**: Subscription tiers (Free, Pro, School)

## Features

### Student Features

- Multi-mode calculator (basic, scientific, graphing)
- Take proctored exams with violation detection
- Real-time grade feedback and performance analytics
- Join classrooms using enrollment codes
- View learning progress and trends
- User profile management with avatar support
- Push notifications for exam updates and grades

### Teacher Features

- Create exams with custom questions and restrictions
- Real-time exam monitoring with violation alerts
- Instant grading (auto and manual)
- View student performance analytics
- Manage classroom rosters
- Grade book with weighted scoring
- Custom calculator mode restrictions per exam

### Exam Proctoring (Patent-Based)

- App-switch detection during exams in real-time
- Violation logging with timestamps
- Teacher notifications of potential cheating
- Emergency calls always allowed (no device lockdown)
- No access to device content or private data
- Automatic violation threshold tracking

## Technology Stack

### Frontend
- React Native 0.76.9
- Expo 52.0.0 (managed build & deployment)
- React Hooks for state management
- React Navigation for tab/stack navigation
- Inter font family

### Backend & Services
- Firebase Authentication (email/password + Google SSO)
- Firestore (real-time database for classrooms, exams, results)
- Firebase Storage (media storage)
- Firebase Cloud Messaging (push notifications)
- Expo Notifications (local and remote)

### Cross-Platform
- EAS (Expo Application Services) for iOS/Android builds
- React Native IAP for in-app purchases
- Expo Haptics for vibration feedback

### Web Platform
- Vanilla JavaScript (no framework)
- HTML5 Canvas for graphing
- localStorage for offline data
- Firebase REST API for backend

## Quick Start

### Prerequisites

- Node.js 16+ and npm 8+
- Expo CLI (`npm install -g expo-cli`)
- Firebase account with active project
- iOS/Android device or emulator for testing

### Setup

```bash
# Clone repository
git clone https://github.com/pawankjajoo/GraphR-App.git
cd GraphR-App

# Install dependencies
npm install

# Configure Firebase
# Edit services/firebase.js with your credentials

# Start development server
npm start

# Run on device/emulator
# iOS: i   or npm run ios
# Android: a   or npm run android
# Web: w   or npm run web
```

### With Expo Go

Easiest development approach:

1. Download Expo Go (iOS or Android)
2. Run `npm start`
3. Scan QR code with Expo Go app

## Building for Production

### iOS

```bash
eas build --platform ios --profile production
```

Then submit using:

```bash
eas submit --platform ios
```

Requires Apple Developer account with Team ID configured in eas.json.

### Android

```bash
eas build --platform android --profile production
```

Then submit using:

```bash
eas submit --platform android
```

Requires Google Play service account key configured in eas.json.

## Project Structure

```
GraphR-App/
âââ App.js                    # Main entry point, auth gate, tab navigation
âââ app.json                  # Expo configuration
âââ eas.json                  # Build and deployment config
âââ package.json              # Dependencies
âââ firestore.rules           # Firestore security rules
âââ storage.rules             # Storage security rules
âââ GraphR_Demo.html          # Web-based demo with calculator
â
âââ constants/
â   âââ graphr.js             # Colors, layouts, demo data, utilities
â
âââ screens/                  # React Native components
â   âââ AuthScreen.js         # Login/signup with role selection
â   âââ SplashScreen.js       # App startup screen
â   âââ CalculatorScreen.js   # Multi-mode calculator UI
â   âââ GraphingScreen.js     # Graphing calculator
â   âââ ExamModeScreen.js     # Exam taking interface
â   âââ ExamListScreen.js     # Browse available exams
â   âââ ClassroomScreen.js    # Join classrooms
â   âââ TeacherDashboardScreen.js  # Exam monitoring (teachers)
â   âââ GradeBookScreen.js    # Grade management
â   âââ AnalyticsScreen.js    # Performance analytics
â   âââ ProfileScreen.js      # User profile, subscriptions
â   âââ SettingsScreen.js     # App preferences
â
âââ services/                 # Business logic
â   âââ firebase.js           # Firebase initialization
â   âââ auth.js               # Authentication (email, Google SSO)
â   âââ firestoreService.js   # Database operations
â   âââ notifications.js      # Push notifications
â   âââ examMonitor.js        # App-switch detection (proctoring)
â   âââ iap.js                # In-app purchases
â   âââ analyticsService.js   # Learning analytics
â
âââ web/                      # Web implementation
â   âââ index.html            # Web interface
â   âââ js/
â   â   âââ app.js            # Main app logic
â   â   âââ calculator.js     # Calculator engine
â   â   âââ graphing.js       # Graphing functions
â   â   âââ exam.js           # Exam interface
â   â   âââ classroom.js      # Classroom features
â   â   âââ auth.js           # Authentication
â   â   âââ proctoring.js     # Violation detection
â   âââ styles/
â       âââ main.css
â       âââ calculator.css
â       âââ exam.css
â       âââ classroom.css
â
âââ archive/                  # Historical materials
â   âââ 2016-web-archive/     # Original website (2016)
â   âââ 2016-2021-github-archive/  # Early pitch decks, patents
â
âââ Documentation
    âââ README.md             # This file
    âââ MOBILE_README.md      # Platform-specific setup
    âââ TECHNICAL_SUMMARY.md  # Architecture details
    âââ PROJECT_SUMMARY.md    # Feature overview
    âââ LAUNCH_PLAN.md        # Release strategy
    âââ SUBMIT_GUIDE.md       # App Store submission
```

## Firebase Configuration

### Setup

1. Create Firebase project at https://console.firebase.google.com
2. Enable services:
   - Authentication (Email/Password, Google Sign-in)
   - Firestore Database (production mode)
   - Storage (for media)
   - Cloud Messaging (for notifications)

3. Add credentials to `services/firebase.js`:

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

### Deploy Security Rules

```bash
firebase login
firebase deploy --only firestore:rules,storage
```

## Firestore Data Structure

- `users/{userId}` - User profiles and settings
- `classrooms/{classroomId}` - Classroom metadata (teacher, students, code)
- `exams/{examId}` - Exam definitions (questions, duration, restrictions)
- `examResults/{resultId}` - Student exam responses and grades
- `examViolations/{violationId}` - App-switch violations log
- `calculatorHistory/{userId}` - Student calculator usage for analytics
- `classroomEnrollments/{enrollmentId}` - Enrollment records
- `subscriptions/{userId}` - Subscription status

## In-App Purchase Setup

Configure App Store Connect and Google Play with product IDs:
- `com.graphrapp.graphr.pro_monthly` - Monthly subscription ($4.99)
- `com.graphrapp.graphr.pro_annual` - Annual subscription ($49.99)

Update eas.json with Apple Team ID and Google Play service account key for submission.

## Features & Implementation Status

| Feature | Status | Notes |
|---------|--------|-------|
| Basic Calculator | Complete | All arithmetic operations |
| Scientific Mode | Complete | Trig, log, ln, x^2, sqrt, etc. |
| Graphing | Complete | Real-time equation visualization |
| Student Login | Complete | Email/password + Google SSO |
| Teacher Login | Complete | Role-based dashboard |
| Create Exams | Complete | Teacher-only feature |
| Take Exams | Complete | Timer and violation detection |
| App-Switch Detection | Complete | Patent-based proctoring |
| Real-time Grading | Complete | Automatic score calculation |
| Classroom Join | Complete | Code-based enrollment |
| Analytics | Complete | Performance trends and metrics |
| Grade Book | Complete | Teacher view of all results |
| Push Notifications | Complete | Exam alerts and grade updates |
| In-App Purchases | Complete | Free/Pro/School tiers |
| Web Demo | Complete | GraphR_Demo.html |

## Web Demo

Open `GraphR_Demo.html` in a browser for an interactive demo. Supports:
- Full calculator functionality (basic, scientific)
- Simulated exam taking
- Demo classroom management
- Analytics visualization

No setup required - runs entirely in browser with localStorage.

## COPPA Compliance

App complies with Children's Online Privacy Protection Act:
- No tracking or behavioral analytics
- Parental consent required for minors
- School district data control
- No third-party advertising
- Transparent data policies

## Licensing & Attributions

- **License**: Proprietary (GraphR App)
- **Patents**: App-switch detection patent pending
- **Trademark**: GraphR - #CalculatingTheFuture
- **Founder**: Pawan K Jajoo
- **Repository**: https://github.com/pawankjajoo/GraphR-App

## Known Issues & Limitations

See TECHNICAL_SUMMARY.md for implementation status of advanced features.

## Support & Documentation

- **Website**: graphr.app
- **Email**: support@graphr.app
- **Mobile Setup**: MOBILE_README.md
- **Submission**: SUBMIT_GUIDE.md
- **Architecture**: TECHNICAL_SUMMARY.md
- **Features**: PROJECT_SUMMARY.md
