/*
 * services/firebase.js
 *
 * Firebase Configuration & Initialization
 * Central Firebase setup:
 * • Initialize Firebase app
 * • Configure Firestore
 * • Configure Storage
 * • Export initialized instances
 * Single source of truth for all Firebase operations.
 */

import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAuth } from "firebase/auth";

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

// Validate Firebase config at startup
const validateFirebaseConfig = () => {
  const requiredKeys = ["apiKey", "authDomain", "projectId", "storageBucket", "messagingSenderId", "appId"];
  const missing = requiredKeys.filter(key => {
    const value = firebaseConfig[key];
    return !value || value.startsWith("TODO_");
  });

  if (missing.length > 0) {
    console.warn(
      `[Firebase] Configuration incomplete. Missing or placeholder values for: ${missing.join(", ")}. ` +
      "Update services/firebase.js with your Firebase config from https://console.firebase.google.com/"
    );
    return false;
  }
  return true;
};

const app = initializeApp(firebaseConfig);

// Warn if config is incomplete
if (typeof window !== "undefined") {
  validateFirebaseConfig();
}

// Initialize Firebase services
const db = getFirestore(app);
const storage = getStorage(app);
const auth = getAuth(app);

// Export instances for use in other services
export { app, db, storage, auth };

/*
 * Firebase Configuration Status
 * To complete setup:
 * 1. Create a Firebase project: https://console.firebase.google.com/
 * 2. Copy your config from Project Settings > Your apps > Config
 * 3. Update the firebaseConfig object above with your actual credentials
 * 4. Deploy Firestore rules: firebase deploy --only firestore:rules
 *
 * All Firestore collections, rules, and security settings
 * are configured in firestore.rules
 */
