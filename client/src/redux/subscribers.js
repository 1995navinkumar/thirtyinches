import { addSubscription, getAllSubscribers } from "../utils/api-util";

export function subscriberReducer(state = [], action) {
    if (action.type == "setSubscribers") {
        return [
            ...action.value
        ]
    }
    return state;
}

//  ------------------------- Actions -------------------------------------------


export function addSubscriptionAction(selectedOrg, subscriberDetail, subscriptionDetail) {
    return dispatch => {
        return addSubscription(
            selectedOrg,
            subscriberDetail,
            subscriptionDetail
        )
            .then(() => dispatch(getSubscriptionDetailAction(selectedOrg)))
    }
}

export function getSubscriptionDetailAction(orgName) {
    return dispatch => {
        return getAllSubscribers(orgName)
            .then(data => {
                dispatch({
                    type: "setSubscribers",
                    value: data
                })
            })
    }
}




// ---------------------------- Selectors ----------------------------------------

export const selectSubscribers = state => state.subscribers;