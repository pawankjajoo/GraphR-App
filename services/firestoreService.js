/*
 * services/firestoreService.js
 *
 * Firestore Database Service
 * Handles all Firestore CRUD operations:
 * • Classroom management
 * • Exam creation & updates
 * • Grade recording
 * • Student analytics
 * All operations respect Firestore security rules.
 * Real-time data synchronization.
 */

import { db } from "./firebase";
import {
  collection, addDoc, updateDoc, deleteDoc, doc, getDocs, query, where, onSnapshot,
} from "firebase/firestore";

/*
 * Create a new classroom
 * @param {object} classroomData
 * @returns {Promise<string>} Document ID
 */
export const createClassroom = async (classroomData) => {
  try {
    const docRef = await addDoc(collection(db, "classrooms"), {
      ...classroomData,
      createdAt: new Date(),
    });
    return docRef.id;
  } catch (error) {
    console.error("[Firestore] Create classroom error:", error.message);
    throw error;
  }
};

/*
 * Update classroom
 * @param {string} classroomId
 * @param {object} updates
 * @returns {Promise<void>}
 */
export const updateClassroom = async (classroomId, updates) => {
  try {
    await updateDoc(doc(db, "classrooms", classroomId), {
      ...updates,
      updatedAt: new Date(),
    });
  } catch (error) {
    console.error("[Firestore] Update classroom error:", error.message);
    throw error;
  }
};

/*
 * Create a new exam
 * @param {object} examData
 * @returns {Promise<string>} Document ID
 */
export const createExam = async (examData) => {
  try {
    const docRef = await addDoc(collection(db, "exams"), {
      ...examData,
      createdAt: new Date(),
    });
    return docRef.id;
  } catch (error) {
    console.error("[Firestore] Create exam error:", error.message);
    throw error;
  }
};

/*
 * Get exams for a classroom
 * @param {string} classroomId
 * @returns {Promise<array>}
 */
export const getClassroomExams = async (classroomId) => {
  try {
    const q = query(collection(db, "exams"), where("classroomId", "==", classroomId));
    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error("[Firestore] Get classroom exams error:", error.message);
    throw error;
  }
};

/*
 * Record exam result / grade
 * @param {string} studentId
 * @param {string} examId
 * @param {object} resultData
 * @returns {Promise<string>} Document ID
 */
export const recordExamResult = async (studentId, examId, resultData) => {
  try {
    const docRef = await addDoc(collection(db, "examResults"), {
      studentId,
      examId,
      ...resultData,
      submittedAt: new Date(),
    });
    return docRef.id;
  } catch (error) {
    console.error("[Firestore] Record exam result error:", error.message);
    throw error;
  }
};

/*
 * Get student's exam results
 * @param {string} studentId
 * @returns {Promise<array>}
 */
export const getStudentResults = async (studentId) => {
  try {
    const q = query(collection(db, "examResults"), where("studentId", "==", studentId));
    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error("[Firestore] Get student results error:", error.message);
    throw error;
  }
};

/*
 * Get exam analytics for a classroom
 * @param {string} examId
 * @returns {Promise<array>}
 */
export const getExamAnalytics = async (examId) => {
  try {
    const q = query(collection(db, "examResults"), where("examId", "==", examId));
    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error("[Firestore] Get exam analytics error:", error.message);
    throw error;
  }
};

/*
 * Log exam violation (app switch)
 * @param {string} studentId
 * @param {string} examId
 * @param {object} violationData
 * @returns {Promise<string>} Document ID
 */
export const logExamViolation = async (studentId, examId, violationData) => {
  try {
    const docRef = await addDoc(collection(db, "examViolations"), {
      studentId,
      examId,
      ...violationData,
      timestamp: new Date(),
    });
    return docRef.id;
  } catch (error) {
    console.error("[Firestore] Log violation error:", error.message);
    throw error;
  }
};

/*
 * Listen to real-time exam violations
 * @param {string} examId
 * @param {function} callback
 * @returns {function} Unsubscribe function
 */
export const onExamViolations = (examId, callback) => {
  const q = query(collection(db, "examViolations"), where("examId", "==", examId));
  return onSnapshot(q, (snapshot) => {
    const violations = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    callback(violations);
  });
};

/*
 * Update exam status
 * @param {string} examId
 * @param {string} status - "draft", "active", "closed"
 * @returns {Promise<void>}
 */
export const updateExamStatus = async (examId, status) => {
  try {
    await updateDoc(doc(db, "exams", examId), {
      status,
      updatedAt: new Date(),
    });
  } catch (error) {
    console.error("[Firestore] Update exam status error:", error.message);
    throw error;
  }
};

/*
 * Delete exam
 * @param {string} examId
 * @returns {Promise<void>}
 */
export const deleteExam = async (examId) => {
  try {
    await deleteDoc(doc(db, "exams", examId));
  } catch (error) {
    console.error("[Firestore] Delete exam error:", error.message);
    throw error;
  }
};
