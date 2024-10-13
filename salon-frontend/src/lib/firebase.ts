"use client";
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Add your Firebase config object
const firebaseConfig = {
    apiKey:
        import.meta.env.VITE_FIRESTORE_API_KEY ||
        process.env.VITE_FIRESTORE_API_KEY,
    authDomain:
        import.meta.env.VITE_FIRESTORE_AUTH_DOMAIN ||
        process.env.VITE_FIRESTORE_AUTH_DOMAIN,
    projectId:
        import.meta.env.VITE_FIRESTORE_PROJECT_ID ||
        process.env.VITE_FIRESTORE_PROJECT_ID,
    storageBucket:
        import.meta.env.VITE_FIRESTORE_STORAGE_BUCKET ||
        process.env.VITE_FIRESTORE_STORAGE_BUCKET,
    messagingSenderId:
        import.meta.env.VITE_FIRESTORE_MESSAGING_SENDER_ID ||
        process.env.VITE_FIRESTORE_MESSAGING_SENDER_ID,
    appId:
        import.meta.env.VITE_FIRESTORE_APP_ID ||
        process.env.VITE_FIRESTORE_APP_ID,
    measurementId:
        import.meta.env.VITE_FIRESTORE_MEASUREMENT_ID ||
        process.env.VITE_FIRESTORE_MEASUREMENT_ID,
};
// Connect to your Firebase app
export const firebaseApp = initializeApp(firebaseConfig);
// Connect to your Firestore database
export const firebaseDb = getFirestore(firebaseApp);
// Connect to Firebase auth
export const firebaseAuth = getAuth(firebaseApp);
