import React from 'react';
import styled from 'styled-components';
import { AddOrg } from '../components/add-org';
import { Dashboard } from '../routers/dashboard';
import { Subscriptions } from '../routers/subscriptions';
import { Orgs } from '../routers/orgs';
import { AppHeader } from '../components/header';
import { Menu } from '../components/menu';
import { AppContext } from '../context/AppContext';

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


export function Home() {
    var location = useLocation();
    var navigate = useNavigate();

    var { orgs } = React.useContext(AppContext);

    var [routerResolved, setRouterResolved] = React.useState(false);
    var [showMenu, setShowMenu] = React.useState(false);
    var [showMenuIcon, setShowMenuIcon] = React.useState(true);

    React.useEffect(() => {
        if (!orgs || orgs.length == 0) {
            setShowMenuIcon(false);
            navigate("/orgs/add");
        } else if (location.pathname == "/") {
            navigate("/dashboard");
        }
        setRouterResolved(true);
    }, [orgs]);

    React.useEffect(() => {
        var callback = (e) => {
            if (e.target.closest(".app-menu")) {
                return;
            }
            setShowMenu(false);
        }
        document.addEventListener("click", callback);
        return () => document.removeEventListener("click", callback);
    }, []);

    return (
        <Styles className="full-height flex-column ">
            <AppHeader setShowMenu={setShowMenu} showMenuIcon={showMenuIcon} />
            <main className="app-body">
                <Menu showMenu={showMenu} setShowMenu={setShowMenu} />
                {
                    routerResolved
                        ? (
                            <Routes>
                                <Route path="/dashboard" element={<Dashboard />} />
                                <Route path="/orgs" element={<Orgs />} >
                                    <Route path="add" element={<AddOrg setShowMenuIcon={setShowMenuIcon} />} />
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