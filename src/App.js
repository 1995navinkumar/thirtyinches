import React from 'react';

import { getAuth, onAuthStateChanged } from "firebase/auth";

import { Header } from './components/header';
import { Home } from './routers/home';
import { getUserDetails } from './utils/auth-util';
// import * as mailUtil from './utils/mail-util';

import { LandingPage } from './components/landingPage';

import {
    HashRouter
} from "react-router-dom";

export default function App() {
    var [user, setUser] = React.useState(null);
    const auth = getAuth();
    React.useEffect(() => {
        onAuthStateChanged(auth, userObj => {

            setUser(userObj?? false);
            // if (userObj) {
            //     getUserDetails(userObj)
            //         .then(details => {
            //             userObj.customFields = details;
            //         })
            // } else {
            //     setUser(false);
            // }
        });
    }, []);

    return (
        <React.Fragment>
            <div className="flex-column full-height">
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