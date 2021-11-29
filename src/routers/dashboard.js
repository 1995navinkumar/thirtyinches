import React from 'react';
import { getOrgDetails } from '../utils/db-util';
import { AppContext } from '../context/AppContext';

export function Dashboard() {
    var { orgs } = React.useContext(AppContext);

    return (
        <React.Fragment>
            <div className="flex-row flex-align-cennter flex-justify-center">
                {
                    orgs && orgs.length > 0
                        ? orgs[0].name
                        : null
                }
            </div>
        </React.Fragment>
    )
}