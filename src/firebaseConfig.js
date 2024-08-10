// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";

import { getFirestore } from "firebase/firestore";



//import { getAuth } from 'firebase/auth';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyC-DEyCb1qpA_LMHtYMuSS3sWjyXWKn9OA",
  authDomain: "mylibrary-5a57e.firebaseapp.com",
  projectId: "mylibrary-5a57e",
  storageBucket: "mylibrary-5a57e.appspot.com",
  messagingSenderId: "300395994624",
  appId: "1:300395994624:web:cbec3107ce0884519d82e5"
};

// Initialize Firebase
//const app = initializeApp(firebaseConfig);

//const db = initializeApp(firebaseConfig);

//const auth = getAuth(app);


const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
export { db };

//export { db,auth };


//export { auth };