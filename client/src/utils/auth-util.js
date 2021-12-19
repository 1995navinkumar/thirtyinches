import { getAuth, onAuthStateChanged, signOut, signInWithRedirect, GoogleAuthProvider } from "firebase/auth";

export async function AuthStateChanged() {
    const auth = getAuth();
    return new Promise((resolve, reject) => {
        onAuthStateChanged(auth, resolve, reject)
    });
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

