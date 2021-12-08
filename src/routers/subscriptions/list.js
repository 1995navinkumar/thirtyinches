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

import styled from 'styled-components';

var Styles = styled.div`
    .subscribers-list {
        overflow : scroll;
        background: #F2F2F2;
        box-shadow: 0px 4px 15px rgba(0, 0, 0, 0.25);
        border-radius: 10px;
        padding : 4px 8px;
    }
    
    .subscribers-list-container {
        padding : 10px;
        height : calc(100% - 36px);
    }

    .subscriber-card {
        padding : 8px;
        margin : 8px 0px;
        background: #FFFFFF;
        box-shadow: 0px 2px 15px -10px rgba(0, 0, 0, 0.25);
        border-radius: 5px;
        height : 82px;
    }

    .sub-profile-pic {
        height : 30px;
        width : 30px;
    }

    .subscriber-detail {
        padding-left : 8px;
    }

    .subscriber-name {
        font-weight: bold;
        font-size: 14px;
        line-height: 17px;
        color: #404040;
    }

    .subscriber-contact {
        opacity : 0.6;
        font-size : 12px;
        line-height : 18px;
    }

    .validity {
        opacity : 0.6;
        font-size : 14px;
        line-height : 18px;
    }

    .add-subscriber {
        font-size : 30px;
        padding-right : 20px;
    }
`

export function SubscribersList() {
    var { orgs } = React.useContext(AppContext);
    var [subscriptions, setSubscriptions] = React.useState([]);
    React.useEffect(() => {
        var selectedOrg = orgs.find(o => o.selected);
        if (selectedOrg) {
            getAllSubscribers(selectedOrg.id)
                .then(setSubscriptions)
        }
    }, [orgs]);

    return (
        <Styles className="full-height">
            <div className="flex-row">
                <div className="flex-1"></div>
                <Link className="add-subscriber" to="/subscriptions/add">+</Link>
            </div>

            {
                subscriptions.length > 0
                    ? (
                        <div className="subscribers-list-container">
                            <ul className="subscribers-list full-height">
                                {subscriptions.map(sub =>
                                    <li className="subscriber-card flex-column" key={sub.id}>
                                        <div className="flex-align-center flex-row flex-1">
                                            <img src="images/profile-pic.png" className="sub-profile-pic" />
                                            <div className="subscriber-detail">
                                                <p className="subscriber-name">{sub.name}</p>
                                                <p className="subscriber-contact">{sub.contact}</p>
                                            </div>
                                        </div>
                                        <div>
                                            <span className="validity">Ends in : {getEndsIn(sub)} days</span>
                                        </div>
                                    </li>
                                )}
                            </ul>
                        </div>
                    )
                    : null
            }

        </Styles>
    )
}

function getEndsIn(subscriberDetails) {
    var { subscriptions } = subscriberDetails;
    subscriptions.sort((a, b) => {
        return b.end - a.end;
    });
    var remaining = subscriptions[0].end - Date.now();
    return Math.floor(remaining / (1000 * 60 * 60 * 24));
}