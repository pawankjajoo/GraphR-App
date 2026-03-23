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

const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "graphr-app.firebaseapp.com",
  projectId: "graphr-app",
  storageBucket: "graphr-app.appspot.com",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID",
};

const app = initializeApp(firebaseConfig);

// Initialize Firebase services
const db = getFirestore(app);
const storage = getStorage(app);
const auth = getAuth(app);

// Export instances for use in other services
export { app, db, storage, auth };

/*
 * Firebase is configured and ready for use
 * All Firestore collections, rules, and security settings
 * are configured in firestore.rules
 */
