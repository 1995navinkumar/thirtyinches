import React from 'react';
import { AppContext, HomeContext } from '../context';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import IncomeVersusExpense from '../components/bar-chart';
import { getSelectedOrg } from '../redux/user';
import AppHeader from '../components/header';
import Footer from '../components/footer';
import AddOrganisation from '../components/add-organisation';

var Styles = styled.div`
    .card-container {
        padding : 16px;
    }

    .card {
        background : #FFFFFF;
        border-radius : 8px;
        display : flex;
        flex-direction : column;
    }

    .card-title {
        font-weight : bold;
        padding : 8px;
    }

    .card-body {
        width : 100%;
        flex : 1;
    }
`

export default function Dashboard() {
    var { getState } = React.useContext(AppContext);
    var selectedOrg = getSelectedOrg(getState());

    return (
        <Styles className="full-height flex-column">
            <AppHeader title={"Dashboard"} />
            <div className="flex-1">
                {
                    selectedOrg
                        ? <ShowCards />
                        : <AddOrganisation />
                }
            </div>
            <Footer />
        </Styles>
    )
}

function ShowCards() {
    return (
        <div className='full-height full-width'>
            <IncomeVersusExpense />
        </div>
    )
}