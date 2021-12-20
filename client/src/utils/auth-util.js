import { getAuth, onAuthStateChanged, signOut, signInWithRedirect, GoogleAuthProvider } from "firebase/auth";

export function AuthStateChanged(cb) {
    const auth = getAuth();
    onAuthStateChanged(auth, cb)
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

