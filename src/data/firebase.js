import firebase from 'firebase/compat/app';

import 'firebase/compat/firestore';
import 'firebase/compat/storage';

import 'firebase/compat/auth';


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