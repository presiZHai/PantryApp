// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore'

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAzXOMQras5DQSLeGGnIH_HdEUu1PxX8_E",
  authDomain: "pantryapp-40a56.firebaseapp.com",
  projectId: "pantryapp-40a56",
  storageBucket: "pantryapp-40a56.appspot.com",
  messagingSenderId: "587653953772",
  appId: "1:587653953772:web:ede56f61b22a0ec305cdc9"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore
const firestore = getFirestore(app);

// Export the initialized app and firestore
export { app, firestore, firebaseConfig };