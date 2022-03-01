import React from 'react';
import styled from 'styled-components';
import {
    useLocation,
    useNavigate
} from "react-router-dom";

import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import LoadingButton from '@mui/lab/LoadingButton';

import { AppContext, HomeContext } from '../context';

import SecondaryHeader from './secondary-header';

import { validate, composeValidator } from '@sknk/object-validator';
import { truthy } from '@sknk/object-validator/predicates';
import { createOrg } from '../utils/api-util';
import Divider from '@mui/material/Divider';
import Chip from '@mui/material/Chip';
import { getSelectedOrg } from '../redux/user';
import { addBranchAction, createOrgAction } from '../redux/orgs';

var Styles = styled.div`
    height : 100%;
    .form-container {
        padding-top : 100px;
    }

`

export default function AddOrg() {
    var { getState, dispatch } = React.useContext(AppContext);

    var selectedOrg = getSelectedOrg(getState());

    return (
        <Styles className='flex-column full-height'>
            <SecondaryHeader title={"Add Branch"} />
            <div className="form-container flex-1 flex-column flex-align-center">
                <OrgForm constOrgName={selectedOrg} />
            </div>
        </Styles>
    )
}

function OrgForm({ constOrgName = "" }) {
    var navigate = useNavigate();

    var { getState, dispatch } = React.useContext(AppContext);

    var { showToastMessage } = React.useContext(HomeContext);

    var isAddBranch = Boolean(constOrgName);

    let [orgName, setOrgName] = React.useState(constOrgName);
    let [branchName, setBranchName] = React.useState("");
    let [address, setAddress] = React.useState("");
    let [contact, setContact] = React.useState("");

    let [errors, setErrors] = React.useState({});

    let [disableBtn, setDisableBtn] = React.useState(false);

    let onSubmit = () => {
        setDisableBtn(true);
        let formErrors = {};

        const orgFormValidator = validate(truthy)(
            ["orgName", "branchName", "address", "contact"],
            (e, { key }) => {
                formErrors[key] = `Field cannot be empty`;
                return false;
            }
        )

        try {
            orgFormValidator({
                orgName,
                branchName,
                address,
                contact
            });
        } catch (e) {
            setDisableBtn(false);
        }

        setErrors(formErrors);

        if (Object.keys(formErrors).length == 0) {

            let branchDetails = { name: branchName, address, contact };

            dispatch(
                isAddBranch
                    ? addBranchAction(orgName, branchDetails)
                    : createOrgAction(orgName, branchDetails)
            )
                .then(res => {
                    showToastMessage({
                        message: isAddBranch ? "Branch added Successfully" : "Org Added Successfully"
                    })
                    navigate("/orgs/list");
                })
                .catch(e => {
                    console.log(e);
                    showToastMessage({
                        message: e.message,
                        severity: "error"
                    })
                    setDisableBtn(false);
                })
        }
    }

    return (
        <Box
            className='flex-column flex-align-center'
            component="form"
            sx={{
                '& > :not(style)': { m: 1, width: '25ch' },
            }}
        >

            <Divider style={{ marginBottom: "12px" }} textAlign='left'>Org Detail</Divider>

            <TextField
                error={errors?.orgName?.length > 0}
                helperText={errors.orgName}
                value={orgName}
                disabled={Boolean(constOrgName)}
                onChange={(e) => setOrgName(e.target.value)}
                label="Organisation Name"
                autoComplete='nope'
            />

            <div style={{ marginBottom: "24px" }}></div>

            <Divider style={{ marginBottom: "12px" }} textAlign='left'>Branch Detail</Divider>

            <TextField
                error={errors?.branchName?.length > 0}
                helperText={errors.branchName}
                value={branchName}
                onChange={(e) => setBranchName(e.target.value)}
                label="Branch Name"
                autoComplete="off"
            />

            <TextField
                value={contact}
                onChange={(e) => {
                    if (e.target.value.length > 10) {
                        return;
                    }
                    setContact(e.target.value);
                }}
                error={errors?.contact?.length > 0}
                helperText={errors.contact}
                type={"number"}
                label="Contact"
                autoComplete='nope'
            />

            <TextField
                error={errors?.address?.length > 0}
                helperText={errors.address}
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                label="Address"
                multiline={true}
                autoComplete="nope"
            />


            <LoadingButton loading={disableBtn} onClick={onSubmit} style={{ marginTop: "64px" }} variant="contained">Add</LoadingButton>

        </Box>
    )
}

