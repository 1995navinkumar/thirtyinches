import { addExpense, addNewCategory, getAllExpense } from "../utils/api-util";
import { getOrgDetailsAction, selectOrgDetail } from './orgs';

export function expenseReducer(state = defaultState, action) {
    if (action.type == "setExpense") {
        return {
            ...state,
            expenses: [...action.value]
        }
    }
    if (action.type == "setCategories") {
        return {
            ...state,
            categories: [
                ...action.value
            ]
        }
    }
    return state;
}

var defaultState = {
    expenses: [],
    categories: [
        "Maintenance",
        "Wage",
        "Asset Purchase",
        "Misc"
    ]
}


//  ------------------------- Actions -------------------------------------------



export function addExpenseAction(selectedOrg, expenseDetail) {
    return dispatch => {
        return addExpense(
            selectedOrg,
            expenseDetail
        )
            .then(() => dispatch(getExpenseAction(selectedOrg)))
            .then(() => dispatch(getOrgDetailsAction()))
    }
}

export function addCategoryAction(selectedOrg, categoryName) {
    return dispatch => {
        return addNewCategory(selectedOrg, categoryName)
            .then(value => dispatch(getOrgDetailsAction()))
    }
}

export function getExpenseAction(orgName) {
    return dispatch => {
        return getAllExpense(orgName)
            .then(value => {
                dispatch({
                    type: "setExpense",
                    value
                })
            })
    }
}


// ---------------------------- Selectors ----------------------------------------

export const selectExpense = state => state.expense.expenses;

export const selectExpenseCategories = (state, orgName) => [
    ...state.expense.categories,
    ...selectOrgDetail(state, orgName)?.expenseCategories || []
];