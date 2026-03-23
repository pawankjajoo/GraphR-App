/**
 * Network Service
 *
 * Manages network connectivity and communication with examination server.
 *
 * Responsibilities:
 * - Detect network state changes
 * - Queue operations when offline
 * - Send batched updates when connection restored
 * - Handle exam data sync with server
 * - Report unapproved activities to examination server
 */

import NetInfo from '@react-native-community/netinfo';

let isOnline = true;
let networkStateSubscription = null;

/**
 * Register network connectivity listener
 * Detects when device goes online/offline
 */
export const registerNetworkListener = () => {
  networkStateSubscription = NetInfo.addEventListener((state) => {
    const newIsOnline = state.isConnected && state.isInternetReachable;

    if (!isOnline && newIsOnline) {
      // Network restored, sync queued data
      console.log('Network restored, syncing queued data...');
      syncQueuedData();
    } else if (isOnline && !newIsOnline) {
      // Network lost
      console.log('Network connection lost');
    }

    isOnline = newIsOnline;
  });

  return () => {
    networkStateSubscription?.unsubscribe();
  };
};

/**
 * Check if device is online
 */
export const isNetworkOnline = () => isOnline;

/**
 * Make HTTP request with error handling
 */
export const makeRequest = async (url, options = {}) => {
  try {
    const response = await fetch(url, {
      ...options,
      timeout: 10000,
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    return { success: true, data };
  } catch (error) {
    console.error('Network request error:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Sync exam data from server
 * Fetches latest exam list and questions for classrooms
 */
export const syncExamData = async (classroomIds) => {
  try {
    if (!isOnline) {
      return { success: false, error: 'No network connection' };
    }

    // In production, would POST to examination server
    // const result = await makeRequest('https://api.graphrapp.com/exams/sync', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ classroomIds }),
    // });

    console.log('Exam data synced');
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

/**
 * Report unapproved activity to examination server
 * Sends alert when student violates exam rules (app switching, etc)
 */
export const reportUnapprovedActivity = async (activity) => {
  try {
    if (!isOnline) {
      // Queue for later transmission
      queueActivity(activity);
      return { success: true, queued: true };
    }

    // In production, POST to examination server
    console.log('Reporting unapproved activity:', activity);

    // const result = await makeRequest(
    //   'https://api.graphrapp.com/exams/activity/report',
    //   {
    //     method: 'POST',
    //     headers: { 'Content-Type': 'application/json' },
    //     body: JSON.stringify(activity),
    //   }
    // );

    return { success: true };
  } catch (error) {
    queueActivity(activity);
    return { success: true, queued: true };
  }
};

/**
 * Submit exam to examination server
 * Sends all exam responses and activity log
 */
export const submitExamToServer = async (examData) => {
  try {
    if (!isOnline) {
      queueExamSubmission(examData);
      return { success: true, queued: true };
    }

    // In production, POST to examination server
    console.log('Submitting exam to server:', examData.examId);

    // const result = await makeRequest(
    //   'https://api.graphrapp.com/exams/submit',
    //   {
    //     method: 'POST',
    //     headers: { 'Content-Type': 'application/json' },
    //     body: JSON.stringify(examData),
    //   }
    // );

    return { success: true };
  } catch (error) {
    queueExamSubmission(examData);
    return { success: true, queued: true };
  }
};

/**
 * Queue activity for later transmission
 * Stored in local database when offline
 */
const queueActivity = (activity) => {
  // In production, would save to database
  console.log('Activity queued for transmission:', activity);
};

/**
 * Queue exam submission for later transmission
 */
const queueExamSubmission = (examData) => {
  // In production, would save to database
  console.log('Exam submission queued for transmission:', examData.examId);
};

/**
 * Sync all queued data when connection is restored
 */
const syncQueuedData = async () => {
  try {
    // In production, retrieve queued data from database
    // and send to examination server

    console.log('Syncing queued data with server...');
    // await Promise.all([
    //   syncQueuedActivities(),
    //   syncQueuedExamSubmissions(),
    // ]);

    console.log('Queued data synced successfully');
  } catch (error) {
    console.error('Error syncing queued data:', error);
  }
};

/**
 * Fetch classroom roster from server
 */
export const fetchClassroomRoster = async (classroomId) => {
  try {
    if (!isOnline) {
      return { success: false, error: 'No network connection' };
    }

    // In production, fetch from API
    // const result = await makeRequest(
    //   `https://api.graphrapp.com/classrooms/${classroomId}/students`
    // );

    return { success: true, data: [] };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

/**
 * Authenticate user with server
 */
export const authenticateUser = async (email, password, role) => {
  try {
    // In production, POST to authentication server
    // const result = await makeRequest(
    //   'https://api.graphrapp.com/auth/login',
    //   {
    //     method: 'POST',
    //     headers: { 'Content-Type': 'application/json' },
    //     body: JSON.stringify({ email, password, role }),
    //   }
    // );

    return {
      success: true,
      token: `token_${Date.now()}`,
      userId: `user_${Date.now()}`,
    };
  } catch (error) {
    return { success: false, error: error.message };
  }
};
