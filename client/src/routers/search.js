import React from "react";
import styled from 'styled-components';
import { AppContext, HomeContext } from '../context';
import { useNavigate } from 'react-router';
import SecondaryHeader from '../components/secondary-header.js';
import { getExpenseAction, selectExpense } from "../redux/expense";
import { getSelectedOrg } from "../redux/user";
import { getAssetsAction, selectAssets } from "../redux/asset";
import { RenderAssetDetail } from "./assets/asset-list";
import { getSubscriptionDetailAction, selectSubscribers } from "../redux/subscribers";

var Styles = styled.div`
    height : 100%;
    .form-container {
        padding-top : 44px;
    }

    .search-box {
        background: var(--primary-light-color);
        height: 34px;
        border-radius: 24px;
        width: 75%;
        padding-left: 12px;
    }


    .list-container {
        padding : 10px;
        // height : 100%;
    }

    .list {
        // overflow : scroll;
        border-radius: 10px;
        padding : 4px 8px;
        height : 100%;
    }

    .card {
        padding : 8px;
        margin : 8px 0px;
        background: #FFFFFF;
        box-shadow: 0px 2px 15px -10px rgba(0, 0, 0, 0.25);
        border-radius: 5px;
    }

    .card td {
        padding : 2px;
    }

    .card tr td:first-child {
        font-weight : bold;
    }

    .result-title {
        position: sticky;
        top: 0;
        background: var(--background-color);
        padding: 8px 16px; 
        font-weight : bold;
    }
`

export default function Search() {
    var { getState, dispatch } = React.useContext(AppContext);
    var selectedOrg = getSelectedOrg(getState());

    var [searchText, setSearchText] = React.useState("");

    var [searchResults, setSearchResults] = React.useState({});

    var performSearch = React.useCallback((value) => {
        var fuseOptions = {
            expenses: { keys: ["title", "description", "amount"] },
            assets: { keys: ["assetName", "description", "price"] },
            subscribers: { keys: ["name", "contact", "address"] }
        }

        var expenseFuse = new Fuse(selectExpense(getState()), fuseOptions.expenses);
        var assetFuse = new Fuse(selectAssets(getState()), fuseOptions.assets);
        var subscribersFuse = new Fuse(selectSubscribers(getState()), fuseOptions.subscribers);

        var expenseResult = expenseFuse.search(value).map(i => i.item);
        var assetResult = assetFuse.search(value).map(i => i.item);
        var subscribersResult = subscribersFuse.search(value).map(i => i.item);


        setSearchResults({
            expenses: expenseResult,
            assets: assetResult,
            subscribers: subscribersResult
        })
    }, []);

    var debouncedFunc = React.useMemo(() => debounceInput(performSearch), []);


    React.useEffect(() => {
        dispatch(getExpenseAction(selectedOrg));
        dispatch(getAssetsAction(selectedOrg));
        dispatch(getSubscriptionDetailAction(selectedOrg));
    }, []);

    return (
        <Styles className="flex-column">
            <SecondaryHeader title={"Search"} />

            <div className="form-container flex-column flex-align-center">
                <input
                    value={searchText}
                    className="search-box"
                    onChange={e => {
                        setSearchText(e.target.value);
                        debouncedFunc(e.target.value);
                    }}
                    placeholder={"Search"}
                />
            </div>

            <div style={{ overflow: "scroll" }} className="flex-1">
                {
                    searchResults?.subscribers?.length > 0
                        ? <div className="list-container">
                            <p className="result-title">Subscribers</p>
                            <ul className="list">
                                {searchResults.subscribers.map(item =>
                                    <li className="card" key={item.contact}>
                                        <RenderSubscriberList subscriber={item} />
                                    </li>
                                )}
                            </ul>
                        </div>
                        : null
                }

                {
                    searchResults?.expenses?.length > 0
                        ? <div className="list-container">
                            <p className="result-title">Expense</p>
                            <ul className="list">
                                {searchResults.expenses.map(expense =>
                                    <li className="card" key={expense.title}>
                                        <RenderExpenseDetail expense={expense} />
                                    </li>
                                )}
                            </ul>
                        </div>
                        : null
                }
                {
                    searchResults?.assets?.length > 0
                        ? <div className="list-container">
                            <p className="result-title">Asset</p>
                            <ul className="list">
                                {searchResults.assets.map(item =>
                                    <li className="card" key={item.assetName}>
                                        <RenderAssetDetail asset={item} />
                                    </li>
                                )}
                            </ul>
                        </div>
                        : null
                }

            </div>

        </Styles>
    )
}

function RenderSubscriberList({ subscriber }) {
    var keys = Object.keys(subscriberLabel).filter(k => k != "orgName");
    return (
        <table>
            <tbody>
                {
                    keys.map(key => (
                        <tr key={key}>
                            <td>{subscriberLabel[key]}</td>
                            <td>:</td>
                            <td>{subscriber[key]}</td>
                        </tr>
                    ))
                }
            </tbody>
        </table>
    )
}

var subscriberLabel = {
    name: "Name",
    address: "Address",
    contact: "Contact"
}


function RenderExpenseDetail({ expense }) {
    var keys = Object.keys(expense).filter(k => k != "orgName");
    return (
        <table>
            <tbody>
                {
                    keys.map(key => (
                        <tr key={key}>
                            <td>{expenseLabelMap[key]}</td>
                            <td>:</td>
                            <td>{expense[key]}</td>
                        </tr>
                    ))
                }
            </tbody>
        </table>
    )
}

var expenseLabelMap = {
    title: "Title",
    description: "Description",
    amount: "Amount",
    billDate: "Bill Date",
    branchName: "Branch Name",
    category: "Category"
}


var debounce = delay => func => {
    var timer;
    return (...args) => {
        clearTimeout(timer);
        timer = setTimeout(func, delay, ...args);
    }
}

var debounceInput = debounce(700);