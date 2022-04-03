import LoadingButton from '@mui/lab/LoadingButton';

import React from 'react';
import {
    Routes,
    Route,
    useNavigate,
    useLocation,
    Outlet,
    Navigate
} from "react-router-dom";

import Icon from '../components/icon';

export function AuthRouter({ authFilter, children }) {
    var isAuthorised = authFilter();
    return (
        <React.Fragment>
            {
                isAuthorised
                    ? { children }
                    : <NotAuthorised />
            }
        </React.Fragment>
    )
}


export function NotAuthorised() {
    var navigate = useNavigate();

    return (
        <div className='full-height flex-column flex-align-center flex-justify-center'>
            <Icon href={"#not-authorised"} className="svg-filled" style={{ width: "84px", height: "84px" }} />
            <p style={{ marginTop: "24px", fontSize: "20px", color: "var(--primary-color)" }} >
                You are not authorised to view this page.
            </p>

            <LoadingButton onClick={() => navigate("/")} style={{ marginTop: "64px" }} variant="contained" >Go to Home Page </LoadingButton>

        </div>
    )
}