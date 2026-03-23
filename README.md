# GraphR - Educational Calculator App

A mobile application combining a multi-mode calculator with exam proctoring and classroom management tools.

## What is GraphR?

GraphR is a mobile application built for students and teachers that combines:

- **All-in-one calculator**: Basic, scientific, and graphing modes in one app
- **Secure exam mode**: Patent-based app-switch detection ensures fair testing
- **Real-time analytics**: Track student progress with learning insights
- **Classroom management**: Teachers can create exams, monitor assessments, and grade in real-time

## Key Features

### For Students

- Multi-mode calculator (Basic, Scientific, Graphing)
- Take secure exams with proctoring
- View real-time feedback and grades
- Track your learning progress
- Join classrooms and access materials

### For Teachers

- Create and manage exams
- Real-time exam monitoring with violation alerts
- Instant grading and analytics
- Monitor student performance across classrooms
- Generate performance reports

## The Patent

GraphR implements a unique patent-based proctoring system:

- Detects when students switch apps during exams
- Notifies teachers in real-time of violations
- Logs all violations with timestamps
- Allows emergency calls (student safety first)
- Never locks the device

This approach balances academic integrity with student safety and privacy.

## Getting Started

### Prerequisites

- Node.js 16+ and npm
- Expo CLI (`npm install -g expo-cli`)
- iOS or Android device/emulator
- Firebase account with project

### Installation

```bash
# Install dependencies
npm install

# Set environment variables
# Update services/firebase.js with your Firebase credentials

# Start development server
npm start

# Run on iOS
npm run ios

# Run on Android
npm run android

# Run on web
npm run web
```

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
GraphR App Production/
├── App.js                    # Main app entry point
├── app.json                  # Expo configuration
├── eas.json                  # EAS build configuration
├── package.json              # Dependencies
├── constants/
│   └── graphr.js            # App constants and utilities
├── screens/                  # Screen components
│   ├── SplashScreen.js
│   ├── AuthScreen.js
│   ├── CalculatorScreen.js
│   ├── GraphingScreen.js
│   ├── ExamModeScreen.js
│   ├── ExamListScreen.js
│   ├── ClassroomScreen.js
│   ├── TeacherDashboardScreen.js
│   ├── GradeBookScreen.js
│   ├── AnalyticsScreen.js
│   ├── ProfileScreen.js
│   └── SettingsScreen.js
├── services/                 # Service layer
│   ├── auth.js              # Firebase authentication
│   ├── firebase.js          # Firebase initialization
│   ├── firestoreService.js  # Database operations
│   ├── notifications.js     # Push notifications
│   ├── examMonitor.js       # Exam proctoring system
│   ├── iap.js               # In-app purchases
│   └── analyticsService.js  # Analytics tracking
├── legal/
│   ├── privacy-policy.html
│   └── terms-of-service.html
├── web/                      # Web platform version
├── firestore.rules          # Firestore security rules
├── storage.rules            # Firebase storage rules
└── SUBMIT_GUIDE.md          # App Store submission guide
```

## Technology Stack

- **Frontend**: React Native with Expo
- **Backend**: Firebase (Auth, Firestore, Storage)
- **Payments**: React Native IAP (App Store + Google Play)
- **Notifications**: Expo Notifications
- **State Management**: React Hooks

## Configuration

### Firebase Setup

1. Create a Firebase project at firebase.google.com
2. Update `services/firebase.js` with your credentials
3. Deploy security rules:

```bash
firebase deploy --only firestore:rules,storage
```

### App Store Submission

See `SUBMIT_GUIDE.md` for detailed instructions on submitting to:
- Apple App Store
- Google Play Store

## Build & Deployment

### Development Build

```bash
eas build --platform ios --profile development
eas build --platform android --profile development
```

### Production Build

```bash
# iOS
npm run build:ios
npm run submit:ios

# Android
npm run build:android
npm run submit:android
```

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

## About

**GraphR** - Calculating the Future of Education
- Tagline: #CalculatingTheFuture
- Phone bans endanger student safety and harm learning. GraphR is the solution.

---

Built with passion for education. Every line of code serves students.

Author: Pawan K Jajoo
