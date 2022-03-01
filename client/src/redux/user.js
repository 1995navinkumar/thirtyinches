import { getUserPrivileges, getPersonalisedData, addPersonalisedData } from '../utils/api-util';
import { AuthStateChanged } from '../utils/auth-util';

export function userReducer(state = defaultState, action) {
    if (action.type == "setUser") {
        return {
            ...state,
            ...action.value
        }
    }
    return state;
}

const defaultState = {
    auth: {},
    settled: false,
    privileges: [],
    personalisedData: {}
}

// -------------------------- Actions ----------------------------------

export function userAuthStateAction() {
    return function (dispatch) {
        AuthStateChanged(auth => {
            if (auth) {
                getUserPrivileges().then(({ privileges }) => {
                    dispatch(setUserAction({ auth, privileges, settled: true }));
                })
            } else {
                dispatch(setUserAction({
                    settled: true
                }))
            }
        })
    }
}

export function userPrivilegesAction() {
    return (dispatch) => {
        return getUserPrivileges().then(({ privileges }) => {
            dispatch(setUserAction({ privileges, settled: true }));
        })
    }
}

export function setUserAction(user) {
    return {
        type: "setUser",
        value: user
    }
}

export function userPersonalisationAction() {
    return function (dispatch, getState) {
        return getPersonalisedData().then(data => {
            dispatch(setUserAction({
                ...getState(),
                personalisedData: data
            }))
        })
    }
}

export function setPersonalisationAction(data) {
    return function (dispatch, getState) {
        return addPersonalisedData(data)
            .then(() => dispatch(setUserAction({
                personalisedData: {
                    ...getState().personalisedData,
                    ...data
                }
            })))
    }
}

// ------------------------------- Selectors ---------------------------------

export const selectUser = state => state.user;

export const selectPrivileges = state => state.user.privileges;

export const selectPersonalisedData = state => state.user.personalisedData;

export const getSelectedOrg = state => selectPersonalisedData(state)?.selectedOrg ?? selectPrivileges(state).map(p => p.orgName)?.[0];


