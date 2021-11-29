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
                    ? <img src="images/menu.png" onClick={menuHandler} className="menu-icon" />
                    : null
            }

            <div className="search-container"></div>
        </Styles>
    )
}