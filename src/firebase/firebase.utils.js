import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';

const config={
    apiKey: "AIzaSyAMpOX9tM5dG-d2UUV-UfzDAA0zJXASv24",
    authDomain: "crwn-db-7c683.firebaseapp.com",
    databaseURL: "https://crwn-db-7c683.firebaseio.com",
    projectId: "crwn-db-7c683",
    storageBucket: "crwn-db-7c683.appspot.com",
    messagingSenderId: "322206148698",
    appId: "1:322206148698:web:b88909dee1c66996d8d063",
    measurementId: "G-1V20J69Q6Z"
  };

firebase.initializeApp(config);

export const auth=firebase.auth();
export const firestore=firebase.firestore();

const provider = new firebase.auth.GoogleAuthProvider();
provider.setCustomParameters({prompt:'select_account'});
export const signInWithGoogle=()=> auth.signInWithPopup(provider);

export default firebase;

