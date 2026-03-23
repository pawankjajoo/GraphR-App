import SwiftUI

// Classroom View
struct ClassroomView: View {
  @EnvironmentObject var classroomManager: ClassroomManager
  @State private var showJoinSheet = false
  @State private var classCode = ""

  var body: some View {
    NavigationStack {
      VStack {
        List {
          ForEach(classroomManager.classrooms) { classroom in
            NavigationLink(destination: ClassroomDetailView(classroom: classroom)) {
              VStack(alignment: .leading, spacing: 4) {
                Text(classroom.name)
                  .font(.headline)
                Text("Code: \(classroom.code)")
                  .font(.caption)
                  .foregroundColor(.secondary)
              }
            }
          }
        }
        .navigationTitle("Classrooms")
      }
      .toolbar {
        ToolbarItem(placement: .topBarTrailing) {
          Button("Join", action: { showJoinSheet = true })
        }
      }
      .sheet(isPresented: $showJoinSheet) {
        VStack(spacing: 16) {
          TextField("Class Code", text: $classCode)
            .textFieldStyle(.roundedBorder)
            .autocapitalization(.allCharacters)
            .padding()

          Button("Join") {
            classroomManager.joinClassroom(code: classCode, studentId: "userId")
            showJoinSheet = false
          }
          .buttonStyle(.borderedProminent)

          Spacer()
        }
        .padding()
      }
    }
  }
}

struct ClassroomDetailView: View {
  let classroom: Classroom

  var body: some View {
    VStack {
      Text(classroom.name)
        .font(.title)
      Text(classroom.description)
        .foregroundColor(.secondary)
      Spacer()
    }
    .padding()
    .navigationBarTitleDisplayMode(.inline)
  }
}

// Analytics View
struct AnalyticsView: View {
  var body: some View {
    NavigationStack {
      VStack(spacing: 20) {
        VStack(spacing: 8) {
          Text("Average Score")
            .font(.caption)
            .foregroundColor(.secondary)
          Text("0%")
            .font(.title)
            .fontWeight(.bold)
        }
        .frame(maxWidth: .infinity)
        .padding()
        .background(Color.gray.opacity(0.1))
        .cornerRadius(8)

        VStack(spacing: 8) {
          Text("Exams Completed")
            .font(.caption)
            .foregroundColor(.secondary)
          Text("0")
            .font(.title)
            .fontWeight(.bold)
        }
        .frame(maxWidth: .infinity)
        .padding()
        .background(Color.gray.opacity(0.1))
        .cornerRadius(8)

        Spacer()
      }
      .padding()
      .navigationTitle("Analytics")
    }
  }
}

// Profile View
struct ProfileView: View {
  @EnvironmentObject var authManager: AuthenticationManager

  var body: some View {
    NavigationStack {
      VStack(spacing: 20) {
        VStack(spacing: 12) {
          Text("👤")
            .font(.system(size: 48))
          Text(authManager.currentUser?.fullName ?? "User")
            .font(.headline)
          Text(authManager.currentUser?.email ?? "")
            .font(.caption)
            .foregroundColor(.secondary)
        }
        .frame(maxWidth: .infinity)
        .padding()
        .background(Color.gray.opacity(0.1))
        .cornerRadius(8)

        Button(role: .destructive, action: {
          authManager.logout()
        }) {
          Label("Sign Out", systemImage: "arrow.left.circle")
            .frame(maxWidth: .infinity)
        }
        .buttonStyle(.bordered)

        Spacer()
      }
      .padding()
      .navigationTitle("Profile")
    }
  }
}

// Teacher Dashboard View
struct TeacherDashboardView: View {
  @EnvironmentObject var examManager: ExamManager

  var body: some View {
    NavigationStack {
      VStack(spacing: 20) {
        Text("Active Exams: \(examManager.exams.count)")
          .frame(maxWidth: .infinity)
          .padding()
          .background(Color.blue.opacity(0.1))
          .cornerRadius(8)

        Text("Total Violations: \(examManager.violationCount)")
          .frame(maxWidth: .infinity)
          .padding()
          .background(Color.red.opacity(0.1))
          .cornerRadius(8)

        Spacer()
      }
      .padding()
      .navigationTitle("Dashboard")
    }
  }
}

// Grade Book View
struct GradeBookView: View {
  var body: some View {
    NavigationStack {
      Text("Grade Book")
        .navigationTitle("Grades")
    }
  }
}

#Preview {
  ClassroomView()
    .environmentObject(ClassroomManager())
}
