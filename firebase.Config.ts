// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBa19MmiYMpP4G_ttngdHkpK5NeKqUrG1w",
  authDomain: "kissapp-70efd.firebaseapp.com",
  projectId: "kissapp-70efd",
  storageBucket: "kissapp-70efd.firebasestorage.app",
  messagingSenderId: "85509996152",
  appId: "1:85509996152:web:3229b9c5a5802b40ac778d",
  measurementId: "G-EG9C27PRZH"
};

// Initialize Firebase
const FIREBASE_APP = initializeApp(firebaseConfig);
const FIREBASE_AUTH = getAuth(FIREBASE_APP);

// Export the instances
export { FIREBASE_APP, FIREBASE_AUTH };