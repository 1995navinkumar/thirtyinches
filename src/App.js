import React from 'react';

import { getAuth, onAuthStateChanged } from "firebase/auth";
import { getFirestore, collection, addDoc } from "firebase/firestore";

import { Header } from './components/header';
import { Home } from './routers/home';
import { getUserDetails } from './utils/auth-util';

import { LandingPage } from './components/landingPage';

import {
    HashRouter
} from "react-router-dom";

export default function App() {
    var [user, setUser] = React.useState(null);
    const auth = getAuth();
    React.useEffect(() => {
        onAuthStateChanged(auth, userObj => {
            console.log(userObj);
            
            if (userObj) {
                getUserDetails(userObj)
                    .then(details => {
                        userObj.customFields = details;
                        setUser(userObj);
                    })
            } else {
                setUser(false);
            }
        });
    }, []);

    return (
        <React.Fragment>
            <Header />
            <div className="flex-row flex-justify-center">
                {
                    user == null
                        ? <p> Loading... </p>
                        : (
                            user == false
                                ? <LandingPage />
                                : (
                                    <HashRouter>
                                        <Home user={user} />
                                    </HashRouter>
                                )
                        )
                }
            </div>
        </React.Fragment>
    )
}


function FireStoreTest() {
    const db = getFirestore();

    React.useEffect(() => {
        addDoc(collection(db, "users"), {
            first: "Ada",
            last: "Lovelace",
            born: 1816
        })
            .then((docRef) => console.log("Document written with ID: ", docRef.id))
            .catch(err => console.error("Error adding document: ", err));
    }, [])

    return (
        <React.Fragment>
            Hi
        </React.Fragment>
    )
}