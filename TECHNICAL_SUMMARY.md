# GraphR - Technical Architecture Summary

## Overview

GraphR is a React Native mobile application built with Expo, Firebase backend, and a focus on educational integrity through patent-based exam proctoring.

## Architecture

### Presentation Layer (React Native)

**App.js (571 lines)**
- Central orchestrator for entire app
- Font loading and splash screen management
- Firebase auth gate (student vs teacher role selection)
- Global state: auth, user profile, exam data, calculator state
- Tab navigation system (5-6 tabs per role)
- Toast & notification animation system
- Real-time exam monitoring integration

**Screens (12+)**
1. **SplashScreen.js**: Branded splash with #CalculatingTheFuture tagline
2. **AuthScreen.js**: Email/password + Google SSO login with role selection
3. **CalculatorScreen.js**: Multi-mode calculator (Basic, Scientific, Graphing)
4. **GraphingScreen.js**: Interactive equation graphing
5. **ExamModeScreen.js**: Secure exam interface with timer and violation detection
6. **ExamListScreen.js**: Browse and start exams
7. **ClassroomScreen.js**: Join and manage classrooms
8. **TeacherDashboardScreen.js**: Real-time exam monitoring
9. **GradeBookScreen.js**: Instant grading and results
10. **AnalyticsScreen.js**: Learning performance dashboards
11. **ProfileScreen.js**: User profile and subscription management
12. **SettingsScreen.js**: App preferences and configurations

### State Management

- React Hooks (useState, useEffect, useRef, useCallback)
- Global state passed via props
- No Redux/Context (kept simple for clarity)
- Real-time listeners via Firebase onSnapshot

### Business Logic Layer (Services)

**auth.js**
- Firebase authentication (email/password, Google SSO)
- Session management
- User profile updates
- Password reset

**firebase.js**
- Centralized Firebase initialization
- Firestore, Storage, Authentication instances
- Configuration management

**firestoreService.js**
- Classroom CRUD operations
- Exam creation and updates
- Grade recording
- Student analytics queries
- Violation logging

**notifications.js**
- Device registration for push notifications
- Notification routing based on type
- Badge management
- Exam alerts and grade notifications

**examMonitor.js (PATENT CORE)**
- App state change detection
- Violation logging with timestamps
- Real-time callback system
- Threshold-based auto-submission
- Never locks device (emergency call priority)

**iap.js**
- Product catalog loading
- Purchase processing
- Receipt validation
- Subscription management
- Restore purchases

**analyticsService.js**
- Average score calculation
- Trend detection (up/down/stable)
- Skill mastery computation
- Personalized recommendations
- Class comparison metrics
- Time-on-task analysis

### Data Layer (Firebase)

**Firestore Collections**
- `users/`: User profiles (name, email, settings)
- `classrooms/`: Classroom definitions (teacher, students, code)
- `exams/`: Exam metadata (questions, duration, restrictions)
- `examResults/`: Student responses and grades
- `examViolations/`: App-switch violations log
- `calculatorHistory/`: Student calculator operations
- `subscriptions/`: Subscription status per user
- `classroomEnrollments/`: Student-classroom relationships

**Security Rules**
- Students can only access their own data
- Teachers can access classroom and exam data
- Exam violations are teacher-accessible only
- Results are immutable once submitted
- Student grades are private (student + teacher)

**Storage**
- Profile pictures (5 MB max)
- Exam attachments (50 MB max)
- Classroom materials (50 MB max)

### Configuration

**app.json** (Expo config)
- iOS: com.graphrapp.graphr
- Android: com.graphrapp.graphr
- Plugins: expo-font, expo-notifications, react-native-iap
- Permissions: location, camera, notifications
- Splash screen configuration

**eas.json** (Build config)
- Development: simulator builds for testing
- Preview: internal distribution builds
- Production: App Store and Google Play submissions

**constants/graphr.js** (App constants)
- Color palette (education blue #1a73e8, success green #0f9d58)
- Calculator button layouts
- Demo classrooms and exams
- Subscription tiers
- IAP product definitions
- Grading utilities

## Patent Implementation: Exam Proctoring

The core innovation is in `services/examMonitor.js`:

### How It Works

1. **Initialization**: When student starts exam, monitor begins
2. **App State Tracking**: System listens for app state changes (active, inactive, background)
3. **Violation Detection**: If app goes to background and returns, this indicates app switching
4. **Logging**: Violation recorded with timestamp, student ID, exam ID
5. **Notification**: Teacher receives real-time alert
6. **Escalation**: If violations exceed threshold (default 5), exam auto-submits
7. **Safety**: Device is never locked (emergency calls always possible)

### Why This Matters

- Prevents cheating (can't use other apps during exam)
- Maintains safety (student can still call 911)
- Fair grading (equal testing conditions)
- Privacy-respecting (no device surveillance)
- Teacher-controlled (discipline at teacher discretion)

## Data Flow Example: Taking an Exam

```
1. Student clicks "Start Exam"
   -> ExamModeScreen opened
   -> examMonitor.startMonitoring() called
   -> Timer starts counting down

2. Student tries to switch to another app
   -> AppState listener detects backgrounding
   -> Violation created with timestamp
   -> violationCallbacks triggered
   -> Toast shown to student
   -> In production, logs to Firestore + notifies teacher

3. Student finishes or time expires
   -> recordExamResult() called
   -> Score calculated and stored
   -> examMonitor.stopMonitoring() called
   -> Results displayed in GradeBookScreen

4. Teacher reviews in dashboard
   -> TeacherDashboardScreen shows active exams
   -> Violations visible for monitoring
   -> Can open exam monitor for live tracking
```

## Key Decisions

### Why React Native + Expo?

- Single codebase for iOS + Android
- Faster development iteration
- Built-in expo-notifications
- Easy testing on physical devices
- OTA updates capability

### Why Firebase?

- Real-time data sync (exams update live)
- Scalable auth system
- Simple security rules
- No backend infrastructure needed
- Good SDKs for mobile

### Why Not Complex State Management?

- App logic is straightforward
- Props drilling is acceptable for 12 screens
- Firebase listeners handle real-time updates
- Keeps codebase lean and understandable

## Testing Considerations

- **Unit Tests**: Calculator functions, grade calculations, analytics
- **Integration Tests**: Firebase operations, exam flow
- **Manual Testing**: Exam violations, app switching, notifications
- **Device Testing**: Real devices for notification and purchase testing

## Performance Optimizations

- Memoization of expensive components (useMemo, useCallback)
- Lazy loading of screens
- Efficient Firestore queries (indexes on common fields)
- Image optimization in profile pictures
- Pagination for large exam result lists

## COPPA Compliance

- No behavioral advertising
- No tracking/analytics (except educational)
- School district data control
- Transparent privacy practices
- Parental consent flow (in sign-up)

## Scalability

- Firestore handles thousands of concurrent users
- Cloud Functions (optional) for server-side validation
- Storage CDN for exam materials
- Notification system scales with Firebase

## Future Enhancements

- Cloud Functions for server-side grading
- Real-time collaboration in classrooms
- Video tutoring integration
- Offline mode with sync
- Advanced analytics dashboards
- Hardware keyboard support
- Accessibility improvements

---

Built by GraphR App
