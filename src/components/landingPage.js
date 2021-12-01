import React from 'react';
import { SignIn } from './signin';
import { SignUp } from './signup';

export function LandingPage() {
    var [isSignUp, setSignUp] = React.useState(false);
    return (
        <React.Fragment>
             <SignIn setSignUp={setSignUp} />
        </React.Fragment>
    )
} 