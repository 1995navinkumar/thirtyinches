import React from 'react';
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import styled from 'styled-components';

var Styles = styled.div`
    height : 100%;

    .signin-header-container {
        height : 144px;
        padding : 24px;
    }

    .signin-header--title {
        font-size : 60px;
        color : #FFF202;
    }

    .signin-header--subtitle {
        color : #4D4900;
    }

    .signin-backdrop {
        width : 232px;
        height : 192px;
        position: absolute;
        left: 39.72%;
        right: -4.17%;
        top: 70%;
        bottom: 0%;
        opacity: 0.8;
    }

    .signin-description {
        padding : 24px;
        color : #4D4900;
        font-size : 24px;
    }

    .signin-google {
        padding : 24px;
    }

    .signin-google--btn {
        width: 100%;
        background: #EE6211;
        height: 44px;
        border-radius: 44px;
        color : #FFFFFF;
        font-size: 20px;
        font-weight: bold
    }

    .google-logo {
        width : 20px;
        height : 20px;
    }
`

const provider = new GoogleAuthProvider();

export function SignIn({ setSignUp }) {
    var signInUsingGoogle = React.useCallback(() => {
        const auth = getAuth();
        signInWithPopup(auth, provider)
            .then((result) => {

            }).catch((error) => {

            });
    })

    return (
        <Styles>
            <div className="signin-container flex-column full-height">
                <div className="signin-header-container">
                    <div className="flex-row flex-justify-center app-header">
                        <span className="oval-1"></span>
                        <h1 className="signin-header--title">30"</h1>
                    </div>
                    <div className="flex-row flex-justify-center">
                        <p className="signin-header--subtitle">Gym Management App</p>
                    </div>
                </div>
                <div className="signin-description">
                    <p>Manage Subscriptions, Expenses, Attendance and much more..! </p>
                </div>
                <div className="signin-google flex-row flex-justify flex-1">

                    <button onClick={signInUsingGoogle} className="signin-google--btn">
                        <span>Continue with Google</span>
                    </button>
                </div>
                <img className="signin-backdrop" src="images/logo.svg"></img>
            </div>
        </Styles>
    )
}