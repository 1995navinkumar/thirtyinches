import React from 'react';
import { AppContext } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

var Styles = styled.div`
    .add-branch-container {
        position : relative;
        top : 20%;
    }
    .add-new-branch {
        width : 120px;
        height : 120px;
        margin : 12px 0px;
    }

    .add-org--btn {
        width : 202px;
        height : 40px;
        background: rgba(255, 255, 255, 0.15);
        border: 1px solid #FFFFFF;
        box-sizing: border-box;
        border-radius: 50px;
    }

    .add-org--text {
        font-size: 16px;
        line-height: 18px;
        color: #FFFFFF;
    }

    .plus {
        margin : 0px 8px;
    }
`

export default function Dashboard() {
    var { orgs } = React.useContext(AppContext);
    var navigate = useNavigate();
    var selectedOrg = orgs.find(o => o.selected);
    return (
        <Styles className="full-height">
            <div className="full-height flex-row flex-align-cennter flex-justify-center ">
                {
                    orgs && orgs.length > 0
                        ? selectedOrg.name
                        : (
                            <div className="flex-column flex-align-center add-branch-container">
                                <img className="add-new-branch" src="images/add-new-branch.svg" />
                                <button onClick={() => navigate("/orgs/add")} className="add-org--btn">
                                    <img className="plus" src="images/plus.svg" />
                                    <span className="add-org--text">Add Organisation</span>
                                </button>
                            </div>
                        )
                }
            </div>
        </Styles>
    )
}