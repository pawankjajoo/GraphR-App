import SwiftUI

struct ExamListView: View {
  @EnvironmentObject var examManager: ExamManager
  @EnvironmentObject var authManager: AuthenticationManager

  var body: some View {
    NavigationStack {
      List {
        ForEach(examManager.exams) { exam in
          NavigationLink(destination: ExamDetailView(exam: exam)) {
            VStack(alignment: .leading, spacing: 4) {
              Text(exam.name)
                .font(.headline)
              Text(exam.description)
                .font(.caption)
                .foregroundColor(.secondary)
              HStack(spacing: 16) {
                Label("\(exam.duration) min", systemImage: "clock")
                Label("\(exam.questions.count) Q", systemImage: "questionmark.circle")
              }
              .font(.caption2)
              .foregroundColor(.secondary)
            }
          }
        }
      }
      .navigationTitle("Exams")
      .navigationBarTitleDisplayMode(.inline)
    }
  }
}

struct ExamDetailView: View {
  @EnvironmentObject var examManager: ExamManager
  let exam: Exam
  @State private var currentQuestion = 0
  @State private var answers: [String: String] = [:]
  @State private var showResults = false

  var body: some View {
    VStack {
      // Timer
      HStack {
        Text(exam.name)
          .font(.headline)
        Spacer()
        Text("--:--")
          .font(.title3)
          .fontWeight(.bold)
      }
      .padding()

      // Question
      if currentQuestion < exam.questions.count {
        VStack(alignment: .leading, spacing: 16) {
          Text("Question \(currentQuestion + 1) of \(exam.questions.count)")
            .font(.caption)
            .foregroundColor(.secondary)

          Text(exam.questions[currentQuestion].question)
            .font(.headline)

          VStack(spacing: 12) {
            ForEach(exam.questions[currentQuestion].options ?? [], id: \.self) { option in
              Button(action: {
                answers[String(currentQuestion)] = option
              }) {
                HStack {
                  Text(option)
                  Spacer()
                  if answers[String(currentQuestion)] == option {
                    Image(systemName: "checkmark.circle.fill")
                      .foregroundColor(.blue)
                  }
                }
                .padding(12)
                .background(
                  answers[String(currentQuestion)] == option ?
                  Color.blue.opacity(0.1) : Color.gray.opacity(0.1)
                )
                .cornerRadius(8)
              }
              .foregroundColor(.primary)
            }
          }

          Spacer()

          // Navigation
          HStack {
            Button("← Previous") {
              if currentQuestion > 0 {
                currentQuestion -= 1
              }
            }
            .disabled(currentQuestion == 0)

            Spacer()

            if currentQuestion < exam.questions.count - 1 {
              Button("Next →") {
                currentQuestion += 1
              }
            } else {
              Button("Submit") {
                examManager.submitExam(answers: answers)
                showResults = true
              }
              .foregroundColor(.green)
            }
          }
          .padding()
        }
        .padding()
      }
    }
    .navigationBarBackButtonHidden(true)
    .navigationBarTitle("", displayMode: .inline)
  }
}

#Preview {
  ExamListView()
    .environmentObject(ExamManager())
}
