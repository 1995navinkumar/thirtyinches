import React from 'react';
import styled from 'styled-components';
import { AppContext, HomeContext } from '../../context';
import { useNavigate } from 'react-router';

import SecondaryHeader from '../../components/secondary-header.js';
import { getSelectedOrg } from '../../redux/user';
import { addAssetAction } from '../../redux/asset';

import { selectBranchDetails } from '../../redux/orgs.js';

import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';

import AdapterDateFns from '@mui/lab/AdapterMoment';
import moment from 'moment';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import DatePicker from '@mui/lab/DatePicker';
import Divider from '@mui/material/Divider';
import LoadingButton from '@mui/lab/LoadingButton';
import { MenuItem } from '@mui/material';

import { validate, composeValidators } from '@sknk/object-validator';
import {
    maxDate,
    date,
    regex,
    truthy
} from '@sknk/object-validator/predicates';
import { addAsset } from '../../utils/api-util';


var Styles = styled.div`
    height : 100%;
    .form-container {
        padding-top : 64px;
    }
`

export default function AddAsset() {
    var { getState, dispatch } = React.useContext(AppContext);
    var selectedOrg = getSelectedOrg(getState());
    var { showToastMessage } = React.useContext(HomeContext);
    var branches = selectBranchDetails(getState(), selectedOrg);
    var navigate = useNavigate();

    let [assetName, setAssetName] = React.useState("");
    let [description, setDescription] = React.useState("");
    let [price, setPrice] = React.useState("");
    let [quantity, setQuantity] = React.useState("");
    let [branchName, setBranchName] = React.useState(branches?.[0]?.name ?? "");
    let [purchaseDate, setPurchaseDate] = React.useState(new Date());


    let [errors, setErrors] = React.useState({});
    let [disableBtn, setDisableBtn] = React.useState(false);

    let submitAsset = () => {
        var formDetails = {
            assetName,
            description,
            price,
            quantity,
            branchName,
            purchaseDate
        }

        var formErrors = {};

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
                addAssetAction(selectedOrg, formDetails)
            )
                .then(res => {
                    showToastMessage({
                        message: "Asset added successfully"
                    })
                    navigate("../asset-list");
                })
                .catch(err => {
                    setDisableBtn(false);
                    showToastMessage({
                        message: err?.message || "Error in adding asset",
                        severity: "error"
                    })
                })
        }

    }



    return (
        <Styles className="flex-column full-height">
            <SecondaryHeader title={"Add Asset"} />

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
                    error={errors?.assetName?.length > 0}
                    helperText={errors.assetName}
                    value={assetName}
                    onChange={(e) => setAssetName(e.target.value)}
                    id="assetName"
                    label="Asset name"
                    variant="outlined"
                    autoComplete="nope"
                />

                <TextField
                    size='small'
                    error={errors?.description?.length > 0}
                    helperText={errors.description}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    id="description"
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
                    label="Price per item"
                    size='small'
                    autoComplete="nope"
                />

                <TextField
                    error={errors?.quantity?.length > 0}
                    helperText={errors.quantity}
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    type={"number"}
                    label="Quantity"
                    size='small'
                    autoComplete="nope"
                />

                <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <DatePicker
                        label="Purchase Date"
                        value={purchaseDate}
                        maxDate={moment(new Date())}
                        onChange={(newValue) => {
                            newValue && setPurchaseDate(newValue.toDate());
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

                <LoadingButton loading={disableBtn} onClick={submitAsset} style={{ marginTop: "64px" }} variant="contained">Add</LoadingButton>


            </Box>

        </Styles>
    )
}