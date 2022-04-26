import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "@firebase/firestore";
import { getStorage } from "@firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyAAs7fULp189ScZe1efX-tBSEyV457FFqQ",
  authDomain: "dlw-backend.firebaseapp.com",
  databaseURL:
    "https://dlw-backend-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "dlw-backend",
  storageBucket: "dlw-backend.appspot.com",
  messagingSenderId: "103837617836",
  appId: "1:103837617836:web:291b33d0e75b3b2249d909",
  measurementId: "G-63F7KYM5TV",
};

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);

export const firestore = getFirestore(firebaseApp);
export const storage = getStorage(firebaseApp);
export const authentication = getAuth(firebaseApp);
