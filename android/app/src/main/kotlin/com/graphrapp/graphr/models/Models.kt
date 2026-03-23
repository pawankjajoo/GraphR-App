package com.graphrapp.graphr.models

import com.google.firebase.firestore.DocumentId
import java.util.Date

// Enums
enum class UserRole {
  STUDENT,
  TEACHER
}

// User
data class User(
  @DocumentId
  val uid: String = "",
  val email: String = "",
  val firstName: String = "",
  val lastName: String = "",
  val role: UserRole = UserRole.STUDENT,
  val bio: String = "",
  val profileImageUrl: String = "",
  val createdAt: Date = Date()
) {
  val fullName: String
    get() = "$firstName $lastName"
}

// Exam
data class Exam(
  @DocumentId
  val id: String = "",
  val name: String = "",
  val description: String = "",
  val duration: Int = 60, // minutes
  val teacherId: String = "",
  val questions: List<ExamQuestion> = emptyList(),
  val createdAt: Date = Date()
)

data class ExamQuestion(
  val id: String = "",
  val question: String = "",
  val type: String = "multiple", // multiple, short_answer, essay
  val options: List<String>? = null,
  val correctAnswer: String = ""
)

// Exam Result
data class ExamResult(
  @DocumentId
  val id: String = "",
  val studentId: String = "",
  val examId: String = "",
  val score: Int = 0,
  val violationCount: Int = 0,
  val submittedAt: Date = Date()
) {
  val grade: String
    get() = when {
      score >= 90 -> "A"
      score >= 80 -> "B"
      score >= 70 -> "C"
      score >= 60 -> "D"
      else -> "F"
    }
}

// Exam Violation
data class ExamViolation(
  @DocumentId
  val id: String = "",
  val studentId: String = "",
  val examId: String = "",
  val type: String = "",
  val message: String = "",
  val timestamp: Date = Date()
)

// Classroom
data class Classroom(
  @DocumentId
  val id: String = "",
  val name: String = "",
  val description: String = "",
  val code: String = "",
  val teacherId: String = "",
  val students: List<String> = emptyList(),
  val exams: List<String> = emptyList(),
  val materials: List<String> = emptyList(),
  val createdAt: Date = Date()
)

// Calculator History
data class CalculatorEntry(
  val expression: String = "",
  val result: String = "",
  val timestamp: Date = Date()
)
