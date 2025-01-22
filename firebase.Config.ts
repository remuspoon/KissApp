// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

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
const FIREBASE_DB = getFirestore(FIREBASE_APP);
const FIREBASE_STORAGE = getStorage(FIREBASE_APP);

export { FIREBASE_APP, FIREBASE_AUTH, FIREBASE_DB, FIREBASE_STORAGE };