import React from 'react';

import { getAuth, onAuthStateChanged } from "firebase/auth";

import Loader from './components/loader';

const SignIn = React.lazy(() => import('./components/signin'));
const Home = React.lazy(() => import('./routers/home'));

import {
    HashRouter
} from "react-router-dom";

import { AppContext } from './context/AppContext';

export default function App() {
    var [user, setUser] = React.useState(null);
    var [orgs, setOrgs] = React.useState([]);
    const auth = getAuth();

    if (orgs.length > 0) {
        var selectedOrg = orgs.find(o => o.selected);

        if (!selectedOrg) {
            orgs[0].selected = true;
        }
    }

    React.useEffect(() => {
        onAuthStateChanged(auth, userObj => {
            if (userObj) {
                import('./utils/db-util.js').then(({ getOrgDetails }) => {
                    getOrgDetails(userObj.email)
                        .then(details => {
                            setOrgs(details);
                            setUser(userObj);
                        })
                        .catch(console.log);
                })

            } else {
                setUser(false);
            }
        });

    }, []);

    return (
        <AppContext.Provider value={{ user, setUser, orgs, setOrgs }}>
            <div className="flex-column full-height">
                <React.Suspense fallback={<div>loading...</div>}>
                    {

                        user == null
                            ? <Loader />
                            : (
                                user == false
                                    ? <SignIn />
                                    : (
                                        <HashRouter>
                                            <Home />
                                        </HashRouter>
                                    )
                            )
                    }
                </React.Suspense>
            </div>
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