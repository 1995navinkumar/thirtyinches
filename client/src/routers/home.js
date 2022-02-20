import React from 'react';
import styled from 'styled-components';
import Orgs from '../routers/orgs';
import Subscriptions from '../routers/subscriptions';
import Attendance from '../routers/attendance';
import Feedback from '../routers/feedback';
import Assets from '../routers/assets';
import Expenses from '../routers/expenses';
import Reports from '../routers/reports';

import AppHeader from '../components/header';
import Menu from '../components/menu';

import Dashboard from '../routers/dashboard';

import ToastMessage from '../components/ToastMessage';


import { AppContext, HomeContext } from '../context';

import {
    Routes,
    Route,
    Navigate,
    useNavigate
} from "react-router-dom";
import { getPersonalisedData } from '../utils/api-util';

var Styles = styled.div`
    .app-body {
        flex : 1;
        height: calc(100% - 108px);
        overflow-y : scroll;
    }

    .app-footer {
        height : 56px;
        background-color : var(--text-on-primary);
        justify-content : space-around;
    }
`

export default function Home() {
    var [showMenu, setShowMenu] = React.useState(false);
    var [showMenuIcon] = React.useState(true);

    var [selectedOrg, setSelectedOrg] = React.useState(null);

    var { userPrivileges } = React.useContext(AppContext);

    var [toastProps, setToastProps] = React.useState({ messageId: 0 });

    var showToastMessage = React.useCallback(({ message, type }) => {
        setToastProps(props => ({ message, type, messageId: props.messageId + 1 }));
    }, []);

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

    React.useEffect(() => {
        getPersonalisedData().then(data => {
            var sOrg = data.selectedOrg || null;
            if (!sOrg) {
                sOrg = userPrivileges.length > 0 && userPrivileges.map(p => p.orgName)[0];
            }
            setSelectedOrg(sOrg);
        })
    }, []);

    return (
        <HomeContext.Provider value={{ selectedOrg, setSelectedOrg, showToastMessage }}>
            <Styles className="full-height flex-column ">
                <AppHeader setShowMenu={setShowMenu} showMenuIcon={showMenuIcon} />
                <main className="app-body">
                    <Menu showMenu={showMenu} setShowMenu={setShowMenu} />
                    {
                        <Routes>
                            <Route path="/" element={<Navigate replace to="/dashboard" />} />
                            <Route path="/dashboard" element={<Dashboard />} />
                            <Route path="/orgs/*" element={<Orgs />} />
                            <Route path="/subscriptions/*" element={<Subscriptions />} />
                            <Route path="/assets" element={<Assets />} />
                            <Route path="/attendance" element={<Attendance />} />
                            <Route path="/expenses" element={<Expenses />} />
                            <Route path="/feedbacks" element={<Feedback />} />
                            <Route path="/reports" element={<Reports />} />
                        </Routes>
                    }

                </main>

                <ToastMessage {...toastProps} />

                <Footer />

                {/* <footer className="app-footer flex-row flex-align-center flex-justify-center">
                    <img className='icon' src="/images/home-icon.svg" />
                </footer> */}
            </Styles>
        </HomeContext.Provider>
    )
}

function Footer() {
    var navigate = useNavigate();
    return (
        <footer className='app-footer flex-row flex-align-center'>
            <img className='icon' onClick={() => navigate("/dashboard")} src="/images/home-icon.svg" />
            <img className='icon' onClick={() => navigate("/subscriptions")} src="/images/subscription-outline.svg" />
            <img className='icon' onClick={() => navigate("/attendance")} src="/images/assets-icon.svg" />
            <img className='icon' onClick={() => navigate("/assets")} src="/images/attendance-icon.svg" />
            <img className='icon' onClick={() => navigate("/expenses")} src="/images/subscription-outline.svg" />
        </footer>
    )
}