// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyD-2CQJakQM6gzmbgCWpn-PdMEqm2c2f44",
  authDomain: "go-cab-e7004.firebaseapp.com",
  projectId: "go-cab-e7004",
  storageBucket: "go-cab-e7004.appspot.com",
  messagingSenderId: "1023075533698",
  appId: "1:1023075533698:web:1a664d0dab97f21d58c59b"
};

// Initialize Firebase
const Firebase = initializeApp(firebaseConfig);
export const auth=getAuth(Firebase)

export default {Firebase,auth}


// import { initializeApp } from "firebase/app";
// import { getAuth } from "firebase/auth";
// import { getFirestore } from "firebase/firestore";
// import  {getStorage} from "firebase/storage"
// import dotenv from "dotenv";

// dotenv.config();

// const firebaseConfig = {
//   apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
//   authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
//   projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
//   storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
//   messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
//   appId: process.env.REACT_APP_FIREBASE_APP_ID,
//   measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID,
// };

// const app = initializeApp(firebaseConfig);
// const db = getFirestore(app);
// const auth = getAuth(app); 
// const storage = getStorage(app);
// export { app, auth, db, storage }; 