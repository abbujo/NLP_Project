import firebase from "firebase/app";
import "firebase/firestore";
import "firebase/storage";
import "firebase/auth";

const app = firebase.initializeApp({
  apiKey: "AIzaSyC3OmuSt1ab_igHTxgWnzPhZXdAqiuOVco",
  authDomain: "my-project-1545051214681.firebaseapp.com",
  projectId: "my-project-1545051214681",
  storageBucket: "my-project-1545051214681.appspot.com",
  messagingSenderId: "918446367631",
  appId: "1:918446367631:web:200350580541457c8d21fa",
  measurementId: "G-PBJ8KSVMQ8"
});

export const auth = app.auth();
export const db = firebase.firestore();
export const storageRef = app.storage().ref();
export default firebase;
