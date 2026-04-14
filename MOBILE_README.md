# GraphR Mobile Apps

Complete iOS and Android implementations of GraphR using native technologies.

## iOS Application (SwiftUI)

### Features
- **Calculator Module**: Basic, Scientific, and Graphing modes
- **Exam Taking**: Secure exam interface with real-time monitoring
- **Classroom Management**: Join and view classrooms
- **Analytics**: Track learning progress
- **User Profiles**: Manage account information
- **Teacher Dashboard**: Monitor exams and violations
- **Grade Book**: View and manage student grades

### Technology Stack
- **UI Framework**: SwiftUI
- **Backend**: Firebase (Auth, Firestore, Storage)
- **Notifications**: APNs (Apple Push Notifications)
- **Payment**: In-App Purchase Framework
- **Minimum iOS**: 14.0
- **Target iOS**: 17.0+

### Project Structure
```
ios/GraphR/
├── App/
│   └── GraphRApp.swift          # Main app entry point
├── Managers/
│   ├── AuthenticationManager.swift
│   ├── ExamManager.swift
│   └── ClassroomManager.swift
├── Views/
│   ├── LoginView.swift
│   ├── CalculatorView.swift
│   ├── ExamListView.swift
│   └── PlaceholderViews.swift
├── Models/
│   ├── User.swift
│   ├── Exam.swift
│   └── Classroom.swift
└── Resources/
    ├── Assets.xcassets
    └── Localizable.strings
```

### Building & Running

```bash
# Install dependencies (via SPM)
cd ios

# Open in Xcode
open GraphR.xcodeproj

# Run on simulator
⌘ + R

# Build for release
Product > Archive
```

### Configuration
Edit `Constants.swift` to configure:
- Firebase credentials
- API endpoints
- Color scheme
- Default classrooms

### Testing
Run unit and UI tests:
```bash
⌘ + U (Unit tests)
⌘ + I (UI tests)
```

---

## Android Application (Kotlin + Jetpack Compose)

### Features
- **Material 3 Design**: Modern Android UI components
- **Jetpack Compose**: Declarative UI framework
- **Firebase Integration**: Auth, Firestore, Cloud Messaging
- **Calculator**: Multi-mode calculation
- **Exam Module**: Proctoring with violation detection
- **Real-time Updates**: Live exam monitoring
- **Offline Support**: Local data caching

### Technology Stack
- **Language**: Kotlin
- **UI Framework**: Jetpack Compose
- **Architecture**: MVVM with Flow
- **Backend**: Firebase
- **Minimum SDK**: 28 (Android 9.0)
- **Target SDK**: 34 (Android 14)

### Project Structure
```
android/
├── app/src/main/
│   ├── kotlin/com/graphrapp/graphr/
│   │   ├── MainActivity.kt
│   │   ├── viewmodels/
│   │   │   ├── AuthViewModel.kt
│   │   │   ├── ExamViewModel.kt
│   │   │   └── ClassroomViewModel.kt
│   │   ├── models/
│   │   │   └── Models.kt
│   │   ├── ui/
│   │   │   ├── screens/
│   │   │   │   └── MainApp.kt
│   │   │   ├── composables/
│   │   │   └── theme/
│   │   │       └── Theme.kt
│   │   └── services/
│   │       ├── ProctoringService.kt
│   │       └── ExamService.kt
│   ├── res/
│   │   ├── values/
│   │   │   └── strings.xml
│   │   └── mipmap/
│   │       └── ic_launcher.xml
│   └── AndroidManifest.xml
├── build.gradle
└── settings.gradle
```

### Building & Running

```bash
# Build the app
cd android
./gradlew build

# Run on emulator
./gradlew installDebug

# Build release APK
./gradlew assembleRelease

# Build App Bundle for Play Store
./gradlew bundleRelease
```

### Configuration
Update in `build.gradle`:
```gradle
android {
    namespace 'com.graphrapp.graphr'
    defaultConfig {
        applicationId "com.graphrapp.graphr"
        minSdk 28
        targetSdk 34
    }
}
```

