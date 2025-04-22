// src/firebase.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyBmFYLzqwA8oCWoQGrJTsTlRPDwkyr5RN4",
    authDomain: "laretro-9c553.firebaseapp.com",
    projectId: "laretro-9c553",
    storageBucket: "laretro-9c553.firebasestorage.app",
    messagingSenderId: "102788134634",
    appId: "1:102788134634:web:a83f0814878f287b5c8993",
    measurementId: "G-Y3G4EDNCMV"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };
