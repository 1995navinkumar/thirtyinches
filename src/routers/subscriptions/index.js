import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { AppContext } from '../../context/AppContext';
import { SubscribersList } from './list';
import { AddSubscribers } from './add-subscibers';
import {
    Routes,
    Route,
    useNavigate,
    useLocation,
    Navigate
} from "react-router-dom";

var Styles = styled.div`
  
`

export function Subscriptions() {
    var location = useLocation();
    var pathname = location.pathname;
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