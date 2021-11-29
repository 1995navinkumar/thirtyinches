import React from 'react';

import { getAuth, onAuthStateChanged } from "firebase/auth";

import { Header } from './components/header';
import { Home } from './routers/home';

import { getOrgDetails, subscribeToOrgs } from './utils/db-util';

import { LandingPage } from './components/landingPage';

import {
    HashRouter,
    useNavigate,
    Route,
    Routes
} from "react-router-dom";

import { AppContext } from './context/AppContext';

export default function App() {
    var [user, setUser] = React.useState(null);
    var [orgs, setOrgs] = React.useState([]);

    const auth = getAuth();

    console.log("App");
    

    React.useEffect(() => {
        onAuthStateChanged(auth, userObj => {
            if (userObj) {
                getOrgDetails()
                    .then(details => {
                        setOrgs(details);
                        setUser(userObj);
                    })
                    .catch(console.log);

            } else {
                setUser(false);
            }
        });

        return subscribeToOrgs(setOrgs);

    }, []);

    return (
        <AppContext.Provider value={{ user, setUser, orgs, setOrgs }}>
            <div className="flex-column full-height">
                {
                    user == null
                        ? <p> Loading... </p>
                        : (
                            user == false
                                ? <LandingPage />
                                : (
                                    <HashRouter>
                                        <Home />
                                    </HashRouter>
                                )
                        )
                }
            </div>
        </AppContext.Provider>
    )
}