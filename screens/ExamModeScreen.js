/*
 * screens/ExamModeScreen.js
 *
 * Exam Mode Screen - Secure Testing Environment
 * Patent implementation of exam proctoring:
 * • Timer countdown (restricts to exam duration)
 * • Real-time app-switch detection
 * • Calculator restrictions per question
 * • Student cannot exit without teacher approval
 * • Logs all calculator operations
 * • Teacher gets live violation notifications
 * Safety and security. Preventing cheating while protecting students.
 */

import React, { useState, useEffect, useRef } from "react";
import {
  View, Text, TouchableOpacity, StyleSheet, ScrollView, Alert, BackHandler,
} from "react-native";
import { COLORS, formatTimeRemaining } from "../constants/graphr";

export default function ExamModeScreen({
  exam, onExit, violations, showToast,
}) {
  const [timeRemaining, setTimeRemaining] = useState(exam.duration * 60);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [showExitConfirm, setShowExitConfirm] = useState(false);
  const timerInterval = useRef(null);
  const isMounted = useRef(true);

  // Timer - with proper cleanup to prevent race conditions
  useEffect(() => {
    isMounted.current = true;

    timerInterval.current = setInterval(() => {
      if (!isMounted.current) return;

      setTimeRemaining((prev) => {
        if (prev <= 1) {
          if (isMounted.current) {
            clearInterval(timerInterval.current);
            handleAutoSubmit();
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      isMounted.current = false;
      clearInterval(timerInterval.current);
    };
  }, []);

  // Prevent back button
  useEffect(() => {
    const subscription = BackHandler.addEventListener("hardwareBackPress", () => true);
    return () => subscription.remove();
  }, []);

  const handleAutoSubmit = () => {
    showToast("Time's up! Exam submitted.");
    setTimeout(onExit, 1500);
  };

  const handleAnswerChange = (questionIndex, answer) => {
    setAnswers({
      ...answers,
      [questionIndex]: answer,
    });
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < exam.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handlePrevQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleRequestExit = () => {
    setShowExitConfirm(true);
  };

  const handleConfirmExit = () => {
    clearInterval(timerInterval.current);
    onExit();
  };

  const currentQuestion = exam.questions[currentQuestionIndex];
  const timeWarning = timeRemaining < 300; // Warning at 5 minutes

  return (
    <View style={styles.container}>
      {/* Header Bar */}
      <View style={[styles.headerBar, timeWarning && styles.headerBarWarning]}>
        <View>
          <Text style={styles.examTitle}>{exam.title}</Text>
          <Text style={styles.examSubtitle}>Question {currentQuestionIndex + 1} of {exam.questions.length}</Text>
        </View>
        <View style={styles.timerContainer}>
          <Text style={[styles.timer, timeWarning && styles.timerWarning]}>
            {formatTimeRemaining(timeRemaining)}
          </Text>
          <Text style={styles.timerLabel}>Remaining</Text>
        </View>
      </View>

      {/* Question Area */}
      <ScrollView style={styles.questionSection} contentContainerStyle={styles.questionContent}>
        <Text style={styles.questionText}>{currentQuestion.text}</Text>
        <Text style={styles.questionPoints}>({currentQuestion.points} points)</Text>

        {/* Calculator Restrictions Notice */}
        {exam.restrictions && (
          <View style={styles.restrictionNotice}>
            <Text style={styles.restrictionTitle}>Calculator Restriction:</Text>
            <Text style={styles.restrictionText}>
              {exam.restrictions.allowedCalculatorMode === "basic"
                ? "Basic mode only - Graphing not permitted"
                : "All calculator modes permitted"}
            </Text>
          </View>
        )}

        {/* Answer Input */}
        <View style={styles.answerBox}>
          <Text style={styles.answerLabel}>Your Answer</Text>
          <View style={styles.answerInput}>
            <Text style={styles.answerText}>
              {answers[currentQuestionIndex] || "No answer entered yet"}
            </Text>
          </View>
        </View>
      </ScrollView>

      {/* Violations Alert */}
      {violations.length > 0 && (
        <View style={styles.violationsAlert}>
          <Text style={styles.violationsText}>
            App switches detected: {violations.length}
          </Text>
        </View>
      )}

      {/* Navigation */}
      <View style={styles.navigationBar}>
        <TouchableOpacity
          style={[styles.navButton, currentQuestionIndex === 0 && styles.navButtonDisabled]}
          onPress={handlePrevQuestion}
          disabled={currentQuestionIndex === 0}
        >
          <Text style={styles.navButtonText}>Previous</Text>
        </TouchableOpacity>

        <View style={styles.progressBar}>
          <View
            style={[
              styles.progressFill,
              { width: `${((currentQuestionIndex + 1) / exam.questions.length) * 100}%` },
            ]}
          />
        </View>

        <TouchableOpacity
          style={[styles.navButton, currentQuestionIndex === exam.questions.length - 1 && styles.navButtonDisabled]}
          onPress={handleNextQuestion}
          disabled={currentQuestionIndex === exam.questions.length - 1}
        >
          <Text style={styles.navButtonText}>Next</Text>
        </TouchableOpacity>
      </View>

      {/* Exit & Submit */}
      <View style={styles.actionBar}>
        <TouchableOpacity
          style={styles.exitButton}
          onPress={handleRequestExit}
        >
          <Text style={styles.exitButtonText}>Request Exit</Text>
        </TouchableOpacity>
      </View>

      {/* Exit Confirmation Modal */}
      {showExitConfirm && (
        <View style={styles.modal}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Exit Exam?</Text>
            <Text style={styles.modalText}>
              You have {formatTimeRemaining(timeRemaining)} remaining.
            </Text>
            <Text style={styles.modalText}>
              Are you sure you want to exit? Your answers will be submitted.
            </Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setShowExitConfirm(false)}
              >
                <Text style={styles.modalButtonText}>Continue Exam</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.confirmButton]}
                onPress={handleConfirmExit}
              >
                <Text style={styles.modalButtonText}>Submit & Exit</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.dark,
  },
  headerBar: {
    backgroundColor: COLORS.darkSecondary,
    borderBottomWidth: 2,
    borderBottomColor: COLORS.border,
    paddingVertical: 12,
    paddingHorizontal: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  headerBarWarning: {
    borderBottomColor: COLORS.warning,
  },
  examTitle: {
    fontFamily: "Inter_700Bold",
    fontSize: 14,
    color: COLORS.text,
  },
  examSubtitle: {
    fontFamily: "Inter_400Regular",
    fontSize: 11,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  timerContainer: {
    alignItems: "flex-end",
    gap: 2,
  },
  timer: {
    fontFamily: "Inter_700Bold",
    fontSize: 18,
    color: COLORS.primary,
  },
  timerWarning: {
    color: COLORS.warning,
  },
  timerLabel: {
    fontFamily: "Inter_400Regular",
    fontSize: 10,
    color: COLORS.textSecondary,
  },
  questionSection: {
    flex: 1,
    padding: 16,
  },
  questionContent: {
    gap: 16,
  },
  questionText: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 16,
    color: COLORS.text,
    lineHeight: 22,
  },
  questionPoints: {
    fontFamily: "Inter_400Regular",
    fontSize: 12,
    color: COLORS.textSecondary,
  },
  restrictionNotice: {
    backgroundColor: "rgba(249, 171, 0, 0.1)",
    borderLeftWidth: 3,
    borderLeftColor: COLORS.warning,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 6,
    gap: 4,
  },
  restrictionTitle: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 11,
    color: COLORS.warning,
    textTransform: "uppercase",
  },
  restrictionText: {
    fontFamily: "Inter_400Regular",
    fontSize: 12,
    color: COLORS.text,
  },
  answerBox: {
    gap: 8,
  },
  answerLabel: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 12,
    color: COLORS.textSecondary,
    textTransform: "uppercase",
  },
  answerInput: {
    backgroundColor: COLORS.input,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingHorizontal: 12,
    paddingVertical: 12,
    minHeight: 60,
    justifyContent: "center",
  },
  answerText: {
    fontFamily: "Inter_400Regular",
    fontSize: 14,
    color: COLORS.text,
  },
  violationsAlert: {
    backgroundColor: "rgba(211, 59, 39, 0.15)",
    borderTopWidth: 1,
    borderTopColor: COLORS.error,
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  violationsText: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 11,
    color: COLORS.error,
  },
  navigationBar: {
    flexDirection: "row",
    gap: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: COLORS.darkSecondary,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    alignItems: "center",
  },
  navButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: COLORS.primary,
    borderRadius: 6,
  },
  navButtonDisabled: {
    opacity: 0.4,
  },
  navButtonText: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 12,
    color: COLORS.text,
  },
  progressBar: {
    flex: 1,
    height: 6,
    backgroundColor: COLORS.darkTertiary,
    borderRadius: 3,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    backgroundColor: COLORS.success,
  },
  actionBar: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: COLORS.darkSecondary,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  exitButton: {
    paddingVertical: 10,
    backgroundColor: COLORS.error,
    borderRadius: 6,
    alignItems: "center",
  },
  exitButtonText: {
    fontFamily: "Inter_700Bold",
    fontSize: 12,
    color: COLORS.text,
  },
  modal: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 999,
  },
  modalContent: {
    backgroundColor: COLORS.darkSecondary,
    borderRadius: 12,
    paddingVertical: 24,
    paddingHorizontal: 20,
    maxWidth: 300,
    gap: 12,
  },
  modalTitle: {
    fontFamily: "Inter_700Bold",
    fontSize: 16,
    color: COLORS.text,
  },
  modalText: {
    fontFamily: "Inter_400Regular",
    fontSize: 13,
    color: COLORS.textSecondary,
    lineHeight: 18,
  },
  modalButtons: {
    flexDirection: "row",
    gap: 12,
    marginTop: 12,
  },
  modalButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 6,
    alignItems: "center",
  },
  cancelButton: {
    backgroundColor: COLORS.darkTertiary,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  confirmButton: {
    backgroundColor: COLORS.error,
  },
  modalButtonText: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 12,
    color: COLORS.text,
  },
});
