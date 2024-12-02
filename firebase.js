// Import required Firebase modules
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Replace this with your Firebase project config
const firebaseConfig = {
    apiKey: "AIzaSyAUSiEhJz5dXYQyNxQc7ySxIfq4VzWSMHw",
    authDomain: "sdsds-ebdd9.firebaseapp.com",
    databaseURL: "https://sdsds-ebdd9-default-rtdb.firebaseio.com",
    projectId: "sdsds-ebdd9",
    storageBucket: "sdsds-ebdd9.firebasestorage.app",
    messagingSenderId: "888532283103",
    appId: "1:888532283103:web:33319adc30e114ffef436a",
    measurementId: "G-Q714CG922M"
  };
  
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const firestore = getFirestore(app);
