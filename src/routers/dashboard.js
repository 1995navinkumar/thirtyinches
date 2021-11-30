import React from 'react';
import { AppContext } from '../context/AppContext';
import { Link } from 'react-router-dom';

export function Dashboard() {
    var { orgs } = React.useContext(AppContext);
    return (
        <React.Fragment>
            <div className="flex-row flex-align-cennter flex-justify-center">
                {
                    orgs && orgs.length > 0
                        ? orgs[0].name
                        : <Link to="/orgs/add">Add Org</Link>
                }
            </div>
        </React.Fragment>
    )
}