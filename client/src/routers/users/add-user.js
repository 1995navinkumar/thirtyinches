import LoadingButton from '@mui/lab/LoadingButton';
import { Box, TextField, MenuItem, Checkbox, Select, InputLabel, FormControl } from '@mui/material';
import React from 'react';
import OutlinedInput from '@mui/material/OutlinedInput';

import ListItemText from '@mui/material/ListItemText';
import styled from 'styled-components';
import { useNavigate } from 'react-router';

import SecondaryHeader from '../../components/secondary-header';
import { AppContext, HomeContext } from '../../context';
import { getSelectedOrg } from '../../redux/user';
import { selectBranchDetails } from '../../redux/orgs.js';
import { composeValidators, validate } from '@sknk/object-validator';
import { truthy } from '@sknk/object-validator/predicates';
import { addPrivilege } from '../../utils/api-util';


var Styles = styled.div`
    height : 100%;
    .form-container {
        padding-top : 64px;
    }
`

export default function AddUser({ }) {
    var { getState, dispatch } = React.useContext(AppContext);
    var selectedOrg = getSelectedOrg(getState());
    var { showToastMessage } = React.useContext(HomeContext);
    var branches = selectBranchDetails(getState(), selectedOrg);
    let [branchNames, setBranchNames] = React.useState([]);
    let [userId, setUserId] = React.useState("");
    let [roleName, setRoleName] = React.useState("");

    let [errors, setErrors] = React.useState({});
    let [disableBtn, setDisableBtn] = React.useState(false);


    var navigate = useNavigate();

    let submit = () => {
        var formDetails = {
            orgName: selectedOrg,
            branchNames,
            userId,
            roleName
        }

        let formErrors = {};

        var subValidation = composeValidators(
            validate(
                truthy
            )(
                [...Object.keys(formDetails)],
                (e, { key, value }) => {
                    formErrors[key] = "Field cannot be empty";
                    return false;
                }
            )
        )

        subValidation(formDetails, e => { });
        setErrors(formErrors);

        if (Object.keys(formErrors).length == 0) {
            setDisableBtn(true);
            addPrivilege({
                userId,
                orgName: selectedOrg,
                branches: branchNames,
                roleName
            }).then(res => {
                showToastMessage({
                    message: "User added successfully"
                })
                navigate("../users-list");
            })
                .catch(err => {
                    setDisableBtn(false);
                    showToastMessage({
                        message: err?.message || "Error in adding User",
                        severity: "error"
                    })
                })
        }

    }

    return (
        <Styles className="flex-column full-height">
            <SecondaryHeader title={"Add User"} />
            <FormControl
                className='flex-column flex-align-center form-container flex-1'
                sx={{
                    '& > :not(style)': { m: 1, width: '25ch' },
                }}
                autoComplete="nope"
            >

                <TextField
                    label="User Email"
                    error={errors?.userId?.length > 0}
                    helperText={errors.userId}
                    value={userId}
                    onChange={e => setUserId(e.target.value)}
                    autoComplete="nope"
                />


                <TextField
                    value={roleName}
                    error={errors?.roleName?.length > 0}
                    helperText={errors.roleName}
                    onChange={e => setRoleName(e.target.value)}
                    select
                    label="Role Name"
                >

                    {
                        roleNames.map(role => (
                            <MenuItem key={role} value={role}>
                                {role}
                            </MenuItem>
                        ))
                    }

                </TextField>

                <TextField
                    value={branchNames}
                    onChange={e => {
                        setBranchNames(e.target.value);
                    }}
                    select
                    SelectProps={{
                        multiple: true,
                        renderValue: (selected) => selected.join(', ')
                    }}
                    label="Branches"
                >
                    {
                        branches.map(br => (
                            <MenuItem key={br.name} value={br.name}>
                                <Checkbox checked={branchNames.indexOf(br.name) > -1} />
                                {br.name}
                            </MenuItem>
                        ))
                    }

                </TextField>


                <LoadingButton disabled={disableBtn} onClick={submit} style={{ marginTop: "64px" }} variant="contained">Add</LoadingButton>

            </FormControl>
        </Styles >
    )

}

const roleNames = [
    "OrgModerator",
    "BranchAdmin",
    "Technician"
]