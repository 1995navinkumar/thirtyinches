import React from 'react';
import styled from 'styled-components';
import { addOrgDetails } from '../utils/db-util.js';
import {
    Routes,
    Route,
    useNavigate
} from "react-router-dom";

import { AppContext } from '../context/AppContext';

var Styles = styled.div`
    height : 100%;
    .add-org--btn {
        width : 144px;
        height : 44px;
        border-radius : 44px;
        background : #EE6211;
        border : 1px solid #FFF202;
        color : #FFFFFF;
    }

    .org-form-container input, .org-form-container textarea {
        margin : 8px 0px;
        min-height : 32px;
        border-radius : 44px;
        padding : 8px;
    }

    .org-form-container textarea {
        min-height : 44px;
        border-radius : 8px;
    }
`

export function AddOrg({ }) {
    var [hideAdd, setHideAdd] = React.useState(true);
    return (
        <Styles>
            <div className="full-height flex-column flex-justify-center flex-align-center">
                {
                    hideAdd
                        ? <OrgForm />
                        : <button onClick={() => setHideAdd(!hideAdd)} className="add-org--btn">Add Org</button>
                }

            </div>
        </Styles>
    )
}

function OrgForm({ }) {
    var navigate = useNavigate();
    var formRef = React.useRef();
    var orgDetails = React.useCallback(() => {
        var formEls = Array.from(formRef.current.children).slice(0, 4);
        var details = formEls.map(f => f.value);
        addOrgDetails(details).then((resultSet) => {
            if (resultSet) {
                navigate("/orgs");
            }
        });
    }, []);

    return (
        <React.Fragment>
            <div ref={formRef} className="org-form-container flex-column">
                <input type="text" placeholder="org-name" name="org-name" />
                <input type="text" name="branch-name" placeholder="branch-name" />
                <textarea name="branch-address" placeholder="branch-address" />
                <input type="tel" placeholder="contact number" pattern="[0-9]{10}" />
                <button onClick={orgDetails} className="add-org--btn">Add</button>
            </div>
        </React.Fragment>
    )
}