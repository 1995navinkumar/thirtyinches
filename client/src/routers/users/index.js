import React from 'react';
import {
    Routes,
    Route,
    Navigate
} from "react-router-dom";
import styled from 'styled-components';

import { AppContext } from '../../context';
import { getSelectedOrg, isAdmin } from '../../redux/user';
import { NotAuthorised } from '../AuthRouter';
import AddUser from './add-user';
import UserList from './user-list';



var Styles = styled.div`
    
`

export default function Users() {
    var { getState, dispatch } = React.useContext(AppContext);
    var selectedOrg = getSelectedOrg(getState());
    let isAuthorised = isAdmin(getState(), selectedOrg);

    return (
        <Styles className='flex-column full-height'>
            <div className='flex-1'>
                <Routes>
                    <Route path="/" element={<Navigate replace to="/users/users-list" />} />
                    <Route path="/users-list" element={isAuthorised ? <UserList /> : <NotAuthorised />} />
                    <Route path="/add-user" element={isAuthorised ? <AddUser /> : <NotAuthorised />} />
                </Routes>
            </div>
        </Styles>
    )
}
