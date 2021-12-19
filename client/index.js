import React from 'react';
import ReactDOM from 'react-dom';
import { initializeApp } from "firebase/app";
import App from './src/App.js';
// import { getMessaging, getToken, onMessage } from "firebase/messaging";

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

// const messaging = getMessaging(app);

// getToken(messaging, { vapidKey: 'BEhMAahJs_Lv3afUdlhw51I7J4NHCNr0TfFU1FzQKaXPCa37fw7JVCLcrbN16TmlqMkk4JTgAzlljBqcqgOv45U' }).then((currentToken) => {
//     if (currentToken) {
//         console.log(currentToken);

//         // Send the token to your server and update the UI if necessary
//         // ...
//     } else {
//         // Show permission request UI
//         console.log('No registration token available. Request permission to generate one.');
//         // ...
//     }
// }).catch((err) => {
//     console.log('An error occurred while retrieving token. ', err);
//     // ...
// });

// onMessage(messaging, (payload) => {
//     console.log('Message received. ', payload);
//     // ...


if (process.env.NODE_ENV != "production") {
    var { getAuth, connectAuthEmulator } = require("firebase/auth");
    var { generateData } = require("./generate-mock-data");
    window.generateData = generateData;
    const auth = getAuth();
    connectAuthEmulator(auth, "http://localhost:9099");
}

ReactDOM.render(<App />, document.getElementById('app-root'));