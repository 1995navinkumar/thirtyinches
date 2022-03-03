import React from 'react';
import styled from 'styled-components';
import { getSelectedOrg } from '../../redux/user';
import { AppContext } from '../../context';
import {
    Routes,
    Route,
    useNavigate,
    useLocation,
    Navigate
} from "react-router-dom";

import AssetList from './asset-list';
import AddAsset from './add-asset';

var Styles = styled.div`

`

export default function Assets() {
    var { getState, dispatch } = React.useContext(AppContext);
    var selectedOrg = getSelectedOrg(getState());

    var navigate = useNavigate();

    React.useEffect(() => {
        if (!selectedOrg) {
            navigate("/");
        }
    }, [selectedOrg]);

    return (
        <div className="full-height flex-column">
            <Routes>
                <Route path="/" element={<Navigate replace to={"./asset-list"} />} />
                <Route path="/asset-list" element={<AssetList />} />
                <Route path="/add-asset" element={<AddAsset />} />
            </Routes>
        </div>
    )
}