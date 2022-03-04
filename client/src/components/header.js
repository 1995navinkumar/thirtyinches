import React from 'react';
import styled from 'styled-components';
import { useLocation, useNavigate } from 'react-router-dom';
import { HomeContext } from '../context';

var Styles = styled.header`
    // height : 72px;
    padding : 20px;

    .menu-icon {
        width : 20px;
        height : 21px;
    }

    .header--title {
        font-size : 18px;
        padding-left : 20px;
        font-weight : 700;
    }

    .action-container {
        flex-basis : 64px;
        justify-content : space-around;
    }
`

export default function AppHeader({ title }) {
    var { setShowMenu } = React.useContext(HomeContext);

    var navigate = useNavigate();

    var menuHandler = React.useCallback((e) => {
        e.stopPropagation();
        e.preventDefault();
        e.nativeEvent.stopImmediatePropagation();
        setShowMenu(menu => !menu);
    })

    return (
        <Styles className="app-header flex-row flex-align-center">
            <img src="images/menu.svg" onClick={menuHandler} className="menu-icon" />

            <div className="flex-1 flex-row app-header">
                <h1 className='header--title'>{title}</h1>
            </div>

            <div className='action-container flex-row flex-align-center'>
                <img onClick={() => navigate("/search")} src="/images/search-icon.svg" />
                <img src="/images/notification-icon.svg" />
            </div>
        </Styles>
    )
}