import React from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { getSelectedOrg } from '../redux/user';
import { AppContext } from '../context';

export default function Attendance() {
    var { getState } = React.useContext(AppContext);
    var selectedOrg = getSelectedOrg(getState());

    var navigate = useNavigate();

    React.useEffect(() => {
        if (!selectedOrg) {
            navigate("/")
        }
    }, [selectedOrg]);

    return (
        <div>
            Attendance
        </div>
    )
}