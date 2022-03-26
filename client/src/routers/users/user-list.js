import React from 'react';
import styled from 'styled-components';
import Footer from '../../components/footer';
import AppHeader from '../../components/header';
import Loader from '../../components/loader';

import Fab from '@mui/material/Fab';
import AddIcon from '@mui/icons-material/Add';

import { useNavigate } from "react-router-dom";


var Styles = styled.div`

`

export default function UserList({ }) {
    var [loading, setLoading] = React.useState(false);
    var navigate = useNavigate();

    return (
        <Styles className="full-height flex-column">
            <AppHeader title={"User Management"} />
            <div className='flex-1 position-relative hide-scroll'>
                {
                    loading
                        ? <Loader />
                        : <React.Fragment>
                            {

                            }
                            <Fab onClick={() => navigate("../add-user")} style={{ position: "absolute", bottom: "12px", right: "12px" }} color="primary" aria-label="add">
                                <AddIcon />
                            </Fab>
                        </React.Fragment>
                }
            </div>
            <Footer selectedRoute='dashboard' />
        </Styles>
    )
}