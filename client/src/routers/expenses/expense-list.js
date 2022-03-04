import React from 'react';
import styled from 'styled-components';
import { getSelectedOrg } from '../../redux/user';
import { selectExpense, getExpenseAction } from '../../redux/expense';

import { AppContext, HomeContext } from '../../context';
import AppHeader from '../../components/header';
import Footer from '../../components/footer';
import NoData from '../../components/no-data';
import Loader from '../../components/loader';
import { useNavigate } from "react-router-dom";

import Fab from '@mui/material/Fab';
import AddIcon from '@mui/icons-material/Add';

var Styles = styled.div`
    .list-container {
        padding : 10px;
        height : 100%;
    }

    .list {
        overflow : scroll;
        border-radius: 10px;
        padding : 4px 8px;
        height : 100%;
    }

    .card {
        padding : 8px;
        margin : 8px 0px;
        background: #FFFFFF;
        box-shadow: 0px 2px 15px -10px rgba(0, 0, 0, 0.25);
        border-radius: 5px;
    }

    .card td {
        padding : 8px;
    }

    .card tr td:first-child {
        font-weight : bold;
    }
`

export default function ExpenseList() {
    var { getState, dispatch } = React.useContext(AppContext);
    var selectedOrg = getSelectedOrg(getState());
    var expenses = selectExpense(getState());
    var [loading, setLoading] = React.useState(true);
    var navigate = useNavigate();

    React.useEffect(() => {
        if (!selectedOrg) {
            navigate("/");
        } else {
            dispatch(getExpenseAction(selectedOrg))
                .then(() => setLoading(false))
        }
    }, [selectedOrg]);

    return (
        <Styles className="full-height flex-column">
            <AppHeader title={"Expense"} />
            <div className='flex-1 position-relative hide-scroll'>
                {
                    loading
                        ? <Loader />
                        : <React.Fragment>
                            {
                                expenses.length > 0
                                    ? <div className="list-container">
                                        <ul className="list">
                                            {expenses.map(expense =>
                                                <li className="card" key={expense.title}>
                                                    <RenderExpenseDetail expense={expense} />
                                                </li>
                                            )}
                                        </ul>
                                    </div>
                                    : <NoData description="You don't have any Expenses." />
                            }
                            <Fab onClick={() => navigate("../add-expense")} style={{ position: "absolute", bottom: "12px", right: "12px" }} color="primary" aria-label="add">
                                <AddIcon />
                            </Fab>
                        </React.Fragment>
                }
            </div>

            <Footer />
        </Styles>
    )
}


function RenderExpenseDetail({ expense }) {
    var keys = Object.keys(expense).filter(k => k != "orgName");
    return (
        <table>
            <tbody>
                {
                    keys.map(key => (
                        <tr key={key}>
                            <td>{labelMap[key]}</td>
                            <td>:</td>
                            <td>{expense[key]}</td>
                        </tr>
                    ))
                }
            </tbody>
        </table>
    )
}

var labelMap = {
    title: "Title",
    description: "Description",
    amount: "Amount",
    billDate: "Bill Date",
    branchName: "Branch Name",
    category: "Category"
}