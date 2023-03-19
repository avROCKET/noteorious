import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAEzmbdkAJfhKs0WiaNz4qlS7EgEqoBc1E",
  authDomain: "noteorious-79e97.firebaseapp.com",
  databaseURL: "https://noteorious-79e97-default-rtdb.firebaseio.com",
  projectId: "noteorious-79e97",
  storageBucket: "noteorious-79e97.appspot.com",
  messagingSenderId: "473062565245",
  appId: "1:473062565245:web:47d81802953945e45f1814"
};

const app = initializeApp(firebaseConfig);
export const db = getDatabase(app);
export const auth = getAuth();