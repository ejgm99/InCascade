import firebase from 'firebase/compat/app';

import 'firebase/compat/firestore';
import 'firebase/compat/storage';

import 'firebase/compat/auth';

// For when I migrate to fresh incascade page
// // Import the functions you need from the SDKs you need
// import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
// // TODO: Add SDKs for Firebase products that you want to use
// // https://firebase.google.com/docs/web/setup#available-libraries

// // Your web app's Firebase configuration
// // For Firebase JS SDK v7.20.0 and later, measurementId is optional
// const firebaseConfig = {
//   apiKey: "AIzaSyDM-fknQUcKWmNs2WXFLm_fECMD8aRaHwQ",
//   authDomain: "incascade.firebaseapp.com",
//   projectId: "incascade",
//   storageBucket: "incascade.appspot.com",
//   messagingSenderId: "459527890381",
//   appId: "1:459527890381:web:140c48dc36ff9759611084",
//   measurementId: "G-ZQZGXYWQBB"
// };

// Initialize Firebase
// const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);

const firebaseConfig = {
    apiKey: "AIzaSyDwt_yMwEJgdlLRGw9BLOvlX-x8CflKhj4",
    authDomain: "ejgml-47c3c.firebaseapp.com",
    projectId: "ejgml-47c3c",
    storageBucket: "ejgml-47c3c.appspot.com",
    messagingSenderId: "867280806144",
    appId: "1:867280806144:web:0c8b8a0cb9c824c7f413e5",
    measurementId: "G-S8VWNFSK1X"
  };

firebase.initializeApp(firebaseConfig);


export const db = firebase.firestore();

// if (location.hostname === "localhost") {
//   console.log("Database emulator",db.useEmulator)
//   db.useEmulator("localhost", 8089)
// }

// let testRetrieval = await db.collection('posts').get().then(result => {
//   return result
// })

// export const auth = firebase.auth();
// if (location.hostname === "localhost") {
//   console.log("Authentication emulator",auth.useEmulator)
//   auth.useEmulator('http://localhost:4000/auth')
// }


export const storage = firebase.storage(); 

// export const provider = new firebase.auth.GoogleAuthProvider();

export const auth = firebase.auth();