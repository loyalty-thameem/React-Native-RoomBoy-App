// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getDatabase } from 'firebase/database';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBty8AzmpVVj_RdGrtDomidWEs9ytBWNEo",
  authDomain: "roomboy-8650a.firebaseapp.com",
  databaseURL: "https://roomboy-8650a-default-rtdb.firebaseio.com",
  projectId: "roomboy-8650a",
  storageBucket: "roomboy-8650a.appspot.com",
  messagingSenderId: "399119903726",
  appId: "1:399119903726:web:0aeedd6e6e7a790760fcff",
  measurementId: "G-Q9B75GSR88"
};

// Initialize Firebase
// const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);

////
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

export { db };