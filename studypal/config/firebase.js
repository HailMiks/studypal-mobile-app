// Import the functions you need from the SDKs you need
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import { initializeApp } from "firebase/app";
import { getAuth, initializeAuth, getReactNativePersistence } from 'firebase/auth';
import { getFirestore } from "firebase/firestore";
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';


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
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage)
});
const db = getFirestore(app);

export { auth };


