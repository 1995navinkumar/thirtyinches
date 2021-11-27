import React from 'react';
import ReactDOM from 'react-dom';
import { initializeApp } from "firebase/app";
import App from './src/App.js';
import { getFirestore, connectFirestoreEmulator } from "firebase/firestore";


const firebaseConfig = {
    apiKey: "AIzaSyD5q3f_PQWbMmY95Ao3pv3u48xRpz-p_Ls",
    authDomain: "gym-management-dfd3b.firebaseapp.com",
    projectId: "gym-management-dfd3b",
    storageBucket: "gym-management-dfd3b.appspot.com",
    messagingSenderId: "878638516602",
    appId: "1:878638516602:web:c86af309222d834ab42ec3",
    measurementId: "G-KPE00KH76M"
};

// Initialize Firebase
var app = initializeApp(firebaseConfig);

const db = getFirestore();
connectFirestoreEmulator(db, 'localhost', 8080);

ReactDOM.render(<App />, document.getElementById('app-root'));