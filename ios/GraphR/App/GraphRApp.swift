import SwiftUI
import Firebase

/**
 GraphR iOS Application
 The world's first intuitive, all-in-one calculator app for education
 #CalculatingTheFuture
 */

@main
struct GraphRApp: App {
  @UIApplicationDelegateAdaptor(AppDelegate.self) var appDelegate
  @StateObject var authManager = AuthenticationManager.shared
  @StateObject var examManager = ExamManager.shared
  @StateObject var classroomManager = ClassroomManager.shared

  var body: some Scene {
    WindowGroup {
      if authManager.isAuthenticated {
        MainTabView()
          .environmentObject(authManager)
          .environmentObject(examManager)
          .environmentObject(classroomManager)
      } else {
        LoginView()
          .environmentObject(authManager)
      }
    }
  }
}

// MARK: - App Delegate

class AppDelegate: UIResponder, UIApplicationDelegate {
  func application(
    _ application: UIApplication,
    didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]?
  ) -> Bool {
    // Initialize Firebase
    FirebaseApp.configure()

    // Register for push notifications
    UNUserNotificationCenter.current().requestAuthorization(options: [.alert, .sound, .badge]) { granted, _ in
      DispatchQueue.main.async {
        UIApplication.shared.registerForRemoteNotifications()
      }
    }

    return true
  }

  func application(
    _ application: UIApplication,
    didReceiveRemoteNotification userInfo: [AnyHashable: Any],
    fetchCompletionHandler completionHandler: @escaping (UIBackgroundFetchResult) -> Void
  ) {
    // Handle remote notifications
    if let examAlert = userInfo["exam_alert"] as? String {
      // Handle exam notification
      print("Exam alert: \(examAlert)")
    }
    completionHandler(.newData)
  }
}

// MARK: - Main Tab View

struct MainTabView: View {
  @EnvironmentObject var authManager: AuthenticationManager
  @State private var selectedTab: String = "calculator"

  var body: some View {
    TabView(selection: $selectedTab) {
      if authManager.userRole == .student {
        // Student tabs
        CalculatorView()
          .tabItem {
            Label("Calculator", systemImage: "calculator")
          }
          .tag("calculator")

        ExamListView()
          .tabItem {
            Label("Exams", systemImage: "doc.text")
          }
          .tag("exams")

        ClassroomView()
          .tabItem {
            Label("Classroom", systemImage: "person.3")
          }
          .tag("classroom")

        AnalyticsView()
          .tabItem {
            Label("Analytics", systemImage: "chart.bar")
          }
          .tag("analytics")

        ProfileView()
          .tabItem {
            Label("Profile", systemImage: "person")
          }
          .tag("profile")
      } else {
        // Teacher tabs
        TeacherDashboardView()
          .tabItem {
            Label("Dashboard", systemImage: "gauge.badge.minus")
          }
          .tag("dashboard")

        ExamListView()
          .tabItem {
            Label("Exams", systemImage: "doc.text")
          }
          .tag("exams")

        ClassroomView()
          .tabItem {
            Label("Classroom", systemImage: "person.3")
          }
          .tag("classroom")

        GradeBookView()
          .tabItem {
            Label("Grades", systemImage: "book")
          }
          .tag("grades")

        ProfileView()
          .tabItem {
            Label("Profile", systemImage: "person")
          }
          .tag("profile")
      }
    }
    .tint(.blue)
  }
}

// MARK: - Color Constants

struct GraphRColors {
  static let primary = Color(red: 0.1, green: 0.45, blue: 0.92)
  static let success = Color(red: 0.06, green: 0.62, blue: 0.35)
  static let warning = Color(red: 0.98, green: 0.67, blue: 0)
  static let error = Color(red: 0.83, green: 0.23, blue: 0.15)
  static let dark = Color(red: 0.1, green: 0.1, blue: 0.1)
  static let darkSecondary = Color(red: 0.145, green: 0.145, blue: 0.145)
  static let darkTertiary = Color(red: 0.2, green: 0.2, blue: 0.2)
  static let textSecondary = Color(red: 0.7, green: 0.7, blue: 0.7)
}

// MARK: - Preview

#Preview {
  GraphRApp()
}
