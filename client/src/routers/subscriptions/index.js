import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { AppContext } from '../../context';
import SubscribersList from './list';
import AddSubscribers from './add-subscibers';
import { getSelectedOrg } from '../../redux/user';
import {
    Routes,
    Route,
    useNavigate,
    useLocation,
    Navigate
} from "react-router-dom";

var Styles = styled.div`
  
`

export default function Subscriptions() {
    var { getState } = React.useContext(AppContext);
    var selectedOrg = getSelectedOrg(getState());

    var navigate = useNavigate();

    var location = useLocation();
    var pathname = location.pathname;

    React.useEffect(() => {
        if (!selectedOrg) {
            navigate("/")
        }
    }, [selectedOrg]);

    return (
        <Styles className="full-height">
            <Routes>
                <Route path="/" element={<Navigate replace to={pathname + "/list"} />} />
                <Route path="/list" element={<SubscribersList />} />
                <Route path="/add" element={<AddSubscribers />} />
            </Routes>
        </Styles>
    )
}