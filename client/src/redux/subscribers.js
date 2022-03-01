export function subscriberReducer(state = [], action) {
    if (action == "setSubscribers") {
        return [
            ...action.value
        ]
    }
    return state;
}