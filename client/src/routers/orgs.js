import React from 'react';
import {
    Routes,
    Route,
    useNavigate,
    useLocation,
    Outlet,
    Navigate
} from "react-router-dom";

import { AppContext } from '../context';
import AddOrg from '../components/add-org';
import OrgList from '../components/org-list';

export default function Orgs() {
    var { orgs } = React.useContext(AppContext);
    return (
        <React.Fragment>
            <Routes>
                <Route path="/" element={<Navigate replace to="/orgs/list" />} />
                <Route path="/list" element={<OrgList />} />
                <Route path="/add" element={<AddOrg />} />
            </Routes>

        </React.Fragment>
    )
} 