import React from 'react';
import {
    Routes,
    Route,
    useNavigate,
    useLocation,
    Outlet
} from "react-router-dom";

import { deleteOrg } from '../utils/db-util';
import { AppContext } from '../context/AppContext';

export function Orgs() {
    var { orgs } = React.useContext(AppContext);

    return (
        <div>
            {
                orgs.map(org =>
                    <div key={org.id}>
                        <p onClick={() => deleteOrg(org)}>{org.name}</p>
                    </div>
                )
            }

            <Outlet />
        </div>
    )
} 