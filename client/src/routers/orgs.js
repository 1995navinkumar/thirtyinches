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
    return (
        <div className='flex-column full-height'>
            <div className='flex-1'>
                <Routes>
                    <Route path="/" element={<Navigate replace to="/orgs/list" />} />
                    <Route path="/list" element={<OrgList />} />
                    <Route path="/add" element={<AddOrg />} />
                </Routes>
            </div>
        </div>
    )
} 