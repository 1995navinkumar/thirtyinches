import React from 'react';
import styled from 'styled-components';
import { useLocation } from 'react-router-dom';

var Styles = styled.header`
    // height : 72px;
    padding : 20px;

    .menu-icon {
        width : 20px;
        height : 21px;
    }

    .header--title {
        font-size : 16px;
        padding-left : 20px;
        font-weight : 700;
    }

    .action-container {
        flex-basis : 64px;
        justify-content : space-around;
    }
`

export default function AppHeader({ setShowMenu, showMenuIcon }) {
    var menuHandler = React.useCallback((e) => {
        e.stopPropagation();
        e.preventDefault();
        e.nativeEvent.stopImmediatePropagation();
        setShowMenu(menu => !menu);
    })

    var location = useLocation();

    return (
        <Styles className="app-header flex-row flex-align-center">
            {
                showMenuIcon
                    ? <img src="images/menu.svg" onClick={menuHandler} className="menu-icon" />
                    : null
            }

            <div className="flex-1 flex-row app-header">
                <h1 className='header--title'>{routeMap[location.pathname.split("/")[1]]}</h1>
            </div>

            <div className='action-container flex-row flex-align-center'>
                <img src="/images/search-icon.svg" />
                <img src="/images/notification-icon.svg"/>
            </div>
        </Styles>
    )
}

var routeMap = {
    "dashboard": "Dashboard",
    "subscriptions": "Subscriptions"
}