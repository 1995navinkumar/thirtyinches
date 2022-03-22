import React from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { getSelectedOrg } from '../redux/user';
import { getSubscriptionDetailAction, selectSubscribers } from '../redux/subscribers';
import { AppContext, HomeContext } from '../context';
import AppHeader from '../components/header';
import Footer from '../components/footer';
import NoData from '../components/no-data';
import Loader from '../components/loader';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import LoadingButton from '@mui/lab/LoadingButton';
import { markAttendance } from '../utils/api-util';
import { selectBranchDetails } from '../redux/orgs';
import { MenuItem } from '@mui/material';

var Styles = styled.div`
    .attendance-form {
        padding-top : 164px;
    }

    .subscriber-card {
        padding : 8px;
        margin : 8px 0px;
        background: #FFFFFF;
        box-shadow: 0px 2px 15px -10px rgba(0, 0, 0, 0.25);
        border-radius: 5px;
        // height : 82px;
    }

    .subscriber-detail-container {
        padding : 8px;
    }

    .sub-profile-pic {
        height : 48px;
        width : 48px;
        border-radius : 5px;
        object-fit : contain;
    }

    .subscriber-detail {
        padding-left : 8px;
    }

    .subscriber-name {
        font-weight: bold;
        font-size: 14px;
        line-height: 17px;
        color: #404040;
    }

    .subscriber-contact {
        opacity : 0.6;
        font-size : 12px;
        line-height : 18px;
    }


    .profile-pic {
        height: 48px;
        width: 48px;
        border-radius: 50%;
    }
`

export default function Attendance() {
    var { getState, dispatch } = React.useContext(AppContext);
    var selectedOrg = getSelectedOrg(getState());
    var branchDetails = selectBranchDetails(getState(), selectedOrg);
    var subscribers = selectSubscribers(getState());
    var [loading, setLoading] = React.useState(true);

    subscribers = subscribers.map((sub, idx) => ({ ...sub, idx }));

    var navigate = useNavigate();

    React.useEffect(() => {
        if (!selectedOrg) {
            navigate("/");
        } else {
            dispatch(
                getSubscriptionDetailAction(selectedOrg)
            )
                .then(() => setLoading(false))
        }
    }, [selectedOrg]);

    return (
        <Styles className='full-height flex-column'>
            <AppHeader title={"Attendance"} />
            <div className='flex-1'>
                {
                    loading
                        ? <Loader />
                        : <React.Fragment>
                            {
                                subscribers.length > 0
                                    ? <AttendanceForm subscribers={subscribers} selectedOrg={selectedOrg} branches={branchDetails} />
                                    : <NoData description="You don't have any Subscribers for marking attendance" />
                            }
                        </React.Fragment>
                }
            </div>
            <Footer selectedRoute='attendance' />
        </Styles>
    )
}

function AttendanceForm({ subscribers, selectedOrg, branches }) {
    var { showToastMessage } = React.useContext(HomeContext);
    var [searchValue, setSearchValue] = React.useState("");
    let [disableBtn, setDisableBtn] = React.useState(false);
    let [branchName, setBranchName] = React.useState(branches?.[0]?.name ?? "");

    let onSubmit = () => {
        if (!searchValue || !branchName) { return };
        setDisableBtn(true);
        markAttendance(selectedOrg, branchName, searchValue.contact, new Date())
            .then(() => {
                setSearchValue("");
                setDisableBtn(false);
                showToastMessage({
                    message: "Attendance Marked Successfully"
                })
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

    return (
        <div className='flex-column flex-align-center attendance-form'>
            <TextField
                value={branchName}
                onChange={e => setBranchName(e.target.value)}
                select // tell TextField to render select
                label="Branch Name"
                sx={{ width: 300 }}
            >
                {
                    branches.map(br => (
                        <MenuItem key={br.name} value={br.name}>
                            {br.name}
                        </MenuItem>
                    ))
                }

            </TextField>

            <div style={{ marginBottom: "32px" }}></div>

            <Autocomplete
                value={searchValue}
                onChange={(e, value) => setSearchValue(value)}
                selectOnFocus
                clearOnBlur
                handleHomeEndKeys
                options={subscribers}
                getOptionLabel={option => option ? `${option.name} - ${option.contact}` : option}
                renderOption={
                    (props, option) =>
                        <li {...props} key={option.contact}>
                            <RenderSubscriber subscriber={option} />
                        </li>
                }
                sx={{ width: 300 }}
                freeSolo
                renderInput={(params) => (
                    <TextField {...params} label="Mark Attendance" />
                )}
            />

            <LoadingButton disabled={!searchValue} loading={disableBtn} loadingPosition="end" onClick={onSubmit} style={{ marginTop: "64px", color: "var(--text-on-primary)", width: "150px" }} variant="contained">Submit</LoadingButton>


        </div>
    )
}

function RenderSubscriber({ subscriber }) {
    return (
        <Styles className="flex-align-center flex-row flex-1 subscriber-detail-container">
            <div className='flex-row flex-1 flex-align-center'>
                <img src={`https://i.pravatar.cc/48?img=${subscriber.idx + 1}`} className="sub-profile-pic" />
                <div className="subscriber-detail">
                    <p className="subscriber-name">{subscriber.name}</p>
                    <p className="subscriber-contact">{subscriber.contact}</p>
                </div>
            </div>
        </Styles>
    )
}