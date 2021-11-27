import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';

var Styles = styled.div`
    width : 120px;
    height : 120px;
    background : white;
    top: 2px;
    position: absolute;
    left: -120px;
    transition : 0.3s ease-out;
`

export function Menu({ showMenu }) {

    var menuStyle = showMenu ? { left: 0 } : {}

    return (
        <Styles style={menuStyle}>
            <ul>
                <li>
                    <Link to="/dashboard">Dashboard</Link>
                </li>
                <li>
                    <Link to="/orgs">Orgs</Link>
                </li>
                <li>
                    <Link to="/subscriptions">Subscriptions</Link>
                </li>
                <li>Attendance</li>
            </ul>
        </ Styles>
    )
}