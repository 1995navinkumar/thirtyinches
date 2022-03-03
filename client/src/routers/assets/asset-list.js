import React from 'react';
import styled from 'styled-components';
import { getSelectedOrg } from '../../redux/user';
import { AppContext, HomeContext } from '../../context';
import AppHeader from '../../components/header';
import Footer from '../../components/footer';
import NoData from '../../components/no-data';
import Loader from '../../components/loader';
import { useNavigate } from "react-router-dom";

import Fab from '@mui/material/Fab';
import AddIcon from '@mui/icons-material/Add';

var Styles = styled.div`

`

export default function AssetList() {
    var { getState, dispatch } = React.useContext(AppContext);
    var selectedOrg = getSelectedOrg(getState());
    var assets = [];
    var [loading, setLoading] = React.useState(false);
    var navigate = useNavigate();

    React.useEffect(() => {
        if (!selectedOrg) {
            navigate("/");
        }
    }, [selectedOrg]);

    return (
        <Styles className="full-height flex-column">
            <AppHeader title={"Assets"} />
            <div className='flex-1 position-relative'>
                {
                    loading
                        ? <Loader />
                        : <React.Fragment>
                            {
                                assets.length > 0
                                    ? <p></p>
                                    : <NoData description="You don't have any Assets." />
                            }
                            <Fab onClick={() => navigate("../add-asset")} style={{ position: "absolute", bottom: "12px", right: "12px" }} color="primary" aria-label="add">
                                <AddIcon />
                            </Fab>
                        </React.Fragment>
                }
            </div>

            <Footer />
        </Styles>
    )
}