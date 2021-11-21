import React from 'react';
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { getFirestore, collection, addDoc } from "firebase/firestore";

export function SignUp({ setSignUp }) {
    var usernameField = React.useRef();
    var passwordField = React.useRef();
    var orgNameField = React.useRef();
    var mailIdField = React.useRef();


    var createUser = React.useCallback((e) => {
        var [email, username, password, orgName] = [
            mailIdField.current.value,
            usernameField.current.value,
            passwordField.current.value,
            orgNameField.current.value,
        ];
        const auth = getAuth();

        createUserWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                const user = userCredential.user;
                const db = getFirestore();
                addDoc(collection(db, "users"), {
                    orgName,
                    name: username,
                    uid: user.uid
                })
                    .then((docRef) => console.log("Document written with ID: ", docRef.id))
                    .catch(err => console.error("Error adding document: ", err));
            })
            .catch((error) => {
                console.log(error);
                const errorCode = error.code;
                const errorMessage = error.message;
            });
    });

    return (
        <React.Fragment>
            <div className="signin-container">
                <p className="signin-title">
                    Create New Account
                </p>

                <div className="orgname">
                    <input ref={orgNameField} name="orgname" type="text" className="orgname--input" placeholder="Enter your Org Name" />
                </div>

                <div className="username">
                    <input ref={usernameField} name="username" type="text" className="username--input" placeholder="Enter your Name" />
                </div>

                <div className="mailid">
                    <input ref={mailIdField} name="mailid" type="text" className="mailid--input" placeholder="Enter your mail id" />
                </div>

                <div className="password">
                    <input ref={passwordField} name="password" type="password" className="password--input" placeholder="Enter your password" />
                </div>

                <div className="flex-row flex-align-center form-actions">
                    <span onClick={() => setSignUp(false)} className="cursor-pointer">&lt;-- Back</span>
                    <button onClick={createUser} className="create-org-btn signin-btn">Create Org</button>
                </div>
            </div>
        </React.Fragment>
    )
}