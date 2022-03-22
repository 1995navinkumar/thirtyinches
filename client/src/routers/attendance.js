import React from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { getSelectedOrg } from '../redux/user';
import { getSubscriptionDetailAction, selectSubscribers } from '../redux/subscribers';
import { AppContext } from '../context';
import AppHeader from '../components/header';
import Footer from '../components/footer';
import NoData from '../components/no-data';
import Loader from '../components/loader';
import UnderConstruction from '../components/under-construction';
import TextField from '@mui/material/TextField';
import Stack from '@mui/material/Stack';
import Autocomplete from '@mui/material/Autocomplete';

var Styles = styled.div`
    .attendance-form {
        padding-top : 44px;
    }

    .subscriber-card {
        padding : 8px;
        margin : 8px 0px;
        background: #FFFFFF;
        box-shadow: 0px 2px 15px -10px rgba(0, 0, 0, 0.25);
        border-radius: 5px;
        // height : 82px;
    }

    .subscriber-detail-container {
        padding : 8px;
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
`

export default function Attendance() {
    var { getState, dispatch } = React.useContext(AppContext);
    var selectedOrg = getSelectedOrg(getState());
    var subscribers = selectSubscribers(getState());
    var [loading, setLoading] = React.useState(true);

    var navigate = useNavigate();

    React.useEffect(() => {
        if (!selectedOrg) {
            navigate("/");
        } else {
            dispatch(
                getSubscriptionDetailAction(selectedOrg)
            )
                .then(() => setLoading(false))
        }
    }, [selectedOrg]);

    return (
        <Styles className='full-height flex-column'>
            <AppHeader title={"Attendance"} />
            <div className='flex-1'>
                {
                    loading
                        ? <Loader />
                        : <React.Fragment>
                            {
                                subscribers.length > 0
                                    ? <AttendanceForm subscribers={subscribers} />
                                    : <NoData description="You don't have any Subscribers for marking attendance" />
                            }
                        </React.Fragment>
                }
            </div>
            <Footer selectedRoute='attendance' />
        </Styles>
    )
}

function AttendanceForm({ subscribers }) {
    var [searchValue, setSearchValue] = React.useState("");

    return (
        <div className='flex-column flex-align-center attendance-form'>
            <TextField
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                type="number"
            />

            <ul className='subscriber-list'>
                {
                    subscribers.map((subscriber, idx) =>
                        <li className="subscriber-card flex-column" key={subscriber.contact}>
                            <div className="flex-align-center flex-row flex-1 subscriber-detail-container">
                                <div className='flex-row flex-1 flex-align-center'>
                                    <img src={`https://i.pravatar.cc/48?img=${idx + 1}`} className="sub-profile-pic" />
                                    <div className="subscriber-detail">
                                        <p className="subscriber-name">{subscriber.name}</p>
                                        <p className="subscriber-contact">{subscriber.contact}</p>
                                    </div>
                                </div>
                            </div>
                        </li>
                    )
                }


            </ul>

        </div>
    )
}