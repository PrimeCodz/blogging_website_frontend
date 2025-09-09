// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth"; 
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

const api = import.meta.env.VITE_FIREBASE_API_KEY;

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: api,
  authDomain: "mern-blogging-website-e4327.firebaseapp.com",
  projectId: "mern-blogging-website-e4327",
  storageBucket: "mern-blogging-website-e4327.appspot.com",
  messagingSenderId: "303306796500",
  appId: "1:303306796500:web:6ae94e4a7136ae8bce3a41"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Google Auth
const provider = new GoogleAuthProvider();
const auth = getAuth();

export const authWithGoogle = async () => {
    
    let user = null;

    await signInWithPopup(auth, provider)
    .then((result) => {
        user = result.user;
    })
    .catch((err)=> {
        console.log(err);
    })

    return user;
}