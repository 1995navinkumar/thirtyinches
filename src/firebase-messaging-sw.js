import { initializeApp } from "firebase/app";
import { getMessaging, onBackgroundMessage } from "firebase/messaging/sw";

const firebaseConfig = {
    apiKey: "AIzaSyD5q3f_PQWbMmY95Ao3pv3u48xRpz-p_Ls",
    authDomain: "gym-management-dfd3b.firebaseapp.com",
    projectId: "gym-management-dfd3b",
    storageBucket: "gym-management-dfd3b.appspot.com",
    messagingSenderId: "878638516602",
    appId: "1:878638516602:web:c86af309222d834ab42ec3",
    measurementId: "G-KPE00KH76M"
};

var firebaseApp = initializeApp(firebaseConfig);
const messaging = getMessaging(firebaseApp);

onBackgroundMessage(messaging, (payload) => {
    console.log('[firebase-messaging-sw.js] Received background message ', payload);
    
});