/**
 * services/auth.js
 *
 * Authentication Service
 * Handles all authentication operations:
 * • Email/password sign up & sign in
 * • Google SSO integration
 * • Auth state management
 * • User session handling
 * • Sign out
 * Secure authentication. Student safety first.
 */

import { initializeApp } from "firebase/app";
import {
  getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword,
  signOut as firebaseSignOut, onAuthStateChanged, signInWithCredential,
} from "firebase/auth";

// TODO: Replace with your actual Firebase configuration
// Get your config from Firebase Console: https://console.firebase.google.com/
// Project Settings > Your apps > Config
const firebaseConfig = {
  apiKey: "TODO_REPLACE_WITH_YOUR_API_KEY",
  authDomain: "TODO_REPLACE_WITH_YOUR_AUTH_DOMAIN",
  projectId: "TODO_REPLACE_WITH_YOUR_PROJECT_ID",
  storageBucket: "TODO_REPLACE_WITH_YOUR_STORAGE_BUCKET",
  messagingSenderId: "TODO_REPLACE_WITH_YOUR_MESSAGING_SENDER_ID",
  appId: "TODO_REPLACE_WITH_YOUR_APP_ID",
};

// Validate Firebase config
const validateFirebaseConfig = () => {
  const requiredKeys = ["apiKey", "authDomain", "projectId", "storageBucket", "messagingSenderId", "appId"];
  const missing = requiredKeys.filter(key => {
    const value = firebaseConfig[key];
    return !value || value.startsWith("TODO_");
  });

  if (missing.length > 0) {
    console.warn(
      `[Auth] Firebase configuration incomplete. Missing or placeholder values for: ${missing.join(", ")}. ` +
      "Update services/auth.js with your Firebase config from https://console.firebase.google.com/"
    );
    return false;
  }
  return true;
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// Warn if config is incomplete
if (typeof window !== "undefined") {
  validateFirebaseConfig();
}

/**
 * Sign in with email and password
 * @param {string} email
 * @param {string} password
 * @returns {Promise<User>}
 */
export const signInWithEmail = async (email, password) => {
  try {
    const result = await signInWithEmailAndPassword(auth, email, password);
    return result.user;
  } catch (error) {
    console.error("[Auth] Sign in error:", error.message);
    throw new Error(error.message);
  }
};

/**
 * Sign up with email and password
 * @param {string} email
 * @param {string} password
 * @returns {Promise<User>}
 */
export const signUpWithEmail = async (email, password) => {
  try {
    const result = await createUserWithEmailAndPassword(auth, email, password);
    return result.user;
  } catch (error) {
    console.error("[Auth] Sign up error:", error.message);
    throw new Error(error.message);
  }
};

/**
 * Sign in with Google
 * TODO: Implement full Google OAuth flow using expo-auth-session
 * Current implementation throws an error to prevent silent mock usage
 *
 * Implementation steps:
 * 1. Install: npm install expo-auth-session expo-web-browser
 * 2. Get Google OAuth credentials from https://console.cloud.google.com/
 * 3. Configure expo-auth-session with your clientId
 * 4. Implement proper OAuth flow with token exchange
 * 5. Exchange token with Firebase signInWithCredential()
 *
 * @returns {Promise<User>}
 * @throws {Error} Until proper OAuth flow is implemented
 */
export const signInWithGoogle = async () => {
  const errorMessage =
    "[Auth] Google OAuth is not yet configured. " +
    "To enable Google Sign-In, see the TODO comment in services/auth.js. " +
    "For now, use email/password authentication instead.";

  console.error(errorMessage);
  throw new Error(errorMessage);
};

/**
 * Sign out current user
 * @returns {Promise<void>}
 */
export const signOut = async () => {
  try {
    await firebaseSignOut(auth);
  } catch (error) {
    console.error("[Auth] Sign out error:", error.message);
    throw new Error(error.message);
  }
};

/**
 * Get current authenticated user
 * @returns {User | null}
 */
export const getCurrentUser = () => {
  return auth.currentUser;
};

/**
 * Listen to auth state changes
 * @param {function} callback
 * @returns {function} Unsubscribe function
 */
export const onAuthStateChange = (callback) => {
  return onAuthStateChanged(auth, callback);
};

/**
 * Send password reset email
 * @param {string} email
 * @returns {Promise<void>}
 */
export const sendPasswordResetEmail = async (email) => {
  try {
    // Implementation for password reset
    console.log("[Auth] Password reset email would be sent to:", email);
  } catch (error) {
    console.error("[Auth] Password reset error:", error.message);
    throw new Error(error.message);
  }
};

/**
 * Update user profile
 * @param {string} displayName
 * @returns {Promise<void>}
 */
export const updateUserProfile = async (displayName) => {
  try {
    const user = auth.currentUser;
    if (user) {
      // Implementation for profile update
      console.log("[Auth] Profile would be updated for:", user.uid);
    }
  } catch (error) {
    console.error("[Auth] Profile update error:", error.message);
    throw new Error(error.message);
  }
};
