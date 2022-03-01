import React from 'react';
import { AppContext, HomeContext } from '../context';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import PChart from '../components/pie-chart';
import IncomeVersusExpense from '../components/bar-chart';
import { getCardData } from '../utils/api-util';
import { getSelectedOrg } from '../redux/user';
import AppHeader from '../components/header';
import Footer from '../components/footer';

var Styles = styled.div`
    .add-branch-container {
        position : relative;
        top : 20%;
    }
    .add-new-branch {
        width : 164px;
        height : 164px;
        margin : 24px 0px;
    }

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

function AddOrganisation() {
    var navigate = useNavigate();
    return (
        <div className="flex-column flex-align-center add-branch-container">
            <img className="add-new-branch" src="images/no-org.svg" />
            <button onClick={() => navigate("/orgs/add")} className="add-org--btn">
                <img className="plus" src="images/plus.svg" />
                <span className="add-org--text">Add Organisation</span>
            </button>
        </div>
    )
}