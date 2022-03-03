import React from 'react';
import styled from 'styled-components';
import { getSelectedOrg } from '../../redux/user';
import { AppContext } from '../../context';
import {
    Routes,
    Route,
    useNavigate,
    useLocation,
    Navigate
} from "react-router-dom";

import ExpenseList from './expense-list';
import AddExpense from './add-expense';

var Styles = styled.div`

`

export default function Expenses() {
    var { getState, dispatch } = React.useContext(AppContext);
    var selectedOrg = getSelectedOrg(getState());

    var navigate = useNavigate();

    React.useEffect(() => {
        if (!selectedOrg) {
            navigate("/");
        }
    }, [selectedOrg]);

    return (
        <div className="full-height flex-column">
            <Routes>
                <Route path="/" element={<Navigate replace to={"./expense-list"} />} />
                <Route path="/expense-list" element={<ExpenseList />} />
                <Route path="/add-expense" element={<AddExpense />} />
            </Routes>
        </div>
    )
}