import React from 'react';
import styled from 'styled-components';
import { NavLink, useNavigate } from 'react-router-dom';
import { AppContext } from '../context';
import { addPersonalisedData } from '../utils/api-util.js';
import { logout } from '../utils/auth-util';

var Styles = styled.div`
    width : 300px;
    height : 100%;
    background : #F2F2F2;
    top: 0px;
    box-shadow: 5px 0px 30px #CC4B00;
    position: absolute;
    left: -100%;
    transition : 0.3s ease-out;
    border-top-right-radius: 20px;
    border-bottom-right-radius: 20px;
    z-index : 2;

    .user-profile {
        height : 64px;
        padding : 8px;
        margin : 4px 0px;
        border-bottom : 1px solid #efdbd0;
    }

    .user-detail {
        height : 100%;
    }

    .user-mail {
        font-size : 12px;
        opacity : 0.6;
        padding : 4px;
    }

    .user-name {
        padding : 4px;
    }


    .current-org {
        height : 40px;
        border-top-right-radius: 4px;
        border-bottom-right-radius: 4px;
        margin: 12px 0px;
        width: calc(100% - 20px);
        background: #DF5C11;
    }

    .profile-pic {
        height : 48px;
        width : 48px;
        border-radius : 50%;
    }

    .org-select {
        display : block;
        height: 32px;
        background: none;
        border: none;
        outline : none;
        color : #F2F2F2;
        padding-left : 16px;
    }

    .navigation-drawer {
        
    }

    .menu-actions {
        padding : 16px;
        display : block;
    }

    .routes-icon-container {
        background: #FF7322;
        width : 40px;
    }

    .routes-icon {
        width : 20px;
        height : 20px;
    }

    .navigation-drawer li:hover {
        background : #dedede;
    }

    .active-link .routes-icon-container {
        background : #CB4B01;
    }

    .active-link .menu-actions {
        color : #CB4B01;
    }
`

export default function Menu({ showMenu, setShowMenu }) {
    var menuStyle = showMenu ? { left: 0 } : {};
    var navigate = useNavigate();

    var { orgs, user, setOrgs } = React.useContext(AppContext);

    var selectedOrg = orgs.find(o => o.selected);

    var signout = React.useCallback((e) => {
        logout().then(() => {
            location.hash = "";
            navigate("/");
            // Sign-out successful.
        }).catch((error) => {
            // An error happened.
        });
    });

    var onOrgChange = (e) => {
        var selectedOrg = e.target.value;
        var newOrgs = [...orgs];

        newOrgs.forEach(org => {
            if (org.name == selectedOrg) {
                org.selected = true;
            } else {
                org.selected = false;
            }
        });

        addPersonalisedData(user.email, {
            selectedOrg
        })

        setShowMenu(false);
        setOrgs(newOrgs);
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

            {
                selectedOrg
                    ? (
                        <div className="current-org flex-row flex-align-center">
                            <select value={selectedOrg.name} onChange={onOrgChange} className="org-select">
                                {
                                    orgs.map(org =>
                                        <option value={org.name} key={org.name} > {org.name}</option>
                                    )
                                }
                            </select>
                        </div>
                    )
                    : null
            }

            <div className="navigation-drawer flex-row flex-align-center">
                <ul className="full-width full-height">
                    {
                        routes.map(r =>
                            <li className="flex-row" key={r.href} onClick={() => setShowMenu(false)}>
                                <NavLink to={r.href} className={({ isActive }) => isActive ? "active-link flex-row full-width" : "flex-row full-width"}>
                                    <div className="routes-icon-container flex-row flex-align-center flex-justify-center" >
                                        <img className="routes-icon" src={r.icon} />
                                    </div>
                                    <p className="flex-1 menu-actions">{r.label}</p>
                                </NavLink>
                            </li>
                        )
                    }
                    <li className="flex-row">
                        <div className="routes-icon-container flex-row flex-align-center flex-justify-center" >
                            <img className="routes-icon" src="images/expenses.svg" />
                        </div>
                        <span className="flex-1 menu-actions" onClick={signout}>Logout</span>
                    </li>
                </ul>
            </div>
        </ Styles >
    )
}

var routes = [{
    href: "/dashboard",
    label: "Dashboard",
    icon: "images/dashboard.svg"
}, {
    href: "/orgs",
    label: "Branches",
    icon: "images/orgs.svg"

}, {
    href: "/subscriptions",
    label: "Subscriptions",
    icon: "images/subscriptions.svg"

}, {
    href: "/attendance",
    label: "Attendance",
    icon: "images/attendance.svg"

}, {
    href: "/assets",
    label: "Assets",
    icon: "images/assets.svg"

}, {
    href: "/expenses",
    label: "Expenses",
    icon: "images/expenses.svg"

}, {
    href: "/reports",
    label: "Reports",
    icon: "images/assets.svg"

}, {
    href: "/feedbacks",
    label: "Feedbacks",
    icon: "images/orgs.svg"
}]