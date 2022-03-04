import React from 'react';
import styled from 'styled-components';
import { AppContext, HomeContext } from '../../context';
import { useNavigate } from 'react-router';

import SecondaryHeader from '../../components/secondary-header.js';
import { getSelectedOrg } from '../../redux/user';
import { addExpenseAction, selectExpenseCategories } from '../../redux/expense';
import { selectBranchDetails } from '../../redux/orgs.js';


import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';

import AdapterDateFns from '@mui/lab/AdapterMoment';
import moment from 'moment';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import DatePicker from '@mui/lab/DatePicker';
import LoadingButton from '@mui/lab/LoadingButton';
import { MenuItem } from '@mui/material';
import Autocomplete from '@mui/material/Autocomplete';

import { validate, composeValidators } from '@sknk/object-validator';
import {
    maxDate,
    date,
    regex,
    truthy
} from '@sknk/object-validator/predicates';

var Styles = styled.div`
    height : 100%;
    .form-container {
        padding-top : 64px;
    }
`

export default function AddExpense() {
    var { getState, dispatch } = React.useContext(AppContext);
    var selectedOrg = getSelectedOrg(getState());
    var { showToastMessage } = React.useContext(HomeContext);
    var branches = selectBranchDetails(getState(), selectedOrg);
    var navigate = useNavigate();
    var categories = selectExpenseCategories(getState(), selectedOrg);

    let [expenseName, setExpenseName] = React.useState("");
    let [description, setDescription] = React.useState("");
    let [price, setPrice] = React.useState("");
    let [branchName, setBranchName] = React.useState(branches?.[0]?.name ?? "");
    let [billDate, setBillDate] = React.useState(new Date());
    let [category, setCategory] = React.useState(categories[0]);

    let [errors, setErrors] = React.useState({});
    let [disableBtn, setDisableBtn] = React.useState(false);

    var submit = () => {
        var formDetails = {
            title: expenseName,
            description,
            amount: price,
            branchName,
            billDate,
            category
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

            dispatch(
                addExpenseAction(selectedOrg, formDetails)
            )
                .then(res => {
                    showToastMessage({
                        message: "Expense added successfully"
                    })
                    navigate("../expense-list");
                })
                .catch(err => {
                    setDisableBtn(false);
                    showToastMessage({
                        message: err?.message || "Error in adding Expense",
                        severity: "error"
                    })
                })
        }
    }

    return (
        <Styles className="flex-column full-height">
            <SecondaryHeader title={"Add Expense"} />

            <Box
                className='flex-column flex-align-center form-container flex-1'
                component="form"
                sx={{
                    '& > :not(style)': { m: 1, width: '25ch' },
                }}
                autoComplete="nope"
            >

                <TextField
                    size='small'
                    error={errors?.title?.length > 0}
                    helperText={errors.title}
                    value={expenseName}
                    onChange={(e) => setExpenseName(e.target.value)}
                    label="Title"
                    variant="outlined"
                    autoComplete="nope"
                    autoFocus
                />

                <TextField
                    size='small'
                    error={errors?.description?.length > 0}
                    helperText={errors.description}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    label="Description"
                    variant="outlined"
                    autoComplete="nope"
                />

                <TextField
                    error={errors?.price?.length > 0}
                    helperText={errors.price}
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    type={"number"}
                    id="price"
                    label="Amount"
                    size='small'
                    autoComplete="nope"
                />

                <Autocomplete
                    freeSolo
                    value={category}
                    size='small'
                    onInputChange={(_, value) => setCategory(value)}
                    onChange={(_, value) => { setCategory(value) }}
                    options={categories}
                    renderInput={(params) => <TextField {...params} label="Category" autoComplete="nope" />}
                />


                <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <DatePicker
                        label="Bill Date"
                        value={billDate}
                        maxDate={moment(new Date())}
                        onChange={(newValue) => {
                            newValue && setBillDate(newValue.toDate());
                        }}
                        renderInput={(params) => <TextField {...params} size='small' error={errors?.purchaseDate?.length > 0} helperText={errors.purchaseDate} />}
                    />
                </LocalizationProvider>


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


                <LoadingButton loading={disableBtn} onClick={submit} style={{ marginTop: "64px" }} variant="contained">Add</LoadingButton>


            </Box>

        </Styles>
    )
}