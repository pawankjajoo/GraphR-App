/*
 * services/notifications.js

 *
 * Push Notifications Service
 * Handles push notification operations:
 * • Device registration
 * • Notification sending
 * • Notification routing
 * • Badge management
 * Keep users informed. Real-time exam alerts. Grade notifications.
 */

import * as Notifications from "expo-notifications";
import * as Device from "expo-device";

/*
 * Register device for push notifications
 * @param {string} userId
 * @returns {Promise<string>} Device token
 */
export const registerForPushNotifications = async (userId) => {
  try {
    // Check if device supports notifications
    if (!Device.isDevice) {
      console.warn("[Notifications] Notifications not supported on this device");
      return null;
    }

    // Get the device push token
    const token = await Notifications.getExpoPushTokenAsync({
      projectId: "YOUR_EXPO_PROJECT_ID",
    });

    // In production, send this token to your backend to store with user
    console.log("[Notifications] Device token registered:", token);

    return token;
  } catch (error) {
    console.error("[Notifications] Registration error:", error.message);
    throw error;
  }
};

/*
 * Send a local notification
 * @param {object} notificationData
 * @returns {Promise<void>}
 */
export const sendLocalNotification = async (notificationData) => {
  try {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: notificationData.title,
        body: notificationData.body,
        data: notificationData.data || {},
        badge: 1,
      },
      trigger: null, 
    });
  } catch (error) {
    console.error("[Notifications] Send notification error:", error.message);
    throw error;
  }
};

/*
 * Listen to notification taps
 * @param {function} callback
 * @returns {function} Unsubscribe function
 */
export const onNotificationTapped = (callback) => {
  const subscription = Notifications.addNotificationResponseReceivedListener((response) => {
    const data = response.notification.request.content.data;
    callback(data);
  });

  return () => subscription.remove();
};

/*
 * Clear badge count
 * @returns {Promise<void>}
 */
export const clearBadge = async () => {
  try {
    await Notifications.setBadgeCountAsync(0);
  } catch (error) {
    console.error("[Notifications] Clear badge error:", error.message);
    throw error;
  }
};

/*
 * Set notification handler
 * Call this in app initialization to handle notifications
 */
export const setNotificationHandler = () => {
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: true,
      shouldSetBadge: true,
    }),
  });
};

/*
 * Send exam alert notification
 * @param {object} exam
 * @returns {Promise<void>}
 */
export const sendExamAlert = async (exam) => {
  try {
    await sendLocalNotification({
      title: "Exam Starting Soon",
      body: `${exam.title} starts in 5 minutes`,
      data: { type: "exam_starts", examId: exam.id },
    });
  } catch (error) {
    console.error("[Notifications] Send exam alert error:", error.message);
    throw error;
  }
};

/*
 * Send grade posted notification
 * @param {object} result
 * @returns {Promise<void>}
 */
export const sendGradeNotification = async (result) => {
  try {
    await sendLocalNotification({
      title: "Grade Posted",
      body: `Your grade for ${result.examTitle} is ready: ${result.grade}`,
      data: { type: "grade_posted", examId: result.examId },
    });
  } catch (error) {
    console.error("[Notifications] Send grade notification error:", error.message);
    throw error;
  }
};

/*
 * Send violation alert (to teacher)
 * @param {object} violation
 * @returns {Promise<void>}
 */
export const sendViolationAlert = async (violation) => {
  try {
    await sendLocalNotification({
      title: "Exam Violation Detected",
      body: `Student ${violation.studentName} switched apps during exam`,
      data: { type: "exam_violation", studentId: violation.studentId },
    });
  } catch (error) {
    console.error("[Notifications] Send violation alert error:", error.message);
    throw error;
  }
};
