import React from 'react';
import styled from 'styled-components';
import { getSelectedOrg } from '../../redux/user';
import { AppContext, HomeContext } from '../../context';
import AppHeader from '../../components/header';
import Footer from '../../components/footer';
import NoData from '../../components/no-data';
import Loader from '../../components/loader';
import { useNavigate } from "react-router-dom";

import Fab from '@mui/material/Fab';
import AddIcon from '@mui/icons-material/Add';

var Styles = styled.div`

`

export default function ExpenseList() {
    var { getState, dispatch } = React.useContext(AppContext);
    var selectedOrg = getSelectedOrg(getState());
    var expense = [];
    var [loading, setLoading] = React.useState(false);
    var navigate = useNavigate();

    React.useEffect(() => {
        if (!selectedOrg) {
            navigate("/");
        }
    }, [selectedOrg]);

    return (
        <Styles className="full-height flex-column">
            <AppHeader title={"Expense"} />
            <div className='flex-1 position-relative'>
                {
                    loading
                        ? <Loader />
                        : <React.Fragment>
                            {
                                expense.length > 0
                                    ? <p></p>
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