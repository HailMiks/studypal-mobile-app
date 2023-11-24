// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import { getAuth } from 'firebase/auth'

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyB_SQiMJxxvqEafHVks3Kwmct2UaMscGHI",
  authDomain: "fir-auth-f337c.firebaseapp.com",
  projectId: "fir-auth-f337c",
  storageBucket: "fir-auth-f337c.appspot.com",
  messagingSenderId: "21490833219",
  appId: "1:21490833219:web:a8c90fc264b7d71d2281f6"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);