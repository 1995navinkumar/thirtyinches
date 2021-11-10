import React from 'react';
import { getAuth, signOut } from "firebase/auth";

import {
    HashRouter,
    Routes,
    Route,
    useNavigate
} from "react-router-dom";

export function Home({ user }) {
    var navigate = useNavigate();
    var signout = React.useCallback((e) => {
        const auth = getAuth();
        signOut(auth).then(() => {
            navigate("/");
            // Sign-out successful.
        }).catch((error) => {
            // An error happened.
        });
    })
    return (
        <div>
            <p>Welcome
                <span style={{ color: "red" }}> {user.displayName}</span>
            </p>

            <button onClick={signout}>signout</button>

            <Routes>
                <Route path="/home/dashboard" element={<div>dashboard</div>} />
            </Routes>

        </div>
    )
}