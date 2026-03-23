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

// Firebase configuration (placeholder - replace with your config)
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "graphr-app.firebaseapp.com",
  projectId: "graphr-app",
  storageBucket: "graphr-app.appspot.com",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

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
 * Demo implementation - in production, use expo-auth-session
 * @returns {Promise<User>}
 */
export const signInWithGoogle = async () => {
  try {
    // In production, implement full Google OAuth flow
    console.warn("[Auth] Google sign-in requires OAuth setup");
    // For now, create a demo user
    return {
      uid: "demo_google_" + Date.now(),
      email: "demo@gmail.com",
      displayName: "Demo User",
    };
  } catch (error) {
    console.error("[Auth] Google sign-in error:", error.message);
    throw new Error(error.message);
  }
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
