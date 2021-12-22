import React from 'react';
import styled from 'styled-components';
import { signInWithGoogle, signInAsDemoUser } from '../utils/auth-util';

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

    .demo-container {
        padding-top : 24px;
        color : white;
    }
`


export default function SignIn({ setSignUp }) {
    var signInUsingGoogle = React.useCallback(() => {
        signInWithGoogle()
            .then((result) => {
            }).catch((error) => {
            });
    })

    var loginAsDemoUser = React.useCallback(() => {
        signInAsDemoUser("demo-orgadmin@rocketmail.com", "orgadmin30")
            .then(console.log)
            .catch(console.log)
    }, []);

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
                <div className="signin-google flex-column flex-align-center flex-1">

                    <button onClick={signInUsingGoogle} className="signin-google--btn">
                        <span>Continue with Google</span>
                    </button>
                    <div className='demo-container'>
                        <button onClick={loginAsDemoUser}>Live Demo</button>
                    </div>
                </div>
                <img className="signin-backdrop" src="images/logo.svg"></img>

            </div>
        </Styles>
    )
}