import React from 'react';
import styled from 'styled-components';
import { addSubscription } from '../../utils/api-util.js';
import { useNavigate } from 'react-router';
import { AppContext, HomeContext } from '../../context';

import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';

import AdapterDateFns from '@mui/lab/AdapterMoment';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import DatePicker from '@mui/lab/DatePicker';
import Divider from '@mui/material/Divider';
import LoadingButton from '@mui/lab/LoadingButton';

import { validate, composeValidators } from '@sknk/object-validator';
import {
    maxDate,
    date,
    regex,
    truthy
} from '@sknk/object-validator/predicates';
import SecondaryHeader from '../../components/secondary-header.js';
import { selectBranchDetails } from '../../redux/orgs.js';
import { getSelectedOrg } from '../../redux/user.js';
import { MenuItem } from '@mui/material';
import { addSubscriptionAction } from '../../redux/subscribers.js';

var Styles = styled.div`
    height : 100%;
    .form-container {
        padding-top : 40px;
    }
    .add-subscriber-form input, .add-subscriber-form textarea {
        margin : 8px 0px;
        min-height : 32px;
        border-radius : 44px;
        padding : 8px;
    }

    .add-subscriber--btn {
        width : 144px;
        height : 44px;
        border-radius : 44px;
        background : #EE6211;
        border : 1px solid #FFF202;
        color : #FFFFFF;
    }
`

export default function AddSubscribers() {
    var { getState, dispatch } = React.useContext(AppContext);
    var selectedOrg = getSelectedOrg(getState());
    var { showToastMessage } = React.useContext(HomeContext);
    var branches = selectBranchDetails(getState(), selectedOrg);
    var navigate = useNavigate();

    let [name, setName] = React.useState("");
    let [dob, setDob] = React.useState(null);
    let [address, setAddress] = React.useState("");
    let [contact, setContact] = React.useState("");
    let [period, setPeriod] = React.useState(3);
    let [amount, setAmount] = React.useState("");
    let [branchName, setBranchName] = React.useState(branches?.[0]?.name ?? "");

    let [errors, setErrors] = React.useState({});
    let [disableBtn, setDisableBtn] = React.useState(false);


    var subDetails = () => {
        var formDetails = {
            name,
            dob,
            address,
            contact,
            period,
            amount,
            branchName
        }

        var formErrors = {}

        var subValidation = composeValidators(
            validate(
                truthy
            )(
                ["name", "dob", "address", "contact", "period", "amount", "branchName"],
                (e, { key, value }) => {
                    formErrors[key] = "Field cannot be empty";
                    return false;
                }
            ),
            validate(
                date,
                maxDate(new Date(Date.now() - (10 * 365 * 24 * 60 * 60 * 1000)))
            )(
                ["dob"],
                (error) => {
                    formErrors.dob = "Age must be above 10.";
                    return false;
                }
            ),

            validate(
                regex(/^[a-z ,.'-]+$/i)
            )(
                ["name"],
                () => {
                    formErrors.name = "Enter proper name.";
                    return false;
                }
            )

        )

        subValidation(formDetails, e => { });
        setErrors(formErrors);

        if (Object.keys(formErrors).length == 0) {

            let start = new Date();
            let end = new Date(Date.now() + (period * 30 * 24 * 60 * 60 * 1000));

            setDisableBtn(true);

            dispatch(
                addSubscriptionAction(
                    selectedOrg,
                    { name, address, dob, contact }, //subscriber detail
                    { amount, start, end, branchName } // subscription details
                )
            )
                .then(res => {
                    showToastMessage({
                        message: "Subscriber added successfully"
                    })
                    navigate("../list");
                })
                .catch(err => {
                    console.log(err);
                    showToastMessage({
                        message: err.message,
                        severity: "error"
                    });
                    setDisableBtn(false);
                })
        }

    }

    return (
        <Styles className="flex-column full-height">
            <SecondaryHeader title={"Add Subscription"} />
            <Box
                className='flex-column flex-align-center form-container flex-1'
                component="form"
                sx={{
                    '& > :not(style)': { m: 1, width: '25ch' },
                }}
                autoComplete="nope"
            >

                <Divider style={{ marginBottom: "12px" }} textAlign='left'>Subscriber Detail</Divider>

                <TextField
                    size='small'
                    error={errors?.name?.length > 0}
                    helperText={errors.name}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    id="sname"
                    label="Name"
                    variant="outlined"
                    autoComplete="nope"
                />

                <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <DatePicker
                        label="D.O.B"
                        value={dob}
                        onChange={(newValue) => {
                            newValue && setDob(newValue.toDate());
                        }}
                        renderInput={(params) => <TextField {...params} size='small' error={errors?.dob?.length > 0} helperText={errors.dob} />}
                    />
                </LocalizationProvider>

                <TextField
                    error={errors?.address?.length > 0}
                    helperText={errors.address}
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    id="saddress"
                    label="Address"
                    multiline={true}
                    autoComplete="nope"
                    size='small'
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
                    size='small'
                />

                <div style={{ marginBottom: "24px" }}></div>

                <Divider style={{ marginBottom: "12px" }} textAlign='left'>Subscription Detail</Divider>

                <TextField
                    value={branchName}
                    onChange={e => setBranchName(e.target.value)}
                    select // tell TextField to render select
                    size='small'
                    label="Branch Name"
                >
                    {
                        branches.map(br => (
                            <MenuItem key={br.name} value={br.name}>
                                {br.name}
                            </MenuItem>
                        ))
                    }

                </TextField>

                <TextField
                    error={errors?.period?.length > 0}
                    helperText={errors.period}
                    value={period}
                    onChange={(e) => setPeriod(e.target.value)}
                    type={"number"}
                    label="No.of Months"
                    size='small'
                />

                <TextField
                    error={errors?.amount?.length > 0}
                    helperText={errors.amount}
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    inputProps={{ type: "number", pattern: "[0-9]{10}" }}
                    type={"number"}
                    label="Amount Paid"
                    size='small'
                />


                <LoadingButton loading={disableBtn} onClick={subDetails} style={{ marginTop: "64px" }} variant="contained">Add</LoadingButton>

                {/* <Button variant="contained" onClick={subDetails}>Add</Button> */}

            </Box>

        </Styles>
    )
}

function arrayToObj(arr) {
    return arr.reduce((acc, det) => {
        acc[det.name] = det.value;
        return acc;
    }, {});
}

function getSelectedOrgAndBranch(orgs) {
    return orgs[0].id;
}