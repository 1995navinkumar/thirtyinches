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
        <div className='full-height flex-column'>
            <AppHeader title={"Attendance"} />
            <div className='flex-1'>
                {
                    loading
                        ? <Loader />
                        : <React.Fragment>
                            {
                                subscribers.length > 0
                                    ? <UnderConstruction />
                                    : <NoData description="You don't have any Subscribers" />
                            }
                        </React.Fragment>
                }
            </div>
            <Footer selectedRoute='attendance' />
        </div>
    )
}