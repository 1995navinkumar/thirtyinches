import React from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import NoData from './no-data';

var Styles = styled.div`
    position : relative;
    top : 20%;

    .add-org--btn {
        margin-top : 32px;
        width : 202px;
        height : 40px;
        background: var(--primary-color);
        border: 1px solid #FFFFFF;
        box-sizing: border-box;
        border-radius: 50px;
    }

    .add-org--text {
        font-size: 16px;
        line-height: 18px;
        color: #FFFFFF;
    }

    .plus {
        margin : 0px 8px;
    }
`

export default function AddOrganisation() {
    var navigate = useNavigate();
    return (
        <Styles className="flex-column flex-align-center add-branch-container">
            <NoData description='Get started by creating a new organisation' />
            <button onClick={() => navigate("/orgs/add")} className="add-org--btn">
                <img className="plus" src="images/plus.svg" />
                <span className="add-org--text">Add Organisation</span>
            </button>
        </Styles>
    )
}