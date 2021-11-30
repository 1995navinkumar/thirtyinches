import React from 'react';
import styled from 'styled-components';
import { AppContext } from '../context/AppContext';
import { Link } from 'react-router-dom';

var Styles = styled.div`

`

export function OrgList() {
    var { orgs } = React.useContext(AppContext);
    return (
        <Styles>
            <Link to="/orgs/add"> Add Org </Link>
            <ul className="org-list-container">
                {orgs.map(org =>
                    <li className="org-list" key={org.id}>{org.name}</li>
                )}
            </ul>
        </Styles>
    )
}