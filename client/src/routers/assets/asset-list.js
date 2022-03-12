import React from 'react';
import styled from 'styled-components';
import { getSelectedOrg } from '../../redux/user';
import { selectAssets, getAssetsAction } from '../../redux/asset';

import { AppContext, HomeContext } from '../../context';
import AppHeader from '../../components/header';
import Footer from '../../components/footer';
import NoData from '../../components/no-data';
import Loader from '../../components/loader';
import { useNavigate } from "react-router-dom";

import Fab from '@mui/material/Fab';
import AddIcon from '@mui/icons-material/Add';

var Styles = styled.div`
    .list-container {
        padding : 10px;
        height : 100%;
    }

    .list {
        overflow : scroll;
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
        padding : 8px;
    }

    .card tr td:first-child {
        font-weight : bold;
    }
`

export default function AssetList() {
    var { getState, dispatch } = React.useContext(AppContext);
    var selectedOrg = getSelectedOrg(getState());

    var assets = selectAssets(getState());

    var [loading, setLoading] = React.useState(true);
    var navigate = useNavigate();

    React.useEffect(() => {
        if (!selectedOrg) {
            navigate("/");
        } else {
            dispatch(getAssetsAction(selectedOrg))
                .then(() => setLoading(false));
        }
    }, [selectedOrg]);

    return (
        <Styles className="full-height flex-column">
            <AppHeader title={"Assets"} />
            <div className='flex-1 position-relative hide-scroll'>
                {
                    loading
                        ? <Loader />
                        : <React.Fragment>
                            {
                                assets.length > 0
                                    ? (
                                        <div className="list-container">
                                            <ul className="list">
                                                {assets.map(asset =>
                                                    <li className="card" key={asset.assetName}>
                                                        <RenderAssetDetail asset={asset} />
                                                    </li>
                                                )}
                                            </ul>
                                        </div>
                                    )
                                    : <NoData description="You don't have any Assets." />
                            }
                            <Fab onClick={() => navigate("../add-asset")} style={{ position: "absolute", bottom: "12px", right: "12px" }} color="primary" aria-label="add">
                                <AddIcon />
                            </Fab>
                        </React.Fragment>
                }
            </div>

            <Footer selectedRoute='assets'/>
        </Styles>
    )
}

export function RenderAssetDetail({ asset }) {
    var keys = Object.keys(asset).filter(k => k != "orgName");
    return (
        <table>
            <tbody>
                {
                    keys.map(key => (
                        <tr key={asset[key]}>
                            <td>{labelMap[key]}</td>
                            <td>:</td>
                            <td>{asset[key]}</td>
                        </tr>
                    ))
                }
            </tbody>
        </table>
    )
}

var labelMap = {
    assetName: "Name",
    description: "Description",
    price: "Price",
    purchaseDate: "Purchase Date",
    quantity: "Quantity",
    branchName: "Branch Name"
}