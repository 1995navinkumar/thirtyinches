import React from 'react';
import { getAuth } from "firebase/auth";

export function Dashboard() {
    var user = getAuth().currentUser;
    return (
        <React.Fragment>
            <div className="flex-row flex-align-cennter flex-justify-center">
                {user.customFields.orgs[0].name}
            </div>
        </React.Fragment>
    )
}