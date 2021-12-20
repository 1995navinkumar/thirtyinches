import React from 'react';
import styled from 'styled-components';
import { AppContext, HomeContext } from '../context';
import { Link } from 'react-router-dom';
import { getBranchDetails } from '../utils/api-util';

var Styles = styled.div`
    .add-branch {
        font-size : 30px;
        padding-right : 20px;
    }

    .branch-list {
        overflow : scroll;
        background: #F2F2F2;
        box-shadow: 0px 4px 15px rgba(0, 0, 0, 0.25);
        border-radius: 10px;
        padding : 4px 8px;
    }
    
    .branch-list-container {
        padding : 10px;
        height : calc(100% - 36px);
    }

    .branch-card {
        padding : 8px;
        margin : 8px 0px;
        background: #FFFFFF;
        box-shadow: 0px 2px 15px -10px rgba(0, 0, 0, 0.25);
        border-radius: 5px;
        height : 108px;
    }
`

export default function OrgList() {
    var { selectedOrg } = React.useContext(HomeContext);

    var [branches, setBranches] = React.useState([]);

    React.useEffect(() => {
        if (selectedOrg) {
            getBranchDetails(selectedOrg)
                .then(doc => setBranches(doc.branches))
                .catch(console.log)
        }
    }, [selectedOrg]);

    return (
        <Styles className="full-height">
            <div className="flex-row">
                <div className="flex-1"></div>
                <Link className="add-branch" to="/orgs/add">+</Link>
            </div>
            {
                branches.length > 0
                    ? (
                        <div className="branch-list-container">
                            <ul className="branch-list">
                                {branches.map(branch =>
                                    <li className="branch-card" key={branch.name}>
                                        <p>{branch.name}</p>
                                        <p>{branch.address}</p>
                                        <p>{branch.contact}</p>
                                    </li>
                                )}
                            </ul>
                        </div>
                    )
                    : null
            }
        </Styles>
    )
}