import React from 'react';
import styled from 'styled-components';
import {
    Routes,
    Route,
    useNavigate
} from "react-router-dom";

import InputField from './input-field.js';

import { AppContext } from '../context';

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

    .isolate-bottom {
        margin-bottom : 16px;
    }

    .org-form-container {
        width : 280px;
    }

    .field {
        width : 100%;
    }

`

export default function AddOrg({ }) {
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


    }, []);

    return (
        <React.Fragment>
            <div ref={formRef} className="org-form-container flex-column">
                {/* <input type="text" placeholder="org-name" name="org-name" />
                <input type="text" name="branch-name" placeholder="branch-name" />
                <textarea name="branch-address" placeholder="branch-address" />
                <input type="tel" placeholder="contact number" pattern="[0-9]{10}" />
                <button onClick={orgDetails} className="add-org--btn">Add</button> */}

                <InputField className="isolate-bottom field" label="Org Name" inputProps={{ enterkeyhint: "next", autoComplete: "off", id: "org-name", name: "org-name" }} />
                <InputField className="isolate-bottom field" label="Branch Name" inputProps={{ autoComplete: "off", id: "branch-name", name: "branch-name" }} />
                <InputField className="isolate-bottom field" label="Contact" inputProps={{ autoComplete: "off", type: "tel", pattern: "[0-9]{10}", id: "contact", name: "contact" }} />

            </div>
        </React.Fragment>
    )
}