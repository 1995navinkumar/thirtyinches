import React from 'react';
import styled from 'styled-components';
import { AddOrg } from '../components/add-org';
import { Dashboard } from '../routers/dashboard';
import { Subscriptions } from '../routers/subscriptions';
import { Orgs } from '../routers/orgs';
import { AppHeader } from '../components/header';
import { Menu } from '../components/menu';

import {
    Routes,
    Route,
    useNavigate,
    useLocation
} from "react-router-dom";

var Styles = styled.div`
    .app-body {
        flex : 1;
    }

    .app-footer {
        height : 44px;
        border-top : 1px solid #FFF202;
    }
`


export function Home({ user }) {
    var location = useLocation();
    var navigate = useNavigate();

    var [routerResolved, setRouterResolved] = React.useState(false);
    var [showMenu, setShowMenu] = React.useState(false);

    React.useEffect(() => {
        var orgs = user.customFields.orgs;
        if (!orgs) {
            navigate("/orgs/add");
        } else if (location.pathname == "/") {
            navigate("/dashboard");
        }
        setRouterResolved(true);
    }, []);

    React.useEffect(() => {
        var menuClickListener = document.addEventListener("click", (e) => {
            setShowMenu(false);
        })
        return () => {
            document.removeEventListener("click", menuClickListener);
        }
    }, []);

    return (
        <Styles className="full-height flex-column ">
            <AppHeader setShowMenu={setShowMenu} />
            <main className="app-body">
                <Menu showMenu={showMenu} />
                {
                    routerResolved
                        ? (
                            <Routes>
                                <Route path="/dashboard" element={<Dashboard />} />
                                <Route path="/orgs" element={<Orgs />} >
                                    <Route path="add" element={<AddOrg />} />
                                </Route>
                                <Route path="/subscriptions" element={<Subscriptions />} />
                            </Routes>
                        )
                        : null
                }

            </main>
            <footer className="app-footer flex-row flex-align-center flex-justify-center">
                &copy; thirtyinches
            </footer>
        </Styles>
    )
}