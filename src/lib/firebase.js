// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAvGo4hox2GAeOdCBjCAE9DfmCg0a19bq0",
  authDomain: "grading-project-3265f.firebaseapp.com",
  projectId: "grading-project-3265f",
  storageBucket: "grading-project-3265f.appspot.com",
  messagingSenderId: "68217711768",
  appId: "1:68217711768:web:0188f28a1b54b8db59b4ed",
  measurementId: "G-GR6XYBCWZR"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);


export { db, auth }