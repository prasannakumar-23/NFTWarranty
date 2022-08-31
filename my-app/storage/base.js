import { initializeApp } from "firebase/app";

import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyBNOp44boz-Mfk1TzFv3lAJ-7wGNU9NUwY",
  authDomain: "grid4-e42ce.firebaseapp.com",
  projectId: "grid4-e42ce",
  storageBucket: "grid4-e42ce.appspot.com",
  messagingSenderId: "640241885888",
  appId: "1:640241885888:web:9f48c88adfed403d178325",
  measurementId: "G-492YRSZ2EJ",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);
