import { addAsset, getAllAssets } from "../utils/api-util";

export function assetReducer(state = [], action) {
    if (action.type == "setAssets") {
        return [
            ...action.value
        ]
    }
    return state;
}

//  ------------------------- Actions -------------------------------------------


export function addAssetAction(selectedOrg, assetDetail) {
    return dispatch => {
        return addAsset(
            selectedOrg,
            assetDetail
        )
            .then(() => dispatch(getAssetsAction(selectedOrg)))
    }
}

export function getAssetsAction(orgName) {
    return dispatch => {
        return getAllAssets(orgName)
            .then(value => {
                dispatch({
                    type: "setAssets",
                    value
                })
            })
    }
}




// ---------------------------- Selectors ----------------------------------------

export const selectAssets = state => state.assets;
