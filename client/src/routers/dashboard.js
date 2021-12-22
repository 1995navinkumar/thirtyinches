import React from 'react';
import { AppContext, HomeContext } from '../context';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import PChart from '../components/pie-chart';
import IncomeVersusExpense from '../components/bar-chart';
import { getCardData } from '../utils/api-util';

var Styles = styled.div`
    .add-branch-container {
        position : relative;
        top : 20%;
    }
    .add-new-branch {
        width : 120px;
        height : 120px;
        margin : 12px 0px;
    }

    .add-org--btn {
        width : 202px;
        height : 40px;
        background: rgba(255, 255, 255, 0.15);
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

    .card {
        padding-left : 8px;
    }

    .card-title {
        color : white;
        font-weight : bold;
    }

    .card-body {
        width : 100%;
        height : calc(100% - 12px);
    }
`

export default function Dashboard() {
    var { selectedOrg } = React.useContext(HomeContext);
    var navigate = useNavigate();
    return (
        <Styles className="full-height">
            <div className="full-height full-width">
                {
                    selectedOrg
                        ? <ShowCards />
                        : <AddOrganisation />
                }
            </div>
        </Styles>
    )
}

function ShowCards() {
    return (
        <div className='full-height full-width'>
            <IncomeVersusExpense/>
        </div>
    )
}

function AddOrganisation() {
    var navigate = useNavigate();
    return (
        <div className="flex-column flex-align-center add-branch-container">
            <img className="add-new-branch" src="images/add-new-branch.svg" />
            <button onClick={() => navigate("/orgs/add")} className="add-org--btn">
                <img className="plus" src="images/plus.svg" />
                <span className="add-org--text">Add Organisation</span>
            </button>
        </div>
    )
}