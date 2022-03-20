import React from 'react';
import ReactDOM from 'react-dom';
import { initializeApp } from "firebase/app";
import App from './src/App.js';

import { AppStore } from './src/redux/AppStore';

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
initializeApp(firebaseConfig);

if (process.env.NODE_ENV != "production") {
    var { getAuth, connectAuthEmulator } = require("firebase/auth");
    var { generateData } = require("./generate-mock-data");
    window.generateData = generateData;
    const auth = getAuth();

    connectAuthEmulator(auth, `http://${window.location.hostname}:9099`);
}

function render() {
    ReactDOM.render(<App AppStore={AppStore} />, document.getElementById('app-root'));
}

AppStore.subscribe(render);

render();


