import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/storage';
import { env } from '../../env.mjs';
const clientCredentials: firebase.FirebaseOptions = {
  apiKey: env.FIREBASE_API_KEY,
  authDomain: env.FIREBASE_AUTH_DOMAIN,
  projectId: env.FIREBASE_PROJECT_ID,
  storageBucket: env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: env.FIREBASE_MESSAGING_SENDER_ID,
  appId: env.FIREBASE_APP_ID,
};

if (!firebase.getApps().length) {
  firebase.initializeApp(clientCredentials);
}

export const firebaseClient = firebase;