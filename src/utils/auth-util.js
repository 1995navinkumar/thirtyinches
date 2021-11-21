import { collection, query, where, getDocs, getFirestore } from "firebase/firestore";

export async function getUserDetails(user) {
    const db = getFirestore();
    const q = query(collection(db, "users"), where("uid", "==", user.uid));
    return getDocs(q)
        .then(snapshot => {
            return snapshot.docs[0].data();
        })
        .catch(er => { throw er });
}