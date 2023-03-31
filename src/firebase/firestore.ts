// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from 'firebase/storage'
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FRIEBASE_API_KEY,
  authDomain: process.env.REACT_APP_FRIEBASE_AUTHDOMAIN,
  projectId: process.env.REACT_APP_FRIEBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FRIEBASE_STOREAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FRIEBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FRIEBASE_APP_ID,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const db = getFirestore(app);

const auth = getAuth(app);

const storage = getStorage(app);

export { db, auth ,storage };
