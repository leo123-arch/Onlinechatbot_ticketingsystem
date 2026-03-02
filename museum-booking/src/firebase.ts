// Import Firebase core
import { initializeApp } from "firebase/app";

// Import Auth and Firestore
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyCAjYdfe4zNjpurPVv-TUDXuTwp8MjWLN8",
  authDomain: "museum-booking-ea554.firebaseapp.com",
  projectId: "museum-booking-ea554",
  storageBucket: "museum-booking-ea554.firebasestorage.app",
  messagingSenderId: "460911242100",
  appId: "1:460911242100:web:743f829e443853ca985a21",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// ✅ Export Auth
export const auth = getAuth(app);

// ✅ Export Firestore (for later use)
export const db = getFirestore(app);