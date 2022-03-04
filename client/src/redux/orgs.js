import { createBranch, createOrg, getOrgDetails } from "../utils/api-util";
import { userPrivilegesAction } from './user';

export function orgsReducer(state = [], action) {
    if (action.type == "setOrgDetails") {
        return [
            ...action.value
        ]
    }
    return state;
}


// ------------------------------- Actions ----------------------------------

export function getOrgDetailsAction() {
    return (dispatch, getState) => {
        return getOrgDetails()
            .then(data => {
                dispatch({
                    type: "setOrgDetails",
                    value: data
                })
            })
    }
}

export function createOrgAction(orgName, branchDetails) {
    return (dispatch) => {
        return createOrg(orgName, branchDetails)
            .then(() => dispatch(userPrivilegesAction()))
            .then(() => dispatch(getOrgDetailsAction()))
    }
}

export function addBranchAction(orgName, branchDetails) {
    return dispatch => {
        return createBranch(orgName, branchDetails)
            .then(() => dispatch(userPrivilegesAction()))
            .then(() => dispatch(getOrgDetailsAction()))
    }
}


// ------------------------------ selectors ----------------------------------

export const selectOrgsDetail = state => state.orgs;

export const selectBranchDetails = (state, orgName) => {
    var org = state.orgs.find(o => o.name == orgName);
    return org?.branches ?? [];
}

export const selectOrgDetail = (state, orgName) => state.orgs.find(o => o.name == orgName)