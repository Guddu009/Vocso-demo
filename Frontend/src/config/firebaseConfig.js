import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// TODO: Replace with your actual Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyAGva1_m0D6mNVZ7d5AquE7YPReSLsySPs",
  authDomain: "bondmate-ede19.firebaseapp.com",
  projectId: "bondmate-ede19",
  storageBucket: "bondmate-ede19.firebasestorage.app",
  messagingSenderId: "773116592614",
  appId: "1:773116592614:android:712f8a7cf16ad766b59627"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
