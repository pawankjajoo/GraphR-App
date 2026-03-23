import SwiftUI
import Firebase
import FirebaseAuth
import FirebaseFirestore

enum UserRole {
  case student
  case teacher
}

class AuthenticationManager: NSObject, ObservableObject {
  static let shared = AuthenticationManager()

  @Published var isAuthenticated = false
  @Published var currentUser: User?
  @Published var userRole: UserRole = .student
  @Published var errorMessage: String?
  @Published var isLoading = false

  private let db = Firestore.firestore()

  override init() {
    super.init()
    setupAuthStateListener()
  }

  // MARK: - Authentication Methods

  func setupAuthStateListener() {
    Auth.auth().addStateDidChangeListener { [weak self] _, user in
      DispatchQueue.main.async {
        if let user = user {
          self?.isAuthenticated = true
          self?.fetchUserProfile(uid: user.uid)
        } else {
          self?.isAuthenticated = false
          self?.currentUser = nil
        }
      }
    }
  }

  func login(email: String, password: String, role: UserRole) {
    isLoading = true
    errorMessage = nil

    Auth.auth().signIn(withEmail: email, password: password) { [weak self] result, error in
      DispatchQueue.main.async {
        self?.isLoading = false

        if let error = error {
          self?.errorMessage = error.localizedDescription
          return
        }

        guard let uid = result?.user.uid else { return }
        self?.userRole = role
        self?.fetchUserProfile(uid: uid)
      }
    }
  }

  func signup(email: String, password: String, firstName: String, lastName: String, role: UserRole) {
    isLoading = true
    errorMessage = nil

    Auth.auth().createUser(withEmail: email, password: password) { [weak self] result, error in
      DispatchQueue.main.async {
        if let error = error {
          self?.errorMessage = error.localizedDescription
          return
        }

        guard let uid = result?.user.uid else { return }
        self?.userRole = role

        let userData: [String: Any] = [
          "uid": uid,
          "email": email,
          "firstName": firstName,
          "lastName": lastName,
          "role": role == .student ? "student" : "teacher",
          "createdAt": Date(),
          "profileImageURL": "",
          "bio": "",
        ]

        self?.db.collection("users").document(uid).setData(userData) { error in
          DispatchQueue.main.async {
            self?.isLoading = false
            if let error = error {
              self?.errorMessage = error.localizedDescription
            } else {
              self?.fetchUserProfile(uid: uid)
            }
          }
        }
      }
    }
  }

  func logout() {
    do {
      try Auth.auth().signOut()
      DispatchQueue.main.async {
        self.isAuthenticated = false
        self.currentUser = nil
      }
    } catch {
      errorMessage = error.localizedDescription
    }
  }

  func fetchUserProfile(uid: String) {
    db.collection("users").document(uid).getDocument { [weak self] document, error in
      DispatchQueue.main.async {
        if let document = document, document.exists {
          let data = document.data() ?? [:]
          let user = User(
            uid: uid,
            email: data["email"] as? String ?? "",
            firstName: data["firstName"] as? String ?? "",
            lastName: data["lastName"] as? String ?? "",
            role: (data["role"] as? String ?? "student") == "student" ? .student : .teacher,
            bio: data["bio"] as? String ?? "",
            profileImageURL: data["profileImageURL"] as? String ?? ""
          )
          self?.currentUser = user
          self?.userRole = user.role
        }
      }
    }
  }

  func updateProfile(firstName: String, lastName: String, bio: String) {
    guard let uid = Auth.auth().currentUser?.uid else { return }

    let updates: [String: Any] = [
      "firstName": firstName,
      "lastName": lastName,
      "bio": bio,
    ]

    db.collection("users").document(uid).updateData(updates) { [weak self] error in
      DispatchQueue.main.async {
        if let error = error {
          self?.errorMessage = error.localizedDescription
        } else {
          self?.currentUser?.firstName = firstName
          self?.currentUser?.lastName = lastName
          self?.currentUser?.bio = bio
        }
      }
    }
  }

  func resetPassword(email: String) {
    Auth.auth().sendPasswordReset(withEmail: email) { [weak self] error in
      DispatchQueue.main.async {
        if let error = error {
          self?.errorMessage = error.localizedDescription
        } else {
          self?.errorMessage = "Password reset email sent"
        }
      }
    }
  }
}

// MARK: - User Model

struct User: Identifiable, Codable {
  let id = UUID()
  let uid: String
  let email: String
  var firstName: String
  var lastName: String
  let role: UserRole
  var bio: String
  var profileImageURL: String

  var fullName: String {
    "\(firstName) \(lastName)"
  }

  enum CodingKeys: String, CodingKey {
    case uid, email, firstName, lastName, role, bio, profileImageURL
  }
}
