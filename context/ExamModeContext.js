/**
 * Exam Mode Context
 *
 * Manages exam session state and activity logging.
 * Implements patent technology for exam monitoring and proctoring.
 *
 * Key responsibilities:
 * - Track exam state (active, submitted, cancelled)
 * - Log student activities and unapproved actions
 * - Manage exam restrictions (calculator mode, time limits)
 * - Handle communication with examination server
 */

import React, { useReducer, useContext, useCallback } from 'react';

const ExamModeContext = React.createContext();

/**
 * Exam mode state reducer
 * Manages exam-related state changes and activity logging
 */
const examReducer = (state, action) => {
  switch (action.type) {
    case 'START_EXAM':
      return {
        ...state,
        isExamActive: true,
        currentExam: action.payload.exam,
        examStartTime: action.payload.startTime,
        activityLog: [],
      };
    case 'LOG_ACTIVITY':
      return {
        ...state,
        activityLog: [...state.activityLog, action.payload],
      };
    case 'UPDATE_EXAM_STATE':
      return {
        ...state,
        currentExam: {
          ...state.currentExam,
          ...action.payload,
        },
      };
    case 'SUBMIT_EXAM':
      return {
        ...state,
        isExamActive: false,
        examSubmitted: true,
        submissionTime: action.payload.submissionTime,
      };
    case 'END_EXAM':
      return {
        ...state,
        isExamActive: false,
        currentExam: null,
        examStartTime: null,
      };
    default:
      return state;
  }
};

/**
 * Exam Mode Context Provider
 * Wraps application and provides exam state to all components
 */
export const ExamModeProvider = ({ children }) => {
  const [state, dispatch] = useReducer(examReducer, {
    isExamActive: false,
    currentExam: null,
    examStartTime: null,
    activityLog: [],
    examSubmitted: false,
    submissionTime: null,
  });

  /**
   * Start an exam session
   * Called when student enters exam mode
   * Initializes timer, restrictions, and activity logging
   */
  const startExam = useCallback((exam) => {
    const startTime = Date.now();

    dispatch({
      type: 'START_EXAM',
      payload: {
        exam: {
          ...exam,
          restrictedCalculatorMode: exam.calculatorMode || null,
        },
        startTime,
      },
    });

    // Log exam start activity
    dispatch({
      type: 'LOG_ACTIVITY',
      payload: {
        type: 'examStarted',
        timestamp: new Date().toISOString(),
        examId: exam.id,
      },
    });
  }, []);

  /**
   * Log activity during exam
   * Records all student actions for proctoring and analytics
   * Detects unapproved activities like app switching
   */
  const updateExamActivity = useCallback((activity) => {
    dispatch({
      type: 'LOG_ACTIVITY',
      payload: {
        ...activity,
        timestamp: activity.timestamp || new Date().toISOString(),
      },
    });

    // If unapproved activity detected, notify server
    if (activity.type === 'unapprovedActivityDetected') {
      // In production, send alert to examination server
      console.log('ALERT: Unapproved activity detected', activity);
    }
  }, []);

  /**
   * Submit exam
   * Finalizes exam attempt and sends all data to examination server
   */
  const submitExam = useCallback((answers) => {
    const submissionTime = new Date().toISOString();

    dispatch({
      type: 'LOG_ACTIVITY',
      payload: {
        type: 'examSubmitted',
        timestamp: submissionTime,
        answersCount: Object.keys(answers).length,
      },
    });

    dispatch({
      type: 'SUBMIT_EXAM',
      payload: { submissionTime },
    });

    // In production, POST exam data to examination server
    return {
      examId: state.currentExam?.id,
      answers,
      activityLog: state.activityLog,
      startTime: state.examStartTime,
      submissionTime,
    };
  }, [state]);

  /**
   * Exit exam mode
   * Cleans up exam session, can be called on completion or cancellation
   */
  const exitExamMode = useCallback(() => {
    dispatch({
      type: 'LOG_ACTIVITY',
      payload: {
        type: 'examEnded',
        timestamp: new Date().toISOString(),
      },
    });

    dispatch({ type: 'END_EXAM' });
  }, []);

  /**
   * Update exam restrictions
   * Teacher can restrict certain calculator modes during exam
   */
  const updateExamRestrictions = useCallback((restrictions) => {
    dispatch({
      type: 'UPDATE_EXAM_STATE',
      payload: restrictions,
    });
  }, []);

  const value = {
    examMode: state,
    currentExam: state.currentExam,
    examStartTime: state.examStartTime,
    isExamActive: state.isExamActive,
    activityLog: state.activityLog,
    startExam,
    updateExamActivity,
    submitExam,
    exitExamMode,
    updateExamRestrictions,
  };

  return (
    <ExamModeContext.Provider value={value}>
      {children}
    </ExamModeContext.Provider>
  );
};

/**
 * Hook: useExamMode
 * Provides convenient access to exam context from any component
 */
export const useExamMode = () => {
  const context = useContext(ExamModeContext);
  if (!context) {
    throw new Error('useExamMode must be used within ExamModeProvider');
  }
  return context;
};
