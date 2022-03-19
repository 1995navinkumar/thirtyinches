import React from 'react';
import { AppContext, HomeContext } from '../../context';
import { useNavigate } from "react-router-dom";
import { getSelectedOrg } from '../../redux/user.js';
import { selectBranchDetails } from '../../redux/orgs.js';
import { selectSubscribers, getSubscriptionDetailAction } from '../../redux/subscribers';

import styled from 'styled-components';

import Fab from '@mui/material/Fab';
import AddIcon from '@mui/icons-material/Add';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';

import AppHeader from '../../components/header.js';
import Footer from '../../components/footer.js';
import Loader from '../../components/loader.js';
import NoData from '../../components/no-data.js';
import { formatDate } from '../../utils/common-util';


export default function SubscribersList() {
    var { getState, dispatch } = React.useContext(AppContext);
    var selectedOrg = getSelectedOrg(getState());

    var [loading, setLoading] = React.useState(true);

    var subscriptions = selectSubscribers(getState());

    React.useEffect(() => {
        setLoading(true);
        dispatch(getSubscriptionDetailAction(selectedOrg))
            .then(() => setLoading(false))
    }, []);

    return (
        <Styles className="full-height flex-column">
            <AppHeader title={"Subscriptions"} />
            <div className='flex-1' style={{ position: "relative", overflow : "hidden" }}>
                {
                    loading
                        ? <Loader />
                        : <SubscriptionContainer subscriptions={subscriptions} />
                }
            </div>
            <Footer selectedRoute='subscriptions' />
        </Styles>
    )
}

function SubscriptionContainer({ subscriptions }) {
    var navigate = useNavigate();

    return (
        <React.Fragment>
            {
                subscriptions.length > 0
                    ? (
                        <div className='flex-column full-height'>
                            <ListFilter />
                            <div className="subscribers-list-container">
                                <ul className="subscribers-list full-height">
                                    {subscriptions.map((subscriber, idx) =>
                                        <Subscriber key={subscriber.contact} subscriber={subscriber} idx={idx} />
                                    )}
                                </ul>
                            </div>
                        </div>
                    )
                    : <NoData description={"You don't have any Subscribers."} />
            }
            <Fab onClick={() => navigate("../add")} style={{ position: "absolute", bottom: "12px", right: "12px" }} color="primary" aria-label="add">
                <AddIcon />
            </Fab>
        </React.Fragment>
    )
}

function Subscriber({ subscriber, idx }) {
    return (
        <li className="subscriber-card flex-column" >
            <div className="flex-align-center flex-row flex-1 subscriber-detail-container">
                <div className='flex-row flex-1 flex-align-center'>
                    <img src={`https://i.pravatar.cc/48?img=${idx + 1}`} className="sub-profile-pic" />
                    <div className="subscriber-detail">
                        <p className="subscriber-name">{subscriber.name}</p>
                        <p className="subscriber-contact">{subscriber.contact}</p>
                    </div>
                </div>
                <EndsIn subscriber={subscriber} />
            </div>
            <div className='subscription-detail-container'>
                <p className='subscription-count'>
                    <span className='subscription-count__label'>No.of Subscriptions : </span>
                    <span>{subscriber.subscriptions.length}</span>
                </p>
            </div>
        </li>
    )
}

function EndsIn({ subscriber }) {
    var { subscriptions } = subscriber;
    subscriptions.sort((a, b) => {
        return new Date(b.end).getTime() - new Date(a.end).getTime();
    });

    var endDate = new Date(subscriptions[0].end);

    var remaining = new Date(subscriptions[0].end).getTime() - Date.now();
    var endsIn = Math.floor(remaining / (1000 * 60 * 60 * 24));

    var bgcolor = endsIn < 0 ? `var(--background-color)` : `var(--primary-color)`;
    var color = endsIn < 0 ? `var(--text-on-background)` : `var(--text-on-primary)`;

    return (
        <div className='validity-container' style={{ backgroundColor: bgcolor, color }}>
            <span className='flex-column flex-align-center flex-justify-center full-height'>
                {
                    endsIn < 0
                        ? <span>Expired</span>
                        : <span>Active</span>
                }
                <span style={{ fontWeight: 'bold' }}>{formatDate(endDate)}</span>
            </span>
        </div>
    )

}

function ListFilter({ subscriber }) {
    var { getState, dispatch } = React.useContext(AppContext);
    var selectedOrg = getSelectedOrg(getState());
    var branches = selectBranchDetails(getState(), selectedOrg);
    branches = [{ name: "-- All --" }, ...branches];
    let [branchName, setBranchName] = React.useState("");
    let statuses = ["-- All --", "Active", "Expired"];
    let [status, setStatus] = React.useState("");


    return (
        <div className='filter-container flex-row flex-align-center'>
            <div className='filters flex-1 flex-row flex-align-center'>
                <TextField
                    value={branchName}
                    onChange={e => setBranchName(e.target.value)}
                    select // tell TextField to render select
                    size='small'
                    label="Branch"
                    className='branch-filter'
                >
                    {
                        branches.map(br => (
                            <MenuItem key={br.name} value={br.name}>
                                {br.name}
                            </MenuItem>
                        ))
                    }

                </TextField>

                <TextField
                    value={status}
                    onChange={e => setStatus(e.target.value)}
                    select // tell TextField to render select
                    size='small'
                    label="Status"
                    className='status-filter'
                >

                    {
                        statuses.map(st => (
                            <MenuItem key={st} value={st}>
                                {st}
                            </MenuItem>
                        ))
                    }

                </TextField>


            </div>
            <div className='sort flex-row'>
                <img src="/images/sort-icon.svg" />
            </div>
        </div>
    )
}

var Styles = styled.div`
    .subscribers-list {
        overflow : scroll;
    }
    
    .subscribers-list-container {
        padding : 16px;
        height : calc(100% - 36px);
    }

    .subscriber-card {
        padding : 8px;
        margin : 8px 0px;
        background: #FFFFFF;
        box-shadow: 0px 2px 15px -10px rgba(0, 0, 0, 0.25);
        border-radius: 5px;
        // height : 82px;
    }

    .sub-profile-pic {
        height : 48px;
        width : 48px;
        border-radius : 5px;
        object-fit : contain;
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

    .validity-container{
        width : 92px;
        height : 48px;
        border-radius : 5px;
        color : var(--text-on-primary);
        font-size : 13px;
    }

    .subscriber-detail-container {
        padding : 8px;
    }

    .subscription-detail-container {
        padding : 8px;
    }

    .subscription-count__label {
        opacity : 0.5;
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

    .filter-container {
        padding : 0px 16px;
    }

    .filter-btn {
        padding : 2px 8px;
        background : white;
        border : 1px solid var(--primary-color);
        border-radius : 3px;
        color : var(--primary-color);
        min-width : 100px;
    }

    .sort {
        background : white;
        border-radius : 3px;
        padding : 5px;
    }

    .branch-filter {
        width : 100px;
        margin-right : 16px;
    }

    .status-filter {
        width : 100px;
    }
`