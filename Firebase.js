// Import the functions you need from the SDKs you need
import { initializeApp,getApps } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import firebase from 'firebase/app';
import { getFirestore, collection, addDoc } from 'firebase/firestore';
import 'firebase/auth';
import 'firebase/firestore';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyArN2OnzBXpIGt-8hnbDFjmN7v9lfPpzAY",
  authDomain: "betteruproj-b8c1d.firebaseapp.com",
  projectId: "betteruproj-b8c1d",
  storageBucket: "betteruproj-b8c1d.appspot.com",
  messagingSenderId: "834337580017",
  appId: "1:834337580017:web:a0338e2a85b436ad5c5a50",
  databaseURL:"https://BetterUProj-default-rtdb.us-central1.firebasedatabase.app"
};

// Initialize Firebase app
//const app = initializeApp(firebaseConfig);
let app;
if (!getApps().length) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApps()[0];
}

// Get the auth object
const auth = getAuth(app);
const db = getFirestore(app);
/*const settings = {timestampsInSnapshots: true}
db.settings(settings);*/
const postsCollection = collection(db, 'posts');

// Create a new post object
const newPost = {
  title: 'My first post',
  content: 'This is the content of my first post.',
  author: 'John Doe',
  date: new Date(),
};

// Add the new post to the "posts" collection
addDoc(postsCollection, newPost)
  .then((docRef) => {
    console.log('New post added with ID:', docRef.id);
  })
  .catch((error) => {
    console.error('Error adding post:', error);
  });
export { auth,db };
