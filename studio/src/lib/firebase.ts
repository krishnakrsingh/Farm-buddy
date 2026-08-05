// Firebase Realtime Database client for Farm-Buddy
// Receives live sensor data from ESP32-C3 hardware nodes

import { initializeApp, getApps } from "firebase/app";
import { getDatabase, ref, onValue, type Database } from "firebase/database";

const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "",
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "",
    databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL || "",
};

// Only initialize if we have a database URL configured
let database: Database | null = null;

if (firebaseConfig.databaseURL) {
    const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
    database = getDatabase(app);
}

export { database, ref, onValue };
export const isFirebaseConfigured = !!firebaseConfig.databaseURL;
