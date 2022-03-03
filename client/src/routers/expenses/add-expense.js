import React from 'react';
import styled from 'styled-components';
import { AppContext } from '../../context';
import { useNavigate } from 'react-router';

import SecondaryHeader from '../../components/secondary-header.js';
import { getSelectedOrg } from '../../redux/user';


var Styles = styled.div`
    height : 100%;
    .form-container {
        padding-top : 40px;
    }
`

export default function AddExpense() {
    return (
        <Styles className="flex-column full-height">
            <SecondaryHeader title={"Add Expense"} />
        </Styles>
    )
}