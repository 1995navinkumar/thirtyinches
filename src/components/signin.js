import React from 'react';
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { collection, query, where, getDocs, getFirestore } from "firebase/firestore";


export function SignIn({ setSignUp }) {
    var usernameField = React.useRef();
    var passwordField = React.useRef();
    // var orgNameField = React.useRef();

    var signInUsingEmail = React.useCallback((e) => {
        var [email, password] = [usernameField.current.value, passwordField.current.value];
        const auth = getAuth();
        signInWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                // Signed in 
            })
            .catch((error) => {
                console.log(error);
            });
    });

    return (
        <div className="signin-container">
            <p className="signin-title">
                Sign in to continue
            </p>

            {/* <div className="orgname">
                <input ref={orgNameField} name="orgname" type="text" className="orgname--input" placeholder="Enter your Org Name" />
            </div> */}

            <div className="username">
                <input ref={usernameField} name="username" type="text" className="username--input" placeholder="Enter your mail id" />
            </div>

            <div className="password">
                <input ref={passwordField} name="password" type="password" className="password--input" placeholder="Enter your password" />
            </div>

            <div className="flex-row form-actions">
                <button onClick={signInUsingEmail} className="signin-btn" type="submit">Sign in</button>
                <button onClick={() => setSignUp(true)} className="create-org-btn">Create New Org</button>
            </div>

            {/* <div className="signin-google">Or Sign in using <button onClick={signInUsingGoogle} className="signin-google--btn">Google</button></div> */}


        </div>
    )
}