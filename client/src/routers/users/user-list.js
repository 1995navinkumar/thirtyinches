import React from 'react';
import styled from 'styled-components';
import Footer from '../../components/footer';
import AppHeader from '../../components/header';
import Loader from '../../components/loader';

import Fab from '@mui/material/Fab';
import AddIcon from '@mui/icons-material/Add';

import { useNavigate } from "react-router-dom";
import { getAllManagedUsers } from '../../utils/api-util';

import { AppContext, HomeContext } from '../../context';
import { getSelectedOrg, isAdmin } from '../../redux/user';
import NoData from '../../components/no-data';
import AuthRouter from '../AuthRouter';


var Styles = styled.div`
    .list-container {
        padding : 10px;
        height : 100%;
    }

    .list {
        overflow : scroll;
        border-radius: 10px;
        padding : 4px 8px;
        height : 100%;
    }

    .card {
        padding : 8px;
        margin : 8px 0px;
        background: #FFFFFF;
        box-shadow: 0px 2px 15px -10px rgba(0, 0, 0, 0.25);
        border-radius: 5px;
    }

    .card td {
        padding : 8px;
    }

    .card tr td:first-child {
        font-weight : bold;
    }
`

export default function UserList({ }) {
    var [loading, setLoading] = React.useState(false);
    var navigate = useNavigate();

    var { getState, dispatch } = React.useContext(AppContext);
    var selectedOrg = getSelectedOrg(getState());

    var [managedUsers, setManagedUsers] = React.useState([]);

    React.useEffect(() => {
        setLoading(true);
        getAllManagedUsers(selectedOrg)
            .then(res => {
                setManagedUsers(res);
            })
            .catch(error => {
                console.log(error);
            })
            .finally(() => setLoading(false))
    }, [selectedOrg]);

    return (
        <Styles className="full-height flex-column">
            <AppHeader title={"User Management"} />
            <div className='flex-1 position-relative hide-scroll'>
                {
                    loading
                        ? <Loader />
                        : <React.Fragment>
                            {
                                managedUsers.length > 0
                                    ? (
                                        <div className="list-container">
                                            <ul className="list">
                                                {managedUsers.map(managedUser =>
                                                    <li className="card" key={managedUser.userId}>
                                                        <ListUsers managedUser={managedUser} />
                                                    </li>
                                                )}
                                            </ul>
                                        </div>
                                    )
                                    : <NoData description="You don't have any Users." />
                            }
                            <Fab onClick={() => navigate("../add-user")} style={{ position: "absolute", bottom: "12px", right: "12px" }} color="primary" aria-label="add">
                                <AddIcon />
                            </Fab>
                        </React.Fragment>
                }
            </div>
            <Footer selectedRoute='dashboard' />
        </Styles>
    )
}

export function ListUsers({ managedUser }) {
    var keys = Object.keys(managedUser).filter(k => !["_id", "orgName"].includes(k));
    return (
        <table>
            <tbody>
                {
                    keys.map(key => {
                        return key == "branches"
                            ? <tr key={managedUser[key].join(",")}>
                                <td>{labelMap[key]}</td>
                                <td>:</td>
                                <td>{managedUser[key].join(", ")}</td>
                            </tr>
                            : <tr key={managedUser[key]}>
                                <td>{labelMap[key]}</td>
                                <td>:</td>
                                <td>{managedUser[key]}</td>
                            </tr>
                    })
                }
            </tbody>
        </table>
    )
}

var labelMap = {
    branches: "Branches",
    userId: "User ID",
    roleName: "Role Name"
}