import { collection, query, where, getDocs, addDoc, getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

export async function addOrgDetails(details) {
    var user = getAuth().currentUser;
    const db = getFirestore();

    var [orgName, branchName, branchAddress, contact] = details;

    try {
        const orgDocRef = await addDoc(collection(db, "orgs"), {
            userId: user.uid,
            name: orgName
        });
        const branchDocRef = await addDoc(collection(db, "branches"), {
            orgId: orgDocRef.id,
            name: branchName,
            address: branchAddress,
            contact
        });
    } catch (er) {
        console.log(er);
        return false;
    }

    return true;

}

export async function getOrgDetails() {
    var user = getAuth().currentUser;
    const db = getFirestore();

    const q = query(collection(db, "orgs"), where("userId", "==", user.uid));
    return getDocs(q)
        .then(snapshot => {
            return !snapshot.empty ? snapshot.docs.map(d => d.data()) : {};
        })
        .catch(er => { throw er });
}