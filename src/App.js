import React from 'react';

import { getAuth, onAuthStateChanged } from "firebase/auth";

import { Header } from './components/header';
import { Home } from './routers/home';

import { getOrgDetails } from './utils/db-util';

import { LandingPage } from './components/landingPage';

import {
    HashRouter,
    useNavigate,
    Route,
    Routes
} from "react-router-dom";

export default function App() {
    var [user, setUser] = React.useState(null);
    const auth = getAuth();
    React.useEffect(() => {
        onAuthStateChanged(auth, userObj => {
            if (userObj) {
                getOrgDetails()
                    .then(details => {
                        userObj.customFields = { orgs: details };
                        setUser(userObj);
                    })
                    .catch(console.log);

            } else {
                setUser(false);
            }
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
                                        <Routes>
                                            <Route path="/*" element={<Home user={user} />} />
                                        </Routes>
                                    </HashRouter>
                                )
                        )
                }
            </div>
        </React.Fragment>
    )
}