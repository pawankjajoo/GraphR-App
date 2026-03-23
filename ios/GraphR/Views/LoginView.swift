import SwiftUI

struct LoginView: View {
  @EnvironmentObject var authManager: AuthenticationManager
  @State private var email = ""
  @State private var password = ""
  @State private var selectedRole: UserRole = .student
  @State private var isSignUp = false

  var body: some View {
    NavigationStack {
      ZStack {
        Color.black.opacity(0.05)
          .ignoresSafeArea()

        VStack(spacing: 24) {
          // Header
          VStack(spacing: 8) {
            Text("🧮")
              .font(.system(size: 48))
            Text("GraphR")
              .font(.title)
              .fontWeight(.bold)
            Text("#CalculatingTheFuture")
              .font(.caption)
              .foregroundColor(.blue)
          }
          .frame(maxWidth: .infinity)
          .padding(.vertical, 32)

          // Form
          VStack(spacing: 16) {
            TextField("Email", text: $email)
              .textContentType(.emailAddress)
              .keyboardType(.emailAddress)
              .autocapitalization(.none)
              .padding(12)
              .background(Color.white)
              .cornerRadius(8)
              .overlay(
                RoundedRectangle(cornerRadius: 8)
                  .stroke(Color.gray.opacity(0.3), lineWidth: 1)
              )

            SecureField("Password", text: $password)
              .textContentType(.password)
              .padding(12)
              .background(Color.white)
              .cornerRadius(8)
              .overlay(
                RoundedRectangle(cornerRadius: 8)
                  .stroke(Color.gray.opacity(0.3), lineWidth: 1)
              )

            Picker("Role", selection: $selectedRole) {
              Text("Student").tag(UserRole.student)
              Text("Teacher").tag(UserRole.teacher)
            }
            .pickerStyle(.segmented)
          }
          .padding(.horizontal)

          // Submit Button
          if authManager.isLoading {
            ProgressView()
              .frame(maxWidth: .infinity)
              .frame(height: 50)
              .background(Color.blue)
              .cornerRadius(8)
          } else {
            Button(action: handleLogin) {
              Text(isSignUp ? "Sign Up" : "Sign In")
                .fontWeight(.semibold)
                .frame(maxWidth: .infinity)
                .frame(height: 50)
                .background(Color.blue)
                .foregroundColor(.white)
                .cornerRadius(8)
            }
          }

          // Error Message
          if let error = authManager.errorMessage {
            Text(error)
              .font(.caption)
              .foregroundColor(.red)
              .frame(maxWidth: .infinity, alignment: .leading)
              .padding(.horizontal)
          }

          Spacer()

          // Toggle Sign Up/In
          Button(action: { isSignUp.toggle() }) {
            HStack(spacing: 4) {
              Text(isSignUp ? "Already have an account?" : "Don't have an account?")
                .foregroundColor(.primary)
              Text(isSignUp ? "Sign In" : "Sign Up")
                .fontWeight(.semibold)
                .foregroundColor(.blue)
            }
            .font(.caption)
          }
        }
        .padding()
      }
      .navigationBarTitleDisplayMode(.inline)
    }
  }

  private func handleLogin() {
    if isSignUp {
      // Sign up flow would need additional fields
      authManager.signup(
        email: email,
        password: password,
        firstName: "User",
        lastName: "",
        role: selectedRole
      )
    } else {
      authManager.login(
        email: email,
        password: password,
        role: selectedRole
      )
    }
  }
}

#Preview {
  LoginView()
    .environmentObject(AuthenticationManager())
}
