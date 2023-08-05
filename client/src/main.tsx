import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import { initializeApp } from "firebase/app";
import { AppStore } from './redux/AppStore';

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

if (import.meta.env.DEV) {
  const { getAuth, connectAuthEmulator } = await import('firebase/auth');
  const auth = getAuth();
  connectAuthEmulator(auth, `http://${window.location.hostname}:9099`);
}

const Root = ReactDOM.createRoot(document.getElementById('root')!);

function render() {
  Root.render(
    <React.StrictMode>
      <App AppStore={AppStore} />
    </React.StrictMode>
  );

}

AppStore.subscribe(render);

render();