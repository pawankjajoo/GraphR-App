import SwiftUI
import FirebaseFirestore
import FirebaseAuth

class ClassroomManager: NSObject, ObservableObject {
  static let shared = ClassroomManager()

  @Published var classrooms: [Classroom] = []
  @Published var currentClassroom: Classroom?
  @Published var errorMessage: String?

  private let db = Firestore.firestore()

  override init() {
    super.init()
    loadClassrooms()
  }

  // MARK: - Classroom Loading

  func loadClassrooms(userId: String? = nil) {
    let uid = userId ?? Auth.auth().currentUser?.uid ?? ""

    db.collection("classrooms")
      .whereField("students", arrayContains: uid)
      .addSnapshotListener { [weak self] snapshot, error in
        DispatchQueue.main.async {
          if let error = error {
            self?.errorMessage = error.localizedDescription
            return
          }

          self?.classrooms = snapshot?.documents.compactMap { document in
            try? document.data(as: Classroom.self)
          } ?? []
        }
      }
  }

  // MARK: - Classroom Management

  func createClassroom(
    name: String,
    description: String,
    teacherId: String
  ) {
    let code = generateClassCode()

    let classroom = Classroom(
      name: name,
      description: description,
      code: code,
      teacherId: teacherId,
      students: [teacherId], // Teacher is first student
      exams: [],
      createdAt: Date()
    )

    do {
      try db.collection("classrooms").document(classroom.id).setData(from: classroom)
    } catch {
      errorMessage = error.localizedDescription
    }
  }

  func joinClassroom(code: String, studentId: String) {
    db.collection("classrooms")
      .whereField("code", isEqualTo: code)
      .getDocuments { [weak self] snapshot, error in
        DispatchQueue.main.async {
          if let error = error {
            self?.errorMessage = error.localizedDescription
            return
          }

          guard let document = snapshot?.documents.first else {
            self?.errorMessage = "Classroom not found"
            return
          }

          var classroom = try! document.data(as: Classroom.self)
          if !classroom.students.contains(studentId) {
            classroom.students.append(studentId)
            try! self?.db.collection("classrooms").document(classroom.id).setData(from: classroom)
          }
        }
      }
  }

  func leaveClassroom(_ classroom: Classroom, studentId: String) {
    var updatedClassroom = classroom
    updatedClassroom.students.removeAll { $0 == studentId }

    do {
      try db.collection("classrooms").document(classroom.id).setData(from: updatedClassroom)
    } catch {
      errorMessage = error.localizedDescription
    }
  }

  func addExamToClassroom(_ classroom: Classroom, examId: String) {
    var updatedClassroom = classroom
    if !updatedClassroom.exams.contains(examId) {
      updatedClassroom.exams.append(examId)

      do {
        try db.collection("classrooms").document(classroom.id).setData(from: updatedClassroom)
      } catch {
        errorMessage = error.localizedDescription
      }
    }
  }

  // MARK: - Helpers

  private func generateClassCode() -> String {
    let letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
    return String((0..<6).map { _ in letters.randomElement()! })
  }
}

// MARK: - Models

struct Classroom: Identifiable, Codable {
  @DocumentID var id: String?
  let name: String
  let description: String
  let code: String
  let teacherId: String
  var students: [String] = []
  var exams: [String] = []
  let createdAt: Date

  enum CodingKeys: String, CodingKey {
    case id, name, description, code, teacherId, students, exams, createdAt
  }
}

struct ClassroomStats: Identifiable {
  let id: String
  let name: String
  let studentCount: Int
  let examCount: Int
  let averageScore: Double
}
