// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCoSdfcaeO0L5abtWjrVi0Jt7y_U52-rNw",
  authDomain: "relator-fda6f.firebaseapp.com",
  projectId: "relator-fda6f",
  storageBucket: "relator-fda6f.appspot.com",
  messagingSenderId: "202894508109",
  appId: "1:202894508109:web:549d3eadaaa876d94b1c04",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
