import { getApp, getApps, initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyA3rnlAirWs3a8SHJ96Itf1locqI7WfaLo",
  authDomain: "retro-routes.firebaseapp.com",
  projectId: "retro-routes",
  storageBucket: "retro-routes.firebasestorage.app",
  messagingSenderId: "704645418193",
  appId: "1:704645418193:web:c6069f287521444f2249f0",
  measurementId: "G-1ZB44T66VQ",
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
auth.useDeviceLanguage();

export { app, auth };
