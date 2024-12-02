import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs, query, orderBy } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyDgf9Y3bF4Roi6-W9YtZDYU0HCyyU0DBWs",
    authDomain: "prueba-29842.firebaseapp.com",
    projectId: "prueba-29842",
    storageBucket: "prueba-29842.firebasestorage.app",
    messagingSenderId: "86388600944",
    appId: "1:86388600944:web:5542f8aa16a7d5439b44b5",
    measurementId: "G-WQPKYXHCLC"
  };

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db, collection, getDocs, query, orderBy };
