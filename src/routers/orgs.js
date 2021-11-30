import React from 'react';
import {
    Routes,
    Route,
    useNavigate,
    useLocation,
    Outlet,
    Navigate
} from "react-router-dom";

import { deleteOrg } from '../utils/db-util';
import { AppContext } from '../context/AppContext';
import { AddOrg } from '../components/add-org';
import { OrgList } from '../components/org-list';

export function Orgs() {
    var { orgs } = React.useContext(AppContext);
    return (
        <div>
            <Routes>
                <Route path="/" element={<Navigate replace to="/orgs/list" />} />
                <Route path="/list" element={<OrgList />} />
                <Route path="/add" element={<AddOrg />} />
            </Routes>

        </div>
    )
} 