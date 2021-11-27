import React from 'react';
import styled from 'styled-components';
import { getAuth, signOut } from 'firebase/auth';

var Styles = styled.header`
    height : 44px;
    border-bottom : 1px solid #FFF202;

    .search-container {
        flex : 1;
    }

    .menu-icon {
        width : 32px;
        height : 32px;
    }

    .signout-icon {
        height : 20px;
        width : 20px;
        margin : 0px 8px;
    }
`

export function AppHeader({ setShowMenu }) {

    var signout = React.useCallback((e) => {
        const auth = getAuth();
        signOut(auth).then(() => {
            // Sign-out successful.
        }).catch((error) => {
            // An error happened.
        });
    });

    var menuHandler = React.useCallback((e) => {
        e.stopPropagation();
        e.preventDefault();
        e.nativeEvent.stopImmediatePropagation();
        setShowMenu(menu => !menu);
    })

    return (
        <Styles className="app-header flex-row flex-align-center">
            <img src="images/menu.png" onClick={menuHandler} className="menu-icon" />
            <div className="search-container"></div>
            <img onClick={signout} className="signout-icon" src="images/logout.png" />
        </Styles>
    )
}