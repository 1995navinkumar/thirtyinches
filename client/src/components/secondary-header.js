import React from "react";
import styled from 'styled-components';
import { useNavigate } from "react-router-dom";

export default function SecondaryHeader({ title }) {
    var navigate = useNavigate();
    return (
        <Styles className="flex-row flex-align-center">
            <img onClick={() => navigate(-1)} src="images/back-icon.png" className="back-icon" />
            <div className="flex-1 flex-row app-header">
                <h1 className='header--title'>{title}</h1>
            </div>
        </Styles>
    )
}

var Styles = styled.header`
    padding : 20px;

    .back-icon {
        width : 24px;
        height : 24px;
    }

    .header--title {
        font-size : 16px;
        padding-left : 20px;
        font-weight : 700;
    }
`