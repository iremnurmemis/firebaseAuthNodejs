const admin = require("firebase-admin");
const serviceAccount = require("./service-key.json");
const firebase = require("firebase/app");
const { getAuth } = require("firebase/auth");
const { initializeApp } = require("firebase/app");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const firestore = admin.firestore();
const authAdmin = admin.auth();

const firebaseApp = initializeApp({
  apiKey: "AIzaSyAv706qrkM5Zid2h_rO9LjQxxOJz0X7n30",
  authDomain: "deneme-17e3e.firebaseapp.com",
  databaseURL: "https://deneme-17e3e-default-rtdb.firebaseio.com",
  projectId: "deneme-17e3e",
  storageBucket: "deneme-17e3e.firebasestorage.app",
  messagingSenderId: "1054186896320",
  appId: "1:1054186896320:web:42a9c07e4ef58c641fa625",
  measurementId: "G-44KHFP4L4V",
});

const auth = getAuth();

module.exports = { firestore, authAdmin, admin, auth };
