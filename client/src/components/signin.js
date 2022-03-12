import React from 'react';
import styled from 'styled-components';
import { signInWithGoogle, signInAsDemoUser } from '../utils/auth-util';
import Icon from './icon';

var Styles = styled.div`
    height : 100%;

    .logo-holder {
        width: 52px;
        height: 52px;
        position: relative;
        fill: white;
    }

    .logo-dot {
        width: 28%;
        height: 100%;
        right: 7px;
        bottom: -8px;
        position: absolute;
    }

    .signin-container {
        background-color : var(--primary-color);
        color : var(--text-on-primary);
    }

    .signin-header-container {
        height : 144px;
        padding : 32px;
        color : var(--text-on-primary);
    }
    
    .logo-stacked {
        position : absolute;
    }

    .signin-header--subtitle {
        font-size : 18px;
        padding : 20px;
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
        margin-top : 48px;
        padding : 24px;
        color : var(--text-color);
        font-size : 24px;
        text-align : center;
    }

    .signin-google {
        padding : 24px;
    }

    .signin-google--btn {
        width: 172px;
        background: linear-gradient(90deg, rgba(255, 255, 255, 0.5) 0%, rgba(255, 255, 255, 0.15) 100%);
        height: 44px;
        border : 1px solid var(--text-on-primary);
        border-radius: 44px;
        color : #FFFFFF;
        font-size: 13px;
        font-weight : 600;
        padding : 0px 16px;
    }

    .google-logo {
        margin-right : 8px;
    }

    .live-demo-icon {
         margin-right : 4px;
         border : 1px solid;
         border-radius : 50%;
         height : 16px;
         width : 16px;
    }

    .demo-container {
        border: 1px solid var(--primary-color);
        padding: 6px;
        border-radius: 16px;
        display: flex;
        align-items: center;
        margin-top: 24px;
        font-size : 13px;
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
                        <span className='logo-holder'>
                            <Icon className="full-height full-width" href={"#logo"} />
                            <Icon className="logo-dot" href={"#logo-dot"} />
                        </span>

                        {/* <img src="/images/logo-outline.svg" /> */}
                        {/* <img className='logo-stacked' src="/images/logo-filled.svg" /> */}
                    </div>
                    <div className="flex-row flex-justify-center">
                        <p className="signin-header--subtitle">Gym Management App</p>
                    </div>
                </div>
                <div className="signin-description">
                    <p>Manage Subscriptions, Expenses, Attendance and much more..! </p>
                </div>
                <div className="signin-google flex-column flex-align-center flex-1">

                    <button onClick={signInUsingGoogle} className="signin-google--btn flex-row flex-align-center flex-justify-center">
                        <img src="/images/google-logo.svg" className='google-logo' />
                        <span>Sign in with Google</span>
                    </button>
                    <div className='demo-container'>
                        <button onClick={loginAsDemoUser} className="flex-row flex-align-center flex-justify-center">
                            <span className='flex-row flex-justify-center live-demo-icon'>
                                <img src="/images/live-demo.svg" style={{ objectFit: 'none' }} />
                            </span>
                            <span>Live Demo</span>
                        </button>
                    </div>
                </div>

                {/* <Icon href={"#logo"} /> */}
                {/* <img className="signin-backdrop" src="images/logo.svg"></img> */}

            </div>
        </Styles>
    )
}