### Firebase Setup

1. Create Firebase project at firebase.google.com
2. Add Android app:
   - Package name: `com.graphrapp.graphr`
   - SHA-1 fingerprint from keystore
3. Download `google-services.json`
4. Place in `android/app/`

### Testing
```bash
# Unit tests
./gradlew testDebugUnitTest

# Instrumented tests
./gradlew connectedAndroidTest
```

---

## Shared Features

### Authentication
- Email/password login
- Email/password signup
- Google Sign-In support
- Session management
- Password reset

### Exam Management
- Create exams (Teacher only)
- Take exams (Student)
- Real-time proctoring
- Violation detection
- Automatic grading
- Result display

### Classroom System
- Teacher creates classrooms
- Students join with code
- Access classroom exams
- View materials
- Progress tracking

### Proctoring (Patent-based)
- App switching detection
- Tab/window monitoring (Web)
- Copy/paste prevention
- Right-click blocking
- Developer tools detection
- Real-time violation logging
- Auto-submit on excessive violations
- Emergency call support (never locks device)

### Analytics
- Score tracking
- Progress charts
- Performance metrics
- Learning recommendations
- Streak tracking

---

## Common Tasks

### Adding a new view/screen
1. Create view file in Views/ folder
2. Add navigation route
3. Implement state management
4. Add to tab navigation

### Integrating Firebase service
1. Create service file in Services/
2. Implement Firestore queries
3. Handle real-time listeners
4. Update ViewModel
5. Add error handling

### Customizing colors/branding
iOS: Update `GraphRColors` struct in GraphRApp.swift
Android: Update `Theme.kt` in ui/theme/

### Adding new exam question type
1. Update `ExamQuestion` model
2. Create question view component
3. Update grading logic
4. Test submission flow

---

## Deployment

### iOS App Store

```bash
# Create archive
Product > Archive

# Upload to App Store Connect
Distribute App > App Store Connect

# Review checklist
- App version updated
- Screenshots and preview videos
- Privacy policy linked
- IAP configured
- COPPA compliance verified
```

### Google Play Store

```bash
# Generate release keystore
keytool -genkey -v -keystore graphr-release.keystore \
  -alias graphr \
  -keyalg RSA -keysize 2048 \
  -validity 10000

# Sign release APK
./gradlew bundleRelease \
  -Pandroid.injected.signing.store.file=graphr-release.keystore \
  -Pandroid.injected.signing.store.password=<password> \
  -Pandroid.injected.signing.key.alias=graphr \
  -Pandroid.injected.signing.key.password=<password>

# Upload to Google Play Console
1. Sign in to play.google.com/apps/publish
2. Create new app
3. Upload app bundle
4. Complete store listing
5. Submit for review
```

---

## Troubleshooting

### iOS Build Issues
- **CocoaPods conflicts**: Run `pod update`
- **Firebase errors**: Check GoogleService-Info.plist
- **Swift version**: Update Xcode to latest

### Android Build Issues
- **Gradle sync fails**: Invalidate caches and restart
- **Firebase issues**: Verify google-services.json placement
- **SDK version**: Update to latest in build.gradle

### Runtime Issues

**Calculator not responding**
- Check JavaScript/computation engine
- Verify number parsing

**Exam timer problems**
- Ensure background execution allowed
- Check system time accuracy

**Proctoring not working**
- Verify app permissions granted
- Check notification settings
- Test on physical device

---

## Support

For issues or questions:
- Email: support@graphr.app
- Website: graphr.app
- GitHub Issues: [Create issue]

## License

Proprietary - GraphR App

## About

**GraphR** - Calculating the Future of Education
- **Motto**: #CalculatingTheFuture
- **Mission**: Make phones educational tools
- **Innovation**: Patent-based exam proctoring

---

Built with passion for education. Every line of code serves students.

Author: Pawan K Jajoo
