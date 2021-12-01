import React from 'react';
import {
    Routes,
    Route,
    useNavigate,
    useLocation,
    Outlet,
    Navigate,
    Link
} from "react-router-dom";
import { getAllSubscribers } from '../../utils/db-util';
import { AppContext } from '../../context/AppContext';

export function SubscribersList() {
    var { orgs } = React.useContext(AppContext);
    var [subscriptions, setSubscriptions] = React.useState();
    React.useEffect(() => {
        getAllSubscribers()
            .then(setSubscriptions)
    }, [orgs]);

    return (
        <React.Fragment>
            <Link to="/subscriptions/add">Add Subscriber</Link>
            {
                subscriptions
                    ? (
                        <ul>
                            {subscriptions.map(sub =>
                                <li key={sub.id}>
                                    {sub.name}
                                </li>
                            )}
                        </ul>
                    )
                    : null
            }

        </React.Fragment>
    )
}