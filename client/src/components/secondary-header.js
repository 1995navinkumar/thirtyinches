import React from "react";
import styled from 'styled-components';
import { useNavigate } from "react-router-dom";
import Icon from "./icon";

export default function SecondaryHeader({ title }) {
    var navigate = useNavigate();
    return (
        <Styles className="flex-row flex-align-center">
            <Icon onClick={() => navigate(-1)} className="svg-filled icon" href={"#back-button"} />
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
        font-size : 18px;
        padding-left : 20px;
        font-weight : 700;
    }
`