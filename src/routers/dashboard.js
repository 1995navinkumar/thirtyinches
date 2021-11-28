import React from 'react';
import { getOrgDetails } from '../utils/db-util';

export function Dashboard() {
    var [orgs, setOrgs] = React.useState();
    
    React.useEffect(() => {
        getOrgDetails().then(d => setOrgs(d));
    }, []);

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