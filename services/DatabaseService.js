/**
 * Database Service
 *
 * Manages local data persistence using AsyncStorage.
 * Handles caching of classrooms, exams, and student data.
 *
 * The app uses local storage for offline capability and performance,
 * with network requests for real-time updates from the server.
 */

import AsyncStorage from '@react-native-async-storage/async-storage';

const DATABASE_KEYS = {
  CLASSROOMS: 'graphr_classrooms',
  EXAMS: 'graphr_exams',
  STUDENT_DATA: 'graphr_student_data',
  EXAM_SUBMISSIONS: 'graphr_exam_submissions',
  CALCULATION_HISTORY: 'graphr_calculation_history',
};

/**
 * Initialize database
 * Creates necessary storage structures on app launch
 */
export const initializeDatabase = async () => {
  try {
    // Check if database is already initialized
    const initialized = await AsyncStorage.getItem('graphr_initialized');

    if (!initialized) {
      // Create empty collections
      await AsyncStorage.setItem(DATABASE_KEYS.CLASSROOMS, JSON.stringify([]));
      await AsyncStorage.setItem(DATABASE_KEYS.EXAMS, JSON.stringify([]));
      await AsyncStorage.setItem(DATABASE_KEYS.STUDENT_DATA, JSON.stringify({}));
      await AsyncStorage.setItem(DATABASE_KEYS.EXAM_SUBMISSIONS, JSON.stringify([]));
      await AsyncStorage.setItem(DATABASE_KEYS.CALCULATION_HISTORY, JSON.stringify([]));

      // Mark database as initialized
      await AsyncStorage.setItem('graphr_initialized', 'true');

      console.log('Database initialized successfully');
    }
  } catch (error) {
    console.error('Database initialization error:', error);
  }
};

/**
 * Save classrooms to local storage
 */
export const saveClassrooms = async (classrooms) => {
  try {
    await AsyncStorage.setItem(
      DATABASE_KEYS.CLASSROOMS,
      JSON.stringify(classrooms)
    );
  } catch (error) {
    console.error('Error saving classrooms:', error);
  }
};

/**
 * Load classrooms from local storage
 */
export const loadClassrooms = async () => {
  try {
    const data = await AsyncStorage.getItem(DATABASE_KEYS.CLASSROOMS);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error loading classrooms:', error);
    return [];
  }
};

/**
 * Save exams to local storage
 */
export const saveExams = async (exams) => {
  try {
    await AsyncStorage.setItem(DATABASE_KEYS.EXAMS, JSON.stringify(exams));
  } catch (error) {
    console.error('Error saving exams:', error);
  }
};

/**
 * Load exams from local storage
 */
export const loadExams = async () => {
  try {
    const data = await AsyncStorage.getItem(DATABASE_KEYS.EXAMS);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error loading exams:', error);
    return [];
  }
};

/**
 * Save exam submission
 * Records when student submits an exam with all responses
 */
export const saveExamSubmission = async (submission) => {
  try {
    const submissions = await loadExamSubmissions();
    submissions.push({
      ...submission,
      submittedAt: new Date().toISOString(),
    });
    await AsyncStorage.setItem(
      DATABASE_KEYS.EXAM_SUBMISSIONS,
      JSON.stringify(submissions)
    );
  } catch (error) {
    console.error('Error saving exam submission:', error);
  }
};

/**
 * Load exam submissions
 */
export const loadExamSubmissions = async () => {
  try {
    const data = await AsyncStorage.getItem(DATABASE_KEYS.EXAM_SUBMISSIONS);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error loading exam submissions:', error);
    return [];
  }
};

/**
 * Save calculation to history
 * Logs each calculation for learning analytics
 */
export const saveCalculation = async (calculation) => {
  try {
    const history = await loadCalculationHistory();

    // Keep only last 1000 calculations to manage storage
    if (history.length >= 1000) {
      history.shift();
    }

    history.push({
      ...calculation,
      timestamp: new Date().toISOString(),
    });

    await AsyncStorage.setItem(
      DATABASE_KEYS.CALCULATION_HISTORY,
      JSON.stringify(history)
    );
  } catch (error) {
    console.error('Error saving calculation:', error);
  }
};

/**
 * Load calculation history
 */
export const loadCalculationHistory = async () => {
  try {
    const data = await AsyncStorage.getItem(DATABASE_KEYS.CALCULATION_HISTORY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error loading calculation history:', error);
    return [];
  }
};

/**
 * Save student performance data
 */
export const saveStudentData = async (studentData) => {
  try {
    await AsyncStorage.setItem(
      DATABASE_KEYS.STUDENT_DATA,
      JSON.stringify(studentData)
    );
  } catch (error) {
    console.error('Error saving student data:', error);
  }
};

/**
 * Load student performance data
 */
export const loadStudentData = async () => {
  try {
    const data = await AsyncStorage.getItem(DATABASE_KEYS.STUDENT_DATA);
    return data ? JSON.parse(data) : {};
  } catch (error) {
    console.error('Error loading student data:', error);
    return {};
  }
};

/**
 * Clear all database (for testing or account reset)
 */
export const clearDatabase = async () => {
  try {
    await AsyncStorage.multiRemove(Object.values(DATABASE_KEYS));
    await AsyncStorage.removeItem('graphr_initialized');
    console.log('Database cleared');
  } catch (error) {
    console.error('Error clearing database:', error);
  }
};
