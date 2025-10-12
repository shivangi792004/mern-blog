// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "mern-blog-ea557.firebaseapp.com",
  projectId: "mern-blog-ea557",
  storageBucket: "mern-blog-ea557.firebasestorage.app",
  messagingSenderId: "828974915221",
  appId: "1:828974915221:web:59fb43cfab9284cac7859c"
};

// Initialize Firebase

export const app = initializeApp(firebaseConfig);