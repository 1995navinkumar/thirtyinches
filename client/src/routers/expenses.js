import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { getAllExpense } from '../utils/api-util';
import { AppContext, HomeContext } from '../context';

var Styles = styled.div`
    .card-list-container {
        padding : 10px;
        height : calc(100% - 36px);
    }
    
    .card-container {
        overflow : scroll;
    }

    .card {
        padding : 8px;
        margin : 8px 0px;
        background: #FFFFFF;
        box-shadow: 0px 2px 15px -10px rgba(0, 0, 0, 0.25);
        border-radius: 5px;
        height : 82px;
    }

    .add-plus {
        font-size : 30px;
        padding-right : 20px;
    }
`

export default function Expenses() {
    var { selectedOrg } = React.useContext(HomeContext);
    var [expenses, setExpenses] = React.useState([]);

    React.useEffect(() => {
        if (selectedOrg) {
            getAllExpense(selectedOrg).then(setExpenses)
        }
    }, [selectedOrg]);

    return (
        <Styles className="full-height">
            <div className="flex-row">
                <div className="flex-1"></div>
                <Link className="add-plus" to="/subscriptions/add">+</Link>
            </div>
            {
                selectedOrg
                    ? <div className="card-list-container">
                        <ul className="card-container full-height">
                            {
                                expenses.map((exp, idx) => (
                                    <li key={idx} className="card">
                                        {exp.title}
                                    </li>
                                ))
                            }
                        </ul>
                    </div>
                    : null
            }
        </Styles>
    )
}