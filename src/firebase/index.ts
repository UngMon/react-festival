// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FRIEBASE_API_KEY,
  authDomain: process.env.REACT_APP_FRIEBASE_AUTHDOMAIN,
  projectId: process.env.REACT_APP_FRIEBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FRIEBASE_STOREAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FRIEBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FRIEBASE_APP_ID,
  measurementId: process.env.REACT_APP_FIREBASE_MEASURMENTID,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const db = getFirestore(app);

const auth = getAuth(app);

const storage = getStorage(app);

// // localhost에서 개발 중일 때만 이 코드가 실행됩니다.
// if (window.location.hostname === "localhost") {
//   // 9099는 Auth 에뮬레이터 포트입니다.
//   connectAuthEmulator(auth, "http://127.0.0.1:9099");

//   // Storage 에뮬레이터 (기본 포트 9199) - 추가 필수!
//   connectStorageEmulator(storage, "127.0.0.1", 9199);

//   // Firestore 에뮬레이터 (8080) - 사용 중이라면 추가 권장
//   connectFirestoreEmulator(db, "127.0.0.1", 8080);
// }

export { db, auth, storage };
