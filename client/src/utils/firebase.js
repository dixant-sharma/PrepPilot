import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const apiKey = import.meta.env.VITE_FIREBASE_APIKEY || import.meta.env.VITE_FIREBASE_API_KEY;

if (!apiKey || apiKey === "add your firebase key") {
  console.warn("⚠️ Firebase Warning: VITE_FIREBASE_APIKEY is missing or invalid in .env file.");
}

const firebaseConfig = {
  apiKey: apiKey || "",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "interviewiq-ba6ba.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "interviewiq-ba6ba",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "interviewiq-ba6ba.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "862159592601",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:862159592601:web:7308d702cd708076ddec08"
};

console.log("Firebase initialized with config:", {
  apiKey: firebaseConfig.apiKey ? `${firebaseConfig.apiKey.substring(0, 6)}...` : "UNDEFINED",
  authDomain: firebaseConfig.authDomain,
  projectId: firebaseConfig.projectId
});

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);
const provider = new GoogleAuthProvider();
provider.setCustomParameters({ prompt: 'select_account' });

export { auth, provider };