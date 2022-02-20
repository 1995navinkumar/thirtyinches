import React from 'react';
import styled from 'styled-components';
import { addSubscriber } from '../../utils/api-util.js';
import { useNavigate } from 'react-router';
import { HomeContext } from '../../context';

import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';

import AdapterDateFns from '@mui/lab/AdapterMoment';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import DatePicker from '@mui/lab/DatePicker';
import Button from '@mui/material/Button';

import { validate, composeValidators } from '@sknk/object-validator';
import {
    maxDate,
    date,
    regex,
    truthy
} from '@sknk/object-validator/predicates';

var Styles = styled.div`
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
    var { selectedOrg, showToastMessage } = React.useContext(HomeContext);

    var navigate = useNavigate();

    let [name, setName] = React.useState("");
    let [dob, setDob] = React.useState(null);
    let [address, setAddress] = React.useState("");
    let [contact, setContact] = React.useState("");
    let [period, setPeriod] = React.useState(3);
    let [amount, setAmount] = React.useState("");

    let [errors, setErrors] = React.useState({});


    var subDetails = () => {
        var formDetails = {
            name,
            dob,
            address,
            contact,
            period,
            amount
        }

        var formErrors = {}

        var subValidation = composeValidators(
            validate(
                truthy
            )(
                ["name", "dob", "address", "contact", "period", "amount"],
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

        subValidation(formDetails);
        setErrors(formErrors);

        if (Object.keys(formErrors).length == 0) {
            addSubscriber(selectedOrg, "Cyndia", {
                name, address, dob, contact
            })
                .then(res => {
                    showToastMessage({
                        message: "Successfully added subscriber"
                    })
                })
                .catch(err => {
                    alert("Error in adding subscriber");
                })
        }

    }

    return (
        <Styles className="flex-column flex-align-center">
            <Box
                className='flex-column flex-align-center'
                component="form"
                sx={{
                    '& > :not(style)': { m: 1, width: '25ch' },
                }}
                noValidate
                autoComplete="off"
            >
                <TextField error={errors?.name?.length > 0} helperText={errors.name} value={name} onChange={(e) => setName(e.target.value)} id="sname" label="Name" variant="outlined" />

                <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <DatePicker
                        label="D.O.B"
                        value={dob}
                        onChange={(newValue) => {
                            newValue && setDob(newValue.toDate());
                        }}
                        renderInput={(params) => <TextField {...params} error={errors?.dob?.length > 0} helperText={errors.dob} />}
                    />
                </LocalizationProvider>

                <TextField error={errors?.address?.length > 0} helperText={errors.address} value={address} onChange={(e) => setAddress(e.target.value)} id="saddress" label="Address" multiline={true} autoComplete="off" />

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
                />

                <TextField error={errors?.period?.length > 0} helperText={errors.period} value={period} onChange={(e) => setPeriod(e.target.value)} type={"number"} label="No.of Months" />

                <TextField error={errors?.amount?.length > 0} helperText={errors.amount} value={amount} onChange={(e) => setAmount(e.target.value)} inputProps={{ type: "number", pattern: "[0-9]{10}" }} type={"number"} label="Amount Paid" />

                <Button variant="contained" onClick={subDetails}>Add</Button>

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