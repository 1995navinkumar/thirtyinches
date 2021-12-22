import { getAuth, onAuthStateChanged, signInWithEmailAndPassword, signOut, signInWithRedirect, GoogleAuthProvider } from "firebase/auth";

var isDemo = false;

var demoAccounts = [
    "Uq6uheVxXlNsr217p64xdmE01C72"
]

export function AuthStateChanged(cb) {
    const auth = getAuth();
    onAuthStateChanged(auth, (userObj) => {
        if (userObj && demoAccounts.includes(userObj.uid)) {
            isDemo = true;   
        }
        cb(userObj);
    })
}

export async function signInWithGoogle() {
    const auth = getAuth();
    const provider = new GoogleAuthProvider();
    return signInWithRedirect(auth, provider);
}

export async function logout() {
    const auth = getAuth();
    return signOut(auth);
}

export async function getIdToken() {
    return getAuth().currentUser?.getIdToken();
}

export async function getUserId() {
    return getAuth().currentUser.email;
}


export async function signInAsDemoUser(email, password) {
    const auth = getAuth();
    return signInWithEmailAndPassword(auth, email, password)
        .then(() => {
            isDemo = true;
        });
}

export function isDemoMode() {
    return isDemo;
}

