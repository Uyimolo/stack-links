// Import the functions you need from the SDKs you need
import { initializeApp, FirebaseError } from "firebase/app"
import { getAuth } from "firebase/auth"
// import { getAnalytics } from "firebase/analytics"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDHsLw1h6vkH7MolF5rr4MZealZvhisoMQ",
  authDomain: "stack-links.firebaseapp.com",
  projectId: "stack-links",
  storageBucket: "stack-links.firebasestorage.app",
  messagingSenderId: "983683858263",
  appId: "1:983683858263:web:861ff133cc8a7e47668812",
  measurementId: "G-7EYECMYYRM",
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)
export const auth = getAuth(app)
export const firebaseError = FirebaseError
// const analytics = getAnalytics(app)
