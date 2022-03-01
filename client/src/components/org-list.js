import React from 'react';
import styled from 'styled-components';
import { AppContext, HomeContext } from '../context';
import { Link, useNavigate } from 'react-router-dom';
import AppHeader from '../components/header';
import Footer from './footer';
import { getSelectedOrg } from '../redux/user';
import { selectBranchDetails } from '../redux/orgs';
import Fab from '@mui/material/Fab';
import AddIcon from '@mui/icons-material/Add';

var Styles = styled.div`
    .add-branch {
        font-size : 30px;
        padding-right : 20px;
    }

    .branch-list {
        overflow : scroll;
        // background: #F2F2F2;
        // box-shadow: 0px 4px 15px rgba(0, 0, 0, 0.25);
        border-radius: 10px;
        padding : 4px 8px;
    }
    
    .branch-list-container {
        padding : 10px;
        height : 100%;
    }

    .branch-card {
        padding : 8px;
        margin : 8px 0px;
        background: #FFFFFF;
        box-shadow: 0px 2px 15px -10px rgba(0, 0, 0, 0.25);
        border-radius: 5px;
        // height : 108px;
    }

    .branch-card td {
        padding : 8px;
    }

    .branch-card tr td:first-child {
        font-weight : bold;
    }
`

export default function OrgList() {
    var navigate = useNavigate();

    var { getState, dispatch } = React.useContext(AppContext);

    var selectedOrg = getSelectedOrg(getState());

    var branches = selectBranchDetails(getState(), selectedOrg);

    return (
        <Styles className="full-height flex-column">
            <AppHeader title={"Branches"} />
            <div className='flex-1' style={{ position: "relative" }}>
                {
                    branches.length > 0
                        ? (
                            <div className="branch-list-container">
                                <ul className="branch-list">
                                    {branches.map(branch =>
                                        <li className="branch-card" key={branch.name}>
                                            <RenderBranchDetail branch={branch} />
                                        </li>
                                    )}
                                </ul>
                            </div>
                        )
                        : null
                }
                <Fab onClick={() => navigate("../add", { state: { orgName: selectedOrg } })} style={{ position: "absolute", bottom: "12px", right: "12px" }} color="primary" aria-label="add">
                    <AddIcon />
                </Fab>
            </div>

            <Footer />
        </Styles>
    )
}

function RenderBranchDetail({ branch }) {
    var keys = Object.keys(branch);
    return (
        <table>
            <tbody>
                {
                    keys.map(key => (
                        <tr key={key}>
                            <td>{labelMap[key]}</td>
                            <td>:</td>
                            <td>{branch[key]}</td>
                        </tr>
                    ))
                }
            </tbody>
        </table>
    )
}

var labelMap = {
    name: "Branch Name",
    address: "Address",
    contact: "Contact"
}