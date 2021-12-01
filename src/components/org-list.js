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
            {
                orgs.length > 0
                    ? <ul className="org-list-container">
                        {orgs.map(org =>
                            <li className="org-list" key={org.id}>
                                <p>{org.name}</p>

                                <ul className="branch-list-container">
                                    {
                                        org.branches.map((branch,idx) =>
                                            <li key={idx} className="branch-list">
                                                <p>{branch.name}</p>
                                                <p>{branch.address}</p>
                                                <p>{branch.contact}</p>
                                            </li>
                                        )
                                    }
                                </ul>
                            </li>
                        )}
                    </ul>
                    : null
            }
        </Styles>
    )
}