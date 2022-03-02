import React from 'react';
import { getAllSubscribers } from '../../utils/api-util.js';
import { AppContext, HomeContext } from '../../context';
import { useNavigate } from "react-router-dom";
import { getSelectedOrg } from '../../redux/user.js';

import styled from 'styled-components';

import Fab from '@mui/material/Fab';
import AddIcon from '@mui/icons-material/Add';

import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import InputLabel from '@mui/material/InputLabel';
import AppHeader from '../../components/header.js';
import Footer from '../../components/footer.js';
import Loader from '../../components/loader.js';
import NoData from '../../components/no-data.js';

export default function SubscribersList() {
    var { getState } = React.useContext(AppContext);
    var selectedOrg = getSelectedOrg(getState());

    var [loading, setLoading] = React.useState(true);

    var [subscriptions, setSubscriptions] = React.useState([]);

    React.useEffect(() => {
        if (selectedOrg) {
            setLoading(true);
            getAllSubscribers(selectedOrg)
                .then(data => {
                    setSubscriptions(data);
                })
                .finally(() => setLoading(false))
        }
    }, [selectedOrg]);



    return (
        <Styles className="full-height flex-column">
            <AppHeader title={"Subscriptions"} />
            <div className='flex-1' style={{ position: "relative" }}>
                {
                    loading
                        ? <Loader />
                        : <SubscriptionContainer subscriptions={subscriptions} />
                }
            </div>
            <Footer />
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
                                    {subscriptions.map(subscriber =>
                                        <Subscriber key={subscriber.contact} subscriber={subscriber} />
                                    )}
                                </ul>
                            </div>
                        </div>
                    )
                    : <NoData description='Add a subscriber'/>
            }
            <Fab onClick={() => navigate("../add")} style={{ position: "absolute", bottom: "12px", right: "12px" }} color="primary" aria-label="add">
                <AddIcon />
            </Fab>
        </React.Fragment>
    )
}

function Subscriber({ subscriber }) {
    return (
        <li className="subscriber-card flex-column" >
            <div className="flex-align-center flex-row flex-1 subscriber-detail-container">
                <div className='flex-row flex-1 flex-align-center'>
                    <img src="images/dummy-profile.png" className="sub-profile-pic" />
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

    return (
        <div className='filter-container flex-row flex-align-center'>
            <div className='filters flex-1 flex-row flex-align-center'>
                <MenuFilter label={"--Branches--"} />
                <MenuFilter label={"--Status--"} />
            </div>
            <div className='sort flex-row'>
                <img src="/images/sort-icon.svg" />
            </div>
        </div>
    )
}

var count = 0;

function MenuFilter({ label }) {
    const [anchorEl, setAnchorEl] = React.useState(null);
    const open = Boolean(anchorEl);
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    var uid = React.useMemo(() => {
        return `input-${++count}`;
    }, [])

    return (
        <div style={{ marginRight: "8px" }}>

            {/* <InputLabel id={uid}>Age</InputLabel>
            <Select
                labelId={uid}
                value={24}
                sx={{ minWidth: 120 }}
                label={"Age"}
                // size={"small"}
            // onChange={handleChange}
            >
                <MenuItem value={10}>Ten</MenuItem>
                <MenuItem value={20}>Twenty</MenuItem>
                <MenuItem value={30}>Thirty</MenuItem>
            </Select> */}

            <button className='filter-btn flex-row flex-align-center flex-justify-center' id={`basic-button-${uid}`} onClick={handleClick}>
                <span style={{ marginRight: "8px" }}>{label}</span>
                <img src="/images/down-arrow.svg" />
            </button>

            <Menu
                id="basic-menu"
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                MenuListProps={{
                    'aria-labelledby': `basic-button-${uid}`,
                }}
            >
                <MenuItem onClick={handleClose}>Profile</MenuItem>
                <MenuItem onClick={handleClose}>My account</MenuItem>
                <MenuItem onClick={handleClose}>Logout</MenuItem>
            </Menu>

        </div >
    )
}

var options = { year: 'numeric', month: 'short', day: 'numeric' };
var formatter = new Intl.DateTimeFormat('en-us', options);

function formatDate(date) {
    return formatter.format(date);
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
        object-fit : none;
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
`