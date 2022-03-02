import React from 'react';

import Loader from './components/loader';

import SignIn from './components/signin';
import Home from './routers/home';

import { selectUser, userAuthStateAction } from './redux/user';

import { ThemeProvider, createTheme } from '@material-ui/core/styles';


import {
    HashRouter
} from "react-router-dom";

import { AppContext } from './context';

const theme = createTheme({
    palette: {
        primary: {
            main: '#D00737'
        }
    }
});

export default function App({ AppStore }) {
    var { getState } = AppStore;
    var user = selectUser(getState());

    React.useEffect(() => {
        AppStore.dispatch(userAuthStateAction());
    }, []);

    return (
        <AppContext.Provider value={AppStore}>
            <ThemeProvider theme={theme}>
                <div className="flex-column full-height">
                    {
                        user.settled
                            ? (
                                user.auth.uid
                                    ? (
                                        user.privileges
                                            ? <HashRouter>
                                                <Home />
                                            </HashRouter>
                                            : null
                                    )
                                    : <SignIn />
                            )
                            : <Loader />
                    }

                </div>
            </ThemeProvider>
        </AppContext.Provider>
    )
}

/**
 *
    var registerWebAuth = () => {
        const publicKeyCredentialCreationOptions = {
            challenge: Uint8Array.from(
                "navinkumar.c", c => c.charCodeAt(0)),
            rp: {
                name: "localhost",
                id: "localhost",
            },
            user: {
                id: Uint8Array.from(
                    "UZSL85T9AFC", c => c.charCodeAt(0)),
                name: "lee@webauthn.guide",
                displayName: "Lee",
            },
            pubKeyCredParams: [{ alg: -7, type: "public-key" }],
            authenticatorSelection: {
                authenticatorAttachment: "platform",
            },
            timeout: 60000,
            attestation: "direct"
        };

        navigator.credentials.create({
            publicKey: publicKeyCredentialCreationOptions
        }).then(credential => {
            const decodedAttestationObj = CBOR.decode(
                credential.response.attestationObject);
            console.log(decodedAttestationObj);

            const { authData } = decodedAttestationObj;

            // get the length of the credential ID
            const dataView = new DataView(
                new ArrayBuffer(2));
            const idLenBytes = authData.slice(53, 55);
            idLenBytes.forEach(
                (value, index) => dataView.setUint8(
                    index, value));
            const credentialIdLength = dataView.getUint16();

            const credentialId = authData.slice(
                55, 55 + credentialIdLength);

            var credStr = JSON.stringify(Array.from(credentialId));

            console.log(credStr);


            localStorage.setItem("cid", credStr);
        })
    }

    React.useEffect(() => {
        if (!localStorage.getItem("cid")) {
            return;
        }

        var credArr = JSON.parse(localStorage.getItem("cid"));

        var credentialId = new Uint8Array(credArr);

        const publicKeyCredentialRequestOptions = {
            challenge: Uint8Array.from(
                "navin", c => c.charCodeAt(0)),
            allowCredentials: [{
                id: credentialId,
                type: 'public-key',
                authenticatorSelection: {
                    authenticatorAttachment: "platform"
                },
            }],
            timeout: 60000,
        }

        navigator.credentials.get({
            publicKey: publicKeyCredentialRequestOptions
        }).then(assertion => {
            setAuthenticated(assertion);
        }).catch(console.log);
    }, []);
 */