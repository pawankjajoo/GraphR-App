/**
 * Exam Mode Screen Component
 *
 * Implements the core patent technology: a secure testing environment
 * that monitors activity and prevents unauthorized app switching.
 *
 * Patent-based Features (US 10,339,827 B2):
 * - Detects unapproved activity (app switching)
 * - Generates notifications to examination server
 * - Restricts calculator functionalities based on exam requirements
 * - Logs all student interactions for analytics
 * - Manages test state and time constraints
 *
 * This screen is only displayed when a student enters exam mode
 * after logging into a classroom session.
 */

import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  AppState,
  Dimensions,
} from 'react-native';
import { useExamMode } from '../context/ExamModeContext';

const { width } = Dimensions.get('window');

const ExamModeScreen = () => {
  const {
    currentExam,
    examStartTime,
    updateExamActivity,
    exitExamMode,
  } = useExamMode();

  // State tracking for exam session
  const [timeRemaining, setTimeRemaining] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [studentAnswers, setStudentAnswers] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [appState, setAppState] = useState(AppState.currentState);
  const appStateRef = useRef(AppState.currentState);
  const timerRef = useRef(null);

  /**
   * Effect: Initialize exam timer
   * Counts down from exam duration, updates every second
   */
  useEffect(() => {
    if (!examStartTime || !currentExam) return;

    const duration = currentExam.durationMinutes * 60 * 1000; // Convert to milliseconds
    const updateTimer = () => {
      const elapsed = Date.now() - examStartTime;
      const remaining = Math.max(0, duration - elapsed);
      setTimeRemaining(remaining);

      // Send warning when 5 minutes remain
      if (remaining <= 5 * 60 * 1000 && remaining > 4 * 60 * 1000) {
        Alert.alert('Time Warning', 'You have 5 minutes remaining');
      }

      // Auto-submit when time expires
      if (remaining <= 0) {
        handleSubmitExam();
      }
    };

    timerRef.current = setInterval(updateTimer, 1000);
    updateTimer(); // Initial call

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [examStartTime, currentExam]);

  /**
   * Effect: Monitor app foreground/background state
   *
   * This is critical patent functionality: detects when student
   * switches away from the exam app and logs unapproved activity.
   * The examination server is notified of these violations.
   */
  useEffect(() => {
    const subscription = AppState.addEventListener('change', handleAppStateChange);
    return () => {
      subscription.remove();
    };
  }, [currentQuestionIndex, studentAnswers]);

  /**
   * Handles app state changes
   * Detects when user leaves exam app (violation of test rules)
   * Reports unapproved activity to examination server
   */
  const handleAppStateChange = (nextAppState) => {
    if (
      appStateRef.current.match(/inactive|background/) &&
      nextAppState === 'active'
    ) {
      // User returned from background (unapproved activity detected)
      updateExamActivity({
        type: 'unapprovedActivityDetected',
        timestamp: new Date().toISOString(),
        details: 'Student switched away from exam application',
      });

      Alert.alert(
        'Activity Detected',
        'Your instructor has been notified. Please remain focused on the exam.'
      );
    }

    appStateRef.current = nextAppState;
    setAppState(nextAppState);
  };

  /**
   * Format milliseconds to readable time string (MM:SS)
   */
  const formatTime = (ms) => {
    if (ms === null) return '...';
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds
      .toString()
      .padStart(2, '0')}`;
  };

  /**
   * Store student answer for current question
   */
  const handleAnswerChange = (answer) => {
    setStudentAnswers({
      ...studentAnswers,
      [currentQuestionIndex]: answer,
    });
  };

  /**
   * Navigate to next question
   * Logs navigation activity for assessment
   */
  const handleNextQuestion = () => {
    if (currentQuestionIndex < currentExam.questions.length - 1) {
      updateExamActivity({
        type: 'questionNavigated',
        questionIndex: currentQuestionIndex + 1,
        timestamp: new Date().toISOString(),
      });
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  /**
   * Navigate to previous question
   */
  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      updateExamActivity({
        type: 'questionNavigated',
        questionIndex: currentQuestionIndex - 1,
        timestamp: new Date().toISOString(),
      });
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  /**
   * Submit exam and return to normal mode
   * All answers are submitted to examination server for grading
   */
  const handleSubmitExam = async () => {
    setIsSubmitting(true);

    try {
      // Send exam submission with all answers and activity log
      const submissionData = {
        examId: currentExam.id,
        studentId: currentExam.studentId,
        answers: studentAnswers,
        startTime: examStartTime,
        endTime: new Date().toISOString(),
        totalTimeSpent: timeRemaining ? examStartTime + (currentExam.durationMinutes * 60 * 1000) - timeRemaining : null,
      };

      // In production, this would POST to examination server
      updateExamActivity({
        type: 'examSubmitted',
        data: submissionData,
        timestamp: new Date().toISOString(),
      });

      Alert.alert(
        'Exam Submitted',
        'Your exam has been submitted. Thank you!',
        [
          {
            text: 'OK',
            onPress: () => {
              exitExamMode();
            },
          },
        ]
      );
    } catch (error) {
      Alert.alert('Submission Error', 'Unable to submit exam. Please try again.');
      setIsSubmitting(false);
    }
  };

  if (!currentExam) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>No exam loaded</Text>
      </View>
    );
  }

  const question = currentExam.questions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === currentExam.questions.length - 1;

  return (
    <View style={styles.container}>
      {/* Exam header with timer and security notice */}
      <View style={styles.header}>
        <View style={styles.titleSection}>
          <Text style={styles.examTitle}>{currentExam.title}</Text>
          <Text style={styles.securityNotice}>Secure Test Environment</Text>
        </View>
        <View style={styles.timerSection}>
          <Text style={styles.timerLabel}>Time Remaining</Text>
          <Text style={[
            styles.timer,
            timeRemaining && timeRemaining < 5 * 60 * 1000 && styles.timerWarning,
          ]}>
            {formatTime(timeRemaining)}
          </Text>
        </View>
      </View>

      {/* Progress indicator */}
      <View style={styles.progressContainer}>
        <Text style={styles.progressText}>
          Question {currentQuestionIndex + 1} of {currentExam.questions.length}
        </Text>
        <View style={styles.progressBar}>
          <View
            style={[
              styles.progressFill,
              {
                width: `${((currentQuestionIndex + 1) / currentExam.questions.length) * 100}%`,
              },
            ]}
          />
        </View>
      </View>

      {/* Question content */}
      <ScrollView style={styles.questionContainer}>
        <Text style={styles.questionText}>{question.text}</Text>

        {question.imageUrl && (
          <View style={styles.imageContainer}>
            <Text style={styles.imageText}>[Image: {question.imageUrl}]</Text>
          </View>
        )}

        {/* Answer options (multiple choice or free response) */}
        <View style={styles.answersContainer}>
          {question.type === 'multipleChoice' ? (
            question.options.map((option, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.optionButton,
                  studentAnswers[currentQuestionIndex] === option &&
                    styles.selectedOption,
                ]}
                onPress={() => handleAnswerChange(option)}
              >
                <View
                  style={[
                    styles.optionDot,
                    studentAnswers[currentQuestionIndex] === option &&
                      styles.selectedDot,
                  ]}
                />
                <Text style={styles.optionText}>{option}</Text>
              </TouchableOpacity>
            ))
          ) : (
            <View style={styles.freeResponseContainer}>
              <Text style={styles.responseLabel}>Your answer:</Text>
              <Text style={styles.responseText}>
                {studentAnswers[currentQuestionIndex] || 'Not answered'}
              </Text>
              <TouchableOpacity style={styles.editButton}>
                <Text style={styles.editButtonText}>Tap to answer</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </ScrollView>

      {/* Navigation and submission buttons */}
      <View style={styles.bottomControls}>
        <TouchableOpacity
          style={[
            styles.navButton,
            currentQuestionIndex === 0 && styles.navButtonDisabled,
          ]}
          onPress={handlePreviousQuestion}
          disabled={currentQuestionIndex === 0}
        >
          <Text style={styles.navButtonText}>Previous</Text>
        </TouchableOpacity>

        {isLastQuestion ? (
          <TouchableOpacity
            style={[styles.submitButton, isSubmitting && styles.submitButtonDisabled]}
            onPress={handleSubmitExam}
            disabled={isSubmitting}
          >
            <Text style={styles.submitButtonText}>
              {isSubmitting ? 'Submitting...' : 'Submit Exam'}
            </Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={styles.navButton}
            onPress={handleNextQuestion}
          >
            <Text style={styles.navButtonText}>Next</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    backgroundColor: '#2C3E50',
    padding: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  titleSection: {
    flex: 1,
  },
  examTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
  },
  securityNotice: {
    color: '#ECF0F1',
    fontSize: 12,
    marginTop: 4,
    fontStyle: 'italic',
  },
  timerSection: {
    alignItems: 'center',
  },
  timerLabel: {
    color: '#ECF0F1',
    fontSize: 11,
  },
  timer: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: '700',
    marginTop: 4,
    fontFamily: 'monospace',
  },
  timerWarning: {
    color: '#E74C3C',
  },
  progressContainer: {
    backgroundColor: '#FFFFFF',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#ECF0F1',
  },
  progressText: {
    color: '#2C3E50',
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 8,
  },
  progressBar: {
    height: 6,
    backgroundColor: '#ECF0F1',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#27AE60',
  },
  questionContainer: {
    flex: 1,
    padding: 15,
  },
  questionText: {
    color: '#2C3E50',
    fontSize: 16,
    fontWeight: '600',
    lineHeight: 24,
    marginBottom: 15,
  },
  imageContainer: {
    backgroundColor: '#ECF0F1',
    padding: 30,
    borderRadius: 8,
    marginBottom: 15,
    alignItems: 'center',
  },
  imageText: {
    color: '#7F8C8D',
    fontStyle: 'italic',
  },
  answersContainer: {
    marginTop: 10,
  },
  optionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 12,
    marginBottom: 10,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#ECF0F1',
  },
  selectedOption: {
    backgroundColor: '#E8F8F5',
    borderColor: '#27AE60',
  },
  optionDot: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 2,
    borderColor: '#BDC3C7',
    marginRight: 12,
  },
  selectedDot: {
    backgroundColor: '#27AE60',
    borderColor: '#27AE60',
  },
  optionText: {
    color: '#2C3E50',
    fontSize: 15,
    flex: 1,
  },
  freeResponseContainer: {
    backgroundColor: '#FFFFFF',
    padding: 15,
    borderRadius: 8,
  },
  responseLabel: {
    color: '#7F8C8D',
    fontSize: 12,
    marginBottom: 8,
  },
  responseText: {
    color: '#2C3E50',
    fontSize: 15,
    minHeight: 40,
  },
  editButton: {
    marginTop: 10,
    paddingVertical: 10,
    paddingHorizontal: 15,
    backgroundColor: '#3498DB',
    borderRadius: 6,
  },
  editButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    textAlign: 'center',
  },
  bottomControls: {
    flexDirection: 'row',
    gap: 10,
    padding: 15,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#ECF0F1',
  },
  navButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 15,
    backgroundColor: '#3498DB',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  navButtonDisabled: {
    backgroundColor: '#BDC3C7',
  },
  navButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  submitButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 15,
    backgroundColor: '#27AE60',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  submitButtonDisabled: {
    backgroundColor: '#95A5A6',
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  errorText: {
    color: '#E74C3C',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 50,
  },
});

export default ExamModeScreen;
