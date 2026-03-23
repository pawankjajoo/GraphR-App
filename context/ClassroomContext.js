/**
 * Classroom Context
 *
 * Manages classroom enrollment and real-time classroom data.
 * Provides student and teacher-specific classroom information.
 *
 * Responsibilities:
 * - Load classrooms the user is enrolled in
 * - Fetch and manage exam/assignment data
 * - Handle real-time updates from classroom server
 * - Manage student roster for teachers
 */

import React, { useReducer, useContext, useCallback } from 'react';

const ClassroomContext = React.createContext();

/**
 * Classroom state reducer
 * Manages classroom data and enrollment
 */
const classroomReducer = (state, action) => {
  switch (action.type) {
    case 'LOAD_CLASSROOMS':
      return {
        ...state,
        classrooms: action.payload,
        isLoading: false,
      };
    case 'LOAD_EXAMS':
      return {
        ...state,
        exams: action.payload,
      };
    case 'ADD_CLASSROOM':
      return {
        ...state,
        classrooms: [...state.classrooms, action.payload],
      };
    case 'UPDATE_EXAM':
      return {
        ...state,
        exams: state.exams.map((exam) =>
          exam.id === action.payload.id ? action.payload : exam
        ),
      };
    case 'LOAD_STUDENTS':
      return {
        ...state,
        students: action.payload,
      };
    default:
      return state;
  }
};

/**
 * Classroom Context Provider
 * Provides classroom data to all components
 */
export const ClassroomProvider = ({ children }) => {
  const [state, dispatch] = useReducer(classroomReducer, {
    classrooms: [],
    exams: [],
    students: [],
    isLoading: false,
  });

  /**
   * Load classrooms for current user
   * Fetches all classrooms user is enrolled in
   */
  const loadClassrooms = useCallback(async () => {
    try {
      // In production, fetch from API
      const mockClassrooms = [
        {
          id: 'class_001',
          name: 'Algebra I',
          code: 'ALG1A',
          teacherName: 'Dr. Johnson',
          period: '1st Period',
          enrollmentDate: new Date().toISOString(),
        },
        {
          id: 'class_002',
          name: 'Geometry',
          code: 'GEO1A',
          teacherName: 'Ms. Smith',
          period: '3rd Period',
          enrollmentDate: new Date().toISOString(),
        },
      ];

      dispatch({
        type: 'LOAD_CLASSROOMS',
        payload: mockClassrooms,
      });

      return mockClassrooms;
    } catch (error) {
      console.error('Error loading classrooms:', error);
      return [];
    }
  }, []);

  /**
   * Load exams for current user
   * Fetches all upcoming exams in enrolled classrooms
   */
  const loadExams = useCallback(async () => {
    try {
      // In production, fetch from API
      const mockExams = [
        {
          id: 'exam_001',
          title: 'Algebra I Midterm',
          classroomId: 'class_001',
          classroomName: 'Algebra I',
          dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
          durationMinutes: 60,
          questionCount: 20,
          isAvailable: true,
        },
        {
          id: 'exam_002',
          title: 'Geometry Quiz 1',
          classroomId: 'class_002',
          classroomName: 'Geometry',
          dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
          durationMinutes: 30,
          questionCount: 15,
          isAvailable: true,
        },
      ];

      dispatch({
        type: 'LOAD_EXAMS',
        payload: mockExams,
      });

      return mockExams;
    } catch (error) {
      console.error('Error loading exams:', error);
      return [];
    }
  }, []);

  /**
   * Load students in a classroom
   * Teacher-only function
   * Fetches roster of all enrolled students
   */
  const loadStudents = useCallback(async (classroomId) => {
    try {
      // In production, fetch from API
      const mockStudents = [
        {
          id: 'student_001',
          name: 'Alice Johnson',
          email: 'alice@school.edu',
          enrollmentDate: new Date().toISOString(),
        },
        {
          id: 'student_002',
          name: 'Bob Smith',
          email: 'bob@school.edu',
          enrollmentDate: new Date().toISOString(),
        },
        {
          id: 'student_003',
          name: 'Carol White',
          email: 'carol@school.edu',
          enrollmentDate: new Date().toISOString(),
        },
      ];

      dispatch({
        type: 'LOAD_STUDENTS',
        payload: mockStudents,
      });

      return mockStudents;
    } catch (error) {
      console.error('Error loading students:', error);
      return [];
    }
  }, []);

  /**
   * Join a classroom
   * Student uses code to enroll in a classroom
   */
  const joinClassroom = useCallback(async (classCode) => {
    try {
      // In production, validate code and add enrollment
      const newClassroom = {
        id: `class_${Date.now()}`,
        name: 'New Class',
        code: classCode,
        teacherName: 'Teacher Name',
        period: 'TBD',
        enrollmentDate: new Date().toISOString(),
      };

      dispatch({
        type: 'ADD_CLASSROOM',
        payload: newClassroom,
      });

      return { success: true, classroom: newClassroom };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }, []);

  /**
   * Create a new exam
   * Teacher-only function
   * Creates exam and makes it available to students
   */
  const createExam = useCallback(async (examData) => {
    try {
      // In production, POST to API
      const newExam = {
        id: `exam_${Date.now()}`,
        ...examData,
        createdAt: new Date().toISOString(),
      };

      dispatch({
        type: 'UPDATE_EXAM',
        payload: newExam,
      });

      return { success: true, exam: newExam };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }, []);

  /**
   * Get exam details
   * Retrieves full exam data including questions
   */
  const getExamDetails = useCallback((examId) => {
    return state.exams.find((exam) => exam.id === examId);
  }, [state.exams]);

  /**
   * Get classroom details
   * Retrieves full classroom information
   */
  const getClassroomDetails = useCallback((classroomId) => {
    return state.classrooms.find((classroom) => classroom.id === classroomId);
  }, [state.classrooms]);

  const value = {
    classrooms: state.classrooms,
    exams: state.exams,
    students: state.students,
    isLoading: state.isLoading,
    loadClassrooms,
    loadExams,
    loadStudents,
    joinClassroom,
    createExam,
    getExamDetails,
    getClassroomDetails,
  };

  return (
    <ClassroomContext.Provider value={value}>
      {children}
    </ClassroomContext.Provider>
  );
};

/**
 * Hook: useClassroom
 * Provides convenient access to classroom context from any component
 */
export const useClassroom = () => {
  const context = useContext(ClassroomContext);
  if (!context) {
    throw new Error('useClassroom must be used within ClassroomProvider');
  }
  return context;
};
