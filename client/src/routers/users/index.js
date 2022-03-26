import React from 'react';
import {
    Routes,
    Route,
    useNavigate,
    useLocation,
    Outlet,
    Navigate
} from "react-router-dom";
import styled from 'styled-components';

import { AppContext } from '../../context';
import AddUser from './add-user';
import UserList from './user-list';


var Styles = styled.div`
    
`


export default function Users() {
    return (
        <Styles className='flex-column full-height'>
            <div className='flex-1'>
                <Routes>
                    <Route path="/" element={<Navigate replace to="/users/users-list" />} />
                    <Route path="/users-list" element={<UserList />} />
                    <Route path="/add-user" element={<AddUser />} />
                </Routes>
            </div>
        </Styles>
    )
} 