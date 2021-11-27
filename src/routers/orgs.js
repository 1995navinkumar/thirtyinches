import React from 'react';
import {
    Routes,
    Route,
    useNavigate,
    useLocation,
    Outlet
} from "react-router-dom";

export function Orgs() {
    return (
        <div>
            Orgs
            <Outlet />
        </div>
    )
} 