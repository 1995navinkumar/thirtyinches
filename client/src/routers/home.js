import React from 'react';
import styled from 'styled-components';
import Orgs from '../routers/orgs';
import Subscriptions from '../routers/subscriptions';
import Attendance from '../routers/attendance';
import Feedback from '../routers/feedback';
import Assets from '../routers/assets';
import Expenses from '../routers/expenses';
import Reports from '../routers/reports';

import Menu from '../components/menu';

import Dashboard from '../routers/dashboard';

import ToastMessage from '../components/ToastMessage';

import { AppContext, HomeContext } from '../context';

import { userPersonalisationAction } from '../redux/user';
import { getOrgDetailsAction, selectOrgsDetail } from '../redux/orgs';

import {
    Routes,
    Route,
    Navigate,
    useNavigate
} from "react-router-dom";
import Loader from '../components/loader';
import Search from './search';
import { checkPushSubscription } from '../utils/push-util';
import { isDemoMode } from '../utils/auth-util';

var Styles = styled.div`
    .app-body {
        flex : 1;
        overflow-y : hidden;
    }

    .app-footer {
        min-height : 56px;
        background-color : var(--text-on-primary);
        justify-content : space-around;
    }
`

export default function Home() {
    var { dispatch, getState } = React.useContext(AppContext);

    var [showMenu, setShowMenu] = React.useState(false);

    var [toastProps, setToastProps] = React.useState({ messageId: 0 });

    var [loading, setLoading] = React.useState(true);

    var orgDetails = selectOrgsDetail(getState());

    var showToastMessage = React.useCallback((args) => {
        setToastProps(props => ({ ...args, messageId: props.messageId + 1 }));
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
        Promise.all([
            dispatch(userPersonalisationAction()),
            dispatch(getOrgDetailsAction())
        ])
            .then(() => setLoading(false))
    }, []);

    React.useEffect(() => {
        if (!isDemoMode() && orgDetails.length > 0) {
            var timer = setTimeout(checkPushSubscription, 5000);
            return () => clearTimeout(timer);
        }
    }, [orgDetails]);

    return (
        <HomeContext.Provider value={{ showToastMessage, setShowMenu }}>
            <Styles className="full-height flex-column ">
                {
                    loading
                        ? <Loader />
                        : <main className="app-body">
                            <Menu showMenu={showMenu} setShowMenu={setShowMenu} />
                            {
                                <Routes>
                                    <Route path="/" element={<Navigate replace to="/dashboard" />} />
                                    <Route path="/dashboard" element={<Dashboard />} />
                                    <Route path="/orgs/*" element={<Orgs />} />
                                    <Route path="/subscriptions/*" element={<Subscriptions />} />
                                    <Route path="/assets/*" element={<Assets />} />
                                    <Route path="/attendance" element={<Attendance />} />
                                    <Route path="/expenses/*" element={<Expenses />} />
                                    <Route path="/feedbacks" element={<Feedback />} />
                                    <Route path="/reports" element={<Reports />} />
                                    <Route path="/search" element={<Search />} />
                                </Routes>
                            }

                        </main>
                }


                <ToastMessage {...toastProps} />
            </Styles>
        </HomeContext.Provider>
    )
}