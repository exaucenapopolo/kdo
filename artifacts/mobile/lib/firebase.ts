import { initializeApp, getApps, getApp } from "firebase/app";
import { Platform } from "react-native";

const firebaseConfig = {
  apiKey: "AIzaSyBaTtt3-ZTnDXf8lacErgC53R_Lyd2LntU",
  authDomain: "kdo-cameroun.firebaseapp.com",
  projectId: "kdo-cameroun",
  storageBucket: "kdo-cameroun.firebasestorage.app",
  messagingSenderId: "445876564547",
  appId: "1:445876564547:android:3fdb128e983265d8bd1af6",
};

export const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

let _auth: any;
let _db: any;

export function getFirebaseAuth() {
  if (_auth) return _auth;
  if (Platform.OS === "web") {
    const { getAuth } = require("firebase/auth");
    _auth = getAuth(app);
  } else {
    const { initializeAuth, getReactNativePersistence, getAuth } = require("firebase/auth");
    const AsyncStorage = require("@react-native-async-storage/async-storage").default;
    try {
      _auth = initializeAuth(app, {
        persistence: getReactNativePersistence(AsyncStorage),
      });
    } catch {
      _auth = getAuth(app);
    }
  }
  return _auth;
}

export function getFirebaseDb() {
  if (_db) return _db;
  const { getFirestore } = require("firebase/firestore");
  _db = getFirestore(app);
  return _db;
}

export default app;
