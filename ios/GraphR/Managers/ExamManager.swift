import SwiftUI
import FirebaseFirestore

class ExamManager: NSObject, ObservableObject {
  static let shared = ExamManager()

  @Published var exams: [Exam] = []
  @Published var currentExam: Exam?
  @Published var examResults: [ExamResult] = []
  @Published var violationCount: Int = 0
  @Published var isMonitoring = false
  @Published var errorMessage: String?

  private let db = Firestore.firestore()
  private var appStateObserver: NSObjectProtocol?

  override init() {
    super.init()
    loadExams()
  }

  // MARK: - Exam Loading

  func loadExams() {
    db.collection("exams").addSnapshotListener { [weak self] snapshot, error in
      DispatchQueue.main.async {
        if let error = error {
          self?.errorMessage = error.localizedDescription
          return
        }

        self?.exams = snapshot?.documents.compactMap { document in
          try? document.data(as: Exam.self)
        } ?? []
      }
    }
  }

  func loadExamResults(studentId: String) {
    db.collection("examResults")
      .whereField("studentId", isEqualTo: studentId)
      .addSnapshotListener { [weak self] snapshot, error in
        DispatchQueue.main.async {
          if let error = error {
            self?.errorMessage = error.localizedDescription
            return
          }

          self?.examResults = snapshot?.documents.compactMap { document in
            try? document.data(as: ExamResult.self)
          } ?? []
        }
      }
  }

  // MARK: - Exam Taking

  func startExam(_ exam: Exam) {
    self.currentExam = exam
    self.violationCount = 0
    self.isMonitoring = true
    startMonitoring()
  }

  func submitExam(answers: [String: String]) {
    guard let exam = currentExam, let userId = Auth.auth().currentUser?.uid else { return }

    let result = ExamResult(
      studentId: userId,
      examId: exam.id,
      score: calculateScore(answers: answers, exam: exam),
      violationCount: violationCount,
      submittedAt: Date()
    )

    db.collection("examResults").document(result.id).setData(try! JSONEncoder().encode(result))

    stopMonitoring()
    currentExam = nil
  }

  // MARK: - Proctoring (Patent-based)

  func startMonitoring() {
    // Monitor app state changes
    appStateObserver = NotificationCenter.default.addObserver(
      forName: UIApplication.willResignActiveNotification,
      object: nil,
      queue: .main
    ) { [weak self] _ in
      self?.logViolation(type: "app_switch", message: "Student switched to another app")
    }
  }

  func stopMonitoring() {
    if let observer = appStateObserver {
      NotificationCenter.default.removeObserver(observer)
    }
    isMonitoring = false
  }

  func logViolation(type: String, message: String) {
    guard let exam = currentExam, let userId = Auth.auth().currentUser?.uid else { return }

    violationCount += 1

    let violation = ExamViolation(
      studentId: userId,
      examId: exam.id,
      type: type,
      message: message,
      timestamp: Date()
    )

    db.collection("examViolations").document(violation.id).setData(try! JSONEncoder().encode(violation))

    // Auto-submit if too many violations
    if violationCount >= 5 {
      submitExam(answers: [:])
    }
  }

  // MARK: - Scoring

  private func calculateScore(answers: [String: String], exam: Exam) -> Int {
    let correctAnswers = exam.questions.filter { question in
      answers[question.id] == question.correctAnswer
    }.count

    let percentage = (correctAnswers * 100) / exam.questions.count
    return percentage
  }

  func getGrade(score: Int) -> String {
    switch score {
    case 90...100:
      return "A"
    case 80..<90:
      return "B"
    case 70..<80:
      return "C"
    case 60..<70:
      return "D"
    default:
      return "F"
    }
  }
}

// MARK: - Models

struct Exam: Identifiable, Codable {
  @DocumentID var id: String?
  let name: String
  let description: String
  let duration: Int // in minutes
  let teacherId: String
  let questions: [ExamQuestion]
  let createdAt: Date

  var durationFormatted: String {
    "\(duration) min"
  }
}

struct ExamQuestion: Identifiable, Codable {
  let id = UUID().uuidString
  let question: String
  let type: String // "multiple", "short_answer", "essay"
  let options: [String]?
  let correctAnswer: String
}

struct ExamResult: Identifiable, Codable {
  let id = UUID().uuidString
  let studentId: String
  let examId: String
  let score: Int
  let violationCount: Int
  let submittedAt: Date

  var grade: String {
    switch score {
    case 90...100:
      return "A"
    case 80..<90:
      return "B"
    case 70..<80:
      return "C"
    case 60..<70:
      return "D"
    default:
      return "F"
    }
  }
}

struct ExamViolation: Identifiable, Codable {
  let id = UUID().uuidString
  let studentId: String
  let examId: String
  let type: String
  let message: String
  let timestamp: Date
}
