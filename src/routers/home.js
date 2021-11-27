import React from 'react';
import { getAuth, signOut } from "firebase/auth";
import styled from 'styled-components';
import { AddOrg } from '../components/add-org';
import { Dashboard } from '../components/dashboard';
import {
    Routes,
    Route,
    useNavigate
} from "react-router-dom";

var Styles = styled.div`
    height : 100%;
    display : flex;
    flex-direction : column;

    .app-header {
        height : 44px;
        border-bottom : 1px solid #FFF202;
    }

    .search-container {
        flex : 1;
    }

    .signout-icon {
        height : 20px;
        width : 20px;
        margin : 0px 8px;
    }

    .app-body {
        flex : 1;
    }

    .app-footer {
        height : 44px;
        border-top : 1px solid #FFF202;
    }
`


export function Home({ user }) {
    var navigate = useNavigate();
    React.useEffect(() => {
        if (Object.keys(user.customFields).length === 0) {
            navigate("/add-org");
        }
    }, []);


    var signout = React.useCallback((e) => {
        const auth = getAuth();
        signOut(auth).then(() => {
            // Sign-out successful.
        }).catch((error) => {
            // An error happened.
        });
    })
    return (
        <Styles>
            <header className="app-header flex-row flex-align-center">
                <div className="search-container"></div>
                <img onClick={signout} className="signout-icon" src="images/logout.png" />
            </header>
            <main className="app-body">
                <Routes>
                    <Route path="/add-org" element={<AddOrg />} />
                    <Route path="/dashboard" element={<Dashboard />} />
                </Routes>
            </main>
            <footer className="app-footer flex-row flex-align-center flex-justify-center">
                &copy; thirtyinches
            </footer>
        </Styles>
    )
}