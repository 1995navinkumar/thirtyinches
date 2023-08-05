import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { userReducer } from './user';
import { orgsReducer } from './orgs';
import { subscriberReducer } from './subscribers';
import { assetReducer } from './asset';
import { expenseReducer } from './expense';

function AppReducer(state = defaultState, action) {
    return {
        ...state,
        user: userReducer(state.user, action),
        orgs: orgsReducer(state.orgs, action),
        subscribers: subscriberReducer(state.subscribers, action),
        assets: assetReducer(state.assets, action),
        expense: expenseReducer(state.expense, action)
    }
}

const defaultState = {
    isDemoMode: false
}

export const AppStore = createStore(AppReducer, applyMiddleware(thunk));

if (import.meta.env.DEV) {
    window.AppStore = AppStore;
}