// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: "mernblogproject.firebaseapp.com",
  projectId: "mernblogproject",
  storageBucket: "mernblogproject.appspot.com",
  messagingSenderId: "511470023811",
  appId: "1:511470023811:web:99239bacfa829b972d57b6"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export default app