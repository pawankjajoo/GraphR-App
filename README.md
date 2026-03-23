# GraphR: Interactive Mathematics Education Platform

A production-ready cross-platform mobile application that transforms smartphones into secure learning tools for mathematics education while preventing cheating through patent-pending exam monitoring technology.

## Overview

GraphR represents first principles thinking in education. Rather than banning phones in classrooms (which endangers student safety and limits educational access), GraphR leverages mobile devices as controlled, secure learning instruments. The platform is built on US Patents 10,339,827 B2 and 10,839,708 B2, which provide novel exam monitoring that detects unauthorized activities without locking down student devices.

## Key Features

### Interactive Calculator
- Basic, scientific, and graphing modes
- Step-by-step calculation history
- Real-time graphing with adjustable parameters
- Context-aware mode selection based on exam restrictions

### Secure Exam Mode
- Patent-pending detection of app switching and unapproved activities
- Maintains device openness for emergencies while preventing cheating
- Real-time activity logging and server notification
- Teacher-configurable calculator restrictions per exam

### Real-Time Analytics
- Learning progress tracking across multiple math domains
- Performance metrics for students and classes
- Skill assessments and improvement insights
- Exam history with detailed score breakdowns

### Classroom Management
- Teacher dashboards for class overview and management
- Student roster management with performance tracking
- Custom exam creation with question banks
- Activity log review for exam integrity verification

### Cloud Synchronization
- Automatic sync of exam data and grades
- Offline-first design ensures functionality without connectivity
- Cross-device synchronization
- Real-time updates during active sessions

## System Architecture

### Technology Stack
- **Mobile Apps:** React Native with Expo (iOS & Android)
- **Demo/Web:** Single-file HTML implementation for quick testing
- **Backend:** Node.js/Express with real-time WebSocket support
- **Database:** Firebase/PostgreSQL for cloud data storage
- **State Management:** React Context API for predictable app state
- **Offline Storage:** AsyncStorage for local data persistence

### Project Structure
```
GraphR App Production/
├── App.js                          # Main app entry point
├── app.json                        # Expo configuration
├── package.json                    # Dependencies and scripts
├── GraphR_Demo.html               # Interactive web demo
├── README.md                       # This file
├── TECHNICAL_SUMMARY.md           # Detailed technical documentation
│
├── screens/                        # Screen components
│   ├── AuthScreen.js              # Login/registration
│   ├── StudentHomeScreen.js       # Student dashboard
│   ├── TeacherDashboardScreen.js  # Teacher management
│   ├── CalculatorScreen.js        # Calculator interface
│   ├── ExamModeScreen.js          # Secure exam environment
│   ├── AnalyticsScreen.js         # Performance metrics
│   └── SettingsScreen.js          # User preferences
│
├── context/                        # State management
│   ├── AuthContext.js             # Authentication state
│   ├── ClassroomContext.js        # Classroom data
│   └── ExamModeContext.js         # Exam session state
│
└── services/                       # Business logic
    ├── DatabaseService.js         # Local data persistence
    └── NetworkService.js          # API communication
```

## Getting Started

### Prerequisites
- Node.js 14+ and npm
- Expo CLI: `npm install -g expo-cli`
- iOS Simulator or Android Emulator (or physical device)

### Installation
```bash
# Install dependencies
npm install

# Start development server
npm start

# Run on iOS
npm run ios

# Run on Android
npm run android

# Run on web
npm run web
```

### Demo
Open `GraphR_Demo.html` in any web browser for an interactive walkthrough of the platform features without requiring installation.

## Patent Technology

### US 10,339,827 B2
**Computer-Implemented System and Method for Administering an Examination**
- Filed: November 1, 2016
- Issued: July 2, 2019
- Covers mobile-based exam administration with real-time activity monitoring

### US 10,839,708 B2
**Computer-Implemented System and Method for Administering an Examination** (Continuation)
- Filed: May 8, 2019
- Issued: November 17, 2020
- Extends coverage to enhanced monitoring and improved detection algorithms

## Key Innovation

Unlike traditional lockdown browsers that restrict device functionality, GraphR uses intelligent monitoring to detect violations while keeping devices fully functional. This approach:

1. Maintains student safety through available emergency communication
2. Prevents cheating through real-time activity detection
3. Respects student autonomy while enforcing academic integrity
4. Provides teachers with comprehensive exam oversight

## User Roles

### Students
- Access calculators and learning tools
- Join classrooms using class codes
- Take secure exams with activity monitoring
- View personal performance analytics
- Track learning progress across subjects

### Teachers
- Create and manage classrooms
- Build custom exams with question banks
- Configure per-exam calculator restrictions
- Monitor exam activity in real-time
- Review exam results and analytics
- Identify cheating attempts through activity logs

## Development Features

### Comprehensive Comments
Every component includes detailed docstring comments explaining:
- Purpose and responsibilities
- Key state management decisions
- User interaction flows
- Patent implementation details

### Modular Architecture
- Clear separation of concerns
- Reusable context providers
- Service layer for business logic
- Easy to extend with new features

### Offline Support
- Exam data syncs automatically
- Activity logs queue for transmission
- App functions without connectivity
- Automatic sync when connection restored

### Real-Time Monitoring
- Detects app switching and unapproved activities
- Logs all student interactions with timestamps
- Sends alerts to examination server
- Maintains audit trail for integrity verification

## Testing Credentials

For development and testing:
- Email: demo@graphr.edu
- Password: demo123
- Role: Student or Teacher

## Production Deployment

### iOS
```bash
eas build --platform ios --auto-submit
```

### Android
```bash
eas build --platform android
```

### Web
The app is web-compatible via Expo Web or can be packaged as a progressive web app.

## Security Considerations

- All sensitive data encrypted in transit (TLS)
- Password hashing using bcrypt
- JWT tokens for session management
- Activity logs signed and verified
- FERPA/COPPA compliance built-in

## Performance Optimization

- Lazy loading of screens and data
- Memoization of expensive calculations
- Efficient list rendering
- Background task management
- Network request batching

## Support and Documentation

- Technical documentation: See TECHNICAL_SUMMARY.md
- Patent details: US 10,339,827 B2 and US 10,839,708 B2
- API documentation: Available in backend repository
- User guides: Embedded in-app help system

## License

Copyright 2026. All rights reserved.

GraphR is based on patented technology and is provided as-is for educational institutions and authorized users.

## Contributing

For bug reports, feature requests, or contributions, please contact the development team.

---

Built with precision for education. Calculating the future, one equation at a time.
