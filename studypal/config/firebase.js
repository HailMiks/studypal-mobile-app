// Import the functions you need from the SDKs you need
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import { initializeApp } from "firebase/app";
import { getAuth, initializeAuth, getReactNativePersistence } from 'firebase/auth';
import { getFirestore } from "firebase/firestore";
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';


// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCr-TD9m-zvOXgTvVtb9RcacGurV_trVi4",
  authDomain: "fir-auth-c157a.firebaseapp.com",
  projectId: "fir-auth-c157a",
  storageBucket: "fir-auth-c157a.appspot.com",
  messagingSenderId: "744279864432",
  appId: "1:744279864432:web:6f7652769fe94e1dd7b0b5"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage)
});
const db = getFirestore(app);

export { auth,getFirestore };


