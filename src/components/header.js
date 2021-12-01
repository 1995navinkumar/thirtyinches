import React from 'react';
import styled from 'styled-components';
import { getAuth, signOut } from 'firebase/auth';

var Styles = styled.header`
    height : 72px;

    .menu-icon {
        width : 20px;
        height : 21px;
        margin-left : 20px;
    }

    .header--title {
        font-size : 60px;
        color : #FFF202;
    }
`

export function AppHeader({ setShowMenu, showMenuIcon }) {
    var menuHandler = React.useCallback((e) => {
        e.stopPropagation();
        e.preventDefault();
        e.nativeEvent.stopImmediatePropagation();
        setShowMenu(menu => !menu);
    })

    return (
        <Styles className="app-header flex-row flex-align-center">
            {
                showMenuIcon
                    ? <img src="images/menu.svg" onClick={menuHandler} className="menu-icon" />
                    : null
            }

            <div className="flex-1 flex-row flex-justify-center app-header">
                <span className="oval-1"></span>
                <h1 className="header--title">30"</h1>
            </div>
        </Styles>
    )
}