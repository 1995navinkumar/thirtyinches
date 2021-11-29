import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import { getAuth, signOut } from 'firebase/auth';

var Styles = styled.div`
    width : 80%;
    height : 100%;
    background : white;
    top: 0px;
    position: absolute;
    left: -100%;
    transition : 0.3s ease-out;
    padding : 8px;

    .user-profile {
        height : 64px;
        border : 1px solid #dedede;
        border-radius : 8px;
        margin : 4px 0px;
    }

    .user-detail {
        height : 100%;
        padding : 8px;
    }

    .user-mail {
        font-size : 12px;
    }


    .current-org {
        height : 64px;
        border : 1px solid #dedede;
        border-radius : 8px;
        margin : 4px 0px;
    }

    .profile-pic {
        height : 48px;
        width : 48px;
        border-radius : 50%;
    }

    .org-select {
        width: 80%;
        height: 32px;
    }

    .navigation-drawer {
        border : 1px solid #dedede;
        border-radius : 8px;
    }

    .menu-actions {
        padding : 16px;
        display : block;
    }

    .navigation-drawer li:hover {
        background : #dedede;
    }
`

export function Menu({ showMenu, setShowMenu }) {
    var menuStyle = showMenu ? { left: 0 } : {};

    var { orgs, user } = React.useContext(AppContext);

    var signout = React.useCallback((e) => {
        const auth = getAuth();
        signOut(auth).then(() => {
            location.hash = "";
            // Sign-out successful.
        }).catch((error) => {
            // An error happened.
        });
    });

    var handleClick = (e) => {
        setShowMenu(false);
    }

    return (
        <Styles style={menuStyle} className="app-menu flex-column">
            <div className="user-profile flex-row flex-align-center">
                <img src={user.photoURL ? user.photoURL : "images/profile-pic.png"} className="profile-pic" />
                <div className="flex-1 flex-column flex-justify-center user-detail">
                    <p className="user-name">{user.displayName}</p>
                    <p className="user-mail">{user.email}</p>
                </div>
            </div>

            <div className="current-org flex-row flex-align-center flex-justify-center">
                <select className="org-select">
                    {
                        orgs.map(org =>
                            <option key={org.id}>{org.name}</option>
                        )
                    }
                </select>
            </div>

            <div className="navigation-drawer flex-row flex-align-center">
                <ul className="full-width full-height">
                    {
                        routes.map(r =>
                            <li key={r.href} onClick={handleClick}>
                                <Link className="menu-actions" to={r.href}>{r.label}</Link>
                            </li>
                        )
                    }
                    <li>
                        <span className="menu-actions" onClick={signout}>Logout</span>
                    </li>
                </ul>
            </div>
        </ Styles>
    )
}

var routes = [{
    href: "/dashboard",
    label: "Dashboard"
}, {
    href: "/orgs",
    label: "Orgs"
}, {
    href: "/subscriptions",
    label: "Subscriptions"
}, {
    href: "/attendance",
    label: "Attendance"
}, {
    href: "/assets",
    label: "Assets"
}, {
    href: "/expenses",
    label: "Expenses"
}, {
    href: "/reports",
    label: "Reports"
}, {
    href: "/feedbacks",
    label: "Feedbacks"
}]