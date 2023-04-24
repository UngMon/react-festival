// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAXS3GyktvwjcLU3AeLdpEUqrNp-Tx4lKA",
  authDomain: "festival-5a61a.firebaseapp.com",
  databaseURL: "https://festival-5a61a-default-rtdb.firebaseio.com",
  projectId: "festival-5a61a",
  storageBucket: "festival-5a61a.appspot.com",
  messagingSenderId: "677436762893",
  appId: "1:677436762893:web:0dd9d968bd2194eb16de44"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const db = getFirestore(app);

const auth = getAuth(app);

const storage = getStorage(app);

export { db, auth, storage };
