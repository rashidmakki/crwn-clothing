import firebase from "firebase/app";
import "firebase/firestore";
import "firebase/auth";

const config = {
  apiKey: "AIzaSyAMpOX9tM5dG-d2UUV-UfzDAA0zJXASv24",
  authDomain: "crwn-db-7c683.firebaseapp.com",
  databaseURL: "https://crwn-db-7c683.firebaseio.com",
  projectId: "crwn-db-7c683",
  storageBucket: "crwn-db-7c683.appspot.com",
  messagingSenderId: "322206148698",
  appId: "1:322206148698:web:b88909dee1c66996d8d063",
  measurementId: "G-1V20J69Q6Z",
};

//For checking if the users exist and creating users if it doesn't exist
export const createUserProfileDocument = async (userAuth, additionalData) => {
  if (!userAuth) return;

  const userRef = firestore.doc(`users/${userAuth.uid}`);

  const snapShot = await userRef.get();
  if (!snapShot.exist) {
    const { displayName, email } = userAuth;
    const createDate = new Date();
    try {
      await userRef.set({
        displayName,
        email,
        createDate,
        ...additionalData,
      });
    } catch (error) {
      console.log("error creating user", error.message);
    }
    return userRef;
  }
};

firebase.initializeApp(config);

export const auth = firebase.auth();
export const firestore = firebase.firestore();

//For Sign In With Google using Popup
const provider = new firebase.auth.GoogleAuthProvider();
provider.setCustomParameters({ prompt: "select_account" });
export const signInWithGoogle = () => auth.signInWithPopup(provider);

export default firebase;
