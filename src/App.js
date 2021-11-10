import React from 'react';

import { getAuth, onAuthStateChanged } from "firebase/auth";
import { Header } from './components/header';
import { Home } from './routers/home';
import { Signin } from './routers/signin';

import {
    HashRouter,
    Routes,
    Route,
    useNavigate
} from "react-router-dom";

export default function App() {
    var [user, setUser] = React.useState(null);
    const auth = getAuth();
    onAuthStateChanged(auth, userObj => setUser(userObj ?? false));
    return (
        <div>
            <Header></Header>
            {
                user == null
                    ? <p> Loading... </p>
                    : (
                        user == false
                            ? <Signin />
                            : (
                                <HashRouter>
                                    <Home user={user} />
                                </HashRouter>
                            )
                    )
            }
        </div>
    )
}