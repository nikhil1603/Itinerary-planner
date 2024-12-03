// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics"; // Optional if you're using Analytics
import { getFirestore } from "firebase/firestore"; // Optional if you're using Firestore
import { getAuth } from "firebase/auth"; // Optional if you're using Authentication

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCFlUO8-ZtIq9ITgq0JoBf7EljT3MqoFO4",
  authDomain: "crowdsourced-itinerary-planner.firebaseapp.com",
  projectId: "crowdsourced-itinerary-planner",
  storageBucket: "crowdsourced-itinerary-planner.appspot.com",
  messagingSenderId: "113147685979",
  appId: "1:113147685979:web:559012f53a0878a538e37e",
  measurementId: "G-JNV0N1N031"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

export { db, auth };