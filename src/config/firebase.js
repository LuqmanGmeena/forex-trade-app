// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getFunctions } from "firebase/functions";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCK6EkdFdzlexD4gvm8zUh64dh3C2uG04w",
  authDomain: "forex-trade-app.firebaseapp.com",
  projectId: "forex-trade-app",
  storageBucket: "forex-trade-app.firebasestorage.app",
  messagingSenderId: "417544606948",
  appId: "1:417544606948:web:e35e90495bcddcfdd948f1"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const analytics = getAnalytics(app);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export const functions = getFunctions(app);

export default app;