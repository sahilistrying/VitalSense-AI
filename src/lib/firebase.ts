import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyAUP-r9Mm_y1vJiV53HWcmOAaSwPSIoyBc",
  authDomain: "cyfuture-7971e.firebaseapp.com",
  projectId: "cyfuture-7971e",
  storageBucket: "cyfuture-7971e.firebasestorage.app",
  messagingSenderId: "58314934764",
  appId: "1:58314934764:web:a8591cfe409d73dee118c9",
  databaseURL: "https://cyfuture-7971e-default-rtdb.firebaseio.com",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);

// Initialize Realtime Database and get a reference to the service
export const database = getDatabase(app);

export default app;
